import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { DEFAULT_HOMEPAGE_CONFIG } from '../../data/mockData';
import { useStore } from '../../context/StoreContext';

const defaultCampaign = {
  title: 'ComputerShop — hardware for your next build',
  description: 'Explore laptops, components, displays and accessories for work and play.',
  ctaLabel: 'Explore the store',
  ctaUrl: '/shop',
};

export const HeroBanner: React.FC = () => {
  const { homepageConfig } = useStore();
  const slides = useMemo(
    () => [...(homepageConfig.heroSlides || [])].filter(slide => slide.isActive).sort((a, b) => a.sortOrder - b.sortOrder),
    [homepageConfig.heroSlides]
  );
  const [activeId, setActiveId] = useState<string | null>(slides[0]?.id ?? null);
  const [interacting, setInteracting] = useState(false);
  const [manuallyPaused, setManuallyPaused] = useState(false);
  const [tabHidden, setTabHidden] = useState(document.visibilityState === 'hidden');
  const [imageFailedId, setImageFailedId] = useState<string | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const paused = interacting || manuallyPaused;
  const activeIndex = Math.max(0, slides.findIndex(slide => slide.id === activeId));
  const slide = slides[activeIndex];
  const isFallback = !slide;
  const fallbackSlide = DEFAULT_HOMEPAGE_CONFIG.heroSlides[0];
  const content = slide || {
    ...fallbackSlide,
    ...defaultCampaign,
    eyebrow: 'COMPUTERSHOP',
    imageUrl: '',
    imagePosition: 'center center',
    textPosition: 'left' as const,
  };

  useEffect(() => {
    if (!slides.length) {
      setActiveId(null);
      return;
    }
    if (!slides.some(item => item.id === activeId)) setActiveId(slides[0].id);
  }, [slides, activeId]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const update = () => setTabHidden(document.visibilityState === 'hidden');
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);

  const interval = Math.max(2000, Math.min(30000, homepageConfig.heroIntervalMs || 7000));
  useEffect(() => {
    if (slides.length <= 1 || paused || tabHidden || reducedMotion) return;
    const timer = window.setInterval(() => {
      setActiveId(current => {
        const index = slides.findIndex(item => item.id === current);
        return slides[(index + 1 + slides.length) % slides.length].id;
      });
    }, interval);
    return () => window.clearInterval(timer);
  }, [slides, paused, tabHidden, reducedMotion, interval]);

  const move = (direction: -1 | 1) => {
    if (slides.length < 2) return;
    const index = slides.findIndex(item => item.id === activeId);
    setActiveId(slides[(index + direction + slides.length) % slides.length].id);
  };
  const isInternalUrl = content.ctaUrl.startsWith('/');
  const ctaClassName = 'inline-flex items-center justify-center rounded-lg border border-blue-700 bg-blue-600 px-5 py-2.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950';
  const cta = isInternalUrl ? (
    <Link to={content.ctaUrl} className={ctaClassName}>
      {content.ctaLabel}<ArrowRight className="ml-2 h-4 w-4" />
    </Link>
  ) : (
    <a href={content.ctaUrl} target="_blank" rel="noreferrer" className={ctaClassName}>
      {content.ctaLabel}<ArrowRight className="ml-2 h-4 w-4" />
    </a>
  );

  const textOnRight = content.textPosition === 'right';
  const failed = Boolean(content.imageUrl) && imageFailedId === content.id;

  return (
    <section className="w-full bg-white/55 px-3 py-4 transition-colors dark:bg-slate-950/45 sm:px-5 sm:py-5 lg:px-8 lg:py-6">
      <div
        className="relative mx-auto h-[min(78vw,340px)] min-h-[390px] max-h-[460px] w-full max-w-[1440px] overflow-hidden rounded-xl bg-slate-100 shadow-sm dark:bg-slate-900 sm:h-[380px] sm:min-h-[280px] lg:h-[min(34vw,440px)]"
        onMouseEnter={() => setInteracting(true)}
        onMouseLeave={() => setInteracting(false)}
        onFocusCapture={() => setInteracting(true)}
        onBlurCapture={event => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setInteracting(false);
        }}
        aria-roledescription="carousel"
        aria-label="Promotional campaigns"
      >
        {content.imageUrl && !failed ? (
          <picture>
            {content.mobileImageUrl && <source media="(max-width: 639px)" srcSet={content.mobileImageUrl} />}
            <img
              key={content.id}
              src={content.imageUrl}
              alt={content.imageAlt || content.title}
              className={`absolute inset-0 h-full w-full object-cover ${!reducedMotion ? 'animate-fade-in' : ''}`}
              style={{ objectPosition: content.imagePosition || 'center center' }}
              onError={() => setImageFailedId(content.id)}
              ref={image => image?.setAttribute('fetchpriority', activeIndex === 0 ? 'high' : 'auto')}
            />
          </picture>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-blue-50 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-950" aria-hidden="true">
            <div className={`absolute inset-y-0 ${textOnRight ? 'left-0' : 'right-0'} hidden w-1/3 items-center justify-center text-7xl font-black tracking-tighter text-blue-600/10 sm:flex dark:text-blue-300/10`}>CS</div>
          </div>
        )}
        {content.imageUrl && !failed && (
          <div
            className={`absolute inset-0 ${textOnRight
              ? 'bg-gradient-to-l from-white via-white/95 to-white/10 dark:from-slate-950 dark:via-slate-950/90 dark:to-slate-950/10'
              : 'bg-gradient-to-r from-white via-white/95 to-white/10 dark:from-slate-950 dark:via-slate-950/90 dark:to-slate-950/10'}`}
            aria-hidden="true"
          />
        )}

          <div className={`relative z-10 flex h-full items-center px-6 pt-8 pb-16 sm:px-10 sm:py-10 lg:px-16 ${textOnRight ? 'justify-end text-right' : 'justify-start text-left'}`}>
          <div key={content.id} className={`w-full max-w-[540px] ${textOnRight ? 'ml-auto' : ''} ${!reducedMotion && !isFallback ? 'animate-fade-in' : ''}`}>
            {content.eyebrow && <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-blue-700 dark:text-blue-300">{content.eyebrow}</p>}
            <h1 className="max-w-[18ch] text-3xl font-bold leading-[1.08] tracking-tight text-slate-950 dark:text-white sm:text-4xl lg:text-5xl">{content.title}</h1>
            <p className={`mt-4 max-w-[48ch] text-sm leading-relaxed text-slate-700 dark:text-slate-300 sm:text-base ${textOnRight ? 'ml-auto' : ''}`}>{content.description}</p>
            <div className="mt-6">{cta}</div>
          </div>
        </div>

        {slides.length > 1 && (
          <div className="pointer-events-none absolute inset-x-4 bottom-4 z-20 flex items-center justify-between sm:inset-x-8 sm:bottom-6">
            <div className="pointer-events-auto flex items-center gap-2" role="group" aria-label="Choose promotional slide">
              {slides.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveId(item.id)}
                  aria-label={`Show slide ${index + 1}: ${item.title}`}
                  aria-current={item.id === content.id ? 'true' : undefined}
                  className={`h-2.5 rounded-full ring-1 ring-slate-500/30 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 ${item.id === content.id ? 'w-7 bg-blue-600' : 'w-2.5 bg-white/80 hover:bg-blue-200'}`}
                />
              ))}
            </div>
            <div className="pointer-events-auto flex items-center gap-2">
              <button type="button" onClick={() => setManuallyPaused(value => !value)} aria-label={manuallyPaused ? 'Resume automatic slide rotation' : 'Pause automatic slide rotation'} className="rounded-full border border-slate-300 bg-white/90 p-2 text-slate-700 shadow-sm transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-slate-700 dark:bg-slate-900/90 dark:text-white">
                {manuallyPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </button>
              <button type="button" onClick={() => move(-1)} aria-label="Previous promotional slide" className="rounded-full border border-slate-300 bg-white/90 p-2 text-slate-700 shadow-sm transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-slate-700 dark:bg-slate-900/90 dark:text-white"><ChevronLeft className="h-4 w-4" /></button>
              <button type="button" onClick={() => move(1)} aria-label="Next promotional slide" className="rounded-full border border-slate-300 bg-white/90 p-2 text-slate-700 shadow-sm transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-slate-700 dark:bg-slate-900/90 dark:text-white"><ChevronRight className="h-4 w-4" /></button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
