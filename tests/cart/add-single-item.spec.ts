// spec: specs/spec.md (Section 3: Cart)
// seed: tests/seed-authenticated.spec.ts
import { test, expect } from '../fixtures-authenticated';
import { ProductsPage } from '../pages/products.page';
import { CartPage } from '../pages/cart.page';
import { CART_EXPECTED, PRODUCTS } from '../test-data';

test('Should add single item', async ({ page }) => {
  const productsPage = new ProductsPage(page);
  const cartPage = new CartPage(page);

  // 1. Add "Codemify Backpack" to cart from Products, open the cart
  await productsPage.addToCartButton(PRODUCTS.backpack.name).click();
  await productsPage.cartButton.click();
  await expect(cartPage.lineItem(PRODUCTS.backpack.name)).toContainText(
    CART_EXPECTED.backpackQty1.line,
  );
  await expect(cartPage.total).toHaveText(CART_EXPECTED.backpackQty1.total);
});
