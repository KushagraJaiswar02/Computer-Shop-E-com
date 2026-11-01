import { adminConfig } from '../../config/admin';
// NOT REAL SECURITY: browser storage and client checks can be changed by anyone.
// A backend must enforce roles on every endpoint, hash passwords, rate-limit login,
// protect against CSRF/XSS, scan uploads, maintain backups and server-side audit
// logs, and support optional admin 2FA.
import { AccountUser } from '../account/contracts';
import { publicUser, readDatabase } from '../account/mockStorage';

export type Permission = 'products.write' | 'catalog.write' | 'banners.write' | 'orders.manage' | 'users.read' | 'audit.read' | 'settings.write';
export const rolePermissions: Record<string, Permission[]> = {
  admin: ['products.write', 'catalog.write', 'banners.write', 'orders.manage', 'users.read', 'audit.read', 'settings.write'],
  customer: [],
  staff: [],
};
export interface AuditEntry { id: string; who: string; when: string; entityType: string; entityId: string; action: string; before: unknown; after: unknown; }
const auditKey = 'compshop_admin_audit';
export function currentAdminUser(): AccountUser | null {
  const db = readDatabase();
  const user = db.users.find(item => item.id === db.sessionId);
  return user ? publicUser(user) : null;
}
function append(entry: Omit<AuditEntry, 'id' | 'when'>) {
  let entries: AuditEntry[] = [];
  try { entries = JSON.parse(localStorage.getItem(auditKey) || '[]'); if (!Array.isArray(entries)) entries = []; } catch { entries = []; }
  entries.unshift({ ...entry, id: crypto.randomUUID(), when: new Date().toISOString() });
  localStorage.setItem(auditKey, JSON.stringify(entries));
}
export function can(user: AccountUser | null, permission: Permission): boolean {
  const allowed = adminConfig.PUBLIC_DEMO_ACCESS || !!user && (rolePermissions[user.role] || []).includes(permission);
  if (!allowed) append({ who: user?.id || 'anonymous', entityType: 'permission', entityId: permission, action: 'denied', before: null, after: null });
  return allowed;
}
export function authorize(permission: Permission): AccountUser {
  const user = currentAdminUser();
  if (!can(user, permission)) throw new Error('Permission denied.');
  return user || { id: 'public-demo-visitor', name: 'Demo visitor', email: '', phone: '', role: 'admin' };
}
export function audit(user: AccountUser, entityType: string, entityId: string, action: string, before: unknown, after: unknown) {
  append({ who: user.id, entityType, entityId, action, before, after });
}
export function listAudit(): AuditEntry[] {
  authorize('audit.read');
  try { const data = JSON.parse(localStorage.getItem(auditKey) || '[]'); return Array.isArray(data) ? data : []; } catch { return []; }
}
