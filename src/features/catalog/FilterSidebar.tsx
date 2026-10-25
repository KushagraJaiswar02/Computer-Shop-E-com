import React from 'react';
import { RotateCcw, Check } from 'lucide-react';
import { Category, Brand, Product } from '../../types';
import { formatPrice } from '../../lib/utils';

interface FilterSidebarProps {
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
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  categories,
  brands,
  products,
  activeCategory,
  activeSubcategory,
  activeBrand,
  activeSeries,
  inStockOnly,
  isDealOnly,
  priceRange,
  onPriceChange,
  onFilterChange,
  onClearAll,
  activeFilterCount,
}) => {
  return (
    <div className="space-y-5 text-xs">
      {/* Category Accordion / List */}
      <div>
        <h4 className="font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-2 font-mono text-[11px]">
          Categories
        </h4>
        <div className="space-y-0.5">
          <button
            onClick={() => {
              onFilterChange('category', null);
              onFilterChange('subcategory', null);
            }}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-left transition-colors ${
              !activeCategory
                ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span>All Categories</span>
            <span className="text-[10px] text-slate-400 font-mono">{products.length}</span>
          </button>

          {categories.map(cat => {
            const isCatActive = activeCategory === cat.id;
            const count = products.filter(p => p.categoryId === cat.id).length;
            return (
              <div key={cat.id} className="space-y-0.5">
                <button
                  onClick={() => {
                    onFilterChange('category', isCatActive ? null : cat.id);
                    onFilterChange('subcategory', null);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-left transition-colors ${
                    isCatActive
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{count}</span>
                </button>

                {/* Subcategories */}
                {isCatActive && (
                  <div className="pl-3 py-0.5 space-y-0.5 border-l-2 border-blue-200 dark:border-blue-900 ml-2">
                    {cat.subcategories.map(sub => {
                      const isSubActive = activeSubcategory === sub.id;
                      return (
                        <button
                          key={sub.id}
                          onClick={() => onFilterChange('subcategory', isSubActive ? null : sub.id)}
                          className={`w-full text-left text-[11px] py-1 px-2 rounded transition-colors ${
                            isSubActive
                              ? 'text-blue-600 dark:text-blue-400 font-bold bg-blue-50/50 dark:bg-blue-950/30'
                              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                          }`}
                        >
                          {sub.name}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Brands Selection */}
      <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
        <h4 className="font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-2 font-mono text-[11px]">
          Brand
        </h4>
        <div className="space-y-0.5 max-h-44 overflow-y-auto pr-1">
          {brands.map(b => {
            const isBrandActive = activeBrand === b.id;
            return (
              <button
                key={b.id}
                onClick={() => {
                  onFilterChange('brand', isBrandActive ? null : b.id);
                  onFilterChange('series', null);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-left transition-colors ${
                  isBrandActive
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>{b.name}</span>
                {isBrandActive && <Check className="w-3.5 h-3.5 text-blue-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Slider */}
      <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-1.5">
          <h4 className="font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 font-mono text-[11px]">
            Max Price
          </h4>
          <span className="font-mono text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
            {formatPrice(priceRange[1])}
          </span>
        </div>
        <input
          type="range"
          min="1000"
          max="350000"
          step="5000"
          value={priceRange[1]}
          onChange={e => onPriceChange(Number(e.target.value))}
          className="w-full accent-blue-600"
        />
        <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-0.5">
          <span>₹1,000</span>
          <span>₹3,50,000+</span>
        </div>
      </div>

      {/* Availability & Deals Toggles */}
      <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
        <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300 text-xs">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={e => onFilterChange('inStock', e.target.checked ? 'true' : null)}
            className="rounded text-blue-600 focus:ring-blue-500"
          />
          <span>In Stock Only</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300 text-xs">
          <input
            type="checkbox"
            checked={isDealOnly}
            onChange={e => onFilterChange('deal', e.target.checked ? 'true' : null)}
            className="rounded text-blue-600 focus:ring-blue-500"
          />
          <span>Deals & Discounts</span>
        </label>
      </div>

      {/* Clear Button */}
      {activeFilterCount > 0 && (
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={onClearAll}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 rounded-lg border border-rose-200 dark:border-rose-900/40 hover:bg-rose-100 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters ({activeFilterCount})</span>
          </button>
        </div>
      )}
    </div>
  );
};
