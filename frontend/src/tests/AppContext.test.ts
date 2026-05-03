import { describe, it, expect } from 'vitest';
import { appReducer, initialState } from '../context/AppContext';
import type { ReportDetail, ReportSummary } from '../types';

describe('AppContext Reducer', () => {
  it('START_RESEARCH sets status to streaming, clears error and sections', () => {
    const state = {
      ...initialState,
      status: 'error' as const,
      error: 'some error',
      streamingSections: { overview: 'test' },
      statusMessage: 'failed',
    };

    const newState = appReducer(state, { type: 'START_RESEARCH' });

    expect(newState.status).toBe('streaming');
    expect(newState.error).toBeNull();
    expect(newState.streamingSections).toEqual({});
    expect(newState.statusMessage).toBe('');
    expect(newState.currentReport).toBeNull();
  });

  it('SECTION_RECEIVED adds section to streamingSections', () => {
    const newState = appReducer(initialState, {
      type: 'SECTION_RECEIVED',
      payload: { section: 'overview', content: 'test content' },
    });

    expect(newState.streamingSections.overview).toBe('test content');
  });

  it('RESEARCH_ERROR sets status to error with message', () => {
    const newState = appReducer(initialState, {
      type: 'RESEARCH_ERROR',
      payload: 'Network Error',
    });

    expect(newState.status).toBe('error');
    expect(newState.error).toBe('Network Error');
    expect(newState.statusMessage).toBe('');
  });

  it('RESEARCH_DONE sets status to complete with report', () => {
    const mockReport: ReportDetail = {
      id: 1,
      company_name: 'Test',
      created_at: '2026-01-01T00:00:00Z',
      sections: {
        overview: 'Done',
        key_people: [],
        news: [],
        financials: { revenue: null, employee_count: null, market_cap: null, yoy_growth: null },
        risks: [],
      },
    };

    const newState = appReducer(initialState, {
      type: 'RESEARCH_DONE',
      payload: mockReport,
    });

    expect(newState.status).toBe('complete');
    expect(newState.currentReport).toEqual(mockReport);
    expect(newState.streamingSections).toEqual({});
    expect(newState.statusMessage).toBe('');
  });

  it('REMOVE_FROM_HISTORY removes correct report from history', () => {
    const state = {
      ...initialState,
      history: [
        { id: 1, company_name: 'Company A', created_at: '' },
        { id: 2, company_name: 'Company B', created_at: '' },
      ],
    };

    const newState = appReducer(state, {
      type: 'REMOVE_FROM_HISTORY',
      payload: 1,
    });

    expect(newState.history).toHaveLength(1);
    expect(newState.history[0].id).toBe(2);
  });

  it('REMOVE_FROM_HISTORY sets status to idle if current report is deleted', () => {
    const mockReport: ReportSummary = { id: 1, company_name: 'Company A', created_at: '' };
    const state = {
      ...initialState,
      status: 'complete' as const,
      currentReport: { ...mockReport, sections: { overview: '', key_people: [], news: [], financials: { revenue: null, employee_count: null, market_cap: null, yoy_growth: null }, risks: [] } },
      history: [mockReport],
    };

    const newState = appReducer(state, {
      type: 'REMOVE_FROM_HISTORY',
      payload: 1,
    });

    expect(newState.status).toBe('idle');
    expect(newState.currentReport).toBeNull();
    expect(newState.history).toHaveLength(0);
  });

  it('SET_STATUS updates statusMessage', () => {
    const newState = appReducer(initialState, {
      type: 'SET_STATUS',
      payload: 'Loading...',
    });

    expect(newState.statusMessage).toBe('Loading...');
  });

  it('RESET returns to idle state', () => {
    const state = {
      ...initialState,
      status: 'streaming' as const,
      streamingSections: { overview: 'part' },
      statusMessage: 'Processing',
      error: 'ignore',
    };

    const newState = appReducer(state, { type: 'RESET' });

    expect(newState.status).toBe('idle');
    expect(newState.currentReport).toBeNull();
    expect(newState.streamingSections).toEqual({});
    expect(newState.error).toBeNull();
    expect(newState.statusMessage).toBe('');
  });
});
