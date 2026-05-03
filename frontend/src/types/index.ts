export interface Person {
  name: string;
  title: string;
}

export interface Financials {
  revenue: string | null;
  employee_count: string | null;
  market_cap: string | null;
  yoy_growth: string | null;
}

export interface ReportSections {
  overview: string | null;
  key_people: Person[] | null;
  news: string[] | null;
  financials: Financials | null;
  risks: string[] | null;
}

export interface ReportSummary {
  id: number;
  company_name: string;
  created_at: string;
}

export interface ReportDetail extends ReportSummary {
  sections: ReportSections;
}

export type AppState = {
  status: 'idle' | 'streaming' | 'complete' | 'error';
  currentReport: ReportDetail | null;
  streamingSections: Partial<ReportSections>;
  history: ReportSummary[];
  error: string | null;
  statusMessage: string;
};
