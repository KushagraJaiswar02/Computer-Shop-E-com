import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Category, Brand, Product } from '../../types';
import { FilterSidebar } from './FilterSidebar';
import { KeycapButton } from '../../components/common/KeycapButton';

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  brands: Brand[];
  products: Product[];
  activeCategory: string;
  activeSubcategory: string;
  activeBrand: string;
  activeSeries: string;
  inStockOnly: boolean;
  isDealOnly: boolean;
  priceRange: [number, number];
  onPriceChange: (val: number) => void;
  onFilterChange: (key: string, value: string | null) => void;
  onClearAll: () => void;
  activeFilterCount: number;
  totalFilteredCount: number;
}

export const MobileFilterDrawer: React.FC<MobileFilterDrawerProps> = ({
  isOpen,
  onClose,
  totalFilteredCount,
  ...sidebarProps
}) => {
  // Prevent background scrolling when open
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
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="relative ml-auto w-full max-w-xs sm:max-w-sm bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
              Filters & Refinements
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {totalFilteredCount} products found
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Close filters"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <FilterSidebar {...sidebarProps} />
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80">
          <KeycapButton
            variant="primary"
            size="md"
            className="w-full justify-center"
            onClick={onClose}
          >
            Show {totalFilteredCount} Products
          </KeycapButton>
        </div>
      </div>
    </div>
  );
};
