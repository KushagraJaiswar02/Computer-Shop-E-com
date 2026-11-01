import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, GitCompareArrows, Heart, ShoppingBag } from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { formatPrice } from '../../lib/utils';
import { extractSpecChips } from '../../features/catalog/specUtils';

const MAX_COMPARE = 4;
interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  cartActionLabel?: string;
  muteUnavailable?: boolean;
}

export const ProductCardSkeleton: React.FC = () => (
  <div aria-label="Loading product" role="status" className="product-card product-card-skeleton flex h-full flex-col rounded-xl border border-border bg-surface dark:border-border dark:bg-surface">
    <div className="product-card-media mx-auto w-full max-w-[224px] aspect-[4/3] rounded-t-xl bg-surface-soft dark:bg-surface-elevated" />
    <div className="flex flex-1 flex-col gap-1.5 p-2 sm:p-2.5">
      <div className="skeleton-block h-3 w-24" />
      <div className="h-[2.75em] text-xs sm:text-sm"><div className="skeleton-block mb-1 h-3 w-full" /><div className="skeleton-block h-3 w-3/4" /></div>
      <div className="flex gap-1"><div className="skeleton-block h-4 w-14" /><div className="skeleton-block h-4 w-12" /></div>
      <div className="mt-auto pt-2"><div className="skeleton-block mb-2 h-5 w-24" /><div className="flex gap-1"><div className="skeleton-block h-10 flex-1" /><div className="skeleton-block h-10 w-10" /><div className="skeleton-block h-10 w-10" /></div></div>
    </div>
  </div>
);

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, cartActionLabel = 'Add to Cart', muteUnavailable = false }) => {
  const { addToCart, wishlist, toggleWishlist, compareList, toggleCompare, focusedProductId, setFocusedProductId } = useStore();
  const [added, setAdded] = useState(false);
  const [heartPop, setHeartPop] = useState(0);
  const addedTimer = useRef<ReturnType<typeof setTimeout>>();
  const series = product.series?.trim();
  const saved = wishlist.includes(product.id);
  const previouslySaved = useRef(saved);
  const compared = compareList.includes(product.id);
  const compareDisabled = !compared && compareList.length >= MAX_COMPARE;
  const unavailable = product.stockStatus === 'out_of_stock' || product.stock <= 0;
  const lowStock = !unavailable && (product.stockStatus === 'low_stock' || product.stock <= 5);
  const stockLabel = unavailable ? 'Out of stock' : lowStock ? `Only ${product.stock} left` : 'In stock';
  const stockColor = unavailable ? 'text-danger-ink dark:text-danger-ink' : lowStock ? 'text-warning-ink dark:text-warning-ink' : 'text-success-ink dark:text-success-ink';
  const stockDot = unavailable ? 'bg-danger' : lowStock ? 'bg-warning' : 'bg-success';
  const chips = useMemo(() => extractSpecChips(product), [product]);
  useEffect(() => () => clearTimeout(addedTimer.current), []);
  useEffect(() => {
    if (saved && !previouslySaved.current) setHeartPop(value => value + 1);
    previouslySaved.current = saved;
  }, [saved]);

  const handleAdd = (event: React.MouseEvent) => {
    event.preventDefault(); event.stopPropagation();
    if (unavailable) return;
    if (onAddToCart) onAddToCart(product); else addToCart(product, 1);
    clearTimeout(addedTimer.current);
    setAdded(true);
    addedTimer.current = setTimeout(() => setAdded(false), 1200);
  };
  const compareTitle = compared ? 'Remove from comparison' : compareDisabled ? `Comparison limit reached (max ${MAX_COMPARE} products)` : 'Add to comparison';

  return (
    <article data-unavailable={unavailable && muteUnavailable} className={`product-card relative flex h-full min-w-0 flex-col rounded-xl border bg-surface dark:bg-surface ${focusedProductId === product.id ? 'border-primary ring-1 ring-focus/20' : 'border-border dark:border-border'}`}
      onMouseEnter={event => { if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) setFocusedProductId(product.id); }} onMouseLeave={() => setFocusedProductId(null)} onFocus={() => setFocusedProductId(product.id)} onBlur={() => setFocusedProductId(null)}>
      <div className="relative rounded-t-xl border-b border-border bg-surface-soft/60 dark:border-border dark:bg-surface/40">
        {product.discountPercent && product.discountPercent > 0 && product.originalPrice && product.originalPrice > product.price ? <span className="absolute left-1.5 top-1.5 z-10 rounded bg-discount-badge px-1.5 py-0.5 text-[10px] font-sans font-bold text-on-primary">-{product.discountPercent}%</span> : null}
        <div className="product-card-media relative mx-auto aspect-[4/3] w-full max-w-[224px]">
          <Link to={`/product/${product.slug}`} className="absolute inset-1.5 flex items-center justify-center overflow-hidden rounded-lg p-1">
            <img src={product.images[0]} alt={product.name} loading="lazy" decoding="async" className="product-card-image max-h-full max-w-full object-contain" />
          </Link>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-1.5 min-[360px]:p-2 sm:p-2.5">
        <p className="break-words text-[10px] font-medium leading-tight text-muted dark:text-muted">{product.brandName}{series && <span> · {series}</span>}</p>
        <Link to={`/product/${product.slug}`} title={product.name} className="line-clamp-2 h-[2.75em] shrink-0 text-xs sm:text-sm font-semibold leading-snug text-main hover:text-accent dark:text-main dark:hover:text-accent">{product.name}</Link>
        {chips.length > 0 && <div role="group" aria-label="Specifications (scroll for more)" tabIndex={0} className="product-card-specs flex gap-1 overflow-x-auto rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">
          {chips.map(chip => <span key={chip} title={chip} className="shrink-0 rounded border border-border/70 bg-surface-soft px-1.5 py-0.5 text-[9px] sm:text-[10px] font-medium leading-tight text-muted dark:border-border dark:bg-surface-elevated dark:text-main">{chip}</span>)}
        </div>}
        <div className="mt-auto pt-1.5">
          <div className="flex flex-wrap items-center justify-between gap-x-1 gap-y-0.5">
            <span className="whitespace-nowrap font-sans text-xs sm:text-sm font-bold text-main dark:text-main price">{formatPrice(product.price)}</span>
            <span className={`inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-[10px] font-medium ${stockColor}`}><span className={`h-1.5 w-1.5 shrink-0 rounded-full ${stockDot}`} />{stockLabel}</span>
          </div>
          {product.originalPrice !== undefined && product.originalPrice > product.price && <span className="block whitespace-nowrap text-[10px] leading-tight font-sans text-muted line-through price">{formatPrice(product.originalPrice)}</span>}
          <div className="mt-1.5 flex items-center gap-0 min-[360px]:gap-0.5 sm:gap-1.5">
            <button type="button" disabled={unavailable} onClick={handleAdd} aria-label={unavailable ? `${product.name} is out of stock` : `${cartActionLabel === 'Move to cart' ? 'Move' : 'Add'} ${product.name} to cart`}
              className={`card-action flex h-10 min-w-10 flex-1 items-center justify-center gap-0.5 rounded-lg border px-0.5 sm:px-1 text-[10px] sm:text-xs font-semibold ${unavailable ? 'cursor-not-allowed border-border bg-surface-soft text-muted dark:border-border dark:bg-surface-elevated/40 dark:text-muted' : added ? 'border-success bg-success/10 text-success-ink dark:bg-success/10 dark:text-success-ink' : 'border-border bg-surface-soft/80 text-main dark:border-border dark:bg-surface-elevated/70 dark:text-main'}`}>
              {added ? <Check aria-hidden="true" className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 shrink-0" /> : !unavailable && <ShoppingBag aria-hidden="true" className="hidden min-[480px]:block h-3.5 w-3.5 shrink-0" />}
              <span className={`${added ? 'text-[9px] sm:text-xs' : ''} leading-tight`}>{unavailable ? 'Out of stock' : added ? 'Added' : cartActionLabel}</span>
            </button>
            <button type="button" onClick={event => { event.preventDefault(); event.stopPropagation(); toggleWishlist(product.id); }} aria-pressed={saved} aria-label={`${saved ? 'Remove' : 'Add'} ${product.name} ${saved ? 'from' : 'to'} wishlist`} title={saved ? 'Remove from wishlist' : 'Save to wishlist'}
              className={`card-action flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${saved ? 'border-danger bg-danger/10 text-danger-ink dark:border-danger/50 dark:bg-danger/10 dark:text-danger-ink' : 'border-border bg-surface-soft/80 text-muted dark:border-border dark:bg-surface-elevated/70'}`}>
              <Heart key={heartPop} aria-hidden="true" className={`h-4 w-4 ${saved ? 'fill-danger-ink text-danger-ink' : ''} ${heartPop && saved ? 'heart-pop' : ''}`} />
            </button>
            <span className="inline-flex shrink-0" title={compareTitle}><button type="button" disabled={compareDisabled} onClick={event => { event.preventDefault(); event.stopPropagation(); if (!compareDisabled) toggleCompare(product.id); }} aria-pressed={compared} aria-label={`${compared ? 'Remove' : 'Add'} ${product.name} ${compared ? 'from' : 'to'} comparison`} title={compareTitle}
              className={`card-action compare-action flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${compared ? 'border-info bg-info/10 text-info-ink dark:border-info dark:bg-info/10 dark:text-info-ink' : compareDisabled ? 'cursor-not-allowed border-border bg-surface-soft/40 text-muted dark:border-border dark:bg-surface/30 dark:text-muted' : 'border-border bg-surface-soft/80 text-muted dark:border-border dark:bg-surface-elevated/70'}`}><GitCompareArrows aria-hidden="true" className="h-4 w-4" /></button></span>
          </div>
          <span className="sr-only" role="status">{added ? `${product.name} added to cart` : ''}</span>
        </div>
      </div>
    </article>
  );
};
