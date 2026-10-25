import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/product/ProductCard';
import { KeycapButton } from '../components/common/KeycapButton';

export const WishlistPage: React.FC = () => {
  const { wishlist, products, addToCart, toggleWishlist } = useStore();

  const savedProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900 py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-slate-200 dark:border-surface-750 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
              <span>Personal Hardware Wishlist</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Saved Hardware ({savedProducts.length})
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Items saved for upcoming custom PC builds or upgrade cycles.
            </p>
          </div>

          {savedProducts.length > 0 && (
            <div className="flex items-center gap-3">
              <KeycapButton
                variant="primary"
                onClick={() => {
                  savedProducts.forEach(p => {
                    if (p.stockStatus !== 'out_of_stock') addToCart(p, 1);
                  });
                }}
              >
                <ShoppingBag className="w-4 h-4 mr-1.5" />
                Move All In-Stock to Cart
              </KeycapButton>
            </div>
          )}
        </div>

        {savedProducts.length === 0 ? (
          <div className="py-20 text-center bg-white dark:bg-surface-850 rounded-2xl border border-slate-200 dark:border-surface-750 p-8 shadow-soft-card">
            <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Your wishlist is currently empty
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
              Browse our laptops, GPUs, processors, and memory kits. Hover or focus any card and press <strong className="font-mono text-slate-700 dark:text-slate-200">[ L ]</strong> to save it instantly.
            </p>
            <Link to="/shop">
              <KeycapButton variant="primary">Explore Hardware Catalog</KeycapButton>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {savedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
