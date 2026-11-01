import React, { useCallback, useRef } from 'react';
import { X, ShoppingBag, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { formatPrice } from '../../lib/utils';
import { KeycapButton } from '../../components/common/KeycapButton';
import { KeyBadge } from '../../components/common/KeyBadge';
import { MotionList } from '../../components/motion/MotionList';
import { CartItemRow } from './CartItemRow';
import { availableStock, cartItemKey, cartSavings, FreeShippingProgress } from './cartUiUtils';
import { useDrawerFocus, useDrawerPresence } from './useDrawerFocus';

export const CartDrawer: React.FC = () => {
  const { isCartOpen, setIsCartOpen, cart, products, wishlist, toggleWishlist, updateCartQuantity, removeFromCart, cartSubtotal, cartCount } = useStore();
  const navigate = useNavigate();
  const present = useDrawerPresence(isCartOpen);
  const panel = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setIsCartOpen(false), [setIsCartOpen]);
  useDrawerFocus(present, panel, close);
  if (!present) return null;

  const moveToWishlist = (id: string) => { if (!wishlist.includes(id)) toggleWishlist(id); removeFromCart(id); };
  const empty = <div className="flex min-h-60 flex-col items-center justify-center p-6 text-center">
    <ShoppingBag aria-hidden="true" className="mb-3 h-10 w-10 text-muted" />
    <h3 className="text-base font-semibold text-main dark:text-main">Your cart is empty</h3>
    <p className="my-3 text-xs text-muted dark:text-muted">Explore our selection of laptops, graphics cards, processors, and memory.</p>
    <KeycapButton variant="primary" onClick={() => { close(); navigate('/shop'); }}>Browse Hardware Catalog</KeycapButton>
  </div>;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div aria-hidden="true" data-open={isCartOpen} className="drawer-backdrop absolute inset-0 bg-overlay/60" onClick={close} />
      <div ref={panel} role="dialog" aria-modal="true" aria-labelledby="cart-drawer-title" tabIndex={-1} data-open={isCartOpen} className="drawer-panel fixed inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-border bg-surface shadow-2xl dark:border-border dark:bg-surface">
        <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border bg-surface-soft/70 p-4 dark:border-border dark:bg-surface/80">
          <div className="flex items-center gap-2.5">
            <ShoppingBag aria-hidden="true" className="h-5 w-5 text-accent dark:text-accent" />
            <div><h2 id="cart-drawer-title" className="text-base font-bold text-main dark:text-main">Shopping Cart</h2><p className="text-xs text-muted dark:text-muted">{cartCount} {cartCount === 1 ? 'item' : 'items'} in your cart</p></div>
          </div>
          <div className="flex items-center gap-2"><KeyBadge>Esc</KeyBadge><button type="button" onClick={close} className="cart-row-control h-10 w-10 text-muted dark:text-main" aria-label="Close cart drawer"><X aria-hidden="true" className="h-5 w-5" /></button></div>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3 sm:p-4">
          <MotionList items={cart} itemKey={cartItemKey} entranceId="cart-drawer" animateChanges className="space-y-3" empty={empty}>
            {item => <CartItemRow item={item} stock={availableStock(item, products)} onQuantityChange={updateCartQuantity} onRemove={removeFromCart} onMoveToWishlist={moveToWishlist} onNavigate={close} />}
          </MotionList>
        </div>
        {cart.length > 0 && <div className="shrink-0 space-y-3 border-t border-border bg-surface-soft p-4 pb-[max(1rem,env(safe-area-inset-bottom))] dark:border-border dark:bg-surface">
          <FreeShippingProgress subtotal={cartSubtotal} itemCount={cart.length} />
          <dl className="space-y-2 text-xs">
            <div className="flex justify-between gap-2 text-muted dark:text-main"><dt>Subtotal</dt><dd className="font-sans font-bold text-main dark:text-main price">{formatPrice(cartSubtotal)}</dd></div>
            <div className="flex justify-between gap-2 text-success-ink dark:text-success-ink"><dt>Total savings</dt><dd className="font-sans font-semibold price">{formatPrice(cartSavings(cart))}</dd></div>
          </dl>
          <div className="grid grid-cols-2 gap-2">
            <KeycapButton variant="outline" className="min-h-11" onClick={() => { close(); navigate('/cart'); }}>View Cart</KeycapButton>
            <KeycapButton variant="primary" className="min-h-11 font-semibold" onClick={() => { close(); navigate('/checkout'); }}><span className="inline-flex items-center gap-1">Checkout<ArrowRight aria-hidden="true" className="h-3.5 w-3.5" /></span></KeycapButton>
          </div>
        </div>}
      </div>
    </div>
  );
};
