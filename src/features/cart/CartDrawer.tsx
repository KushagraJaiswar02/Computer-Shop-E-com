import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Plus, Minus, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { formatPrice } from '../../lib/utils';
import { KeycapButton } from '../../components/common/KeycapButton';
import { KeyBadge } from '../../components/common/KeyBadge';

export const CartDrawer: React.FC = () => {
  const { isCartOpen, setIsCartOpen, cart, updateCartQuantity, removeFromCart, cartSubtotal, cartCount } =
    useStore();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const freeShippingThreshold = 299;
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-surface-850 shadow-2xl flex flex-col border-l border-slate-200 dark:border-surface-700 animate-slide-left">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-surface-700 flex items-center justify-between bg-slate-50/60 dark:bg-surface-900/60">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 rounded-lg">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900 dark:text-white">Shopping Cart</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {cartCount} {cartCount === 1 ? 'hardware item' : 'hardware items'} selected
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <KeyBadge>Esc</KeyBadge>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
                aria-label="Close cart drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Free Shipping Tracker */}
          <div className="px-5 py-3 bg-brand-50/50 dark:bg-surface-800/80 border-b border-brand-100/80 dark:border-surface-700/60 text-xs">
            <div className="flex justify-between items-center mb-1.5 font-medium">
              <span className="text-slate-700 dark:text-slate-300">
                {amountToFreeShipping > 0
                  ? `Add ${formatPrice(amountToFreeShipping)} more for FREE Express Shipping`
                  : '🎉 You qualified for FREE Express Shipping!'}
              </span>
              <span className="font-mono text-brand-600 dark:text-brand-400 font-semibold">{progressPercent}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-surface-700 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-brand-600 dark:bg-brand-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 dark:text-slate-500">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-surface-800 flex items-center justify-center mb-3">
                  <ShoppingBag className="w-8 h-8 opacity-40 text-slate-400" />
                </div>
                <p className="font-semibold text-slate-800 dark:text-slate-200 text-base mb-1">Your cart is empty</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mb-5">
                  Explore our selection of gaming laptops, high-tier GPUs, CPUs, and fast NVMe storage.
                </p>
                <KeycapButton
                  variant="primary"
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/shop');
                  }}
                >
                  Browse Hardware Catalog
                </KeycapButton>
              </div>
            ) : (
              cart.map(item => (
                <div
                  key={`${item.product.id}-${item.selectedVariantId || 'default'}`}
                  className="flex gap-3.5 p-3 rounded-lg border border-slate-200 dark:border-surface-750 bg-white dark:bg-surface-800/60 shadow-soft-card transition-all"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-18 h-18 sm:w-20 sm:h-20 object-cover rounded-md bg-slate-100 dark:bg-surface-900 border border-slate-100 dark:border-surface-700 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          to={`/product/${item.product.slug}`}
                          onClick={() => setIsCartOpen(false)}
                          className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 line-clamp-2 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                        >
                          {item.product.name}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                        SKU: {item.product.sku}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-surface-700/60">
                      <div className="flex items-center border border-slate-200 dark:border-surface-700 rounded-md bg-slate-50 dark:bg-surface-900 shadow-keycap dark:shadow-keycap-dark">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 px-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-mono font-medium text-slate-800 dark:text-slate-200">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 px-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-surface-700 bg-slate-50 dark:bg-surface-900/90 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Subtotal</span>
                  <span className="font-mono font-medium text-slate-900 dark:text-slate-100">
                    {formatPrice(cartSubtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Estimated Shipping</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-medium">
                    {cartSubtotal >= freeShippingThreshold ? 'FREE' : '$14.99'}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-surface-750">
                  <span>Total (Demo)</span>
                  <span className="font-mono text-brand-600 dark:text-brand-400">
                    {formatPrice(cartSubtotal >= freeShippingThreshold ? cartSubtotal : cartSubtotal + 14.99)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 justify-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Manufacturer warranty included on all components</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <KeycapButton
                  variant="secondary"
                  size="md"
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/cart');
                  }}
                >
                  View Full Cart
                </KeycapButton>
                <KeycapButton
                  variant="primary"
                  size="md"
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/checkout');
                  }}
                  className="font-semibold"
                >
                  Checkout
                  <ArrowRight className="w-4 h-4 ml-1" />
                </KeycapButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
