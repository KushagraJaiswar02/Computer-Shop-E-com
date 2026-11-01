import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { Order } from '../../types';
import { formatDate, formatPrice } from '../../lib/utils';
import { AdminButton, AdminList, AdminModal, Badge, Panel } from './AdminUi';
export const AdminOrdersPage: React.FC = () => {
  const { orders } = useStore(), [params, setParams] = useSearchParams();
  const [selected, setSelected] = useState<Order | null>(null);
  const status = params.get('status') || '';
  const rows = useMemo(() => orders.filter(order => !status || (status === 'new' ? ['Pending', 'Placed', 'Confirmed'].includes(order.status) : order.status === status)), [orders, status]);
  const order = selected || orders.find(o => o.id === params.get('order'));
  const close = () => { setSelected(null); setParams(previous => { const next = new URLSearchParams(previous); next.delete('order'); return next; }); };
  return <><AdminList title="Orders" description="Find a purchase and check what needs delivering." rows={rows} searchText={o => `${o.orderNumber} ${o.shippingAddress.fullName} ${o.shippingAddress.phone} ${o.shippingAddress.city} ${o.id}`} initialSearch={params.get('q') || ''} filters={<select aria-label="Filter order status" value={status} onChange={event => setParams(previous => { const next = new URLSearchParams(previous); event.target.value ? next.set('status', event.target.value) : next.delete('status'); return next; })}><option value="">All statuses</option><option value="new">New orders</option>{Array.from(new Set(orders.map(o => o.status))).map(status => <option key={status}>{status}</option>)}</select>} emptyAction={<AdminButton onClick={() => setParams({})}>Show all orders</AdminButton>} columns={[
    { key: 'number', label: 'Order', sortValue: o => o.orderNumber, render: o => <strong>#{o.orderNumber}</strong> },
    { key: 'customer', label: 'Customer', sortValue: o => o.shippingAddress.fullName, render: o => <div>{o.shippingAddress.fullName}<small className="block au-muted">{o.shippingAddress.city}, {o.shippingAddress.state}</small></div> },
    { key: 'date', label: 'Date', sortValue: o => o.date, render: o => formatDate(o.date) },
    { key: 'items', label: 'Items', sortValue: o => o.items.reduce((s, i) => s + i.quantity, 0), render: o => o.items.reduce((s, i) => s + i.quantity, 0) },
    { key: 'total', label: 'Total', sortValue: o => o.total, render: o => formatPrice(o.total) },
    { key: 'status', label: 'Status', sortValue: o => o.status, render: o => <Badge>{o.status}</Badge> },
    { key: 'details', label: 'Details', render: o => <AdminButton onClick={() => setSelected(o)}>View order</AdminButton> },
  ]} />{order && <AdminModal title={`Order #${order.orderNumber}`} onClose={close}><div className="au-stack"><div className="au-actions"><Badge>{order.status}</Badge><span className="au-muted">{formatDate(order.date)}</span></div><Panel title="Delivery address"><p><strong>{order.shippingAddress.fullName}</strong><br />{order.shippingAddress.street}<br />{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br />Phone: {order.shippingAddress.phone}</p></Panel><Panel title="Items">{order.items.map((item, i) => <div className="au-activity" key={i}><span>{item.productName}<small>Quantity: {item.quantity}</small></span><strong>{formatPrice(item.price * item.quantity)}</strong></div>)}</Panel><div className="au-activity"><span>Payment method</span><span>{order.paymentMethod === 'card_demo' ? 'Demo card' : order.paymentMethod}</span></div><div className="au-activity"><strong>Total</strong><strong>{formatPrice(order.total)}</strong></div><AdminButton onClick={close}>Close order</AdminButton></div></AdminModal>}</>;
};
