import { useAppContext } from '../context/AppContext';
import { SectionCard } from './SectionCard';
import { StatusIndicator } from './StatusIndicator';
import type { ReportSections } from '../types';

const SECTION_ORDER: (keyof ReportSections)[] = [
  'overview',
  'key_people',
  'news',
  'financials',
  'risks',
];

const SECTION_TITLES: Record<keyof ReportSections, string> = {
  overview: 'Executive Overview',
  key_people: 'Key People',
  news: 'Recent News',
  financials: 'Financial Highlights',
  risks: 'Risk Factors',
};

export function StreamingReport() {
  const { state } = useAppContext();
  const { statusMessage } = state;
  const s = state.streamingSections;

  // The active section is the first one in order that has no content yet
  const activeSectionKey = SECTION_ORDER.find((key) => !s[key]) ?? null;

  return (
    <div className="flex-1 overflow-y-auto p-8 md:p-16 lg:p-24 relative">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/5 blur-[120px]"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="mb-16 animate-slide-up">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-black/[0.03] border border-black/5 mb-6">
            <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse-scale"></div>
            <span className="text-xs font-semibold tracking-widest uppercase text-black/60">
              Live Synthesis
            </span>
          </div>
          <h2 className="text-5xl md:text-7xl font-display font-semibold text-black tracking-tighter leading-[1.1]">
            Assembling <br />Intelligence...
          </h2>
        </div>

        <StatusIndicator message={statusMessage} />

        <div className="mt-16">
          {SECTION_ORDER.map((key) => (
            <SectionCard
              key={key}
              title={SECTION_TITLES[key]}
              sectionKey={key}
              content={s[key]}
              isLoading={!s[key]}
              isActive={key === activeSectionKey}
            />
          ))}
        </div>
      </div>
    </div>
  );
}