// spec: specs/spec.md (Section 4: Checkout)
// seed: tests/seed-authenticated.spec.ts
import { test, expect } from '../fixtures-authenticated';
import { ProductsPage } from '../pages/products.page';
import { CartPage } from '../pages/cart.page';
import { CheckoutPage } from '../pages/checkout.page';
import { PRODUCTS } from '../test-data';

test('Should block empty submission', async ({ page }) => {
  const productsPage = new ProductsPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);

  // 1. Add "Codemify Backpack" to cart, proceed to checkout, click "Complete Order" without filling any field
  await productsPage.addToCartButton(PRODUCTS.backpack.name).click();
  await productsPage.cartButton.click();
  await cartPage.checkoutButton.click();
  await expect(checkoutPage.heading).toBeVisible();
  await checkoutPage.completeOrderButton.click();

  // Native required validation blocks submission and focuses the first empty field.
  await expect(checkoutPage.firstNameInput).toBeFocused();
  await expect(checkoutPage.orderConfirmation).toBeHidden();
});
