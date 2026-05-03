import { useAppContext } from '../context/AppContext';
import { useReports } from '../hooks/useReports';
import { formatRelativeTime } from '../utils/time';

export function ReportHistory() {
  const { state } = useAppContext();
  const { loadReport, removeReport } = useReports();

  if (state.history.length === 0) {
    return (
      <div className="p-4 text-sm text-gray-500 italic">
        No reports yet. Search for a company to begin.
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <ul className="divide-y divide-gray-100">
        {state.history.map((report) => {
          const isSelected = state.currentReport?.id === report.id;
          
          return (
            <li 
              key={report.id} 
              className={`p-3 cursor-pointer hover:bg-gray-50 flex justify-between items-center group transition-colors ${isSelected ? 'bg-primary-50 border-l-4 border-primary-500' : 'border-l-4 border-transparent'}`}
              onClick={() => loadReport(report.id)}
            >
              <div className="truncate pr-4">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {report.company_name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatRelativeTime(report.created_at)}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeReport(report.id);
                }}
                className="text-gray-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity rounded focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label="Delete report"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
