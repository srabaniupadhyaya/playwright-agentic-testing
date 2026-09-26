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
