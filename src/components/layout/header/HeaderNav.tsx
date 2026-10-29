import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, ChevronDown, ChevronRight, LayoutGrid } from 'lucide-react';
import { useCategoryDirectory } from '../../../features/catalog/useCategoryDirectory';
import { useMediaQuery } from '../../../hooks/useMediaQuery';
import { MobileNavMenu } from './MobileNavMenu';
import './HeaderNav.css';

export const HeaderNav: React.FC = () => {
  const categories = useCategoryDirectory();
  const available = categories.filter(category => category.count > 0);
  const desktop = useMediaQuery('(min-width: 1024px)');
  const location = useLocation();
  const id = `categories-${useId().replace(/:/g, '')}`;
  const [open, setOpen] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState(() => available[0]?.slug || '');
  const selected = available.find(category => category.slug === selectedSlug) || available[0];
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const tabs = useRef(new Map<string, HTMLButtonElement>());
  const opening = useRef<number>();
  const closing = useRef<number>();
  const switching = useRef<number>();
  const focusRequested = useRef(false);
  const clearTimers = useCallback(() => {
    [opening, closing, switching].forEach(timer => { window.clearTimeout(timer.current); timer.current = undefined; });
  }, []);
  const closeMenu = useCallback((restoreFocus = false) => {
    clearTimers();
    focusRequested.current = false;
    setOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  }, [clearTimers]);

  useEffect(() => { closeMenu(); }, [desktop, location.key, closeMenu]);
  useEffect(() => () => clearTimers(), [clearTimers]);
  useEffect(() => {
    if (open && focusRequested.current) {
      focusRequested.current = false;
      if (desktop && selected) tabs.current.get(selected.slug)?.focus();
      else rootRef.current?.querySelector<HTMLAnchorElement>('nav a[href]')?.focus();
    }
  }, [open, desktop, selected]);
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => { if (!rootRef.current?.contains(event.target as Node)) closeMenu(); };
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') { event.preventDefault(); closeMenu(true); } };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape); };
  }, [open, closeMenu]);

  const focusCategory = (index: number) => {
    const category = available[(index + available.length) % available.length];
    if (!category) return;
    setSelectedSlug(category.slug);
    tabs.current.get(category.slug)?.focus();
  };

  return (
    <div ref={rootRef} className="category-navigation" onKeyDown={event => {
      if (event.key === 'Escape' && open) { event.preventDefault(); event.stopPropagation(); closeMenu(true); }
    }} onBlur={event => { if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget as Node)) closeMenu(); }} onPointerEnter={event => {
      if (!desktop || event.pointerType === 'touch') return;
      window.clearTimeout(closing.current);
    }} onPointerLeave={event => {
      if (!desktop || event.pointerType === 'touch') return;
      window.clearTimeout(opening.current);
      window.clearTimeout(switching.current);
      if (!rootRef.current?.contains(document.activeElement) || document.activeElement === triggerRef.current) closing.current = window.setTimeout(() => closeMenu(), 200);
    }}>
      <button ref={triggerRef} type="button" aria-label="Categories" aria-expanded={open} aria-controls={id} className="category-nav-trigger" onPointerEnter={event => {
        if (!desktop || event.pointerType === 'touch') return;
        window.clearTimeout(closing.current);
        opening.current = window.setTimeout(() => setOpen(true), 120);
      }} onClick={() => { clearTimers(); setOpen(current => !current); }} onKeyDown={event => {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          event.preventDefault(); clearTimers();
          focusRequested.current = true;
          if (open && selected) { tabs.current.get(selected.slug)?.focus(); focusRequested.current = false; }
          else setOpen(true);
        }
      }}>
        <LayoutGrid aria-hidden="true" className="h-4 w-4" /><span className="hidden lg:inline">Categories</span><ChevronDown aria-hidden="true" className={`hidden h-3.5 w-3.5 lg:block ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (desktop ? (
        <nav id={id} aria-label="Product categories" className="category-mega-panel">
          <div className="category-mega-inner mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="category-menu-tabs" role="tablist" aria-label="Hardware categories" aria-orientation="vertical">
              {categories.map(category => {
                const Icon = category.icon;
                if (!category.count) return <div key={category.slug} className="category-menu-empty"><Icon aria-hidden="true" className="h-4 w-4" /><span>{category.name}</span><small>Coming soon</small></div>;
                return <button key={category.slug} ref={node => { if (node) tabs.current.set(category.slug, node); else tabs.current.delete(category.slug); }} id={`${id}-tab-${category.slug}`} type="button" role="tab" aria-selected={selected?.slug === category.slug} aria-controls={`${id}-details`} tabIndex={selected?.slug === category.slug ? 0 : -1} className="category-menu-tab" onPointerEnter={event => {
                  if (event.pointerType === 'touch') return;
                  window.clearTimeout(switching.current);
                  switching.current = window.setTimeout(() => setSelectedSlug(category.slug), 120);
                }} onPointerLeave={() => window.clearTimeout(switching.current)} onFocus={() => setSelectedSlug(category.slug)} onClick={() => setSelectedSlug(category.slug)} onKeyDown={event => {
                  const current = available.findIndex(item => item.slug === category.slug);
                  if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
                    event.preventDefault();
                    focusCategory(event.key === 'Home' ? 0 : event.key === 'End' ? available.length - 1 : current + (event.key === 'ArrowDown' ? 1 : -1));
                  } else if (event.key === 'ArrowRight') { event.preventDefault(); panelRef.current?.querySelector<HTMLAnchorElement>('a[href]')?.focus(); }
                }}>
                  <Icon aria-hidden="true" className="h-4 w-4 shrink-0" /><span>{category.name}</span><ChevronRight aria-hidden="true" className="ml-auto h-3.5 w-3.5" />
                </button>;
              })}
            </div>
            <div ref={panelRef} id={`${id}-details`} role="tabpanel" aria-labelledby={selected ? `${id}-tab-${selected.slug}` : undefined} className="category-menu-details">
              {selected ? <>
                <div className="mb-5 flex items-start justify-between gap-6">
                  <div><h2 className="text-lg font-bold text-slate-900 dark:text-white">{selected.name}</h2><p className="mt-1 max-w-xl text-xs leading-relaxed text-slate-500 dark:text-slate-400">{selected.description}</p></div>
                  <span className="shrink-0 text-xs text-slate-500 dark:text-slate-400">{selected.count} {selected.count === 1 ? 'product' : 'products'}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {selected.subcategories.length ? selected.subcategories.map(subcategory => <Link key={subcategory.id} to={subcategory.href} className="category-menu-subcategory" onClick={() => closeMenu()}><span>{subcategory.name}</span><ArrowRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0" /></Link>) : available.map(category => <Link key={category.id} to={category.href} className="category-menu-subcategory" onClick={() => closeMenu()}>{category.name}<ArrowRight aria-hidden="true" className="h-3.5 w-3.5" /></Link>)}
                </div>
                <Link to={selected.href} onClick={() => closeMenu()} className="category-menu-all mt-5">View all {selected.name}<ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>
              </> : <p className="text-sm text-slate-500">Categories are coming soon.</p>}
              <Link to="/shop" onClick={() => closeMenu()} className="mt-3 block w-fit text-xs text-slate-500 underline dark:text-slate-400">All Categories</Link>
            </div>
          </div>
        </nav>
      ) : <MobileNavMenu id={id} isOpen={open} onClose={() => closeMenu()} categories={categories} />)}
    </div>
  );
};
