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
    <div className="flex items-center justify-between mb-4 pb-3 border-b border-border dark:border-border text-xs">
      <div className="text-muted dark:text-muted">
        Showing <span className="font-semibold text-main dark:text-main">{resultCount}</span> products
      </div>

      <div className="flex items-center gap-2">
        <span className="text-muted hidden sm:inline text-xs">Sort by:</span>
        <select
          value={sortBy}
          onChange={e => onSortChange(e.target.value)}
          className="px-2.5 py-1.5 rounded-lg bg-surface dark:bg-surface border border-border dark:border-border text-main dark:text-main text-xs font-medium focus:outline-none focus:ring-1 focus:ring-focus"
        >
          <option value="featured">Featured First</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="newest">Newest Releases</option>
          <option value="discount">Biggest Discount</option>
        </select>
      </div>
    </div>
  );
};
