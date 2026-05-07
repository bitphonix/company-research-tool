export function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden p-8">
      {/* Decorative center radial gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 blur-[100px] rounded-full pointer-events-none"></div>
      
      <div className="text-center max-w-2xl relative z-10 animate-slide-up">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-black/[0.03] border border-black/5 mb-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)]">
          <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h2 className="text-5xl md:text-7xl font-display font-semibold text-black tracking-tighter leading-[1.1] mb-6">
          Intelligence,<br />Instantly.
        </h2>
        <p className="text-lg md:text-xl text-black/50 leading-relaxed max-w-lg mx-auto font-medium">
          Enter a company name in the sidebar to generate a comprehensive, structured research briefing in under 2 minutes.
        </p>
      </div>
    </div>
  );
}
