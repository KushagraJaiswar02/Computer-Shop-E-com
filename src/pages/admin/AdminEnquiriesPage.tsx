import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { HardwareEnquiry } from '../../types';
import { formatDate } from '../../lib/utils';
import { AdminButton, AdminList, AdminModal, Badge, Panel } from './AdminUi';
export const AdminEnquiriesPage: React.FC = () => {
  const { enquiries } = useStore(), [params, setParams] = useSearchParams();
  const [selected, setSelected] = useState<HardwareEnquiry | null>(null);
  const status = params.get('status') || '';
  const rows = useMemo(() => enquiries.filter(e => !status || (status === 'open' ? ['New', 'In Review'].includes(e.status) : e.status === status)), [enquiries, status]);
  const enquiry = selected || enquiries.find(e => e.id === params.get('enquiry'));
  const close = () => { setSelected(null); setParams(previous => { const next = new URLSearchParams(previous); next.delete('enquiry'); return next; }); };
  return <><AdminList title="Enquiries" description="Read customer questions and custom PC requests." rows={rows} searchText={e => `${e.customerName} ${e.email} ${e.message} ${e.companyName || ''} ${e.phone}`} initialSearch={params.get('q') || ''} filters={<select aria-label="Filter enquiry status" value={status} onChange={event => setParams(previous => { const next = new URLSearchParams(previous); event.target.value ? next.set('status', event.target.value) : next.delete('status'); return next; })}><option value="">All statuses</option><option value="open">Open enquiries</option>{Array.from(new Set(enquiries.map(e => e.status))).map(status => <option key={status}>{status}</option>)}</select>} emptyAction={<AdminButton onClick={() => setParams({})}>Show all enquiries</AdminButton>} columns={[
    { key: 'customer', label: 'Customer', sortValue: e => e.customerName, render: e => <div><strong>{e.customerName}</strong><small className="block au-muted">{e.companyName || e.email}</small></div> },
    { key: 'type', label: 'Request', sortValue: e => e.enquiryType, render: e => <div>{e.enquiryType.replace(/_/g, ' ')}<small className="block au-muted">{e.message.slice(0, 90)}{e.message.length > 90 ? '…' : ''}</small></div> },
    { key: 'date', label: 'Received', sortValue: e => e.createdAt, render: e => formatDate(e.createdAt) },
    { key: 'status', label: 'Status', sortValue: e => e.status, render: e => <Badge>{e.status}</Badge> },
    { key: 'details', label: 'Details', render: e => <AdminButton onClick={() => setSelected(e)}>View enquiry</AdminButton> },
  ]} />{enquiry && <AdminModal title={`Enquiry from ${enquiry.customerName}`} onClose={close}><div className="au-stack"><div className="au-actions"><Badge>{enquiry.status}</Badge><Badge>{enquiry.enquiryType.replace(/_/g, ' ')}</Badge><span className="au-muted">{formatDate(enquiry.createdAt)}</span></div><Panel title="Customer message"><p className="whitespace-pre-wrap">{enquiry.message}</p></Panel><Panel title="Contact details"><p><strong>{enquiry.customerName}</strong>{enquiry.companyName && <><br />{enquiry.companyName}</>}<br />{enquiry.email}<br />{enquiry.phone}</p>{enquiry.targetBudget && <p className="mt-3"><strong>Budget:</strong> {enquiry.targetBudget}</p>}</Panel><AdminButton onClick={close}>Close enquiry</AdminButton></div></AdminModal>}</>;
};
