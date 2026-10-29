import React, { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Layers3, Package, Tag } from 'lucide-react';
import type { BrandDirectoryEntry } from './useBrandDirectory';
import { useBrandTransition, type PreparedBrand } from './useBrandTransition';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { formatPrice } from '../../lib/utils';
import './BrandDesktopShowcase.css';

const countLabel = (count: number) => `${count} ${count === 1 ? 'product' : 'products'}`;
const brandStyle = (brand: BrandDirectoryEntry): React.CSSProperties => ({ '--showcase-accent': brand.accentColor, '--showcase-highlight': brand.darkHoverColor } as React.CSSProperties);
const BrandLogo = memo(({ brand }: { brand: BrandDirectoryEntry }) => (
  <span aria-hidden="true" className="brand-showcase-logo" dangerouslySetInnerHTML={brand.logo ? { __html: brand.logo } : undefined}>{brand.logo ? undefined : brand.name}</span>
));

const BrandBackdrop = memo(({ prepared, incoming, serial, onFinish }: { prepared: PreparedBrand; incoming?: boolean; serial: number; onFinish: (serial: number) => void }) => (
  <div aria-hidden="true" className={`brand-showcase-backdrop ${incoming ? 'brand-showcase-backdrop-incoming' : ''}`} style={brandStyle(prepared.brand)} onAnimationEnd={event => { if (event.target === event.currentTarget && incoming) onFinish(serial); }}>
    <div className="brand-showcase-pattern" />
    {prepared.imageKind === 'hero' ? <img src={prepared.imageSrc} alt="" decoding="async" width={1920} height={1080} className="brand-showcase-background-image" /> : <>
      <div className="brand-showcase-watermark"><BrandLogo brand={prepared.brand} /></div>
      {prepared.imageSrc && <img src={prepared.imageSrc} alt="" decoding="async" width={1000} height={750} className="brand-showcase-product" />}
    </>}
  </div>
));

const BackgroundLayers = memo(({ current, previous, serial, onFinish }: { current: PreparedBrand; previous: PreparedBrand | null; serial: number; onFinish: (serial: number) => void }) => (
  <div className="brand-showcase-background-mask">
    {previous && <BrandBackdrop key={`out-${serial}`} prepared={previous} serial={serial} onFinish={onFinish} />}
    <BrandBackdrop key={serial} prepared={current} incoming serial={serial} onFinish={onFinish} />
    <div aria-hidden="true" className="brand-showcase-shade" />
  </div>
));

interface BrandCopy {
  brand: BrandDirectoryEntry;
  count: string;
  eyebrow: string;
  price?: string;
  href: string;
}

const BrandText = memo(({ copy, serial }: { copy: BrandCopy; serial: number }) => (
  <div className="brand-showcase-content" aria-live="polite" aria-atomic="true" style={brandStyle(copy.brand)}>
    <div key={serial}>
      {copy.eyebrow && <p className="brand-showcase-text brand-showcase-eyebrow">{copy.eyebrow}</p>}
      <h2 className="brand-showcase-text brand-showcase-title">{copy.brand.name}</h2>
      <p className="brand-showcase-text brand-showcase-tagline">{copy.brand.tagline}</p>
      <p className="brand-showcase-text brand-showcase-description">{copy.brand.description}</p>
      <div className="brand-showcase-text brand-showcase-pills">
        <span><Package aria-hidden="true" />{copy.count}</span>
        {copy.brand.categories.map(category => <span key={category}><Layers3 aria-hidden="true" />{category}</span>)}
        {copy.price && <span><Tag aria-hidden="true" />From {copy.price}</span>}
      </div>
      <div className="brand-showcase-text brand-showcase-action">
        {copy.brand.count ? <Link className="brand-showcase-browse" to={copy.href}>Browse {copy.brand.name}<ArrowRight aria-hidden="true" /></Link> : <span className="brand-showcase-coming-soon">Coming soon</span>}
      </div>
    </div>
  </div>
));

const RailCard = memo(({ brand, index, active, onSelect, onHover }: { brand: BrandDirectoryEntry; index: number; active: boolean; onSelect: (index: number) => void; onHover: (index: number) => void }) => {
  const [failed, setFailed] = useState(false);
  return (
    <div className="brand-showcase-card-entry" style={{ ...brandStyle(brand), '--showcase-card-delay': `${index * 60}ms` } as React.CSSProperties}>
      <button type="button" className="brand-showcase-card" aria-label={`${brand.count ? 'Shop' : 'Preview'} ${brand.name}, ${countLabel(brand.count)}`} aria-current={active ? 'true' : undefined} onMouseEnter={() => onHover(index)} onClick={() => onSelect(index)}>
        <span className="brand-showcase-card-visual">
          <span aria-hidden="true" className="brand-showcase-pattern" />
          {brand.cardSrc && !failed && <img src={brand.cardSrc} alt="" loading="lazy" decoding="async" width={600} height={800} className="brand-showcase-card-image" onError={() => setFailed(true)} />}
          <span className="brand-showcase-card-logo"><BrandLogo brand={brand} /></span>
          <span className="brand-showcase-card-caption"><strong>{brand.name}</strong><span>{countLabel(brand.count)}</span></span>
        </span>
      </button>
    </div>
  );
});

const BrandRail = memo(({ brands, index, reducedMotion, canHover, onSelect, onActivate }: { brands: BrandDirectoryEntry[]; index: number; reducedMotion: boolean; canHover: boolean; onSelect: (index: number) => void; onActivate: (index: number) => void }) => {
  const railRef = useRef<HTMLDivElement>(null);
  const scrollingRef = useRef(false);
  const activeRef = useRef(index);
  activeRef.current = index;
  const reveal = useCallback(() => {
    const rail = railRef.current;
    const card = rail?.children[activeRef.current] as HTMLElement | undefined;
    if (!rail || !card) return;
    const left = card.offsetLeft;
    const right = left + card.offsetWidth;
    const padding = 24;
    const visibleRight = rail.scrollLeft + rail.clientWidth - 80;
    const next = left < rail.scrollLeft + padding ? left - padding : right > visibleRight ? right - rail.clientWidth + 80 : rail.scrollLeft;
    if (Math.abs(next - rail.scrollLeft) < 1) return;
    scrollingRef.current = true;
    rail.style.scrollSnapType = 'none';
    rail.scrollTo({ left: next, behavior: reducedMotion ? 'instant' : 'smooth' });
  }, [reducedMotion]);
  useLayoutEffect(reveal, [index, reveal]);
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    let settle = 0;
    const restoreSnap = () => { scrollingRef.current = false; rail.style.scrollSnapType = ''; };
    const onScroll = () => { window.clearTimeout(settle); settle = window.setTimeout(restoreSnap, 150); };
    const observer = new ResizeObserver(reveal);
    observer.observe(rail);
    rail.addEventListener('scroll', onScroll, { passive: true });
    rail.addEventListener('scrollend', restoreSnap);
    return () => { observer.disconnect(); window.clearTimeout(settle); rail.removeEventListener('scroll', onScroll); rail.removeEventListener('scrollend', restoreSnap); };
  }, [reveal]);
  const hover = useCallback((next: number) => { if (canHover && !scrollingRef.current) onSelect(next); }, [canHover, onSelect]);
  return <div ref={railRef} className="brand-showcase-rail" role="group" aria-label="Choose a brand">{brands.map((brand, cardIndex) => <RailCard key={brand.id} brand={brand} index={cardIndex} active={cardIndex === index} onHover={hover} onSelect={onActivate} />)}</div>;
});

const BrandControls = memo(({ index, total, onPrevious, onNext }: { index: number; total: number; onPrevious: () => void; onNext: () => void }) => (
  <div className="brand-showcase-controls">
    <span className="brand-showcase-counter" aria-hidden="true"><span key={index}>{String(index + 1).padStart(2, '0')}</span><span>/ {String(total).padStart(2, '0')}</span></span>
    <button type="button" aria-label="Previous brand" onClick={onPrevious}><ArrowLeft aria-hidden="true" /></button>
    <button type="button" aria-label="Next brand" onClick={onNext}><ArrowRight aria-hidden="true" /></button>
  </div>
));

export const BrandDesktopShowcase: React.FC<{ brands: BrandDirectoryEntry[] }> = ({ brands }) => {
  const canHover = useMediaQuery('(hover: hover) and (pointer: fine)');
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const { view, select, step, finish } = useBrandTransition(brands, reducedMotion);
  const navigate = useNavigate();
  const copies = useMemo(() => brands.map(brand => ({ brand, count: countLabel(brand.count), eyebrow: brand.categories.join(' · '), price: brand.lowestPrice !== undefined ? formatPrice(brand.lowestPrice) : undefined, href: `/shop?brand=${encodeURIComponent(brand.id)}` })), [brands]);
  const index = Math.max(0, brands.findIndex(brand => brand.id === view.current?.brand.id));
  const currentRef = useRef(view.current);
  currentRef.current = view.current;
  const activate = useCallback((next: number) => {
    const brand = brands[next];
    if (brand?.id === currentRef.current?.brand.id && brand.count > 0) navigate(`/shop?brand=${encodeURIComponent(brand.id)}`);
    else select(next);
  }, [brands, navigate, select]);
  const previous = useCallback(() => step(-1), [step]);
  const next = useCallback(() => step(1), [step]);
  if (!view.current || !copies[index]) return <div className="min-h-screen bg-surface-50 p-8 text-slate-600 dark:bg-surface-900 dark:text-slate-300">No brands available yet.</div>;
  return (
    <div className="brand-showcase-page bg-surface-50 dark:bg-surface-900">
      <section className="brand-showcase" aria-label="Explore hardware brands" aria-describedby="brand-showcase-description" tabIndex={0} onKeyDown={event => {
        if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); event.currentTarget.focus({ preventScroll: true }); step(event.key === 'ArrowLeft' ? -1 : 1); }
      }}>
        <BackgroundLayers current={view.current} previous={view.previous} serial={view.serial} onFinish={finish} />
        <h1 className="sr-only">Shop by Brand</h1>
        <p id="brand-showcase-description" className="sr-only">Pick a manufacturer to browse its products.</p>
        <div className="brand-showcase-stage mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <BrandText copy={copies[index]} serial={view.serial} />
          <div className="brand-showcase-rail-column">
            <div className="brand-showcase-rail-header">
              <p className="brand-showcase-rail-label">Shop by Brand</p>
              <BrandControls index={index} total={brands.length} onPrevious={previous} onNext={next} />
            </div>
            <BrandRail brands={brands} index={index} reducedMotion={reducedMotion} canHover={canHover} onSelect={select} onActivate={activate} />
          </div>
        </div>
      </section>
    </div>
  );
};
