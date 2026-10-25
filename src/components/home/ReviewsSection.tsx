import React from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { SAMPLE_REVIEWS } from '../../data/mockData';

export const ReviewsSection: React.FC = () => {
  return (
    <section className="py-10 sm:py-12 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Customer Feedback
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Sample reviews format for demonstration and evaluation
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Demonstration Data
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {SAMPLE_REVIEWS.map(rev => (
            <div
              key={rev.id}
              className="bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 flex flex-col justify-between shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400">{rev.date}</span>
                </div>

                <h4 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white mb-1.5 leading-snug">
                  "{rev.title}"
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                  {rev.comment}
                </p>
              </div>

              <div className="pt-2.5 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-medium text-slate-700 dark:text-slate-300">{rev.authorName}</span>
                <span className="text-[10px] text-slate-400 font-mono">Sample Review</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
