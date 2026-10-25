import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Laptop, Cpu, HardDrive, Database, Server, Monitor, Keyboard } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const CategorySection: React.FC = () => {
  const { categories } = useStore();

  const getIcon = (name: string) => {
    switch (name) {
      case 'Laptop': return <Laptop className="w-5 h-5" />;
      case 'Cpu': return <Cpu className="w-5 h-5" />;
      case 'HardDrive': return <HardDrive className="w-5 h-5" />;
      case 'Database': return <Database className="w-5 h-5" />;
      case 'Server': return <Server className="w-5 h-5" />;
      case 'Monitor': return <Monitor className="w-5 h-5" />;
      case 'Keyboard': return <Keyboard className="w-5 h-5" />;
      default: return <Cpu className="w-5 h-5" />;
    }
  };

  return (
    <section className="py-12 sm:py-16 bg-surface-50 dark:bg-surface-900 border-b border-slate-200 dark:border-surface-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              System Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Shop by Hardware Category
            </h2>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
          >
            <span>View All Components</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map(category => (
            <Link
              key={category.id}
              to={`/category/${category.id}`}
              className="group relative bg-white dark:bg-surface-850 rounded-xl border border-slate-200 dark:border-surface-750 p-4 sm:p-5 flex flex-col justify-between overflow-hidden shadow-soft-card hover:shadow-elevated hover:border-brand-300 dark:hover:border-brand-700 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-lg bg-brand-50 dark:bg-surface-800 text-brand-600 dark:text-brand-400 border border-brand-100 dark:border-surface-700 group-hover:scale-110 transition-transform">
                    {getIcon(category.iconName)}
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    {category.subcategories.length} Types
                  </span>
                </div>

                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors mb-1">
                  {category.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {category.description}
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-100 dark:border-surface-750 flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300 group-hover:text-brand-600 dark:group-hover:text-brand-400">
                <span>Explore</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
