import React from 'react';
import { X } from 'lucide-react';
import { Category, Brand } from '../../types';
import { formatPrice } from '../../lib/utils';

interface ActiveFilterChipsProps {
  activeSearch: string;
  activeCategory: string;
  activeSubcategory: string;
  activeBrand: string;
  activeSeries: string;
  isDealOnly: boolean;
  isBestsellerOnly: boolean;
  inStockOnly: boolean;
  minPrice: number;
  maxPrice: number;
  categories: Category[];
  brands: Brand[];
  onRemoveFilter: (key: string) => void;
  onClearAll: () => void;
}

export const ActiveFilterChips: React.FC<ActiveFilterChipsProps> = props => {
  const {
    activeSearch, activeCategory, activeSubcategory, activeBrand, activeSeries,
    isDealOnly, isBestsellerOnly, inStockOnly, minPrice, maxPrice,
    categories, brands, onRemoveFilter, onClearAll,
  } = props;
  const currentCategory = categories.find(category => category.id === activeCategory);
  const currentBrand = brands.find(brand => brand.id === activeBrand);
  const currentSeries = currentBrand?.seriesList.find(series => series.id === activeSeries);
  const hasPriceFilter = minPrice > 0 || maxPrice < 500000;
  const hasAnyFilter = Boolean(activeSearch || activeCategory || activeSubcategory || activeBrand || activeSeries || isDealOnly || isBestsellerOnly || inStockOnly || hasPriceFilter);

  if (!hasAnyFilter) return null;

  const chipClass = 'inline-flex items-center gap-1 rounded border px-2 py-0.5';
  const removeButton = (label: string, key: string, color = 'text-slate-400') => (
    <button type="button" aria-label={`Remove ${label} filter`} onClick={() => onRemoveFilter(key)} className={`${color} hover:text-slate-900 dark:hover:text-white`}>
      <X className="h-3 w-3" />
    </button>
  );

  return (
    <div className="mb-4 flex flex-wrap items-center gap-1.5 rounded-lg border border-slate-200 bg-white p-2.5 text-xs dark:border-slate-800 dark:bg-slate-850">
      <span className="mr-1 text-[11px] font-medium text-slate-400">Filters:</span>
      {activeSearch && <span className={`${chipClass} border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200`}>Query: “{activeSearch}”{removeButton('search', 'q')}</span>}
      {activeCategory && <span className={`${chipClass} border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/60 dark:text-blue-300`}>{currentCategory?.name || activeCategory}{removeButton('category', 'category', 'text-blue-400')}</span>}
      {activeSubcategory && <span className={`${chipClass} border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/60 dark:text-blue-300`}>Subcategory: {currentCategory?.subcategories.find(item => item.id === activeSubcategory)?.name || activeSubcategory}{removeButton('subcategory', 'subcategory', 'text-blue-400')}</span>}
      {activeBrand && <span className={`${chipClass} border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200`}>Brand: {currentBrand?.name || activeBrand}{removeButton('brand', 'brand')}</span>}
      {activeSeries && <span className={`${chipClass} border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/60 dark:text-blue-300`}>Series: {currentSeries?.name || activeSeries}{removeButton('series', 'series', 'text-blue-400')}</span>}
      {isDealOnly && <span className={`${chipClass} border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-300`}>Deals only{removeButton('deals', 'deal', 'text-amber-400')}</span>}
      {isBestsellerOnly && <span className={`${chipClass} border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-800 dark:bg-violet-950/50 dark:text-violet-300`}>Bestsellers{removeButton('bestseller', 'bestseller', 'text-violet-400')}</span>}
      {inStockOnly && <span className={`${chipClass} border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300`}>In stock{removeButton('in-stock', 'inStock', 'text-emerald-500')}</span>}
      {hasPriceFilter && <span className={`${chipClass} border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200`}>Price: {formatPrice(minPrice)} – {formatPrice(maxPrice)}<button type="button" aria-label="Remove price filter" onClick={() => onRemoveFilter('price')} className="text-slate-400 hover:text-slate-900 dark:hover:text-white"><X className="h-3 w-3" /></button></span>}
      <button type="button" onClick={onClearAll} aria-label="Clear all filters" className="ml-auto text-[11px] text-slate-400 underline hover:text-rose-600">Clear all</button>
    </div>
  );
};
