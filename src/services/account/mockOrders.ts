import { AccountOrderStatus, OrdersService } from './contracts';
import { withUser } from './mockStorage';

export const mockOrdersService: OrdersService = {
  listOrders: () => withUser((db, user) => db.orders.filter(order => order.userId === user.id).sort((a, b) => b.date.localeCompare(a.date))),
  getOrder: id => withUser((db, user) => { const order = db.orders.find(order => order.id === id && order.userId === user.id); if (!order) throw new Error('This record was not found in your account.'); return order; }),
  captureLocalOrder: order => withUser((db, user) => {
    if (db.orders.some(record => record.id === order.id)) return;
    const statuses: Record<typeof order.status, AccountOrderStatus> = { Pending: 'Placed', Processing: 'Confirmed', Shipped: 'Shipped', Delivered: 'Delivered', Cancelled: 'Cancelled' };
    const status = statuses[order.status];
    db.orders.push({ id: order.id, userId: user.id, number: order.orderNumber, date: order.date, total: order.total, status, items: order.items, timeline: [{ status, at: order.date }], isMock: true });
  }, true),
};
