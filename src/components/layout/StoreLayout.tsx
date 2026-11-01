import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnnouncementBar } from './AnnouncementBar';
import { Header } from './Header';
import { Footer } from './Footer';
import { CartDrawer } from '../../features/cart/CartDrawer';
import { KeyboardShortcutsModal } from '../shortcuts/KeyboardShortcutsModal';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { TechnicalBackground } from '../home/TechnicalBackground';
import { FloatingThemeToggle } from './FloatingThemeToggle';

export const StoreLayout: React.FC = () => {
  const isHomepage = useLocation().pathname === '/';
  // Attach centralized keyboard shortcuts system
  useKeyboardShortcuts();

  return (
    <div className="storefront-app min-h-screen flex flex-col bg-background dark:bg-background text-main dark:text-main transition-colors">
      <AnnouncementBar />
      <Header />
      <CartDrawer />
      <KeyboardShortcutsModal />
      <FloatingThemeToggle />

      {isHomepage ? (
        <div className="homepage-background-context relative isolate flex flex-1 flex-col">
          <TechnicalBackground />
          <main className="relative z-10 flex-1">
            <Outlet />
          </main>
          <Footer homeBackground />
        </div>
      ) : (
        <>
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
        </>
      )}
    </div>
  );
};
