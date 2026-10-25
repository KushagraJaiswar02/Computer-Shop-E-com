import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  CreditCard,
  Truck,
  ArrowRight,
  Info,
  QrCode,
  Store,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../lib/utils';
import { KeycapButton } from '../components/common/KeycapButton';

export const CheckoutPage: React.FC = () => {
  const { cart, cartSubtotal, createOrder, clearCart } = useStore();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'upi_demo' | 'card_demo' | 'in_store_pickup'>('upi_demo');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const freeShipping = cartSubtotal >= 2999;
  const shippingCost = freeShipping || cart.length === 0 ? 0 : 149;
  const grandTotal = cartSubtotal + shippingCost;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert('Your cart is empty.');
      navigate('/shop');
      return;
    }

    setIsSubmitting(true);

    const newOrder = createOrder({
        items: cart.map((item) => ({
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
        tax: 0,
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
        status: 'Pending',
        paymentMethod,
        paymentStatus: 'Payment Pending',
      });

    clearCart();
    setIsSubmitting(false);
    navigate(`/order-confirmation/${newOrder.id}`);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-900/50 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Prototype Environment Notice */}
        <div className="mb-6 p-4 rounded-xl bg-blue-50 dark:bg-slate-850 border border-blue-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-3">
          <Info className="w-5 h-5 flex-shrink-0 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              Demonstration Checkout Flow
            </h4>
            <p className="mt-0.5 leading-relaxed text-slate-600 dark:text-slate-400">
              This local preview stores the entered details in this browser only. No order is sent to a store, inventory is not reserved, and no payment is collected.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Left Form: Delivery & Payment Details */}
          <div className="lg:col-span-7 space-y-5">
            {/* Step 1: Customer Contact & Shipping */}
            <div className="bg-white dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
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
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Delivery Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Phone (for courier delivery dispatch) *
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Options */}
            <div className="bg-white dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>2. Payment Option</span>
              </h2>

              <div className="space-y-3">
                <label
                  className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
                    paymentMethod === 'upi_demo'
                      ? 'border-blue-500 bg-blue-50/40 dark:bg-blue-950/20'
                      : 'border-slate-200 dark:border-slate-750 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi_demo"
                    checked={paymentMethod === 'upi_demo'}
                    onChange={() => setPaymentMethod('upi_demo')}
                    className="mt-1 text-blue-600"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-blue-600" />
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        UPI / QR Code (Google Pay, PhonePe, Paytm, BHIM)
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 block mt-0.5">
                      Preview option only. No UPI or payment gateway is connected.
                    </span>
                  </div>
                </label>

                <label
                  className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
                    paymentMethod === 'card_demo'
                      ? 'border-blue-500 bg-blue-50/40 dark:bg-blue-950/20'
                      : 'border-slate-200 dark:border-slate-750 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card_demo"
                    checked={paymentMethod === 'card_demo'}
                    onChange={() => setPaymentMethod('card_demo')}
                    className="mt-1 text-blue-600"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        Debit / Credit Card & Net Banking
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 block mt-0.5">
                      Preview option only. No card or banking provider is connected.
                    </span>
                  </div>
                </label>

                <label
                  className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
                    paymentMethod === 'in_store_pickup'
                      ? 'border-blue-500 bg-blue-50/40 dark:bg-blue-950/20'
                      : 'border-slate-200 dark:border-slate-750 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="in_store_pickup"
                    checked={paymentMethod === 'in_store_pickup'}
                    onChange={() => setPaymentMethod('in_store_pickup')}
                    className="mt-1 text-blue-600"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <Store className="w-4 h-4 text-blue-600" />
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        Store Pickup (Demo Option)
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 block mt-0.5">
                      No pickup location or collection service has been configured.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                Order Review ({cart.length} items)
              </h3>

              {/* Items preview */}
              <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-64 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.product.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 truncate">
                      <img
                        src={item.product.images[0]}
                        alt=""
                        className="w-10 h-10 object-contain rounded bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex-shrink-0"
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
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Hardware Subtotal</span>
                  <span className="font-mono">{formatPrice(cartSubtotal)}</span>
                </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Sample shipping estimate</span>
                  <span className="font-mono text-emerald-600 font-medium">
                    {freeShipping ? 'FREE' : formatPrice(shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-slate-400 text-[11px]">
                  <span>Taxes</span>
                  <span className="font-mono">Not configured</span>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between items-baseline font-bold text-slate-900 dark:text-white text-base">
                  <span>Total Amount</span>
                  <span className="font-mono text-blue-600 dark:text-blue-400 text-xl font-bold">
                    {formatPrice(grandTotal)}
                  </span>
                </div>
              </div>

              <KeycapButton
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                className="w-full justify-center font-bold"
              >
                <span>Create Demo Order Preview</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </KeycapButton>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
