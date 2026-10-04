// spec: specs/spec.md (Section 3: Cart)
// seed: tests/seed-authenticated.spec.ts
import { test, expect } from '../fixtures-authenticated';
import { ProductsPage } from '../pages/products.page';
import { CartPage } from '../pages/cart.page';
import { CART_EXPECTED, PRODUCTS } from '../test-data';

test('Should sum multiple items', async ({ page }) => {
  const productsPage = new ProductsPage(page);
  const cartPage = new CartPage(page);

  // 1. Add "Codemify Backpack" ($29.99) and "Codemify Bike Light" ($9.99) to cart, open the cart
  await productsPage.addToCartButton(PRODUCTS.backpack.name).click();
  await productsPage.addToCartButton(PRODUCTS.bikeLight.name).click();
  await productsPage.cartButton.click();
  await expect(cartPage.total).toHaveText(CART_EXPECTED.backpackAndBikeLight.total);
});
