import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, Sparkles } from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { KeyBadge } from '../../common/KeyBadge';

export const HeaderNav: React.FC = () => {
  const { setIsCategoryNavOpen, categories } = useStore();

  return (
    <nav className="hidden lg:block border-t border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-11 text-xs font-semibold text-slate-700 dark:text-slate-200">
          <div className="flex items-center gap-1">
            {/* Category Directory Trigger */}
            <button
              onClick={() => setIsCategoryNavOpen(prev => !prev)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors mr-2 shadow-sm"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All Categories</span>
              <KeyBadge className="bg-blue-700 text-white border-blue-800">C</KeyBadge>
            </button>

            <Link
              to="/shop"
              className="px-3 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
            >
              All Products
            </Link>

            {categories.slice(0, 5).map(cat => (
              <Link
                key={cat.id}
                to={`/category/${cat.id}`}
                className="px-3 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                {cat.name}
              </Link>
            ))}

            <Link
              to="/shop?deal=true"
              className="px-3 py-1.5 rounded-md text-amber-600 dark:text-amber-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Deals</span>
            </Link>
          </div>

          <div className="flex items-center gap-4 text-xs font-normal text-slate-500 dark:text-slate-400">
            <Link to="/enquiry" className="hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
              Custom PC Quote
            </Link>
            <span>|</span>
            <Link to="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
              Contact & Store
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
