import { useAppContext } from '../context/AppContext';
import { SectionCard } from './SectionCard';

export function CompletedReport() {
  const { state } = useAppContext();
  const report = state.currentReport;

  if (!report) return null;

  const { sections } = report;

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{report.company_name}</h2>
            <p className="text-gray-500 mt-2 text-sm">
              Briefing created on {new Date(report.created_at).toLocaleString()}
            </p>
          </div>
          <div className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full border border-green-200">
            Completed
          </div>
        </div>

        <SectionCard title="Overview" sectionKey="overview" content={sections.overview} />
        <SectionCard title="Key People" sectionKey="key_people" content={sections.key_people} />
        <SectionCard title="Recent News" sectionKey="news" content={sections.news} />
        <SectionCard title="Financial Highlights" sectionKey="financials" content={sections.financials} />
        <SectionCard title="Risk Factors" sectionKey="risks" content={sections.risks} />
      </div>
    </div>
  );
}
