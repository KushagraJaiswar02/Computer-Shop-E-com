import { brandConfig } from '../../config/brand';
import React from 'react';
import { Link } from 'react-router-dom';
import { useCategoryDirectory } from '../../features/catalog/useCategoryDirectory';

export const Footer: React.FC<{ homeBackground?: boolean }> = ({ homeBackground = false }) => {
  const categories = useCategoryDirectory();
  return (
  <footer className={`relative z-10 border-t border-border bg-surface text-xs text-muted`}>
    <div className="shop-container py-9 ">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3 sm:col-span-2">
          <Link to="/" className="inline-flex items-center gap-2">
            <img src={brandConfig.logoPath} alt={brandConfig.logoAlt} width={32} height={32} className="shop-mark" />
            <span className="text-base font-extrabold tracking-tight text-main">{brandConfig.shopName}</span>
          </Link>
          <p className="text-main font-medium">{brandConfig.tagline}</p>
          <p className="max-w-sm leading-relaxed text-muted">Computer hardware storefront demonstration. Product, price and availability data are examples for review.</p>
          <p className="text-muted">Retailer contact details and fulfillment policies have not been configured.</p>
        </div>

        <nav aria-label="Hardware categories">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-main">Hardware</h2>
          <ul className="space-y-2 text-muted">
            {categories.filter(category => category.count > 0).map(category => <li key={category.slug}><Link to={category.href} className="hover:text-main">{category.name}</Link></li>)}
            <li><Link to="/shop" className="hover:text-main">All products</Link></li>
          </ul>
        </nav>

        <nav aria-label="Customer links">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-main">Customer links</h2>
          <ul className="space-y-2 text-muted">
            <li><Link to="/enquiry" className="hover:text-main">Product enquiry (demo)</Link></li>
            <li><Link to="/account/orders" className="hover:text-main">Order history (demo)</Link></li>
            <li><Link to="/wishlist" className="hover:text-main">Wishlist</Link></li>
            <li><Link to="/compare" className="hover:text-main">Compare products</Link></li>
            <li><Link to="/contact" className="hover:text-main">Contact page</Link></li>
            <li><Link to="/policies" className="hover:text-main">Store information</Link></li>
          </ul>
        </nav>
      </div>

      <div className="mt-8 flex flex-col items-start justify-between gap-2 border-t border-border pt-5 text-[11px] text-muted sm:flex-row sm:items-center">
        <p><strong className="text-muted">Demonstration only.</strong> No live orders, payments or deliveries are processed.</p>
        <p>Retailer business details and policies must be supplied before launch.</p>
      </div>
    </div>
  </footer>
);
};
