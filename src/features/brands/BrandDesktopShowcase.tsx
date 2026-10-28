import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Layers3, Package, Tag } from 'lucide-react';
import type { BrandDirectoryEntry } from './useBrandDirectory';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { formatPrice } from '../../lib/utils';
import './BrandDesktopShowcase.css';

const countLabel = (count: number) => `${count} ${count === 1 ? 'product' : 'products'}`;
const brandStyle = (brand: BrandDirectoryEntry): React.CSSProperties => ({
  '--showcase-accent': brand.accentColor,
  '--showcase-highlight': brand.darkHoverColor,
} as React.CSSProperties);

const BrandLogo: React.FC<{ brand: BrandDirectoryEntry }> = ({ brand }) => (
  <span aria-hidden="true" className="brand-showcase-logo" dangerouslySetInnerHTML={brand.logo ? { __html: brand.logo } : undefined}>{brand.logo ? undefined : brand.name}</span>
);

const BrandBackdrop: React.FC<{ brand: BrandDirectoryEntry; previous?: boolean }> = ({ brand, previous = false }) => {
  const [failedHero, setFailedHero] = useState(false);
  const [failedProduct, setFailedProduct] = useState(false);
  return (
    <div aria-hidden="true" className={`brand-showcase-backdrop ${previous ? 'brand-showcase-backdrop-previous' : ''}`} style={brandStyle(brand)}>
      <div className="brand-showcase-pattern" />
      {brand.heroSrc && !failedHero ? (
        <img src={brand.heroSrc} alt="" decoding="async" fetchPriority={previous ? 'low' : 'high'} className="brand-showcase-background-image" onError={() => setFailedHero(true)} />
      ) : (
        <>
          <div className="brand-showcase-watermark"><BrandLogo brand={brand} /></div>
          {brand.productImage && !failedProduct && <img src={brand.productImage} alt="" decoding="async" fetchPriority={previous ? 'low' : 'high'} className="brand-showcase-product" onError={() => setFailedProduct(true)} />}
        </>
      )}
    </div>
  );
};

const BrandRailImage: React.FC<{ brand: BrandDirectoryEntry }> = ({ brand }) => {
  const [failed, setFailed] = useState(false);
  return (
    <>
      <span aria-hidden="true" className="brand-showcase-pattern" />
      {brand.cardSrc && !failed && <img src={brand.cardSrc} alt="" loading="lazy" decoding="async" className="brand-showcase-card-image" onError={() => setFailed(true)} />}
      <span className="brand-showcase-card-logo"><BrandLogo brand={brand} /></span>
    </>
  );
};

export const BrandDesktopShowcase: React.FC<{ brands: BrandDirectoryEntry[] }> = ({ brands }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const canHover = useMediaQuery('(hover: hover) and (pointer: fine)');
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const navigate = useNavigate();
  const index = activeIndex < brands.length ? activeIndex : 0;
  const active = brands[index];

  const select = (next: number) => {
    if (!brands.length) return;
    const nextIndex = (next + brands.length) % brands.length;
    if (nextIndex === index) return;
    setPreviousIndex(reducedMotion ? null : index);
    setActiveIndex(nextIndex);
  };

  useEffect(() => {
    if (previousIndex === null) return;
    const timer = window.setTimeout(() => setPreviousIndex(null), reducedMotion ? 0 : 500);
    return () => window.clearTimeout(timer);
  }, [previousIndex, index, reducedMotion]);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const revealActive = () => {
      const card = rail.querySelector<HTMLButtonElement>('[aria-current="true"]');
      if (!card) return;
      const bounds = rail.getBoundingClientRect();
      const item = card.getBoundingClientRect();
      const delta = item.left < bounds.left + 20 ? item.left - bounds.left - 20 : item.right > bounds.right - 20 ? item.right - bounds.right + 20 : 0;
      if (delta) rail.scrollTo({ left: rail.scrollLeft + delta, behavior: reducedMotion ? 'instant' : 'smooth' });
    };
    revealActive();
    const observer = new ResizeObserver(revealActive);
    observer.observe(rail);
    return () => observer.disconnect();
  }, [index, reducedMotion]);

  if (!active) return <div className="min-h-screen bg-surface-50 p-8 text-slate-600 dark:bg-surface-900 dark:text-slate-300">No brands available yet.</div>;

  return (
    <div className="min-h-screen bg-surface-50 py-8 dark:bg-surface-900">
      <div className="mx-auto max-w-[1600px] px-6 xl:px-8">
        <div className="mb-7">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Shop by Brand</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Pick a manufacturer to browse its products.</p>
        </div>
        <section
          className="brand-showcase"
          aria-label="Explore hardware brands"
          tabIndex={0}
          style={brandStyle(active)}
          onKeyDown={event => {
            if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
              event.preventDefault();
              event.currentTarget.focus({ preventScroll: true });
              select(index + (event.key === 'ArrowLeft' ? -1 : 1));
            }
          }}
        >
          {(active.heroSrc || active.productImage) && <link rel="preload" as="image" href={active.heroSrc || active.productImage} />}
          {previousIndex !== null && brands[previousIndex] && <BrandBackdrop key={brands[previousIndex].id} brand={brands[previousIndex]} previous />}
          <BrandBackdrop key={active.id} brand={active} />
          <div aria-hidden="true" className="brand-showcase-shade" />
          <div className="brand-showcase-content" aria-live="polite" aria-atomic="true">
            <div key={active.id}>
              {active.categories.length > 0 && <p className="brand-showcase-text brand-showcase-eyebrow">{active.categories.join(' · ')}</p>}
              <h2 className="brand-showcase-text brand-showcase-title">{active.name}</h2>
              <p className="brand-showcase-text brand-showcase-tagline">{active.tagline}</p>
              <p className="brand-showcase-text brand-showcase-description">{active.description}</p>
              <div className="brand-showcase-text brand-showcase-pills">
                <span><Package aria-hidden="true" />{countLabel(active.count)}</span>
                {active.categories.map(category => <span key={category}><Layers3 aria-hidden="true" />{category}</span>)}
                {active.lowestPrice !== undefined && <span><Tag aria-hidden="true" />From {formatPrice(active.lowestPrice)}</span>}
              </div>
              <div className="brand-showcase-text brand-showcase-action">
                {active.count ? <Link className="brand-showcase-browse" to={`/shop?brand=${encodeURIComponent(active.id)}`}>Browse {active.name}<ArrowRight aria-hidden="true" /></Link> : <span className="brand-showcase-coming-soon">Coming soon</span>}
              </div>
            </div>
          </div>
          <div ref={railRef} className="brand-showcase-rail" role="group" aria-label="Choose a brand">
            {brands.map((brand, cardIndex) => (
              <div key={brand.id} className="brand-showcase-card-entry" style={{ ...brandStyle(brand), '--showcase-card-delay': `${cardIndex * 60}ms` } as React.CSSProperties}>
                <button
                  type="button"
                  className="brand-showcase-card"
                  aria-label={`${brand.count ? 'Shop' : 'Preview'} ${brand.name}, ${countLabel(brand.count)}`}
                  aria-current={cardIndex === index ? 'true' : undefined}
                  onMouseEnter={() => { if (canHover) select(cardIndex); }}
                  onClick={() => {
                    if (cardIndex === index && brand.count > 0) navigate(`/shop?brand=${encodeURIComponent(brand.id)}`);
                    else select(cardIndex);
                  }}
                >
                  <BrandRailImage brand={brand} />
                  <span className="brand-showcase-card-caption"><strong>{brand.name}</strong><span>{countLabel(brand.count)}</span></span>
                </button>
              </div>
            ))}
          </div>
          <div className="brand-showcase-controls">
            <span className="brand-showcase-counter" aria-hidden="true"><span key={active.id}>{String(index + 1).padStart(2, '0')}</span><span>/ {String(brands.length).padStart(2, '0')}</span></span>
            <button type="button" aria-label="Previous brand" onClick={() => select(index - 1)}><ArrowLeft aria-hidden="true" /></button>
            <button type="button" aria-label="Next brand" onClick={() => select(index + 1)}><ArrowRight aria-hidden="true" /></button>
          </div>
        </section>
      </div>
    </div>
  );
};
