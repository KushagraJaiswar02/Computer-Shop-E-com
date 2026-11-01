import React from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { SAMPLE_REVIEWS } from '../../data/mockData';

export const ReviewsSection: React.FC = () => {
  return (
    <section className="py-10 sm:py-12 bg-surface dark:bg-surface border-b border-border dark:border-border transition-colors">
      <div className="shop-container ">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-main dark:text-main">
              Customer Feedback
            </h2>
            <p className="text-xs text-muted dark:text-muted mt-0.5">
              Sample reviews format for demonstration and evaluation
            </p>
          </div>
          <span className="text-[11px] font-sans text-muted">
            Demonstration Data
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {SAMPLE_REVIEWS.map(rev => (
            <div
              key={rev.id}
              className="bg-surface-soft dark:bg-surface rounded-xl border border-border dark:border-border p-4 sm:p-5 flex flex-col justify-between shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex text-warning-ink">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-warning-ink text-warning-ink' : 'text-muted'}`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-muted">{rev.date}</span>
                </div>

                <h4 className="font-semibold text-xs sm:text-sm text-main dark:text-main mb-1.5 leading-snug">
                  "{rev.title}"
                </h4>
                <p className="text-xs text-muted dark:text-main leading-relaxed mb-3">
                  {rev.comment}
                </p>
              </div>

              <div className="pt-2.5 border-t border-border/60 dark:border-border flex items-center justify-between text-[11px] text-muted">
                <span className="font-medium text-main dark:text-main">{rev.authorName}</span>
                <span className="text-[10px] text-muted font-sans">Sample Review</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
