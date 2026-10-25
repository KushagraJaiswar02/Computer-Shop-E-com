import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../product/ProductCard';

export const FeaturedSection: React.FC = () => {
  const { products, homepageConfig } = useStore();
  const featuredIds = homepageConfig.featuredProductIds || [];

  // Match items by ID, or fallback to products marked isFeatured
  let featuredProducts = products.filter(p => featuredIds.includes(p.id));
  if (featuredProducts.length === 0) {
    featuredProducts = products.filter(p => p.isFeatured).slice(0, 8);
  }

  const sectionConfig = homepageConfig.sections.find(s => s.id === 'featured_products');
  const limit = sectionConfig?.itemLimit || 8;
  const displayProducts = featuredProducts.slice(0, limit);

  return (
    <section className="py-12 sm:py-16 bg-white dark:bg-surface-900 border-b border-slate-200 dark:border-surface-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curated Inventory</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Featured Hardware
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Enthusiast components, flagship gaming laptops, and high-TGP silicon in stock.
            </p>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 transition-colors"
          >
            <span>View All Components</span>
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
