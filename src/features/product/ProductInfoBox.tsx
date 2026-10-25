import React from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  Scale,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Minus,
  Plus,
  HelpCircle,
  Star,
} from 'lucide-react';
import { Product } from '../../types';
import { formatPrice } from '../../lib/utils';
import { KeycapButton } from '../../components/common/KeycapButton';

interface ProductInfoBoxProps {
  product: Product;
  quantity: number;
  onQuantityChange: (qty: number) => void;
  onAddToCart: () => void;
  isSaved: boolean;
  onToggleWishlist: () => void;
  isCompared: boolean;
  onToggleCompare: () => void;
  onOpenEnquiry: () => void;
}

export const ProductInfoBox: React.FC<ProductInfoBoxProps> = ({
  product,
  quantity,
  onQuantityChange,
  onAddToCart,
  isSaved,
  onToggleWishlist,
  isCompared,
  onToggleCompare,
  onOpenEnquiry,
}) => {
  const isOutOfStock = product.stockStatus === 'out_of_stock';

  return (
    <div className="space-y-4">
      {/* Brand & SKU bar */}
      <div className="flex items-center justify-between text-xs font-mono">
        <Link
          to={`/brand/${product.brandId}`}
          className="font-bold text-blue-600 dark:text-blue-400 hover:underline uppercase tracking-wide"
        >
          {product.brandName} {product.seriesName ? `• ${product.seriesName}` : ''}
        </Link>
        <span className="text-slate-400">
          SKU: <span className="text-slate-700 dark:text-slate-300 font-bold">{product.sku}</span>
        </span>
      </div>

      {/* Product Name */}
      <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-snug">
        {product.name}
      </h1>

      {/* Rating & Review Count */}
      {product.rating ? (
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center text-amber-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < Math.floor(product.rating || 5)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-slate-200 dark:text-slate-700'
                }`}
              />
            ))}
          </div>
          <span className="font-mono font-bold text-slate-900 dark:text-white">
            {product.rating.toFixed(1)}
          </span>
          <span className="text-slate-400">({product.reviewCount || 0} reviews)</span>
        </div>
      ) : null}

      {/* Short Summary Description */}
      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800">
        {product.shortDescription}
      </p>

      {/* Pricing and Stock Panel */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-baseline gap-3 mb-2">
          <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-white">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-sm sm:text-base font-mono text-slate-400 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
          {product.discountPercent && product.discountPercent > 0 && (
            <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
              Save {product.discountPercent}%
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 font-medium">
            {product.stockStatus === 'in_stock' ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                  In Stock ({product.stock} units available)
                </span>
              </>
            ) : product.stockStatus === 'low_stock' ? (
              <>
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span className="text-amber-700 dark:text-amber-400 font-semibold">
                  Low Stock — Only {product.stock} left
                </span>
              </>
            ) : (
              <span className="text-slate-500 font-medium">Currently out of stock</span>
            )}
          </div>

          <span className="text-slate-500 font-mono text-[11px]">
            {product.warrantyMonths} Months Warranty
          </span>
        </div>
      </div>

      {/* Quantity & Add to Cart Controls */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center gap-3">
          {/* Stepper */}
          <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-850">
            <button
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              disabled={isOutOfStock}
              className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white disabled:opacity-40"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-3 text-sm font-mono font-bold text-slate-800 dark:text-white">
              {quantity}
            </span>
            <button
              onClick={() => onQuantityChange(Math.min(product.stock, quantity + 1))}
              disabled={isOutOfStock || quantity >= product.stock}
              className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white disabled:opacity-40"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart button */}
          <KeycapButton
            variant="primary"
            size="md"
            disabled={isOutOfStock}
            onClick={onAddToCart}
            className="flex-1 justify-center py-2.5 font-bold"
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            Add to Cart • {formatPrice(product.price * quantity)}
          </KeycapButton>
        </div>

        {/* Secondary Buttons: Wishlist, Compare, Enquiry */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={onToggleWishlist}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium rounded-lg border transition-all ${
              isSaved
                ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-400'
                : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-750 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>{isSaved ? 'In Wishlist' : 'Wishlist'}</span>
          </button>

          <button
            onClick={onToggleCompare}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium rounded-lg border transition-all ${
              isCompared
                ? 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-950/40 dark:border-blue-900 dark:text-blue-400'
                : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-750 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Compare</span>
          </button>

          <button
            onClick={onOpenEnquiry}
            className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Ask Tech</span>
          </button>
        </div>
      </div>

      {/* Trust & Guarantee points */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-2.5 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{product.warrantyMonths}M Manufacturer Warranty</span>
        </div>
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-blue-600 shrink-0" />
          <span>Free Express over ₹2,999</span>
        </div>
        <div className="flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-slate-500 shrink-0" />
          <span>7-Day Replacement Support</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-slate-500 shrink-0" />
          <span>100% Genuine Sealed Unit</span>
        </div>
      </div>
    </div>
  );
};
