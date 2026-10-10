// spec: specs/spec.md (Section 4: Checkout)
// seed: tests/seed-authenticated.spec.ts
import { test, expect } from '../fixtures-authenticated';
import { ProductsPage } from '../pages/products.page';
import { CartPage } from '../pages/cart.page';
import { CheckoutPage } from '../pages/checkout.page';
import { PRODUCTS, CHECKOUT_DETAILS } from '../test-data';

test('Should place order successfully', async ({ page }) => {
  const productsPage = new ProductsPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);

  // 1. Add "Codemify Backpack" to cart, proceed to checkout, fill all shipping and payment fields, click "Complete Order"
  await productsPage.addToCartButton(PRODUCTS.backpack.name).click();
  await productsPage.cartButton.click();
  await cartPage.checkoutButton.click();
  await expect(checkoutPage.heading).toBeVisible();
  await checkoutPage.fillDetails(CHECKOUT_DETAILS);
  await checkoutPage.completeOrderButton.click();

  await expect(checkoutPage.orderConfirmation).toBeVisible();
  await expect(checkoutPage.orderTotal).toContainText(PRODUCTS.backpack.price);
});
