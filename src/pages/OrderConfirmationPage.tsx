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
        <Link to="/" className="text-accent hover:underline">
          Return to Storefront
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background py-12 transition-colors">
      <div className="shop-container ">
        <div className="bg-accent/10 dark:bg-surface rounded-2xl border border-primary dark:border-border p-6 sm:p-8 text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-surface dark:bg-surface text-accent border border-primary dark:border-border flex items-center justify-center mx-auto mb-3">
            <Info className="w-6 h-6" />
          </div>

          <span className="text-xs font-sans font-bold uppercase tracking-wider text-accent dark:text-accent">
            Local Demo Preview · Not Submitted
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-main dark:text-main mt-1">
            Demo order preview
          </h1>
          <p className="text-xs sm:text-sm text-muted dark:text-muted mt-1 max-w-md mx-auto">
            Preview #{order.orderNumber} is stored only in this browser. No order was sent, no stock was reserved, and no payment or shipment was created.
          </p>

        </div>

        {/* Order Details & Summary Card */}
        <div className="bg-surface dark:bg-surface rounded-2xl border border-border dark:border-border p-6 sm:p-8 shadow-soft-card space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border dark:border-border">
            <h3 className="font-bold text-base text-main dark:text-main">
              Hardware Manifest
            </h3>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 text-xs text-muted dark:text-main hover:text-main font-medium"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Preview</span>
            </button>
          </div>

          {/* Items list */}
          <div className="divide-y divide-border dark:divide-border">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-12 h-12 object-contain rounded-lg bg-surface-soft dark:bg-background border border-border flex-shrink-0"
                  />
                  <div>
                    <h4 className="font-bold text-main dark:text-main">{item.productName}</h4>
                    <span className="text-[11px] font-sans text-muted">
                      SKU: {item.sku} • Qty: {item.quantity}
                    </span>
                  </div>
                </div>
                <span className="font-sans font-bold text-main dark:text-main price">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Totals Breakdown */}
          <div className="pt-4 border-t border-border dark:border-border space-y-2 text-xs">
            <div className="flex justify-between text-muted">
              <span>Subtotal</span>
              <span className="font-sans price">{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted">
              <span>Sample shipping amount</span>
              <span className="font-sans text-success-ink">
                {order.shipping === 0 ? 'FREE' : formatPrice(order.shipping)}
              </span>
            </div>
            <div className="flex justify-between text-muted">
              <span>Example tax value</span>
              <span className="font-sans price">{formatPrice(order.tax)}</span>
            </div>
            <div className="pt-2 border-t border-border dark:border-border flex justify-between font-bold text-base text-main dark:text-main">
              <span>Total (Preview Only)</span>
              <span className="font-sans text-accent dark:text-accent text-lg price">
                {formatPrice(order.total)}
              </span>
            </div>
          </div>

          {/* Shipping Address & Payment info */}
          <div className="pt-4 border-t border-border dark:border-border grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="font-sans text-[10px] uppercase text-muted font-bold block mb-1">
                Shipment Destination
              </span>
              <p className="font-semibold text-main dark:text-main">
                {order.shippingAddress.fullName}
              </p>
              <p className="text-muted dark:text-muted">{order.shippingAddress.street}</p>
              <p className="text-muted dark:text-muted">
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
              </p>
            </div>

            <div>
              <span className="font-sans text-[10px] uppercase text-muted font-bold block mb-1">
                Demo Payment Status
              </span>
              <p className="font-semibold text-main dark:text-main">
                {{ upi_demo: 'UPI demo option', card_demo: 'Card demo option', wire_transfer: 'Wire transfer demo option', in_store_pickup: 'Pickup demo option', cod: 'Cash on delivery demo option' }[order.paymentMethod]}
              </p>
              <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-sans ${order.paymentStatus === 'Payment Pending' ? 'bg-warning/10 text-warning-ink dark:bg-warning/10 dark:text-warning-ink' : 'bg-surface-soft text-muted dark:bg-surface-elevated dark:text-main'}`}>
                Status: {order.paymentStatus}
              </span>
            </div>
          </div>

          {/* Navigation action buttons */}
          <div className="pt-6 border-t border-border dark:border-border flex flex-col sm:flex-row items-center justify-between gap-3">
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
