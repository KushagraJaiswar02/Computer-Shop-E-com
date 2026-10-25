import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, Sparkles, Sliders, X } from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { KeyBadge } from '../../common/KeyBadge';

interface MobileNavMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNavMenu: React.FC<MobileNavMenuProps> = ({ isOpen, onClose }) => {
  const { categories, setIsCategoryNavOpen } = useStore();

  if (!isOpen) return null;

  return (
    <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-4 shadow-lg animate-fade-in">
      <div className="space-y-1 font-medium text-sm">
        <button
          onClick={() => {
            onClose();
            setIsCategoryNavOpen(true);
          }}
          className="flex items-center justify-between w-full p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold"
        >
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4" />
            <span>Browse All Categories</span>
          </div>
          <KeyBadge>C</KeyBadge>
        </button>

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
          ⚡ Promotional Deals
        </Link>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block px-2.5 mb-1">
            Categories
          </span>
          {categories.slice(0, 6).map(cat => (
            <Link
              key={cat.id}
              to={`/category/${cat.id}`}
              onClick={onClose}
              className="block px-2.5 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:text-blue-600"
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
          <Link
            to="/account"
            onClick={onClose}
            className="block p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs"
          >
            Customer Account & Orders
          </Link>
          <Link
            to="/admin"
            onClick={onClose}
            className="flex items-center justify-between p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold"
          >
            <div className="flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-blue-600" />
              <span>Admin Dashboard</span>
            </div>
            <span className="text-[10px] text-blue-600">Demo</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
