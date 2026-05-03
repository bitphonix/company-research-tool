import { AppProvider, useAppContext } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { EmptyState } from './components/EmptyState';
import { ErrorState } from './components/ErrorState';
import { StreamingReport } from './components/StreamingReport';
import { CompletedReport } from './components/CompletedReport';
import { useReports } from './hooks/useReports';

function AppContent() {
  const { state } = useAppContext();
  useReports(); // Loads history on mount

  let MainPanel;
  switch (state.status) {
    case 'idle':
      MainPanel = <EmptyState />;
      break;
    case 'streaming':
      MainPanel = <StreamingReport />;
      break;
    case 'complete':
      MainPanel = <CompletedReport />;
      break;
    case 'error':
      MainPanel = <ErrorState />;
      break;
    default:
      MainPanel = <EmptyState />;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 h-full overflow-hidden flex flex-col">
        {MainPanel}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
