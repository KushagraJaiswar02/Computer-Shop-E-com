import React from 'react';
import { Link } from 'react-router-dom';
import { Monitor } from 'lucide-react';

export const BrandLogo: React.FC = () => {
  return (
    <Link to="/" className="flex items-center gap-2.5 group">
      <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm group-hover:bg-blue-700 transition-colors">
        <Monitor className="w-5 h-5" />
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white">
            Computer<span className="text-blue-600 dark:text-blue-400">Shop</span>
          </span>
          <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded border border-slate-200 dark:border-slate-700">
            Storefront
          </span>
        </div>
        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide">
          PC Hardware & Systems
        </span>
      </div>
    </Link>
  );
};
