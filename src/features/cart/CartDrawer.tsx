import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Plus, Minus, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { formatPrice } from '../../lib/utils';
import { KeycapButton } from '../../components/common/KeycapButton';
import { KeyBadge } from '../../components/common/KeyBadge';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    cartSubtotal,
    cartCount,
  } = useStore();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const freeShippingThreshold = 2999;
  const standardShippingFee = 149;
  const isFreeShipping = cartSubtotal >= freeShippingThreshold;
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/80">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-lg">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 dark:text-white text-base">Shopping Cart</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {cartCount} {cartCount === 1 ? 'item' : 'items'} in your cart
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
          <div className="px-5 py-2.5 bg-blue-50/50 dark:bg-slate-850 border-b border-blue-100 dark:border-slate-800 text-xs">
            <div className="flex justify-between items-center mb-1 font-medium">
              <span className="text-slate-700 dark:text-slate-300">
                {amountToFreeShipping > 0
                  ? `Add ${formatPrice(amountToFreeShipping)} more for FREE shipping`
                  : 'Eligible for FREE Express Shipping!'}
              </span>
              <span className="font-mono text-blue-600 dark:text-blue-400 font-semibold">
                {progressPercent}%
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-blue-600 dark:bg-blue-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 dark:text-slate-500">
                <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                  <ShoppingBag className="w-7 h-7 text-slate-400" />
                </div>
                <p className="font-semibold text-slate-800 dark:text-slate-200 text-base mb-1">
                  Your cart is empty
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mb-5">
                  Explore our selection of laptops, graphics cards, processors, and memory.
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
              cart.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedVariantId || 'default'}`}
                  className="flex gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 shadow-xs"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-16 h-16 object-contain rounded-md bg-slate-50 dark:bg-slate-800 p-1 border border-slate-100 dark:border-slate-700 shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1.5">
                        <Link
                          to={`/product/${item.product.slug}`}
                          onClick={() => setIsCartOpen(false)}
                          className="text-xs font-semibold text-slate-800 dark:text-slate-100 line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          {item.product.name}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                        SKU: {item.product.sku}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-800">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 px-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-1.5 text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 px-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-xs sm:text-sm font-bold font-mono text-slate-900 dark:text-white">
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
            <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Subtotal</span>
                  <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">
                    {formatPrice(cartSubtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Shipping</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                    {isFreeShipping ? 'FREE' : formatPrice(standardShippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span>Estimated Total</span>
                  <span className="font-mono text-blue-600 dark:text-blue-400">
                    {formatPrice(isFreeShipping ? cartSubtotal : cartSubtotal + standardShippingFee)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 justify-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>GST invoice with official manufacturer warranty</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <KeycapButton
                  variant="outline"
                  size="md"
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/cart');
                  }}
                >
                  View Cart
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
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </KeycapButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
