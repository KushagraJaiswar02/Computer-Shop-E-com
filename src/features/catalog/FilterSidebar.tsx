import React, { useState, useMemo, useEffect } from 'react';
import { ChevronDown, ChevronUp, RotateCcw, Search, X } from 'lucide-react';
import { Brand, Product } from '../../types';
import { formatPrice } from '../../lib/utils';

interface FilterSidebarProps {
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
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  brands,
  products,
  activeBrands,
  onToggleBrand,
  inStockOnly,
  onToggleInStock,
  priceRange,
  minDataPrice,
  maxDataPrice,
  onPriceChange,
  onClearAll,
  activeFilterCount,
}) => {
  // Collapsible section states: Brand open by default, others collapsed
  const [isBrandOpen, setIsBrandOpen] = useState(true);
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(false);

  // Search query within brand list
  const [brandSearch, setBrandSearch] = useState('');

  // Local price input state for smooth typing
  const [localMinPrice, setLocalMinPrice] = useState<string>(priceRange[0].toString());
  const [localMaxPrice, setLocalMaxPrice] = useState<string>(priceRange[1].toString());

  useEffect(() => {
    setLocalMinPrice(priceRange[0].toString());
    setLocalMaxPrice(priceRange[1].toString());
  }, [priceRange]);

  // Filtered brand list
  const filteredBrands = useMemo(() => {
    const q = brandSearch.trim().toLowerCase();
    if (!q) return brands;
    return brands.filter((b) => b.name.toLowerCase().includes(q));
  }, [brands, brandSearch]);

  // In-stock products count
  const inStockCount = useMemo(() => {
    return products.filter((p) => p.stockStatus !== 'out_of_stock' && p.stock > 0).length;
  }, [products]);

  const handleApplyPrice = () => {
    const min = Math.max(minDataPrice, Math.min(Number(localMinPrice) || minDataPrice, maxDataPrice));
    const max = Math.min(maxDataPrice, Math.max(Number(localMaxPrice) || maxDataPrice, min));
    onPriceChange(min, max);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maxVal = Number(e.target.value);
    setLocalMaxPrice(maxVal.toString());
    onPriceChange(priceRange[0], maxVal);
  };

  return (
    <div className="space-y-4 text-xs">
      {/* Top Header with Filter Count and Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-border dark:border-border">
        <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-main dark:text-main font-sans text-[11px]">
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-primary text-on-primary text-[10px] font-bold">
              {activeFilterCount}
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-[11px] font-medium text-muted hover:text-danger-ink dark:text-muted dark:hover:text-danger-ink transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* 1. Brand Section (Open by default) */}
      <div className="border-b border-border dark:border-border pb-4">
        <button
          type="button"
          onClick={() => setIsBrandOpen((prev) => !prev)}
          className="w-full flex items-center justify-between font-bold uppercase tracking-wider text-main dark:text-main font-sans text-[11px] min-h-10 py-1 text-left"
          aria-expanded={isBrandOpen}
        >
          <span className="flex items-center gap-1.5">
            <span>Brand</span>
            {activeBrands.length > 0 && (
              <span className="text-[10px] text-accent dark:text-accent font-sans lowercase">
                ({activeBrands.length} selected)
              </span>
            )}
          </span>
          {isBrandOpen ? (
            <ChevronUp className="w-3.5 h-3.5 text-muted" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-muted" />
          )}
        </button>

        {isBrandOpen && (
          <div className="mt-2.5 space-y-2">
            {/* Search Brand input */}
            <div className="relative">
              <Search className="w-3 h-3 text-muted absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={brandSearch}
                onChange={(e) => setBrandSearch(e.target.value)}
                placeholder="Search brands..."
                className="w-full h-7 pl-7 pr-7 rounded-md border border-border dark:border-border bg-surface-soft dark:bg-surface text-[11px] text-main dark:text-main placeholder:text-muted focus:outline-none focus:border-primary"
              />
              {brandSearch && (
                <button
                  type="button"
                  onClick={() => setBrandSearch('')}
                  aria-label="Clear brand search"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-muted dark:hover:text-main"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Scrollable brand list */}
            <div className="max-h-48 overflow-y-auto pr-1 space-y-0.5 scrollbar-thin">
              {filteredBrands.length > 0 ? (
                filteredBrands.map((b) => {
                  const isChecked = activeBrands.includes(b.id);
                  const count = products.filter((p) => p.brandId === b.id).length;

                  return (
                    <label
                      key={b.id}
                      className={`flex items-center justify-between min-h-10 px-2 py-1.5 rounded-md cursor-pointer transition-colors ${
                        isChecked
                          ? 'bg-accent/10 dark:bg-accent/10 text-accent dark:text-accent font-medium'
                          : 'text-main dark:text-main hover:bg-surface-soft dark:hover:bg-surface-elevated'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => onToggleBrand(b.id)}
                          className="rounded border-border dark:border-border text-accent focus:ring-focus h-3.5 w-3.5"
                        />
                        <span className="truncate">{b.name}</span>
                      </div>
                      <span className="text-[10px] text-muted font-sans ml-2 shrink-0">
                        {count}
                      </span>
                    </label>
                  );
                })
              ) : (
                <p className="text-[11px] text-muted py-2 text-center">No brands matching "{brandSearch}"</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 3. Price Range Section (Collapsed by default) */}
      <div className="border-b border-border dark:border-border pb-4">
        <button
          type="button"
          onClick={() => setIsPriceOpen((prev) => !prev)}
          className="w-full flex items-center justify-between font-bold uppercase tracking-wider text-main dark:text-main font-sans text-[11px] min-h-10 py-1 text-left"
          aria-expanded={isPriceOpen}
        >
          <span className="flex items-center gap-1.5">
            <span>Price Range</span>
            {(priceRange[0] > minDataPrice || priceRange[1] < maxDataPrice) && (
              <span className="text-[10px] text-accent dark:text-accent font-sans lowercase">
                (filtered)
              </span>
            )}
          </span>
          {isPriceOpen ? (
            <ChevronUp className="w-3.5 h-3.5 text-muted" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-muted" />
          )}
        </button>

        {isPriceOpen && (
          <div className="mt-3 space-y-3">
            {/* Min and Max input fields */}
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <label className="text-[10px] text-muted block mb-1 font-sans">Min</label>
                <div className="relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted text-[11px]">₹</span>
                  <input
                    type="number"
                    min={minDataPrice}
                    max={maxDataPrice}
                    value={localMinPrice}
                    onChange={(e) => setLocalMinPrice(e.target.value)}
                    onBlur={handleApplyPrice}
                    onKeyDown={(e) => e.key === 'Enter' && handleApplyPrice()}
                    className="w-full h-7 pl-5 pr-1 text-xs rounded-md border border-border dark:border-border bg-surface dark:bg-surface font-sans text-main dark:text-main focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <span className="text-muted self-end mb-1.5">–</span>
              <div className="flex-1">
                <label className="text-[10px] text-muted block mb-1 font-sans">Max</label>
                <div className="relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted text-[11px]">₹</span>
                  <input
                    type="number"
                    min={minDataPrice}
                    max={maxDataPrice}
                    value={localMaxPrice}
                    onChange={(e) => setLocalMaxPrice(e.target.value)}
                    onBlur={handleApplyPrice}
                    onKeyDown={(e) => e.key === 'Enter' && handleApplyPrice()}
                    className="w-full h-7 pl-5 pr-1 text-xs rounded-md border border-border dark:border-border bg-surface dark:bg-surface font-sans text-main dark:text-main focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>

            {/* Slider for interactive scrubbing */}
            <div>
              <input
                type="range"
                min={minDataPrice}
                max={maxDataPrice}
                step={Math.max(100, Math.floor((maxDataPrice - minDataPrice) / 100))}
                value={Number(localMaxPrice) || maxDataPrice}
                onChange={handleSliderChange}
                className="w-full accent-primary cursor-pointer"
                aria-label="Max price slider"
              />
              <div className="flex justify-between text-[10px] font-sans text-muted mt-0.5">
                <span>{formatPrice(minDataPrice)}</span>
                <span>{formatPrice(maxDataPrice)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Availability Section (Collapsed by default) */}
      <div className="border-b border-border dark:border-border pb-4">
        <button
          type="button"
          onClick={() => setIsAvailabilityOpen((prev) => !prev)}
          className="w-full flex items-center justify-between font-bold uppercase tracking-wider text-main dark:text-main font-sans text-[11px] min-h-10 py-1 text-left"
          aria-expanded={isAvailabilityOpen}
        >
          <span className="flex items-center gap-1.5">
            <span>Availability</span>
            {inStockOnly && (
              <span className="text-[10px] text-accent dark:text-accent font-sans lowercase">
                (in stock)
              </span>
            )}
          </span>
          {isAvailabilityOpen ? (
            <ChevronUp className="w-3.5 h-3.5 text-muted" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-muted" />
          )}
        </button>

        {isAvailabilityOpen && (
          <div className="mt-2.5">
            <label className="flex items-center justify-between min-h-10 px-2 py-1.5 rounded-md cursor-pointer text-main dark:text-main hover:bg-surface-soft dark:hover:bg-surface-elevated transition-colors">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => onToggleInStock(e.target.checked)}
                  className="rounded border-border dark:border-border text-accent focus:ring-focus h-3.5 w-3.5"
                />
                <span>In stock only</span>
              </div>
              <span className="text-[10px] text-muted font-sans">
                {inStockCount}
              </span>
            </label>
          </div>
        )}
      </div>

      {/* Reset all button at the bottom */}
      {activeFilterCount > 0 && (
        <button
          type="button"
          onClick={onClearAll}
          className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-danger-ink dark:text-danger-ink bg-danger/10 dark:bg-danger/10 rounded-lg border border-danger dark:border-danger/40 hover:bg-danger/10 dark:hover:bg-danger/10 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Filters ({activeFilterCount})</span>
        </button>
      )}
    </div>
  );
};
