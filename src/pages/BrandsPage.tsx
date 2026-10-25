import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Tag } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const BrandsPage: React.FC = () => {
  const { brands, products } = useStore();

  return (
    <div className="min-h-screen bg-surface-50 py-8 transition-colors dark:bg-surface-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300"><Tag className="h-4 w-4" />Catalog directory · demo data</div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Shop by Brand</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Choose a manufacturer to browse its products and available series.</p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map((brand) => {
            const productCount = products.filter((product) => product.brandId === brand.id).length;
            return (
              <article key={brand.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-colors hover:border-blue-300 dark:border-slate-800 dark:bg-surface-850 dark:hover:border-blue-800">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">{brand.name}</h2>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{brand.description}</p>
                  </div>
                  <span className="shrink-0 rounded-lg bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{productCount} products</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {brand.seriesList.map((series) => <Link key={series.id} to={`/brand/${brand.id}/${series.id}`} className="rounded-full border border-slate-200 px-2.5 py-1 text-xs text-slate-600 hover:border-blue-300 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-slate-700 dark:text-slate-300 dark:hover:text-blue-300">{series.name}</Link>)}
                </div>
                <Link to={`/brand/${brand.id}`} className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-300">Browse {brand.name}<ArrowRight className="h-3.5 w-3.5" /></Link>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
};
