import { type Page, type Locator } from '@playwright/test';
import { type CheckoutDetails } from '../test-data';

export class CheckoutPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly firstNameInput: Locator;
  readonly completeOrderButton: Locator;
  readonly cancelButton: Locator;
  readonly orderConfirmation: Locator;
  readonly orderTotal: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Checkout', exact: true });
    this.firstNameInput = page.getByRole('textbox', { name: 'First Name *' });
    this.completeOrderButton = page.getByRole('button', { name: 'Complete Order' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel', exact: true });
    this.orderConfirmation = page.getByRole('heading', { name: 'Order Placed Successfully!' });
    // The confirmation paragraph reads "Order Total: $29.99" (amount in a <strong>).
    this.orderTotal = page.getByText('Order Total:');
    this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });
  }

  field(label: string): Locator {
    return this.page.getByRole('textbox', { name: `${label} *` });
  }

  async fillDetails(d: CheckoutDetails): Promise<void> {
    await this.field('First Name').fill(d.firstName);
    await this.field('Last Name').fill(d.lastName);
    await this.field('Email').fill(d.email);
    await this.field('Address').fill(d.address);
    await this.field('City').fill(d.city);
    await this.field('State').fill(d.state);
    await this.field('Zip Code').fill(d.zip);
    await this.field('Card Number').fill(d.cardNumber);
    await this.field('Expiry Date').fill(d.expiry);
    await this.field('CVV').fill(d.cvv);
  }
}
