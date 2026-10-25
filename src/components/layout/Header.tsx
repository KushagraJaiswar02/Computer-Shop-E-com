import React from 'react';
import { BrandLogo } from './header/BrandLogo';
import { HeaderSearch } from './header/HeaderSearch';
import { HeaderActions } from './header/HeaderActions';
import { NavigationWheelTrigger } from '../navigation/NavigationWheelTrigger';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-3 sm:gap-4">
          {/* Left: Explore Radial Wheel Trigger + Brand Logo */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <NavigationWheelTrigger />
            <BrandLogo />
          </div>

          {/* Center: Search Bar */}
          <HeaderSearch />

          {/* Right: Actions (Help, Wishlist, Cart, Account, Theme Toggle) */}
          <HeaderActions />
        </div>
      </div>
    </header>
  );
};
