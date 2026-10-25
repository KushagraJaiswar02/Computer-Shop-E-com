import React from 'react';
import { ShieldCheck, Truck, RotateCcw, Lock, FileText } from 'lucide-react';

export const PoliciesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900 py-12 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            Terms & Customer Protection
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1">
            Store Policies & Warranty Terms
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Clear standards for retail hardware sales, shipping insurance, and manufacturer RMA coverage.
          </p>
        </div>

        {/* Section 1: Warranty */}
        <div id="warranty" className="bg-white dark:bg-surface-850 rounded-2xl border border-slate-200 dark:border-surface-750 p-6 sm:p-8 shadow-soft-card space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              1. Hardware Manufacturer Warranty & Direct RMA
            </h2>
          </div>
          <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed space-y-2">
            <p>
              All products sold by NexusTech are genuine retail units backed by the official manufacturer's regional warranty (e.g. ASUS 36-month GPU warranty, AMD 36-month processor warranty, Corsair lifetime DRAM warranty).
            </p>
            <p>
              In the event of hardware malfunction during normal operation within the warranty period, NexusTech provides expedited RMA submission and manufacturer replacement assistance.
            </p>
          </div>
        </div>

        {/* Section 2: Shipping */}
        <div id="shipping" className="bg-white dark:bg-surface-850 rounded-2xl border border-slate-200 dark:border-surface-750 p-6 sm:p-8 shadow-soft-card space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400">
              <Truck className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              2. Anti-Static Insured Domestic Freight
            </h2>
          </div>
          <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed space-y-2">
            <p>
              High-tier PC components (especially graphics cards, laptops, and motherboards) are packed inside ESD anti-static bubble packaging and reinforced outer shipping boxes.
            </p>
            <p>
              All shipments over $299 qualify for Free Express Insured Delivery with real-time courier tracking and signature confirmation upon delivery.
            </p>
          </div>
        </div>

        {/* Section 3: Returns */}
        <div id="returns" className="bg-white dark:bg-surface-850 rounded-2xl border border-slate-200 dark:border-surface-750 p-6 sm:p-8 shadow-soft-card space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              3. 30-Day DOA & Return Protocol
            </h2>
          </div>
          <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed space-y-2">
            <p>
              If a component arrives Dead-On-Arrival (DOA), notify our technical team within 30 days of delivery for an immediate advance replacement cross-shipment at zero additional charge.
            </p>
            <p>
              Unopened items in original factory seals may be returned within 30 days of receipt. Opened products returned for customer remorse may be subject to a standard 10% inspection and testing fee.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
