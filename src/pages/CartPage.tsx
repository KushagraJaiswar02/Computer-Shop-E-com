import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Check,
  AlertCircle,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../lib/utils';
import { KeycapButton } from '../components/common/KeycapButton';

export const CartPage: React.FC = () => {
  const { cart, updateCartQuantity, removeFromCart, clearCart, cartSubtotal } = useStore();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const freeShippingThreshold = 2999;
  const isFreeShipping = cartSubtotal >= freeShippingThreshold;
  const shippingFee = cart.length === 0 || isFreeShipping ? 0 : 149;
  const discountAmount = Math.round((cartSubtotal * discountPercent) / 100);
  const grandTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    const code = couponCode.trim().toUpperCase();

    if (code === 'TECH10') {
      setDiscountPercent(10);
      setCouponSuccess('10% hardware discount applied successfully!');
    } else if (code === 'BUILDER15') {
      setDiscountPercent(15);
      setCouponSuccess('15% PC builder discount applied!');
    } else {
      setCouponError('Invalid coupon code. Try "TECH10" for 10% discount.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-900/50 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Shopping Cart
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Review selected hardware components and estimate delivery before checkout.
            </p>
          </div>

          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs text-rose-600 hover:text-rose-700 dark:text-rose-400 font-medium"
            >
              Clear Cart
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="py-16 text-center bg-white dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 p-8 shadow-xs">
            <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3 text-slate-400">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Your cart is currently empty
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-5">
              Explore our selection of laptops, graphics cards, processors, and memory.
            </p>
            <Link to="/shop">
              <KeycapButton variant="primary">Shop Hardware Catalog</KeycapButton>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            {/* Left Items Table */}
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-white dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs divide-y divide-slate-100 dark:divide-slate-800">
                {cart.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedVariantId || 'default'}`}
                    className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-1.5 flex-shrink-0"
                      />
                      <div>
                        <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 font-bold uppercase">
                          {item.product.brandName}
                        </span>
                        <Link
                          to={`/product/${item.product.slug}`}
                          className="block text-sm font-bold text-slate-900 dark:text-white hover:text-blue-600 line-clamp-1"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-xs font-mono text-slate-400 mt-0.5">
                          SKU: {item.product.sku}
                        </p>
                        <span className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 block sm:hidden mt-1">
                          {formatPrice(item.unitPrice)} each
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto">
                      {/* Quantity stepper */}
                      <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-850">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 px-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2 text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 px-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Line subtotal */}
                      <div className="text-right min-w-[90px]">
                        <span className="text-sm sm:text-base font-bold font-mono text-slate-900 dark:text-white">
                          {formatPrice(item.unitPrice * item.quantity)}
                        </span>
                      </div>

                      {/* Remove item */}
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="Remove product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Free shipping banner */}
              <div className="p-3.5 rounded-xl bg-blue-50/60 dark:bg-slate-850 border border-blue-100 dark:border-slate-800 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    {isFreeShipping
                      ? 'You have qualified for Free Express Delivery!'
                      : `Add ${formatPrice(freeShippingThreshold - cartSubtotal)} more to qualify for Free Shipping.`}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Order Summary & Checkout */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
                <h3 className="font-bold text-base text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                  Order Summary
                </h3>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Hardware Subtotal</span>
                    <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">
                      {formatPrice(cartSubtotal)}
                    </span>
                  </div>

                  {discountPercent > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                      <span>Coupon Discount ({discountPercent}%)</span>
                      <span className="font-mono">-{formatPrice(discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Shipping</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                      {isFreeShipping ? 'FREE' : formatPrice(shippingFee)}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-500 dark:text-slate-400 text-[11px]">
                    <span>GST (18% inclusive)</span>
                    <span className="font-mono">Included</span>
                  </div>

                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-baseline text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    <span>Total Amount</span>
                    <span className="font-mono text-blue-600 dark:text-blue-400 text-xl font-bold">
                      {formatPrice(grandTotal)}
                    </span>
                  </div>
                </div>

                {/* Promo Code Form */}
                <form onSubmit={handleApplyCoupon} className="pt-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Coupon (e.g. TECH10)"
                      className="flex-1 px-3 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white font-mono uppercase focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <KeycapButton type="submit" size="sm" variant="outline">
                      Apply
                    </KeycapButton>
                  </div>
                  {couponSuccess && (
                    <p className="text-[11px] text-emerald-600 mt-1.5 flex items-center gap-1 font-medium">
                      <Check className="w-3 h-3" /> {couponSuccess}
                    </p>
                  )}
                  {couponError && (
                    <p className="text-[11px] text-rose-500 mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {couponError}
                    </p>
                  )}
                </form>

                {/* Checkout CTA */}
                <KeycapButton
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/checkout')}
                  className="w-full justify-center font-bold"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </KeycapButton>

                <p className="text-[11px] text-center text-slate-400 leading-tight">
                  Official tax invoice and brand warranty documents generated on completion.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
