import React from 'react';

// "Showing 12 of 40" + a Load more button. Renders nothing when everything is shown.
const LoadMore = ({ shown, total, loading, error, onClick }) => {
  if (shown >= total && !error) return null;

  return (
    <div className="flex flex-col items-center gap-2 mt-10">
      {error ? (
        <p className="text-sm text-red-500">Could not load more posts.</p>
      ) : (
        <p className="text-xs text-gray-400">
          Showing {shown} of {total}
        </p>
      )}
      <button
        onClick={onClick}
        disabled={loading}
        className="px-6 py-2.5 rounded-full border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:border-brand-300 hover:text-brand-600 disabled:opacity-60 transition-colors"
      >
        {loading ? 'Loading…' : error ? 'Try again' : 'Load more'}
      </button>
    </div>
  );
};

export default LoadMore;
