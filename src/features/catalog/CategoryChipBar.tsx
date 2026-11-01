import React from 'react';
import { Category, Product } from '../../types';

interface CategoryChipBarProps {
  categories: Category[];
  products: Product[];
  activeCategory: string;
  onSelectCategory: (categoryId: string | null) => void;
}

export const CategoryChipBar: React.FC<CategoryChipBarProps> = ({
  categories,
  products,
  activeCategory,
  onSelectCategory,
}) => {
  const totalCount = products.length;

  return (
    <div className="mb-4">
      <div
        className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0"
        role="tablist"
        aria-label="Filter by category"
      >
        {/* "All" Chip */}
        <button
          type="button"
          role="tab"
          aria-selected={!activeCategory}
          onClick={() => onSelectCategory(null)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
            !activeCategory
              ? 'bg-primary text-on-primary shadow-xs dark:bg-primary'
              : 'bg-surface dark:bg-surface text-main dark:text-main border border-border dark:border-border hover:border-border dark:hover:border-border hover:bg-surface-soft dark:hover:bg-surface-elevated'
          }`}
        >
          <span>All</span>
          <span
            className={`text-[10px] font-sans px-1.5 py-0.5 rounded-full ${
              !activeCategory
                ? 'bg-surface/20 text-on-primary'
                : 'bg-surface-soft dark:bg-surface-soft text-muted dark:text-muted'
            }`}
          >
            {totalCount}
          </span>
        </button>

        {/* Individual Category Chips */}
        {categories.map((category) => {
          const isActive = activeCategory === category.id;
          const count = products.filter((p) => p.categoryId === category.id).length;

          return (
            <button
              key={category.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onSelectCategory(isActive ? null : category.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
                isActive
                  ? 'bg-primary text-on-primary shadow-xs dark:bg-primary'
                  : 'bg-surface dark:bg-surface text-main dark:text-main border border-border dark:border-border hover:border-border dark:hover:border-border hover:bg-surface-soft dark:hover:bg-surface-elevated'
              }`}
            >
              <span>{category.name}</span>
              <span
                className={`text-[10px] font-sans px-1.5 py-0.5 rounded-full ${
                  isActive
                    ? 'bg-surface/20 text-on-primary'
                    : 'bg-surface-soft dark:bg-surface-soft text-muted dark:text-muted'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
