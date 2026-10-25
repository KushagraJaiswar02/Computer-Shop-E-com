import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Layers } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const BrandsSection: React.FC = () => {
  const { brands } = useStore();

  return (
    <section className="py-12 sm:py-16 bg-white dark:bg-surface-900 border-b border-slate-200 dark:border-surface-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Direct Manufacturer Partners</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Shop by Authorized Brand
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Direct authorized partner with guaranteed authentic warranties and factory RMA support.
            </p>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 transition-colors"
          >
            <span>All Partner Brands</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {brands.map(brand => (
            <Link
              key={brand.id}
              to={`/brand/${brand.id}`}
              className="group bg-slate-50 dark:bg-surface-850 rounded-xl border border-slate-200 dark:border-surface-750 p-5 flex flex-col justify-between hover:border-brand-500 dark:hover:border-brand-500 hover:shadow-soft-card transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-base sm:text-lg font-black tracking-tight font-mono text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {brand.name}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white dark:bg-surface-800 text-slate-500 border border-slate-200 dark:border-surface-700">
                    {brand.seriesList.length} Series
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {brand.description}
                </p>

                {/* Series tags preview */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {brand.seriesList.slice(0, 3).map(series => (
                    <span
                      key={series.id}
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white dark:bg-surface-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-surface-700"
                    >
                      {series.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-surface-750 flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300 group-hover:text-brand-600 dark:group-hover:text-brand-400">
                <span>View Brand Series</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
