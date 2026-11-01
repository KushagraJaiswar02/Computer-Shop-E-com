import React from 'react';
import { Link } from 'react-router-dom';
import { Info } from 'lucide-react';

export const PoliciesPage: React.FC = () => (
  <div className="min-h-screen bg-surface-soft/70 py-10 dark:bg-surface/50 sm:py-12">
    <main className="shop-container content-prose space-y-6 ">
      <div>
        <span className="text-xs font-sans font-bold uppercase tracking-wider text-accent dark:text-accent">Store information</span>
        <h1 className="mt-1 text-2xl font-bold text-main dark:text-main sm:text-3xl">Policies & warranty</h1>
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-primary bg-accent/10 p-5 text-sm text-main dark:border-border dark:bg-surface dark:text-main">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-accent dark:text-accent" />
        <p>Store-specific shipping, returns, warranty, privacy and business details have not been provided for this demo storefront. Please confirm those terms with the retailer before purchasing. Product warranty coverage can vary by product and manufacturer.</p>
      </div>

      <section className="space-y-3 rounded-xl border border-border bg-surface p-5 text-sm dark:border-border dark:bg-surface">
        <h2 className="font-bold text-main dark:text-main">Information needed before launch</h2>
        <ul className="list-disc space-y-1 pl-5 text-muted dark:text-main">
          <li>Registered business name and customer support contact details.</li>
          <li>Shipping regions, rates, delivery estimates and shipment tracking process.</li>
          <li>Return, cancellation, refund and damaged-delivery terms.</li>
          <li>Product-specific warranty source and claim process.</li>
          <li>Privacy notice, data retention period and customer-data contact.</li>
        </ul>
        <Link to="/contact" className="inline-flex min-h-10 items-center font-semibold text-accent underline-offset-4 hover:underline dark:text-accent">Contact information</Link>
      </section>
    </main>
  </div>
);
