import { adminConfig } from '../../config/admin';
import React, { useEffect, useRef, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../../features/account/useAuth';
import { NotFoundPage } from '../NotFoundPage';
import './admin.css';
const TIMEOUT = 15 * 60 * 1000;
export const AdminGuard: React.FC = () => {
  const { user, initializing, logout } = useAuth();
  const [expired, setExpired] = useState(false), [warning, setWarning] = useState(false), [error, setError] = useState('');
  const resetRef = useRef<() => void>(() => undefined);
  const allowed = adminConfig.PUBLIC_DEMO_ACCESS || user?.role === 'admin';
  useEffect(() => {
    if (!allowed) return;
    let warningTimer: ReturnType<typeof setTimeout>, expiryTimer: ReturnType<typeof setTimeout>;
    let warned = false;
    const reset = () => { clearTimeout(warningTimer); clearTimeout(expiryTimer); warned = false; setWarning(false); warningTimer = setTimeout(() => { warned = true; setWarning(true); }, TIMEOUT - 60000); expiryTimer = setTimeout(() => { setExpired(true); if (user) void logout().catch(() => setError('Could not end your account session. Please sign out before continuing.')); }, TIMEOUT); };
    resetRef.current = reset;
    // Once the warning appears, require the explicit Stay signed in action.
    const activity = () => { if (!warned) reset(); };
    const events = ['pointerdown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, activity, { passive: true })); reset();
    return () => { clearTimeout(warningTimer); clearTimeout(expiryTimer); events.forEach(event => window.removeEventListener(event, activity)); };
  }, [allowed, user?.id]);
  if (expired) return <main className="admin-app p-8"><h1>Admin session timed out</h1><p className="my-4">Please sign in again to continue.</p>{error && <p role="alert">{error}</p>}<Link className="au-link" to="/login?returnTo=%2Fadmin">Sign in</Link></main>;
  if (initializing && !adminConfig.PUBLIC_DEMO_ACCESS) return <p className="p-8">Loading…</p>;
  if (!allowed) return <NotFoundPage />;
  return <><Outlet />{warning && <div className="admin-app"><section className="au-session-warning" role="alert"><h2>Your session ends in 1 minute</h2><p>Stay signed in to continue working.</p><button type="button" className="au-button primary" onClick={() => resetRef.current()}>Stay signed in</button></section></div>}</>;
};
