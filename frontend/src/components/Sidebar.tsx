import { SearchBox } from './SearchBox';
import { ReportHistory } from './ReportHistory';

export function Sidebar() {
  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full shrink-0">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-600"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
          Company Intel
        </h1>
      </div>
      <SearchBox />
      <div className="p-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        Recent Briefings
      </div>
      <ReportHistory />
    </div>
  );
}
