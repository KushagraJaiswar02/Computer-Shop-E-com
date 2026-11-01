import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/account/useAuth';
import { accountConfig, accountLabels } from '../config/account';
import { errorMessage } from '../services/account/validation';
import { FormMessage, panelClass, secondaryClass } from '../features/account/AccountUi';
import '../features/account/account.css';

export const AccountPage: React.FC = () => {
  const auth = useAuth(), navigate = useNavigate(), labels = accountLabels();
  const [error, setError] = useState('');
  const links = [{ to: '/account', label: 'Dashboard', end: true }, { to: '/account/orders', label: labels.plural }, { to: '/account/requests', label: 'My requests' }, { to: '/account/details', label: 'Account details' }];
  const logout = async () => { setError(''); try { await auth.logout(); navigate('/login', { replace: true }); } catch (failure) { setError(errorMessage(failure)); } };
  return <div className="account-ui min-h-[60vh] bg-background py-6 dark:bg-background sm:py-8"><div className="shop-container ">
    <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-xs text-muted dark:text-muted"><Link to="/">Home</Link><span aria-hidden="true">/</span><span>Account</span></nav>
    <div className={`${panelClass} mb-5 flex flex-wrap items-center gap-3`}><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-lg font-bold text-on-primary" aria-hidden="true">{auth.user?.name.charAt(0).toUpperCase()}</span><div className="min-w-0"><p className="font-bold text-main dark:text-main">{auth.user?.name}</p><p className="break-all text-xs text-muted dark:text-muted">{auth.user?.email}</p></div>{accountConfig.SHOW_MOCK_NOTICE && <p className="w-full text-xs text-muted dark:text-muted">Mock account: records stay in this browser. No information is sent to a retailer.</p>}</div>
    {auth.basketError && <div className="mb-4"><FormMessage error={auth.basketError} /></div>}
    <div className="grid min-w-0 gap-5 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-7">
      <aside className="min-w-0"><nav aria-label="Account navigation" className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible">
        {links.map(link => <NavLink key={link.to} to={link.to} end={link.end} className={({ isActive }) => `inline-flex min-h-10 shrink-0 items-center whitespace-nowrap rounded-lg border px-3 text-xs font-semibold ${isActive ? 'border-primary bg-primary text-on-primary' : 'border-border bg-surface text-main hover:border-primary dark:border-border dark:bg-surface dark:text-main'}`}>{link.label}</NavLink>)}
        <button type="button" onClick={logout} disabled={auth.busy} className={`${secondaryClass} shrink-0`}>{auth.busy ? 'Signing out…' : 'Logout'}</button>
      </nav><FormMessage error={error} /></aside>
      <div className="min-w-0"><Outlet /></div>
    </div>
  </div></div>;
};
