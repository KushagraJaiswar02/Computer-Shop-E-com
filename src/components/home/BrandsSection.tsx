import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useBrandDirectory } from '../../features/brands/useBrandDirectory';
import './BrandsSection.css';

export const BrandsSection: React.FC = () => {
  const tiles = useBrandDirectory();
  const gridRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.1 });
    if (gridRef.current) observer.observe(gridRef.current);
    return () => observer.disconnect();
  }, [tiles.length]);

  return (
    <section className="border-b border-slate-200/80 bg-slate-50/50 py-7 transition-colors dark:border-slate-800/80 dark:bg-slate-900/35 sm:py-9">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between gap-4 sm:mb-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
              Shop by Brand
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Original hardware from leading manufacturers
            </p>
          </div>
          <Link
            to="/brands"
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>All Brands</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div ref={gridRef} className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-8">
          {tiles.map((brand, index) => (
            <div key={brand.slug} className="brand-tile-entry" data-visible={visible} style={{ '--brand-delay': `${index * 50}ms` } as React.CSSProperties}>
              <Link
                to={`/shop?brand=${encodeURIComponent(brand.id)}`}
                aria-label={`Shop ${brand.name}`}
                className="brand-tile flex h-full min-h-36 flex-col items-center justify-center rounded-lg border border-slate-200 bg-white/90 px-3 py-5 text-center shadow-soft-card hover:border-slate-400 hover:shadow-md focus-visible:border-blue-500 focus-visible:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-slate-800 dark:bg-surface-850/90 dark:hover:border-slate-500 dark:focus-visible:ring-offset-surface-900"
                style={{ '--brand-color': brand.hoverColor, '--brand-color-dark': brand.darkHoverColor } as React.CSSProperties}
              >
                <span aria-hidden="true" className="brand-tile-logo flex h-10 w-full max-w-24 items-center justify-center" dangerouslySetInnerHTML={{ __html: brand.logo }} />
                <span className="mt-4 text-xs font-semibold text-slate-800 dark:text-slate-200">{brand.name}</span>
                <span className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">{brand.count} {brand.count === 1 ? 'product' : 'products'}</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
