import type { HardwareEnquiry, Order, Product } from '../types';

const atDaysAgo = (days: number, hour = 11) => new Date(Date.now() - days * 86400000 + hour * 3600000).toISOString();
const address = (index: number) => ({ id: `demo-address-${index}`, fullName: `Demo Customer ${index + 1}`, street: `${100 + index} Example Lane`, city: index % 2 ? 'Sample Nagar' : 'Demo City', state: 'Example State', postalCode: `5600${String(index).padStart(2, '0')}`, phone: `+91 90000 ${String(index + 1).padStart(5, '0')}`, isDefault: true });

export const createDemoOrders = (products: Product[]): Order[] => Array.from({ length: 110 }, (_, index) => {
  const itemCount = 1 + index % 4;
  const items = Array.from({ length: itemCount }, (_, itemIndex) => {
    const product = products[(index * 3 + itemIndex * 7) % products.length];
    const quantity = 1 + ((index + itemIndex) % 2);
    return { productId: product.id, productName: product.name, sku: product.sku, image: product.images[0] || '', price: product.price, quantity };
  });
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = index % 4 === 0 ? Math.round(subtotal * 0.08) : 0;
  const shipping = subtotal - discount > 30000 ? 0 : 499;
  const tax = 0;
  const status: Order['status'][] = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  return { id: `demo-order-${String(index + 1).padStart(3, '0')}`, orderNumber: `DEMO-${String(9001 + index)}`, date: atDaysAgo((index * 7) % 90, 9 + index % 10), items, subtotal, discount, shipping, tax, total: subtotal - discount + shipping + tax, shippingAddress: address(index % 24), status: status[index % status.length], paymentMethod: index % 2 ? 'upi_demo' : 'card_demo', paymentStatus: index % 5 === 4 ? 'Payment Pending' : 'Demo Success', trackingNumber: index % 5 === 2 ? `DEMO-TRACK-${index + 1}` : undefined, estimatedDelivery: atDaysAgo(-3), };
});

export const createDemoEnquiries = (): HardwareEnquiry[] => Array.from({ length: 12 }, (_, index) => ({
  id: `demo-enquiry-${index + 1}`, createdAt: atDaysAgo(index * 3), customerName: `Demo Enquirer ${index + 1}`, email: `enquirer${index + 1}@example.com`, phone: `+91 90000 ${String(10001 + index)}`, companyName: index % 3 ? undefined : `Example Studio ${index + 1}`, enquiryType: ['custom_pc_build', 'bulk_procurement', 'compatibility_check', 'component_availability'][index % 4] as HardwareEnquiry['enquiryType'], targetBudget: `₹${(50000 + index * 25000).toLocaleString('en-IN')}`, message: `DEMO enquiry ${index + 1}: please provide availability and a sample quotation.`, status: ['New', 'In Review', 'Quotation Sent', 'Closed'][index % 4] as HardwareEnquiry['status'],
}));
