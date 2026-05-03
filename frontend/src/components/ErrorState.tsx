import { useAppContext } from '../context/AppContext';

export function ErrorState() {
  const { state, dispatch } = useAppContext();

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 h-full bg-white">
      <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Research Failed</h2>
      <p className="text-gray-600 max-w-md text-center mb-6">
        {state.error || 'An unexpected error occurred while researching.'}
      </p>
      <button
        onClick={() => dispatch({ type: 'RESET' })}
        className="px-6 py-2 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
      >
        Go Back
      </button>
    </div>
  );
}
