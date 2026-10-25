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
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900 py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-slate-200 dark:border-surface-750 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              <Scale className="w-4 h-4" />
              <span>Side-by-Side Architectural Analysis</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Component Comparison ({compareProducts.length}/4)
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Inspect technical differences, memory bandwidth, clocks, and form-factors side-by-side.
            </p>
          </div>

          {compareProducts.length > 0 && (
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={highlightDifferences}
                  onChange={e => setHighlightDifferences(e.target.checked)}
                  className="rounded text-brand-600 focus:ring-brand-500"
                />
                <span className="font-medium">Highlight Differences</span>
              </label>

              <button
                onClick={clearCompare}
                className="text-xs text-rose-600 hover:text-rose-700 dark:text-rose-400 font-medium"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {compareProducts.length === 0 ? (
          <div className="py-20 text-center bg-white dark:bg-surface-850 rounded-2xl border border-slate-200 dark:border-surface-750 p-8 shadow-soft-card">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-surface-800 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <Scale className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              No hardware added to comparison
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
              Browse any product in the catalog and click the scale icon to compare specifications side-by-side.
            </p>
            <Link to="/shop">
              <KeycapButton variant="primary">Browse Hardware Catalog</KeycapButton>
            </Link>
          </div>
        ) : (
          <div className="bg-white dark:bg-surface-850 rounded-2xl border border-slate-200 dark:border-surface-750 overflow-x-auto shadow-soft-card">
            <table className="w-full text-xs text-left border-collapse min-w-[700px]">
              {/* Product cards header row */}
              <thead>
                <tr className="border-b border-slate-200 dark:border-surface-750 bg-slate-50/50 dark:bg-surface-900/50">
                  <th className="p-4 w-44 font-mono uppercase tracking-wider text-slate-400 text-[11px] align-top">
                    Hardware Overview
                  </th>
                  {compareProducts.map(prod => (
                    <th key={prod.id} className="p-4 min-w-[220px] align-top">
                      <div className="relative flex flex-col justify-between h-full space-y-3">
                        <button
                          onClick={() => toggleCompare(prod.id)}
                          className="absolute -top-1 -right-1 p-1 text-slate-400 hover:text-rose-500 rounded-full"
                          title="Remove from comparison"
                        >
                          <X className="w-4 h-4" />
                        </button>

                        <div className="w-24 h-24 mx-auto p-1 bg-white dark:bg-surface-800 rounded-xl border border-slate-100 dark:border-surface-700 flex items-center justify-center">
                          <img
                            src={prod.images[0]}
                            alt={prod.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>

                        <div>
                          <span className="text-[10px] font-mono text-brand-600 dark:text-brand-400 font-bold uppercase">
                            {prod.brandName}
                          </span>
                          <Link
                            to={`/product/${prod.slug}`}
                            className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2 hover:text-brand-600 block mt-0.5"
                          >
                            {prod.name}
                          </Link>
                          <span className="font-mono text-base font-extrabold text-slate-900 dark:text-white block mt-1">
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
              <tbody className="divide-y divide-slate-100 dark:divide-surface-750">
                {/* SKU */}
                <tr className="hover:bg-slate-50/50 dark:hover:bg-surface-800/40">
                  <td className="p-3.5 font-mono text-slate-500 font-semibold bg-slate-50/30 dark:bg-surface-900/30">
                    Product SKU
                  </td>
                  {compareProducts.map(p => (
                    <td key={p.id} className="p-3.5 font-mono text-slate-800 dark:text-slate-200">
                      {p.sku}
                    </td>
                  ))}
                </tr>

                {/* Stock Status */}
                <tr className="hover:bg-slate-50/50 dark:hover:bg-surface-800/40">
                  <td className="p-3.5 font-mono text-slate-500 font-semibold bg-slate-50/30 dark:bg-surface-900/30">
                    Availability
                  </td>
                  {compareProducts.map(p => (
                    <td key={p.id} className={`p-3.5 font-semibold ${p.stockStatus === 'out_of_stock' ? 'text-slate-500' : p.stockStatus === 'backorder' ? 'text-amber-600' : 'text-emerald-600'}`}>
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
                          ? 'bg-amber-500/10 dark:bg-amber-500/5'
                          : 'hover:bg-slate-50/50 dark:hover:bg-surface-800/40'
                      }`}
                    >
                      <td className="p-3.5 font-mono text-slate-500 font-semibold bg-slate-50/30 dark:bg-surface-900/30">
                        {attrName}
                      </td>
                      {values.map((val, idx) => (
                        <td
                          key={idx}
                          className={`p-3.5 ${
                            val === '—'
                              ? 'text-slate-400 italic'
                              : 'text-slate-800 dark:text-slate-200 font-medium'
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
