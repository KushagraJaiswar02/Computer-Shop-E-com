import React from 'react';
import { Link } from 'react-router-dom';
import { Filter } from 'lucide-react';

interface ShopHeaderProps {
  totalCount: number;
  sortBy: string;
  onSortChange: (newSort: string) => void;
  activeFilterCount: number;
  onOpenMobileFilters: () => void;
}

export const ShopHeader: React.FC<ShopHeaderProps> = ({
  totalCount,
  sortBy,
  onSortChange,
  activeFilterCount,
  onOpenMobileFilters,
}) => {
  return (
    <div className="mb-4">
      {/* Small Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="mb-2">
        <ol className="flex items-center gap-1.5 text-[11px] font-sans text-muted dark:text-muted">
          <li>
            <Link to="/" className="hover:text-accent dark:hover:text-accent transition-colors">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="font-semibold text-main dark:text-main">Catalog</li>
        </ol>
      </nav>

      {/* Compact Row: "Catalog" + count on left, Mobile Filters button + Sort on right */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-border dark:border-border">
        <div className="flex items-baseline gap-2 min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-main dark:text-main">
            Catalog
          </h1>
          <span className="text-xs sm:text-sm text-muted dark:text-muted font-medium">
            ({totalCount} {totalCount === 1 ? 'product' : 'products'})
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Mobile Filter Button */}
          <button
            type="button"
            onClick={onOpenMobileFilters}
            className="lg:hidden min-h-10 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border dark:border-border bg-surface dark:bg-surface text-xs font-semibold text-main dark:text-main hover:border-border dark:hover:border-border shadow-xs"
            aria-label={`Open filters${activeFilterCount > 0 ? `, ${activeFilterCount} active` : ''}`}
          >
            <Filter className="w-3.5 h-3.5 text-muted dark:text-muted" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-primary text-on-primary text-[10px] font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5">
            <label htmlFor="catalog-sort" className="hidden sm:inline text-xs text-muted dark:text-muted font-medium">
              Sort by:
            </label>
            <select
              id="catalog-sort"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="min-h-10 px-2.5 py-1.5 rounded-lg bg-surface dark:bg-surface border border-border dark:border-border text-main dark:text-main text-xs font-medium focus:outline-none focus:ring-1 focus:ring-focus shadow-xs"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest Releases</option>
              <option value="discount">Biggest Discount</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
