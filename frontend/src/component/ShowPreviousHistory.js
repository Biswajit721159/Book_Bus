import React from 'react';

const ShowPreviousHistory = ({ searchHistory, deletePreviousHistory, onClickSearchHistory }) => {
  if (!searchHistory?.length) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
      <p className="text-xs text-surface-500 font-medium mb-2 uppercase tracking-wider">Recent Searches</p>
      <div className="flex flex-wrap gap-2">
        {searchHistory.map((el) => (
          <div
            key={el}
            className="flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 bg-white border border-surface-200 rounded-lg text-sm text-surface-700 hover:border-primary-300 hover:bg-primary-50 transition-all duration-150 group"
          >
            <svg className="w-3.5 h-3.5 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <button
              onClick={() => onClickSearchHistory(el)}
              className="font-mono text-xs text-surface-700 hover:text-primary-700 transition-colors"
            >
              {el}
            </button>
            <button
              onClick={() => deletePreviousHistory(el)}
              className="w-5 h-5 rounded flex items-center justify-center text-surface-300 hover:text-red-500 hover:bg-red-50 transition-all duration-150"
              aria-label="Remove"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowPreviousHistory;
