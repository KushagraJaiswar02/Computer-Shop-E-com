import type { AccountOrder, AccountUser, ProductRequest } from '../services/account/contracts';
import type { Product } from '../types';

export type DemoAccountUser = AccountUser & { password: string };
export const createDemoUsers = (): DemoAccountUser[] => Array.from({ length: 24 }, (_, index) => ({
  id: index === 0 ? 'mock-demo-customer' : `demo-customer-${index + 1}`,
  name: index === 0 ? 'Demo Customer' : `Demo Customer ${index + 1}`,
  email: index === 0 ? 'demo@example.test' : `customer${index + 1}@example.com`,
  phone: `+91 90000 ${String(index + 1).padStart(5, '0')}`,
  password: index === 0 ? 'DemoPass123!' : 'DemoCustomer123!',
  role: 'customer',
}));

export const createDemoAccountRecords = (products: Product[]) => {
  const statuses: AccountOrder['status'][] = ['Placed', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled', 'Delivered'];
  const orders = statuses.map((status, index) => {
    const product = products[index % products.length];
    const date = new Date(Date.now() - (index + 1) * 7 * 86400000).toISOString();
    const timeline = status === 'Cancelled' ? [{ status: 'Placed' as const, at: date }, { status: 'Cancelled' as const, at: date }] : (['Placed', 'Confirmed', 'Shipped', 'Delivered'] as const).slice(0, ['Placed', 'Confirmed', 'Shipped', 'Delivered'].indexOf(status as 'Placed') + 1).map(item => ({ status: item, at: date }));
    return { id: `mock-demo-${1001 + index}`, userId: 'mock-demo-customer', number: `DEMO-${1001 + index}`, date, status, items: [{ productId: product.id, productName: product.name, sku: product.sku, image: product.images[0] || '', price: product.price, quantity: 1 }], timeline, total: product.price, isMock: true };
  });
  const requests: ProductRequest[] = Array.from({ length: 14 }, (_, index) => ({ id: `demo-request-${index + 1}`, userId: index < 6 ? 'mock-demo-customer' : `demo-customer-${2 + index % 23}`, createdAt: new Date(Date.now() - index * 2 * 86400000).toISOString(), message: `DEMO request ${index + 1}: please check availability for a compact hardware configuration.`, status: ['Received', 'Searching', 'Available', 'Unavailable'][index % 4] as ProductRequest['status'], isMock: true }));
  return { orders, requests };
};
