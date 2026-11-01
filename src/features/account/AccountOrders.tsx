import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { accountLabels } from '../../config/account';
import { formatDate, formatPrice } from '../../lib/utils';
import { AccountOrder } from '../../services/account/contracts';
import { useBuyAgain, useOrder, useOrders } from './hooks';
import { AccountError, AccountSkeleton, AccountStatus, buttonClass, EmptyAccountState, FormMessage, linkClass, panelClass, secondaryClass } from './AccountUi';

export const AccountOrders: React.FC = () => {
  const query = useOrders(), labels = accountLabels();
  const [message, setMessage] = useState('');
  if (query.loading) return <AccountSkeleton label={`Loading ${labels.plural.toLowerCase()}`} />;
  if (query.error) return <AccountError message={query.error} retry={query.reload} />;
  return <div className="space-y-4"><h1 className="text-2xl font-bold">{labels.plural}</h1><FormMessage success={message} />
    {!query.data?.length ? <EmptyAccountState title={`No ${labels.plural.toLowerCase()} yet`} description={`Your ${labels.lower} records will appear here.`} to="/shop" action="Browse the shop" /> : query.data.map(order => <article key={order.id} className={panelClass}>
      <div className="flex flex-wrap items-start justify-between gap-3"><div><Link to={`/account/orders/${encodeURIComponent(order.id)}`} className="break-all text-sm font-bold font-sans text-accent hover:underline dark:text-accent">{labels.singular} {order.number}</Link><p className="mt-1 text-xs text-muted dark:text-muted">{formatDate(order.date)} · <span className="font-sans font-semibold price">{formatPrice(order.total)}</span></p></div><AccountStatus status={order.status} /></div>
      <div className="my-3 flex flex-wrap gap-2">{order.items.slice(0, 4).map((item, index) => <img key={`${item.productId}-${index}`} src={item.image} alt={item.productName} className="h-12 w-12 rounded-lg border border-border bg-surface-soft object-contain p-1 dark:border-border dark:bg-surface-elevated" />)}{order.items.length > 4 && <span className="self-center text-xs">+{order.items.length - 4}</span>}</div>
      <div className="flex flex-wrap items-center gap-3"><Link to={`/account/orders/${encodeURIComponent(order.id)}`} className={linkClass}>View details</Link><button type="button" onClick={() => setMessage(query.buyAgain(order))} className={secondaryClass}>Buy again</button>{order.isMock && <span className="text-xs text-muted dark:text-muted">Mock record</span>}</div>
    </article>)}
  </div>;
};

const OrderTimeline: React.FC<{ order: AccountOrder }> = ({ order }) => {
  const stages = order.status === 'Cancelled' ? [...new Set([...order.timeline.map(event => event.status), 'Cancelled'])] : ['Placed', 'Confirmed', 'Shipped', 'Delivered'];
  const current = stages.indexOf(order.status);
  return <ol aria-label="Status timeline" className="grid gap-3 sm:grid-cols-4">{stages.map((status, index) => {
    const event = order.timeline.find(event => event.status === status), done = !!event || index <= current;
    return <li key={status} aria-current={status === order.status ? 'step' : undefined} className={`rounded-lg border p-3 text-xs ${done ? 'border-primary bg-accent/10 text-accent dark:border-primary dark:bg-accent/10 dark:text-accent' : 'border-border text-muted dark:border-border dark:text-muted'}`}><p className="font-semibold">{status}</p><p className="mt-1">{event?.at ? formatDate(event.at) : done ? 'Reached' : 'Not reached'}</p></li>;
  })}</ol>;
};

export const AccountOrderDetail: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>(), query = useOrder(id), buyAgain = useBuyAgain(), labels = accountLabels();
  const [message, setMessage] = useState('');
  if (query.loading) return <AccountSkeleton label={`Loading ${labels.lower} details`} />;
  if (query.error || !query.data) return <div className="space-y-3"><AccountError message={query.error || 'Record not found.'} retry={query.reload} /><Link to="/account/orders" className={linkClass}>Back to {labels.plural.toLowerCase()}</Link></div>;
  const order = query.data;
  const invoice = order.invoiceUrl && /^(https:\/\/|\/(?!\/))/.test(order.invoiceUrl) ? order.invoiceUrl : undefined;
  return <div className="space-y-4"><Link to="/account/orders" className={linkClass}>Back to {labels.plural.toLowerCase()}</Link><section className={panelClass}>
    <div className="flex flex-wrap items-start justify-between gap-3"><div><h1 className="break-all text-xl font-bold">{labels.singular} {order.number}</h1><p className="mt-1 text-xs text-muted dark:text-muted">{formatDate(order.date)}</p></div><AccountStatus status={order.status} /></div>
    {order.isMock && <p className="mt-3 text-xs text-muted dark:text-muted">Mock record and example timeline. This is not a live purchase or shipment.</p>}
    <div className="mt-4"><OrderTimeline order={order} /></div>
  </section><section className={panelClass}><h2 className="mb-3 text-base font-semibold">Items</h2><ul className="divide-y divide-border dark:divide-border">{order.items.map((item, index) => <li key={`${item.productId}-${index}`} className="flex items-start gap-3 py-3"><img src={item.image} alt={item.productName} className="h-14 w-14 shrink-0 rounded-lg bg-surface-soft object-contain p-1 dark:bg-surface-elevated" /><div className="min-w-0 flex-1"><p className="text-sm font-semibold">{item.productName}</p><p className="mt-1 text-xs text-muted dark:text-muted">{item.quantity} × {formatPrice(item.price)}</p><p className="mt-1 font-sans text-sm font-bold price">{formatPrice(item.price * item.quantity)}</p></div></li>)}</ul><div className="mt-3 flex flex-wrap justify-between gap-2 border-t border-border pt-3 font-bold dark:border-border"><span>Total</span><span className="font-sans price">{formatPrice(order.total)}</span></div>
    <div className="mt-4 flex flex-wrap items-center gap-3"><button type="button" onClick={() => setMessage(buyAgain(order))} className={buttonClass}>Buy again</button>{invoice ? <a href={invoice} download className={secondaryClass}>Download invoice</a> : <span title="A real invoice is not available for this mock record."><button type="button" disabled className={secondaryClass}>Download invoice</button></span>}</div><div className="mt-3"><FormMessage success={message} /></div>
  </section></div>;
};
