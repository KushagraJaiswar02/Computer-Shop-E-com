import React from 'react';
import { Link } from 'react-router-dom';
import { useProductRequests } from './hooks';
import { AccountError, AccountSkeleton, AccountStatus, EmptyAccountState, linkClass, panelClass } from './AccountUi';
import { formatDate } from '../../lib/utils';

export const AccountRequests: React.FC = () => {
  const query = useProductRequests();
  if (query.loading) return <AccountSkeleton label="Loading product requests" />;
  if (query.error) return <AccountError message={query.error} retry={query.reload} />;
  if (!query.data?.length) return <EmptyAccountState title="No product requests yet" description="Submit a product request while signed in to keep it here." to="/enquiry?request=product" action="Request a product" />;
  return <div className="space-y-4"><div className="flex flex-wrap items-center justify-between gap-2"><h1 className="text-2xl font-bold">My requests</h1><Link to="/enquiry?request=product" className={linkClass}>Request a product</Link></div>{query.data.map(request => <article key={request.id} className={panelClass}><div className="mb-3 flex flex-wrap items-center justify-between gap-2"><span className="text-xs text-muted dark:text-muted">{formatDate(request.createdAt)}</span><AccountStatus status={request.status} /></div><p className="whitespace-pre-wrap text-sm text-main dark:text-main">{request.message}</p>{request.isMock && <p className="mt-3 text-xs text-muted dark:text-muted">Local mock request · not sent to a retailer</p>}</article>)}</div>;
};
