import React, { memo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, ChevronDown, Layers3, Package, ShoppingCart, Tag } from 'lucide-react';
import type { Product } from '../../types';
import type { BrandDirectoryEntry } from './useBrandDirectory';
import { BrandHero } from './BrandHero';
import { useStore } from '../../context/StoreContext';
import { formatPrice } from '../../lib/utils';
import { getBrandHref } from '../catalog/seriesUtils';

const hoverQuery = '(hover: hover) and (pointer: fine)';

const MobileBrandProductCard = memo(({ product, expanded, onAddToCart }: { product: Product; expanded: boolean; onAddToCart: (product: Product, quantity?: number) => void }) => {
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="flex flex-col rounded-xl border border-border bg-surface p-3 shadow-xs dark:border-border dark:bg-surface-elevated">
      <Link
        to={`/product/${product.slug}`}
        tabIndex={expanded ? 0 : -1}
        className="flex h-28 w-full items-center justify-center rounded-lg bg-surface-soft p-2 dark:bg-background/50"
      >
        <img
          src={product.images[0]}
          alt={product.name}
          className="max-h-full max-w-full object-contain"
          loading="lazy"
        />
      </Link>
      <div className="mt-2.5 flex flex-1 flex-col justify-between">
        <Link
          to={`/product/${product.slug}`}
          tabIndex={expanded ? 0 : -1}
          className="line-clamp-2 text-xs font-semibold text-main hover:text-accent dark:text-main dark:hover:text-accent"
          title={product.name}
        >
          {product.name}
        </Link>
        <div className="mt-3 flex items-center justify-between gap-2 border-t border-border pt-2 dark:border-border/60">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-main dark:text-main price">{formatPrice(product.price)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[10px] text-muted line-through price">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
          <button
            type="button"
            tabIndex={expanded ? 0 : -1}
            onClick={handleAdd}
            className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
              added
                ? 'bg-success text-on-primary'
                : 'bg-primary text-on-primary hover:bg-primary-hover dark:bg-primary dark:hover:bg-primary-hover'
            }`}
            aria-label={`Add ${product.name} to cart`}
          >
            {added ? (
              <>
                <Check className="h-3 w-3" aria-hidden="true" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingCart className="h-3 w-3" aria-hidden="true" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
});

export const BrandAccordion: React.FC<{ brands: BrandDirectoryEntry[] }> = ({ brands }) => {
  const { addToCart } = useStore();
  const [activeId, setActiveId] = useState<string | null>(() => brands[0]?.id || null);
  const [canHover, setCanHover] = useState(() => window.matchMedia(hoverQuery).matches);

  useEffect(() => {
    const media = window.matchMedia(hoverQuery);
    const update = () => setCanHover(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return (
    <div className="min-h-screen bg-background py-8 dark:bg-background sm:py-10">
      <div className="shop-container ">
        <div className="mb-7 sm:mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-main dark:text-main">Shop by Brand</h1>
          <p className="mt-2 text-sm text-muted dark:text-muted">Pick a manufacturer to browse its products.</p>
        </div>
        <div className="space-y-3 sm:space-y-4">
          {brands.map((brand, index) => {
            const expanded = activeId === brand.id;
            const empty = brand.count === 0;
            const headerId = `brand-header-${encodeURIComponent(brand.id)}`;
            const panelId = `brand-panel-${encodeURIComponent(brand.id)}`;
            const browseUrl = getBrandHref(brand);
            const countLabel = `${brand.count} ${brand.count === 1 ? 'product' : 'products'}`;
            const headerClass = 'brand-directory-header grid h-24 w-full grid-cols-[4rem_minmax(0,1fr)_1rem] items-center gap-3 rounded-2xl px-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 dark:focus-visible:ring-offset-surface sm:h-28 sm:grid-cols-[5rem_minmax(0,1fr)_1.25rem] sm:gap-5 sm:px-6';
            const headerContent = (
              <>
                <span aria-hidden="true" className="brand-directory-logo flex h-16 w-16 items-center justify-center rounded-2xl bg-surface p-3 sm:h-20 sm:w-20 sm:p-3.5">
                  {brand.logo ? <span className="block h-full w-full" dangerouslySetInnerHTML={{ __html: brand.logo }} /> : <span className="text-center text-xs font-bold leading-tight">{brand.name}</span>}
                </span>
                <span className="flex min-w-0 flex-col items-start gap-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                  <span className={`text-base font-bold leading-tight sm:text-lg ${empty ? 'text-muted dark:text-muted' : 'text-main dark:text-main'}`}>{brand.name}</span>
                  <span className="shrink-0 rounded-full bg-surface-soft px-2.5 py-1 text-[10px] font-semibold text-muted dark:bg-surface-elevated dark:text-muted sm:text-xs">{countLabel}</span>
                </span>
                <ChevronDown aria-hidden="true" className="brand-directory-chevron h-4 w-4 text-muted sm:h-5 sm:w-5" />
              </>
            );

            return (
              <article
                key={brand.id}
                className={`brand-directory-card rounded-2xl border ${empty ? 'brand-directory-empty' : ''}`}
                data-expanded={expanded}
                style={{ '--directory-brand-color': brand.hoverColor, '--directory-accent-color': brand.accentColor, '--directory-accent-dark': brand.darkHoverColor, '--directory-entry-delay': `${index * 60}ms` } as React.CSSProperties}
                onMouseEnter={() => { if (canHover) setActiveId(brand.id); }}
                onFocusCapture={() => { if (canHover) setActiveId(brand.id); }}
              >
                <h2>
                  {canHover && !empty ? (
                    <Link id={headerId} to={browseUrl} aria-expanded={expanded} aria-controls={panelId} className={headerClass}>{headerContent}</Link>
                  ) : (
                    <button id={headerId} type="button" aria-expanded={expanded} aria-controls={panelId} onClick={() => setActiveId(current => current === brand.id ? null : brand.id)} className={headerClass}>{headerContent}</button>
                  )}
                </h2>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={headerId}
                  aria-hidden={!expanded}
                  data-expanded={expanded}
                  className="brand-directory-panel"
                  ref={node => {
                    if (!node) return;
                    if (expanded) node.removeAttribute('inert');
                    else node.setAttribute('inert', '');
                  }}
                >
                  <div className="min-h-0 overflow-hidden">
                    <div className="brand-directory-details grid gap-5 px-4 pb-5 sm:gap-6 sm:px-6 sm:pb-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
                      <BrandHero brand={brand} />
                      <div className="min-w-0 py-1 lg:order-first lg:self-center lg:py-4">
                        <div className="brand-directory-pills brand-directory-text flex flex-wrap gap-2">
                          <span className="brand-directory-pill"><Package aria-hidden="true" className="h-3 w-3 shrink-0" />{countLabel}</span>
                          {brand.categoryLinks.map(category => (
                            <Link
                              key={category.id}
                              to={`/shop?brand=${encodeURIComponent(brand.id)}&category=${encodeURIComponent(category.id)}`}
                              tabIndex={expanded ? 0 : -1}
                              className="brand-directory-pill hover:border-primary hover:text-accent dark:hover:border-primary dark:hover:text-accent transition-colors"
                              title={`Browse ${brand.name} ${category.name}`}
                            >
                              <Layers3 aria-hidden="true" className="h-3 w-3 shrink-0" />
                              {category.name}
                            </Link>
                          ))}
                          {brand.priceRange && (
                            <span className="brand-directory-pill">
                              <Tag aria-hidden="true" className="h-3 w-3 shrink-0" />
                              {brand.priceRange.formatted}
                            </span>
                          )}
                        </div>
                        <h3 className="brand-directory-title brand-directory-text mt-5 text-3xl font-extrabold leading-[1.1] tracking-tight text-main dark:text-main sm:text-4xl">
                          <span className="block">{brand.name}</span>
                        </h3>
                        <p className="brand-directory-description brand-directory-text mt-4 line-clamp-2 max-w-xl text-sm leading-relaxed text-muted dark:text-main">{brand.description}</p>
                        <div className="brand-directory-actions brand-directory-text mt-6 flex flex-wrap items-center gap-3">
                          {empty ? (
                            <span className="rounded-lg bg-surface-soft px-4 py-2.5 text-sm font-semibold text-muted dark:bg-surface-elevated dark:text-muted">Coming soon</span>
                          ) : (
                            <Link to={browseUrl} tabIndex={expanded ? 0 : -1} className="brand-directory-browse inline-flex min-h-11 items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 dark:focus-visible:ring-offset-surface">Browse {brand.name}<ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>
                          )}
                        </div>

                        {/* Top Products for Mobile Accordion */}
                        {brand.topProducts.length > 0 && (
                          <div className="mt-6 border-t border-border pt-5 dark:border-border/60">
                            <div className="mb-3 flex items-center justify-between">
                              <p className="text-xs font-bold uppercase tracking-wider text-muted dark:text-muted">Top Products</p>
                              <Link
                                to={browseUrl}
                                tabIndex={expanded ? 0 : -1}
                                className="flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent dark:text-accent dark:hover:text-accent"
                              >
                                <span>View all ({countLabel})</span>
                                <ArrowRight className="h-3 w-3" aria-hidden="true" />
                              </Link>
                            </div>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                              {brand.topProducts.map(product => (
                                <MobileBrandProductCard
                                  key={product.id}
                                  product={product}
                                  expanded={expanded}
                                  onAddToCart={addToCart}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
};
