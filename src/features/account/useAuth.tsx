import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { accountServices } from '../../services/account';
import { AccountServices, AccountUser, LoginInput, PasswordInput, ProfileInput, RegisterInput } from '../../services/account/contracts';
import { errorMessage } from '../../services/account/validation';
import { accountConfig } from '../../config/account';
import { applyAccountBasket, mergeGuestIntoAccount } from './accountBasketBridge';

interface AuthContextValue {
  user: AccountUser | null;
  initializing: boolean;
  busy: boolean;
  error: string;
  basketError: string;
  services: AccountServices;
  login(input: LoginInput): Promise<void>;
  register(input: RegisterInput): Promise<void>;
  logout(): Promise<void>;
  refresh(): void;
  updateProfile(input: ProfileInput): Promise<void>;
  changePassword(input: PasswordInput): Promise<void>;
}
const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode; services?: AccountServices }> = ({ children, services = accountServices }) => {
  const store = useStore(), latest = useRef(store); latest.current = store;
  const [user, setUser] = useState<AccountUser | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [basketError, setBasketError] = useState('');
  const [reload, setReload] = useState(0);
  const lock = useRef(false), hydrating = useRef(true), token = useRef(crypto.randomUUID());
  const knownOrders = useRef(new Set(store.orders.map(order => order.id)));
  const refresh = useCallback(() => setReload(value => value + 1), []);

  useEffect(() => {
    let active = true;
    hydrating.current = true; setInitializing(true); setError('');
    (async () => {
      try {
        const current = await services.auth.getCurrentUser();
        const basket = current ? await services.basket.get({ cart: latest.current.cart, wishlist: latest.current.wishlist }) : null;
        if (!active) return;
        if (basket) applyAccountBasket(latest.current, basket);
        setUser(current);
        requestAnimationFrame(() => { if (active) { hydrating.current = false; setInitializing(false); } });
      } catch (failure) { if (active) { setError(errorMessage(failure)); setInitializing(false); } }
    })();
    return () => { active = false; };
  }, [services, reload]);

  useEffect(() => {
    if (!user || initializing || busy || hydrating.current) return;
    let active = true;
    services.basket.save(user.id, { cart: store.cart, wishlist: store.wishlist }).then(() => { if (active) setBasketError(''); }).catch(failure => { if (active) setBasketError(errorMessage(failure)); });
    return () => { active = false; };
  }, [user?.id, store.cart, store.wishlist, services, initializing, busy]);

  useEffect(() => {
    const fresh = store.orders.filter(order => !knownOrders.current.has(order.id));
    store.orders.forEach(order => knownOrders.current.add(order.id));
    if (!user || initializing) return;
    fresh.forEach(order => services.orders.captureLocalOrder(order).then(() => window.dispatchEvent(new Event('account-records-updated'))).catch(failure => setBasketError(errorMessage(failure))));
  }, [store.orders, user?.id, initializing, services]);

  useEffect(() => {
    const changed = (event: StorageEvent) => {
      if (event.key !== accountConfig.STORAGE_KEY) return;
      hydrating.current = true;
      setUser(null);
      applyAccountBasket(latest.current, { cart: [], wishlist: [] });
      refresh();
    };
    window.addEventListener('storage', changed);
    return () => window.removeEventListener('storage', changed);
  }, [refresh]);

  const signIn = async (input: LoginInput | RegisterInput, register: boolean) => {
    if (lock.current) throw new Error('An account action is already in progress.');
    lock.current = true; setBusy(true); setError(''); hydrating.current = true;
    let authenticated = false;
    try {
      const next = register ? await services.auth.register(input as RegisterInput) : await services.auth.login(input);
      authenticated = true;
      await mergeGuestIntoAccount(services, latest.current, token.current);
      setUser(next);
      await new Promise<void>(resolve => requestAnimationFrame(() => { hydrating.current = false; resolve(); }));
    } catch (failure) {
      if (authenticated) await services.auth.logout().catch(() => undefined);
      throw failure;
    } finally { hydrating.current = false; lock.current = false; setBusy(false); }
  };
  const logout = async () => {
    if (lock.current) throw new Error('An account action is already in progress.');
    lock.current = true; setBusy(true);
    try {
      if (user) await services.basket.save(user.id, { cart: latest.current.cart, wishlist: latest.current.wishlist });
      await services.auth.logout();
      setUser(null); applyAccountBasket(latest.current, { cart: [], wishlist: [] });
      token.current = crypto.randomUUID(); setBasketError('');
    } finally { lock.current = false; setBusy(false); }
  };
  return <AuthContext.Provider value={{ user, initializing, busy, error, basketError, services, refresh, login: input => signIn(input, false), register: input => signIn(input, true), logout,
    updateProfile: async input => { const next = await services.auth.updateProfile(input); setUser(next); },
    changePassword: input => services.auth.changePassword(input),
  }}>{children}</AuthContext.Provider>;
};
export function useAuth() { const value = useContext(AuthContext); if (!value) throw new Error('useAuth must be used within AuthProvider'); return value; }
