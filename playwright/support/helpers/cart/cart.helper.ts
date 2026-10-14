import { expect, type Page } from "@playwright/test";
import { ROUTES } from "@configs/app/routes";
import { CART_UI } from "@configs/ui/modules/cart/cart.ui";
import { CHECKOUT_UI } from "@configs/ui/modules/checkout/checkout.ui";
import { PRODUCT_UI } from "@configs/ui/modules/product/product.ui";

export class CartHelpers {
  constructor(private readonly page: Page) {}

  async navigateToCart(): Promise<void> {
    await this.page.goto(ROUTES.CART.VIEW);
    await this.page
      .locator(CART_UI.PAGE.TABLE_SELECTOR)
      .or(this.page.locator(CART_UI.PAGE.EMPTY_CART_SELECTOR))
      .first()
      .waitFor({ state: "visible" });
  }

  async assertCartPageLoaded(): Promise<void> {
    const table = this.page.locator(CART_UI.PAGE.TABLE_SELECTOR);
    const emptyCart = this.page.locator(CART_UI.PAGE.EMPTY_CART_SELECTOR);
    const tableVisible = await table.isVisible();
    const emptyCartVisible = await emptyCart.isVisible();
    if (!tableVisible && !emptyCartVisible) {
      await expect(
        this.page
          .locator(CART_UI.PAGE.TABLE_SELECTOR)
          .or(this.page.locator(CART_UI.PAGE.EMPTY_CART_SELECTOR))
          .first(),
      ).toBeVisible();
    }
  }

  /** Dismiss the ad overlay modal if it appears, then proceed. */
  private async dismissAdOverlayIfPresent(): Promise<void> {
    const adModal = this.page.locator(CHECKOUT_UI.AD_OVERLAY.CONTAINER_SELECTOR);
    try {
      await adModal.waitFor({ state: "visible", timeout: 4000 });
      const closeBtn = adModal.locator(CHECKOUT_UI.AD_OVERLAY.CLOSE_BUTTON_SELECTOR);
      if (await closeBtn.isVisible()) {
        await closeBtn.click();
      } else {
        await this.page.keyboard.press("Escape");
      }
      await adModal.waitFor({ state: "hidden", timeout: 4000 });
    } catch {
      // Ad overlay did not appear — proceed normally
    }
  }

  /**
   * Navigate to the given product detail page and click "Add to cart".
   * Handles the ad overlay before interacting with the modal.
   * Returns after the #cartModal container is visible.
   */
  async addProductToCart(productId: string): Promise<void> {
    await this.page.goto(ROUTES.PRODUCTS.DETAIL.replace("{id}", productId));
    await expect(
      this.page.locator(PRODUCT_UI.DETAIL.INFO_CONTAINER_SELECTOR),
    ).toBeVisible();
    await this.dismissAdOverlayIfPresent();
    await this.page
      .getByRole("button", { name: CART_UI.ADD_TO_CART.DETAIL_BUTTON_NAME })
      .click();
    await expect(
      this.page.locator(CART_UI.MODAL.CONTAINER_SELECTOR),
    ).toBeVisible();
  }

  async assertAddToCartModalVisible(): Promise<void> {
    await expect(
      this.page.locator(CART_UI.MODAL.CONTAINER_SELECTOR),
    ).toBeVisible();
    await expect(
      this.page.locator(CART_UI.MODAL.HEADING_SELECTOR),
    ).toHaveText(CART_UI.MODAL.HEADING_TEXT);
    await expect(
      this.page.locator(CART_UI.MODAL.BODY_TEXT_SELECTOR),
    ).toHaveText(CART_UI.MODAL.BODY_TEXT);
  }

  async clickViewCartFromModal(): Promise<void> {
    await this.page.locator(CART_UI.MODAL.VIEW_CART_LINK_SELECTOR).click();
    await this.page.waitForURL(new RegExp(ROUTES.CART.VIEW));
  }

  async clickContinueShoppingFromModal(): Promise<void> {
    await this.page.locator(CART_UI.MODAL.CONTINUE_SHOPPING_SELECTOR).click();
    await expect(
      this.page.locator(CART_UI.MODAL.CONTAINER_SELECTOR),
    ).toBeHidden();
  }

  async assertStaysOnProductDetailPage(productId: string): Promise<void> {
    await expect(this.page).toHaveURL(
      new RegExp(ROUTES.PRODUCTS.DETAIL.replace("{id}", productId)),
    );
    await expect(
      this.page.locator(PRODUCT_UI.DETAIL.INFO_CONTAINER_SELECTOR),
    ).toBeVisible();
  }

  async assertOnCartPage(): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(ROUTES.CART.VIEW));
    await expect(
      this.page
        .locator(CART_UI.PAGE.TABLE_SELECTOR)
        .or(this.page.locator(CART_UI.PAGE.EMPTY_CART_SELECTOR))
        .first(),
    ).toBeVisible();
  }

  /**
   * Asserts that the first cart item row contains the expected product name,
   * unit price, quantity, and line total. All values are asserted by text match.
   * Price/total format is "Rs. {amount}".
   */
  async assertFirstCartItemDetails(
    expectedName: string,
    expectedPrice: string,
    expectedQty: string,
    expectedTotal: string,
  ): Promise<void> {
    const firstRow = this.page
      .locator(CART_UI.PAGE.ITEM_ROW_SELECTOR)
      .first();
    await expect(firstRow.locator(CART_UI.ITEM.NAME_LINK_SELECTOR)).toHaveText(
      expectedName,
    );
    await expect(
      firstRow.locator(CART_UI.ITEM.UNIT_PRICE_SELECTOR),
    ).toHaveText(expectedPrice);
    await expect(
      firstRow.locator(CART_UI.ITEM.QUANTITY_SELECTOR),
    ).toHaveText(expectedQty);
    await expect(
      firstRow.locator(CART_UI.ITEM.LINE_TOTAL_SELECTOR),
    ).toHaveText(expectedTotal);
  }

  async assertCartIsEmpty(): Promise<void> {
    await expect(
      this.page.locator(CART_UI.PAGE.EMPTY_CART_SELECTOR),
    ).toBeVisible();
    await expect(
      this.page.locator(CART_UI.PAGE.TABLE_SELECTOR),
    ).not.toBeVisible();
  }

  /**
   * Removes all items from the cart by clicking each delete link and
   * waiting for its row to detach from the DOM before proceeding.
   */
  async removeAllCartItems(): Promise<void> {
    let deleteLinks = this.page.locator(CART_UI.ITEM.DELETE_LINK_SELECTOR);
    let count = await deleteLinks.count();
    while (count > 0) {
      const link = deleteLinks.first();
      await link.click();
      await link.waitFor({ state: "detached" });
      deleteLinks = this.page.locator(CART_UI.ITEM.DELETE_LINK_SELECTOR);
      count = await deleteLinks.count();
    }
  }

  /**
   * For each cart item row, reads the numeric unit price and quantity and
   * asserts that the line total equals price × quantity.
   * Prices are in "Rs. {amount}" format — the numeric part is parsed out.
   */
  async assertLineTotalsMatchPriceTimesQuantity(): Promise<void> {
    const rows = this.page.locator(CART_UI.PAGE.ITEM_ROW_SELECTOR);
    const rowCount = await rows.count();
    expect(rowCount).toBeGreaterThan(0);
    for (let i = 0; i < rowCount; i++) {
      const row = rows.nth(i);
      const priceText = await row
        .locator(CART_UI.ITEM.UNIT_PRICE_SELECTOR)
        .innerText();
      const qtyText = await row
        .locator(CART_UI.ITEM.QUANTITY_SELECTOR)
        .innerText();
      const totalText = await row
        .locator(CART_UI.ITEM.LINE_TOTAL_SELECTOR)
        .innerText();
      const price = parseFloat(priceText.replace(/[^0-9.]/g, ""));
      const qty = parseFloat(qtyText.trim());
      const total = parseFloat(totalText.replace(/[^0-9.]/g, ""));
      expect(Math.round(price * qty * 100) / 100).toBe(
        Math.round(total * 100) / 100,
      );
    }
  }
}
