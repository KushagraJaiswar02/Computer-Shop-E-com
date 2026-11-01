import React, { useMemo } from 'react';
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/product/ProductCard';
import { MotionList, productKey } from '../components/motion/MotionList';
import { Product } from '../types';
import { formatPrice } from '../lib/utils';
import { getBrandHref, getBrandProductGroups, getPriceRange } from '../features/catalog/seriesUtils';

const productCount = (count: number) => `${count} ${count === 1 ? 'product' : 'products'}`;

const BrandProductGrid: React.FC<{ products: Product[] }> = ({ products }) => (
  <MotionList items={products} itemKey={productKey} entranceId="brand-products" className="grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 min-[1700px]:grid-cols-5">
    {product => <ProductCard product={product} />}
  </MotionList>
);

export const BrandPage: React.FC = () => {
  const { brandSlug, brandId, seriesId } = useParams<{ brandSlug: string; brandId: string; seriesId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { brands, products } = useStore();
  const brand = brands.find(item => brandSlug ? item.slug === brandSlug : item.id === brandId);
  const brandProducts = useMemo(() => products.filter(product => product.brandId === brand?.id), [products, brand?.id]);
  const groups = useMemo(() => getBrandProductGroups(brandProducts, brand?.id || ''), [brandProducts, brand?.id]);
  const seriesGroups = groups.filter(group => group.series !== null);
  const selectedSeries = searchParams.get('series') || '';
  const selectedGroup = groups.find(group => group.series === selectedSeries);
  const range = getPriceRange(brandProducts);

  if (!brand) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold text-main dark:text-main mb-2">Brand Not Found</h1>
        <p className="text-sm text-muted dark:text-muted mb-6">The requested hardware brand does not exist.</p>
        <Link to="/brands" className="inline-flex min-h-10 items-center text-accent dark:text-accent hover:underline">Back to Brands</Link>
      </div>
    );
  }

  // Preserve old brand URLs while directing browsing to the canonical slug route.
  if (!brandSlug) {
    const legacyNames = [...new Set(brandProducts.filter(product => product.seriesId === seriesId).map(product => product.series?.trim()).filter(Boolean))];
    return <Navigate replace to={getBrandHref(brand, seriesId && legacyNames.length === 1 ? legacyNames[0] : selectedSeries)} />;
  }

  const selectSeries = (series: string | null) => {
    const next = new URLSearchParams(searchParams);
    if (series) next.set('series', series);
    else next.delete('series');
    setSearchParams(next);
  };

  return (
    <div className="min-h-screen bg-background dark:bg-background py-6 sm:py-8">
      <div className="shop-container ">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-muted dark:text-muted mb-4 font-sans">
          <Link to="/" className="hover:text-accent">Home</Link>
          <span aria-hidden="true">/</span>
          <Link to="/brands" className="hover:text-accent">Brands</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="text-main dark:text-main">{brand.name}</span>
        </nav>

        <header className="rounded-xl border border-border dark:border-border bg-surface dark:bg-surface p-4 sm:p-5 mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-main dark:text-main">{brand.name}</h1>
          {brand.description?.trim() && <p className="mt-2 text-sm text-muted dark:text-main">{brand.description}</p>}
          <p className="mt-3 text-sm font-medium text-muted dark:text-main">
            {productCount(brandProducts.length)}
            {range && <span className="font-sans"> · {formatPrice(range.min)}{range.max > range.min ? ` – ${formatPrice(range.max)}` : ''}</span>}
          </p>
        </header>

        {seriesGroups.length > 0 && (
          <nav aria-label={`${brand.name} series`} className="sticky top-[114px] xl:top-[92px] z-30 mb-6 flex gap-2 overflow-x-auto border-b border-border dark:border-border bg-background/95 dark:bg-background/95 py-3 backdrop-blur">
            {[{ name: 'All', series: null, count: brandProducts.length }, ...seriesGroups].map(group => {
              const active = group.series === null ? !selectedSeries : selectedSeries === group.series;
              return (
                <button
                  key={group.series || 'all'}
                  type="button"
                  aria-pressed={active}
                  onClick={() => selectSeries(group.series)}
                  className={`inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full border px-3 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus ${active ? 'border-primary bg-primary text-on-primary' : 'border-border dark:border-border bg-surface dark:bg-surface text-main dark:text-main hover:border-primary'}`}
                >
                  {group.name}<span className="font-sans opacity-80">{group.count}</span>
                </button>
              );
            })}
          </nav>
        )}

        {brandProducts.length === 0 ? (
          <div className="rounded-xl border border-border dark:border-border bg-surface dark:bg-surface p-8 text-center">
            <h2 className="text-lg font-semibold text-main dark:text-main">More hardware is on the way</h2>
            <p className="mt-2 text-sm text-muted dark:text-main">There are no {brand.name} products in the catalog yet.</p>
            <Link to="/brands" className="mt-4 inline-flex min-h-10 items-center text-accent dark:text-accent hover:underline">Explore other brands</Link>
          </div>
        ) : selectedSeries && seriesGroups.length > 0 && !selectedGroup ? (
          <div className="py-10 text-center text-muted dark:text-main">
            <p>No products found in this series.</p>
            <button type="button" onClick={() => selectSeries(null)} className="mt-3 min-h-10 text-accent dark:text-accent hover:underline">View all {brand.name} products</button>
          </div>
        ) : selectedGroup ? (
          <BrandProductGrid products={selectedGroup.products} />
        ) : seriesGroups.length === 0 ? (
          <BrandProductGrid products={brandProducts} />
        ) : (
          <div className="space-y-8">
            {groups.map(group => (
              <section key={group.series || 'other'} aria-label={group.name}>
                <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="text-lg font-bold text-main dark:text-main">{group.name}</h2>
                  <p className="text-xs text-muted dark:text-muted">{productCount(group.count)} · from <span className="font-sans price">{formatPrice(group.minPrice)}</span></p>
                </div>
                <BrandProductGrid products={group.products} />
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
