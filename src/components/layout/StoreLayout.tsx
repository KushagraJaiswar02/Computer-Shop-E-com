import React from 'react';
import { Outlet } from 'react-router-dom';
import { AnnouncementBar } from './AnnouncementBar';
import { Header } from './Header';
import { Footer } from './Footer';
import { CategoryNavDrawer } from './CategoryNavDrawer';
import { CartDrawer } from '../../features/cart/CartDrawer';
import { KeyboardShortcutsModal } from '../shortcuts/KeyboardShortcutsModal';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';

export const StoreLayout: React.FC = () => {
  // Attach centralized keyboard shortcuts system
  useKeyboardShortcuts();

  return (
    <div className="min-h-screen flex flex-col bg-surface-50 dark:bg-surface-900 text-slate-800 dark:text-slate-100 transition-colors">
      <AnnouncementBar />
      <Header />
      <CategoryNavDrawer />
      <CartDrawer />
      <KeyboardShortcutsModal />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};
