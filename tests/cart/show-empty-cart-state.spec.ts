// spec: specs/spec.md (Section 3: Cart)
// seed: tests/seed-authenticated.spec.ts
import { test, expect } from '../fixtures-authenticated';
import { ProductsPage } from '../pages/products.page';
import { CartPage } from '../pages/cart.page';

test('Should show empty cart state', async ({ page }) => {
  const productsPage = new ProductsPage(page);
  const cartPage = new CartPage(page);

  // 1. Open the cart without adding any items
  await productsPage.cartButton.click();
  await expect(cartPage.emptyMessage).toBeVisible();
  await expect(cartPage.checkoutButton).toBeHidden();
});
