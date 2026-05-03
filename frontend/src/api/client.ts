import type { ReportDetail, ReportSummary } from '../types';
class APIError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'APIError';
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = await res.json();
      if (body.detail) message = body.detail;
    } catch {
      // ignore JSON parse error
    }
    throw new APIError(res.status, message);
  }
  return res.json();
}

export async function fetchReports(): Promise<ReportSummary[]> {
  const res = await fetch('/api/reports');
  return handleResponse<ReportSummary[]>(res);
}

export async function fetchReport(id: number): Promise<ReportDetail> {
  const res = await fetch(`/api/reports/${id}`);
  return handleResponse<ReportDetail>(res);
}

export async function deleteReport(id: number): Promise<void> {
  const res = await fetch(`/api/reports/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    throw new APIError(res.status, 'Failed to delete report');
  }
}
