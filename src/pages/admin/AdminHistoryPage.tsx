import React from 'react';
import { listAudit } from '../../services/admin/mockAdmin';
import { AdminList, Badge } from './AdminUi';
export const AdminHistoryPage: React.FC = () => {
  const entries = listAudit();
  return <AdminList title="History" description="See who changed your shop and compare the saved details." rows={entries} searchText={e => `${e.who} ${e.entityType} ${e.entityId} ${e.action}`} columns={[
    { key: 'when', label: 'When', sortValue: e => e.when, render: e => new Date(e.when).toLocaleString() },
    { key: 'who', label: 'Who', sortValue: e => e.who, render: e => e.who === 'public-demo-visitor' ? 'Demo visitor' : e.who === 'mock-demo-admin' ? 'Demo Shop Owner' : e.who },
    { key: 'entity', label: 'Item', sortValue: e => e.entityType, render: e => <div>{e.entityType}<small className="block au-muted">{e.entityId}</small></div> },
    { key: 'action', label: 'Action', sortValue: e => e.action, render: e => <Badge>{e.action}</Badge> },
    { key: 'values', label: 'Changes', render: e => <details><summary className="au-link cursor-pointer">View changes</summary><pre className="mt-3 whitespace-pre-wrap break-all text-xs max-h-80 overflow-auto">{JSON.stringify({ before: e.before, after: e.after }, null, 2)}</pre></details> },
  ]} />;
};
