import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { KeyBadge } from '../../common/KeyBadge';
import { formatPrice } from '../../../lib/utils';

export const HeaderSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { registerSearchInputRef, products } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const listboxId = 'header-search-suggestions';

  const suggestions = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    if (normalizedQuery.length < 2) return [];
    return products
      .filter(product => [product.name, product.brandName, product.categoryName, product.seriesName || '', product.sku, ...product.attributes.map(attribute => attribute.value)]
        .some(value => value.toLocaleLowerCase().includes(normalizedQuery)))
      .slice(0, 6);
  }, [products, query]);

  useEffect(() => {
    registerSearchInputRef(searchInputRef);
  }, [registerSearchInputRef]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selected = isOpen && activeIndex >= 0 ? suggestions[activeIndex] : undefined;
    if (selected) navigate(`/product/${selected.slug}`);
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
    <form onSubmit={handleSubmit} className="relative mx-0 w-full max-w-none sm:mx-6 sm:max-w-md" role="search">
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
          placeholder="Search products, GPUs, laptops, processors..."
          className="w-full pl-9 pr-12 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
        />
        {query && <button type="button" onClick={() => { setQuery(''); setIsOpen(false); setActiveIndex(-1); searchInputRef.current?.focus(); }} aria-label="Clear search" className="absolute right-9 top-1/2 -translate-y-1/2 rounded p-1 text-slate-500 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:text-white"><X className="h-3.5 w-3.5" /></button>}
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
          <KeyBadge>/</KeyBadge>
        </div>
      </div>
      {isOpen && query.trim().length >= 2 && (
        <div className="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900" onMouseDown={event => event.preventDefault()}>
          {suggestions.length ? (
            <ul id={listboxId} role="listbox" aria-label="Product suggestions" className="max-h-80 overflow-y-auto p-1.5">
              {suggestions.map((product, index) => (
                <li key={product.id} id={`header-search-option-${index}`} role="option" aria-selected={index === activeIndex}>
                  <button type="button" onMouseEnter={() => setActiveIndex(index)} onClick={() => { navigate(`/product/${product.slug}`); setIsOpen(false); searchInputRef.current?.blur(); }} className={`flex min-h-14 w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left ${index === activeIndex ? 'bg-blue-50 dark:bg-slate-800' : 'hover:bg-slate-50 dark:hover:bg-slate-800/70'}`}>
                    <img src={product.images[0]} alt="" loading="lazy" className="h-10 w-10 shrink-0 rounded-md bg-slate-100 object-contain dark:bg-slate-800" />
                    <span className="min-w-0 flex-1"><span className="block truncate text-xs font-semibold text-slate-900 dark:text-slate-100">{product.name}</span><span className="mt-0.5 block truncate text-[11px] text-slate-500">{product.brandName} · {product.categoryName}</span></span>
                    <span className="shrink-0 text-xs font-semibold text-slate-700 dark:text-slate-200">{formatPrice(product.price)}</span>
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
