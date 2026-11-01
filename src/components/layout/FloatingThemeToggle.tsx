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
      className="floating-theme-toggle fixed z-[15] flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface/95 text-main shadow-md transition-colors hover:bg-surface-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 dark:border-border dark:bg-surface/95 dark:text-main dark:hover:bg-surface-elevated dark:focus-visible:ring-offset-surface motion-reduce:transition-none"
      style={{ right: 'calc(env(safe-area-inset-right, 0px) + 1rem)' }}
    >
      {theme === 'light' ? <Moon className="h-4 w-4" aria-hidden="true" /> : <Sun className="h-4 w-4 text-warning-ink" aria-hidden="true" />}
    </button>
  );
};
