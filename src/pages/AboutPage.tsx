import React from 'react';
import { Cpu, ShieldCheck, Award, Users, CheckCircle, Wrench } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900 py-12 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            About NexusTech
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1">
            Engineered Silicon, Enthusiast Standard
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            Founded by hardware technicians and competitive gamers who believe computer hardware retail should be technical, transparent, and uncompromised.
          </p>
        </div>

        <div className="bg-white dark:bg-surface-850 rounded-2xl border border-slate-200 dark:border-surface-750 p-6 sm:p-10 shadow-soft-card space-y-6 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Our Retail Philosophy</h2>
          <p>
            NexusTech was built as an alternative to big-box retailers who treat high-end PC hardware like generic electronics. When purchasing a $2,000 graphics card or a 24-core workstation processor, builders deserve accurate physical dimensions, verified power delivery specifications, memory EXPO timings, and direct manufacturer warranties.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-slate-100 dark:border-surface-750">
            <div className="space-y-1">
              <span className="font-mono text-2xl font-black text-brand-600 dark:text-brand-400">100%</span>
              <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">Authorized Stock</h4>
              <p className="text-xs text-slate-500">Every item serial is tracked with direct regional brand warranty.</p>
            </div>
            <div className="space-y-1">
              <span className="font-mono text-2xl font-black text-brand-600 dark:text-brand-400">0%</span>
              <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">Grey-Market Silicon</h4>
              <p className="text-xs text-slate-500">No refurbished or OEM-tray substitutes sold as retail boxed.</p>
            </div>
            <div className="space-y-1">
              <span className="font-mono text-2xl font-black text-brand-600 dark:text-brand-400">24hr</span>
              <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">Tech Dispatch</h4>
              <p className="text-xs text-slate-500">In-stock components ship with anti-static packaging in 1 business day.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
