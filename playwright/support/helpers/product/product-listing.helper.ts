import { expect, type Page } from "@playwright/test";
import { ROUTES } from "@configs/app/routes";
import { PRODUCT_UI } from "@configs/ui/modules/product/product.ui";

export class ProductListingHelpers {
  constructor(private readonly page: Page) {}

  async navigateToProductListing(): Promise<void> {
    await this.page.goto(ROUTES.PRODUCTS.ROOT);
    await expect(
      this.page.getByRole("heading", {
        name: PRODUCT_UI.LISTING.ALL_PRODUCTS_HEADING_TEXT,
      }),
    ).toBeVisible();
  }

  async assertProductListingLoaded(): Promise<void> {
    await expect(
      this.page.getByRole("heading", {
        name: PRODUCT_UI.LISTING.ALL_PRODUCTS_HEADING_TEXT,
      }),
    ).toBeVisible();

    await expect(
      this.page.locator(PRODUCT_UI.LISTING.PRODUCT_CARD_SELECTOR).first(),
    ).toBeVisible();
  }

  async searchByKeyword(keyword: string): Promise<void> {
    await this.page
      .locator("#" + PRODUCT_UI.LISTING.SEARCH_INPUT_ID)
      .fill(keyword);
    await this.page.locator("#" + PRODUCT_UI.LISTING.SEARCH_BUTTON_ID).click();
    await expect(
      this.page.getByRole("heading", {
        name: PRODUCT_UI.LISTING.SEARCHED_PRODUCTS_HEADING_TEXT,
      }),
    ).toBeVisible();
  }

  async assertSearchResultsVisible(keyword: string): Promise<void> {
    await expect(this.page).toHaveURL(
      new RegExp(
        `[?&]${PRODUCT_UI.LISTING.SEARCH_PARAM}=${encodeURIComponent(keyword)}`,
      ),
    );
    await expect(
      this.page.getByRole("heading", {
        name: PRODUCT_UI.LISTING.SEARCHED_PRODUCTS_HEADING_TEXT,
      }),
    ).toBeVisible();
    await expect(
      this.page.locator(PRODUCT_UI.LISTING.PRODUCT_CARD_SELECTOR).first(),
    ).toBeVisible();
  }

  async clickFirstViewProductAndGetName(): Promise<string> {
    const firstCard = this.page
      .locator(PRODUCT_UI.LISTING.PRODUCT_CARD_SELECTOR)
      .first();
    const productName = (
      await firstCard
        .locator(PRODUCT_UI.LISTING.PRODUCT_NAME_SELECTOR)
        .innerText()
    ).trim();
    await firstCard
      .locator(PRODUCT_UI.LISTING.VIEW_PRODUCT_LINK_SELECTOR)
      .click();
    await expect(
      this.page.locator(PRODUCT_UI.DETAIL.INFO_CONTAINER_SELECTOR),
    ).toBeVisible();
    return productName;
  }
}
