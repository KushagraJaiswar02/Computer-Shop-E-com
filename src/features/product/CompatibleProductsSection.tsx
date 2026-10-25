import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu } from 'lucide-react';
import { Product } from '../../types';
import { formatPrice } from '../../lib/utils';
import { KeycapButton } from '../../components/common/KeycapButton';

interface CompatibleProductsSectionProps {
  products: Product[];
  onAddToCart: (p: Product) => void;
}

export const CompatibleProductsSection: React.FC<CompatibleProductsSectionProps> = ({
  products,
  onAddToCart,
}) => {
  if (products.length === 0) return null;

  return (
    <div className="mb-10">
      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-3.5 flex items-center gap-2">
        <Cpu className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <span>Frequently Bought Together & Compatible Accessories</span>
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((item) => (
          <div
            key={item.id}
            className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 flex items-center justify-between gap-3 shadow-xs"
          >
            <img
              src={item.images[0]}
              alt={item.name}
              className="w-14 h-14 object-contain rounded-lg bg-slate-50 dark:bg-slate-800 p-1 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <Link
                to={`/product/${item.slug}`}
                className="text-xs font-semibold text-slate-800 dark:text-slate-100 hover:text-blue-600 line-clamp-1"
              >
                {item.name}
              </Link>
              <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 block mt-0.5">
                {formatPrice(item.price)}
              </span>
            </div>
            <KeycapButton size="sm" variant="outline" onClick={() => onAddToCart(item)}>
              + Add
            </KeycapButton>
          </div>
        ))}
      </div>
    </div>
  );
};
