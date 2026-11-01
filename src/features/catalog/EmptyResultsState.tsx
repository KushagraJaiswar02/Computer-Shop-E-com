import React from 'react';
import { SearchX, RotateCcw, X } from 'lucide-react';

interface EmptyResultsStateProps {
  searchQuery?: string;
  onClearSearch?: () => void;
  onReset: () => void;
}

export const EmptyResultsState: React.FC<EmptyResultsStateProps> = ({
  searchQuery,
  onClearSearch,
  onReset,
}) => {
  return (
    <div className="py-14 px-4 text-center bg-surface dark:bg-surface rounded-xl border border-dashed border-border dark:border-border flex flex-col items-center justify-center">
      <div className="w-12 h-12 rounded-full bg-surface-soft dark:bg-surface-elevated flex items-center justify-center text-muted mb-3">
        <SearchX className="w-6 h-6" />
      </div>

      <h3 className="text-base font-bold text-main dark:text-main mb-1">
        {searchQuery ? `No results for “${searchQuery}”` : 'No hardware products found'}
      </h3>

      <p className="text-xs sm:text-sm text-muted dark:text-muted max-w-md mx-auto mb-5 leading-relaxed">
        {searchQuery
          ? `We couldn't find any products matching “${searchQuery}”. Check your spelling or clear the search query to see all catalog products.`
          : 'No products match the selected filters. Try broadening your price range, unselecting brands, or resetting filters.'}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {searchQuery && onClearSearch && (
          <button
            type="button"
            onClick={onClearSearch}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary text-on-primary hover:bg-primary-hover dark:bg-primary dark:hover:bg-primary-hover shadow-xs transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>Clear search</span>
          </button>
        )}

        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-border dark:border-border bg-surface dark:bg-surface-elevated text-main dark:text-main hover:border-border dark:hover:border-border shadow-xs transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset all filters</span>
        </button>
      </div>
    </div>
  );
};
