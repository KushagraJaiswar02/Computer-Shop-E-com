import React from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  Package,
  ShoppingBag,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Sliders,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatPrice } from '../../lib/utils';
import { KeycapButton } from '../../components/common/KeycapButton';

export const AdminDashboardOverview: React.FC = () => {
  const { products, orders, enquiries } = useStore();

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const lowStockProducts = products.filter(p => p.stockStatus === 'low_stock' || p.stock < 10);
  const newEnquiries = enquiries.filter(e => e.status === 'New');

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Storefront Operations & Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time telemetry for hardware inventory, incoming orders, and custom PC enquiries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/admin/homepage-builder">
            <KeycapButton variant="primary" size="sm">
              <Layers className="w-3.5 h-3.5 mr-1.5" />
              Open Homepage Builder
            </KeycapButton>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Gross Sales (Demo)</span>
            <span className="p-1.5 rounded-lg bg-emerald-950 text-emerald-400 font-bold">
              +18.4%
            </span>
          </div>
          <span className="text-2xl font-black font-mono text-white block">
            {formatPrice(totalRevenue)}
          </span>
          <span className="text-[11px] text-slate-500 block">Across {orders.length} registered orders</span>
        </div>

        <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Hardware SKUs</span>
            <span className="text-brand-400 font-mono text-xs">Catalog</span>
          </div>
          <span className="text-2xl font-black font-mono text-white block">
            {products.length}
          </span>
          <span className="text-[11px] text-slate-500 block">Across 8 system domains</span>
        </div>

        <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Stock Alerts</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-2xl font-black font-mono text-amber-400 block">
            {lowStockProducts.length}
          </span>
          <span className="text-[11px] text-slate-500 block">Components below safety threshold</span>
        </div>

        <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Custom PC Enquiries</span>
            <span className="text-brand-400 font-mono text-xs">Queue</span>
          </div>
          <span className="text-2xl font-black font-mono text-brand-400 block">
            {newEnquiries.length} New
          </span>
          <span className="text-[11px] text-slate-500 block">Awaiting engineering quotes</span>
        </div>
      </div>

      {/* Grid: Recent Orders & Stock Watchlist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Recent Orders */}
        <div className="lg:col-span-7 bg-slate-950 rounded-2xl border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-sm text-white">Recent Store Orders</h3>
            <Link to="/admin/orders" className="text-xs text-brand-400 hover:underline">
              View All Orders
            </Link>
          </div>

          <div className="divide-y divide-slate-800 text-xs">
            {orders.slice(0, 4).map(o => (
              <div key={o.id} className="py-3 flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-white block">
                    #{o.orderNumber} • {o.shippingAddress.fullName}
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    {o.items.length} item(s) • {o.paymentMethod === 'card_demo' ? 'Card' : 'Wire'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-white block">
                    {formatPrice(o.total)}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400">
                    {o.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Low Stock Warnings */}
        <div className="lg:col-span-5 bg-slate-950 rounded-2xl border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Inventory Threshold Alerts</span>
            </h3>
            <Link to="/admin/products" className="text-xs text-brand-400 hover:underline">
              Manage Stock
            </Link>
          </div>

          <div className="divide-y divide-slate-800 text-xs">
            {lowStockProducts.slice(0, 5).map(p => (
              <div key={p.id} className="py-2.5 flex items-center justify-between gap-2">
                <div className="truncate">
                  <span className="font-medium text-slate-200 truncate block">
                    {p.name}
                  </span>
                  <span className="text-slate-500 font-mono text-[10px]">
                    SKU: {p.sku}
                  </span>
                </div>
                <span className="font-mono px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-900 flex-shrink-0">
                  {p.stock} units
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
