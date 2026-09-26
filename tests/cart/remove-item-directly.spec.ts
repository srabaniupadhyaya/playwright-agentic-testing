// spec: specs/spec.md (Section 3: Cart)
// seed: tests/seed-authenticated.spec.ts
import { test, expect } from '../fixtures-authenticated';
import { ProductsPage } from '../pages/products.page';
import { CartPage } from '../pages/cart.page';
import { PRODUCTS } from '../test-data';

test('Should remove item directly', async ({ page }) => {
  const productsPage = new ProductsPage(page);
  const cartPage = new CartPage(page);

  // 1. Add "Codemify Backpack" and "Codemify Bike Light" to cart, open the cart, click "Remove" on "Codemify Backpack"
  await productsPage.addToCartButton(PRODUCTS.backpack.name).click();
  await productsPage.addToCartButton(PRODUCTS.bikeLight.name).click();
  await productsPage.cartButton.click();
  await cartPage.removeButton(PRODUCTS.backpack.name).click();
  await expect(cartPage.lineItem(PRODUCTS.backpack.name)).toBeHidden();
  await expect(cartPage.lineItem(PRODUCTS.bikeLight.name)).toBeVisible();
});
