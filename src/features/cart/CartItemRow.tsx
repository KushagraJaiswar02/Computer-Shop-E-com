import React from 'react';
import { Heart, Minus, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CartItem } from '../../types';
import { formatPrice } from '../../lib/utils';

interface CartItemRowProps {
  item: CartItem;
  stock: number;
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  onMoveToWishlist: (productId: string) => void;
  onNavigate?: () => void;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({ item, stock, onQuantityChange, onRemove, onMoveToWishlist, onNavigate }) => (
  <article className="cart-item-row rounded-xl border border-border bg-surface p-3 dark:border-border dark:bg-surface">
    <div className="flex gap-3">
      <img src={item.product.images[0]} alt={item.product.name} className="h-14 w-14 shrink-0 rounded-lg bg-surface-soft object-contain p-1 dark:bg-surface-elevated" />
      <div className="min-w-0 flex-1">
        <p className="mb-1 break-words text-[10px] font-medium text-muted dark:text-muted">{item.product.brandName}{item.product.series?.trim() ? ` · ${item.product.series.trim()}` : ''}</p>
        <Link to={`/product/${item.product.slug}`} onClick={onNavigate} className="line-clamp-2 text-xs font-semibold leading-snug text-main hover:text-accent dark:text-main dark:hover:text-accent">{item.product.name}</Link>
      </div>
      <button type="button" onClick={() => onRemove(item.product.id)} className="cart-row-control h-10 w-10 shrink-0 text-muted hover:text-danger-ink dark:hover:text-danger-ink" aria-label={`Remove ${item.product.name} from cart`} title="Remove item"><Trash2 aria-hidden="true" className="h-4 w-4" /></button>
    </div>
    <div className="mt-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
      <div className="inline-flex items-center rounded-lg border border-border dark:border-border">
        <button type="button" onClick={() => item.quantity <= 1 ? onRemove(item.product.id) : onQuantityChange(item.product.id, item.quantity - 1)} aria-label={`Decrease quantity of ${item.product.name}`} className="cart-row-control h-10 w-10"><Minus aria-hidden="true" className="h-3.5 w-3.5" /></button>
        <span className="min-w-5 text-center text-xs font-bold font-sans text-main dark:text-main">{item.quantity}</span>
        <button type="button" onClick={() => onQuantityChange(item.product.id, item.quantity + 1)} disabled={item.quantity >= stock} aria-label={`Increase quantity of ${item.product.name}`} className="cart-row-control h-10 w-10 disabled:opacity-40"><Plus aria-hidden="true" className="h-3.5 w-3.5" /></button>
      </div>
      <span className="whitespace-nowrap text-sm font-bold font-sans text-main dark:text-main price">{formatPrice(item.unitPrice * item.quantity)}</span>
    </div>
    {item.quantity > stock && <p role="status" className="mt-2 text-xs text-warning-ink dark:text-warning-ink">{stock === 0 ? 'Currently out of stock. Remove this item or move it to your wishlist.' : `Only ${stock} available. Reduce the quantity before checkout.`}</p>}
    <button type="button" onClick={() => onMoveToWishlist(item.product.id)} className="cart-row-control mt-1 min-h-10 gap-1.5 px-1 text-xs text-muted dark:text-main" aria-label={`Move ${item.product.name} to wishlist`}><Heart aria-hidden="true" className="h-3.5 w-3.5" />Move to wishlist</button>
  </article>
);
