import { useStore } from '../../context/StoreContext';
import { AccountBasket, AccountServices } from '../../services/account/contracts';

type StoreBridge = Pick<ReturnType<typeof useStore>, 'cart' | 'wishlist' | 'clearCart' | 'addToCart' | 'toggleWishlist' | 'setIsCartOpen'>;

export function applyAccountBasket(store: StoreBridge, basket: AccountBasket) {
  store.clearCart();
  basket.cart.forEach(item => store.addToCart({ ...item.product, price: item.unitPrice }, item.quantity, item.selectedVariantId));
  const current = new Set(store.wishlist), target = new Set(basket.wishlist);
  current.forEach(id => { if (!target.has(id)) store.toggleWishlist(id); });
  target.forEach(id => { if (!current.has(id)) store.toggleWishlist(id); });
  store.setIsCartOpen(false);
}

// Single guest-to-account integration seam. A real API can replace the service
// operation while the existing cart/wishlist actions still drive all badges/UI.
export async function mergeGuestIntoAccount(services: AccountServices, store: StoreBridge, token: string) {
  const basket = await services.basket.mergeGuestIntoAccount({ cart: store.cart, wishlist: store.wishlist }, token);
  applyAccountBasket(store, basket);
  return basket;
}
