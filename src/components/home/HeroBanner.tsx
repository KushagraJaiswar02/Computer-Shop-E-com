import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, ChevronLeft, ChevronRight, Pause, Play, Sparkles, Tag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatPrice } from '../../lib/utils';
import type { HeroMode, HeroSlide } from '../../types';

const heroModes: { id: HeroMode; label: string }[] = [
  { id: 'hot_deals', label: 'Hot Deals' },
  { id: 'brands', label: 'Brands' },
  { id: 'new_arrivals', label: 'New Arrivals' },
];

export const HeroBanner: React.FC = () => {
  const { homepageConfig, products, brands } = useStore();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [interacting, setInteracting] = useState(false);
  const [manuallyPaused, setManuallyPaused] = useState(false);
  const [tabHidden, setTabHidden] = useState(document.visibilityState === 'hidden');
  const [reducedMotion, setReducedMotion] = useState(false);
  const [failedImages, setFailedImages] = useState<string[]>([]);

  const configuredSlides = useMemo(
    () => [...(homepageConfig.heroSlides || [])]
      .filter(slide => slide.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder),
    [homepageConfig.heroSlides]
  );

  const dealIds = new Set(homepageConfig.dealProductIds || []);
  const dealProduct = products.find(product =>
    (dealIds.has(product.id) || product.isDeal) &&
    product.originalPrice !== undefined && product.originalPrice > product.price &&
    product.discountPercent !== undefined && product.discountPercent > 0
  );
  const brand = brands[0];
  const brandProduct = brand ? products.find(product => product.brandId === brand.id) : undefined;
  const datedProducts = [...products].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const arrivalProduct = datedProducts.find(product => product.isNewArrival) || datedProducts[0];

  const modeData: Record<HeroMode, {
    eyebrow: string;
    title: string;
    description: string;
    ctaLabel: string;
    ctaUrl: string;
    imageUrl: string;
    imageAlt: string;
    imagePosition: string;
    textPosition: 'left' | 'right';
  }> = {
    hot_deals: {
      eyebrow: 'HOT DEALS',
      title: 'Offers on selected computer hardware',
      description: 'Browse current catalog offers on components, systems, and accessories.',
      ctaLabel: 'Browse deals',
      ctaUrl: '/shop?deal=true',
      imageUrl: dealProduct?.images[0] || '',
      imageAlt: dealProduct?.name || 'Computer hardware from the deals collection',
      imagePosition: 'center center',
      textPosition: 'left',
    },
    brands: {
      eyebrow: 'SHOP BY BRAND',
      title: brand ? `Explore ${brand.name} hardware` : 'Explore hardware brands',
      description: brand?.description || 'Browse the manufacturers represented in the current ComputerShop catalog.',
      ctaLabel: brand ? `Shop ${brand.name}` : 'Browse brands',
      ctaUrl: brand ? `/brand/${brand.id}` : '/brands',
      imageUrl: brandProduct?.images[0] || '',
      imageAlt: brandProduct?.name || 'Computer hardware from a catalog-listed brand',
      imagePosition: 'center center',
      textPosition: 'left',
    },
    new_arrivals: {
      eyebrow: 'NEW ARRIVALS',
      title: arrivalProduct?.name || 'Recently added computer hardware',
      description: arrivalProduct?.shortDescription || 'See the newest products marked in the ComputerShop catalog.',
      ctaLabel: arrivalProduct ? 'View product' : 'View new arrivals',
      ctaUrl: arrivalProduct ? `/product/${arrivalProduct.slug}` : '/shop?sort=newest',
      imageUrl: arrivalProduct?.images[0] || '',
      imageAlt: arrivalProduct?.name || 'Recently added hardware from the current catalog',
      imagePosition: 'center center',
      textPosition: 'left',
    },
  };

  const fallbackSlides = heroModes
    .filter(mode => !configuredSlides.some(slide => slide.heroMode === mode.id))
    .map((mode, index): HeroSlide => ({
      id: `catalog-${mode.id}`,
      heroMode: mode.id,
      title: modeData[mode.id].title,
      description: modeData[mode.id].description,
      eyebrow: modeData[mode.id].eyebrow,
      imageUrl: modeData[mode.id].imageUrl,
      imageAlt: modeData[mode.id].imageAlt,
      imagePosition: 'center center',
      textPosition: 'left',
      ctaLabel: modeData[mode.id].ctaLabel,
      ctaUrl: modeData[mode.id].ctaUrl,
      isActive: true,
      sortOrder: configuredSlides.length + index,
    }));
  const slides = [...configuredSlides, ...fallbackSlides];

  const activeIndex = Math.max(0, slides.findIndex(slide => slide.id === activeId));
  const slide = slides[activeIndex] || slides[0];
  const activeMode = slide?.heroMode || heroModes[0].id;
  const activeModeData = modeData[activeMode] || modeData.hot_deals;
  const content = slide ? {
    ...activeModeData,
    ...(slide.useCustomCopy ? {
      title: slide.title,
      description: slide.description,
      eyebrow: slide.eyebrow,
      ctaLabel: slide.ctaLabel,
      ctaUrl: slide.ctaUrl,
    } : {}),
    imageUrl: slide.useCustomImage ? slide.imageUrl || activeModeData.imageUrl : activeModeData.imageUrl || slide.imageUrl,
    imageAlt: slide.useCustomImage ? slide.imageAlt || slide.title : activeModeData.imageAlt || slide.imageAlt,
    imagePosition: slide.useCustomImage ? slide.imagePosition || 'center center' : activeModeData.imagePosition,
    textPosition: slide.textPosition || 'left',
  } : modeData.hot_deals;
  const imageFailed = slide ? failedImages.includes(slide.id) : false;
  const imageUrl = content.imageUrl || activeModeData.imageUrl;
  const showImage = Boolean(imageUrl) && !imageFailed;
  const paused = interacting || manuallyPaused;

  useEffect(() => {
    if (!slides.length) return;
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

  const selectMode = (mode: HeroMode) => {
    const index = slides.findIndex(item => item.heroMode === mode);
    if (index >= 0) setActiveId(slides[index].id);
  };
  const move = (direction: -1 | 1) => {
    if (slides.length < 2) return;
    setActiveId(slides[(activeIndex + direction + slides.length) % slides.length].id);
  };
  const isInternalUrl = content.ctaUrl.startsWith('/');
  const ctaClassName = 'inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950';
  const cta = isInternalUrl ? (
    <Link to={content.ctaUrl} className={ctaClassName}>{content.ctaLabel}<ArrowRight className="ml-2 h-4 w-4" /></Link>
  ) : (
    <a href={content.ctaUrl} target="_blank" rel="noreferrer" className={ctaClassName}>{content.ctaLabel}<ArrowRight className="ml-2 h-4 w-4" /></a>
  );

  const dealIdsWithFlags = new Set([...(homepageConfig.dealProductIds || []), ...products.filter(product => product.isDeal).map(product => product.id)]);
  const validDeals = products.filter(product =>
    dealIdsWithFlags.has(product.id) && product.originalPrice !== undefined &&
    product.originalPrice > product.price && product.discountPercent !== undefined && product.discountPercent > 0
  );
  const brandNames = brands.slice(0, 4).map(item => item.name).join(' · ');
  const modeHighlight = activeMode === 'hot_deals' && dealProduct ? (
    <div className="mt-5 border-l-2 border-blue-600 pl-3">
      <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300"><Tag className="h-3 w-3" />{validDeals.length} catalog offers</span>
      <span className="mt-1 block line-clamp-1 text-xs font-semibold text-slate-800 dark:text-slate-100">{dealProduct.name}</span>
      <span className="mt-1 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300"><strong className="font-mono text-slate-950 dark:text-white">{formatPrice(dealProduct.price)}</strong>{dealProduct.originalPrice !== undefined && <del className="text-slate-400">{formatPrice(dealProduct.originalPrice)}</del>}</span>
    </div>
  ) : activeMode === 'brands' ? (
    <div className="mt-5 border-l-2 border-blue-600 pl-3">
      <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300"><Building2 className="h-3 w-3" />{brands.length} catalog brands</span>
      <span className="mt-1 block line-clamp-1 text-xs font-semibold text-slate-700 dark:text-slate-200">{brandNames}</span>
    </div>
  ) : activeMode === 'new_arrivals' && arrivalProduct ? (
    <div className="mt-5 border-l-2 border-blue-600 pl-3">
      <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300"><Sparkles className="h-3 w-3" />Recently added</span>
      <span className="mt-1 block line-clamp-1 text-xs font-semibold text-slate-800 dark:text-slate-100">{arrivalProduct.brandName} · {formatPrice(arrivalProduct.price)}</span>
    </div>
  ) : null;

  return (
    <section className="relative w-full overflow-hidden border-b border-slate-200/80 bg-white/70 transition-colors dark:border-slate-800/80 dark:bg-slate-950/55">
      <div className="relative isolate mx-auto min-h-[500px] max-w-[1440px] overflow-hidden sm:min-h-[480px] lg:min-h-[520px]">
        {showImage ? (
          <div className="pointer-events-none absolute inset-y-0 right-0 z-0 w-[46%] sm:w-[48%] lg:w-[51%]">
            <picture className="block h-full w-full">
              {slide?.useCustomImage && slide.mobileImageUrl && <source media="(max-width: 639px)" srcSet={slide.mobileImageUrl} />}
              <img
                key={`${slide?.id}-${imageUrl}`}
                src={imageUrl}
                alt={content.imageAlt || content.title}
                className={`h-full w-full object-cover ${!reducedMotion ? 'animate-fade-in' : ''}`}
                style={{ objectPosition: content.imagePosition || 'center center' }}
                onError={() => slide && setFailedImages(items => items.includes(slide.id) ? items : [...items, slide.id])}
                ref={image => image?.setAttribute('fetchpriority', activeIndex === 0 ? 'high' : 'auto')}
              />
            </picture>
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/70 to-white/5 dark:from-slate-950 dark:via-slate-950/70 dark:to-slate-950/10" />
          </div>
        ) : (
          <div className="pointer-events-none absolute inset-y-0 right-0 z-0 hidden w-1/2 items-center justify-center text-8xl font-black tracking-tighter text-blue-600/10 dark:text-blue-300/10 sm:flex" aria-hidden="true">CS</div>
        )}

        <div
          className="relative z-10 grid min-h-[500px] grid-rows-[auto_1fr_auto] sm:min-h-[480px] lg:min-h-[520px] lg:grid-cols-[176px_minmax(0,1fr)] lg:grid-rows-1"
          onMouseEnter={() => setInteracting(true)}
          onMouseLeave={() => setInteracting(false)}
          onFocusCapture={() => setInteracting(true)}
          onBlurCapture={event => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setInteracting(false);
          }}
          aria-roledescription="carousel"
          aria-label="Store promotions"
        >
          <nav aria-label="Hero collections" role="tablist" className="grid grid-cols-3 gap-1 px-2 pt-4 sm:px-6 lg:flex lg:flex-col lg:justify-center lg:gap-1 lg:px-5 lg:py-12">
            {heroModes.map((mode, index) => {
              const selected = mode.id === activeMode;
              const Icon = index === 0 ? Tag : index === 1 ? Building2 : Sparkles;
              return (
                <button
                  key={mode.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => selectMode(mode.id)}
                  className={`inline-flex min-h-10 min-w-0 items-center justify-center gap-1 whitespace-nowrap rounded-md px-1 text-[10px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 sm:gap-2 sm:px-3 sm:text-xs lg:min-h-11 lg:justify-start ${selected ? 'bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-200' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800/70 dark:hover:text-white'}`}
                >
                  <Icon className={`h-4 w-4 ${selected ? 'text-blue-600 dark:text-blue-300' : 'text-slate-400'}`} aria-hidden="true" />
                  {mode.label}
                </button>
              );
            })}
          </nav>

          <div className={`relative flex min-w-0 items-center px-5 pb-14 pt-8 sm:px-8 lg:px-8 lg:pb-20 lg:pt-16 ${content.textPosition === 'right' ? 'justify-end text-right' : 'justify-start text-left'}`}>
            <div key={slide?.id} className={`w-full max-w-[74%] sm:max-w-[68%] lg:max-w-[37rem] ${content.textPosition === 'right' ? 'ml-auto' : ''} ${!reducedMotion ? 'animate-fade-in' : ''}`}>
              {content.eyebrow && <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-700 dark:text-blue-300 sm:text-xs">{content.eyebrow}</p>}
              <h1 className="max-w-[19ch] text-3xl font-bold leading-[1.06] tracking-tight text-slate-950 dark:text-white sm:text-4xl lg:text-5xl">{content.title}</h1>
              <p className={`mt-4 max-w-[46ch] text-sm leading-relaxed text-slate-700 dark:text-slate-300 sm:text-base ${content.textPosition === 'right' ? 'ml-auto' : ''}`}>{content.description}</p>
              {modeHighlight}
              <div className="mt-6">{cta}</div>
            </div>
          </div>

          {slides.length > 1 && (
            <div className="absolute inset-x-4 bottom-3 z-20 flex items-center justify-between gap-3 sm:inset-x-6 sm:bottom-5 lg:bottom-6 lg:left-[176px] lg:right-8">
              <div className="flex items-center gap-1.5" role="group" aria-label="Choose promotional slide">
                {slides.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveId(item.id)}
                    aria-label={`Show ${heroModes.find(mode => mode.id === item.heroMode)?.label || 'promotion'} slide ${index + 1}`}
                    aria-current={index === activeIndex ? 'true' : undefined}
                    className={`h-2.5 rounded-full ring-1 ring-slate-500/30 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 ${index === activeIndex ? 'w-7 bg-blue-600' : 'w-2.5 bg-slate-400/70 hover:bg-blue-400'}`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-1.5">
                <button type="button" onClick={() => setManuallyPaused(value => !value)} aria-label={manuallyPaused ? 'Resume automatic slide rotation' : 'Pause automatic slide rotation'} className="rounded-full border border-slate-300 bg-white/90 p-2 text-slate-700 shadow-sm transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-slate-700 dark:bg-slate-900/90 dark:text-white">
                  {manuallyPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                </button>
                <button type="button" onClick={() => move(-1)} aria-label="Previous promotion" className="rounded-full border border-slate-300 bg-white/90 p-2 text-slate-700 shadow-sm transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-slate-700 dark:bg-slate-900/90 dark:text-white"><ChevronLeft className="h-4 w-4" /></button>
                <button type="button" onClick={() => move(1)} aria-label="Next promotion" className="rounded-full border border-slate-300 bg-white/90 p-2 text-slate-700 shadow-sm transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-slate-700 dark:bg-slate-900/90 dark:text-white"><ChevronRight className="h-4 w-4" /></button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
