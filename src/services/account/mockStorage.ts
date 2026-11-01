import { adminConfig } from '../../config/admin';
import { accountConfig } from '../../config/account';
import { CustomerAddress } from '../../types';
import { AccountBasket, AccountOrder, AccountUser, CardDetails, ProductRequest } from './contracts';
import { createDemoRecords } from './demoSeed';
import { createDemoUsers } from '../../demo/accounts';

export interface MockUser extends AccountUser { password: string; }
export interface MockDatabase {
  version: 1;
  users: MockUser[];
  sessionId: string | null;
  sessionNeedsMerge: boolean;
  orders: AccountOrder[];
  requests: ProductRequest[];
  addresses: (CustomerAddress & { userId: string })[];
  cards: (CardDetails & { userId: string })[];
  baskets: Record<string, AccountBasket>;
  guestMerges: Record<string, string[]>;
}
export const delay = () => new Promise<void>(resolve => setTimeout(resolve, accountConfig.MOCK_LATENCY_MS));
export const clone = <T,>(value: T): T => value === undefined ? value : JSON.parse(JSON.stringify(value));
export const newId = (prefix: string) => `${prefix}-${crypto.randomUUID()}`;
export const publicUser = ({ password: _password, ...user }: MockUser): AccountUser => ({ ...user });
export function writeDatabase(db: MockDatabase) {
  try {
    const serialized = JSON.stringify(db);
    // Avoid redundant storage events and refresh loops between open tabs.
    if (localStorage.getItem(accountConfig.STORAGE_KEY) !== serialized) localStorage.setItem(accountConfig.STORAGE_KEY, serialized);
  }
  catch { throw new Error('Account data could not be saved in this browser. Check browser storage settings and try again.'); }
}
export function readDatabase(): MockDatabase {
  let saved: string | null;
  try { saved = localStorage.getItem(accountConfig.STORAGE_KEY); }
  catch { throw new Error('Browser storage is unavailable. Enable local storage to use mock accounts.'); }
  if (saved) {
    try { const db = JSON.parse(saved); if (db.version !== 1 || !Array.isArray(db.users) || !Array.isArray(db.orders) || !Array.isArray(db.requests) || !Array.isArray(db.addresses) || (db.cards !== undefined && !Array.isArray(db.cards)) || !db.baskets || !db.guestMerges) throw new Error(); db.cards ??= []; if (adminConfig.DEMO_MODE && !db.users.some((user: MockUser) => user.id === adminConfig.DEMO_ADMIN.id)) { db.users.push({ ...adminConfig.DEMO_ADMIN }); writeDatabase(db); } return db; }
    catch { throw new Error('Saved mock account data could not be read. Reset the mock account storage or try another browser profile.'); }
  }
  const fixtures = accountConfig.ENABLE_DEMO_SEED ? createDemoRecords() : { orders: [], requests: [] };
  const db: MockDatabase = { version: 1, users: accountConfig.ENABLE_DEMO_SEED ? createDemoUsers() : [], sessionId: null, sessionNeedsMerge: false, ...fixtures, addresses: [], cards: [], baskets: {}, guestMerges: {} };
  if (adminConfig.DEMO_MODE) db.users.push({ ...adminConfig.DEMO_ADMIN });
  writeDatabase(db); return db;
}
export function requireUser(db: MockDatabase, expectedId?: string | null): MockUser {
  const user = db.users.find(user => user.id === db.sessionId);
  if (!user || (expectedId !== undefined && user.id !== expectedId)) throw new Error('Your session has ended. Please sign in again.');
  return user;
}
export async function withUser<T>(action: (db: MockDatabase, user: MockUser) => T, save = false): Promise<T> {
  const expectedId = readDatabase().sessionId;
  await delay();
  const db = readDatabase(), user = requireUser(db, expectedId);
  const result = action(db, user);
  if (save) writeDatabase(db);
  return clone(result);
}
export function removeDemoSeed() {
  const db = readDatabase(), id = accountConfig.DEMO_USER.id;
  db.users = db.users.filter(user => user.id !== id);
  db.orders = db.orders.filter(order => order.userId !== id);
  db.requests = db.requests.filter(request => request.userId !== id);
  db.addresses = db.addresses.filter(address => address.userId !== id);
  db.cards = db.cards.filter(card => card.userId !== id);
  if (db.sessionId === id) { db.sessionId = null; db.sessionNeedsMerge = false; }
  delete db.baskets[id]; delete db.guestMerges[id];
  writeDatabase(db);
}
