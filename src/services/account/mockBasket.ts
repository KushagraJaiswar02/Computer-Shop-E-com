import { AccountBasket, BasketService } from './contracts';
import { clone, delay, readDatabase, requireUser, withUser, writeDatabase } from './mockStorage';

export function mergeBaskets(account: AccountBasket, guest: AccountBasket): AccountBasket {
  const lines = new Map<string, AccountBasket['cart'][number]>();
  for (const item of [...account.cart, ...guest.cart]) {
    if (!Number.isFinite(item.quantity) || item.quantity <= 0) continue;
    const key = JSON.stringify([item.product.id, item.selectedVariantId || null]);
    const current = lines.get(key);
    lines.set(key, current ? { ...current, quantity: current.quantity + item.quantity } : { ...item });
  }
  return { cart: [...lines.values()], wishlist: [...new Set([...account.wishlist, ...guest.wishlist])] };
}
export const mockBasketService: BasketService = {
  get: guest => withUser((db, user) => {
    const saved = db.baskets[user.id] || { cart: [], wishlist: [] };
    if (db.sessionNeedsMerge && guest) {
      db.baskets[user.id] = mergeBaskets(saved, guest);
      db.sessionNeedsMerge = false;
      return db.baskets[user.id];
    }
    return saved;
  }, true),
  mergeGuestIntoAccount: (guest, token) => withUser((db, user) => {
    const account = db.baskets[user.id] || { cart: [], wishlist: [] };
    const imported = db.guestMerges[user.id] || [];
    if (imported.includes(token)) { db.sessionNeedsMerge = false; return account; }
    const merged = mergeBaskets(account, guest);
    db.sessionNeedsMerge = false;
    db.baskets[user.id] = merged; db.guestMerges[user.id] = [...imported, token];
    return merged;
  }, true),
  async save(userId, basket) {
    // Optimistic local cache: persist immediately so a refresh cannot lose edits
    // during fake latency. A real adapter should provide the same cache contract.
    const db = readDatabase(); requireUser(db, userId);
    db.baskets[userId] = clone(basket); writeDatabase(db);
    await delay();
  },
};
