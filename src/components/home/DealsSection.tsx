import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Flame, Percent } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../product/ProductCard';

export const DealsSection: React.FC = () => {
  const { products, homepageConfig } = useStore();
  const dealIds = homepageConfig.dealProductIds || [];

  let dealProducts = products.filter(p => dealIds.includes(p.id) || p.isDeal);
  const sectionConfig = homepageConfig.sections.find(s => s.id === 'deals');
  const limit = sectionConfig?.itemLimit || 4;
  const displayProducts = dealProducts.slice(0, limit);

  if (displayProducts.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 bg-slate-50 dark:bg-surface-850/60 border-b border-slate-200 dark:border-surface-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              <Flame className="w-3.5 h-3.5" />
              <span>Special Allocations</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Promotional Hardware Deals
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Instant manufacturer instant-rebates and promotional pricing on selected models.
            </p>
          </div>
          <Link
            to="/shop?deal=true"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 transition-colors"
          >
            <span>View All Deals</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
