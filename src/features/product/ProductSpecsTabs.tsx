import React, { useState } from 'react';
import { Product } from '../../types';

interface ProductSpecsTabsProps {
  product: Product;
}

export const ProductSpecsTabs: React.FC<ProductSpecsTabsProps> = ({ product }) => {
  const [activeTab, setActiveTab] = useState<'specs' | 'description'>('specs');

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
          Product overview
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
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
              Example catalog content is shown for review. Confirm specifications, availability and warranty with the retailer before purchase.
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
