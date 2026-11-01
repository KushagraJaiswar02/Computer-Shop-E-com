import React from 'react';
import { Product } from '../../types';
import { ProductCard, ProductCardSkeleton } from '../../components/product/ProductCard';
import { ChevronDown } from 'lucide-react';
import { MotionList, productKey } from '../../components/motion/MotionList';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
  totalCount?: number;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading = false,
  onLoadMore,
  hasMore = false,
  totalCount = products.length,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 min-[1700px]:grid-cols-5 gap-2 sm:gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div>
      <MotionList items={products} itemKey={productKey} entranceId="catalog" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 min-[1700px]:grid-cols-5 gap-2 sm:gap-4">
        {product => <ProductCard product={product} />}
      </MotionList>

      {/* Load More Button */}
      {hasMore && onLoadMore && (
        <div className="mt-8 flex flex-col items-center justify-center gap-2">
          <p className="text-xs text-muted dark:text-muted">
            Showing {products.length} of {totalCount} products
          </p>
          <button
            type="button"
            onClick={onLoadMore}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg border border-border dark:border-border bg-surface dark:bg-surface-elevated text-xs font-semibold text-main dark:text-main hover:border-primary hover:text-accent dark:hover:border-primary dark:hover:text-accent shadow-xs transition-colors"
          >
            <span>Load More Products</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
