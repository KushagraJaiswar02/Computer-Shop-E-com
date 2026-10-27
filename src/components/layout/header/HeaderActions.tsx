import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftRight, Heart, PackagePlus, ShoppingBag, UserRound } from 'lucide-react';
import { useStore } from '../../../context/StoreContext';

const utilityClass = 'relative inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-transparent text-slate-600 transition-colors hover:border-slate-200 hover:bg-slate-50 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-white';

export const HeaderActions: React.FC = () => {
  const { cartCount, setIsCartOpen, wishlist, compareList } = useStore();

  return (
    <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
      <Link to="/enquiry?request=product" title="Request a Product" aria-label="Request a Product" className="hidden h-9 shrink-0 items-center gap-1.5 rounded-md border border-blue-200 px-2 text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-blue-900 dark:text-blue-300 dark:hover:bg-slate-800 lg:inline-flex">
        <PackagePlus className="h-4 w-4" />Request a Product
      </Link>
      <Link to="/auth/login" className={utilityClass} title="Login or open your account" aria-label="Login or open your account">
        <UserRound className="h-4 w-4" />
      </Link>
      <Link to="/compare" className={utilityClass} title={`Compare products${compareList.length ? `, ${compareList.length} selected` : ''}`} aria-label={`Compare products${compareList.length ? `, ${compareList.length} selected` : ''}`}>
        <ArrowLeftRight className="h-4 w-4" />
        {compareList.length > 0 && <span aria-hidden="true" className="absolute right-0 top-0 flex h-3.5 min-w-3.5 -translate-y-1/4 translate-x-1/4 items-center justify-center rounded-full bg-blue-600 px-1 text-[9px] font-bold text-white">{compareList.length}</span>}
      </Link>
      <Link to="/wishlist" className={utilityClass} title={`Wishlist${wishlist.length ? `, ${wishlist.length} saved items` : ''}`} aria-label={`Wishlist${wishlist.length ? `, ${wishlist.length} saved items` : ''}`}>
        <Heart className="h-4 w-4" />
        {wishlist.length > 0 && <span aria-hidden="true" className="absolute right-0 top-0 flex h-3.5 min-w-3.5 -translate-y-1/4 translate-x-1/4 items-center justify-center rounded-full bg-rose-600 px-1 text-[9px] font-bold text-white">{wishlist.length}</span>}
      </Link>
      <button type="button" onClick={() => setIsCartOpen(true)} className={`${utilityClass} border-blue-100 bg-blue-50/80 dark:border-blue-950 dark:bg-blue-950/40`} title={`Shopping cart${cartCount ? `, ${cartCount} items` : ''}`} aria-label={`Shopping cart${cartCount ? `, ${cartCount} items` : ''}`}>
        <ShoppingBag className="h-4 w-4 text-blue-700 dark:text-blue-300" />
        {cartCount > 0 && <span aria-hidden="true" className="absolute right-0 top-0 flex h-3.5 min-w-3.5 -translate-y-1/4 translate-x-1/4 items-center justify-center rounded-full bg-blue-600 px-1 text-[9px] font-bold text-white">{cartCount}</span>}
      </button>
    </div>
  );
};
