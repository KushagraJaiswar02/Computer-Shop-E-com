import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  SlidersHorizontal,
  X,
  Search,
  RotateCcw,
  ChevronDown,
  Filter,
  Check,
  Laptop,
  Cpu,
  Layers,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/product/ProductCard';
import { KeycapButton } from '../components/common/KeycapButton';
import { KeyBadge } from '../components/common/KeyBadge';

export const ShopPage: React.FC = () => {
  const { products, categories, brands } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  // Active filter states from URL search params
  const activeCategory = searchParams.get('category') || '';
  const activeSubcategory = searchParams.get('subcategory') || '';
  const activeBrand = searchParams.get('brand') || '';
  const activeSeries = searchParams.get('series') || '';
  const activeSearch = searchParams.get('q') || '';
  const isDealOnly = searchParams.get('deal') === 'true';
  const isBestsellerOnly = searchParams.get('bestseller') === 'true';
  const minPriceParam = Number(searchParams.get('minPrice')) || 0;
  const maxPriceParam = Number(searchParams.get('maxPrice')) || 5000;
  const inStockOnly = searchParams.get('inStock') === 'true';
  const sortBy = searchParams.get('sort') || 'featured';

  // Mobile filters drawer open/close
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Local state for price range sliders
  const [priceRange, setPriceRange] = useState<[number, number]>([minPriceParam, maxPriceParam]);

  useEffect(() => {
    setPriceRange([minPriceParam, maxPriceParam]);
  }, [minPriceParam, maxPriceParam]);

  // Update URL param helper
  const updateFilter = (key: string, value: string | null) => {
    const next = new URLSearchParams(searchParams);
    if (value === null || value === '' || (key === 'deal' && value === 'false')) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
    setPriceRange([0, 5000]);
  };

  // Find active category object for tech filter extraction
  const currentCategoryObj = categories.find(c => c.id === activeCategory);

  // Dynamic list of unique brands available in the catalog or active category
  const availableBrands = useMemo(() => {
    if (!activeCategory) return brands;
    const catProducts = products.filter(p => p.categoryId === activeCategory);
    const brandIds = new Set(catProducts.map(p => p.brandId));
    return brands.filter(b => brandIds.has(b.id));
  }, [activeCategory, brands, products]);

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Search query
      if (activeSearch) {
        const query = activeSearch.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesBrand = product.brandName.toLowerCase().includes(query);
        const matchesCategory = product.categoryName.toLowerCase().includes(query);
        const matchesSku = product.sku.toLowerCase().includes(query);
        const matchesAttrs = product.attributes.some(a => a.value.toLowerCase().includes(query));
        if (!matchesName && !matchesBrand && !matchesCategory && !matchesSku && !matchesAttrs) {
          return false;
        }
      }

      // Category filter
      if (activeCategory && product.categoryId !== activeCategory) {
        return false;
      }

      // Subcategory filter
      if (activeSubcategory && product.subcategoryId !== activeSubcategory) {
        return false;
      }

      // Brand filter
      if (activeBrand && product.brandId !== activeBrand) {
        return false;
      }

      // Series filter
      if (activeSeries && product.seriesId !== activeSeries) {
        return false;
      }

      // Deal filter
      if (isDealOnly && !product.isDeal && (!product.discountPercent || product.discountPercent <= 0)) {
        return false;
      }

      // Bestseller filter
      if (isBestsellerOnly && !product.isBestseller) {
        return false;
      }

      // Price filter
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false;
      }

      // In-stock only filter
      if (inStockOnly && product.stockStatus === 'out_of_stock') {
        return false;
      }

      return true;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'discount':
          return (b.discountPercent || 0) - (a.discountPercent || 0);
        default:
          return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      }
    });
  }, [
    products,
    activeSearch,
    activeCategory,
    activeSubcategory,
    activeBrand,
    activeSeries,
    isDealOnly,
    isBestsellerOnly,
    priceRange,
    inStockOnly,
    sortBy,
  ]);

  // Count active filter pills
  const activeFilterCount =
    (activeCategory ? 1 : 0) +
    (activeSubcategory ? 1 : 0) +
    (activeBrand ? 1 : 0) +
    (activeSeries ? 1 : 0) +
    (activeSearch ? 1 : 0) +
    (isDealOnly ? 1 : 0) +
    (isBestsellerOnly ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 5000 ? 1 : 0);

  // Render Sidebar Filters Content
  const renderFilterPanel = () => (
    <div className="space-y-6 text-sm">
      {/* Category Accordion / List */}
      <div>
        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white mb-2.5 font-mono">
          Hardware Category
        </h4>
        <div className="space-y-1">
          <button
            onClick={() => {
              updateFilter('category', null);
              updateFilter('subcategory', null);
            }}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-left text-xs transition-colors ${
              !activeCategory
                ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-surface-800'
            }`}
          >
            <span>All Hardware Categories</span>
            <span className="text-[10px] font-mono opacity-70">{products.length}</span>
          </button>

          {categories.map(cat => {
            const isCatActive = activeCategory === cat.id;
            const count = products.filter(p => p.categoryId === cat.id).length;
            return (
              <div key={cat.id} className="space-y-0.5">
                <button
                  onClick={() => {
                    updateFilter('category', isCatActive ? null : cat.id);
                    updateFilter('subcategory', null);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-left text-xs transition-colors ${
                    isCatActive
                      ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-surface-800'
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  <span className="text-[10px] font-mono opacity-70">{count}</span>
                </button>

                {/* Subcategories */}
                {isCatActive && (
                  <div className="pl-4 pr-1 py-1 space-y-0.5 border-l-2 border-brand-200 dark:border-brand-800 ml-2">
                    {cat.subcategories.map(sub => {
                      const isSubActive = activeSubcategory === sub.id;
                      return (
                        <button
                          key={sub.id}
                          onClick={() => updateFilter('subcategory', isSubActive ? null : sub.id)}
                          className={`w-full text-left text-[11px] py-1 px-2 rounded transition-colors ${
                            isSubActive
                              ? 'text-brand-600 dark:text-brand-400 font-bold bg-brand-50/50 dark:bg-brand-950/40'
                              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
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

      {/* Brand Selection */}
      <div className="pt-4 border-t border-slate-200 dark:border-surface-750">
        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white mb-2.5 font-mono">
          Brand
        </h4>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
          {availableBrands.map(b => {
            const isBrandActive = activeBrand === b.id;
            return (
              <button
                key={b.id}
                onClick={() => {
                  updateFilter('brand', isBrandActive ? null : b.id);
                  updateFilter('series', null);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-left text-xs transition-colors ${
                  isBrandActive
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-surface-800'
                }`}
              >
                <span>{b.name}</span>
                {isBrandActive && <Check className="w-3.5 h-3.5 text-brand-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Series Selection (when brand selected) */}
      {activeBrand && (
        <div className="pt-4 border-t border-slate-200 dark:border-surface-750">
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white mb-2 font-mono">
            Series & Lines
          </h4>
          <div className="space-y-1">
            {brands
              .find(b => b.id === activeBrand)
              ?.seriesList.map(s => {
                const isSeriesActive = activeSeries === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => updateFilter('series', isSeriesActive ? null : s.id)}
                    className={`w-full flex items-center justify-between px-2 py-1 text-xs rounded transition-colors ${
                      isSeriesActive
                        ? 'text-brand-600 dark:text-brand-400 font-bold bg-brand-50/50 dark:bg-brand-950/40'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    <span>{s.name}</span>
                  </button>
                );
              })}
          </div>
        </div>
      )}

      {/* Price Range Filter */}
      <div className="pt-4 border-t border-slate-200 dark:border-surface-750">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white font-mono">
            Price Range ($)
          </h4>
          <span className="text-[11px] font-mono text-slate-500">
            ${priceRange[0]} - ${priceRange[1]}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="4000"
          step="50"
          value={priceRange[1]}
          onChange={e => {
            const val = Number(e.target.value);
            setPriceRange([priceRange[0], val]);
            updateFilter('maxPrice', String(val));
          }}
          className="w-full accent-brand-600"
        />
        <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
          <span>$0</span>
          <span>$2,000</span>
          <span>$4,000+</span>
        </div>
      </div>

      {/* Stock & Specials Switches */}
      <div className="pt-4 border-t border-slate-200 dark:border-surface-750 space-y-2">
        <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={e => updateFilter('inStock', e.target.checked ? 'true' : null)}
            className="rounded text-brand-600 focus:ring-brand-500 dark:bg-surface-800 dark:border-surface-700"
          />
          <span>In Stock Items Only</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
          <input
            type="checkbox"
            checked={isDealOnly}
            onChange={e => updateFilter('deal', e.target.checked ? 'true' : null)}
            className="rounded text-brand-600 focus:ring-brand-500 dark:bg-surface-800 dark:border-surface-700"
          />
          <span>On Sale & Deals Only</span>
        </label>
      </div>

      {/* Reset button */}
      {activeFilterCount > 0 && (
        <div className="pt-4 border-t border-slate-200 dark:border-surface-750">
          <button
            onClick={clearAllFilters}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 rounded-lg border border-rose-200 dark:border-rose-900/50 hover:bg-rose-100 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters ({activeFilterCount})</span>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900 transition-colors py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2 font-mono">
            <Link to="/" className="hover:text-brand-600">Home</Link>
            <span>/</span>
            <span className="text-slate-800 dark:text-slate-200">Catalog</span>
            {currentCategoryObj && (
              <>
                <span>/</span>
                <span className="text-brand-600 dark:text-brand-400">{currentCategoryObj.name}</span>
              </>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {currentCategoryObj ? currentCategoryObj.name : 'Hardware Catalog'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {currentCategoryObj
                  ? currentCategoryObj.description
                  : 'Browse precision PC hardware, enterprise silicon, and enthusiast components.'}
              </p>
            </div>

            {/* Mobile Filter Button */}
            <div className="flex items-center gap-2 lg:hidden">
              <KeycapButton
                variant="secondary"
                size="sm"
                onClick={() => setIsMobileFiltersOpen(true)}
                className="w-full sm:w-auto"
              >
                <Filter className="w-4 h-4 mr-1.5" />
                <span>Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}</span>
              </KeycapButton>
            </div>
          </div>
        </div>

        {/* Active Filter Pills Bar */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-white dark:bg-surface-850 rounded-xl border border-slate-200 dark:border-surface-750 text-xs">
            <span className="text-slate-500 font-medium">Active filters:</span>
            {activeSearch && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-surface-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-surface-700 font-mono">
                Search: "{activeSearch}"
                <button onClick={() => updateFilter('q', null)}><X className="w-3 h-3 text-slate-400 hover:text-slate-600" /></button>
              </span>
            )}
            {activeCategory && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                {currentCategoryObj?.name}
                <button onClick={() => { updateFilter('category', null); updateFilter('subcategory', null); }}>
                  <X className="w-3 h-3 text-brand-400 hover:text-brand-600" />
                </button>
              </span>
            )}
            {activeSubcategory && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                Subcategory: {activeSubcategory}
                <button onClick={() => updateFilter('subcategory', null)}>
                  <X className="w-3 h-3 text-brand-400 hover:text-brand-600" />
                </button>
              </span>
            )}
            {activeBrand && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-surface-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-surface-700">
                Brand: {brands.find(b => b.id === activeBrand)?.name || activeBrand}
                <button onClick={() => { updateFilter('brand', null); updateFilter('series', null); }}>
                  <X className="w-3 h-3 text-slate-400 hover:text-slate-600" />
                </button>
              </span>
            )}
            {isDealOnly && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                On Sale
                <button onClick={() => updateFilter('deal', null)}>
                  <X className="w-3 h-3 text-amber-400 hover:text-amber-600" />
                </button>
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="text-slate-400 hover:text-rose-600 underline ml-auto text-[11px]"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Content Layout: Sidebar + Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Left Sidebar */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-32 bg-white dark:bg-surface-850 rounded-xl border border-slate-200 dark:border-surface-750 p-5 shadow-soft-card">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-surface-750">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    Filters & Facets
                  </span>
                </div>
                {activeFilterCount > 0 && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              {renderFilterPanel()}
            </div>
          </aside>

          {/* Right Product Grid Area */}
          <main className="lg:col-span-3">
            {/* Top Sort & Count Bar */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-surface-750 text-xs">
              <div className="text-slate-600 dark:text-slate-400">
                Showing{' '}
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {filteredProducts.length}
                </span>{' '}
                hardware products
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-slate-500 hidden sm:inline">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={e => updateFilter('sort', e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-surface-850 border border-slate-200 dark:border-surface-700 text-slate-800 dark:text-slate-200 font-medium text-xs shadow-keycap focus:outline-none focus:ring-2 focus:ring-brand-500"
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

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
              <div className="py-16 text-center bg-white dark:bg-surface-850 rounded-xl border border-slate-200 dark:border-surface-750 p-8 shadow-soft-card">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-surface-800 flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                  No hardware matches current criteria
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
                  Try clearing some filters, widening the price range, or searching for broader terms like "ASUS", "DDR5", or "RTX".
                </p>
                <KeycapButton variant="secondary" onClick={clearAllFilters}>
                  Clear All Filters
                </KeycapButton>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Drawer Modal */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs"
            onClick={() => setIsMobileFiltersOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white dark:bg-surface-850 shadow-2xl p-5 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-surface-750 mb-4">
                <span className="font-bold text-slate-900 dark:text-white">Filters</span>
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {renderFilterPanel()}
            </div>
            <div className="pt-4 border-t border-slate-200 dark:border-surface-750 mt-6">
              <KeycapButton
                variant="primary"
                className="w-full"
                onClick={() => setIsMobileFiltersOpen(false)}
              >
                Apply Filters ({filteredProducts.length} Results)
              </KeycapButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
