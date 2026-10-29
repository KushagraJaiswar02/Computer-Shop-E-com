import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowUpRight } from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { KeyBadge } from '../../common/KeyBadge';
import { formatPrice } from '../../../lib/utils';
import type { Product } from '../../../types';
import { useCategoryDirectory } from '../../../features/catalog/useCategoryDirectory';

type SearchSuggestion = { id: string; kind: string; label: string; detail: string; to: string; product?: Product };

export const HeaderSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { registerSearchInputRef, products, brands } = useStore();
  const categories = useCategoryDirectory();
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const listboxId = 'header-search-suggestions';

  const suggestions = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    if (normalizedQuery.length < 2) return [];
    const matchingProducts: SearchSuggestion[] = products
      .filter(product => [product.name, product.brandName, product.categoryName, product.subcategoryName || '', product.seriesName || '', product.sku, product.shortDescription, ...product.attributes.flatMap(attribute => [attribute.name, attribute.value])]
        .some(value => value.toLocaleLowerCase().includes(normalizedQuery)))
      .slice(0, 6)
      .map(product => ({ id: `product-${product.id}`, kind: 'Product', label: product.name, detail: `${product.brandName} · ${product.categoryName} · ${product.sku}`, to: `/product/${product.slug}`, product }));
    const matchingCategories: SearchSuggestion[] = categories.filter(category => category.count > 0 && [category.name, category.description, ...category.subcategories.map(subcategory => subcategory.name)].some(value => value.toLocaleLowerCase().includes(normalizedQuery)))
      .slice(0, 3)
      .map(category => ({ id: `category-${category.id}`, kind: 'Category', label: category.name, detail: 'Browse category and subcategories', to: category.href }));
    const matchingBrands: SearchSuggestion[] = brands.filter(brand => [brand.name, brand.description, ...brand.seriesList.map(series => series.name)].some(value => value.toLocaleLowerCase().includes(normalizedQuery)))
      .slice(0, 3)
      .map(brand => ({ id: `brand-${brand.id}`, kind: 'Brand', label: brand.name, detail: 'Browse brand catalog', to: `/brand/${brand.id}` }));
    return [...matchingProducts, ...matchingCategories, ...matchingBrands];
  }, [products, categories, brands, query]);

  useEffect(() => {
    registerSearchInputRef(searchInputRef);
  }, [registerSearchInputRef]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selected = isOpen && activeIndex >= 0 ? suggestions[activeIndex] : undefined;
    if (selected) navigate(selected.to);
    else if (query.trim()) navigate(`/shop?q=${encodeURIComponent(query.trim())}`);
    else return;
    setIsOpen(false);
    setActiveIndex(-1);
    searchInputRef.current?.blur();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape' && isOpen) {
      event.stopPropagation();
      setIsOpen(false);
      setActiveIndex(-1);
    } else if (event.key === 'ArrowDown' && suggestions.length) {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex(index => (index + 1) % suggestions.length);
    } else if (event.key === 'ArrowUp' && suggestions.length) {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex(index => (index <= 0 ? suggestions.length - 1 : index - 1));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative min-w-0 w-full flex-1" role="search">
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          ref={searchInputRef}
          type="text"
          role="combobox"
          aria-label="Search products"
          aria-autocomplete="list"
          aria-expanded={isOpen && query.trim().length >= 2}
          aria-controls={listboxId}
          aria-activedescendant={activeIndex >= 0 ? `header-search-option-${activeIndex}` : undefined}
          value={query}
          onChange={e => { setQuery(e.target.value); setActiveIndex(-1); setIsOpen(true); }}
          onFocus={() => query.trim().length >= 2 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          onBlur={() => window.setTimeout(() => setIsOpen(false), 120)}
          placeholder="Search for products..."
          className="h-11 w-full rounded-md border border-slate-200 bg-slate-50 pl-9 pr-20 text-xs text-slate-900 transition-colors placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100 sm:text-sm"
        />
        {query && <button type="button" onClick={() => { setQuery(''); setIsOpen(false); setActiveIndex(-1); searchInputRef.current?.focus(); }} aria-label="Clear search" className="absolute right-11 top-1/2 -translate-y-1/2 rounded p-1 text-slate-500 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:text-white"><X className="h-3.5 w-3.5" /></button>}
        <div className={`pointer-events-none absolute right-11 top-1/2 -translate-y-1/2 ${query ? 'hidden' : ''}`}>
          <KeyBadge>/</KeyBadge>
        </div>
        <button type="submit" aria-label="Search products" title="Search products" className="absolute right-1 top-1/2 flex h-7 w-8 -translate-y-1/2 items-center justify-center rounded text-slate-500 transition-colors hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-blue-300"><Search className="h-4 w-4" /></button>
      </div>
      {isOpen && query.trim().length >= 2 && (
        <div className="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900" onMouseDown={event => event.preventDefault()}>
          {suggestions.length ? (
            <ul id={listboxId} role="listbox" aria-label="Product, category, and brand suggestions" className="max-h-80 overflow-y-auto p-1.5">
              {suggestions.map((suggestion, index) => (
                <li key={suggestion.id} id={`header-search-option-${index}`} role="option" aria-selected={index === activeIndex}>
                  <button type="button" onMouseEnter={() => setActiveIndex(index)} onClick={() => { navigate(suggestion.to); setIsOpen(false); searchInputRef.current?.blur(); }} className={`flex min-h-14 w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left ${index === activeIndex ? 'bg-blue-50 dark:bg-slate-800' : 'hover:bg-slate-50 dark:hover:bg-slate-800/70'}`}>
                    {suggestion.product ? <img src={suggestion.product.images[0]} alt="" loading="lazy" className="h-10 w-10 shrink-0 rounded-md bg-slate-100 object-contain dark:bg-slate-800" /> : <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-slate-100 text-blue-700 dark:bg-slate-800 dark:text-blue-300"><ArrowUpRight className="h-4 w-4" /></span>}
                    <span className="min-w-0 flex-1"><span className="block text-[10px] font-bold uppercase tracking-wide text-blue-700 dark:text-blue-300">{suggestion.kind}</span><span className="block truncate text-xs font-semibold text-slate-900 dark:text-slate-100">{suggestion.label}</span><span className="mt-0.5 block truncate text-[11px] text-slate-500">{suggestion.detail}</span></span>
                    {suggestion.product && <span className="shrink-0 text-xs font-semibold text-slate-700 dark:text-slate-200">{formatPrice(suggestion.product.price)}</span>}
                  </button>
                </li>
              ))}
            </ul>
          ) : <p role="status" className="px-4 py-3 text-xs text-slate-600 dark:text-slate-300">No matching products. Press Enter to search the full catalog.</p>}
          <button type="submit" className="flex min-h-10 w-full items-center gap-2 border-t border-slate-100 px-3 text-xs font-semibold text-blue-700 hover:bg-slate-50 dark:border-slate-800 dark:text-blue-300 dark:hover:bg-slate-800"><Search className="h-3.5 w-3.5" />Search all products for “{query.trim()}”</button>
        </div>
      )}
    </form>
  );
};
