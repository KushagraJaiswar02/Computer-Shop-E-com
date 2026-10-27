import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../product/ProductCard';

export const FeaturedSection: React.FC = () => {
  const { products, homepageConfig } = useStore();
  const featuredIds = homepageConfig.featuredProductIds || [];
  const dealIds = new Set([
    ...(homepageConfig.dealProductIds || []),
    ...products.filter(product => product.isDeal).map(product => product.id),
  ]);

  const featuredProducts = products.filter(product =>
    (featuredIds.includes(product.id) || product.isFeatured) && !dealIds.has(product.id)
  );

  const sectionConfig = homepageConfig.sections.find(s => s.id === 'featured_products');
  const limit = sectionConfig?.itemLimit || 8;
  const displayProducts = featuredProducts.slice(0, limit);

  return (
    <section className="border-b border-slate-200/80 bg-slate-50/50 py-7 transition-colors dark:border-slate-800/80 dark:bg-slate-900/35 sm:py-9">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between gap-4 sm:mb-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
              Featured Hardware
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Products selected as featured in this demo catalog
            </p>
          </div>
          <Link
            to="/shop?featured=true"
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>View All Featured</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {displayProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
