import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  ArrowRight,
  Check,
  AlertCircle,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../lib/utils';
import { KeycapButton } from '../components/common/KeycapButton';
import { MotionList } from '../components/motion/MotionList';
import { CartItemRow } from '../features/cart/CartItemRow';
import { availableStock, cartItemKey, cartSavings, FreeShippingProgress } from '../features/cart/cartUiUtils';
import { cartPreviewConfig } from '../features/cart/cartUiConfig';

export const CartPage: React.FC = () => {
  const { cart, products, wishlist, toggleWishlist, updateCartQuantity, removeFromCart, clearCart, cartSubtotal } = useStore();
  const moveToWishlist = (id: string) => { if (!wishlist.includes(id)) toggleWishlist(id); removeFromCart(id); };
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const freeShippingThreshold = cartPreviewConfig.shippingThreshold;
  const isFreeShipping = cartSubtotal >= freeShippingThreshold;
  const shippingFee = cart.length === 0 || isFreeShipping ? 0 : cartPreviewConfig.shippingFee;
  const discountAmount = Math.round((cartSubtotal * discountPercent) / 100);
  const grandTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    const code = couponCode.trim().toUpperCase();

    if (code === cartPreviewConfig.couponCode) {
      setDiscountPercent(cartPreviewConfig.couponDiscountPercent);
      setCouponSuccess(`${cartPreviewConfig.couponDiscountPercent}% demo discount preview applied.`);
    } else {
      setCouponError(`Invalid demo code. The sample code is ${cartPreviewConfig.couponCode}.`);
    }
  };

  return (
    <div className="cart-page min-h-screen bg-surface-soft/70 dark:bg-surface/50 py-6 sm:py-8">
      <div className="shop-container ">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-border dark:border-border">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-main dark:text-main">
              Shopping Cart
            </h1>
            <p className="text-xs sm:text-sm text-muted dark:text-muted mt-0.5">
              Review example catalog items. This demo does not create live orders or apply retailer shipping terms.
            </p>
          </div>

          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="min-h-10 shrink-0 text-xs text-danger-ink hover:text-danger-ink dark:text-danger-ink font-medium"
            >
              Clear Cart
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="py-16 text-center bg-surface dark:bg-surface rounded-xl border border-border dark:border-border p-8 shadow-xs">
            <div className="w-14 h-14 rounded-full bg-surface-soft dark:bg-surface-elevated flex items-center justify-center mx-auto mb-3 text-muted">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-main dark:text-main mb-1">
              Your cart is currently empty
            </h3>
            <p className="text-xs sm:text-sm text-muted dark:text-muted max-w-sm mx-auto mb-5">
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
              <MotionList items={cart} itemKey={cartItemKey} entranceId="cart-page" animateChanges className="space-y-3">
                {item => <CartItemRow item={item} stock={availableStock(item, products)} onQuantityChange={updateCartQuantity} onRemove={removeFromCart} onMoveToWishlist={moveToWishlist} />}
              </MotionList>
              <FreeShippingProgress subtotal={cartSubtotal} itemCount={cart.length} />
            </div>

            {/* Right Order Summary & Checkout */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-surface dark:bg-surface rounded-xl border border-border dark:border-border p-5 shadow-xs space-y-4">
                <h3 className="font-bold text-base text-main dark:text-main border-b border-border dark:border-border pb-3">
                  Order Summary
                </h3>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-muted dark:text-muted">
                    <span>Hardware Subtotal</span>
                    <span className="font-sans font-semibold text-main dark:text-main price">
                      {formatPrice(cartSubtotal)}
                    </span>
                  </div>

                  <div className="flex justify-between text-success-ink dark:text-success-ink">
                    <span>Product savings</span><span className="font-sans price">{formatPrice(cartSavings(cart))}</span>
                  </div>

                  {discountPercent > 0 && (
                    <div className="flex justify-between text-success-ink dark:text-success-ink font-medium">
                      <span>Demo coupon preview ({discountPercent}%)</span>
                      <span className="font-sans">-{formatPrice(discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-muted dark:text-muted">
                    <span>Sample shipping estimate</span>
                    <span className="font-sans text-success-ink dark:text-success-ink font-semibold">
                      {isFreeShipping ? 'FREE' : formatPrice(shippingFee)}
                    </span>
                  </div>

                  <div className="flex justify-between text-muted dark:text-muted text-[11px]">
                    <span>Taxes</span>
                    <span className="font-sans">Not configured</span>
                  </div>

                  <div className="pt-3 border-t border-border dark:border-border flex justify-between items-baseline text-sm sm:text-base font-bold text-main dark:text-main">
                    <span>Total Amount</span>
                    <span className="font-sans text-accent dark:text-accent text-xl font-bold price">
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
                      placeholder={`Demo coupon (${cartPreviewConfig.couponCode})`}
                      className="min-w-0 flex-1 px-3 py-1.5 rounded-lg text-xs bg-surface-soft dark:bg-surface-elevated border border-border dark:border-border text-main dark:text-main font-sans uppercase focus:outline-none focus:ring-1 focus:ring-focus"
                    />
                    <KeycapButton type="submit" size="sm" variant="outline">
                      Apply
                    </KeycapButton>
                  </div>
                  {couponSuccess && (
                    <p className="text-[11px] text-success-ink mt-1.5 flex items-center gap-1 font-medium">
                      <Check className="w-3 h-3" /> {couponSuccess}
                    </p>
                  )}
                  {couponError && (
                    <p className="text-[11px] text-danger-ink mt-1.5 flex items-center gap-1">
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
                  <span className="inline-flex items-center gap-1.5">Proceed to Checkout<ArrowRight aria-hidden="true" className="w-4 h-4" /></span>
                </KeycapButton>

                <p className="text-[11px] text-center text-muted leading-tight">
                  Demo checkout does not create an invoice, confirm warranty coverage, or send an order.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
