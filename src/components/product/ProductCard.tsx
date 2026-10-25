import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Check } from 'lucide-react';
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
    focusedProductId,
    setFocusedProductId,
  } = useStore();

  const isSaved = wishlist.includes(product.id);
  const isFocused = focusedProductId === product.id;

  return (
    <div
      onMouseEnter={() => setFocusedProductId(product.id)}
      onMouseLeave={() => setFocusedProductId(null)}
      onFocus={() => setFocusedProductId(product.id)}
      onBlur={() => setFocusedProductId(null)}
      className={`group relative bg-white dark:bg-slate-850 rounded-xl border transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md ${
        isFocused
          ? 'border-blue-500 ring-1 ring-blue-500/20'
          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      {/* Top Image Container */}
      <div className="relative p-4 bg-slate-50/60 dark:bg-slate-900/40 flex items-center justify-center h-48 border-b border-slate-100 dark:border-slate-800/80">
        {/* Subtle Discount Badge */}
        {product.discountPercent && product.discountPercent > 0 ? (
          <span className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-600 text-white shadow-xs">
            -{product.discountPercent}%
          </span>
        ) : null}

        {/* Wishlist Button */}
        <button
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2.5 right-2.5 z-10 p-2 rounded-full border transition-all shadow-xs ${
            isSaved
              ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/60 dark:border-rose-900 dark:text-rose-400'
              : 'bg-white/90 dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-500 hover:border-rose-200'
          }`}
          title={isSaved ? 'Remove from wishlist (L)' : 'Save to wishlist (L)'}
          aria-label={isSaved ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
        >
          <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

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
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium mb-1.5">
            <span className="uppercase tracking-wider font-mono">
              {product.brandName}
            </span>
            <span className="text-[10px] text-slate-400">
              {product.categoryName}
            </span>
          </div>

          {/* Title */}
          <Link
            to={`/product/${product.slug}`}
            className="block text-sm font-semibold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2 leading-snug mb-2"
          >
            {product.name}
          </Link>
        </div>

        {/* Pricing, Stock & Action */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-base sm:text-lg font-bold font-mono text-slate-900 dark:text-white">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
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
