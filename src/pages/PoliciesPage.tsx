import React from 'react';
import { ShieldCheck, Truck, RotateCcw } from 'lucide-react';

export const PoliciesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-900/50 py-10 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Terms & Customer Protection
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
            Store Policies & Warranty Terms
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5">
            Transparent policies covering authorized brand warranty, transit protection, and replacement standards.
          </p>
        </div>

        {/* Section 1: Warranty */}
        <div id="warranty" className="bg-white dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              1. Brand Manufacturer Warranty & Service Center Support
            </h2>
          </div>
          <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed space-y-2">
            <p>
              All products sold are brand-new retail units backed by official manufacturer warranties in India (e.g., ASUS 36-month GPU warranty, AMD/Intel 36-month processor warranty, Corsair lifetime/10-year memory warranty).
            </p>
            <p>
              Every unit includes a verified GST invoice bearing unique serial numbers for claims at authorized brand service centers across India.
            </p>
          </div>
        </div>

        {/* Section 2: Shipping */}
        <div id="shipping" className="bg-white dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <Truck className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              2. Anti-Static Packaging & Nationwide Shipping
            </h2>
          </div>
          <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed space-y-2">
            <p>
              Delicate PC components (graphics cards, motherboards, processors, and monitors) are secured in ESD anti-static packaging and heavy outer corrugated boxes.
            </p>
            <p>
              Orders over ₹2,999 qualify for Free Express Shipping across major metro locations and pin codes in India with online consignment tracking.
            </p>
          </div>
        </div>

        {/* Section 3: Returns */}
        <div id="returns" className="bg-white dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              3. Transit Damage & Replacement Protocol
            </h2>
          </div>
          <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed space-y-2">
            <p>
              In the unlikely event of physical transit damage or dead-on-arrival (DOA) condition, report within 48 hours of delivery with unboxing video footage for prompt replacement processing.
            </p>
            <p>
              Unopened items with unbroken factory seals can be returned within 7 days of delivery.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
