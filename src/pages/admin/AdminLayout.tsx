import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  Package,
  ShoppingBag,
  Sliders,
  Settings,
  ArrowLeft,
  Sun,
  Moon,
  MessageSquare,
  Sparkles,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { KeycapButton } from '../../components/common/KeycapButton';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const { theme, toggleTheme, enquiries, orders } = useStore();

  const navItems = [
    { label: 'Overview', path: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Homepage Builder', path: '/admin/homepage-builder', icon: <Layers className="w-4 h-4" />, highlight: true },
    { label: 'Product Catalog', path: '/admin/products', icon: <Package className="w-4 h-4" /> },
    { label: 'Categories & Brands', path: '/admin/categories', icon: <Sliders className="w-4 h-4" /> },
    { label: 'Orders & Shipments', path: '/admin/orders', icon: <ShoppingBag className="w-4 h-4" />, badge: orders.length },
    { label: 'Hardware Enquiries', path: '/admin/enquiries', icon: <MessageSquare className="w-4 h-4" />, badge: enquiries.filter(e => e.status === 'New').length },
    { label: 'Store Settings', path: '/admin/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row antialiased">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between flex-shrink-0">
        <div>
          {/* Admin Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-mono font-bold text-sm shadow-keycap">
                NX
              </div>
              <div>
                <span className="font-bold text-sm tracking-tight text-white block">
                  NexusTech Admin
                </span>
                <span className="text-[10px] font-mono text-brand-400">
                  DEVELOPMENT PROTOTYPE
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 text-xs">
            {navItems.map(item => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg font-medium transition-all ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-keycap font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  } ${item.highlight && !isActive ? 'text-brand-300' : ''}`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isActive ? 'text-white' : 'text-slate-400'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-brand-700 text-white' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {item.highlight && !isActive && (
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-brand-950 border border-brand-800 text-brand-400 font-bold">
                      KEY
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-brand-400" />
              <span>Preview Live Store</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Storefront</span>
          </Link>

          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Customer View</span>
          </Link>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-900">
        {/* Top Header info */}
        <header className="h-16 border-b border-slate-800 px-6 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-400 font-bold">
              ● PROTOTYPE ENVIRONMENT
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">
              Changes persist in browser local storage and update storefront immediately.
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/">
              <KeycapButton size="sm" variant="secondary">
                View Storefront
              </KeycapButton>
            </Link>
          </div>
        </header>

        {/* Sub-page Outlet */}
        <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
