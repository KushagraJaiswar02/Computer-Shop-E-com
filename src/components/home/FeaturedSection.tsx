import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../product/ProductCard';

export const FeaturedSection: React.FC = () => {
  const { products, homepageConfig } = useStore();
  const featuredIds = homepageConfig.featuredProductIds || [];

  let featuredProducts = products.filter(p => featuredIds.includes(p.id));
  if (featuredProducts.length === 0) {
    featuredProducts = products.filter(p => p.isFeatured).slice(0, 8);
  }

  const sectionConfig = homepageConfig.sections.find(s => s.id === 'featured_products');
  const limit = sectionConfig?.itemLimit || 8;
  const displayProducts = featuredProducts.slice(0, limit);

  return (
    <section className="py-10 sm:py-12 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Featured Hardware
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Handpicked components and laptops currently in stock
            </p>
          </div>
          <Link
            to="/shop"
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>View All ({products.length})</span>
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
