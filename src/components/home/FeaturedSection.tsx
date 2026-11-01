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
    <section className="border-b border-border/80 bg-surface-soft/50 py-7 transition-colors dark:border-border/80 dark:bg-surface/35 sm:py-9">
      <div className="shop-container ">
        <div className="mb-4 flex items-center justify-between gap-4 sm:mb-5">
          <div>
            <h2 className="text-lg font-bold text-main dark:text-main sm:text-xl">
              Featured Hardware
            </h2>
            <p className="text-xs text-muted dark:text-muted mt-0.5">
              Products selected as featured in this demo catalog
            </p>
          </div>
          <Link
            to="/shop?featured=true"
            className="text-xs font-semibold text-accent dark:text-accent hover:underline flex items-center gap-1"
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
