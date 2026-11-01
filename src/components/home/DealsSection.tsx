import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Tag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../product/ProductCard';
import { formatPrice } from '../../lib/utils';

export const DealsSection: React.FC = () => {
  const { products, homepageConfig } = useStore();
  const dealIds = homepageConfig.dealProductIds || [];

  const dealProducts = products.filter(product =>
    (dealIds.includes(product.id) || product.isDeal) &&
    product.originalPrice !== undefined && product.originalPrice > product.price &&
    product.discountPercent !== undefined && product.discountPercent > 0
  );
  const sectionConfig = homepageConfig.sections.find(s => s.id === 'deals');
  const limit = sectionConfig?.itemLimit || 4;
  const displayProducts = dealProducts.slice(0, limit);
  const featuredDeal = displayProducts[0];
  const remainingDeals = displayProducts.slice(1);

  if (displayProducts.length === 0) return null;

  return (
    <section className="border-b border-border/80 bg-surface/55 py-7 transition-colors dark:border-border/80 dark:bg-surface/35 sm:py-9">
      <div className="shop-container ">
        <div className="mb-4 flex items-center justify-between gap-4 sm:mb-5">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-md bg-warning/10 text-warning-ink dark:bg-warning/10 dark:text-warning-ink">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-main dark:text-main sm:text-xl">
                Hot Deals
              </h2>
              <p className="text-xs text-muted dark:text-muted mt-0.5">
                Special discounts on selected computing hardware
              </p>
            </div>
          </div>
          <Link
            to="/shop?deal=true"
            className="text-xs font-semibold text-accent dark:text-accent hover:underline flex items-center gap-1"
          >
            <span>View All Deals</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          <Link
            to={`/product/${featuredDeal.slug}`}
            className="group relative flex min-h-64 overflow-hidden rounded-xl border border-primary bg-gradient-to-br from-accent/10 via-surface to-surface-soft transition hover:border-primary hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus dark:border-border dark:from-surface dark:via-surface dark:to-primary/30 lg:col-span-2"
          >
            <div className="relative z-10 flex w-[58%] flex-col items-start justify-center p-5 sm:p-6">
              <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-accent dark:bg-accent/10 dark:text-accent">
                <Tag className="h-3 w-3" /> Selected offer · {featuredDeal.discountPercent}% off
              </span>
              <span className="text-xs font-semibold uppercase tracking-wide text-muted dark:text-muted">{featuredDeal.brandName}</span>
              <h3 className="mt-1 line-clamp-2 text-lg font-bold leading-tight text-main transition-colors group-hover:text-accent dark:text-main dark:group-hover:text-accent sm:text-xl">{featuredDeal.name}</h3>
              <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted dark:text-main">{featuredDeal.shortDescription}</p>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-sans text-lg font-bold text-main dark:text-main price">{formatPrice(featuredDeal.price)}</span>
                {featuredDeal.originalPrice !== undefined && <span className="text-xs text-muted line-through price">{formatPrice(featuredDeal.originalPrice)}</span>}
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-accent dark:text-accent">View product <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" /></span>
            </div>
            <div className="absolute inset-y-0 right-0 w-[46%] overflow-hidden bg-surface/45 dark:bg-surface-elevated/35">
              <img src={featuredDeal.images[0]} alt="" loading="lazy" className="h-full w-full object-contain p-3 transition-transform duration-300 group-hover:scale-105 sm:p-5" />
            </div>
          </Link>
          {remainingDeals.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
