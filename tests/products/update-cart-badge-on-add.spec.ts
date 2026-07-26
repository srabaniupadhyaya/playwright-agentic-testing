// spec: specs/spec.md (Section 2: Products)
// seed: tests/seed-authenticated.spec.ts
import { test, expect } from '../fixtures-authenticated';
import { ProductsPage } from '../pages/products.page';

test('Should update cart badge on add', async ({ page }) => {
  const productsPage = new ProductsPage(page);

  // 1. Click "Add to Cart" on "Codemify Backpack"
  await productsPage.addToCartButton('Codemify Backpack').click();
  expect(await productsPage.getCartCount()).toBe(1);

  // 2. Click "Add to Cart" on "Codemify Bike Light"
  await productsPage.addToCartButton('Codemify Bike Light').click();
  expect(await productsPage.getCartCount()).toBe(2);
});
