import { useAppContext } from '../context/AppContext';
import { SectionCard } from './SectionCard';
import { StatusIndicator } from './StatusIndicator';

export function StreamingReport() {
  const { state } = useAppContext();
  const { statusMessage } = state;
  
  const s = state.streamingSections;

  return (
    <div className="flex-1 overflow-y-auto p-8 md:p-16 lg:p-24 relative">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/5 blur-[120px]"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="mb-16 animate-slide-up">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-black/[0.03] border border-black/5 mb-6">
            <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse-scale"></div>
            <span className="text-xs font-semibold tracking-widest uppercase text-black/60">Live Synthesis</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-display font-semibold text-black tracking-tighter leading-[1.1]">
            Assembling <br/>Intelligence...
          </h2>
        </div>

        <StatusIndicator message={statusMessage} />

        <div className="mt-16">
          <div className="delay-75"><SectionCard title="Executive Overview" sectionKey="overview" content={s.overview} isLoading={!s.overview} /></div>
          <div className="delay-150"><SectionCard title="Key People" sectionKey="key_people" content={s.key_people} isLoading={!s.key_people} /></div>
          <div className="delay-200"><SectionCard title="Recent News" sectionKey="news" content={s.news} isLoading={!s.news} /></div>
          <div className="delay-300"><SectionCard title="Financial Highlights" sectionKey="financials" content={s.financials} isLoading={!s.financials} /></div>
          <div className="delay-400"><SectionCard title="Risk Factors" sectionKey="risks" content={s.risks} isLoading={!s.risks} /></div>
        </div>
      </div>
    </div>
  );
}
