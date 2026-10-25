import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
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
    <section className="py-10 sm:py-12 bg-slate-50/65 dark:bg-slate-900/45 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Popular Hardware
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Top selected components and systems
            </p>
          </div>
          <Link
            to="/shop?bestseller=true"
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>View All</span>
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
