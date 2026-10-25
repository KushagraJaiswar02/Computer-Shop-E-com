import React from 'react';
import { Link } from 'react-router-dom';
import { Info } from 'lucide-react';

export const TrustSection: React.FC = () => (
  <section className="border-b border-slate-200 bg-slate-50/70 py-8 dark:border-slate-800 dark:bg-slate-900/45">
    <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
      <div className="flex items-start gap-3">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Store details are being configured</h2>
          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-600 dark:text-slate-300">Shipping, returns and warranty information will appear here once the retailer supplies and verifies those terms. This storefront currently runs as a local demonstration.</p>
        </div>
      </div>
      <Link to="/policies" className="min-h-10 shrink-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 hover:border-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-slate-700 dark:bg-slate-850 dark:text-slate-100">Store information</Link>
    </div>
  </section>
);
