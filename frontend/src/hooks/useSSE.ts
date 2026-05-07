import { useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { fetchReport, fetchReports } from '../api/client';

export function useSSE() {
  const { dispatch } = useAppContext();
  const eventSourceRef = useRef<EventSource | null>(null);
  const activeCompanyRef = useRef<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const cleanup = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  useEffect(() => {
    return cleanup;
  }, []);

  const cancelResearch = () => {
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

    activeCompanyRef.current = normalizedName;
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

          let parsedData;
          try {
            parsedData = JSON.parse(data);
          } catch {
            continue;
          }

          if (eventType === 'status') {
            dispatch({ type: 'SET_STATUS', payload: parsedData.message });
          } else if (eventType === 'section') {
            dispatch({
              type: 'SECTION_RECEIVED',
              payload: { section: parsedData.section, content: parsedData.content },
            });
          } else if (eventType === 'done') {
            abortControllerRef.current = null;
            const reportId = parsedData.report_id;
            const fullReport = await fetchReport(reportId);
            dispatch({ type: 'RESEARCH_DONE', payload: fullReport });
            const history = await fetchReports();
            dispatch({ type: 'SET_HISTORY', payload: history });
          } else if (eventType === 'error') {
            abortControllerRef.current = null;
            dispatch({ type: 'RESEARCH_ERROR', payload: parsedData.message });
          }
        }
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        dispatch({ type: 'RESET' });
      } else {
        dispatch({ type: 'RESEARCH_ERROR', payload: err.message || 'Network error' });
      }
    }
  };

  return { startResearch, cancelResearch };
}