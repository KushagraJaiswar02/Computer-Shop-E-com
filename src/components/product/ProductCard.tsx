import React from 'react';
import { Link } from 'react-router-dom';
import { GitCompareArrows, Heart, ShoppingBag } from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { formatPrice } from '../../lib/utils';
import { KeycapButton } from '../common/KeycapButton';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    addToCart,
    wishlist,
    toggleWishlist,
    compareList,
    toggleCompare,
    focusedProductId,
    setFocusedProductId,
  } = useStore();

  const isSaved = wishlist.includes(product.id);
  const isCompared = compareList.includes(product.id);
  const isFocused = focusedProductId === product.id;

  return (
    <div
      onMouseEnter={() => setFocusedProductId(product.id)}
      onMouseLeave={() => setFocusedProductId(null)}
      onFocus={() => setFocusedProductId(product.id)}
      onBlur={() => setFocusedProductId(null)}
      className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-xl border bg-white shadow-xs transition-all duration-200 hover:shadow-md dark:bg-surface-850 ${
        isFocused
          ? 'border-blue-500 ring-1 ring-blue-500/20'
          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      {/* Top Image Container */}
      <div className="relative flex h-44 items-center justify-center border-b border-slate-100 bg-slate-50/60 p-3 dark:border-slate-800/80 dark:bg-slate-900/40 sm:h-48">
        {/* Subtle Discount Badge */}
        {product.discountPercent && product.discountPercent > 0 && product.originalPrice && product.originalPrice > product.price ? (
          <span className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-600 text-white shadow-xs">
            -{product.discountPercent}%
          </span>
        ) : null}

        <div className="absolute right-2.5 top-2.5 z-10 flex items-center gap-1 rounded-full border border-slate-200/90 bg-white/90 p-1 shadow-xs backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/90">
          <button
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className={`rounded-full p-1.5 transition-colors ${
            isSaved
              ? 'text-rose-600 dark:text-rose-400'
              : 'text-slate-400 hover:text-rose-500'
          }`}
            title={isSaved ? 'Remove from wishlist (L)' : 'Save to wishlist (L)'}
            aria-label={isSaved ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          >
            <Heart className={`h-3.5 w-3.5 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>

          <button
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              toggleCompare(product.id);
            }}
            aria-pressed={isCompared}
            className={`rounded-full p-1.5 transition-colors ${
            isCompared
              ? 'text-violet-700 dark:text-violet-300'
              : 'text-slate-400 hover:text-violet-600 dark:hover:text-violet-300'
          }`}
            title={isCompared ? 'Remove from comparison' : 'Add to comparison'}
            aria-label={isCompared ? `Remove ${product.name} from comparison` : `Add ${product.name} to comparison`}
          >
            <GitCompareArrows className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Product Image */}
        <Link
          to={`/product/${product.slug}`}
          className="w-full h-full flex items-center justify-center p-2 overflow-hidden"
        >
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
      </div>

      {/* Product Content Details */}
      <div className="flex flex-1 flex-col justify-between p-3.5 sm:p-4">
        <div>
          {/* Brand & Category */}
          <div className="mb-1.5 flex items-center justify-between gap-2 text-[10px] font-medium text-slate-500 dark:text-slate-400">
            <span className="truncate font-mono uppercase tracking-wider">
              {product.brandName}
            </span>
            <span className="truncate text-right text-[10px] text-slate-400">
              {product.categoryName}
            </span>
          </div>

          {/* Title */}
          <Link
            to={`/product/${product.slug}`}
          className="mb-2 line-clamp-2 block text-[13px] font-semibold leading-snug text-slate-900 transition-colors hover:text-blue-600 dark:text-slate-100 dark:hover:text-blue-400 sm:text-sm"
          >
            {product.name}
          </Link>
        </div>

        {/* Pricing, Stock & Action */}
        <div className="border-t border-slate-100 pt-2.5 dark:border-slate-800">
          <div className="mb-2.5 flex items-baseline justify-between gap-2">
            <div>
              <div className="flex items-baseline gap-2">
                  <span className="font-mono text-base font-bold text-slate-900 dark:text-white sm:text-lg">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice !== undefined && product.originalPrice > product.price && (
                  <span className="text-xs font-mono text-slate-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
            </div>

            {/* Subtle Stock indicator */}
            <div>
              {product.stockStatus === 'in_stock' ? (
                <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  In Stock
                </span>
              ) : product.stockStatus === 'low_stock' ? (
                <span className="text-[10px] font-medium text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  Only {product.stock} left
                </span>
              ) : (
                <span className="text-[10px] text-slate-400">
                  Out of Stock
                </span>
              )}
            </div>
          </div>

          {/* Action button */}
          <KeycapButton
            variant="primary"
            size="sm"
            disabled={product.stockStatus === 'out_of_stock'}
            onClick={() => addToCart(product, 1)}
            className="w-full text-xs font-semibold py-2"
          >
            <ShoppingBag className="w-3.5 h-3.5 mr-1.5" />
            Add to Cart
          </KeycapButton>
        </div>
      </div>
    </div>
  );
};
