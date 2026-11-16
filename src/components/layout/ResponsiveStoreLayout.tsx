import React, { lazy, Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { AnnouncementBar } from './AnnouncementBar';
import { Header } from './Header';
import { Footer } from './Footer';
import { CartDrawer } from '../../features/cart/CartDrawer';
import { KeyboardShortcutsModal } from '../shortcuts/KeyboardShortcutsModal';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { TechnicalBackground } from '../home/TechnicalBackground';


const MobileStoreShell = lazy(() => import('./MobileStoreShell').then(module => ({ default: module.MobileStoreShell })));
export const ResponsiveStoreLayout: React.FC = () => {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isHomepage = useLocation().pathname === '/';
  useKeyboardShortcuts();
  if (isMobile) return <Suspense fallback={<div className="m-skeleton" aria-label="Loading mobile store" />}><MobileStoreShell /></Suspense>;
  return <div className="storefront-app min-h-screen flex flex-col bg-background dark:bg-background text-main dark:text-main transition-colors"><AnnouncementBar/><Header/><CartDrawer/><KeyboardShortcutsModal/>{isHomepage ? <div className="homepage-background-context relative isolate flex flex-1 flex-col"><TechnicalBackground/><main className="relative z-10 flex-1"><Outlet/></main><Footer homeBackground/></div> : <><main className="flex-1"><Outlet/></main><Footer/></>}</div>;
};

const MobilePages = lazy(() => import('../../mobile/MobilePages'));
export const ResponsivePage: React.FC<{ screen: string; desktop: React.ReactNode }> = ({screen, desktop}) => {
  const isMobile = useMediaQuery('(max-width: 767px)');
  return isMobile ? <Suspense fallback={<div className="m-page"><div className="m-skeleton"/></div>}><MobilePages screen={screen}/></Suspense> : <>{desktop}</>;
};
