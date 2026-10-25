import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const BrandsSection: React.FC = () => {
  const { brands } = useStore();

  return (
    <section className="py-10 sm:py-12 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Shop by Brand
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Original hardware from leading manufacturers
            </p>
          </div>
          <Link
            to="/shop"
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>All Brands</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {brands.map(brand => (
            <Link
              key={brand.id}
              to={`/brand/${brand.id}`}
              className="group bg-white dark:bg-slate-850 hover:border-blue-500 rounded-xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col items-center justify-center text-center shadow-xs transition-all hover:shadow-sm"
            >
              <span className="text-sm font-bold font-mono tracking-tight text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
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
