import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, Shield, Zap, Sparkles } from 'lucide-react';
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
    }, 6500);
    return () => clearInterval(interval);
  }, [activeSlides.length]);

  if (activeSlides.length === 0) return null;

  const slide = activeSlides[currentSlideIndex] || activeSlides[0];

  const nextSlide = () => setCurrentSlideIndex(prev => (prev + 1) % activeSlides.length);
  const prevSlide = () =>
    setCurrentSlideIndex(prev => (prev - 1 + activeSlides.length) % activeSlides.length);

  return (
    <section className="relative overflow-hidden bg-slate-900 text-white border-b border-slate-800">
      {/* Subtle background tech grid pattern */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #60a5fa 1px, transparent 0)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Decorative gradient blur */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium tracking-wide bg-brand-950/80 text-brand-400 border border-brand-800/80 backdrop-blur-xs">
              <Zap className="w-3.5 h-3.5" />
              <span>{slide.badge}</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight font-sans">
              {slide.title}
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
              {slide.subtitle}
            </p>

            {/* Featured Hardware Specs pills */}
            {slide.featuredSpecs && slide.featuredSpecs.length > 0 && (
              <div className="pt-2">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2 font-medium">
                  Architecture Highlights
                </span>
                <div className="flex flex-wrap gap-2">
                  {slide.featuredSpecs.map((spec, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-mono px-3 py-1 rounded-md bg-slate-800/90 text-slate-200 border border-slate-700/80 shadow-xs"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <Link to={slide.ctaLink}>
                <KeycapButton variant="primary" size="lg" className="font-semibold shadow-elevated">
                  <span>{slide.ctaText}</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </KeycapButton>
              </Link>

              {slide.secondaryCtaText && slide.secondaryCtaLink && (
                <Link to={slide.secondaryCtaLink}>
                  <KeycapButton variant="outline" size="lg" className="border-slate-700 text-slate-200 hover:bg-slate-800">
                    <span>{slide.secondaryCtaText}</span>
                  </KeycapButton>
                </Link>
              )}
            </div>
          </div>

          {/* Right Hardware Image Column */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full max-w-md aspect-4/3 rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-800/60 shadow-2xl backdrop-blur-xs group">
              <img
                src={slide.imageUrl}
                alt={slide.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span className="font-medium text-[11px]">Factory Sealed & Tested</span>
                </div>
                <span className="font-mono text-[10px] text-slate-400">Authentic Retail</span>
              </div>
            </div>
          </div>
        </div>

        {/* Slide Indicators and navigation controls */}
        {activeSlides.length > 1 && (
          <div className="flex items-center justify-between pt-8 sm:pt-10 border-t border-slate-800/80 mt-10">
            <div className="flex items-center gap-2">
              {activeSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentSlideIndex
                      ? 'w-8 bg-brand-500'
                      : 'w-2 bg-slate-700 hover:bg-slate-500'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={prevSlide}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextSlide}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
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
