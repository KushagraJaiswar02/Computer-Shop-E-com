import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
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
    <section className="py-10 sm:py-12 bg-white/65 dark:bg-slate-900/45 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-md bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-400">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Promotional Deals
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Special discounts on selected computing hardware
              </p>
            </div>
          </div>
          <Link
            to="/shop?deal=true"
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>All Deals</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
