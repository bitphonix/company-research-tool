import { useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
import { useAppContext } from '../context/AppContext';
import { fetchReport, fetchReports } from '../api/client';
import type { ReportSections } from '../types';

const SECTION_TRANSITION_DELAY_MS = 700;
type SectionReveal = {
  section: keyof ReportSections;
  content: ReportSections[keyof ReportSections];
};

type StreamPayload = {
  message?: string;
  section?: keyof ReportSections;
  content?: ReportSections[keyof ReportSections];
  report_id?: number;
};

export function useSSE() {
  const { state, dispatch } = useAppContext();
  const eventSourceRef = useRef<EventSource | null>(null);
  const activeCompanyRef = useRef<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const streamRunRef = useRef(0);
  const sectionQueueRef = useRef<SectionReveal[]>([]);
  const sectionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const queueDrainResolversRef = useRef<Array<() => void>>([]);

  const resolveQueueDrain = () => {
    const resolvers = queueDrainResolversRef.current;
    queueDrainResolversRef.current = [];
    resolvers.forEach((resolve) => resolve());
  };

  const revealNextQueuedSection = () => {
    const nextSection = sectionQueueRef.current.shift();

    if (!nextSection) {
      resolveQueueDrain();
      return;
    }

    flushSync(() => {
      dispatch({
        type: 'SECTION_RECEIVED',
        payload: nextSection,
      });
    });

    sectionTimerRef.current = setTimeout(() => {
      sectionTimerRef.current = null;

      if (sectionQueueRef.current.length > 0) {
        revealNextQueuedSection();
      } else {
        resolveQueueDrain();
      }
    }, SECTION_TRANSITION_DELAY_MS);
  };

  const enqueueSectionReveal = (section: keyof ReportSections, content: ReportSections[keyof ReportSections]) => {
    sectionQueueRef.current.push({ section, content });

    if (!sectionTimerRef.current) {
      revealNextQueuedSection();
    }
  };

  const waitForSectionQueueToDrain = () => {
    if (sectionQueueRef.current.length === 0 && !sectionTimerRef.current) {
      return Promise.resolve();
    }

    return new Promise<void>((resolve) => {
      queueDrainResolversRef.current.push(resolve);
    });
  };

  const clearSectionQueue = () => {
    sectionQueueRef.current = [];

    if (sectionTimerRef.current) {
      clearTimeout(sectionTimerRef.current);
      sectionTimerRef.current = null;
    }

    resolveQueueDrain();
  };

  const cleanup = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    clearSectionQueue();
  };

  useEffect(() => {
    return cleanup;
  }, []);

  const cancelResearch = () => {
    streamRunRef.current += 1;
    clearSectionQueue();

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    activeCompanyRef.current = null;
    dispatch({ type: 'RESET' });
  };

  const startResearch = async (companyName: string) => {
    const normalizedName = companyName.trim().toLowerCase();

    // FIX 1: check only the ref, not state (state is async, ref is sync)
    if (activeCompanyRef.current === normalizedName) {
      return;
    }

    // DB-level guard: If the report exists in the database (loaded in history), 
    // load it instead of regenerating.
    const existing = state.history.find(
      (r) => r.company_name.trim().toLowerCase() === normalizedName,
    );
    if (existing) {
      const fullReport = await fetchReport(existing.id);
      dispatch({ type: 'VIEW_REPORT', payload: fullReport });
      return;
    }

    activeCompanyRef.current = normalizedName;
    const runId = streamRunRef.current + 1;
    streamRunRef.current = runId;
    cleanup();
    dispatch({ type: 'START_RESEARCH' });
    dispatch({ type: 'SET_STATUS', payload: 'Connecting...' });

    try {
      abortControllerRef.current = new AbortController();
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company_name: companyName }),
        signal: abortControllerRef.current.signal,
      });

      if (!res.ok) {
        if (streamRunRef.current !== runId) return;

        let msg = 'Failed to start research';
        try {
          const body = await res.json();
          msg = body.detail || msg;
        } catch {
          // ignore
        }
        dispatch({ type: 'RESEARCH_ERROR', payload: msg });
        activeCompanyRef.current = null;
        return;
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response body');
      }

      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (streamRunRef.current !== runId) return;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');

        buffer = lines.pop() || '';

        for (const block of lines) {
          if (!block.trim()) continue;

          let eventType = 'message';
          let data = '';

          for (const line of block.split('\n')) {
            if (line.startsWith('event: ')) {
              eventType = line.substring(7).trim();
            } else if (line.startsWith('data: ')) {
              data += line.substring(6);
            }
          }

          if (!data) continue;

          let parsedData: StreamPayload;
          try {
            parsedData = JSON.parse(data);
          } catch {
            continue;
          }

          if (eventType === 'status') {
            dispatch({ type: 'SET_STATUS', payload: parsedData.message ?? '' });
          } else if (eventType === 'section' && parsedData.section) {
            enqueueSectionReveal(parsedData.section, parsedData.content ?? null);
          } else if (eventType === 'done') {
            abortControllerRef.current = null;
            const reportId = parsedData.report_id;
            if (!reportId) {
              throw new Error('Research completed without a report id');
            }
            await waitForSectionQueueToDrain();
            if (streamRunRef.current !== runId) return;

            const fullReport = await fetchReport(reportId);
            dispatch({ type: 'RESEARCH_DONE', payload: fullReport });
            const history = await fetchReports();
            dispatch({ type: 'SET_HISTORY', payload: history });
          } else if (eventType === 'error') {
            if (streamRunRef.current !== runId) return;

            abortControllerRef.current = null;
            dispatch({ type: 'RESEARCH_ERROR', payload: parsedData.message ?? 'Research failed' });
          }
        }
      }
    } catch (err) {
      if (streamRunRef.current !== runId) return;

      if (err instanceof Error && err.name === 'AbortError') {
        dispatch({ type: 'RESET' });
      } else {
        const message = err instanceof Error ? err.message : 'Network error';
        dispatch({ type: 'RESEARCH_ERROR', payload: message });
      }
    }
  };

  return { startResearch, cancelResearch };
}
