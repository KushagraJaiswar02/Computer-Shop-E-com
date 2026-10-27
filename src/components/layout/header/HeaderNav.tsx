import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, PackagePlus, Sparkles, Store } from 'lucide-react';
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

const menuLinkClass = 'inline-flex min-h-9 min-w-0 items-center rounded-md px-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white';

export const HeaderNav: React.FC = () => {
  const { categories } = useStore();
  const closeMenu = (event: React.MouseEvent<HTMLAnchorElement>) => event.currentTarget.closest('details')?.removeAttribute('open');

  return (
    <details className="group relative z-20 shrink-0">
      <summary className="inline-flex h-9 cursor-pointer list-none items-center gap-1.5 rounded-md bg-blue-600 px-3 text-xs font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden dark:focus-visible:ring-offset-slate-900">
        <Store className="h-4 w-4" aria-hidden="true" />
        <span>Categories</span>
        <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" aria-hidden="true" />
      </summary>
      <div className="absolute left-0 top-full mt-2 grid w-[min(22rem,calc(100vw-1.5rem))] grid-cols-2 gap-1 rounded-lg border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-700 dark:bg-slate-900">
        <Link to="/shop" onClick={closeMenu} className={menuLinkClass}><Store className="mr-1.5 h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />All products</Link>
        {categories.map(category => (
          <Link key={category.id} to={`/category/${category.id}`} title={category.name} onClick={closeMenu} className={menuLinkClass}>
            <span className="truncate">{categoryLabels[category.id] || category.name}</span>
          </Link>
        ))}
        <Link to="/shop?deal=true" onClick={closeMenu} className={menuLinkClass}><Sparkles className="mr-1.5 h-3.5 w-3.5 text-amber-600" />Hot deals</Link>
        <Link to="/brands" onClick={closeMenu} className={menuLinkClass}>Brands</Link>
        <Link to="/enquiry?request=product" onClick={closeMenu} className="col-span-2 inline-flex min-h-9 items-center gap-1.5 rounded-md px-2 text-xs font-semibold text-blue-700 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-300 dark:hover:bg-slate-800 lg:hidden"><PackagePlus className="h-3.5 w-3.5" />Request a Product</Link>
      </div>
    </details>
  );
};
