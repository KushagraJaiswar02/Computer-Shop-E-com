import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useBrandDirectory } from '../../features/brands/useBrandDirectory';
import './BrandsSection.css';

export const BrandsSection: React.FC = () => {
  const brands = useBrandDirectory();
  return (
    <section className="border-b border-slate-200/80 bg-slate-50/50 py-6 dark:border-slate-800/80 dark:bg-slate-900/35" aria-labelledby="home-brands-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 id="home-brands-title" className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">Shop by Brand</h2>
          <Link to="/brands" className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-400">All Brands<ArrowRight aria-hidden="true" className="h-3.5 w-3.5" /></Link>
        </div>
        <div className="home-brand-rail">
          {brands.map(brand => (
            <Link key={brand.slug} to={`/shop?brand=${encodeURIComponent(brand.id)}`} aria-label={`Shop ${brand.name}`} className="home-brand-chip" style={{ color: brand.hoverColor }}>
              {brand.logo ? <span aria-hidden="true" className="home-brand-logo" dangerouslySetInnerHTML={{ __html: brand.logo }} /> : <span className="text-xs font-bold">{brand.name}</span>}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
