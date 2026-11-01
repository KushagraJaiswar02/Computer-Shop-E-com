import React, { createContext, useContext, useEffect, useId, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, HelpCircle, Search, ChevronLeft, ChevronRight } from 'lucide-react';

export const AdminButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'danger' | 'quiet' }> = ({ variant = 'quiet', className = '', ...props }) => <button type="button" className={`au-button ${variant} ${className}`} {...props} />;
export const PageHeading: React.FC<{ title: string; description?: string; action?: React.ReactNode }> = ({ title, description, action }) => <div className="au-page-heading"><div><h1>{title}</h1>{description && <p>{description}</p>}</div>{action}</div>;
export const Panel: React.FC<{ title?: string; children: React.ReactNode; className?: string }> = ({ title, children, className = '' }) => <section className={`au-panel ${className}`}>{title && <h2>{title}</h2>}{children}</section>;
export const Badge: React.FC<{ children: React.ReactNode; title?: string }> = ({ children, title }) => <span className="au-badge" title={title}>{children}</span>;

export const AdminModal: React.FC<{ title: string; children: React.ReactNode; onClose(): void; wide?: boolean; drawer?: boolean }> = ({ title, children, onClose, wide, drawer }) => {
  const root = useRef<HTMLDivElement>(null), heading = useId(), close = useRef(onClose); close.current = onClose;
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    const overflow = document.body.style.overflow; document.body.style.overflow = 'hidden';
    (root.current?.querySelector<HTMLElement>('input:not([type=checkbox]),textarea,select') || root.current?.querySelector<HTMLElement>('button,a[href]'))?.focus();
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); close.current(); }
      if (event.key !== 'Tab') return;
      const nodes = Array.from(root.current?.querySelectorAll<HTMLElement>('button:not(:disabled),input:not(:disabled),select,textarea,a[href],[tabindex="0"]') || []).filter(node => node.getClientRects().length);
      const first = nodes[0], last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', key);
    return () => { document.body.style.overflow = overflow; document.removeEventListener('keydown', key); previous?.focus(); };
  }, []);
  return <div className={`au-overlay ${drawer ? 'au-drawer-overlay' : ''}`} onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}><div ref={root} role="dialog" aria-modal="true" aria-labelledby={heading} className={`au-modal ${wide ? 'wide' : ''} ${drawer ? 'au-help-drawer' : ''}`}><div className="au-modal-heading"><h2 id={heading}>{title}</h2><AdminButton aria-label="Close dialog" onClick={onClose}><X size={18} /></AdminButton></div>{children}</div></div>;
};

export function useUnsavedChanges(dirty: boolean) {
  useEffect(() => { if (!dirty) return; const before = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ''; }; window.addEventListener('beforeunload', before); return () => window.removeEventListener('beforeunload', before); }, [dirty]);
  useEffect(() => {
    if (!dirty) return;
    const click = (event: MouseEvent) => { const link = (event.target as Element).closest?.('a[href]'); if (link && link.getAttribute('target') !== '_blank' && link.getAttribute('href') !== window.location.pathname + window.location.search && !window.confirm('You have unsaved changes. Leave without saving?')) { event.preventDefault(); event.stopPropagation(); } };
    document.addEventListener('click', click, true); return () => document.removeEventListener('click', click, true);
  }, [dirty]);
}
export const SaveBar: React.FC<{ dirty: boolean; onSave(): void; onDiscard(): void; label?: string }> = ({ dirty, onSave, onDiscard, label = 'Save changes' }) => <div className="au-savebar" role="region" aria-label="Save changes"><span role="status">{dirty ? 'You have unsaved changes' : 'All changes saved'}</span><div><AdminButton disabled={!dirty} onClick={onDiscard}>Discard</AdminButton><AdminButton variant="primary" disabled={!dirty} onClick={onSave}>{label}</AdminButton></div></div>;
export const FormSection: React.FC<{ title: string; help?: string; children: React.ReactNode }> = ({ title, help, children }) => <fieldset className="au-form-section"><legend>{title}</legend>{help && <p className="au-muted">{help}</p>}<div className="au-fields">{children}</div></fieldset>;
export const Field: React.FC<{ label: string; help?: string; error?: string; children: React.ReactNode }> = ({ label, help, error, children }) => <label className="au-field"><span>{label}</span>{children}{help && <small>{help}</small>}{error && <small role="alert" className="au-error">{error}</small>}</label>;

interface Toast { message: string; undo?: () => void; }
const ToastContext = createContext<(message: string, undo?: () => void) => void>(() => undefined);
export const useAdminToast = () => useContext(ToastContext);
export const AdminToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<Toast | null>(null);
  useEffect(() => { if (!toast) return; const timer = setTimeout(() => setToast(null), 10000); return () => clearTimeout(timer); }, [toast]);
  return <ToastContext.Provider value={(message, undo) => setToast({ message, undo })}>{children}{toast && <div className="au-toast" role="status"><span>{toast.message}</span>{toast.undo && <AdminButton onClick={() => { try { toast.undo?.(); setToast(null); } catch (failure) { setToast({ message: failure instanceof Error ? failure.message : 'Could not undo.' }); } }}>Undo</AdminButton>}<AdminButton aria-label="Dismiss notification" onClick={() => setToast(null)}><X size={16} /></AdminButton></div>}</ToastContext.Provider>;
};

export interface Column<T> { key: string; label: string; render(row: T): React.ReactNode; sortValue?: (row: T) => string | number; }
export function AdminList<T extends { id: string }>({ title, description, rows, columns, searchText, initialSearch = '', filters, action, emptyAction, loading = false, bulkActions, hideHeading = false }: { hideHeading?: boolean; title: string; description?: string; rows: T[]; columns: Column<T>[]; searchText(row: T): string; initialSearch?: string; filters?: React.ReactNode; action?: React.ReactNode; emptyAction?: React.ReactNode; loading?: boolean; bulkActions?: { label: string; run(rows: T[]): void }[] }) {
  const [query, setQuery] = useState(initialSearch), [page, setPage] = useState(1), [sort, setSort] = useState(''), [descending, setDescending] = useState(false), [selected, setSelected] = useState<string[]>([]);
  useEffect(() => { setQuery(initialSearch); }, [initialSearch]);
  useEffect(() => { setPage(1); setSelected([]); }, [query, rows]);
  const found = useMemo(() => {
    const items = rows.filter(row => searchText(row).toLowerCase().includes(query.trim().toLowerCase()));
    const column = columns.find(col => col.key === sort);
    if (column?.sortValue) items.sort((a, b) => { const x = column.sortValue!(a), y = column.sortValue!(b); return (typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y))) * (descending ? -1 : 1); });
    return items;
  }, [rows, query, sort, descending, columns, searchText]);
  const pages = Math.max(1, Math.ceil(found.length / 10)), safePage = Math.min(page, pages), visible = found.slice((safePage - 1) * 10, safePage * 10);
  const toggle = (id: string) => setSelected(current => current.includes(id) ? current.filter(value => value !== id) : [...current, id]);
  return <div className="au-stack">{!hideHeading ? <PageHeading title={title} description={description} action={action} /> : description && <p className="au-muted">{description}</p>}<div className="au-toolbar"><label className="au-search"><Search size={17} /><input aria-label={`Search ${title.toLowerCase()}`} placeholder={`Search ${title.toLowerCase()}…`} value={query} onChange={event => setQuery(event.target.value)} /></label>{filters}<select className="au-mobile-sort" aria-label="Sort list" value={sort ? `${sort}:${descending ? 'desc' : 'asc'}` : ''} onChange={event => { const [key, direction] = event.target.value.split(':'); setSort(key); setDescending(direction === 'desc'); }}><option value="">Default order</option>{columns.filter(col => col.sortValue).flatMap(col => [<option key={`${col.key}:asc`} value={`${col.key}:asc`}>{col.label} ↑</option>, <option key={`${col.key}:desc`} value={`${col.key}:desc`}>{col.label} ↓</option>])}</select></div>{!!selected.length && <div className="au-bulk"><span>{selected.length} selected</span>{bulkActions?.map(item => <AdminButton key={item.label} onClick={() => item.run(rows.filter(row => selected.includes(row.id)))}>{item.label}</AdminButton>)}<AdminButton onClick={() => setSelected([])}>Clear selection</AdminButton></div>}
    {loading ? <div className="au-panel" role="status" aria-label="Loading list">{[1, 2, 3, 4].map(i => <div className="au-skeleton" key={i} />)}</div> : !found.length ? <div className="au-empty"><h2>{query ? 'No matches found' : `No ${title.toLowerCase()} yet`}</h2><p>{query ? 'Try a different search or clear your filters.' : 'Your items will appear here when they are available.'}</p>{query && <AdminButton onClick={() => setQuery('')}>Clear search</AdminButton>}{emptyAction}</div> : <>
    <div className="au-table-wrap"><table className="au-table"><thead><tr>{bulkActions && <th><input type="checkbox" aria-label="Select this page" checked={visible.length > 0 && visible.every(row => selected.includes(row.id))} onChange={event => setSelected(event.target.checked ? Array.from(new Set([...selected, ...visible.map(row => row.id)])) : selected.filter(id => !visible.some(row => row.id === id)))} /></th>}{columns.map(col => <th key={col.key} aria-sort={sort === col.key ? descending ? 'descending' : 'ascending' : undefined}>{col.sortValue ? <button onClick={() => { setSort(col.key); setDescending(sort === col.key ? !descending : false); }}>{col.label} {sort === col.key ? descending ? '↓' : '↑' : '↕'}</button> : col.label}</th>)}</tr></thead><tbody>{visible.map(row => <tr key={row.id}>{bulkActions && <td data-label="Select"><input type="checkbox" aria-label={`Select ${searchText(row).slice(0, 80)}`} checked={selected.includes(row.id)} onChange={() => toggle(row.id)} /></td>}{columns.map(col => <td key={col.key} data-label={col.label}>{col.render(row)}</td>)}</tr>)}</tbody></table></div>
    <div className="au-pagination"><span>{found.length} results · Page {safePage} of {pages}</span><div><AdminButton aria-label="Previous page" disabled={safePage === 1} onClick={() => setPage(safePage - 1)}><ChevronLeft size={16} /> Previous</AdminButton><AdminButton aria-label="Next page" disabled={safePage === pages} onClick={() => setPage(safePage + 1)}>Next <ChevronRight size={16} /></AdminButton></div></div></>}
  </div>;
}
const tips: Record<string, string[]> = {
  products: ['Search by product name, brand or your stock code (SKU).', 'Use the stock filter to find items that need ordering.', 'Archive removes a product from the shop. You can restore it later.', 'Use + and − to adjust stock by one unit.'],
  archive: ['Archived products are hidden from the shop.', 'Restore puts a product back with its saved details.', 'Permanent deletion cannot be undone. Type DELETE to confirm.'],
  orders: ['Search by order number or customer name.', 'Open an order to see the delivery address and every item.', 'Use the status filter to find new orders.'],
  enquiries: ['Search customer names, email addresses or messages.', 'Open enquiries are New or In Review.', 'Open an enquiry to see the message, budget and contact details.'],
  storefront: ['Choose the part of the homepage you want to change in the sidebar.', 'Drag a section by its six-dot handle to change the homepage order; the arrow buttons work too.', 'Review your edits, then save them to update this browser’s shop.', 'Banner previews help you check the headline and image.', 'Use Settings if you need to reset the homepage.'],
  history: ['Each change records who made it and when.', 'Open View changes to compare the saved values.', 'This demo history is stored only in this browser.'],
  settings: ['Changes in this demo are saved in this browser.', 'Reset homepage keeps your products and orders.', 'Reset demo data clears your shop edits. Type RESET to confirm.'],
  categories: ['Categories group similar products.', 'Subcategories are shown under their parent category.', 'This directory is read-only in the current version.'],
  brands: ['Each brand has its own product series.', 'Use this directory to check the available brands.', 'Brand and series editing is coming in a future phase.'],
  dashboard: ['Start with Needs your attention for urgent work.', 'Quick actions take you straight to common tasks.', 'Change the period to review recent orders and revenue.', 'Press / to search across the workspace.'],
};
export const AdminHelp: React.FC = () => {
  const [open, setOpen] = useState(false), location = useLocation();
  const part = location.pathname.split('/')[2] || 'dashboard';
  const items = tips[part] || tips.storefront;
  return <><AdminButton onClick={() => setOpen(true)}><HelpCircle size={16} /> How this works</AdminButton>{open && <AdminModal drawer title="How this works" onClose={() => setOpen(false)}><ol className="au-tips">{items.map(item => <li key={item}>{item}</li>)}</ol><Link className="au-link" to="/">View your store</Link></AdminModal>}</>;
};
