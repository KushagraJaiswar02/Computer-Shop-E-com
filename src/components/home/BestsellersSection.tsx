import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../product/ProductCard';

export const BestsellersSection: React.FC = () => {
  const { products, homepageConfig } = useStore();
  const bestsellerIds = homepageConfig.bestsellerProductIds || [];
  const featuredAndDealIds = new Set([
    ...(homepageConfig.featuredProductIds || []),
    ...(homepageConfig.dealProductIds || []),
    ...products.filter(product => product.isFeatured || product.isDeal).map(product => product.id),
  ]);

  const bestsellerProducts = products.filter(product =>
    (bestsellerIds.includes(product.id) || product.isBestseller) && !featuredAndDealIds.has(product.id)
  );
  const sectionConfig = homepageConfig.sections.find(s => s.id === 'bestsellers');
  const limit = sectionConfig?.itemLimit || 4;
  const displayProducts = bestsellerProducts.slice(0, limit);

  if (displayProducts.length === 0) return null;

  return (
    <section className="border-b border-border/80 bg-surface-soft/50 py-7 transition-colors dark:border-border/80 dark:bg-surface/35 sm:py-9">
      <div className="shop-container ">
        <div className="mb-4 flex items-center justify-between gap-4 sm:mb-5">
          <div>
            <h2 className="text-lg font-bold text-main dark:text-main sm:text-xl">
              Popular Hardware · Demo Picks
            </h2>
            <p className="text-xs text-muted dark:text-muted mt-0.5">
              Selected examples from this demo catalog; not based on live sales.
            </p>
          </div>
          <Link
            to="/shop?bestseller=true"
            className="text-xs font-semibold text-accent dark:text-accent hover:underline flex items-center gap-1"
          >
            <span>Browse Demo Picks</span>
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
