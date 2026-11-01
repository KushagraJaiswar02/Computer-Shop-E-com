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
      <h3 className="text-base sm:text-lg font-bold text-main dark:text-main mb-3.5 flex items-center gap-2">
        <Cpu className="w-5 h-5 text-accent dark:text-accent" />
        <span>Frequently Bought Together & Compatible Accessories</span>
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((item) => (
          <div
            key={item.id}
            className="p-3.5 rounded-xl border border-border dark:border-border bg-surface dark:bg-surface flex items-center justify-between gap-3 shadow-xs"
          >
            <img
              src={item.images[0]}
              alt={item.name}
              className="w-14 h-14 object-contain rounded-lg bg-surface-soft dark:bg-surface-elevated p-1 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <Link
                to={`/product/${item.slug}`}
                className="text-xs font-semibold text-main dark:text-main hover:text-accent line-clamp-1"
              >
                {item.name}
              </Link>
              <span className="font-sans text-xs font-bold text-accent dark:text-accent block mt-0.5 price">
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
