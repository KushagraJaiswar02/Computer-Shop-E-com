import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Scale, Star, Check, ShieldAlert } from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { formatPrice } from '../../lib/utils';
import { KeycapButton } from '../common/KeycapButton';
import { KeyBadge } from '../common/KeyBadge';

interface ProductCardProps {
  product: Product;
  variant?: 'standard' | 'compact' | 'horizontal';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, variant = 'standard' }) => {
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

  const stockBadge = () => {
    switch (product.stockStatus) {
      case 'in_stock':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            In Stock ({product.stock})
          </span>
        );
      case 'low_stock':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Only {product.stock} left
          </span>
        );
      case 'backorder':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
            Backorder
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-surface-800 px-2 py-0.5 rounded border border-slate-200 dark:border-surface-700">
            Out of Stock
          </span>
        );
    }
  };

  return (
    <div
      onMouseEnter={() => setFocusedProductId(product.id)}
      onMouseLeave={() => setFocusedProductId(null)}
      onFocus={() => setFocusedProductId(product.id)}
      onBlur={() => setFocusedProductId(null)}
      tabIndex={0}
      className={`group relative bg-white dark:bg-surface-850 rounded-xl border transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-soft-card hover:shadow-elevated ${
        isFocused
          ? 'ring-2 ring-brand-500 border-brand-500 dark:border-brand-500'
          : 'border-slate-200 dark:border-surface-750 hover:border-slate-300 dark:hover:border-surface-650'
      }`}
    >
      {/* Top Media & Badges */}
      <div className="relative p-4 bg-slate-50/50 dark:bg-surface-900/40 flex items-center justify-center min-h-[200px] border-b border-slate-100 dark:border-surface-800">
        {/* Discount / Special badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {product.discountPercent && product.discountPercent > 0 && (
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-600 text-white shadow-xs">
              SAVE {product.discountPercent}%
            </span>
          )}
          {product.isDeal && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-white shadow-xs">
              HOT DEAL
            </span>
          )}
          {product.isNewArrival && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-600 text-white shadow-xs">
              NEW
            </span>
          )}
        </div>

        {/* Action icons (Wishlist & Compare) */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
          <button
            onClick={() => toggleWishlist(product.id)}
            className={`p-2 rounded-lg border transition-all shadow-xs ${
              isSaved
                ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/60 dark:border-rose-900 dark:text-rose-400'
                : 'bg-white/90 dark:bg-surface-800/90 border-slate-200 dark:border-surface-700 text-slate-500 hover:text-rose-600 hover:border-rose-200 dark:hover:text-rose-400'
            }`}
            title={isSaved ? 'Remove from wishlist' : 'Save to wishlist (Press L when focused)'}
            aria-label="Wishlist toggle"
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>

          <button
            onClick={() => toggleCompare(product.id)}
            className={`p-2 rounded-lg border transition-all shadow-xs ${
              isCompared
                ? 'bg-brand-50 border-brand-200 text-brand-600 dark:bg-brand-950/60 dark:border-brand-900 dark:text-brand-400'
                : 'bg-white/90 dark:bg-surface-800/90 border-slate-200 dark:border-surface-700 text-slate-500 hover:text-brand-600 dark:hover:text-brand-400'
            }`}
            title={isCompared ? 'In comparison' : 'Add to compare'}
            aria-label="Compare toggle"
          >
            <Scale className="w-4 h-4" />
          </button>
        </div>

        {/* Product Image */}
        <Link
          to={`/product/${product.slug}`}
          className="w-full h-44 flex items-center justify-center p-2 overflow-hidden"
        >
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Focused Shortcut Tooltip */}
        {isFocused && (
          <div className="absolute bottom-2 left-2 z-10 flex items-center gap-1 text-[9px] font-mono text-slate-500 dark:text-slate-400 bg-white/90 dark:bg-surface-900/90 px-1.5 py-0.5 rounded border border-slate-200 dark:border-surface-700 shadow-xs">
            <span>Press</span>
            <KeyBadge className="text-[9px] px-1 py-0">L</KeyBadge>
            <span>to save</span>
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Series line */}
          <div className="flex items-center justify-between text-[11px] mb-1.5">
            <span className="font-mono font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
              {product.brandName} {product.seriesName ? `• ${product.seriesName}` : ''}
            </span>
            <span className="font-mono text-slate-400 text-[10px]">
              SKU: {product.sku}
            </span>
          </div>

          {/* Title */}
          <Link
            to={`/product/${product.slug}`}
            className="block text-sm sm:text-base font-bold text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors line-clamp-2 leading-snug mb-2"
          >
            {product.name}
          </Link>

          {/* Key specs chips */}
          <div className="flex flex-wrap gap-1 mb-3">
            {product.attributes.slice(0, 3).map((attr, idx) => (
              <span
                key={idx}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-surface-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-surface-700 truncate max-w-[190px]"
                title={`${attr.name}: ${attr.value}`}
              >
                {attr.value}
              </span>
            ))}
          </div>

          {/* Ratings only when data actually has them */}
          {product.rating && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-3">
              <div className="flex items-center text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
              </div>
              <span className="font-mono font-semibold text-slate-700 dark:text-slate-200">
                {product.rating.toFixed(1)}
              </span>
              <span>({product.reviewCount || 0} reviews)</span>
            </div>
          )}
        </div>

        {/* Pricing & Footer Actions */}
        <div className="pt-3 border-t border-slate-100 dark:border-surface-800">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-lg sm:text-xl font-bold font-mono text-slate-900 dark:text-white">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xs font-mono text-slate-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
            </div>
            <div>{stockBadge()}</div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              to={`/product/${product.slug}`}
              className="inline-flex items-center justify-center text-xs font-semibold px-3 py-2 rounded-lg bg-slate-100 dark:bg-surface-800 hover:bg-slate-200 dark:hover:bg-surface-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-surface-700 transition-colors"
            >
              Specs
            </Link>
            <KeycapButton
              variant="primary"
              size="sm"
              disabled={product.stockStatus === 'out_of_stock'}
              onClick={() => addToCart(product, 1)}
              className="w-full font-semibold"
            >
              <ShoppingBag className="w-3.5 h-3.5 mr-1" />
              Add
            </KeycapButton>
          </div>
        </div>
      </div>
    </div>
  );
};
