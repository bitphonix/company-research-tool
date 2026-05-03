import { useState } from 'react';
import { useSSE } from '../hooks/useSSE';

export function SearchBox() {
  const [company, setCompany] = useState('');
  const { startResearch } = useSSE();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim()) return;
    startResearch(company);
    setCompany('');
  };

  return (
    <div className="p-4 border-b border-gray-200">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Company Name (e.g. Stripe)"
          className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm shadow-sm"
        />
        <button
          type="submit"
          disabled={!company.trim()}
          className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Research
        </button>
      </form>
    </div>
  );
}
