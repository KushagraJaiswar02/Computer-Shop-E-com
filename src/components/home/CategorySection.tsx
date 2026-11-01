import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useCategoryDirectory } from '../../features/catalog/useCategoryDirectory';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import type { CategoryDirectoryEntry } from '../../data/categories';
import './CategorySection.css';

const CategoryVisual: React.FC<{ category: CategoryDirectoryEntry }> = ({ category }) => {
  const [failed, setFailed] = useState(false);
  const Icon = category.icon;
  return category.imageSrc && !failed ? <img src={category.imageSrc} alt="" loading="lazy" decoding="async" width={160} height={80} className="category-tile-image" onError={() => setFailed(true)} /> : <Icon aria-hidden="true" className="category-tile-icon" strokeWidth={1.4} />;
};

export const CategorySection: React.FC = () => {
  const categories = useCategoryDirectory().filter(category => category.count > 0);
  const { ref, visible } = useScrollReveal();
  return (
    <section className="border-b border-border/80 bg-surface/55 py-7 dark:border-border/80 dark:bg-surface/35 sm:py-9" aria-labelledby="home-categories-title">
      <div className="shop-container ">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 id="home-categories-title" className="text-lg font-bold text-main dark:text-main sm:text-xl">Shop by Category</h2>
          <Link to="/shop" className="flex items-center gap-1 text-xs font-semibold text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus dark:text-accent">All Categories<ArrowRight aria-hidden="true" className="h-3.5 w-3.5" /></Link>
        </div>
        <div ref={ref} className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4" data-visible={visible}>
          {categories.map((category, index) => (
            <div key={category.slug} className={`category-tile-entry ${category.featured ? 'lg:col-span-2' : ''}`} style={{ '--category-delay': `${index * 50}ms`, '--category-accent': category.accentColor } as React.CSSProperties}>
              <Link to={category.href} aria-label={`Shop ${category.name}`} className="category-tile">
                <span aria-hidden="true" className="category-tile-visual"><CategoryVisual category={category} /></span>
                <h3 className="text-sm font-bold sm:text-base">{category.name}</h3>
                <p className="mt-1 text-xs text-inverse-ink">{category.count} {category.count === 1 ? 'product' : 'products'}</p>
                <ArrowRight aria-hidden="true" className="category-tile-arrow" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
