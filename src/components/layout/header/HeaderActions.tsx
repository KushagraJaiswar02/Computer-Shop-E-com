import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftRight, Heart, ShoppingBag } from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { HeaderAccount } from './HeaderAccount';

const utilityClass = 'shop-icon-button relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-transparent text-muted transition-colors hover:border-border hover:bg-surface-soft hover:text-main focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus dark:text-main dark:hover:border-border dark:hover:bg-surface-elevated dark:hover:text-main';

export const HeaderActions: React.FC = () => {
  const { cartCount, setIsCartOpen, wishlist, compareList } = useStore();
  const previousCount = useRef(cartCount);
  const [cartBump, setCartBump] = useState(0);
  useEffect(() => {
    if (cartCount > previousCount.current) setCartBump(value => value + 1);
    previousCount.current = cartCount;
  }, [cartCount]);

  return (
    <div className="shop-action-list">
      <HeaderAccount className={utilityClass} />
      <Link to="/compare" className={`${utilityClass} shop-secondary-action`} title={`Compare products${compareList.length ? `, ${compareList.length} selected` : ''}`} aria-label={`Compare products${compareList.length ? `, ${compareList.length} selected` : ''}`}>
        <ArrowLeftRight className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
        {compareList.length > 0 && <span aria-hidden="true" className="absolute right-0 top-0 -translate-y-1/4 translate-x-1/4"><span key={compareList.length} className="header-badge-pop flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-on-primary">{compareList.length}</span></span>}
      </Link>
      <Link to="/wishlist" className={`${utilityClass} shop-secondary-action`} title={`Wishlist${wishlist.length ? `, ${wishlist.length} saved items` : ''}`} aria-label={`Wishlist${wishlist.length ? `, ${wishlist.length} saved items` : ''}`}>
        <Heart className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
        {wishlist.length > 0 && <span aria-hidden="true" className="absolute right-0 top-0 -translate-y-1/4 translate-x-1/4"><span key={wishlist.length} className="header-badge-pop flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-danger px-1 text-[9px] font-bold text-on-semantic">{wishlist.length}</span></span>}
      </Link>
      <button type="button" onClick={() => setIsCartOpen(true)} className={`${utilityClass} border-border bg-surface-soft`} title={`Shopping cart${cartCount ? `, ${cartCount} items` : ''}`} aria-label={`Shopping cart${cartCount ? `, ${cartCount} items` : ''}`}>
        <ShoppingBag key={cartBump} className={`h-4 w-4 sm:h-[18px] sm:w-[18px] text-accent dark:text-accent ${cartBump ? 'cart-icon-bump' : ''}`} />
        {cartCount > 0 && <span aria-hidden="true" className="absolute right-0 top-0 -translate-y-1/4 translate-x-1/4"><span key={cartCount} className="header-badge-pop flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-on-primary">{cartCount}</span></span>}
      </button>
    </div>
  );
};
