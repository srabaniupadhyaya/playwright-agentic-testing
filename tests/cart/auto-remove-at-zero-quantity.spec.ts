// spec: specs/spec.md (Section 3: Cart)
// seed: tests/seed-authenticated.spec.ts
import { test, expect } from '../fixtures-authenticated';
import { ProductsPage } from '../pages/products.page';
import { CartPage } from '../pages/cart.page';
import { PRODUCTS } from '../test-data';

test('Should auto-remove at zero quantity', async ({ page }) => {
  const productsPage = new ProductsPage(page);
  const cartPage = new CartPage(page);

  // 1. Add "Codemify Backpack" to cart, open the cart, click "−" on its line once
  await productsPage.addToCartButton(PRODUCTS.backpack.name).click();
  await productsPage.cartButton.click();
  await cartPage.decrementButton(PRODUCTS.backpack.name).click();
  await expect(cartPage.lineItem(PRODUCTS.backpack.name)).toBeHidden();
  await expect(cartPage.emptyMessage).toBeVisible();
});
