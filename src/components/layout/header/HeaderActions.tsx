import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Sun, Moon, User, HelpCircle, Menu, X } from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { KeyBadge } from '../../common/KeyBadge';

export const HeaderActions: React.FC<{ mobileNavOpen: boolean; onToggleMobileNav: () => void }> = ({ mobileNavOpen, onToggleMobileNav }) => {
  const {
    theme,
    toggleTheme,
    cartCount,
    wishlist,
    setIsCartOpen,
    setIsShortcutsModalOpen,
  } = useStore();

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      {/* Shortcut Guide Button */}
      <button
        onClick={() => setIsShortcutsModalOpen(true)}
        className="hidden lg:flex items-center gap-1 p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        title="Keyboard Shortcuts (?)"
        aria-label="Keyboard Shortcuts"
      >
        <HelpCircle className="w-4 h-4" />
        <KeyBadge>?</KeyBadge>
      </button>

      {/* Wishlist Link */}
      <Link
        to="/wishlist"
        className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1"
        title="Saved Wishlist (W)"
        aria-label="Wishlist"
      >
        <Heart className="w-5 h-5" />
        {wishlist.length > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
            {wishlist.length}
          </span>
        )}
      </Link>

      {/* Cart Button */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1"
        title="Shopping Cart (K)"
        aria-label="Shopping Cart"
      >
        <ShoppingBag className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        {cartCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </button>

      {/* Customer Account */}
      <Link
        to="/account"
        className="hidden sm:flex items-center p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        title="Customer Account"
        aria-label="Customer Account"
      >
        <User className="w-5 h-5" />
      </Link>

      <button type="button" onClick={onToggleMobileNav} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden" aria-label={mobileNavOpen ? 'Close store navigation' : 'Open store navigation'} aria-expanded={mobileNavOpen} aria-controls="mobile-store-navigation">
        {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        aria-label="Toggle Theme"
      >
        {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
      </button>
    </div>
  );
};
