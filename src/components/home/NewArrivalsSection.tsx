import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../product/ProductCard';

export const NewArrivalsSection: React.FC = () => {
  const { products } = useStore();

  const datedProducts = (items: typeof products) => [...items]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const markedNewProducts = datedProducts(products.filter(product => product.isNewArrival));
  const newProducts = (markedNewProducts.length ? markedNewProducts : datedProducts(products)).slice(0, 4);

  return (
    <section className="border-b border-border/80 bg-surface/55 py-7 transition-colors dark:border-border/80 dark:bg-surface/35 sm:py-9">
      <div className="shop-container ">
        <div className="mb-4 flex items-center justify-between gap-4 sm:mb-5">
          <div>
            <h2 className="text-lg font-bold text-main dark:text-main sm:text-xl">
              New Arrivals
            </h2>
            <p className="text-xs text-muted dark:text-muted mt-0.5">
              Recently added computer hardware and latest releases
            </p>
          </div>
          <Link
            to="/shop?sort=newest"
            className="text-xs font-semibold text-accent dark:text-accent hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {newProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
