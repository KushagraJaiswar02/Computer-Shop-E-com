import { brandConfig } from '../config/brand';
import React from 'react';
import { Link } from 'react-router-dom';
import { Info } from 'lucide-react';

export const AboutPage: React.FC = () => (
  <div className="min-h-[60vh] bg-surface-soft/70 py-12 dark:bg-surface/50 sm:py-16">
    <main className="shop-container content-prose space-y-6 ">
      <header>
        <span className="text-xs font-sans font-bold uppercase tracking-wider text-accent dark:text-accent">About {brandConfig.shopName}</span>
        <h1 className="mt-1 text-2xl font-bold text-main dark:text-main sm:text-3xl">A hardware storefront preview</h1>
      </header>
      <div className="flex items-start gap-3 rounded-xl border border-primary bg-accent/10 p-5 text-sm leading-relaxed text-main dark:border-border dark:bg-surface dark:text-main">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-accent dark:text-accent" />
        <p>This site is a local storefront demonstration with example catalog content. Retailer business history, authorized-seller status, product sourcing, warranty, tax invoicing and shipping claims have not been supplied or verified, so they are not stated here.</p>
      </div>
      <Link to="/policies" className="inline-flex min-h-10 items-center rounded-lg border border-border bg-surface px-3 py-2 text-xs font-semibold text-main hover:border-primary dark:border-border dark:bg-surface dark:text-main">View store information</Link>
    </main>
  </div>
);
