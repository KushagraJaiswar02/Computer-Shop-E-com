import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Tag,
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

  const freeShippingThreshold = 299;
  const isFreeShipping = cartSubtotal >= freeShippingThreshold;
  const shippingFee = cart.length === 0 || isFreeShipping ? 0 : 14.99;
  const discountAmount = (cartSubtotal * discountPercent) / 100;
  const taxAmount = (cartSubtotal - discountAmount) * 0.085; // 8.5% sample tax
  const grandTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee + taxAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    const code = couponCode.trim().toUpperCase();

    if (code === 'NEXUS10') {
      setDiscountPercent(10);
      setCouponSuccess('10% hardware discount applied successfully!');
    } else if (code === 'BUILDER50') {
      setDiscountPercent(15);
      setCouponSuccess('15% enthusiast builder discount applied!');
    } else {
      setCouponError('Invalid promotion code. Try "NEXUS10" for 10% demo discount.');
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900 py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-slate-200 dark:border-surface-750">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Shopping Cart
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Review selected hardware components and estimate shipping before checkout.
            </p>
          </div>

          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs text-rose-600 hover:text-rose-700 dark:text-rose-400 font-medium"
            >
              Clear Entire Cart
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="py-20 text-center bg-white dark:bg-surface-850 rounded-2xl border border-slate-200 dark:border-surface-750 p-8 shadow-soft-card">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-surface-800 flex items-center justify-center mx-auto mb-4 text-slate-400">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Your cart is currently empty
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
              You haven't added any components yet. Explore our gaming laptops, GPUs, processors, and memory.
            </p>
            <Link to="/shop">
              <KeycapButton variant="primary">Shop Hardware Catalog</KeycapButton>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Items Table */}
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-white dark:bg-surface-850 rounded-2xl border border-slate-200 dark:border-surface-750 overflow-hidden shadow-soft-card divide-y divide-slate-100 dark:divide-surface-750">
                {cart.map(item => (
                  <div
                    key={`${item.product.id}-${item.selectedVariantId || 'default'}`}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-20 h-20 object-contain rounded-xl bg-slate-50 dark:bg-surface-900 border border-slate-100 dark:border-surface-700 p-2 flex-shrink-0"
                      />
                      <div>
                        <span className="text-[10px] font-mono text-brand-600 dark:text-brand-400 font-bold uppercase">
                          {item.product.brandName}
                        </span>
                        <Link
                          to={`/product/${item.product.slug}`}
                          className="block text-sm font-bold text-slate-900 dark:text-white hover:text-brand-600 line-clamp-1"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-xs font-mono text-slate-500 mt-0.5">
                          SKU: {item.product.sku}
                        </p>
                        <span className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 block sm:hidden mt-1">
                          {formatPrice(item.unitPrice)} each
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                      {/* Quantity stepper */}
                      <div className="flex items-center border border-slate-300 dark:border-surface-700 rounded-lg bg-white dark:bg-surface-850 shadow-keycap">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="p-1.5 px-2.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2 text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          className="p-1.5 px-2.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Line subtotal */}
                      <div className="text-right min-w-[90px]">
                        <span className="text-sm sm:text-base font-extrabold font-mono text-slate-900 dark:text-white">
                          {formatPrice(item.unitPrice * item.quantity)}
                        </span>
                      </div>

                      {/* Remove item */}
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                        title="Remove product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Free shipping banner */}
              <div className="p-4 rounded-xl bg-brand-50 dark:bg-surface-800 border border-brand-100 dark:border-surface-700 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    {isFreeShipping
                      ? 'You have qualified for Free Express Tracked Delivery!'
                      : `Add ${formatPrice(freeShippingThreshold - cartSubtotal)} more to qualify for Free Shipping.`}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Order Summary & Checkout */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white dark:bg-surface-850 rounded-2xl border border-slate-200 dark:border-surface-750 p-6 shadow-soft-card space-y-5">
                <h3 className="font-bold text-base text-slate-900 dark:text-white border-b border-slate-100 dark:border-surface-750 pb-3">
                  Order Breakdown
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
                      <span>Promo Discount ({discountPercent}%)</span>
                      <span className="font-mono">-{formatPrice(discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Shipping (US Domestic)</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                      {isFreeShipping ? 'FREE' : formatPrice(shippingFee)}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Estimated Sales Tax (8.5%)</span>
                    <span className="font-mono text-slate-900 dark:text-slate-100">
                      {formatPrice(taxAmount)}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-slate-200 dark:border-surface-750 flex justify-between items-baseline text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                    <span>Estimated Total</span>
                    <span className="font-mono text-brand-600 dark:text-brand-400 text-xl">
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
                      onChange={e => setCouponCode(e.target.value)}
                      placeholder="Coupon (e.g. NEXUS10)"
                      className="flex-1 px-3 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-surface-800 border border-slate-300 dark:border-surface-700 text-slate-800 dark:text-white font-mono uppercase"
                    />
                    <KeycapButton type="submit" size="sm" variant="secondary">
                      Apply
                    </KeycapButton>
                  </div>
                  {couponSuccess && (
                    <p className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1 font-medium">
                      <Check className="w-3 h-3" /> {couponSuccess}
                    </p>
                  )}
                  {couponError && (
                    <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {couponError}
                    </p>
                  )}
                </form>

                {/* Checkout CTA */}
                <KeycapButton
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/checkout')}
                  className="w-full font-bold shadow-elevated"
                >
                  <span>Proceed to Demonstration Checkout</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </KeycapButton>

                <p className="text-[10px] text-center text-slate-400 leading-tight">
                  Simulated prototype checkout. No actual credit card charge is incurred.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
