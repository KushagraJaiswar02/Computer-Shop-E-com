import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const CategorySection: React.FC = () => {
  const { categories } = useStore();
  const shortLabels: Record<string, string> = {
    laptops: 'Laptops',
    'graphics-cards': 'Graphics Cards',
    processors: 'Processors',
    'memory-ram': 'Memory',
    'storage-ssd': 'Storage',
    motherboards: 'Motherboards',
    monitors: 'Monitors',
    peripherals: 'Peripherals',
  };

  return (
    <section className="border-b border-slate-200/80 bg-white/55 py-6 transition-colors dark:border-slate-800/80 dark:bg-slate-900/35 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4 mb-4 sm:mb-5">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Shop by Category
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-4 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-8">
          {categories.map(category => (
            <Link
              key={category.id}
              to={`/category/${category.id}`}
              className="group flex w-[76px] shrink-0 snap-start flex-col items-center text-center sm:w-auto"
            >
              <div className="mb-2 h-[68px] w-[68px] overflow-hidden rounded-full border border-slate-200 bg-slate-100 shadow-sm transition duration-200 group-hover:-translate-y-0.5 group-hover:border-blue-400 group-hover:shadow-md dark:border-slate-700 dark:bg-slate-800 sm:h-[76px] sm:w-[76px]">
                <img
                  src={category.image}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h3 className="w-full text-[11px] font-semibold leading-tight text-slate-700 transition-colors group-hover:text-blue-600 dark:text-slate-200 dark:group-hover:text-blue-400 sm:text-xs">
                {shortLabels[category.id] || category.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
