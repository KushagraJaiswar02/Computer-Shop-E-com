import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';

export const FloatingThemeToggle: React.FC = () => {
  const { theme, toggleTheme, isCartOpen, isShortcutsModalOpen } = useStore();
  const { pathname } = useLocation();

  if (isCartOpen || isShortcutsModalOpen || pathname === '/cart' || pathname === '/checkout') return null;

  const nextTheme = theme === 'light' ? 'dark' : 'light';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={`Switch to ${nextTheme} mode`}
      aria-label={`Switch to ${nextTheme} mode`}
      className="floating-theme-toggle fixed z-[15] flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-700 shadow-md transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus-visible:ring-offset-slate-900 motion-reduce:transition-none"
      style={{ right: 'calc(env(safe-area-inset-right, 0px) + 1rem)' }}
    >
      {theme === 'light' ? <Moon className="h-4 w-4" aria-hidden="true" /> : <Sun className="h-4 w-4 text-amber-400" aria-hidden="true" />}
    </button>
  );
};
