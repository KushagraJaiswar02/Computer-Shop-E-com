import React from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  Scale,
  CheckCircle2,
  AlertTriangle,
  Minus,
  Plus,
  HelpCircle,
} from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { getBrandHref } from '../catalog/seriesUtils';
import { formatPrice } from '../../lib/utils';
import { KeycapButton } from '../../components/common/KeycapButton';
import { extractSpecChips } from '../catalog/specUtils';
import { ProductTrustStrip } from './ProductTrustStrip';

interface ProductInfoBoxProps {
  product: Product;
  priceBoxRef?: React.Ref<HTMLDivElement>;
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
  priceBoxRef,
  quantity,
  onQuantityChange,
  onAddToCart,
  isSaved,
  onToggleWishlist,
  isCompared,
  onToggleCompare,
  onOpenEnquiry,
}) => {
  const isOutOfStock = product.stockStatus === 'out_of_stock' || product.stock <= 0;
  const { brands, compareList } = useStore();
  const brand = brands.find(item => item.id === product.brandId);
  const highlights = extractSpecChips(product, 'highlights');
  const compareDisabled = !isCompared && compareList.length >= 4;

  return (
    <div className="space-y-4">
      {/* Brand, Series & SKU bar */}
      <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-xs font-sans">
        <div className="flex items-center gap-1.5 flex-wrap">
          <Link
            to={brand ? getBrandHref(brand) : "/brands"}
            className="font-bold text-accent dark:text-accent hover:underline uppercase tracking-wide"
          >
            {product.brandName}
          </Link>
          {product.series?.trim() && (
            <>
              <span className="text-muted">·</span>
              <Link
                to={brand ? getBrandHref(brand, product.series) : "/brands"}
                className="font-medium text-muted dark:text-main hover:text-accent dark:hover:text-accent hover:underline"
              >
                {product.series}
              </Link>
            </>
          )}
        </div>
        <span className="text-muted shrink-0 font-mono">
          SKU: <span className="text-main dark:text-main font-bold font-mono">{product.sku}</span>
        </span>
      </div>

      {/* Product Name */}
      <h1 className="text-xl sm:text-2xl font-bold text-main dark:text-main leading-snug">
        {product.name}
      </h1>

      {highlights.length > 0 && (
        <ul aria-label="Key highlights" className="flex flex-wrap gap-2">
          {highlights.map(highlight => (
            <li key={highlight} className="max-w-full rounded-lg border border-border dark:border-border bg-surface-soft dark:bg-surface-elevated px-2.5 py-1.5 text-xs font-medium text-main dark:text-main break-words">{highlight}</li>
          ))}
        </ul>
      )}

      {/* Short Summary Description */}
      <p className="text-xs sm:text-sm text-muted dark:text-main leading-relaxed bg-surface-soft dark:bg-surface-elevated/40 p-3.5 rounded-lg border border-border dark:border-border">
        {product.shortDescription}
      </p>

      {/* Pricing and Stock Panel */}
      <div ref={priceBoxRef} className="p-4 rounded-xl bg-surface dark:bg-surface border border-border dark:border-border shadow-xs">
        <div className="flex flex-wrap items-baseline gap-3 mb-2">
          <span className="text-2xl sm:text-3xl font-bold font-sans text-main dark:text-main price">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-sm sm:text-base font-sans text-muted line-through price">
              {formatPrice(product.originalPrice)}
            </span>
          )}
          {product.discountPercent && product.discountPercent > 0 && (
            <span className="text-xs font-sans font-bold text-success-ink bg-success/10 dark:bg-success/10 px-2 py-0.5 rounded">
              Save {product.discountPercent}%
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-xs pt-3 border-t border-border dark:border-border">
          <div className="flex items-center gap-1.5 font-medium">
            {!isOutOfStock && product.stockStatus === 'in_stock' ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-success-ink" />
                <span className="text-success-ink dark:text-success-ink font-semibold">
                  In Stock ({product.stock} units available)
                </span>
              </>
            ) : !isOutOfStock && product.stockStatus === 'low_stock' ? (
              <>
                <AlertTriangle className="w-4 h-4 text-warning-ink" />
                <span className="text-warning-ink dark:text-warning-ink font-semibold">
                  Low Stock — Only {product.stock} left
                </span>
              </>
            ) : (
              <span className="text-muted font-medium">Currently out of stock</span>
            )}
          </div>

          <span className="text-muted font-sans text-[11px]">
            Demo catalog data
          </span>
        </div>
      </div>

      {/* Quantity & Add to Cart Controls */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center gap-3">
          {/* Stepper */}
          <div className="flex items-center border border-border dark:border-border rounded-lg bg-surface dark:bg-surface">
            <button
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              disabled={isOutOfStock}
              className="min-h-10 min-w-10 p-2 text-muted hover:text-main dark:text-main dark:hover:text-main disabled:opacity-40"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-3 text-sm font-sans font-bold text-main dark:text-main">
              {quantity}
            </span>
            <button
              onClick={() => onQuantityChange(Math.min(product.stock, quantity + 1))}
              disabled={isOutOfStock || quantity >= product.stock}
              className="min-h-10 min-w-10 p-2 text-muted hover:text-main dark:text-main dark:hover:text-main disabled:opacity-40"
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
            className="min-h-11 flex-1 justify-center px-2 py-2.5 text-xs sm:text-sm font-bold"
          >
            <span className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
              <ShoppingBag aria-hidden="true" className="w-4 h-4" />
              {isOutOfStock ? 'Out of stock' : <>Add to Cart <span className="whitespace-nowrap">• {formatPrice(product.price * quantity)}</span></>}
            </span>
          </KeycapButton>
        </div>

        <ProductTrustStrip />

        {/* Secondary Buttons: Wishlist, Compare, Enquiry */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={onToggleWishlist}
            aria-pressed={isSaved}
            title={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
            className={`min-h-10 flex flex-wrap items-center justify-center gap-1.5 py-2 px-2 text-xs font-medium rounded-lg border transition-all ${
              isSaved
                ? 'bg-danger/10 border-danger text-danger-ink dark:bg-danger/10 dark:border-danger dark:text-danger-ink'
                : 'bg-surface dark:bg-surface border-border dark:border-border text-main dark:text-main hover:bg-surface-soft dark:hover:bg-surface-elevated'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-danger-ink text-danger-ink' : ''}`} />
            <span>{isSaved ? 'In Wishlist' : 'Wishlist'}</span>
          </button>

          <span className="flex" title={compareDisabled ? 'Comparison limit reached (max 4 products)' : undefined}>
            <button
              onClick={onToggleCompare}
              disabled={compareDisabled}
              aria-pressed={isCompared}
              title={isCompared ? 'Remove from comparison' : 'Add to comparison'}
              className={`min-h-10 w-full flex flex-wrap items-center justify-center gap-1.5 py-2 px-2 text-xs font-medium rounded-lg border transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                isCompared
                  ? 'bg-accent/10 border-primary text-accent dark:bg-accent/10 dark:border-primary dark:text-accent'
                  : 'bg-surface dark:bg-surface border-border dark:border-border text-main dark:text-main hover:bg-surface-soft dark:hover:bg-surface-elevated'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Compare</span>
            </button>
          </span>

          <button
            onClick={onOpenEnquiry}
            className="min-h-10 flex flex-wrap items-center justify-center gap-1.5 py-2 px-2 text-xs font-medium rounded-lg border border-border dark:border-border bg-surface dark:bg-surface text-main dark:text-main hover:bg-surface-soft dark:hover:bg-surface-elevated transition-all"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Ask Tech</span>
          </button>
        </div>
      </div>

      <div className="border-t border-border pt-3 text-xs leading-relaxed text-muted dark:border-border dark:text-muted">
        Example catalog information. Verify specifications, price, availability and warranty terms with the retailer before purchase.
      </div>
    </div>
  );
};
