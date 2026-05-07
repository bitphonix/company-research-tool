import { useAppContext } from '../context/AppContext';
import { useReports } from '../hooks/useReports';
import { formatRelativeTime } from '../utils/time';

export function ReportHistory() {
  const { state } = useAppContext();
  const { loadReport, removeReport } = useReports();

  if (state.history.length === 0) {
    return (
      <div className="px-8 py-10 text-sm text-black/40 text-center font-medium">
        No briefings found.
      </div>
    );
  }

  return (
    <div className="pb-8">
      <div className="px-8 mb-4">
        <h3 className="text-[10px] font-bold text-black/30 tracking-widest uppercase">
          Archive
        </h3>
      </div>
      <ul className="flex flex-col gap-1 px-4">
        {state.history.map((report) => {
          const isSelected = state.currentReport?.id === report.id;
          
          return (
            <li 
              key={report.id} 
              className={`px-4 py-3 cursor-pointer flex justify-between items-center group transition-all duration-300 ease-out rounded-xl ${isSelected ? 'bg-black/[0.03]' : 'hover:bg-black/[0.02]'}`}
              onClick={() => loadReport(report.id)}
            >
              <div className="truncate pr-4 flex flex-col gap-1 w-full">
                <span className={`text-sm font-semibold truncate transition-colors duration-300 ${isSelected ? 'text-blue-600' : 'text-black group-hover:text-black/80'}`}>
                  {report.company_name}
                </span>
                <span className="text-[11px] text-black/40 font-mono">
                  {formatRelativeTime(report.created_at)}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeReport(report.id);
                }}
                className="text-black/30 hover:text-red-500 w-8 h-8 rounded-full flex items-center justify-center opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out hover:bg-red-50 focus:opacity-100 focus:translate-x-0 focus:outline-none shrink-0"
                aria-label="Delete report"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18"></path><path d="M6 6l12 12"></path></svg>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
