import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Plus, Minus, Archive, Pencil } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product, StockStatus } from '../../types';
import { formatPrice } from '../../lib/utils';
import { AdminButton, AdminList, AdminModal, Badge, Field, FormSection, SaveBar, useAdminToast, useUnsavedChanges } from './AdminUi';
import { restoreArchivedProduct } from './archiveActions';

interface ProductForm { name: string; brandId: string; categoryId: string; sku: string; price: number; stock: number; stockStatus: StockStatus; shortDescription: string; imageUrl: string; }
const blank: ProductForm = { name: '', brandId: '', categoryId: '', sku: '', price: 0, stock: 0, stockStatus: 'out_of_stock', shortDescription: '', imageUrl: '' };
const fromProduct = (p: Product): ProductForm => ({ name: p.name, brandId: p.brandId, categoryId: p.categoryId, sku: p.sku, price: p.price, stock: p.stock, stockStatus: p.stockStatus, shortDescription: p.shortDescription, imageUrl: p.images[0] || '' });
const ProductEditor: React.FC<{ product: Product | null; onClose(): void }> = ({ product, onClose }) => {
  const { products, brands, categories, addProduct, updateProduct } = useStore(), toast = useAdminToast();
  const initial = useMemo(() => product ? fromProduct(product) : blank, [product]);
  const [form, setForm] = useState<ProductForm>(initial), [errors, setErrors] = useState<Record<string, string>>({});
  const dirty = JSON.stringify(initial) !== JSON.stringify(form);
  useUnsavedChanges(dirty);
  const set = <K extends keyof ProductForm>(key: K, value: ProductForm[K]) => { setForm(current => ({ ...current, [key]: value })); setErrors(current => ({ ...current, [key]: '' })); };
  const close = () => { if (!dirty || window.confirm('Discard your unsaved product changes?')) onClose(); };
  const save = () => {
    const next: Record<string, string> = {};
    if (!form.name.trim() || form.name.length > 180) next.name = 'Enter a product name of 1–180 characters.';
    if (!brands.some(b => b.id === form.brandId)) next.brandId = 'Choose a brand.';
    if (!categories.some(c => c.id === form.categoryId)) next.categoryId = 'Choose a category.';
    if (!form.sku.trim() || form.sku.length > 80) next.sku = 'Enter a stock code of 1–80 characters.';
    else if (products.some(p => p.id !== product?.id && p.sku.toLowerCase() === form.sku.trim().toLowerCase())) next.sku = 'Another product already uses this stock code.';
    if (!Number.isFinite(form.price) || form.price < 0 || form.price > 100000000) next.price = 'Enter a price between 0 and 100,000,000.';
    if (!Number.isInteger(form.stock) || form.stock < 0 || form.stock > 1000000) next.stock = 'Enter a whole stock quantity between 0 and 1,000,000.';
    if (form.shortDescription.length > 2000) next.shortDescription = 'Keep the description below 2,000 characters.';
    if (form.imageUrl && !/^(https?:\/\/|\/[^/]|data:image\/(png|jpeg|webp);base64,)/i.test(form.imageUrl)) next.imageUrl = 'Use an http(s) image URL or a local image path.';
    setErrors(next); if (Object.keys(next).length) return;
    const brand = brands.find(b => b.id === form.brandId)!, category = categories.find(c => c.id === form.categoryId)!;
    const values = { name: form.name.trim(), brandId: brand.id, brandName: brand.name, categoryId: category.id, categoryName: category.name, sku: form.sku.trim(), price: form.price, stock: form.stock, stockStatus: form.stockStatus, shortDescription: form.shortDescription.trim(), images: [form.imageUrl, ...(product?.images.slice(1) || [])].filter(Boolean) };
    try {
      if (product) updateProduct(product.id, values);
      else addProduct({ ...values, id: `prod-${crypto.randomUUID()}`, slug: `${form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${Date.now().toString().slice(-5)}`, description: values.shortDescription, attributes: [{ name: 'Model SKU', value: values.sku, group: 'General' }], warrantyMonths: 0, createdAt: new Date().toISOString() });
      toast(product ? 'Product updated.' : 'Product added.'); onClose();
    } catch (failure) { setErrors({ save: failure instanceof Error ? failure.message : 'Could not save the product.' }); }
  };
  return <AdminModal title={product ? 'Edit product' : 'Add product'} onClose={close} wide><form onSubmit={event => { event.preventDefault(); save(); }} noValidate><div className="au-grid-2"><div><FormSection title="Product details" help="Use the name and stock code you use in your shop."><Field label="Product name *" error={errors.name}><input autoFocus maxLength={180} value={form.name} onChange={e => set('name', e.target.value)} /></Field><Field label="Stock code (SKU) *" help="A unique code that helps you identify this item." error={errors.sku}><input value={form.sku} maxLength={80} onChange={e => set('sku', e.target.value)} /></Field><Field label="Brand *" error={errors.brandId}><select value={form.brandId} onChange={e => set('brandId', e.target.value)}><option value="">Choose a brand</option>{brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}</select></Field><Field label="Category *" error={errors.categoryId}><select value={form.categoryId} onChange={e => set('categoryId', e.target.value)}><option value="">Choose a category</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></Field></FormSection><FormSection title="Price and stock"><Field label="Selling price (₹) *" error={errors.price}><input type="number" min={0} step="0.01" value={form.price} onChange={e => set('price', Number(e.target.value))} /></Field><Field label="Units in stock *" error={errors.stock}><input type="number" min={0} step={1} value={form.stock} onChange={e => { const stock = Number(e.target.value); setForm(current => ({ ...current, stock, stockStatus: stock === 0 ? 'out_of_stock' : stock < 5 ? 'low_stock' : 'in_stock' })); }} /></Field><Field label="Availability" help="Backorder lets shoppers know this item needs ordering."><select value={form.stockStatus} onChange={e => set('stockStatus', e.target.value as StockStatus)}><option value="in_stock">In stock</option><option value="low_stock">Low stock</option><option value="out_of_stock">Out of stock</option><option value="backorder">Backorder</option></select></Field></FormSection><FormSection title="Photo and description"><Field label="Image URL" help="Paste a link to the product photo. Additional existing images are kept." error={errors.imageUrl}><input value={form.imageUrl} onChange={e => set('imageUrl', e.target.value)} /></Field><Field label="Short description" error={errors.shortDescription}><textarea rows={4} maxLength={2000} value={form.shortDescription} onChange={e => set('shortDescription', e.target.value)} /></Field></FormSection></div><aside><h3 className="mb-3">Product card preview</h3><div className="au-preview">{form.imageUrl && !errors.imageUrl && <img src={form.imageUrl} alt={form.name || 'Product preview'} />}<small className="au-muted">{brands.find(b => b.id === form.brandId)?.name || 'Brand'}</small><h2 className="mt-2">{form.name || 'Your product name'}</h2><p className="au-stat price">{formatPrice(Number.isFinite(form.price) ? form.price : 0)}</p><p className="au-muted">{form.shortDescription || 'Your short description appears here.'}</p><Badge>{form.stock} in stock</Badge></div></aside></div>{errors.save && <p className="au-error" role="alert">{errors.save}</p>}<SaveBar dirty={dirty} onSave={save} onDiscard={() => { setForm(initial); setErrors({}); }} label={product ? 'Save product' : 'Add product'} /></form></AdminModal>;
};
export const AdminProductsPage: React.FC = () => {
  const { products, categories, updateProduct, deleteProduct, addProduct } = useStore(), toast = useAdminToast();
  const [params, setParams] = useSearchParams();
  const [category, setCategory] = useState('');
  const stock = params.get('stock') || '';
  const setParam = (name: string, value: string) => setParams(previous => { const next = new URLSearchParams(previous); if (value) next.set(name, value); else next.delete(name); return next; });
  const editing = products.find(p => p.id === params.get('edit')) || null;
  const open = params.get('action') === 'add' || !!editing;
  const archive = (items: Product[]) => {
    if (!window.confirm(`Archive ${items.length === 1 ? items[0].name : `${items.length} products`}? You can restore them later.`)) return;
    try { items.forEach(item => deleteProduct(item.id)); toast(`${items.length === 1 ? 'Product' : `${items.length} products`} archived.`, () => items.forEach(item => restoreArchivedProduct(item, addProduct))); } catch (failure) { toast(failure instanceof Error ? failure.message : 'Could not archive.'); }
  };
  const rows = useMemo(() => products.filter(p => (!category || p.categoryId === category) && (stock !== 'low' || p.stock < 10 || p.stockStatus === 'low_stock') && (stock !== 'out' || p.stock === 0)), [products, category, stock]);
  const adjust = (p: Product, difference: number) => { const value = Math.max(0, p.stock + difference); try { updateProduct(p.id, { stock: value, stockStatus: value === 0 ? 'out_of_stock' : value < 5 ? 'low_stock' : 'in_stock' }); } catch (failure) { toast(failure instanceof Error ? failure.message : 'Could not update stock.'); } };
  return <><AdminList title="All products" description="Keep your product details, prices and stock up to date." rows={rows} initialSearch={params.get('q') || ''} searchText={p => `${p.name} ${p.sku} ${p.brandName}`} action={<AdminButton variant="primary" onClick={() => setParam('action', 'add')}><Plus size={16} /> Add product</AdminButton>} emptyAction={<div className="au-actions justify-center"><AdminButton onClick={() => { setCategory(''); setParams({}); }}>Clear filters</AdminButton><AdminButton onClick={() => setParam('action', 'add')}>Add your first product</AdminButton></div>} filters={<><select aria-label="Filter by category" value={category} onChange={e => setCategory(e.target.value)}><option value="">All categories</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select><select aria-label="Filter by stock" value={stock} onChange={e => setParam('stock', e.target.value)}><option value="">All stock levels</option><option value="low">Low or out of stock</option><option value="out">Out of stock</option></select></>} bulkActions={[{ label: 'Archive selected', run: archive }]} columns={[
    { key: 'name', label: 'Product', sortValue: p => p.name, render: p => <div className="au-product">{p.images[0] && <img src={p.images[0]} alt="" />}<div><strong>{p.name}</strong><small>{p.sku} · {p.brandName}</small></div></div> },
    { key: 'category', label: 'Category', sortValue: p => p.categoryName, render: p => p.categoryName },
    { key: 'price', label: 'Price', sortValue: p => p.price, render: p => <strong>{formatPrice(p.price)}</strong> },
    { key: 'stock', label: 'Stock', sortValue: p => p.stock, render: p => <div className="au-actions"><Badge>{p.stock} units</Badge><AdminButton disabled={p.stock === 0} aria-label={`Decrease stock for ${p.name}`} onClick={() => adjust(p, -1)}><Minus size={13} /></AdminButton><AdminButton aria-label={`Increase stock for ${p.name}`} onClick={() => adjust(p, 1)}><Plus size={13} /></AdminButton></div> },
    { key: 'actions', label: 'Actions', render: p => <div className="au-actions"><AdminButton onClick={() => setParam('edit', p.id)}><Pencil size={14} /> Edit</AdminButton><AdminButton onClick={() => archive([p])} aria-label={`Archive ${p.name}`}><Archive size={14} /> Archive</AdminButton></div> },
  ]} />{open && <ProductEditor key={editing?.id || 'new'} product={editing} onClose={() => setParams(previous => { const next = new URLSearchParams(previous); next.delete('edit'); next.delete('action'); return next; })} />}</>;
};
