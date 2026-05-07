import { SearchBox } from './SearchBox';
import { ReportHistory } from './ReportHistory';

export function Sidebar() {
  return (
    <aside className="w-[320px] h-full flex flex-col bg-white border-r border-black/5 shrink-0 z-10 relative shadow-[10px_0_30px_-15px_rgba(0,0,0,0.03)]">
      <div className="p-8 pb-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse-scale"></div>
          <span className="text-[10px] font-bold text-black/40 tracking-[0.2em] uppercase">Vanguard Intel</span>
        </div>
        <h1 className="text-2xl font-display font-semibold text-black tracking-tight leading-none">
          Briefings
        </h1>
      </div>
      <SearchBox />
      <div className="flex-1 overflow-y-auto mt-4">
        <ReportHistory />
      </div>
    </aside>
  );
}
