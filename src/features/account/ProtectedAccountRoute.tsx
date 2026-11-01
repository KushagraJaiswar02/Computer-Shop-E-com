import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';
import { AccountError, AccountSkeleton } from './AccountUi';

export const ProtectedAccountRoute: React.FC = () => {
  const auth = useAuth(), location = useLocation();
  if (auth.initializing) return <div className="account-ui shop-container py-8"><AccountSkeleton /></div>;
  if (auth.error) return <div className="account-ui shop-container py-8"><AccountError message={auth.error} retry={auth.refresh} /></div>;
  if (!auth.user) return <Navigate replace to={`/login?returnTo=${encodeURIComponent(location.pathname + location.search + location.hash)}`} />;
  return <Outlet />;
};
export const LegacyAuthRedirect: React.FC<{ to: string }> = ({ to }) => { const { search } = useLocation(); return <Navigate to={`${to}${search}`} replace />; };
