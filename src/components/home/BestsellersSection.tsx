import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Trophy } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../product/ProductCard';

export const BestsellersSection: React.FC = () => {
  const { products, homepageConfig } = useStore();
  const bestsellerIds = homepageConfig.bestsellerProductIds || [];

  let bestsellerProducts = products.filter(p => bestsellerIds.includes(p.id) || p.isBestseller);
  const sectionConfig = homepageConfig.sections.find(s => s.id === 'bestsellers');
  const limit = sectionConfig?.itemLimit || 4;
  const displayProducts = bestsellerProducts.slice(0, limit);

  if (displayProducts.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 bg-white dark:bg-surface-900 border-b border-slate-200 dark:border-surface-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              <Trophy className="w-3.5 h-3.5" />
              <span>Sample Merchandising Collection</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Builder Bestsellers
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Top rated silicon and systems chosen by custom PC builders and studios.
            </p>
          </div>
          <Link
            to="/shop?bestseller=true"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 transition-colors"
          >
            <span>View All Bestsellers</span>
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
