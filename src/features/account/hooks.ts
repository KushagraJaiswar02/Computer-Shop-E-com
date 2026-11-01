import { useCallback, useEffect, useRef, useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { AddressInput, AccountOrder, CardDetailsInput, RequestInput } from '../../services/account/contracts';
import { errorMessage } from '../../services/account/validation';
import { useAuth } from './useAuth';

export function useServiceQuery<T>(load: () => Promise<T>, scope: string, enabled = true) {
  const loader = useRef(load); loader.current = load;
  const [revision, setRevision] = useState(0);
  const [state, setState] = useState<{ scope: string; data?: T; error: string; loading: boolean }>({ scope, error: '', loading: enabled });
  const reload = useCallback(() => setRevision(value => value + 1), []);
  useEffect(() => {
    if (!enabled) { setState({ scope, error: '', loading: false }); return; }
    let current = true;
    setState({ scope, error: '', loading: true });
    loader.current().then(data => { if (current) setState({ scope, data, error: '', loading: false }); }).catch(failure => { if (current) setState({ scope, error: errorMessage(failure), loading: false }); });
    return () => { current = false; };
  }, [scope, revision, enabled]);
  useEffect(() => { window.addEventListener('account-records-updated', reload); return () => window.removeEventListener('account-records-updated', reload); }, [reload]);
  return { ...(state.scope === scope ? state : { data: undefined, error: '', loading: enabled }), reload };
}
export function useBuyAgain() {
  const store = useStore();
  return (order: AccountOrder) => {
    let added = 0, skipped = 0;
    order.items.forEach(item => {
      const product = store.products.find(product => product.id === item.productId);
      if (!product || product.stockStatus === 'out_of_stock' || product.stock <= 0) { skipped++; return; }
      store.addToCart(product, Math.min(item.quantity, product.stock)); added++;
    });
    return added ? `Added ${added} available item${added === 1 ? '' : 's'} at current catalog prices.${skipped ? ` ${skipped} unavailable item${skipped === 1 ? '' : 's'} skipped.` : ''}` : 'These items are currently unavailable in the catalog.';
  };
}
export function useOrders() {
  const { user, services } = useAuth();
  const query = useServiceQuery(() => services.orders.listOrders(), `${user?.id}:orders`, !!user);
  const buyAgain = useBuyAgain();
  return { ...query, buyAgain };
}
export function useOrder(id: string) {
  const { user, services } = useAuth();
  return useServiceQuery(() => services.orders.getOrder(id), `${user?.id}:order:${id}`, !!user && !!id);
}
export function useProductRequests() {
  const { user, services } = useAuth();
  return useServiceQuery(() => services.requests.listProductRequests(), `${user?.id}:requests`, !!user);
}
export function useProductRequestSubmission() {
  const { services } = useAuth(), { submitEnquiry } = useStore();
  const [busy, setBusy] = useState(false), [error, setError] = useState('');
  const submit = async (input: RequestInput) => {
    setBusy(true); setError('');
    try {
      if (input.enquiryType === 'component_availability') await services.requests.submitProductRequest(input);
      submitEnquiry(input);
      window.dispatchEvent(new Event('account-records-updated'));
    } catch (failure) { setError(errorMessage(failure)); throw failure; }
    finally { setBusy(false); }
  };
  return { submit, busy, error };
}
export function useAddresses() {
  const { user, services } = useAuth();
  const query = useServiceQuery(() => services.addresses.list(), `${user?.id}:addresses`, !!user);
  const [busy, setBusy] = useState(false), [mutationError, setMutationError] = useState('');
  const mutate = async (action: () => Promise<unknown>) => {
    setBusy(true); setMutationError('');
    try { await action(); query.reload(); }
    catch (failure) { setMutationError(errorMessage(failure)); throw failure; }
    finally { setBusy(false); }
  };
  return { ...query, busy, mutationError, add: (input: AddressInput) => mutate(() => services.addresses.add(input)), update: (id: string, input: AddressInput) => mutate(() => services.addresses.update(id, input)), remove: (id: string) => mutate(() => services.addresses.delete(id)), setDefault: (id: string) => mutate(() => services.addresses.setDefault(id)) };
}
export function useCardDetails() {
  const { user, services } = useAuth();
  const query = useServiceQuery(() => services.cards.list(), `${user?.id}:cards`, !!user);
  const [busy, setBusy] = useState(false);
  const mutate = async (action: () => Promise<unknown>) => {
    setBusy(true);
    try { await action(); query.reload(); }
    finally { setBusy(false); }
  };
  return { ...query, busy, add: (input: CardDetailsInput) => mutate(() => services.cards.add(input)), update: (id: string, input: CardDetailsInput) => mutate(() => services.cards.update(id, input)), remove: (id: string) => mutate(() => services.cards.delete(id)), setDefault: (id: string) => mutate(() => services.cards.setDefault(id)) };
}
