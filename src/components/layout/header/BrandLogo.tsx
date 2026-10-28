import React from 'react';
import { Link } from 'react-router-dom';
import { Monitor } from 'lucide-react';

export const BrandLogo: React.FC = () => {
  return (
    <Link to="/" aria-label="ComputerShop home" className="group flex shrink-0 items-center gap-1.5 sm:gap-2.5">
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 font-bold text-white transition-colors group-hover:bg-blue-700 sm:h-9 sm:w-9">
        <Monitor className="h-4 w-4 sm:h-5 sm:w-5" />
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white min-[420px]:text-base lg:text-lg">
            Computer<span className="text-blue-600 dark:text-blue-400">Shop</span>
          </span>
          <span className="hidden rounded border border-slate-200 bg-slate-100 px-1.5 py-0.2 font-mono text-[9px] uppercase text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 2xl:inline-block">
            Storefront
          </span>
        </div>
        <span className="hidden text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide sm:inline">
          PC Hardware & Systems
        </span>
      </div>
    </Link>
  );
};
