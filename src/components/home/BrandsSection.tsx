import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const BrandsSection: React.FC = () => {
  const { brands } = useStore();

  return (
    <section className="border-b border-slate-200/80 bg-slate-50/50 py-7 transition-colors dark:border-slate-800/80 dark:bg-slate-900/35 sm:py-9">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between gap-4 sm:mb-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
              Shop by Brand
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Original hardware from leading manufacturers
            </p>
          </div>
          <Link
            to="/brands"
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>All Brands</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-8">
          {brands.map(brand => (
            <Link
              key={brand.id}
              to={`/brand/${brand.id}`}
              className="group flex min-h-24 flex-col items-center justify-center rounded-lg border border-slate-200 bg-white/90 p-3 text-center transition-all hover:border-blue-400 hover:shadow-sm dark:border-slate-800 dark:bg-surface-850/90 sm:p-4"
            >
              <span className="flex min-h-9 items-center justify-center text-sm font-bold font-mono tracking-tight text-slate-800 transition-colors group-hover:text-blue-600 dark:text-slate-200 dark:group-hover:text-blue-400">
                {brand.name}
              </span>
              <span className="text-[10px] text-slate-400 mt-1">
                {brand.seriesList.length} Series
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
