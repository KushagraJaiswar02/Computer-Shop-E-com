import React from 'react';
import { X } from 'lucide-react';
import { Category, Brand } from '../../types';
import { formatPrice } from '../../lib/utils';

interface ActiveFilterChipsProps {
  activeSearch: string;
  activeCategory: string;
  activeSubcategory: string;
  activeBrands: string[];
  inStockOnly: boolean;
  isDealOnly: boolean;
  minPrice: number;
  maxPrice: number;
  minDataPrice: number;
  maxDataPrice: number;
  categories: Category[];
  brands: Brand[];
  onRemoveFilter: (key: string, value?: string) => void;
  onClearAll: () => void;
}

export const ActiveFilterChips: React.FC<ActiveFilterChipsProps> = ({
  activeSearch,
  activeCategory,
  activeSubcategory,
  activeBrands,
  inStockOnly,
  isDealOnly,
  minPrice,
  maxPrice,
  minDataPrice,
  maxDataPrice,
  categories,
  brands,
  onRemoveFilter,
  onClearAll,
}) => {
  const currentCategory = categories.find((c) => c.id === activeCategory);
  const currentSubcategory = currentCategory?.subcategories.find((s) => s.id === activeSubcategory);
  const hasPriceFilter = minPrice > minDataPrice || maxPrice < maxDataPrice;

  const hasAnyFilter = Boolean(
    activeSearch ||
      activeCategory ||
      activeSubcategory ||
      activeBrands.length > 0 ||
      inStockOnly ||
      isDealOnly ||
      hasPriceFilter
  );

  if (!hasAnyFilter) return null;

  const chipClass = 'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs';

  return (
    <div className="mb-4 flex flex-wrap items-center gap-1.5 rounded-lg border border-border bg-surface p-2 text-xs dark:border-border dark:bg-surface">
      <span className="mr-1 text-[11px] font-semibold text-muted uppercase tracking-wider font-sans">
        Active:
      </span>

      {/* Search query chip */}
      {activeSearch && (
        <span className={`${chipClass} border-border bg-surface-soft text-main dark:border-border dark:bg-surface-elevated dark:text-main`}>
          <span>Search: “{activeSearch}”</span>
          <button
            type="button"
            aria-label="Remove search filter"
            onClick={() => onRemoveFilter('q')}
            className="inline-flex min-h-10 min-w-10 items-center justify-center text-muted hover:text-main dark:hover:text-main"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      )}

      {/* Category chip */}
      {activeCategory && (
        <span className={`${chipClass} border-primary bg-accent/10 text-accent dark:border-primary dark:bg-accent/10 dark:text-accent`}>
          <span>Category: {currentCategory?.name || activeCategory}</span>
          <button
            type="button"
            aria-label="Remove category filter"
            onClick={() => onRemoveFilter('category')}
            className="inline-flex min-h-10 min-w-10 items-center justify-center text-accent hover:text-accent dark:hover:text-main"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      )}

      {/* Subcategory chip */}
      {activeSubcategory && (
        <span className={`${chipClass} border-primary bg-accent/10 text-accent dark:border-primary dark:bg-accent/10 dark:text-accent`}>
          <span>Sub: {currentSubcategory?.name || activeSubcategory}</span>
          <button
            type="button"
            aria-label="Remove subcategory filter"
            onClick={() => onRemoveFilter('subcategory')}
            className="inline-flex min-h-10 min-w-10 items-center justify-center text-accent hover:text-accent dark:hover:text-main"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      )}

      {/* Selected brands chips */}
      {activeBrands.map((brandId) => {
        const brandObj = brands.find((b) => b.id === brandId);
        const name = brandObj?.name || brandId;

        return (
          <span
            key={brandId}
            className={`${chipClass} border-border bg-surface-soft text-main dark:border-border dark:bg-surface-elevated dark:text-main`}
          >
            <span>Brand: {name}</span>
            <button
              type="button"
              aria-label={`Remove ${name} brand filter`}
              onClick={() => onRemoveFilter('brand', brandId)}
              className="inline-flex min-h-10 min-w-10 items-center justify-center text-muted hover:text-main dark:hover:text-main"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        );
      })}

      {/* Price filter chip */}
      {hasPriceFilter && (
        <span className={`${chipClass} border-border bg-surface-soft text-main dark:border-border dark:bg-surface-elevated dark:text-main`}>
          <span>Price: {formatPrice(minPrice)} – {formatPrice(maxPrice)}</span>
          <button
            type="button"
            aria-label="Remove price filter"
            onClick={() => onRemoveFilter('price')}
            className="inline-flex min-h-10 min-w-10 items-center justify-center text-muted hover:text-main dark:hover:text-main"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      )}

      {/* In stock chip */}
      {inStockOnly && (
        <span className={`${chipClass} border-success bg-success/10 text-success-ink dark:border-success dark:bg-success/10 dark:text-success-ink`}>
          <span>In stock</span>
          <button
            type="button"
            aria-label="Remove in-stock filter"
            onClick={() => onRemoveFilter('inStock')}
            className="inline-flex min-h-10 min-w-10 items-center justify-center text-success-ink hover:text-success-ink dark:hover:text-main"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      )}

      {/* Deals chip */}
      {isDealOnly && (
        <span className={`${chipClass} border-warning bg-warning/10 text-warning-ink dark:border-warning dark:bg-warning/10 dark:text-warning-ink`}>
          <span>Deals</span>
          <button
            type="button"
            aria-label="Remove deals filter"
            onClick={() => onRemoveFilter('deal')}
            className="inline-flex min-h-10 min-w-10 items-center justify-center text-warning-ink hover:text-warning-ink dark:hover:text-main"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      )}

      {/* Clear all link */}
      <button
        type="button"
        onClick={onClearAll}
        className="ml-auto text-xs font-semibold text-danger-ink dark:text-danger-ink hover:underline px-1 py-0.5"
      >
        Clear all
      </button>
    </div>
  );
};
