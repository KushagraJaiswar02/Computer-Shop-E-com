import { brandConfig } from '../../config/brand';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import React, { useEffect, useRef, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Archive, ArrowLeft, Bell, Boxes, ChevronLeft, ChevronRight, CircleDollarSign, Clock, Home, Image, LayoutDashboard, ListTree, Megaphone, Menu, MessageSquare, Moon, Package, Search, Settings, ShoppingBag, Star, Sun, Tag, UserRound, Users, X } from 'lucide-react';
import { adminConfig } from '../../config/admin';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../features/account/useAuth';
import { AdminButton, AdminHelp, AdminModal, AdminToastProvider, Badge } from './AdminUi';
import './admin.css';

export const adminNavigation = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { group: 'Products', label: 'All products', path: '/admin/products', icon: Package },
  { label: 'Categories', path: '/admin/categories', icon: ListTree },
  { label: 'Brands and series', path: '/admin/brands', icon: Tag },
  { label: 'Archive', path: '/admin/archive', icon: Archive },
  { group: 'Storefront', label: 'Homepage', path: '/admin/homepage-builder', icon: Home },
  { label: 'Banners', path: '/admin/banners', icon: Image },
  { label: 'Featured', path: '/admin/featured', icon: Star },
  { label: 'Deals', path: '/admin/deals', icon: CircleDollarSign },
  { label: 'Announcement bar', path: '/admin/announcement', icon: Megaphone },
  { group: 'Manage your shop', label: 'Orders', path: '/admin/orders', icon: ShoppingBag },
  { label: 'Enquiries', path: '/admin/enquiries', icon: MessageSquare },
  { label: 'Customers', path: '/admin/customers', icon: Users, soon: true },
  { label: 'History', path: '/admin/history', icon: Clock },
  { label: 'Settings', path: '/admin/settings', icon: Settings },
];
export const AdminLayout: React.FC = () => {
  const mobile = useMediaQuery('(max-width: 767px)');
  const location = useLocation(), navigate = useNavigate(), auth = useAuth();
  const store = useStore();
  const [adminTheme, setAdminTheme] = useState<'light' | 'dark'>(() => {
    try { const saved = localStorage.getItem('compshop_admin_theme'); if (saved === 'light' || saved === 'dark') return saved; } catch { /* Use system preference. */ }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  useEffect(() => { try { localStorage.setItem('compshop_admin_theme', adminTheme); } catch { /* Theme still works. */ } }, [adminTheme]);
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('compshop_admin_collapsed') === 'true');
  const [drawer, setDrawer] = useState(false), [searchOpen, setSearchOpen] = useState(false), [query, setQuery] = useState(''), [error, setError] = useState('');
  const sidebar = useRef<HTMLElement>(null), menuButton = useRef<HTMLButtonElement>(null), userMenu = useRef<HTMLDetailsElement>(null);
  const current = adminNavigation.find(item => item.path === location.pathname);
  const title = current?.label || 'Admin panel';
  const group = location.pathname.match(/products|categories|brands|archive/) ? 'Products' : location.pathname.match(/homepage-builder|banners|featured|deals|announcement/) ? 'Storefront' : '';
  const newOrders = store.orders.filter(order => ['Pending', 'Placed', 'Confirmed'].includes(order.status)).length;
  const openEnquiries = store.enquiries.filter(item => ['New', 'In Review'].includes(item.status)).length;
  const lowStock = store.products.filter(product => product.stock < 10 || product.stockStatus === 'low_stock').length;
  useEffect(() => { setDrawer(false); setSearchOpen(false); if (userMenu.current) userMenu.current.open = false; window.scrollTo(0, 0); }, [location.pathname, location.search]);
  useEffect(() => { if (!mobile) setDrawer(false); }, [mobile]);
  useEffect(() => {
    const outside = (event: PointerEvent) => { if (userMenu.current && !userMenu.current.contains(event.target as Node)) userMenu.current.open = false; };
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape' && userMenu.current?.open) { userMenu.current.open = false; userMenu.current.querySelector<HTMLElement>('summary')?.focus(); } };
    document.addEventListener('pointerdown', outside); document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape); };
  }, []);
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey && !target.closest('input,textarea,select,[contenteditable=true]')) { event.preventDefault(); setSearchOpen(true); }
    };
    document.addEventListener('keydown', key); return () => document.removeEventListener('keydown', key);
  }, []);
  useEffect(() => {
    if (!drawer) return;
    const previous = document.activeElement as HTMLElement;
    const old = document.body.style.overflow; document.body.style.overflow = 'hidden';
    sidebar.current?.querySelector<HTMLElement>('a,button')?.focus();
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setDrawer(false);
      if (event.key !== 'Tab') return;
      const nodes = Array.from(sidebar.current?.querySelectorAll<HTMLElement>('a,button:not(:disabled)') || []).filter(node => node.getClientRects().length);
      if (event.shiftKey && document.activeElement === nodes[0]) { event.preventDefault(); nodes[nodes.length - 1]?.focus(); }
      if (!event.shiftKey && document.activeElement === nodes[nodes.length - 1]) { event.preventDefault(); nodes[0]?.focus(); }
    };
    document.addEventListener('keydown', key);
    return () => { document.body.style.overflow = old; document.removeEventListener('keydown', key); previous?.focus(); };
  }, [drawer]);
  const matches = (value: string) => query.trim() && value.toLowerCase().includes(query.trim().toLowerCase());
  const products = store.products.filter(p => matches(`${p.name} ${p.sku} ${p.brandName}`));
  const orders = store.orders.filter(o => matches(`${o.orderNumber} ${o.shippingAddress.fullName} ${o.id}`));
  const enquiries = store.enquiries.filter(e => matches(`${e.customerName} ${e.email} ${e.message}`));
  const customers = Array.from(new Map(store.orders.map(order => [order.shippingAddress.fullName, order.shippingAddress])).values()).filter(address => matches(`${address.fullName} ${address.phone}`));
  const total = products.length + orders.length + enquiries.length + customers.length;
  return <div data-theme={adminTheme} className={`admin-app ${collapsed ? 'au-collapsed' : ''}`}>
    <AdminToastProvider>
      {drawer && <div className="au-drawer-backdrop" onClick={() => setDrawer(false)} />}
      <aside ref={sidebar} {...(mobile && !drawer ? { inert: '' } : {})} className={`au-sidebar ${drawer ? 'open' : ''}`} aria-label="Admin navigation" role={drawer ? 'dialog' : undefined} aria-modal={drawer ? true : undefined}>
        <Link to="/admin" className="au-brand"><img className="au-brand-mark" src={brandConfig.logoPath} alt={brandConfig.logoAlt} width={34} height={34} /><span className="au-brand-copy">{brandConfig.shopName}<small>Admin</small></span></Link>
        <nav>{adminNavigation.map(item => {
          const count = item.path === '/admin/orders' ? newOrders : item.path === '/admin/enquiries' ? openEnquiries : item.path === '/admin/products' ? lowStock : 0;
          return <React.Fragment key={item.path}>{item.group && <div className="au-nav-group">{item.group}</div>}{item.soon ? <button className="au-nav-item" disabled title={`${item.label} · coming soon`}><item.icon /><span className="au-nav-label">{item.label}</span><Badge>Soon</Badge></button> : <Link className={`au-nav-item ${location.pathname === item.path ? 'active' : ''}`} aria-current={location.pathname === item.path ? 'page' : undefined} to={item.path} title={collapsed ? `${item.label}${count ? ` (${count})` : ''}` : undefined}><item.icon /><span className="au-nav-label">{item.label}</span>{['/admin/orders', '/admin/enquiries', '/admin/products'].includes(item.path) && <Badge title={item.path === '/admin/products' ? `${count} low-stock products` : item.path === '/admin/orders' ? `${count} new orders` : `${count} open enquiries`}>{count}</Badge>}</Link>}</React.Fragment>;
        })}</nav>
        <div className="au-sidebar-foot"><AdminButton className="au-collapse" aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} onClick={() => { const next = !collapsed; setCollapsed(next); localStorage.setItem('compshop_admin_collapsed', String(next)); }}>{collapsed ? <ChevronRight size={17} /> : <><ChevronLeft size={17} /> Collapse sidebar</>}</AdminButton><AdminButton className="au-mobile-menu" onClick={() => setDrawer(false)}><X size={17} /> Close menu</AdminButton></div>
      </aside>
      <div className="au-workspace"><header className="au-topbar"><button ref={menuButton} className="au-button au-mobile-menu" aria-label="Open navigation" aria-expanded={drawer} onClick={() => setDrawer(true)}><Menu size={19} /></button><div className="au-topbar-page"><div className="au-title"><span className="au-header-brand"><img src={brandConfig.logoPath} alt={brandConfig.logoAlt} width={18} height={18} />Admin</span>{title}</div><nav aria-label="Breadcrumb" className="au-crumbs"><Link to="/admin">Admin</Link>{group && <><span>/</span><span>{group}</span></>}<span>/</span><span aria-current="page">{title}</span></nav></div>
        <button className="au-button au-global-search" onClick={() => setSearchOpen(true)}><Search size={17} /><span>Search your shop</span><kbd className="au-badge">/</kbd></button>
        <Link to="/" className="au-link au-view-store">View store ↗</Link><AdminButton aria-label={`Switch to ${adminTheme === 'dark' ? 'light' : 'dark'} mode`} onClick={() => setAdminTheme(value => value === 'dark' ? 'light' : 'dark')}>{adminTheme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}</AdminButton>
        <details ref={userMenu} className="au-user-menu"><summary className="au-button" aria-label="Your account"><UserRound size={17} /><span className="hidden lg:inline">{auth.user?.name.split(' ')[0] || 'Demo visitor'}</span></summary><div className="au-user-popover"><strong>{auth.user?.name || 'Public demo visitor'}</strong><p>{auth.user?.email || 'Changes are saved in this browser.'}</p><div className="au-stack"><Link className="au-link" to="/account">My account</Link>{auth.user ? <AdminButton onClick={async () => { try { await auth.logout(); navigate('/login'); } catch (failure) { setError(failure instanceof Error ? failure.message : 'Could not sign out.'); } }}>Sign out</AdminButton> : <Link className="au-link" to="/login?returnTo=%2Fadmin">Sign in</Link>}{error && <p role="alert">{error}</p>}</div></div></details>
      </header><main className="au-content"><div className="au-page-tools"><div><Link to="/" className="au-link text-xs">← Back to store</Link><p className="au-demo-note">{(adminConfig.DEMO_MODE || adminConfig.PUBLIC_DEMO_ACCESS) && <strong>DEMO MODE</strong>}Changes are saved in this browser.</p></div><AdminHelp /></div><Outlet /></main></div>
      {searchOpen && <AdminModal title="Search your shop" onClose={() => setSearchOpen(false)}><label className="au-search"><Search size={17} /><input autoFocus aria-label="Global search" placeholder="Product, order, customer or enquiry…" value={query} onChange={event => setQuery(event.target.value)} /></label>{!query.trim() ? <p className="au-muted mt-5">Start typing a name, stock code or order number. Results appear below.</p> : <><p className="au-muted mt-4 text-xs" role="status">{total} matches</p>{[
        { title: 'Products', items: products.slice(0, 5).map(p => ({ id: p.id, label: `${p.name} · ${p.sku}`, to: `/admin/products?edit=${p.id}` })) },
        { title: 'Orders', items: orders.slice(0, 5).map(o => ({ id: o.id, label: `${o.orderNumber} · ${o.shippingAddress.fullName}`, to: `/admin/orders?order=${o.id}` })) },
        { title: 'Customers in orders', items: customers.slice(0, 5).map(c => ({ id: c.fullName, label: `${c.fullName} · ${c.phone}`, to: `/admin/orders?q=${encodeURIComponent(c.fullName)}` })) },
        { title: 'Enquiries', items: enquiries.slice(0, 5).map(e => ({ id: e.id, label: `${e.customerName} · ${e.enquiryType.replace(/_/g, ' ')}`, to: `/admin/enquiries?enquiry=${e.id}` })) },
      ].filter(group => group.items.length).map(group => <section className="au-search-group" key={group.title}><h3>{group.title}</h3>{group.items.map(item => <Link className="au-search-result" to={item.to} key={item.id}>{item.label} →</Link>)}</section>)}{!total && <p className="au-muted mt-4">No results. Try a shorter name or a different stock code.</p>}</>}</AdminModal>}
    </AdminToastProvider>
  </div>;
};
