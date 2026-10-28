import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, ChevronLeft, ChevronRight, Pause, Play, Sparkles, Tag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatPrice } from '../../lib/utils';
import type { HeroMode, HeroSlide } from '../../types';

const heroModes: { id: HeroMode; label: string; to: string }[] = [
  { id: 'hot_deals', label: 'Hot Deals', to: '/shop?deal=true' },
  { id: 'brands', label: 'Brands', to: '/brands' },
  { id: 'new_arrivals', label: 'New Arrivals', to: '/shop?sort=newest' },
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
    <div className="mt-3 border-l-2 border-blue-600 pl-3">
      <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300"><Tag className="h-3 w-3" />{validDeals.length} catalog offers</span>
      <span className="mt-1 block line-clamp-1 text-xs font-semibold text-slate-800 dark:text-slate-100">{dealProduct.name}</span>
      <span className="mt-1 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300"><strong className="font-mono text-slate-950 dark:text-white">{formatPrice(dealProduct.price)}</strong>{dealProduct.originalPrice !== undefined && <del className="text-slate-400">{formatPrice(dealProduct.originalPrice)}</del>}</span>
    </div>
  ) : activeMode === 'brands' ? (
    <div className="mt-3 border-l-2 border-blue-600 pl-3">
      <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300"><Building2 className="h-3 w-3" />{brands.length} catalog brands</span>
      <span className="mt-1 block line-clamp-1 text-xs font-semibold text-slate-700 dark:text-slate-200">{brandNames}</span>
    </div>
  ) : activeMode === 'new_arrivals' && arrivalProduct ? (
    <div className="mt-3 border-l-2 border-blue-600 pl-3">
      <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300"><Sparkles className="h-3 w-3" />Recently added</span>
      <span className="mt-1 block line-clamp-1 text-xs font-semibold text-slate-800 dark:text-slate-100">{arrivalProduct.brandName} · {formatPrice(arrivalProduct.price)}</span>
    </div>
  ) : null;

  return (
    <section className="relative w-full overflow-hidden border-b border-slate-200/80 bg-white/70 pt-4 transition-colors dark:border-slate-800/80 dark:bg-slate-950/55 sm:pt-6">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-white/95 to-transparent dark:from-slate-900/95" />
      <div className="w-full px-4 sm:px-6 lg:pl-4 lg:pr-0">
        <div className="grid min-w-0 lg:grid-cols-[176px_minmax(0,1fr)]">
          <nav aria-label="Hero collections" className="border-b border-slate-200 py-3 dark:border-slate-800 lg:flex lg:flex-col lg:justify-center lg:border-b-0 lg:border-r lg:py-8 lg:pr-4">
            <p className="mb-3 hidden px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400 lg:block">Explore the store</p>
            <div className="grid grid-cols-3 gap-1 lg:grid-cols-1 lg:gap-2">
              {heroModes.map((mode, index) => {
                const Icon = index === 0 ? Tag : index === 1 ? Building2 : Sparkles;
                return (
                  <Link key={mode.id} to={mode.to} className="group inline-flex min-h-11 min-w-0 items-center justify-center gap-1.5 rounded-lg px-1 text-[11px] font-semibold text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-slate-200 dark:hover:bg-blue-950/60 dark:hover:text-blue-200 sm:gap-2 sm:px-3 sm:text-xs lg:justify-start">
                    <Icon className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                    <span>{mode.label}</span>
                    <ChevronRight className="ml-auto hidden h-3.5 w-3.5 text-slate-400 group-hover:text-blue-600 lg:block" aria-hidden="true" />
                  </Link>
                );
              })}
            </div>
          </nav>
          <div
            className={`relative isolate grid min-w-0 grid-cols-1 pb-16 sm:min-h-[400px] sm:pb-0 ${content.textPosition === 'right' ? 'sm:grid-cols-[minmax(0,55fr)_minmax(0,45fr)] lg:grid-cols-[minmax(0,60fr)_minmax(0,40fr)]' : 'sm:grid-cols-[minmax(0,45fr)_minmax(0,55fr)] lg:grid-cols-[minmax(0,40fr)_minmax(0,60fr)]'}`}
            onMouseEnter={() => setInteracting(true)}
            onMouseLeave={() => setInteracting(false)}
            onFocusCapture={() => setInteracting(true)}
            onBlurCapture={event => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setInteracting(false);
            }}
            aria-roledescription="carousel"
            aria-label="Store promotions"
          >
            <div className={`relative z-10 flex min-w-0 items-center py-8 sm:px-5 sm:pb-16 sm:pt-6 lg:px-6 ${content.textPosition === 'right' ? 'sm:col-start-2 sm:row-start-1 justify-end text-right' : 'justify-start text-left'}`}>
              <div key={slide?.id} className={`w-full max-w-[30rem] ${content.textPosition === 'right' ? 'ml-auto' : ''} ${!reducedMotion ? 'animate-fade-in' : ''}`}>
                {content.eyebrow && <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-700 dark:text-blue-300 sm:text-xs">{content.eyebrow}</p>}
                <h1 className="max-w-[19ch] text-3xl font-bold leading-[1.06] tracking-tight text-slate-950 dark:text-white xl:text-[32px]">{content.title}</h1>
                <p className={`mt-3 max-w-[46ch] text-sm leading-relaxed text-slate-700 dark:text-slate-300 ${content.textPosition === 'right' ? 'ml-auto' : ''}`}>{content.description}</p>
                {modeHighlight}
                <div className="mt-4">{cta}</div>
              </div>
            </div>

            {showImage ? (
              <div className={`relative min-w-0 overflow-hidden sm:overflow-visible ${content.textPosition === 'right' ? 'sm:col-start-1 sm:row-start-1' : ''}`}>
                <picture className={`pointer-events-none block h-48 w-full sm:absolute sm:inset-y-0 sm:h-full sm:w-[125%] sm:[mask-composite:intersect] ${content.textPosition === 'right' ? 'sm:left-0 sm:[mask-image:linear-gradient(to_bottom,transparent,black_24px),linear-gradient(to_left,transparent,rgba(0,0,0,0.04)_15%,rgba(0,0,0,0.25)_30%,rgba(0,0,0,0.65)_45%,black_60%)]' : 'sm:right-0 sm:[mask-image:linear-gradient(to_bottom,transparent,black_24px),linear-gradient(to_right,transparent,rgba(0,0,0,0.04)_15%,rgba(0,0,0,0.25)_30%,rgba(0,0,0,0.65)_45%,black_60%)]'}`}>
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
              </div>
            ) : (
              <div className={`hidden items-center justify-center text-8xl font-black tracking-tighter text-blue-600/10 dark:text-blue-300/10 sm:flex ${content.textPosition === 'right' ? 'sm:col-start-1 sm:row-start-1' : ''}`} aria-hidden="true">CS</div>
            )}

            {slides.length > 1 && (
              <div className="absolute inset-x-0 bottom-3 z-20 flex items-center justify-between gap-3 pr-12 sm:bottom-4 sm:left-6 sm:pr-3 lg:left-8">
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
      </div>
    </section>
  );
};
