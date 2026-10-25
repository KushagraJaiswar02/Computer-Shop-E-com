import React from 'react';

interface ShopSortControlsProps {
  sortBy: string;
  onSortChange: (newSort: string) => void;
  resultCount: number;
}

export const ShopSortControls: React.FC<ShopSortControlsProps> = ({
  sortBy,
  onSortChange,
  resultCount,
}) => {
  return (
    <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-slate-800 text-xs">
      <div className="text-slate-600 dark:text-slate-400">
        Showing <span className="font-semibold text-slate-900 dark:text-white">{resultCount}</span> products
      </div>

      <div className="flex items-center gap-2">
        <span className="text-slate-500 hidden sm:inline text-xs">Sort by:</span>
        <select
          value={sortBy}
          onChange={e => onSortChange(e.target.value)}
          className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="featured">Featured First</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="newest">Newest Releases</option>
          <option value="rating">Customer Rating</option>
          <option value="discount">Biggest Discount</option>
        </select>
      </div>
    </div>
  );
};
