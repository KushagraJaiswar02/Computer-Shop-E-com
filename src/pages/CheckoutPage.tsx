import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldAlert,
  CreditCard,
  Truck,
  CheckCircle2,
  Building,
  Lock,
  ArrowRight,
  Info,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../lib/utils';
import { KeycapButton } from '../components/common/KeycapButton';

export const CheckoutPage: React.FC = () => {
  const { cart, cartSubtotal, createOrder, clearCart } = useStore();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('Alexander Wright');
  const [email, setEmail] = useState('alex.wright@example.com');
  const [phone, setPhone] = useState('+1 (206) 555-0199');
  const [street, setStreet] = useState('742 Evergreen Terrace, Suite 400');
  const [city, setCity] = useState('Seattle');
  const [state, setState] = useState('WA');
  const [postalCode, setPostalCode] = useState('98101');
  const [paymentMethod, setPaymentMethod] = useState<'card_demo' | 'wire_transfer' | 'in_store_pickup'>('card_demo');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const freeShipping = cartSubtotal >= 299;
  const shippingCost = freeShipping ? 0 : 14.99;
  const tax = cartSubtotal * 0.085;
  const grandTotal = cartSubtotal + shippingCost + tax;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert('Your cart is empty.');
      navigate('/shop');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newOrder = createOrder({
        items: cart.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          sku: item.product.sku,
          image: item.product.images[0],
          price: item.unitPrice,
          quantity: item.quantity,
        })),
        subtotal: cartSubtotal,
        discount: 0,
        shipping: shippingCost,
        tax,
        total: grandTotal,
        shippingAddress: {
          id: `addr-${Date.now()}`,
          fullName,
          street,
          city,
          state,
          postalCode,
          phone,
          isDefault: true,
        },
        status: 'Processing',
        paymentMethod,
        paymentStatus: 'Demo Success',
        trackingNumber: `NT-TRACK-${Math.floor(10000000 + Math.random() * 90000000)}`,
        estimatedDelivery: '3 to 5 business days',
      });

      clearCart();
      setIsSubmitting(false);
      navigate(`/order-confirmation/${newOrder.id}`);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900 py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Prototype Warning Banner */}
        <div className="mb-8 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-3">
          <Info className="w-5 h-5 flex-shrink-0 text-amber-500 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm">Demonstration Checkout Environment</h4>
            <p className="mt-0.5 leading-relaxed">
              This storefront is a client demonstration prototype. No actual payment details are charged, and real credit card numbers should not be entered.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Form: Delivery & Simulated Payment Details */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Customer Contact & Shipping */}
            <div className="bg-white dark:bg-surface-850 rounded-2xl border border-slate-200 dark:border-surface-750 p-6 shadow-soft-card">
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                <span>1. Shipping & Customer Details</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-surface-800 border border-slate-300 dark:border-surface-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-surface-800 border border-slate-300 dark:border-surface-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={e => setStreet(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-surface-800 border border-slate-300 dark:border-surface-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-surface-800 border border-slate-300 dark:border-surface-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={e => setState(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-surface-800 border border-slate-300 dark:border-surface-700 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={postalCode}
                      onChange={e => setPostalCode(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-surface-800 border border-slate-300 dark:border-surface-700 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Phone (for courier delivery update) *
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-surface-800 border border-slate-300 dark:border-surface-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Simulated Payment Method */}
            <div className="bg-white dark:bg-surface-850 rounded-2xl border border-slate-200 dark:border-surface-750 p-6 shadow-soft-card">
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                <span>2. Simulated Demo Payment Method</span>
              </h2>

              <div className="space-y-3">
                <label
                  className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'card_demo'
                      ? 'border-brand-500 bg-brand-50/40 dark:bg-brand-950/30'
                      : 'border-slate-200 dark:border-surface-700 hover:bg-slate-50 dark:hover:bg-surface-800'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card_demo"
                    checked={paymentMethod === 'card_demo'}
                    onChange={() => setPaymentMethod('card_demo')}
                    className="mt-1 text-brand-600"
                  />
                  <div>
                    <span className="font-bold text-sm text-slate-900 dark:text-white block">
                      Credit / Debit Card (Simulated Demo Test)
                    </span>
                    <span className="text-xs text-slate-500 block mt-0.5">
                      Simulates a successful 3D-Secure instant transaction without requiring real card data.
                    </span>
                  </div>
                </label>

                <label
                  className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'wire_transfer'
                      ? 'border-brand-500 bg-brand-50/40 dark:bg-brand-950/30'
                      : 'border-slate-200 dark:border-surface-700 hover:bg-slate-50 dark:hover:bg-surface-800'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="wire_transfer"
                    checked={paymentMethod === 'wire_transfer'}
                    onChange={() => setPaymentMethod('wire_transfer')}
                    className="mt-1 text-brand-600"
                  />
                  <div>
                    <span className="font-bold text-sm text-slate-900 dark:text-white block">
                      Company Wire / Electronic Bank Transfer
                    </span>
                    <span className="text-xs text-slate-500 block mt-0.5">
                      Generate pro-forma invoice and hold components for 48 hours pending bank wire.
                    </span>
                  </div>
                </label>

                <label
                  className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'in_store_pickup'
                      ? 'border-brand-500 bg-brand-50/40 dark:bg-brand-950/30'
                      : 'border-slate-200 dark:border-surface-700 hover:bg-slate-50 dark:hover:bg-surface-800'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="in_store_pickup"
                    checked={paymentMethod === 'in_store_pickup'}
                    onChange={() => setPaymentMethod('in_store_pickup')}
                    className="mt-1 text-brand-600"
                  />
                  <div>
                    <span className="font-bold text-sm text-slate-900 dark:text-white block">
                      In-Store Retail Counter Collection & Payment
                    </span>
                    <span className="text-xs text-slate-500 block mt-0.5">
                      Collect assembled parts directly at our Silicon Valley retail tech counter.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white dark:bg-surface-850 rounded-2xl border border-slate-200 dark:border-surface-750 p-6 shadow-soft-card space-y-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white border-b border-slate-100 dark:border-surface-750 pb-3">
                Order Review ({cart.length} items)
              </h3>

              {/* Items preview */}
              <div className="divide-y divide-slate-100 dark:divide-surface-750 max-h-64 overflow-y-auto pr-1">
                {cart.map(item => (
                  <div key={item.product.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 truncate">
                      <img
                        src={item.product.images[0]}
                        alt=""
                        className="w-10 h-10 object-contain rounded bg-slate-50 dark:bg-surface-900 border border-slate-100 flex-shrink-0"
                      />
                      <div className="truncate">
                        <span className="font-semibold text-slate-900 dark:text-white truncate block">
                          {item.product.name}
                        </span>
                        <span className="text-slate-400 font-mono text-[10px]">
                          Qty: {item.quantity}
                        </span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      {formatPrice(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="pt-3 border-t border-slate-200 dark:border-surface-750 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Hardware Subtotal</span>
                  <span className="font-mono">{formatPrice(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Insured Express Shipping</span>
                  <span className="font-mono text-emerald-600 font-medium">
                    {freeShipping ? 'FREE' : formatPrice(shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Estimated Sales Tax (8.5%)</span>
                  <span className="font-mono">{formatPrice(tax)}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-surface-750 flex justify-between items-baseline font-bold text-slate-900 dark:text-white text-base">
                  <span>Total Due</span>
                  <span className="font-mono text-brand-600 dark:text-brand-400 text-xl font-extrabold">
                    {formatPrice(grandTotal)}
                  </span>
                </div>
              </div>

              <KeycapButton
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                className="w-full font-bold shadow-elevated"
              >
                <span>Place Demonstration Order</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </KeycapButton>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
