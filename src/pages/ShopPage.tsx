import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { filterAndSortProducts } from '../features/catalog/filterUtils';
import { ShopHeader } from '../features/catalog/ShopHeader';
import { ShopSortControls } from '../features/catalog/ShopSortControls';
import { ActiveFilterChips } from '../features/catalog/ActiveFilterChips';
import { FilterSidebar } from '../features/catalog/FilterSidebar';
import { MobileFilterDrawer } from '../features/catalog/MobileFilterDrawer';
import { ProductGrid } from '../features/catalog/ProductGrid';
import { EmptyResultsState } from '../features/catalog/EmptyResultsState';

const DEFAULT_MAX_PRICE = 500000;

export const ShopPage: React.FC = () => {
  const { products, categories, brands } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL search params
  const activeCategory = searchParams.get('category') || '';
  const activeSubcategory = searchParams.get('subcategory') || '';
  const activeBrand = searchParams.get('brand') || '';
  const activeSeries = searchParams.get('series') || '';
  const activeSearch = searchParams.get('q') || '';
  const isDealOnly = searchParams.get('deal') === 'true';
  const isBestsellerOnly = searchParams.get('bestseller') === 'true';
  const isFeaturedOnly = searchParams.get('featured') === 'true';
  const isSaleOnly = searchParams.get('sale') === 'true';
  const requestedMinPrice = Number(searchParams.get('minPrice'));
  const requestedMaxPrice = Number(searchParams.get('maxPrice'));
  const minPriceParam = Number.isFinite(requestedMinPrice) ? Math.max(0, Math.min(DEFAULT_MAX_PRICE, requestedMinPrice)) : 0;
  const maxPriceParam = Number.isFinite(requestedMaxPrice) && requestedMaxPrice > 0
    ? Math.max(minPriceParam, Math.min(DEFAULT_MAX_PRICE, requestedMaxPrice))
    : DEFAULT_MAX_PRICE;
  const inStockOnly = searchParams.get('inStock') === 'true';
  const sortBy = searchParams.get('sort') || 'featured';

  // Mobile drawer state
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Price slider local state
  const [priceRange, setPriceRange] = useState<[number, number]>([minPriceParam, maxPriceParam]);

  useEffect(() => {
    setPriceRange([minPriceParam, maxPriceParam]);
  }, [minPriceParam, maxPriceParam]);

  // Update URL search parameters
  const updateFilter = (key: string, value: string | null) => {
    const next = new URLSearchParams(searchParams);
    if (key === 'price') {
      next.delete('minPrice');
      next.delete('maxPrice');
    } else if (value === null || value === '' || (key === 'deal' && value === 'false')) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
    setPriceRange([0, DEFAULT_MAX_PRICE]);
  };

  const handlePriceChange = (max: number) => {
    setPriceRange([priceRange[0], max]);
    updateFilter('maxPrice', max >= DEFAULT_MAX_PRICE ? null : max.toString());
  };

  // Find active category
  const currentCategory = categories.find((c) => c.id === activeCategory);

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (activeCategory) count++;
    if (activeSubcategory) count++;
    if (activeBrand) count++;
    if (activeSeries) count++;
    if (isDealOnly) count++;
    if (isBestsellerOnly) count++;
    if (isFeaturedOnly) count++;
    if (isSaleOnly) count++;
    if (inStockOnly) count++;
    if (priceRange[0] > 0 || priceRange[1] < DEFAULT_MAX_PRICE) count++;
    if (activeSearch) count++;
    return count;
  }, [
    activeCategory,
    activeSubcategory,
    activeBrand,
    activeSeries,
    isDealOnly,
    isBestsellerOnly,
    isFeaturedOnly,
    isSaleOnly,
    inStockOnly,
    priceRange,
    activeSearch,
  ]);

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    return filterAndSortProducts(products, {
      searchQuery: activeSearch,
      category: activeCategory,
      subcategory: activeSubcategory,
      brand: activeBrand,
      series: activeSeries,
      isDealOnly,
      isBestsellerOnly,
      isFeaturedOnly,
      isSaleOnly,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      inStockOnly,
      sortBy,
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
    isFeaturedOnly,
    isSaleOnly,
    priceRange,
    inStockOnly,
    sortBy,
  ]);

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-900/50 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <ShopHeader
          currentCategory={currentCategory}
          totalCount={filteredProducts.length}
          activeFilterCount={activeFilterCount}
          onOpenMobileFilters={() => setIsMobileFiltersOpen(true)}
        />

        {/* Catalog Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-1 bg-white dark:bg-slate-850 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs sticky top-24">
            <FilterSidebar
              categories={categories}
              brands={brands}
              products={products}
              activeCategory={activeCategory}
              activeSubcategory={activeSubcategory}
              activeBrand={activeBrand}
              activeSeries={activeSeries}
              inStockOnly={inStockOnly}
              isDealOnly={isDealOnly}
              priceRange={priceRange}
              onPriceChange={handlePriceChange}
              onFilterChange={updateFilter}
              onClearAll={clearAllFilters}
              activeFilterCount={activeFilterCount}
            />
          </aside>

          {/* Product Grid Area */}
          <main className="lg:col-span-3 xl:col-span-4">
            {/* Sort & Count Controls */}
            <ShopSortControls
              sortBy={sortBy}
              onSortChange={(val) => updateFilter('sort', val)}
              resultCount={filteredProducts.length}
            />

            {/* Active Filter Chips */}
            <ActiveFilterChips
              activeSearch={activeSearch}
              activeCategory={activeCategory}
              activeSubcategory={activeSubcategory}
              activeBrand={activeBrand}
              activeSeries={activeSeries}
              isDealOnly={isDealOnly}
              isBestsellerOnly={isBestsellerOnly}
              isFeaturedOnly={isFeaturedOnly}
              isSaleOnly={isSaleOnly}
              inStockOnly={inStockOnly}
              minPrice={priceRange[0]}
              maxPrice={priceRange[1]}
              categories={categories}
              brands={brands}
              onRemoveFilter={(key) => updateFilter(key, null)}
              onClearAll={clearAllFilters}
            />

            {/* Products or Empty State */}
            {filteredProducts.length > 0 ? (
              <ProductGrid products={filteredProducts} />
            ) : (
              <EmptyResultsState
                onReset={clearAllFilters}
                searchQuery={activeSearch}
              />
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      <MobileFilterDrawer
        isOpen={isMobileFiltersOpen}
        onClose={() => setIsMobileFiltersOpen(false)}
        categories={categories}
        brands={brands}
        products={products}
        activeCategory={activeCategory}
        activeSubcategory={activeSubcategory}
        activeBrand={activeBrand}
        activeSeries={activeSeries}
        inStockOnly={inStockOnly}
        isDealOnly={isDealOnly}
        priceRange={priceRange}
        onPriceChange={handlePriceChange}
        onFilterChange={updateFilter}
        onClearAll={clearAllFilters}
        activeFilterCount={activeFilterCount}
        totalFilteredCount={filteredProducts.length}
      />
    </div>
  );
};
