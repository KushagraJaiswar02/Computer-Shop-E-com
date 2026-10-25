import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/product/ProductCard';
import { ArrowRight, Tag } from 'lucide-react';

export const BrandPage: React.FC = () => {
  const { brandId, seriesId } = useParams<{ brandId: string; seriesId?: string }>();
  const { brands, products } = useStore();

  const brand = brands.find(b => b.id === brandId);

  if (!brand) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Brand Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">The requested hardware brand does not exist.</p>
        <Link to="/shop" className="text-brand-600 hover:underline">
          Return to full catalog
        </Link>
      </div>
    );
  }

  const activeSeries = brand.seriesList.find(s => s.id === seriesId);

  let brandProducts = products.filter(p => p.brandId === brand.id);
  if (seriesId) {
    brandProducts = brandProducts.filter(p => p.seriesId === seriesId);
  }

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900 py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-4 font-mono">
          <Link to="/" className="hover:text-brand-600">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-brand-600">Brands</Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-white font-semibold">{brand.name}</span>
          {activeSeries && (
            <>
              <span>/</span>
              <span className="text-brand-600 dark:text-brand-400">{activeSeries.name}</span>
            </>
          )}
        </div>

        {/* Brand Header Banner */}
        <div className="rounded-2xl bg-slate-900 text-white p-6 sm:p-10 mb-8 border border-slate-800">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-brand-400 font-bold mb-1">
              <Tag className="w-4 h-4" />
              <span>Brand catalog · demonstration data</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
              {brand.name} {activeSeries ? `• ${activeSeries.name}` : ''}
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              {activeSeries?.description || activeSeries?.tagline || brand.description}
            </p>

            {/* Series selector pills */}
            <div className="flex flex-wrap gap-2">
              <Link
                to={`/brand/${brand.id}`}
                className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                  !seriesId
                    ? 'bg-brand-600 border-brand-500 text-white shadow-keycap'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
              >
                All {brand.name} Products
              </Link>
              {brand.seriesList.map(s => {
                const isActive = seriesId === s.id;
                return (
                  <Link
                    key={s.id}
                    to={`/brand/${brand.id}/${s.id}`}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                      isActive
                        ? 'bg-brand-600 border-brand-500 text-white shadow-keycap'
                        : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {s.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="mb-6 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div>
            Showing <span className="font-mono font-bold text-slate-900 dark:text-white">{brandProducts.length}</span> components from {brand.name}
          </div>
          <Link
            to={`/shop?brand=${brand.id}`}
            className="text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 font-semibold"
          >
            <span>Filter in Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {brandProducts.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-surface-850 rounded-xl border border-slate-200 dark:border-surface-750">
            <p className="text-slate-600 dark:text-slate-300 font-medium">No items found in this brand series.</p>
            <Link to={`/brand/${brand.id}`} className="text-xs text-brand-600 hover:underline mt-2 inline-block">
              View all {brand.name}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {brandProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
