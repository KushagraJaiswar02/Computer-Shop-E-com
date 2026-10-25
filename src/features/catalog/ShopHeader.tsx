import React from 'react';
import { Link } from 'react-router-dom';
import { Filter } from 'lucide-react';
import { Category } from '../../types';
import { KeycapButton } from '../../components/common/KeycapButton';

interface ShopHeaderProps {
  currentCategory?: Category;
  totalCount: number;
  activeFilterCount: number;
  onOpenMobileFilters: () => void;
}

export const ShopHeader: React.FC<ShopHeaderProps> = ({
  currentCategory,
  totalCount,
  activeFilterCount,
  onOpenMobileFilters,
}) => {
  return (
    <div className="mb-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-2 font-mono">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <span>/</span>
        <span className="text-slate-800 dark:text-slate-200">Catalog</span>
        {currentCategory && (
          <>
            <span>/</span>
            <span className="text-blue-600 dark:text-blue-400 font-semibold">{currentCategory.name}</span>
          </>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            {currentCategory ? currentCategory.name : 'Hardware Catalog'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {currentCategory
              ? currentCategory.description
              : 'Browse gaming laptops, processors, graphics cards, memory, and PC components.'}
          </p>
        </div>

        {/* Mobile Filter Trigger Button */}
        <div className="lg:hidden">
          <KeycapButton
            variant="secondary"
            size="sm"
            onClick={onOpenMobileFilters}
            className="w-full sm:w-auto"
          >
            <Filter className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
            <span>Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}</span>
          </KeycapButton>
        </div>
      </div>
    </div>
  );
};
