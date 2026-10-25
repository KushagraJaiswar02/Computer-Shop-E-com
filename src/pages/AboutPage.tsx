import React from 'react';
import { ShieldCheck, CheckCircle2, Truck } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-900/50 py-10 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            About Our Store
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
            Genuine Hardware & Custom PC Solutions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            Delivering authentic retail PC components, custom workstations, and enthusiast hardware across India with verified manufacturer warranty support.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-5 text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Our Retail Commitment</h2>
          <p>
            We supply high-performance graphics cards, processors, gaming laptops, and workstation memory with complete transparency. Every component comes from authorized national distribution channels with official GST invoices, ensuring hassle-free brand warranty coverage.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-5 border-t border-slate-100 dark:border-slate-800">
            <div className="space-y-1">
              <span className="font-mono text-2xl font-bold text-blue-600 dark:text-blue-400">100%</span>
              <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">Authorized Units</h4>
              <p className="text-xs text-slate-500">Every serial number is verified for authorized brand warranty in India.</p>
            </div>
            <div className="space-y-1">
              <span className="font-mono text-2xl font-bold text-blue-600 dark:text-blue-400">GST</span>
              <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">Tax Invoices</h4>
              <p className="text-xs text-slate-500">Full tax invoices provided for personal, business, and input credit claims.</p>
            </div>
            <div className="space-y-1">
              <span className="font-mono text-2xl font-bold text-blue-600 dark:text-blue-400">Secure</span>
              <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">Transit Packaging</h4>
              <p className="text-xs text-slate-500">Multi-layer anti-static bubble wrap and insured courier dispatch nationwide.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
