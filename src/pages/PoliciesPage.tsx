import React from 'react';
import { Link } from 'react-router-dom';
import { Info } from 'lucide-react';

export const PoliciesPage: React.FC = () => (
  <div className="min-h-screen bg-slate-50/70 py-10 dark:bg-slate-900/50 sm:py-12">
    <main className="mx-auto max-w-4xl space-y-6 px-4 sm:px-6 lg:px-8">
      <div>
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Store information</span>
        <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">Policies & warranty</h1>
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-5 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-850 dark:text-slate-300">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
        <p>Store-specific shipping, returns, warranty, privacy and business details have not been provided for this demo storefront. Please confirm those terms with the retailer before purchasing. Product warranty coverage can vary by product and manufacturer.</p>
      </div>

      <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 text-sm dark:border-slate-800 dark:bg-slate-850">
        <h2 className="font-bold text-slate-900 dark:text-white">Information needed before launch</h2>
        <ul className="list-disc space-y-1 pl-5 text-slate-600 dark:text-slate-300">
          <li>Registered business name and customer support contact details.</li>
          <li>Shipping regions, rates, delivery estimates and shipment tracking process.</li>
          <li>Return, cancellation, refund and damaged-delivery terms.</li>
          <li>Product-specific warranty source and claim process.</li>
          <li>Privacy notice, data retention period and customer-data contact.</li>
        </ul>
        <Link to="/contact" className="inline-flex min-h-10 items-center font-semibold text-blue-700 underline-offset-4 hover:underline dark:text-blue-300">Contact information</Link>
      </section>
    </main>
  </div>
);
