import { useState, useEffect, useRef } from 'react';
import { useSSE } from '../hooks/useSSE';
import { useAppContext } from '../context/AppContext';

export function SearchBox() {
  const [company, setCompany] = useState('');
  const { startResearch, cancelResearch } = useSSE();
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
    <div className="px-8 py-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-black/30 group-focus-within:text-blue-600 transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            ref={inputRef}
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Search company..."
            className="w-full pl-10 pr-12 py-3 bg-black/[0.02] border border-black/5 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600/30 focus:bg-white text-black placeholder-black/30 text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-[10px] text-black/30 font-mono bg-black/5 px-1.5 py-0.5 rounded-md">
              {isMac ? '⌘K' : 'Ctrl+K'}
            </span>
          </div>
        </div>
        
        <div className="flex flex-col gap-3">
          <button
            type="submit"
            disabled={!company.trim() || isStreaming}
            className="group relative w-full flex items-center justify-between px-6 py-3.5 bg-black text-white text-sm font-semibold rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[0.98] active:scale-[0.96] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              {isStreaming ? 'Synthesizing...' : 'Generate Briefing'}
            </span>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center relative z-10 group-hover:translate-x-1 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
              {isStreaming ? (
                <svg className="animate-spin-slow w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              )}
            </div>
          </button>
          
          {isStreaming && (
            <button
              type="button"
              onClick={cancelResearch}
              className="w-full flex items-center justify-center px-6 py-3 bg-transparent border border-black/10 text-black/70 text-sm font-semibold rounded-2xl hover:bg-black/5 active:scale-[0.98] transition-all duration-300 ease-out focus:outline-none"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
