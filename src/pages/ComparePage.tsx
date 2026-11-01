import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Scale, Trash2, X, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../lib/utils';
import { KeycapButton } from '../components/common/KeycapButton';

export const ComparePage: React.FC = () => {
  const { compareList, toggleCompare, clearCompare, products, addToCart } = useStore();
  const [highlightDifferences, setHighlightDifferences] = useState(false);

  const compareProducts = products.filter(p => compareList.includes(p.id));

  // Extract all distinct attribute names across the compared products
  const allAttributeNames = Array.from(
    new Set(
      compareProducts.flatMap(p => p.attributes.map(a => a.name))
    )
  );

  return (
    <div className="min-h-screen bg-background dark:bg-background py-8 transition-colors">
      <div className="shop-container ">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-border dark:border-border gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-sans font-bold uppercase tracking-wider text-accent dark:text-accent">
              <Scale className="w-4 h-4" />
              <span>Side-by-Side Architectural Analysis</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-main dark:text-main mt-1">
              Component Comparison ({compareProducts.length}/4)
            </h1>
            <p className="text-xs sm:text-sm text-muted dark:text-muted mt-0.5">
              Inspect technical differences, memory bandwidth, clocks, and form-factors side-by-side.
            </p>
          </div>

          {compareProducts.length > 0 && (
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-xs text-main dark:text-main cursor-pointer">
                <input
                  type="checkbox"
                  checked={highlightDifferences}
                  onChange={e => setHighlightDifferences(e.target.checked)}
                  className="rounded text-accent focus:ring-focus"
                />
                <span className="font-medium">Highlight Differences</span>
              </label>

              <button
                onClick={clearCompare}
                className="text-xs text-danger-ink hover:text-danger-ink dark:text-danger-ink font-medium"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {compareProducts.length === 0 ? (
          <div className="py-20 text-center bg-surface dark:bg-surface rounded-2xl border border-border dark:border-border p-8 shadow-soft-card">
            <div className="w-16 h-16 rounded-full bg-surface-soft dark:bg-surface-elevated text-muted flex items-center justify-center mx-auto mb-4">
              <Scale className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-main dark:text-main mb-2">
              No hardware added to comparison
            </h3>
            <p className="text-xs sm:text-sm text-muted dark:text-muted max-w-sm mx-auto mb-6">
              Browse any product in the catalog and click the scale icon to compare specifications side-by-side.
            </p>
            <Link to="/shop">
              <KeycapButton variant="primary">Browse Hardware Catalog</KeycapButton>
            </Link>
          </div>
        ) : (
          <div className="bg-surface dark:bg-surface rounded-2xl border border-border dark:border-border overflow-x-auto shadow-soft-card">
            <table className="w-full text-xs text-left border-collapse min-w-[700px]">
              {/* Product cards header row */}
              <thead>
                <tr className="border-b border-border dark:border-border bg-surface-soft/50 dark:bg-background/50">
                  <th className="p-4 w-44 font-sans uppercase tracking-wider text-muted text-[11px] align-top">
                    Hardware Overview
                  </th>
                  {compareProducts.map(prod => (
                    <th key={prod.id} className="p-4 min-w-[220px] align-top">
                      <div className="relative flex flex-col justify-between h-full space-y-3">
                        <button
                          onClick={() => toggleCompare(prod.id)}
                          className="absolute -top-1 -right-1 p-1 text-muted hover:text-danger-ink rounded-full"
                          title="Remove from comparison"
                        >
                          <X className="w-4 h-4" />
                        </button>

                        <div className="w-24 h-24 mx-auto p-1 bg-surface dark:bg-surface-elevated rounded-xl border border-border dark:border-border flex items-center justify-center">
                          <img
                            src={prod.images[0]}
                            alt={prod.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>

                        <div>
                          <span className="text-[10px] font-sans text-accent dark:text-accent font-bold uppercase">
                            {prod.brandName}
                          </span>
                          <Link
                            to={`/product/${prod.slug}`}
                            className="font-bold text-sm text-main dark:text-main line-clamp-2 hover:text-accent block mt-0.5"
                          >
                            {prod.name}
                          </Link>
                          <span className="font-sans text-base font-extrabold text-main dark:text-main block mt-1 price">
                            {formatPrice(prod.price)}
                          </span>
                        </div>

                        <KeycapButton
                          size="sm"
                          variant="primary"
                          onClick={() => addToCart(prod, 1)}
                          className="w-full"
                        >
                          <ShoppingBag className="w-3.5 h-3.5 mr-1" />
                          Add to Cart
                        </KeycapButton>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Attributes comparison rows */}
              <tbody className="divide-y divide-border dark:divide-border">
                {/* SKU */}
                <tr className="hover:bg-surface-soft/50 dark:hover:bg-surface-elevated/40">
                  <td className="p-3.5 font-sans text-muted font-semibold bg-surface-soft/30 dark:bg-background/30">
                    Product SKU
                  </td>
                  {compareProducts.map(p => (
                    <td key={p.id} className="p-3.5 font-sans text-main dark:text-main">
                      {p.sku}
                    </td>
                  ))}
                </tr>

                {/* Stock Status */}
                <tr className="hover:bg-surface-soft/50 dark:hover:bg-surface-elevated/40">
                  <td className="p-3.5 font-sans text-muted font-semibold bg-surface-soft/30 dark:bg-background/30">
                    Availability
                  </td>
                  {compareProducts.map(p => (
                    <td key={p.id} className={`p-3.5 font-semibold ${p.stockStatus === 'out_of_stock' ? 'text-muted' : p.stockStatus === 'backorder' ? 'text-warning-ink' : 'text-success-ink'}`}>
                      {p.stockStatus === 'in_stock' ? `In Stock (${p.stock})` : p.stockStatus === 'low_stock' ? `Low stock (${p.stock})` : p.stockStatus === 'backorder' ? 'Backorder' : 'Out of stock'}
                    </td>
                  ))}
                </tr>

                {/* Dynamic Attributes */}
                {allAttributeNames.map(attrName => {
                  const values = compareProducts.map(
                    p => p.attributes.find(a => a.name === attrName)?.value || '—'
                  );
                  const isDifferent = new Set(values).size > 1;

                  return (
                    <tr
                      key={attrName}
                      className={`transition-colors ${
                        highlightDifferences && isDifferent
                          ? 'bg-warning/10 dark:bg-warning/5'
                          : 'hover:bg-surface-soft/50 dark:hover:bg-surface-elevated/40'
                      }`}
                    >
                      <td className="p-3.5 font-sans text-muted font-semibold bg-surface-soft/30 dark:bg-background/30">
                        {attrName}
                      </td>
                      {values.map((val, idx) => (
                        <td
                          key={idx}
                          className={`p-3.5 ${
                            val === '—'
                              ? 'text-muted italic'
                              : 'text-main dark:text-main font-medium'
                          }`}
                        >
                          {val}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
