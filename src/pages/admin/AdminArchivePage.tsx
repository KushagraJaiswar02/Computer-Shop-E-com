import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { AdminButton, AdminList, AdminModal, Field, useAdminToast } from './AdminUi';
import { archivedProducts, permanentlyDeleteProduct, restoreArchivedProduct } from './archiveActions';
export const AdminArchivePage: React.FC = () => {
  const [items, setItems] = useState(archivedProducts), [deleting, setDeleting] = useState<Product | null>(null), [confirmation, setConfirmation] = useState(''), [error, setError] = useState('');
  const { addProduct } = useStore(), toast = useAdminToast();
  const restore = (product: Product) => { if (!window.confirm(`Restore ${product.name} to your shop?`)) return; try { restoreArchivedProduct(product, addProduct); setItems(archivedProducts()); toast('Product restored.'); } catch (failure) { toast(failure instanceof Error ? failure.message : 'Could not restore.'); } };
  return <><AdminList title="Archive" description="Archived products are hidden from the shop. Restore them whenever you need them." rows={items} searchText={p => `${p.name} ${p.sku}`} columns={[
    { key: 'name', label: 'Product', sortValue: p => p.name, render: p => <div><strong>{p.name}</strong><small className="block au-muted">{p.sku}</small></div> },
    { key: 'category', label: 'Category', sortValue: p => p.categoryName, render: p => p.categoryName },
    { key: 'actions', label: 'Actions', render: p => <div className="au-actions"><AdminButton onClick={() => restore(p)}>Restore product</AdminButton><AdminButton variant="danger" onClick={() => { setDeleting(p); setConfirmation(''); setError(''); }}>Delete permanently</AdminButton></div> },
  ]} />{deleting && <AdminModal title="Permanently delete product?" onClose={() => setDeleting(null)}><p className="mb-5">{deleting.name} will be removed from the archive. This cannot be undone.</p><Field label="Type DELETE to confirm" error={error}><input value={confirmation} onChange={e => setConfirmation(e.target.value)} autoComplete="off" /></Field><div className="au-actions mt-5"><AdminButton onClick={() => setDeleting(null)}>Keep product</AdminButton><AdminButton variant="danger" disabled={confirmation !== 'DELETE'} onClick={() => { try { permanentlyDeleteProduct(deleting); setItems(archivedProducts()); setDeleting(null); toast('Product permanently deleted.'); } catch (failure) { setError(failure instanceof Error ? failure.message : 'Could not delete.'); } }}>Delete permanently</AdminButton></div></AdminModal>}</>;
};
