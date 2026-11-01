import { Product } from '../../types';
import { authorize, audit } from '../../services/admin/mockAdmin';
const key = 'compshop_archived_products';
export function archivedProducts(): Product[] { try { const data = JSON.parse(localStorage.getItem(key) || '[]'); return Array.isArray(data) ? data : []; } catch { return []; } }
export function restoreArchivedProduct(product: Product, addProduct: (product: Product) => void) {
  const user = authorize('products.write');
  const existing = archivedProducts().find(item => item.id === product.id);
  if (!existing) throw new Error('This product has already been restored or deleted.');
  addProduct(existing);
  localStorage.setItem(key, JSON.stringify(archivedProducts().filter(item => item.id !== product.id)));
  audit(user, 'product', product.id, 'restore', existing, existing);
}
export function permanentlyDeleteProduct(product: Product) {
  const user = authorize('products.write');
  localStorage.setItem(key, JSON.stringify(archivedProducts().filter(item => item.id !== product.id)));
  audit(user, 'product', product.id, 'delete', product, null);
}
