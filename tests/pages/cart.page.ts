import { type Page, type Locator } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly total: Locator;
  readonly emptyMessage: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Your Shopping Cart' });
    this.emptyMessage = page.getByText('Your cart is empty', { exact: true });
    this.checkoutButton = page.getByRole('button', { name: 'Proceed to Checkout' });
    // The total is the only element on the cart page whose entire text is a price.
    this.total = page.getByText(/^\$\d+\.\d{2}$/);
  }

  lineItem(name: string): Locator {
    return this.page
      .getByRole('listitem')
      .filter({ has: this.page.getByRole('heading', { name, exact: true }) });
  }

  incrementButton(name: string): Locator {
    return this.lineItem(name).getByRole('button', { name: '+', exact: true });
  }

  decrementButton(name: string): Locator {
    // The decrement label is U+2212 (minus sign), not an ASCII hyphen.
    return this.lineItem(name).getByRole('button', { name: '−', exact: true });
  }

  removeButton(name: string): Locator {
    return this.lineItem(name).getByRole('button', { name: 'Remove', exact: true });
  }
}
