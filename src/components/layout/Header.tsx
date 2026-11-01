import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PackagePlus, Search, X } from 'lucide-react';
import { BrandLogo } from './header/BrandLogo';
import { HeaderSearch } from './header/HeaderSearch';
import { HeaderActions } from './header/HeaderActions';
import { HeaderNav } from './header/HeaderNav';
export const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false), [mobileSearch, setMobileSearch] = useState(false);
  const search = useRef<HTMLDivElement>(null), trigger = useRef<HTMLButtonElement>(null), location = useLocation();
  useEffect(() => { const update = () => setScrolled(window.scrollY > 8); update(); window.addEventListener('scroll', update, { passive: true }); return () => window.removeEventListener('scroll', update); }, []);
  useEffect(() => { const open = () => { if (window.innerWidth < 1024) setMobileSearch(true); }; window.addEventListener('storefront-search-open', open); return () => window.removeEventListener('storefront-search-open', open); }, []);
  useEffect(() => { setMobileSearch(false); }, [location.pathname, location.search]);
  useEffect(() => { if (mobileSearch) search.current?.querySelector<HTMLInputElement>('input')?.focus(); }, [mobileSearch]);
  return <header className={`shop-header ${scrolled ? 'is-scrolled' : ''}`}><div className="shop-container shop-header-row"><div className="shop-header-logo"><BrandLogo /></div><div className="shop-header-categories"><HeaderNav /></div><div ref={search} className={`shop-header-search ${mobileSearch ? 'is-open' : ''}`} onFocusCapture={() => { if (window.innerWidth < 1024) setMobileSearch(true); }} onKeyDown={event => { if (event.key === 'Escape' && mobileSearch) { setMobileSearch(false); trigger.current?.focus(); } }}><HeaderSearch />{mobileSearch && <button className="shop-icon-button shop-search-close" type="button" aria-label="Close search" onClick={() => { setMobileSearch(false); trigger.current?.focus(); }}><X size={19} /></button>}</div><Link to="/enquiry?request=product" className="shop-request" aria-label="Request a Product"><PackagePlus size={19} /><span>Request a Product</span></Link><button ref={trigger} type="button" className="shop-icon-button shop-mobile-search" aria-label="Open search" aria-expanded={mobileSearch} onClick={() => setMobileSearch(value => !value)}><Search size={20} /></button><div className="shop-header-actions"><HeaderActions /></div></div></header>;
};
