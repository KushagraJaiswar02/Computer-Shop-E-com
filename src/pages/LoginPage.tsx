import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthScreen } from '../features/account/AuthScreen';
import { useAuth } from '../features/account/useAuth';
import { adminConfig } from '../config/admin';
const DemoAdminButton: React.FC = () => {
  const auth = useAuth(), navigate = useNavigate();
  const [error, setError] = useState('');
  return <div><p className="mb-2 text-xs text-warning-ink dark:text-warning-ink">Demo mode · try the shop owner’s workspace</p><button type="button" disabled={auth.busy} className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-on-primary disabled:opacity-50" onClick={async () => { try { setError(''); await auth.login(adminConfig.DEMO_ADMIN); navigate('/admin'); } catch (failure) { setError(failure instanceof Error ? failure.message : 'Could not sign in.'); } }}>{auth.busy ? 'Signing in…' : 'Sign in as demo admin'}</button>{error && <p role="alert" className="mt-2 text-sm text-danger-ink">{error}</p>}</div>;
};
export const LoginPage: React.FC = () => <AuthScreen providerButtons={adminConfig.DEMO_MODE ? <DemoAdminButton /> : undefined} />;
