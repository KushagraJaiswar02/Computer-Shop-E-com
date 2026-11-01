import React from 'react';
import { cartUiConfig } from './cartUiConfig';
import { formatPrice } from '../../lib/utils';
import { CartItem, Product } from '../../types';

export const cartItemKey = (item: CartItem) => `${item.product.id}:${item.selectedVariantId || 'default'}`;
export const cartSavings = (cart: CartItem[]) => cart.reduce((total, item) => total + Math.max(0, (item.product.originalPrice ?? item.unitPrice) - item.unitPrice) * item.quantity, 0);
export const availableStock = (item: CartItem, products: Product[]) => {
  const product = products.find(product => product.id === item.product.id) || item.product;
  return product.stockStatus === 'out_of_stock' ? 0 : Math.max(0, product.stock);
};

export const FreeShippingProgress: React.FC<{ subtotal: number; itemCount: number }> = ({ subtotal, itemCount }) => {
  const threshold = cartUiConfig.freeShippingThreshold;
  if (!itemCount || threshold === undefined || !Number.isFinite(threshold) || threshold <= 0) return null;
  const remaining = Math.max(0, threshold - subtotal);
  const progress = Math.max(0, Math.min(100, subtotal / threshold * 100));
  return (
    <div className="rounded-lg border border-primary bg-accent/10 p-3 text-xs dark:border-border dark:bg-surface">
      <p className="mb-2 font-medium text-main dark:text-main">{remaining > 0 ? `Add ${formatPrice(remaining)} more for free shipping` : 'Free-shipping threshold reached'}</p>
      <div role="progressbar" aria-label="Free shipping progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)} className="h-1.5 overflow-hidden rounded-full bg-surface-soft dark:bg-surface-soft">
        <div className="cart-shipping-progress h-full origin-left bg-primary dark:bg-accent/10" style={{ transform: `scaleX(${progress / 100})` }} />
      </div>
    </div>
  );
};
