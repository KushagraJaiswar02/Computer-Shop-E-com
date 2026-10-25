import React from 'react';
import { SearchX, RotateCcw } from 'lucide-react';
import { KeycapButton } from '../../components/common/KeycapButton';

interface EmptyResultsStateProps {
  onReset: () => void;
  searchQuery?: string;
}

export const EmptyResultsState: React.FC<EmptyResultsStateProps> = ({ onReset, searchQuery }) => {
  return (
    <div className="py-16 px-4 text-center bg-white dark:bg-slate-850 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 flex flex-col items-center justify-center">
      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
        <SearchX className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
        No hardware products found
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-5">
        {searchQuery
          ? `We couldn't find any products matching "${searchQuery}". Try checking the spelling or clearing your active filters.`
          : 'No products match the selected criteria. Try resetting price ranges, categories, or brand filters.'}
      </p>
      <KeycapButton
        variant="outline"
        size="sm"
        onClick={onReset}
        className="flex items-center gap-1.5"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Reset all filters</span>
      </KeycapButton>
    </div>
  );
};
