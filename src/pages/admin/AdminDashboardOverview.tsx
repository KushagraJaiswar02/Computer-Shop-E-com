import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Plus, Image, Tag, MessageSquare, Package, ShoppingBag, AlertTriangle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatPrice, formatDate } from '../../lib/utils';
import { Badge, PageHeading, Panel } from './AdminUi';
export const AdminDashboardOverview: React.FC = () => {
  const { products, orders, enquiries } = useStore();
  const [period, setPeriod] = useState('all');
  const after = period === 'all' ? 0 : Date.now() - Number(period) * 86400000;
  const periodOrders = orders.filter(order => new Date(order.date).getTime() >= after);
  const revenue = periodOrders.filter(order => order.status !== 'Cancelled').reduce((sum, order) => sum + order.total, 0);
  const pending = orders.filter(order => order.status === 'Pending');
  const open = enquiries.filter(item => ['New', 'In Review'].includes(item.status));
  const stock = products.filter(product => product.stock < 10 || product.stockStatus === 'low_stock');
  const recentOrders = [...periodOrders].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);
  const recentEnquiries = [...enquiries].filter(e => new Date(e.createdAt).getTime() >= after).sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 4);
  return <div className="au-stack"><PageHeading title="Your shop at a glance" description="A good place to start your day. See what needs doing and keep your shop moving." />
    <section><h2 className="mb-4">Needs your attention</h2><div className="au-grid-3">{[
      { title: 'New orders', count: pending.length, detail: 'Ready for you to review', to: '/admin/orders?status=new', Icon: ShoppingBag },
      { title: 'Open enquiries', count: open.length, detail: 'Customers waiting to hear from you', to: '/admin/enquiries?status=open', Icon: MessageSquare },
      { title: 'Low or out of stock', count: stock.length, detail: 'Products to check and restock', to: '/admin/products?stock=low', Icon: AlertTriangle },
    ].map(card => <Link className="au-panel au-attention" key={card.title} to={card.to}><div className="au-actions justify-between"><card.Icon size={20} className="text-accent" /><ArrowUpRight size={17} className="au-muted" /></div><div className="au-stat">{card.count}</div><h3>{card.title}</h3><p className="mt-1">{card.detail}</p></Link>)}</div></section>
    <section><h2 className="mb-4">Quick actions</h2><div className="au-quick-actions">{[
      { label: 'Add product', to: '/admin/products?action=add', Icon: Plus }, { label: 'Change homepage banner', to: '/admin/banners', Icon: Image }, { label: 'Add a deal', to: '/admin/deals', Icon: Tag }, { label: 'View enquiries', to: '/admin/enquiries?status=open', Icon: MessageSquare },
    ].map(action => <Link key={action.to} className="au-button" to={action.to}><action.Icon size={16} />{action.label}</Link>)}</div></section>
    <section><div className="au-page-heading mb-4"><h2>Shop snapshot</h2><label className="au-actions text-xs au-muted">Show<select aria-label="Snapshot period" value={period} onChange={event => setPeriod(event.target.value)}><option value="7">Last 7 days</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option><option value="all">All time</option></select></label></div><div className="au-grid-4">{[
      { label: 'Orders', value: periodOrders.length, hint: 'Orders in this period' },
      { label: 'Revenue', value: formatPrice(revenue), hint: 'Excludes cancelled orders · demo totals' },
      { label: 'New customers', value: '—', hint: 'Signup dates are not recorded in this demo' },
      { label: 'Products live', value: products.length, hint: 'Current catalog · archived products excluded' },
    ].map(stat => <div key={stat.label} className="au-panel"><span className="au-muted text-xs">{stat.label}</span><div className="au-stat">{stat.value}</div><p className="au-muted text-xs">{stat.hint}</p></div>)}</div></section>
    <div className="au-grid-2"><Panel title="Recent orders">{recentOrders.length ? recentOrders.map(order => <Link className="au-activity" key={order.id} to={`/admin/orders?order=${order.id}`}><div><strong>#{order.orderNumber}</strong><small>{order.shippingAddress.fullName} · {order.items.length} item(s) · {order.paymentMethod === 'card_demo' ? 'Demo card' : order.paymentMethod.replace(/_/g, ' ')}<br />{formatDate(order.date)}</small></div><div className="text-right"><strong>{formatPrice(order.total)}</strong><small>{order.status}</small></div></Link>) : <p className="au-muted mb-4">No orders in this period. Try a longer period.</p>}<Link className="au-link inline-block mt-4 text-xs" to="/admin/orders">View all orders →</Link></Panel><Panel title="Recent enquiries">{recentEnquiries.length ? recentEnquiries.map(enquiry => <Link className="au-activity" key={enquiry.id} to={`/admin/enquiries?enquiry=${enquiry.id}`}><div><strong>{enquiry.customerName}</strong><small>{enquiry.enquiryType.replace(/_/g, ' ')}<br />{formatDate(enquiry.createdAt)}</small></div><Badge>{enquiry.status}</Badge></Link>) : <p className="au-muted mb-4">No enquiries in this period. Try a longer period.</p>}<Link className="au-link inline-block mt-4 text-xs" to="/admin/enquiries">View all enquiries →</Link></Panel></div>
    <Panel title="Stock to keep an eye on">{stock.slice(0, 5).map(product => <Link className="au-activity" key={product.id} to={`/admin/products?edit=${product.id}`}><div><strong>{product.name}</strong><small>Stock code: {product.sku}</small></div><Badge>{product.stock} units</Badge></Link>)}{!stock.length && <p className="au-muted">All products have healthy stock levels.</p>}<Link className="au-link inline-block mt-4 text-xs" to="/admin/products?stock=low">Review stock →</Link></Panel>
  </div>;
};
