import React, { useEffect } from 'react';
import { X, RotateCcw } from 'lucide-react';
import { Brand, Product } from '../../types';
import { FilterSidebar } from './FilterSidebar';

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  brands: Brand[];
  products: Product[];
  activeBrands: string[];
  onToggleBrand: (brandId: string) => void;
  inStockOnly: boolean;
  onToggleInStock: (inStock: boolean) => void;
  priceRange: [number, number];
  minDataPrice: number;
  maxDataPrice: number;
  onPriceChange: (min: number, max: number) => void;
  onClearAll: () => void;
  activeFilterCount: number;
  totalFilteredCount: number;
}

export const MobileFilterDrawer: React.FC<MobileFilterDrawerProps> = ({
  isOpen,
  onClose,
  totalFilteredCount,
  onClearAll,
  activeFilterCount,
  ...sidebarProps
}) => {
  // Prevent background body scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-overlay/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Bottom Drawer Sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Filter products"
        className="relative w-full max-h-[85vh] bg-surface dark:bg-surface rounded-t-2xl shadow-2xl flex flex-col z-10 animate-in slide-in-from-bottom duration-300 border-t border-border dark:border-border"
      >
        {/* Grab Handle */}
        <div className="w-12 h-1 bg-border dark:bg-surface-soft rounded-full mx-auto mt-2.5 mb-1 shrink-0" />

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border dark:border-border shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-main dark:text-main uppercase tracking-wider font-sans">
              Filters
            </h2>
            {activeFilterCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-primary text-on-primary text-[10px] font-bold">
                {activeFilterCount}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-10 min-w-10 flex items-center justify-center p-1.5 rounded-lg text-muted hover:text-main dark:hover:text-main hover:bg-surface-soft dark:hover:bg-surface-elevated"
            aria-label="Close filters"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Filters Content */}
        <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
          <FilterSidebar
            {...sidebarProps}
            activeFilterCount={activeFilterCount}
            onClearAll={onClearAll}
          />
        </div>

        {/* Bottom Actions Bar */}
        <div className="p-4 border-t border-border dark:border-border bg-surface-soft dark:bg-surface/90 flex items-center gap-3 shrink-0">
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="min-h-10 px-3 py-2.5 rounded-lg border border-border dark:border-border text-xs font-semibold text-main dark:text-main hover:bg-surface-soft dark:hover:bg-surface-elevated flex items-center gap-1.5 shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5 text-muted" />
              <span>Clear</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="min-h-10 flex-1 py-2.5 px-4 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:bg-primary-hover dark:bg-primary dark:hover:bg-primary-hover shadow-xs transition-colors text-center"
          >
            Show {totalFilteredCount} {totalFilteredCount === 1 ? 'Product' : 'Products'}
          </button>
        </div>
      </div>
    </div>
  );
};
