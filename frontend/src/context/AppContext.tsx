import React, { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { AppState, ReportDetail, ReportSections, ReportSummary } from '../types';

type Action =
  | { type: 'START_RESEARCH' }
  | { type: 'SECTION_RECEIVED'; payload: { section: keyof ReportSections; content: any } }
  | { type: 'RESEARCH_ERROR'; payload: string }
  | { type: 'RESEARCH_DONE'; payload: ReportDetail }
  | { type: 'VIEW_REPORT'; payload: ReportDetail }
  | { type: 'SET_HISTORY'; payload: ReportSummary[] }
  | { type: 'REMOVE_FROM_HISTORY'; payload: number }
  | { type: 'SET_STATUS'; payload: string }
  | { type: 'CLEAR_STATUS' }
  | { type: 'RESET' };

const initialState: AppState = {
  status: 'idle',
  currentReport: null,
  streamingSections: {},
  history: [],
  error: null,
  statusMessage: '',
};

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'START_RESEARCH':
      return { ...state, status: 'streaming', currentReport: null, streamingSections: {}, error: null, statusMessage: '' };
    case 'SECTION_RECEIVED':
      return {
        ...state,
        streamingSections: {
          ...state.streamingSections,
          [action.payload.section]: action.payload.content,
        },
      };
    case 'RESEARCH_ERROR':
      return { ...state, status: 'error', error: action.payload, statusMessage: '' };
    case 'RESEARCH_DONE':
      return { ...state, status: 'complete', currentReport: action.payload, streamingSections: {}, statusMessage: '' };
    case 'VIEW_REPORT':
      return { ...state, status: 'complete', currentReport: action.payload, streamingSections: {}, error: null, statusMessage: '' };
    case 'SET_HISTORY':
      return { ...state, history: action.payload };
    case 'REMOVE_FROM_HISTORY':
      return {
        ...state,
        history: state.history.filter((r) => r.id !== action.payload),
        currentReport: state.currentReport?.id === action.payload ? null : state.currentReport,
        status: state.currentReport?.id === action.payload ? 'idle' : state.status,
      };
    case 'SET_STATUS':
      return { ...state, statusMessage: action.payload };
    case 'CLEAR_STATUS':
      return { ...state, statusMessage: '' };
    case 'RESET':
      return { ...state, status: 'idle', currentReport: null, streamingSections: {}, error: null, statusMessage: '' };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
}
