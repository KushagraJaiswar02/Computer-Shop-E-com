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
    <div className="bg-surface dark:bg-surface rounded-xl border border-border dark:border-border shadow-xs overflow-hidden mb-10">
      {/* Tab Navigation */}
      <div className="flex border-b border-border dark:border-border bg-surface-soft/70 dark:bg-surface/50">
        <button
          onClick={() => setActiveTab('specs')}
          className={`py-3 px-5 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'specs'
              ? 'border-primary text-accent dark:text-accent bg-surface dark:bg-surface'
              : 'border-transparent text-muted hover:text-main dark:hover:text-main'
          }`}
        >
          Technical Specifications ({product.attributes.length})
        </button>
        <button
          onClick={() => setActiveTab('description')}
          className={`py-3 px-5 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'description'
              ? 'border-primary text-accent dark:text-accent bg-surface dark:bg-surface'
              : 'border-transparent text-muted hover:text-main dark:hover:text-main'
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
                <h3 className="text-xs font-sans font-bold uppercase tracking-wider text-muted">
                  {groupName}
                </h3>
                <div className="rounded-lg border border-border dark:border-border overflow-hidden divide-y divide-border dark:divide-border text-xs sm:text-sm">
                  {attrs.map((attr, i) => (
                    <div
                      key={i}
                      className="flex flex-col sm:flex-row py-2 px-3.5 bg-surface dark:bg-surface hover:bg-surface-soft/60 dark:hover:bg-surface-elevated/40"
                    >
                      <span className="w-full sm:w-1/3 font-medium text-muted dark:text-muted font-mono text-xs">
                        {attr.name}
                      </span>
                      <span className="w-full sm:w-2/3 font-semibold text-main dark:text-main mt-0.5 sm:mt-0">
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
          <div className="max-w-3xl space-y-4 text-xs sm:text-sm text-main dark:text-main leading-relaxed">
            <p>{product.description}</p>
            <div className="rounded-lg border border-primary bg-accent/10 p-4 text-xs text-main dark:border-border dark:bg-surface dark:text-main">
              Example catalog content is shown for review. Confirm specifications, availability and warranty with the retailer before purchase.
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
