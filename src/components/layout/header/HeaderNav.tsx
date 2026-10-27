import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, Store } from 'lucide-react';
import { useStore } from '../../../context/StoreContext';

const categoryLabels: Record<string, string> = {
  laptops: 'Laptops',
  'graphics-cards': 'Graphics',
  processors: 'Processors',
  'memory-ram': 'Memory',
  'storage-ssd': 'Storage',
  motherboards: 'Motherboards',
  monitors: 'Monitors',
  peripherals: 'Peripherals',
};

const linkClass = 'inline-flex min-h-9 shrink-0 items-center rounded-md px-2.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-white hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white sm:px-3';

export const HeaderNav: React.FC = () => {
  const { categories, wishlist } = useStore();

  return (
    <nav aria-label="Product categories" className="border-t border-slate-200/80 bg-slate-50/90 dark:border-slate-800 dark:bg-slate-900/90">
      <div className="store-nav-scroll mx-auto flex h-10 max-w-7xl items-center gap-1 overflow-x-auto px-4 sm:px-6 lg:px-8">
        <Link to="/shop" className={`${linkClass} text-slate-900 dark:text-slate-100`}>
          <Store className="mr-1.5 h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
          All Products
        </Link>
        {categories.map(category => (
          <Link
            key={category.id}
            to={`/category/${category.id}`}
            title={category.name}
            className={linkClass}
          >
            {categoryLabels[category.id] || category.name}
          </Link>
        ))}
        <Link to="/shop?deal=true" className={`${linkClass} text-amber-700 dark:text-amber-300`}>
          <Sparkles className="mr-1.5 h-3.5 w-3.5" />
          Hot Deals
        </Link>
        <Link to="/brands" className={linkClass}>Brands</Link>
        <Link to="/wishlist" aria-label={`Wishlist${wishlist.length ? `, ${wishlist.length} saved items` : ''}`} className={`${linkClass} gap-1.5`}>
          <Heart className="h-3.5 w-3.5 text-rose-500" />
          Wishlist
          {wishlist.length > 0 && <span className="rounded-full bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-700 dark:bg-rose-950/70 dark:text-rose-300">{wishlist.length}</span>}
        </Link>
      </div>
    </nav>
  );
};
