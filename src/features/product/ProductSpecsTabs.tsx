import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Product, Review } from '../../types';

interface ProductSpecsTabsProps {
  product: Product;
  reviews: Review[];
}

export const ProductSpecsTabs: React.FC<ProductSpecsTabsProps> = ({
  product,
  reviews,
}) => {
  const [activeTab, setActiveTab] = useState<'specs' | 'description' | 'reviews'>('specs');

  // Group attributes by section
  const groupedAttributes: Record<string, typeof product.attributes> = {};
  product.attributes.forEach((attr) => {
    const grp = attr.group || 'Technical Details';
    if (!groupedAttributes[grp]) groupedAttributes[grp] = [];
    groupedAttributes[grp].push(attr);
  });

  return (
    <div className="bg-white dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden mb-10">
      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50">
        <button
          onClick={() => setActiveTab('specs')}
          className={`py-3 px-5 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'specs'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-850'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Technical Specifications ({product.attributes.length})
        </button>
        <button
          onClick={() => setActiveTab('description')}
          className={`py-3 px-5 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'description'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-850'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Overview & Packaging
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`py-3 px-5 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'reviews'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-850'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Customer Reviews ({reviews.length})
        </button>
      </div>

      <div className="p-5 sm:p-6">
        {/* Specs Tab */}
        {activeTab === 'specs' && (
          <div className="space-y-5">
            {Object.entries(groupedAttributes).map(([groupName, attrs]) => (
              <div key={groupName} className="space-y-1.5">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  {groupName}
                </h3>
                <div className="rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 text-xs sm:text-sm">
                  {attrs.map((attr, i) => (
                    <div
                      key={i}
                      className="flex flex-col sm:flex-row py-2 px-3.5 bg-white dark:bg-slate-850 hover:bg-slate-50/60 dark:hover:bg-slate-800/40"
                    >
                      <span className="w-full sm:w-1/3 font-medium text-slate-500 dark:text-slate-400 font-mono text-xs">
                        {attr.name}
                      </span>
                      <span className="w-full sm:w-2/3 font-semibold text-slate-800 dark:text-slate-100 mt-0.5 sm:mt-0">
                        {attr.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Description Tab */}
        {activeTab === 'description' && (
          <div className="max-w-3xl space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <p>{product.description}</p>
            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-750">
              <h4 className="font-bold text-slate-900 dark:text-white mb-1 text-xs">
                Genuine Brand Packaging & Warranty Support
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                All components are dispatched in official factory sealed packaging with serial number tracking on GST invoices. Warranty can be claimed at authorized brand service centers across India.
              </p>
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-xs sm:text-sm text-slate-500 italic">
                No customer reviews submitted yet for this product.
              </p>
            ) : (
              reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                        {rev.authorName}
                      </span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400 px-1.5 py-0.5 rounded font-mono">
                        Verified Purchase
                      </span>
                    </div>
                    <span className="text-xs font-mono text-slate-400">{rev.date}</span>
                  </div>
                  <div className="flex text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400" />
                    ))}
                  </div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
                    "{rev.title}"
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300">{rev.comment}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
