import { type Page, type Locator } from '@playwright/test';

export class ProductsPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly itemCount: Locator;
  readonly cartButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Products' });
    this.itemCount = page.getByText('6 items', { exact: true });
    this.cartButton = page.getByRole('button', { name: /^Cart(\s\d+)?$/ });
  }

  productHeading(name: string): Locator {
    return this.page.getByRole('heading', { name, exact: true });
  }

  addToCartButton(name: string): Locator {
    return this.page
      .getByRole('listitem')
      .filter({ has: this.productHeading(name) })
      .getByRole('button', { name: 'Add to Cart' });
  }

  async getCartCount(): Promise<number> {
    const accessibleName = await this.cartButton.innerText();
    const match = accessibleName.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }
}
