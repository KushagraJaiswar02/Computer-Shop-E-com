import React from 'react';
import { useLocation } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { AdminList, Badge } from './AdminUi';
export const AdminCategoriesBrandsPage: React.FC = () => {
  const { categories, brands } = useStore(), location = useLocation();
  const brandView = location.pathname.endsWith('/brands');
  return brandView ? <AdminList title="Brands and series" description="Your current brand directory. Editing will be available in a future phase." rows={brands} searchText={b => `${b.name} ${b.seriesList.map(s => s.name).join(' ')}`} columns={[
    { key: 'name', label: 'Brand', sortValue: b => b.name, render: b => <div><strong>{b.name}</strong><small className="block au-muted">{b.id}</small></div> },
    { key: 'description', label: 'About', render: b => b.description || 'No description yet' },
    { key: 'series', label: 'Series', sortValue: b => b.seriesList.length, render: b => <div className="au-actions">{b.seriesList.map(s => <Badge key={s.id}>{s.name}</Badge>)}{!b.seriesList.length && 'No series yet'}</div> },
  ]} /> : <AdminList title="Categories" description="See how your products are grouped. Editing will be available in a future phase." rows={categories} searchText={c => `${c.name} ${c.subcategories.map(s => s.name).join(' ')}`} columns={[
    { key: 'name', label: 'Category', sortValue: c => c.name, render: c => <div><strong>{c.name}</strong><small className="block au-muted">{c.id}</small></div> },
    { key: 'description', label: 'About', render: c => c.description || 'No description yet' },
    { key: 'children', label: 'Subcategories', sortValue: c => c.subcategories.length, render: c => <div className="au-actions">{c.subcategories.map(s => <Badge key={s.id}>{s.name}</Badge>)}{!c.subcategories.length && 'No subcategories yet'}</div> },
  ]} />;
};
