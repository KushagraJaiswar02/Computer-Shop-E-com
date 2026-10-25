import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { KeycapButton } from '../common/KeycapButton';

export const HeroBanner: React.FC = () => {
  const { homepageConfig } = useStore();
  const activeSlides = (homepageConfig.heroSlides || []).filter(s => s.isActive);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex(prev => (prev + 1) % activeSlides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [activeSlides.length]);

  if (activeSlides.length === 0) return null;

  const slide = activeSlides[currentSlideIndex] || activeSlides[0];

  const nextSlide = () => setCurrentSlideIndex(prev => (prev + 1) % activeSlides.length);
  const prevSlide = () =>
    setCurrentSlideIndex(prev => (prev - 1 + activeSlides.length) % activeSlides.length);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-100 via-white to-blue-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-slate-850 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-4">
            {/* Category / Badge Tag */}
            {slide.badge && (
              <span className="inline-block px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                {slide.badge}
              </span>
            )}

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              {slide.title}
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
              {slide.subtitle}
            </p>

            {/* Hardware highlights if available */}
            {slide.featuredSpecs && slide.featuredSpecs.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {slide.featuredSpecs.map((spec, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-xs"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <Link to={slide.ctaLink}>
                <KeycapButton variant="primary" size="lg" className="font-semibold">
                  <span>{slide.ctaText}</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </KeycapButton>
              </Link>

              {slide.secondaryCtaText && slide.secondaryCtaLink && (
                <Link to={slide.secondaryCtaLink}>
                  <KeycapButton variant="secondary" size="lg">
                    <span>{slide.secondaryCtaText}</span>
                  </KeycapButton>
                </Link>
              )}
            </div>
          </div>

          {/* Right Showcase Image Column */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="relative w-full max-w-md aspect-4/3 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 shadow-sm group">
              <img
                src={slide.imageUrl}
                alt={slide.title}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
              />
            </div>
          </div>
        </div>

        {/* Slide Indicators and Arrows */}
        {activeSlides.length > 1 && (
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-200/70 dark:border-slate-800">
            <div className="flex items-center gap-1.5">
              {activeSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentSlideIndex
                      ? 'w-6 bg-blue-600'
                      : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={prevSlide}
                className="p-1.5 rounded-md bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-xs transition-colors"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextSlide}
                className="p-1.5 rounded-md bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-xs transition-colors"
                aria-label="Next slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
