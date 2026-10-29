import React from 'react';
import { Link } from 'react-router-dom';
import { useCategoryDirectory } from '../../features/catalog/useCategoryDirectory';

export const Footer: React.FC<{ homeBackground?: boolean }> = ({ homeBackground = false }) => {
  const categories = useCategoryDirectory();
  return (
  <footer className={`relative z-10 border-t border-slate-800 ${homeBackground ? 'bg-slate-900/90' : 'bg-slate-900'} text-xs text-slate-300`}>
    <div className="mx-auto max-w-7xl px-4 py-9 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3 sm:col-span-2">
          <Link to="/" className="inline-flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">CS</span>
            <span className="text-base font-extrabold tracking-tight text-white">Computer<span className="text-blue-400">Shop</span></span>
          </Link>
          <p className="max-w-sm leading-relaxed text-slate-400">Computer hardware storefront demonstration. Product, price and availability data are examples for review.</p>
          <p className="text-slate-400">Retailer contact details and fulfillment policies have not been configured.</p>
        </div>

        <nav aria-label="Hardware categories">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-white">Hardware</h2>
          <ul className="space-y-2 text-slate-400">
            {categories.filter(category => category.count > 0).map(category => <li key={category.slug}><Link to={category.href} className="hover:text-white">{category.name}</Link></li>)}
            <li><Link to="/shop" className="hover:text-white">All products</Link></li>
          </ul>
        </nav>

        <nav aria-label="Customer links">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-white">Customer links</h2>
          <ul className="space-y-2 text-slate-400">
            <li><Link to="/enquiry" className="hover:text-white">Product enquiry (demo)</Link></li>
            <li><Link to="/account/orders" className="hover:text-white">Order history (demo)</Link></li>
            <li><Link to="/wishlist" className="hover:text-white">Wishlist</Link></li>
            <li><Link to="/compare" className="hover:text-white">Compare products</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact page</Link></li>
            <li><Link to="/policies" className="hover:text-white">Store information</Link></li>
          </ul>
        </nav>
      </div>

      <div className="mt-8 flex flex-col items-start justify-between gap-2 border-t border-slate-800 pt-5 text-[11px] text-slate-400 sm:flex-row sm:items-center">
        <p><strong className="text-slate-300">Demonstration only.</strong> No live orders, payments or deliveries are processed.</p>
        <p>Retailer business details and policies must be supplied before launch.</p>
      </div>
    </div>
  </footer>
);
};
