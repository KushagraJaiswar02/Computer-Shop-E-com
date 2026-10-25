import React from 'react';
import { BrandLogo } from './header/BrandLogo';
import { HeaderSearch } from './header/HeaderSearch';
import { HeaderActions } from './header/HeaderActions';
import { NavigationWheelTrigger } from '../navigation/NavigationWheelTrigger';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-16 flex-wrap items-center justify-between gap-2 py-2 sm:h-[4.5rem] sm:flex-nowrap sm:gap-4 sm:py-0">
          {/* Store identity */}
          <div className="flex shrink-0 items-center">
            <BrandLogo />
          </div>

          {/* Center: Search Bar */}
          <div className="order-3 w-full sm:order-none sm:w-auto sm:min-w-0 sm:flex-1">
            <HeaderSearch />
          </div>

          {/* Explore, theme, account, and cart */}
          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <NavigationWheelTrigger />
            <HeaderActions />
          </div>
        </div>
      </div>
    </header>
  );
};
