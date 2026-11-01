import React, { useEffect, useId, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserRound } from 'lucide-react';
import { accountConfig, accountLabels } from '../../../config/account';
import { useAuth } from '../../../features/account/useAuth';
import { useMediaQuery } from '../../../hooks/useMediaQuery';
import { errorMessage, safeReturnTo } from '../../../services/account/validation';

export const HeaderAccount: React.FC<{ className: string }> = ({ className }) => {
  const auth = useAuth(), mobile = useMediaQuery(accountConfig.MOBILE_QUERY), location = useLocation(), navigate = useNavigate();
  const [open, setOpen] = useState(false), [error, setError] = useState('');
  const root = useRef<HTMLDivElement>(null), trigger = useRef<HTMLButtonElement>(null), menu = useRef<HTMLDivElement>(null);
  const id = useId(), labels = accountLabels();
  const items = [{ to: '/account/orders', label: labels.plural }, { to: '/account/details', label: 'Account details' }, ...(auth.user?.role === 'admin' ? [{ to: '/admin', label: 'Admin panel' }] : [])];
  useEffect(() => { setOpen(false); setError(''); }, [location.pathname, location.search, mobile, auth.user?.id]);
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener('pointerdown', outside);
    menu.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus();
    return () => document.removeEventListener('pointerdown', outside);
  }, [open]);
  const logout = async () => { setError(''); try { await auth.logout(); setOpen(false); navigate('/login'); } catch (failure) { setError(errorMessage(failure)); } };
  const keyDown = (event: React.KeyboardEvent) => {
    const controls = Array.from(menu.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') || []);
    const index = controls.indexOf(document.activeElement as HTMLElement);
    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); setOpen(false); trigger.current?.focus(); }
    else if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      const target = event.key === 'Home' ? 0 : event.key === 'End' ? controls.length - 1 : (index + (event.key === 'ArrowDown' ? 1 : -1) + controls.length) % controls.length;
      controls[target]?.focus();
    } else if (event.key === 'Tab') {
      event.preventDefault(); setOpen(false);
      const all = Array.from(root.current?.closest('header')?.querySelectorAll<HTMLElement>('a[href],button:not(:disabled),input') || []).filter(node => !menu.current?.contains(node) && node.getClientRects().length);
      const current = all.indexOf(trigger.current!);
      (all[current + (event.shiftKey ? -1 : 1)] || trigger.current)?.focus();
    }
  };
  const icon = <UserRound aria-hidden="true" className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />;
  const returnTo = safeReturnTo(location.pathname + location.search + location.hash);
  return <div ref={root} className="relative shrink-0">
    {auth.initializing ? <button type="button" disabled aria-label="Loading account" className={className}>{icon}</button> : !auth.user ? <Link to={`/login?returnTo=${encodeURIComponent(returnTo)}`} aria-label="Sign in" title="Sign in" className={className}>{icon}</Link> : mobile ? <Link to="/account" aria-label="My account" title="My account" className={className}>{icon}</Link> : <>
      <button ref={trigger} id={`${id}-button`} type="button" aria-label="Account menu" title="Account menu" aria-haspopup="menu" aria-expanded={open} aria-controls={open ? id : undefined} className={className} onClick={() => setOpen(value => !value)} onKeyDown={event => { if (event.key === 'ArrowDown') { event.preventDefault(); setOpen(true); } else if (event.key === 'Escape') { setOpen(false); event.stopPropagation(); } }}>{icon}</button>
      {open && <div ref={menu} id={id} role="menu" aria-labelledby={`${id}-button`} onKeyDown={keyDown} className="account-menu absolute right-0 top-full z-50 mt-2 w-72 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-border bg-surface p-2 shadow-xl dark:border-border dark:bg-surface">
        <div className="mb-1 border-b border-border px-3 py-2 dark:border-border"><p className="break-words text-sm font-bold text-main dark:text-main">{auth.user.name}</p><p className="break-all text-xs text-muted dark:text-muted">{auth.user.email}</p></div>
        {items.map(item => <Link key={item.to} role="menuitem" to={item.to} className="flex min-h-10 items-center rounded-lg px-3 text-sm text-main hover:bg-surface-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus dark:text-main dark:hover:bg-surface-elevated">{item.label}</Link>)}
        <button role="menuitem" type="button" disabled={auth.busy} onClick={logout} className="flex min-h-10 w-full items-center rounded-lg px-3 text-left text-sm text-danger-ink hover:bg-danger/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus disabled:opacity-50 dark:text-danger-ink dark:hover:bg-danger/10">{auth.busy ? 'Signing out…' : 'Logout'}</button>
        {error && <p role="alert" className="break-words p-3 text-xs text-danger-ink dark:text-danger-ink">{error}</p>}
      </div>}
    </>}
  </div>;
};
