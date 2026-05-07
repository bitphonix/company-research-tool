interface StatusIndicatorProps {
  message?: string;
}

export function StatusIndicator({ message }: StatusIndicatorProps) {
  if (!message) return null;

  return (
    <div className="inline-flex items-center gap-4 px-5 py-3 bg-white border border-black/5 rounded-full shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] animate-slide-up">
      <div className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-600"></span>
      </div>
      <p className="text-sm font-mono text-black/70 font-medium">
        {message}
      </p>
    </div>
  );
}
