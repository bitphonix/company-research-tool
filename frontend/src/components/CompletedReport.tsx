import { useAppContext } from '../context/AppContext';
import { SectionCard } from './SectionCard';
import { formatRelativeTime } from '../utils/time';

export function CompletedReport() {
  const { state } = useAppContext();
  const report = state.currentReport;

  if (!report) return null;

  const { sections } = report;

  return (
    <div className="flex-1 overflow-y-auto p-8 md:p-16 lg:p-24 relative">
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="mb-20 animate-slide-up">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
            <div className="max-w-3xl">
              <h2 className="text-6xl md:text-[5.5rem] font-display font-bold text-black tracking-tighter leading-[0.95] mb-6">
                {report.company_name}
              </h2>
              <p className="text-sm font-mono text-black/40">
                Briefing generated {formatRelativeTime(report.created_at)}
              </p>
            </div>
            <div className="shrink-0 mt-2 md:mt-0">
              <span className="inline-flex items-center px-4 py-2 bg-black/[0.03] text-black text-xs font-bold uppercase tracking-[0.15em] rounded-full border border-black/5">
                Verified Intel
              </span>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <div className="delay-75"><SectionCard title="Executive Overview" sectionKey="overview" content={sections.overview} /></div>
          <div className="delay-150"><SectionCard title="Key People" sectionKey="key_people" content={sections.key_people} /></div>
          <div className="delay-200"><SectionCard title="Recent News" sectionKey="news" content={sections.news} /></div>
          <div className="delay-300"><SectionCard title="Financial Highlights" sectionKey="financials" content={sections.financials} /></div>
          <div className="delay-400"><SectionCard title="Risk Factors" sectionKey="risks" content={sections.risks} /></div>
        </div>
      </div>
    </div>
  );
}
