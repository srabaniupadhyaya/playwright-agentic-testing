// Catalog data as shown in the Codemify Store UI.
export const PRODUCTS = {
  backpack: { name: 'Codemify Backpack', price: '$29.99' },
  bikeLight: { name: 'Codemify Bike Light', price: '$9.99' },
} as const;

// Expected cart results, typed by hand (not computed) so they stay independent
// of the app's arithmetic. Only the unit price comes from PRODUCTS.
export const CART_EXPECTED = {
  backpackQty1: { line: `${PRODUCTS.backpack.price} × 1 = $29.99`, total: '$29.99' },
  backpackQty2: { line: `${PRODUCTS.backpack.price} × 2 = $59.98`, total: '$59.98' },
  backpackAndBikeLight: { total: '$39.98' },
} as const;

// Dummy shipping/payment values for the demo checkout form (no real card is charged).
export interface CheckoutDetails {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
}

export const CHECKOUT_DETAILS: CheckoutDetails = {
  firstName: 'Test',
  lastName: 'User',
  email: 'test.user@example.com',
  address: '1 Main St',
  city: 'Austin',
  state: 'TX',
  zip: '12345',
  cardNumber: '4111111111111111',
  expiry: '12/30',
  cvv: '123',
};
