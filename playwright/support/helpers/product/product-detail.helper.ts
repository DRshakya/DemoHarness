import { expect, type Page } from "@playwright/test";
import { ROUTES } from "@configs/app/routes";
import { PRODUCT_UI } from "@configs/ui/modules/product/product.ui";

export class ProductDetailHelpers {
  constructor(private readonly page: Page) {}

  async navigateToProductDetail(productId: string): Promise<void> {
    await this.page.goto(ROUTES.PRODUCTS.DETAIL.replace("{id}", productId));
    await expect(
      this.page.locator(PRODUCT_UI.DETAIL.INFO_CONTAINER_SELECTOR),
    ).toBeVisible();
  }

  async assertDetailProductNameMatches(expectedName: string): Promise<void> {
    await expect(
      this.page.locator(PRODUCT_UI.DETAIL.NAME_SELECTOR),
    ).toContainText(expectedName);
  }

  async assertDetailFieldsVisible(): Promise<void> {
    await expect(
      this.page.locator(PRODUCT_UI.DETAIL.NAME_SELECTOR),
    ).toBeVisible();

    await expect(
      this.page.locator(PRODUCT_UI.DETAIL.PRICE_SELECTOR),
    ).toBeVisible();

    await expect(
      this.page.getByText(PRODUCT_UI.DETAIL.CATEGORY_LABEL, { exact: false }),
    ).toBeVisible();

    await expect(
      this.page.getByText(PRODUCT_UI.DETAIL.AVAILABILITY_LABEL, { exact: false }),
    ).toBeVisible();

    await expect(
      this.page.getByText(PRODUCT_UI.DETAIL.CONDITION_LABEL, { exact: false }),
    ).toBeVisible();

    await expect(
      this.page.getByText(PRODUCT_UI.DETAIL.BRAND_LABEL, { exact: false }),
    ).toBeVisible();
  }
}
