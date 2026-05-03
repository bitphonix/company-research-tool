import { useState, useEffect, useRef } from 'react';
import { useSSE } from '../hooks/useSSE';
import { useAppContext } from '../context/AppContext';

export function SearchBox() {
  const [company, setCompany] = useState('');
  const { startResearch } = useSSE();
  const { state } = useAppContext();
  const inputRef = useRef<HTMLInputElement>(null);
  
  const isMac = typeof navigator !== 'undefined' ? navigator.platform.includes('Mac') : false;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim()) return;
    startResearch(company);
    setCompany('');
  };

  const isStreaming = state.status === 'streaming';

  return (
    <div className="p-4 border-b border-gray-200">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Company Name (e.g. Stripe)"
            className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm shadow-sm"
          />
          <button
            type="submit"
            disabled={!company.trim() || isStreaming}
            className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isStreaming ? 'Researching...' : 'Research'}
          </button>
        </div>
        <span className="text-xs text-gray-400 pl-1">
          {isMac ? '⌘K' : 'Ctrl+K'} to focus
        </span>
      </form>
    </div>
  );
}
