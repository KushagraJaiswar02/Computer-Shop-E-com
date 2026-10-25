import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { useStore } from '../../../context/StoreContext';

interface MobileNavMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNavMenu: React.FC<MobileNavMenuProps> = ({ isOpen, onClose }) => {
  const { categories } = useStore();

  if (!isOpen) return null;

  return (
    <nav id="mobile-store-navigation" aria-label="Mobile store navigation" className="lg:hidden border-t border-slate-200 bg-white p-4 shadow-lg animate-fade-in dark:border-slate-800 dark:bg-slate-900">
      <div className="space-y-1 font-medium text-sm">
        <Link
          to="/shop"
          onClick={onClose}
          className="block p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
        >
          All Hardware Products
        </Link>

        <Link
          to="/shop?deal=true"
          onClick={onClose}
          className="block p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-amber-600 dark:text-amber-400 font-semibold"
        >
          <span className="inline-flex items-center gap-2"><Sparkles className="h-4 w-4" />Promotional Deals</span>
        </Link>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block px-2.5 mb-1">
            Categories
          </span>
          {categories.map(cat => (
            <Link
              key={cat.id}
              to={`/category/${cat.id}`}
              onClick={onClose}
              className="flex min-h-10 items-center px-2.5 py-1.5 text-xs text-slate-600 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-slate-300"
            >
              {cat.name}
            </Link>
          ))}
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
          <Link
            to="/enquiry"
            onClick={onClose}
            className="block p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs"
          >
            Custom PC Consultation
          </Link>
          <Link to="/account" onClick={onClose} className="flex min-h-10 items-center rounded-lg px-2.5 py-2 text-xs text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">Customer account and orders (demo)</Link>
        </div>
      </div>
    </nav>
  );
};
