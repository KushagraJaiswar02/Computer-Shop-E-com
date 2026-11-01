export interface CartUiConfig {
  freeShippingThreshold?: number;
}

// Set only when the retailer has confirmed its free-shipping offer (INR).
// This display config does not change checkout calculations.
export const cartUiConfig: CartUiConfig = {};

// Preserve the existing cart-page demo preview; these are not retailer offers.
// Checkout retains its existing implementation and is not changed by this config.
export const cartPreviewConfig = {
  shippingThreshold: 2999,
  shippingFee: 149,
  couponCode: 'TECH10',
  couponDiscountPercent: 10,
};
