import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/product/ProductCard';
import { KeycapButton } from '../components/common/KeycapButton';
import { MotionList, productKey } from '../components/motion/MotionList';

export const WishlistPage: React.FC = () => {
  const { wishlist, products, addToCart, toggleWishlist } = useStore();

  const savedProducts = useMemo(() => products.filter(p => wishlist.includes(p.id)), [products, wishlist]);
  const inStock = savedProducts.filter(product => product.stockStatus !== 'out_of_stock' && product.stock > 0);
  const moveToCart = (product: typeof products[number]) => {
    addToCart(product, 1);
    if (wishlist.includes(product.id)) toggleWishlist(product.id);
  };

  return (
    <div className="wishlist-page min-h-screen bg-background dark:bg-background py-8 transition-colors">
      <div className="shop-container ">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-border dark:border-border gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-sans font-bold uppercase tracking-wider text-danger-ink dark:text-danger-ink">
              <Heart className="w-4 h-4 fill-danger-ink text-danger-ink" />
              <span>Personal Hardware Wishlist</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-main dark:text-main mt-1">
              Saved Hardware ({savedProducts.length})
            </h1>
            <p className="text-xs sm:text-sm text-muted dark:text-muted mt-0.5">
              Items saved for upcoming custom PC builds or upgrade cycles.
            </p>
          </div>

          {savedProducts.length > 0 && (
            <div className="flex items-center gap-3">
              <KeycapButton
                variant="primary"
                onClick={() => inStock.forEach(moveToCart)}
                disabled={inStock.length === 0}
              >
                <span className="inline-flex items-center gap-1.5"><ShoppingBag aria-hidden="true" className="w-4 h-4" />Move All In-Stock to Cart</span>
              </KeycapButton>
            </div>
          )}
        </div>

        <MotionList items={savedProducts} itemKey={productKey} entranceId="wishlist" animateChanges className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-4" empty={(
          <div className="py-20 text-center bg-surface dark:bg-surface rounded-2xl border border-border dark:border-border p-8 shadow-soft-card">
            <div className="w-16 h-16 rounded-full bg-danger/10 dark:bg-danger/10 text-danger-ink flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-main dark:text-main mb-2">
              Your wishlist is currently empty
            </h3>
            <p className="text-xs sm:text-sm text-muted dark:text-muted max-w-sm mx-auto mb-6">
              Browse our laptops, GPUs, processors, and memory kits. Hover or focus any card and press <strong className="font-sans text-main dark:text-main">[ L ]</strong> to save it instantly.
            </p>
            <Link to="/shop" className="inline-flex min-h-11 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-on-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus">Explore Hardware Catalog</Link>
          </div>
        )}>
          {product => <ProductCard product={product} onAddToCart={moveToCart} cartActionLabel="Move to cart" muteUnavailable />}
        </MotionList>
      </div>
    </div>
  );
};
