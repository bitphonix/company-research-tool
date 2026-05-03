export function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 h-full bg-gray-50">
      <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to research?</h2>
      <p className="text-gray-500 max-w-md">
        Enter a company name in the sidebar to generate a comprehensive sales briefing. 
        It typically takes about 30 seconds to gather overview, key people, news, financials, and risks.
      </p>
    </div>
  );
}
