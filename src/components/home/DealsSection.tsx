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
    <section className="border-b border-slate-200/80 bg-white/55 py-7 transition-colors dark:border-slate-800/80 dark:bg-slate-900/35 sm:py-9">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between gap-4 sm:mb-5">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-md bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-400">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
                Hot Deals
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
            <span>View All Deals</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          <Link
            to={`/product/${featuredDeal.slug}`}
            className="group relative flex min-h-64 overflow-hidden rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-slate-50 transition hover:border-blue-300 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-slate-700 dark:from-surface-850 dark:via-slate-900 dark:to-blue-950/30 lg:col-span-2"
          >
            <div className="relative z-10 flex w-[58%] flex-col items-start justify-center p-5 sm:p-6">
              <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                <Tag className="h-3 w-3" /> Selected offer · {featuredDeal.discountPercent}% off
              </span>
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{featuredDeal.brandName}</span>
              <h3 className="mt-1 line-clamp-2 text-lg font-bold leading-tight text-slate-900 transition-colors group-hover:text-blue-700 dark:text-white dark:group-hover:text-blue-300 sm:text-xl">{featuredDeal.name}</h3>
              <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">{featuredDeal.shortDescription}</p>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-mono text-lg font-bold text-slate-950 dark:text-white">{formatPrice(featuredDeal.price)}</span>
                {featuredDeal.originalPrice !== undefined && <span className="text-xs text-slate-400 line-through">{formatPrice(featuredDeal.originalPrice)}</span>}
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-blue-700 dark:text-blue-300">View product <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" /></span>
            </div>
            <div className="absolute inset-y-0 right-0 w-[46%] overflow-hidden bg-white/45 dark:bg-slate-800/35">
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
