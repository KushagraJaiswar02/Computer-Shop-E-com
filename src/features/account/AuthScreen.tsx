import { brandConfig } from '../../config/brand';
import React, { useState } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { useAuth } from './useAuth';
import { accountConfig } from '../../config/account';
import { errorMessage, FieldErrors, safeReturnTo, validateLogin, validateRegistration } from '../../services/account/validation';
import { AccountError, AccountField, AccountSkeleton, buttonClass, FormMessage, linkClass, panelClass } from './AccountUi';

// Add future Google/phone OTP button components through this slot; no providers are implemented here.
export const AuthProviderButtons: React.FC<{ children?: React.ReactNode }> = ({ children }) => children ? <div aria-label="Other sign-in options" className="mt-5 space-y-2 border-t border-border pt-4 dark:border-border">{children}</div> : null;

export const AuthScreen: React.FC<{ register?: boolean; providerButtons?: React.ReactNode }> = ({ register = false, providerButtons }) => {
  const auth = useAuth();
  const [params] = useSearchParams();
  const returnTo = safeReturnTo(params.get('returnTo'));
  const [values, setValues] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [error, setError] = useState('');
  const set = (key: keyof typeof values, value: string) => { setValues(current => ({ ...current, [key]: value })); setErrors(current => ({ ...current, [key]: '' })); setError(''); };
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const next = register ? validateRegistration(values, values.confirmPassword) : validateLogin(values);
    setErrors(next); setError('');
    if (Object.keys(next).length) return;
    try { if (register) await auth.register(values); else await auth.login(values); }
    catch (failure) { setError(errorMessage(failure)); }
  };
  if (!auth.initializing && auth.user && !auth.busy) return <Navigate to={returnTo} replace />;
  const otherPath = `${register ? '/login' : '/register'}?returnTo=${encodeURIComponent(returnTo)}`;

  return <div className="account-ui shop-container py-8 sm:py-12">
    {auth.initializing ? <AccountSkeleton label="Checking your account session" /> : auth.error ? <AccountError message={auth.error} retry={auth.refresh} /> : <div className={`${panelClass} auth-panel mx-auto max-w-lg`}>
      <Link to="/" className="shop-logo mb-6"><img src={brandConfig.logoPath} alt={brandConfig.logoAlt} width={40} height={40} /><span><strong>{brandConfig.shopName}</strong><small>{brandConfig.tagline}</small></span></Link>
      <h1 className="text-2xl font-bold text-main dark:text-main">{register ? 'Create an account' : 'Sign in'}</h1>
      <p className="mt-2 text-sm text-muted dark:text-muted">{register ? 'Save your account details and keep your catalog activity together.' : 'Access your saved account activity.'}</p>
      {accountConfig.SHOW_MOCK_NOTICE && <p className="my-5 rounded-lg border border-warning bg-warning/10 p-3 text-xs text-warning-ink dark:border-warning dark:bg-warning/10 dark:text-warning-ink">Mock accounts only. Data and passwords are stored in this browser. Do not use a real password.</p>}
      <form noValidate onSubmit={submit} className="space-y-4">
        {register && <AccountField label="Full name" name="name" autoComplete="name" required value={values.name} onChange={value => set('name', value)} error={errors.name} />}
        <AccountField label="Email address" name="email" type="email" autoComplete="email" required value={values.email} onChange={value => set('email', value)} error={errors.email} />
        {register && <AccountField label="Phone number" name="phone" type="tel" autoComplete="tel" required value={values.phone} onChange={value => set('phone', value)} error={errors.phone} />}
        <AccountField label="Password" name="password" type="password" autoComplete={register ? 'new-password' : 'current-password'} required value={values.password} onChange={value => set('password', value)} error={errors.password} />
        {register && <AccountField label="Confirm password" name="confirmPassword" type="password" autoComplete="new-password" required value={values.confirmPassword} onChange={value => set('confirmPassword', value)} error={errors.confirmPassword} />}
        <FormMessage error={error} />
        <button type="submit" disabled={auth.busy} className={`${buttonClass} w-full`}>{auth.busy ? (register ? 'Creating account…' : 'Signing in…') : (register ? 'Create account' : 'Sign in')}</button>
      </form>
      <AuthProviderButtons>{providerButtons}</AuthProviderButtons>
      <p className="mt-4 text-sm text-muted dark:text-muted">{register ? 'Already have an account? ' : 'New here? '}<Link to={otherPath} className={linkClass}>{register ? 'Sign in' : 'Create account'}</Link></p>
      {!register && accountConfig.ENABLE_DEMO_SEED && <div className="mt-4 rounded-lg bg-surface-soft p-3 text-xs dark:bg-surface-elevated"><p className="mb-1 font-semibold">Seeded mock account</p><p className="break-all font-sans">{accountConfig.DEMO_USER.email}</p><p className="font-sans">{accountConfig.DEMO_USER.password}</p><p className="mt-1 text-muted dark:text-muted">Example records only; nothing is sent to the shop.</p></div>}
    </div>}
  </div>;
};
