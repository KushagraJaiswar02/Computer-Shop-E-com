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
    <section className="py-10 sm:py-12 bg-white/65 dark:bg-slate-900/45 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Shop by Category
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Explore hardware components and systems by category
            </p>
          </div>
          <Link
            to="/shop"
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {categories.map(category => (
            <Link
              key={category.id}
              to={`/category/${category.id}`}
              className="group bg-slate-50 dark:bg-slate-850 hover:bg-white dark:hover:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-800 p-3.5 flex flex-col items-center text-center transition-all hover:border-blue-500 hover:shadow-xs"
            >
              <div className="w-11 h-11 rounded-lg bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                {getIcon(category.iconName)}
              </div>
              <h3 className="font-semibold text-xs text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                {category.name}
              </h3>
              <span className="text-[10px] text-slate-400 mt-0.5">
                {category.subcategories.length} types
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
