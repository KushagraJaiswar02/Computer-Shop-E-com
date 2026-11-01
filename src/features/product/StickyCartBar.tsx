import React, { useEffect, useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { formatPrice } from '../../lib/utils';
import { KeycapButton } from '../../components/common/KeycapButton';

interface StickyCartBarProps {
  product: Product;
  priceBoxRef: React.RefObject<HTMLDivElement>;
  onAddToCart: () => void;
  isEnquiryOpen: boolean;
}

export const StickyCartBar: React.FC<StickyCartBarProps> = ({ product, priceBoxRef, onAddToCart, isEnquiryOpen }) => {
  const desktop = useMediaQuery('(min-width: 1024px)');
  const { isCartOpen, isShortcutsModalOpen } = useStore();
  const [priceBoxPassed, setPriceBoxPassed] = useState(false);
  const [nearFooter, setNearFooter] = useState(false);

  useEffect(() => {
    const footer = document.querySelector('footer');
    if (!footer) return;
    // Hide before the footer enters the area occupied by the fixed bar.
    const observer = new IntersectionObserver(([entry]) => setNearFooter(entry.isIntersecting), { rootMargin: '0px 0px 96px 0px' });
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const priceBox = priceBoxRef.current;
    if (!priceBox) return;
    const header = document.querySelector('header');
    let observer: IntersectionObserver;
    const observe = () => {
      observer?.disconnect();
      const headerHeight = header?.getBoundingClientRect().height || 0;
      observer = new IntersectionObserver(([entry]) => {
        setPriceBoxPassed(!entry.isIntersecting && entry.boundingClientRect.bottom <= headerHeight);
      }, { rootMargin: `-${headerHeight}px 0px 0px 0px` });
      observer.observe(priceBox);
    };
    observe();
    const resize = new ResizeObserver(observe);
    if (header) resize.observe(header);
    return () => { observer.disconnect(); resize.disconnect(); };
  }, [priceBoxRef]);

  if ((desktop && !priceBoxPassed) || nearFooter || isCartOpen || isShortcutsModalOpen || isEnquiryOpen) return null;
  const unavailable = product.stockStatus === 'out_of_stock' || product.stock <= 0;

  return (
    <aside aria-label="Quick add to cart" className="fixed inset-x-0 bottom-0 z-10 border-t border-border bg-surface/95 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-lg backdrop-blur dark:border-border dark:bg-surface/95">
      <div className="shop-container shop-sticky-cart-container flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs sm:text-sm font-semibold text-main dark:text-main" title={product.name}>{product.name}</p>
          <p className="mt-1 font-sans text-sm sm:text-base font-bold text-main dark:text-main price">{formatPrice(product.price)}</p>
        </div>
        <KeycapButton type="button" variant="primary" onClick={onAddToCart} disabled={unavailable} aria-label={`Add ${product.name} to cart`} className="min-h-11 shrink-0 px-3 text-xs sm:text-sm">
          <span className="flex items-center gap-2"><ShoppingBag aria-hidden="true" className="hidden sm:block h-4 w-4" />{unavailable ? 'Out of stock' : 'Add to Cart'}</span>
        </KeycapButton>
      </div>
    </aside>
  );
};
