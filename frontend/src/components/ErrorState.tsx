import { useAppContext } from '../context/AppContext';

export function ErrorState() {
  const { state, dispatch } = useAppContext();

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-md w-full animate-slide-up">
        <div className="double-bezel">
          <div className="double-bezel-inner p-10 text-center">
            <div className="w-16 h-16 mx-auto bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            
            <h2 className="text-3xl font-display font-semibold text-black tracking-tight mb-4">Synthesis Failed</h2>
            
            <p className="text-sm font-mono text-black/60 mb-8 bg-black/5 p-4 rounded-xl text-left border border-black/5">
              {state.error || 'Connection interrupted. Please try again.'}
            </p>

            <button
              onClick={() => dispatch({ type: 'RESET' })}
              className="w-full px-6 py-4 bg-black text-white text-sm font-semibold rounded-xl hover:scale-[0.98] active:scale-[0.96] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] focus:outline-none"
            >
              Dismiss & Retry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
