import { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { fetchReports, deleteReport, fetchReport } from '../api/client';

export function useReports() {
  const { dispatch } = useAppContext();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const reports = await fetchReports();
      dispatch({ type: 'SET_HISTORY', payload: reports });
    } catch (err) {
      console.error('Failed to load history', err);
    }
  };

  const removeReport = async (id: number) => {
    try {
      await deleteReport(id);
      dispatch({ type: 'REMOVE_FROM_HISTORY', payload: id });
    } catch (err) {
      console.error('Failed to delete report', err);
    }
  };

  const loadReport = async (id: number) => {
    try {
      const report = await fetchReport(id);
      dispatch({ type: 'VIEW_REPORT', payload: report });
    } catch (err) {
      console.error('Failed to load report', err);
    }
  };

  return { loadHistory, removeReport, loadReport };
}
