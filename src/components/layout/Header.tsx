import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  Heart,
  ShoppingBag,
  Sun,
  Moon,
  Menu,
  X,
  Layers,
  HelpCircle,
  User,
  Sliders,
  Scale,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { KeyBadge } from '../common/KeyBadge';

export const Header: React.FC = () => {
  const {
    theme,
    toggleTheme,
    cartCount,
    wishlist,
    compareList,
    setIsCartOpen,
    setIsCategoryNavOpen,
    setIsShortcutsModalOpen,
    registerSearchInputRef,
    categories,
    brands,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isBrandsDropdownOpen, setIsBrandsDropdownOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    registerSearchInputRef(searchInputRef);
  }, [registerSearchInputRef]);

  // Close menus on route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsCategoryDropdownOpen(false);
    setIsBrandsDropdownOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      searchInputRef.current?.blur();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-surface-900/95 backdrop-blur-md border-b border-slate-200 dark:border-surface-750 transition-colors">
      {/* Main Top Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Brand Identity / Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(prev => !prev)}
              className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-slate-900 dark:bg-brand-600 flex items-center justify-center text-white font-mono font-bold text-lg shadow-keycap group-hover:scale-105 transition-transform">
                <span className="tracking-tighter">NX</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white uppercase font-mono">
                    Nexus<span className="text-brand-600 dark:text-brand-400">Tech</span>
                  </span>
                  <span className="text-[10px] font-mono px-1 py-0.2 bg-slate-100 dark:bg-surface-800 text-slate-500 rounded border border-slate-200 dark:border-surface-700">
                    RETAIL
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wider uppercase">
                  Hardware & Systems
                </span>
              </div>
            </Link>
          </div>

          {/* Search Form with Keycap / Shortcut Indicator */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-lg mx-4 relative items-center"
          >
            <div className="relative w-full">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search GPUs, laptops, CPUs, DDR5, SSDs... (e.g. RTX 4080, 7800X3D)"
                className="w-full pl-10 pr-16 py-2 sm:py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-surface-800 border border-slate-300 dark:border-surface-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <KeyBadge>/</KeyBadge>
              </div>
            </div>
          </form>

          {/* Quick Action Icons & Navigation Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Keyboard Shortcuts trigger */}
            <button
              onClick={() => setIsShortcutsModalOpen(true)}
              className="hidden lg:flex items-center gap-1 p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-surface-800 transition-colors"
              title="Keyboard Shortcuts (?)"
              aria-label="Keyboard Shortcuts"
            >
              <HelpCircle className="w-4 h-4" />
              <KeyBadge>?</KeyBadge>
            </button>

            {/* Compare items pill */}
            {compareList.length > 0 && (
              <Link
                to="/compare"
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800/80 hover:bg-brand-100 transition-colors"
                title="Product Comparison"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Compare ({compareList.length})</span>
              </Link>
            )}

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-surface-800 transition-colors flex items-center gap-1"
              title="Saved Wishlist (W)"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
              <KeyBadge className="hidden xl:inline-flex">W</KeyBadge>
            </Link>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-surface-800 transition-colors flex items-center gap-1"
              title="Shopping Cart (K)"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-brand-600 text-white text-[10px] font-bold flex items-center justify-center animate-subtle-pulse">
                  {cartCount}
                </span>
              )}
              <KeyBadge className="hidden xl:inline-flex">K</KeyBadge>
            </button>

            {/* Account Link */}
            <Link
              to="/account"
              className="hidden sm:flex items-center p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-surface-800 transition-colors"
              title="Customer Account"
              aria-label="Customer Account"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Dark/Light Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-surface-800 transition-colors"
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-amber-400" />}
            </button>

            {/* Admin Switcher Button Pill */}
            <Link
              to="/admin"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-surface-800 hover:bg-slate-200 dark:hover:bg-surface-750 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-surface-700 shadow-keycap dark:shadow-keycap-dark transition-all"
            >
              <Sliders className="w-3.5 h-3.5 text-brand-500" />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Secondary Navigation Bar (Desktop) */}
      <nav className="hidden lg:block border-t border-slate-200/80 dark:border-surface-750 bg-slate-50/70 dark:bg-surface-850/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-11 text-xs font-semibold text-slate-700 dark:text-slate-200">
            <div className="flex items-center gap-1">
              {/* Category Directory Trigger */}
              <button
                onClick={() => setIsCategoryNavOpen(prev => !prev)}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-brand-600 hover:bg-brand-700 text-white transition-colors mr-2 shadow-keycap"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>All Hardware Categories</span>
                <KeyBadge className="bg-brand-700 text-white border-brand-800">C</KeyBadge>
              </button>

              <Link
                to="/shop"
                className="px-3 py-1.5 rounded-md hover:bg-slate-200/60 dark:hover:bg-surface-750 transition-colors"
              >
                Full Catalog
              </Link>

              {/* Top Categories direct links */}
              {categories.slice(0, 5).map(cat => (
                <Link
                  key={cat.id}
                  to={`/category/${cat.id}`}
                  className="px-3 py-1.5 rounded-md hover:bg-slate-200/60 dark:hover:bg-surface-750 transition-colors"
                >
                  {cat.name}
                </Link>
              ))}

              <Link
                to="/shop?deal=true"
                className="px-3 py-1.5 rounded-md text-amber-600 dark:text-amber-400 font-bold hover:bg-slate-200/60 dark:hover:bg-surface-750 transition-colors flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Deals
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/enquiry"
                className="px-2.5 py-1 text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 font-medium"
              >
                Custom PC Consultation
              </Link>
              <span className="text-slate-300 dark:text-surface-700">|</span>
              <Link
                to="/about"
                className="px-2 py-1 text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 font-medium"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="px-2 py-1 text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 font-medium"
              >
                Support & Contact
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Search & Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-surface-750 bg-white dark:bg-surface-900 p-4 space-y-4 animate-fade-in shadow-xl">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search components, laptops, GPUs..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-surface-800 border border-slate-300 dark:border-surface-700 rounded-lg text-slate-900 dark:text-white"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </form>

          <div className="space-y-1 pt-1 font-medium text-sm">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsCategoryNavOpen(true);
              }}
              className="flex items-center justify-between w-full p-2.5 rounded-lg bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 font-semibold"
            >
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>Browse All Categories</span>
              </div>
              <KeyBadge>C</KeyBadge>
            </button>

            <Link
              to="/shop"
              className="block p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-surface-800 text-slate-800 dark:text-slate-200"
            >
              Shop All Hardware
            </Link>

            <Link
              to="/shop?deal=true"
              className="block p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-surface-800 text-amber-600 dark:text-amber-400 font-bold"
            >
              ⚡ Promotional Deals
            </Link>

            <div className="pt-2 border-t border-slate-100 dark:border-surface-800">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block px-2.5 mb-1">
                Featured Categories
              </span>
              {categories.slice(0, 6).map(cat => (
                <Link
                  key={cat.id}
                  to={`/category/${cat.id}`}
                  className="block px-2.5 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:text-brand-600"
                >
                  {cat.name}
                </Link>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-surface-800 space-y-1">
              <Link
                to="/enquiry"
                className="block p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-surface-800 text-slate-700 dark:text-slate-300 text-xs"
              >
                Custom PC Consultation Form
              </Link>
              <Link
                to="/account"
                className="block p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-surface-800 text-slate-700 dark:text-slate-300 text-xs"
              >
                Customer Portal & Orders
              </Link>
              <Link
                to="/admin"
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-100 dark:bg-surface-800 text-slate-800 dark:text-slate-200 text-xs font-semibold"
              >
                <div className="flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5 text-brand-500" />
                  <span>Admin Prototype Dashboard</span>
                </div>
                <span className="text-[10px] text-brand-600">Demo</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
