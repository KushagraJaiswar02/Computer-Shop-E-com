import React from 'react';
import { Link } from 'react-router-dom';
import { Info } from 'lucide-react';

export const AboutPage: React.FC = () => (
  <div className="min-h-[60vh] bg-slate-50/70 py-12 dark:bg-slate-900/50 sm:py-16">
    <main className="mx-auto max-w-3xl space-y-6 px-4 sm:px-6 lg:px-8">
      <header>
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">About ComputerShop</span>
        <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">A hardware storefront preview</h1>
      </header>
      <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-5 text-sm leading-relaxed text-slate-700 dark:border-slate-700 dark:bg-slate-850 dark:text-slate-300">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
        <p>This site is a local storefront demonstration with example catalog content. Retailer business history, authorized-seller status, product sourcing, warranty, tax invoicing and shipping claims have not been supplied or verified, so they are not stated here.</p>
      </div>
      <Link to="/policies" className="inline-flex min-h-10 items-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 hover:border-blue-500 dark:border-slate-700 dark:bg-slate-850 dark:text-slate-100">View store information</Link>
    </main>
  </div>
);
