import { useAppContext } from '../context/AppContext';
import { SectionCard } from './SectionCard';
import { StatusIndicator } from './StatusIndicator';

export function StreamingReport() {
  const { state } = useAppContext();
  const { statusMessage } = state;
  const s = state.streamingSections;

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Live Researching...</h2>
          <p className="text-gray-500 mt-2">Compiling briefing for the requested company</p>
        </div>

        <StatusIndicator message={statusMessage} />

        <SectionCard title="Overview" sectionKey="overview" content={s.overview} isLoading={!s.overview} />
        <SectionCard title="Key People" sectionKey="key_people" content={s.key_people} isLoading={!s.key_people} />
        <SectionCard title="Recent News" sectionKey="news" content={s.news} isLoading={!s.news} />
        <SectionCard title="Financial Highlights" sectionKey="financials" content={s.financials} isLoading={!s.financials} />
        <SectionCard title="Risk Factors" sectionKey="risks" content={s.risks} isLoading={!s.risks} />
      </div>
    </div>
  );
}
