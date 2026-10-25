import React from 'react';
import { X } from 'lucide-react';
import { Category, Brand } from '../../types';

interface ActiveFilterChipsProps {
  activeSearch: string;
  activeCategory: string;
  activeSubcategory: string;
  activeBrand: string;
  isDealOnly: boolean;
  categories: Category[];
  brands: Brand[];
  onRemoveFilter: (key: string) => void;
  onClearAll: () => void;
}

export const ActiveFilterChips: React.FC<ActiveFilterChipsProps> = ({
  activeSearch,
  activeCategory,
  activeSubcategory,
  activeBrand,
  isDealOnly,
  categories,
  brands,
  onRemoveFilter,
  onClearAll,
}) => {
  const currentCategoryObj = categories.find(c => c.id === activeCategory);
  const currentBrandObj = brands.find(b => b.id === activeBrand);

  const hasAnyFilter =
    Boolean(activeSearch) ||
    Boolean(activeCategory) ||
    Boolean(activeSubcategory) ||
    Boolean(activeBrand) ||
    isDealOnly;

  if (!hasAnyFilter) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5 mb-4 p-2.5 bg-white dark:bg-slate-850 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
      <span className="text-slate-400 font-medium mr-1 text-[11px]">Filters:</span>

      {activeSearch && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
          Query: "{activeSearch}"
          <button onClick={() => onRemoveFilter('q')} className="text-slate-400 hover:text-slate-600">
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {activeCategory && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
          {currentCategoryObj?.name || activeCategory}
          <button onClick={() => onRemoveFilter('category')} className="text-blue-400 hover:text-blue-600">
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {activeSubcategory && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
          Subcategory: {activeSubcategory}
          <button onClick={() => onRemoveFilter('subcategory')} className="text-blue-400 hover:text-blue-600">
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {activeBrand && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
          Brand: {currentBrandObj?.name || activeBrand}
          <button onClick={() => onRemoveFilter('brand')} className="text-slate-400 hover:text-slate-600">
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {isDealOnly && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
          Deals Only
          <button onClick={() => onRemoveFilter('deal')} className="text-amber-400 hover:text-amber-600">
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      <button
        onClick={onClearAll}
        className="text-[11px] text-slate-400 hover:text-rose-600 ml-auto underline"
      >
        Clear all
      </button>
    </div>
  );
};
