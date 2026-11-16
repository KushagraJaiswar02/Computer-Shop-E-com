import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, LayoutGrid, ShoppingCart, Heart, UserRound, Search, GitCompareArrows, Moon, Sun } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../features/account/useAuth';
import './mobile-store.css';

const tabs = [
  { to: '/', label: 'Home', Icon: Home, end: true },
  { to: '/categories', label: 'Categories', Icon: LayoutGrid },
  { to: '/cart', label: 'Cart', Icon: ShoppingCart },
  { to: '/wishlist', label: 'Wishlist', Icon: Heart },
  { to: '/account', label: 'Account', Icon: UserRound },
];

export const MobileStoreShell: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { cartCount, compareList, theme, toggleTheme } = useStore();
  const auth = useAuth();
  const immersive = pathname.startsWith('/product/') || pathname.startsWith('/checkout');
  const searchMode = pathname === '/search';
  const activePath = pathname === '/login' || pathname === '/register' ? '/account' : pathname;
  return <div className={`mobile-store ${immersive || searchMode ? 'is-immersive' : ''}`} data-mobile-store>
    {!searchMode && <header className="mobile-topbar">
      <Link to="/" className="mobile-logo" aria-label="CompShop home"><span className="mobile-logo-mark">C</span><span>Comp<span>Shop</span></span></Link>
      <button type="button" className="mobile-search-pill" onClick={() => navigate('/search')}><Search size={19}/><span>Search laptops, GPUs...</span></button>
      <button type="button" className="mobile-compare" onClick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>{theme === 'light' ? <Moon size={20}/> : <Sun size={20}/>}</button>
      <Link to="/compare" className="mobile-compare" aria-label={`Compare, ${compareList.length} selected`}><GitCompareArrows size={20}/>{compareList.length > 0 && <b>{compareList.length}</b>}</Link>
    </header>}
    <main className={`mobile-main ${immersive ? 'mobile-main-immersive' : ''}`}><Outlet /></main>
    {!immersive && !searchMode && <nav className="mobile-bottom-nav" aria-label="Primary navigation">{tabs.map(({to,label,Icon,end}) => {
      const active = end ? activePath === to : activePath === to || activePath.startsWith(`${to}/`);
      return <Link key={to} to={to} aria-current={active ? 'page' : undefined} className={`mobile-tab ${active ? 'is-active' : ''}`}><span className="mobile-tab-icon"><Icon size={21} strokeWidth={active ? 2.5 : 2}/>{to === '/cart' && cartCount > 0 && <b className="mobile-badge">{cartCount > 99 ? '99+' : cartCount}</b>}</span><span>{label}</span></Link>;
    })}</nav>}
    <span className="sr-only">{auth.user ? `Signed in as ${auth.user.name}` : ''}</span>
  </div>;
};
