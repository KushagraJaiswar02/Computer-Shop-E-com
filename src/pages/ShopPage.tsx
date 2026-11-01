import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { filterAndSortProducts } from '../features/catalog/filterUtils';
import { ShopHeader } from '../features/catalog/ShopHeader';
import { CategoryChipBar } from '../features/catalog/CategoryChipBar';
import { ActiveFilterChips } from '../features/catalog/ActiveFilterChips';
import { FilterSidebar } from '../features/catalog/FilterSidebar';
import { MobileFilterDrawer } from '../features/catalog/MobileFilterDrawer';
import { ProductGrid } from '../features/catalog/ProductGrid';
import { EmptyResultsState } from '../features/catalog/EmptyResultsState';

const PAGE_SIZE = 24;

export const ShopPage: React.FC = () => {
  const { products, categories, brands, homepageConfig } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  // Derive dynamic price bounds from the product catalog data
  const allPrices = useMemo(() => {
    return products.map((p) => p.price).filter((p) => Number.isFinite(p) && p >= 0);
  }, [products]);

  const minDataPrice = useMemo(() => {
    return allPrices.length > 0 ? Math.floor(Math.min(...allPrices)) : 0;
  }, [allPrices]);

  const maxDataPrice = useMemo(() => {
    return allPrices.length > 0 ? Math.ceil(Math.max(...allPrices)) : 500000;
  }, [allPrices]);

  // Read URL search params
  const activeCategory = searchParams.get('category') || '';
  const activeSubcategory = searchParams.get('subcategory') || '';
  const activeSearch = searchParams.get('q') || '';
  const isDealOnly = searchParams.get('deal') === 'true';
  const inStockOnly = searchParams.get('inStock') === 'true';
  const sortBy = searchParams.get('sort') || 'featured';

  // Multi-brand selection support from URL (e.g., ?brand=asus,msi)
  const rawBrand = searchParams.get('brand') || '';
  const activeBrands = useMemo(() => {
    if (!rawBrand) return [];
    return rawBrand.split(',').map((b) => b.trim()).filter(Boolean);
  }, [rawBrand]);

  // Price parameters parsed against data bounds
  const requestedMinPrice = searchParams.get('minPrice');
  const requestedMaxPrice = searchParams.get('maxPrice');

  const minPriceParam = requestedMinPrice !== null && !isNaN(Number(requestedMinPrice))
    ? Math.max(minDataPrice, Number(requestedMinPrice))
    : minDataPrice;

  const maxPriceParam = requestedMaxPrice !== null && !isNaN(Number(requestedMaxPrice))
    ? Math.min(maxDataPrice, Math.max(minPriceParam, Number(requestedMaxPrice)))
    : maxDataPrice;

  // Local price range state
  const [priceRange, setPriceRange] = useState<[number, number]>([minPriceParam, maxPriceParam]);

  useEffect(() => {
    setPriceRange([minPriceParam, maxPriceParam]);
  }, [minPriceParam, maxPriceParam]);

  // Mobile drawer state
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Pagination / Load more state
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);

  // Reset pagination whenever filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [
    activeCategory,
    activeSubcategory,
    rawBrand,
    activeSearch,
    isDealOnly,
    inStockOnly,
    minPriceParam,
    maxPriceParam,
    sortBy,
  ]);

  // Update URL search parameters
  const updateFilter = (key: string, value: string | null) => {
    const next = new URLSearchParams(searchParams);
    if (key === 'price') {
      next.delete('minPrice');
      next.delete('maxPrice');
    } else if (value === null || value === '' || (key === 'deal' && value === 'false') || (key === 'inStock' && value === 'false')) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next);
  };

  // Toggle multi-select brand
  const handleToggleBrand = (brandId: string) => {
    const nextBrands = new Set(activeBrands);
    if (nextBrands.has(brandId)) nextBrands.delete(brandId);
    else nextBrands.add(brandId);
    updateFilter('brand', Array.from(nextBrands).join(',') || null);
  };

  // Select category chip
  const handleSelectCategory = (categoryId: string | null) => {
    const next = new URLSearchParams(searchParams);
    if (!categoryId) {
      next.delete('category');
      next.delete('subcategory');
    } else {
      next.set('category', categoryId);
      next.delete('subcategory');
    }
    setSearchParams(next);
  };

  // Price range change
  const handlePriceChange = (min: number, max: number) => {
    setPriceRange([min, max]);
    const next = new URLSearchParams(searchParams);
    if (min > minDataPrice) next.set('minPrice', min.toString());
    else next.delete('minPrice');

    if (max < maxDataPrice) next.set('maxPrice', max.toString());
    else next.delete('maxPrice');

    setSearchParams(next);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
    setPriceRange([minDataPrice, maxDataPrice]);
  };

  // Clear search query specifically
  const clearSearch = () => {
    updateFilter('q', null);
  };

  // Remove specific filter from chip
  const handleRemoveFilter = (key: string, value?: string) => {
    if (key === 'brand' && value) {
      handleToggleBrand(value);
    } else {
      updateFilter(key, null);
    }
  };

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (activeCategory) count++;
    if (activeSubcategory) count++;
    count += activeBrands.length;
    if (isDealOnly) count++;
    if (inStockOnly) count++;
    if (priceRange[0] > minDataPrice || priceRange[1] < maxDataPrice) count++;
    if (activeSearch) count++;
    return count;
  }, [
    activeCategory,
    activeSubcategory,
    activeBrands.length,
    isDealOnly,
    inStockOnly,
    priceRange,
    minDataPrice,
    maxDataPrice,
    activeSearch,
  ]);

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    return filterAndSortProducts(products, {
      searchQuery: activeSearch,
      category: activeCategory,
      subcategory: activeSubcategory,
      brand: activeBrands,
      isDealOnly,
      dealProductIds: homepageConfig.dealProductIds,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      inStockOnly,
      sortBy,
    });
  }, [
    products,
    homepageConfig.dealProductIds,
    activeSearch,
    activeCategory,
    activeSubcategory,
    activeBrands,
    isDealOnly,
    priceRange,
    inStockOnly,
    sortBy,
  ]);

  // Visible products for "Load More" pagination
  const visibleProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  const hasMore = visibleCount < filteredProducts.length;

  return (
    <div className="min-h-screen bg-surface-soft/70 dark:bg-surface/50 py-5 sm:py-7">
      <div className="shop-container ">
        {/* 1. Compact Header */}
        <ShopHeader
          totalCount={filteredProducts.length}
          sortBy={sortBy}
          onSortChange={(val) => updateFilter('sort', val)}
          activeFilterCount={activeFilterCount}
          onOpenMobileFilters={() => setIsMobileFiltersOpen(true)}
        />

        {/* 2. Horizontally scrollable row of Category Chips above the grid */}
        <CategoryChipBar
          categories={categories}
          products={products}
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
        />

        {/* Catalog Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-7 items-start">
          {/* 3. Desktop Left Sidebar Filters */}
          <aside className="hidden lg:block lg:col-span-1 bg-surface dark:bg-surface p-4 rounded-xl border border-border dark:border-border shadow-xs sticky top-24">
            <FilterSidebar
              brands={brands}
              products={products}
              activeBrands={activeBrands}
              onToggleBrand={handleToggleBrand}
              inStockOnly={inStockOnly}
              onToggleInStock={(val) => updateFilter('inStock', val ? 'true' : null)}
              priceRange={priceRange}
              minDataPrice={minDataPrice}
              maxDataPrice={maxDataPrice}
              onPriceChange={handlePriceChange}
              onClearAll={clearAllFilters}
              activeFilterCount={activeFilterCount}
            />
          </aside>

          {/* Product Grid Area */}
          <main className="lg:col-span-3 xl:col-span-4 min-w-0">
            {/* Active Filter Chips */}
            <ActiveFilterChips
              activeSearch={activeSearch}
              activeCategory={activeCategory}
              activeSubcategory={activeSubcategory}
              activeBrands={activeBrands}
              inStockOnly={inStockOnly}
              isDealOnly={isDealOnly}
              minPrice={priceRange[0]}
              maxPrice={priceRange[1]}
              minDataPrice={minDataPrice}
              maxDataPrice={maxDataPrice}
              categories={categories}
              brands={brands}
              onRemoveFilter={handleRemoveFilter}
              onClearAll={clearAllFilters}
            />

            {/* Products Grid or Empty State */}
            {filteredProducts.length > 0 ? (
              <ProductGrid
                products={visibleProducts}
                hasMore={hasMore}
                onLoadMore={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                totalCount={filteredProducts.length}
              />
            ) : (
              <EmptyResultsState
                searchQuery={activeSearch}
                onClearSearch={clearSearch}
                onReset={clearAllFilters}
              />
            )}
          </main>
        </div>
      </div>

      {/* 3. Mobile Filters Bottom Drawer Sheet */}
      <MobileFilterDrawer
        isOpen={isMobileFiltersOpen}
        onClose={() => setIsMobileFiltersOpen(false)}
        brands={brands}
        products={products}
        activeBrands={activeBrands}
        onToggleBrand={handleToggleBrand}
        inStockOnly={inStockOnly}
        onToggleInStock={(val) => updateFilter('inStock', val ? 'true' : null)}
        priceRange={priceRange}
        minDataPrice={minDataPrice}
        maxDataPrice={maxDataPrice}
        onPriceChange={handlePriceChange}
        onClearAll={clearAllFilters}
        activeFilterCount={activeFilterCount}
        totalFilteredCount={filteredProducts.length}
      />
    </div>
  );
};
