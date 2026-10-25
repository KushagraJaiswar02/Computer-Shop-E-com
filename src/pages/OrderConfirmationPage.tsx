import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Info, Printer, ArrowRight, Home } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatPrice, formatDate } from '../lib/utils';
import { KeycapButton } from '../components/common/KeycapButton';

export const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { orders } = useStore();

  const order = orders.find(o => o.id === orderId);

  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
        <Link to="/" className="text-brand-600 hover:underline">
          Return to Storefront
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900 py-12 transition-colors">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-blue-50 dark:bg-slate-850 rounded-2xl border border-blue-200 dark:border-slate-750 p-6 sm:p-8 text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-900 text-blue-600 border border-blue-200 dark:border-slate-700 flex items-center justify-center mx-auto mb-3">
            <Info className="w-6 h-6" />
          </div>

          <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
            Local Demo Preview · Not Submitted
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Demo order preview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            Preview #{order.orderNumber} is stored only in this browser. No order was sent, no stock was reserved, and no payment or shipment was created.
          </p>

        </div>

        {/* Order Details & Summary Card */}
        <div className="bg-white dark:bg-surface-850 rounded-2xl border border-slate-200 dark:border-surface-750 p-6 sm:p-8 shadow-soft-card space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-surface-750">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Hardware Manifest
            </h3>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 font-medium"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Preview</span>
            </button>
          </div>

          {/* Items list */}
          <div className="divide-y divide-slate-100 dark:divide-surface-750">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-12 h-12 object-contain rounded-lg bg-slate-50 dark:bg-surface-900 border border-slate-100 flex-shrink-0"
                  />
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-white">{item.productName}</h4>
                    <span className="text-[11px] font-mono text-slate-400">
                      SKU: {item.sku} • Qty: {item.quantity}
                    </span>
                  </div>
                </div>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Totals Breakdown */}
          <div className="pt-4 border-t border-slate-200 dark:border-surface-750 space-y-2 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <span className="font-mono">{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Sample shipping amount</span>
              <span className="font-mono text-emerald-600">
                {order.shipping === 0 ? 'FREE' : formatPrice(order.shipping)}
              </span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Example tax value</span>
              <span className="font-mono">{formatPrice(order.tax)}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 dark:border-surface-750 flex justify-between font-bold text-base text-slate-900 dark:text-white">
              <span>Total (Preview Only)</span>
              <span className="font-mono text-brand-600 dark:text-brand-400 text-lg">
                {formatPrice(order.total)}
              </span>
            </div>
          </div>

          {/* Shipping Address & Payment info */}
          <div className="pt-4 border-t border-slate-100 dark:border-surface-750 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="font-mono text-[10px] uppercase text-slate-400 font-bold block mb-1">
                Shipment Destination
              </span>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                {order.shippingAddress.fullName}
              </p>
              <p className="text-slate-500 dark:text-slate-400">{order.shippingAddress.street}</p>
              <p className="text-slate-500 dark:text-slate-400">
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
              </p>
            </div>

            <div>
              <span className="font-mono text-[10px] uppercase text-slate-400 font-bold block mb-1">
                Demo Payment Status
              </span>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                {{ upi_demo: 'UPI demo option', card_demo: 'Card demo option', wire_transfer: 'Wire transfer demo option', in_store_pickup: 'Pickup demo option', cod: 'Cash on delivery demo option' }[order.paymentMethod]}
              </p>
              <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-mono ${order.paymentStatus === 'Payment Pending' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>
                Status: {order.paymentStatus}
              </span>
            </div>
          </div>

          {/* Navigation action buttons */}
          <div className="pt-6 border-t border-slate-200 dark:border-surface-750 flex flex-col sm:flex-row items-center justify-between gap-3">
            <Link to="/" className="w-full sm:w-auto">
              <KeycapButton variant="secondary" className="w-full">
                <Home className="w-4 h-4 mr-1.5" />
                Return to Homepage
              </KeycapButton>
            </Link>

            <Link to="/account/orders" className="w-full sm:w-auto">
              <KeycapButton variant="primary" className="w-full">
                <span>View Demo Orders</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </KeycapButton>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
