import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Package,
  MapPin,
  Shield,
  CreditCard,
  LogOut,
  ExternalLink,
  ChevronRight,
  Clock,
  CheckCircle2,
  Truck,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatPrice, formatDate } from '../lib/utils';
import { SAMPLE_CUSTOMER_ADDRESS } from '../data/mockData';
import { KeycapButton } from '../components/common/KeycapButton';

export const AccountPage: React.FC = () => {
  const { orders } = useStore();
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses'>('orders');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<string | null>(null);

  const activeOrder = orders.find(o => o.id === selectedOrderDetails);

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900 py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Customer Header Strip */}
        <div className="bg-white dark:bg-surface-850 rounded-2xl border border-slate-200 dark:border-surface-750 p-6 shadow-soft-card mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white font-mono font-bold text-xl flex items-center justify-center shadow-keycap">
              RS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  Rahul Sharma
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-semibold border border-blue-200 dark:border-blue-800">
                  Enthusiast Member (Demo)
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                rahul.sharma@example.com • Member since Jan 2024
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/auth/login">
              <KeycapButton variant="secondary" size="sm">
                Switch Demo Account
              </KeycapButton>
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Tab Buttons */}
          <div className="lg:col-span-3 space-y-1">
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'orders'
                  ? 'bg-brand-600 text-white shadow-keycap'
                  : 'bg-white dark:bg-surface-850 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-surface-800 border border-slate-200 dark:border-surface-750'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Package className="w-4 h-4" />
                <span>Orders & Tracking</span>
              </div>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${activeTab === 'orders' ? 'bg-brand-700' : 'bg-slate-100 dark:bg-surface-700'}`}>
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'profile'
                  ? 'bg-brand-600 text-white shadow-keycap'
                  : 'bg-white dark:bg-surface-850 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-surface-800 border border-slate-200 dark:border-surface-750'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <User className="w-4 h-4" />
                <span>Account Profile</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'addresses'
                  ? 'bg-brand-600 text-white shadow-keycap'
                  : 'bg-white dark:bg-surface-850 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-surface-800 border border-slate-200 dark:border-surface-750'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4" />
                <span>Delivery Addresses</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </button>
          </div>

          {/* Right Main Panel */}
          <div className="lg:col-span-9">
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <div className="bg-white dark:bg-surface-850 rounded-2xl border border-slate-200 dark:border-surface-750 p-6 shadow-soft-card">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1">
                    Customer Order History
                  </h3>
                  <p className="text-xs text-slate-500 mb-6">
                    Track courier shipments, examine component manifests, or download invoices.
                  </p>

                  <div className="space-y-4">
                    {orders.map(order => (
                      <div
                        key={order.id}
                        className="rounded-xl border border-slate-200 dark:border-surface-750 overflow-hidden bg-slate-50/50 dark:bg-surface-900/40 divide-y divide-slate-100 dark:divide-surface-750"
                      >
                        {/* Order Header */}
                        <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                          <div>
                            <span className="font-mono text-slate-400 block text-[10px]">ORDER NUMBER</span>
                            <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                              #{order.orderNumber}
                            </span>
                          </div>

                          <div>
                            <span className="font-mono text-slate-400 block text-[10px]">DATE PLACED</span>
                            <span className="text-slate-700 dark:text-slate-300">
                              {formatDate(order.date)}
                            </span>
                          </div>

                          <div>
                            <span className="font-mono text-slate-400 block text-[10px]">TOTAL</span>
                            <span className="font-mono font-bold text-brand-600 dark:text-brand-400">
                              {formatPrice(order.total)}
                            </span>
                          </div>

                          <div>
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold ${
                              order.status === 'Delivered'
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                                : 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400'
                            }`}>
                              <Truck className="w-3.5 h-3.5" />
                              <span>{order.status}</span>
                            </span>
                          </div>

                          <div>
                            <Link to={`/order-confirmation/${order.id}`}>
                              <KeycapButton size="sm" variant="secondary">
                                View Receipt
                              </KeycapButton>
                            </Link>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="p-4 space-y-2">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-3">
                                <img
                                  src={item.image}
                                  alt=""
                                  className="w-10 h-10 object-contain rounded bg-white dark:bg-surface-800 border p-1"
                                />
                                <div>
                                  <span className="font-medium text-slate-800 dark:text-slate-200">
                                    {item.productName}
                                  </span>
                                  <span className="font-mono text-[10px] text-slate-400 block">
                                    Qty: {item.quantity} • SKU: {item.sku}
                                  </span>
                                </div>
                              </div>
                              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                                {formatPrice(item.price * item.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-white dark:bg-surface-850 rounded-2xl border border-slate-200 dark:border-surface-750 p-6 shadow-soft-card">
                <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1">
                  Customer Profile
                </h3>
                <p className="text-xs text-slate-500 mb-6">
                  Personal profile details (demonstration preview).
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-500 mb-1">Full Name</label>
                    <input
                      readOnly
                      value="Alexander Wright"
                      className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-surface-800 border text-slate-800 dark:text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">Email Address</label>
                    <input
                      readOnly
                      value="alex.wright@example.com"
                      className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-surface-800 border text-slate-800 dark:text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">Phone Number</label>
                    <input
                      readOnly
                      value="+1 (206) 555-0199"
                      className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-surface-800 border text-slate-800 dark:text-slate-200 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">Customer Tier</label>
                    <input
                      readOnly
                      value="Enthusiast Verified Rig"
                      className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-surface-800 border text-emerald-600 font-semibold"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="bg-white dark:bg-surface-850 rounded-2xl border border-slate-200 dark:border-surface-750 p-6 shadow-soft-card">
                <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1">
                  Saved Shipping Addresses
                </h3>
                <p className="text-xs text-slate-500 mb-6">
                  Manage primary delivery locations for hardware packages.
                </p>

                <div className="p-4 rounded-xl border border-brand-200 dark:border-brand-800 bg-brand-50/30 dark:bg-brand-950/20 max-w-md text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {SAMPLE_CUSTOMER_ADDRESS.fullName}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-600 text-white font-bold">
                      Default
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">{SAMPLE_CUSTOMER_ADDRESS.street}</p>
                  <p className="text-slate-600 dark:text-slate-300">
                    {SAMPLE_CUSTOMER_ADDRESS.city}, {SAMPLE_CUSTOMER_ADDRESS.state} {SAMPLE_CUSTOMER_ADDRESS.postalCode}
                  </p>
                  <p className="font-mono text-slate-500">{SAMPLE_CUSTOMER_ADDRESS.phone}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
