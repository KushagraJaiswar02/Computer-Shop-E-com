import React from 'react';
import { Link } from 'react-router-dom';
import { Moon, PackagePlus, ShoppingBag, Sun, UserRound } from 'lucide-react';
import { useStore } from '../../../context/StoreContext';

export const HeaderActions: React.FC = () => {
  const { theme, toggleTheme, cartCount, setIsCartOpen } = useStore();

  return (
    <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
      <Link to="/enquiry?request=product" title="Request a Product" aria-label="Request a Product" className="flex items-center gap-1.5 rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-300">
        <PackagePlus className="h-4 w-4" />
        <span className="hidden min-[480px]:inline text-xs font-semibold">Request a Product</span>
      </Link>
      <button
        type="button"
        onClick={toggleTheme}
        className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
        title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4 text-amber-400" />}
      </button>
      <Link
        to="/auth/login"
        className="flex items-center gap-1 rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
        title="Sign in or register · demo"
        aria-label="Sign in / Register"
      >
        <UserRound className="h-5 w-5" />
        <span className="hidden md:inline text-xs font-semibold">Sign in</span>
      </Link>
      <Link to="/auth/register" className="hidden xl:inline rounded-lg px-1.5 py-2 text-xs font-semibold text-slate-600 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-slate-300 dark:hover:text-blue-300">Register</Link>
      <button
        type="button"
        onClick={() => setIsCartOpen(true)}
        className="relative rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
        title={`Shopping cart${cartCount ? `, ${cartCount} items` : ''}`}
        aria-label={`Shopping cart${cartCount ? `, ${cartCount} items` : ''}`}
      >
        <ShoppingBag className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        {cartCount > 0 && <span aria-hidden="true" className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white">{cartCount}</span>}
      </button>
    </div>
  );
};
