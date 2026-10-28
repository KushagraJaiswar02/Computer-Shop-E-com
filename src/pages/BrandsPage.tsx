import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useBrandDirectory } from '../features/brands/useBrandDirectory';
import './BrandsPage.css';

const hoverQuery = '(hover: hover) and (pointer: fine)';

export const BrandsPage: React.FC = () => {
  const brands = useBrandDirectory();
  const [activeId, setActiveId] = useState<string | null>(() => brands[0]?.id || null);
  const [canHover, setCanHover] = useState(() => window.matchMedia(hoverQuery).matches);

  useEffect(() => {
    const media = window.matchMedia(hoverQuery);
    const update = () => setCanHover(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return (
    <div className="min-h-screen bg-surface-50 py-8 dark:bg-surface-900 sm:py-10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-7 sm:mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Shop by Brand</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Pick a manufacturer to browse its products.</p>
        </div>
        <div className="space-y-3 sm:space-y-4">
          {brands.map(brand => {
            const expanded = activeId === brand.id;
            const empty = brand.count === 0;
            const headerId = `brand-header-${encodeURIComponent(brand.id)}`;
            const panelId = `brand-panel-${encodeURIComponent(brand.id)}`;
            const browseUrl = `/shop?brand=${encodeURIComponent(brand.id)}`;
            const countLabel = `${brand.count} ${brand.count === 1 ? 'product' : 'products'}`;
            const headerClass = 'brand-directory-header grid h-24 w-full grid-cols-[3rem_minmax(0,1fr)_1rem] items-center gap-3 rounded-2xl px-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-surface-900 sm:h-28 sm:grid-cols-[4rem_minmax(0,1fr)_1.25rem] sm:gap-5 sm:px-6';
            const headerContent = (
              <>
                <span aria-hidden="true" className="brand-directory-logo flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 p-2.5 dark:bg-slate-800/70 sm:h-16 sm:w-16 sm:p-3">
                  {brand.logo && <span className="block h-full w-full" dangerouslySetInnerHTML={{ __html: brand.logo }} />}
                </span>
                <span className="flex min-w-0 flex-col items-start gap-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                  <span className={`text-base font-bold leading-tight sm:text-lg ${empty ? 'text-slate-500 dark:text-slate-400' : 'text-slate-900 dark:text-white'}`}>{brand.name}</span>
                  <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400 sm:text-xs">{countLabel}</span>
                </span>
                <ChevronDown aria-hidden="true" className="brand-directory-chevron h-4 w-4 text-slate-400 sm:h-5 sm:w-5" />
              </>
            );

            return (
              <article
                key={brand.id}
                className={`brand-directory-card rounded-2xl border ${expanded ? 'border-blue-400 bg-blue-50/60 shadow-soft-card dark:border-blue-700 dark:bg-blue-950/25' : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-surface-850'} ${empty ? 'brand-directory-empty' : ''}`}
                data-expanded={expanded}
                style={{ '--directory-brand-color': brand.hoverColor, '--directory-brand-color-dark': brand.darkHoverColor } as React.CSSProperties}
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
                    <div className="brand-directory-details px-4 pb-5 sm:px-6 sm:pb-6 sm:pl-[7rem]">
                      <p className="max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">{brand.description}</p>
                      {brand.series.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2" aria-label={`${brand.name} series`}>
                          {brand.series.map(series => empty ? (
                            <span key={series.id} className="text-xs text-slate-500 dark:text-slate-400">{series.name}</span>
                          ) : (
                            <Link key={series.id} to={`${browseUrl}&series=${encodeURIComponent(series.id)}`} tabIndex={expanded ? 0 : -1} className="rounded-full border border-blue-200 bg-white/80 px-3 py-1.5 text-xs font-medium text-blue-700 transition-colors hover:border-blue-400 hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-blue-900 dark:bg-slate-900/70 dark:text-blue-300 dark:hover:bg-blue-950 motion-reduce:transition-none">{series.name}</Link>
                          ))}
                        </div>
                      )}
                      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                        <span className="text-xs text-slate-500 dark:text-slate-400">{countLabel}</span>
                        {empty ? (
                          <span className="rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">Coming soon</span>
                        ) : (
                          <Link to={browseUrl} tabIndex={expanded ? 0 : -1} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-surface-900 motion-reduce:transition-none">Browse {brand.name}<ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>
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
