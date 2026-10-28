import React from 'react';
import { Link } from 'react-router-dom';
import { PackagePlus } from 'lucide-react';
import { BrandLogo } from './header/BrandLogo';
import { HeaderSearch } from './header/HeaderSearch';
import { HeaderActions } from './header/HeaderActions';

export const Header: React.FC = () => (
  <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 transition-colors dark:border-slate-800 dark:bg-slate-900/95">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid min-h-16 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 gap-y-3 py-3 xl:flex xl:min-h-20 xl:gap-6 xl:py-4">
        <div className="flex shrink-0 items-center xl:order-1">
          <BrandLogo />
        </div>
        <div className="col-span-2 row-start-2 flex min-w-0 items-center gap-3 sm:gap-4 xl:order-2 xl:col-span-1 xl:row-start-auto xl:flex-1">
          <div className="min-w-0 flex-1">
            <HeaderSearch />
          </div>
          <div className="shrink-0">
            <Link to="/enquiry?request=product" title="Request a Product" aria-label="Request a Product" className="inline-flex h-11 items-center gap-1 rounded-md border border-blue-200 px-2 text-[11px] font-semibold text-blue-700 transition-colors hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-blue-900 dark:text-blue-300 dark:hover:bg-slate-800 sm:gap-1.5 sm:px-2.5 sm:text-xs">
              <PackagePlus className="h-4 w-4" />
              <span className="hidden min-[380px]:inline">Request a Product</span>
              <span className="min-[380px]:hidden">Request</span>
            </Link>
          </div>
        </div>
        <div className="col-start-2 row-start-1 flex shrink-0 items-center justify-end xl:order-3">
          <HeaderActions />
        </div>
      </div>
    </div>
  </header>
);
