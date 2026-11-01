import React from 'react';
import { Link } from 'react-router-dom';
import { accountLabels } from '../../config/account';
import { formatDate, formatPrice } from '../../lib/utils';
import { useAuth } from './useAuth';
import { useOrders, useProductRequests } from './hooks';
import { AccountError, AccountSkeleton, AccountStatus, linkClass, panelClass } from './AccountUi';

export const AccountDashboard: React.FC = () => {
  const { user } = useAuth(), orders = useOrders(), requests = useProductRequests(), labels = accountLabels();
  if (orders.loading || requests.loading) return <AccountSkeleton label="Loading dashboard" />;
  if (orders.error || requests.error) return <AccountError message={orders.error || requests.error} retry={() => { orders.reload(); requests.reload(); }} />;
  const latest = orders.data?.[0], openRequests = requests.data?.filter(request => request.status === 'Received' || request.status === 'Searching').length || 0;
  return <div className="space-y-4">
    <h1 className="text-2xl font-bold text-main dark:text-main">Hello, {user?.name.split(' ')[0]}</h1>
    <div className="grid gap-4 md:grid-cols-2"><section className={panelClass}><h2 className="text-sm font-bold">Latest {labels.lower}</h2>{latest ? <div className="mt-3 space-y-2"><p className="break-all font-sans text-sm">{latest.number}</p><p className="text-xs text-muted dark:text-muted">{formatDate(latest.date)} · {formatPrice(latest.total)}</p><AccountStatus status={latest.status} /><div><Link className={linkClass} to={`/account/orders/${encodeURIComponent(latest.id)}`}>View {labels.lower}</Link></div>{latest.isMock && <p className="text-xs text-muted dark:text-muted">Example record</p>}</div> : <div className="mt-3"><p className="text-sm text-muted dark:text-muted">Your first {labels.lower} will appear here.</p><Link to="/shop" className={linkClass}>Browse the shop</Link></div>}</section>
      <section className={panelClass}><h2 className="text-sm font-bold">Open product requests</h2><p className="my-3 text-3xl font-bold font-sans text-accent dark:text-accent">{openRequests}</p><p className="text-xs text-muted dark:text-muted">Requests marked Received or Searching.</p><Link to="/account/requests" className={linkClass}>View my requests</Link></section>
    </div>
    <section className={panelClass}><h2 className="mb-2 text-sm font-bold">Quick links</h2><div className="flex flex-wrap gap-x-6 gap-y-1"><Link to="/account/details" className={linkClass}>Edit account details</Link><Link to="/enquiry?request=product" className={linkClass}>Request a product</Link></div></section>
  </div>;
};
