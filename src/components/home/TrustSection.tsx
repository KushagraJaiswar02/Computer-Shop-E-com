import React from 'react';
import { Link } from 'react-router-dom';
import { Info } from 'lucide-react';

export const TrustSection: React.FC = () => (
  <section className="border-b border-border/80 bg-surface-soft/55 py-6 dark:border-border/80 dark:bg-surface/35 sm:py-7">
    <div className="shop-container flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center ">
      <div className="flex items-start gap-3">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-accent dark:text-accent" />
        <div>
          <h2 className="text-sm font-bold text-main dark:text-main">Store details are being configured</h2>
          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-muted dark:text-main">Shipping, returns and warranty information will appear here once the retailer supplies and verifies those terms. This storefront currently runs as a local demonstration.</p>
        </div>
      </div>
      <Link to="/policies" className="min-h-10 shrink-0 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-semibold text-main hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus dark:border-border dark:bg-surface dark:text-main">Store information</Link>
    </div>
  </section>
);
