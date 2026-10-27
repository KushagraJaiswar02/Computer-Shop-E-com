import React from 'react';
import { BrandLogo } from './header/BrandLogo';
import { HeaderSearch } from './header/HeaderSearch';
import { HeaderActions } from './header/HeaderActions';
import { HeaderNav } from './header/HeaderNav';

export const Header: React.FC = () => (
  <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 transition-colors dark:border-slate-800 dark:bg-slate-900/95">
    <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
      <div className="grid min-h-16 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 gap-y-2 py-2 lg:flex lg:h-[4.25rem] lg:gap-3 lg:py-0">
        <div className="flex shrink-0 items-center lg:order-1">
          <BrandLogo />
        </div>
        <div className="col-span-2 row-start-2 flex min-w-0 items-center gap-2 lg:order-2 lg:col-span-1 lg:row-start-auto lg:flex-1">
          <HeaderNav />
          <HeaderSearch />
        </div>
        <div className="col-start-2 row-start-1 flex shrink-0 items-center justify-end lg:order-3">
          <HeaderActions />
        </div>
      </div>
    </div>
  </header>
);
