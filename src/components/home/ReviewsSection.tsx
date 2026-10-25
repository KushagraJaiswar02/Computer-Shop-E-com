import React from 'react';
import { Star, MessageSquareQuote, CheckCircle2 } from 'lucide-react';
import { SAMPLE_REVIEWS } from '../../data/mockData';

export const ReviewsSection: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 bg-surface-50 dark:bg-surface-850/60 border-b border-slate-200 dark:border-surface-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 mb-2">
            <MessageSquareQuote className="w-4 h-4" />
            <span>Demonstration Testimonials</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Builder & Integrator Feedback
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
            Sample client experiences demonstrating how verified build reviews appear on the live storefront.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SAMPLE_REVIEWS.map(rev => (
            <div
              key={rev.id}
              className="bg-white dark:bg-surface-800 rounded-xl border border-slate-200 dark:border-surface-700 p-5 flex flex-col justify-between shadow-soft-card"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{rev.date}</span>
                </div>

                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-2 leading-snug">
                  "{rev.title}"
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic mb-4">
                  {rev.comment}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-surface-700">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                    {rev.authorName}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Verified Rig</span>
                  </div>
                </div>
                {rev.systemConfig && (
                  <p className="text-[10px] font-mono text-slate-400 truncate mt-1">
                    {rev.systemConfig}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
