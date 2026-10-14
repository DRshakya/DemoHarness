import { expect, type Page } from "@playwright/test";
import { ROUTES } from "@configs/app/routes";
import { CART_UI } from "@configs/ui/modules/cart/cart.ui";
import { CHECKOUT_UI } from "@configs/ui/modules/checkout/checkout.ui";

/** Synthetic card values for payment form population. All fields are required. */
export interface CardDetails {
  nameOnCard: string;
  cardNumber: string;
  cvc: string;
  expiryMonth: string;
  expiryYear: string;
}

/** Default synthetic card data safe for the automationexercise.com demo payment form. */
export const SYNTHETIC_CARD: CardDetails = {
  nameOnCard: "Test Cardholder",
  cardNumber: "4111111111111111",
  cvc: "123",
  expiryMonth: "12",
  expiryYear: "2027",
};

export class CheckoutHelpers {
  constructor(private readonly page: Page) {}

  // ── Private utilities ────────────────────────────────────────────────────

  /**
   * Dismiss the ad overlay modal if it appears.
   * Uses a short timeout so tests are not slowed when the overlay is absent.
   */
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

  // ── Navigation ───────────────────────────────────────────────────────────

  /**
   * Navigate directly to /checkout without requiring cart items.
   * The page may redirect to /view_cart when the cart is empty — this is a graceful response.
   * Use in smoke tests that must remain read-only (no cart mutations).
   */
  async navigateDirectToCheckout(): Promise<void> {
    await this.page.goto(ROUTES.CART.CHECKOUT);
  }

  /**
   * Navigate to /view_cart and click "Proceed To Checkout", landing on /checkout.
   * Assumes the cart contains at least one item and an authenticated session is active.
   * Handles ad overlay dismissal before interacting with the button.
   */
  async proceedToCheckoutFromCart(): Promise<void> {
    await this.page.goto(ROUTES.CART.VIEW);
    await this.page.locator(CART_UI.PAGE.TABLE_SELECTOR).waitFor({ state: "visible" });
    await this.dismissAdOverlayIfPresent();
    // Not getByRole("link"): the <a> has no href, so its ARIA role is generic (DISCOVER 2026-10-14).
    await this.page
      .locator(CART_UI.PAGE.PROCEED_TO_CHECKOUT_SELECTOR)
      .filter({ hasText: CART_UI.PAGE.PROCEED_TO_CHECKOUT_TEXT })
      .click();
    await this.page.waitForURL(new RegExp(ROUTES.CART.CHECKOUT));
  }

  // ── Checkout page assertions ─────────────────────────────────────────────

  /** Assert that the browser is on the /checkout page. */
  async assertCheckoutPageLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(ROUTES.CART.CHECKOUT));
  }

  /**
   * Assert that navigating to /checkout resolved without an application error.
   * Accepts both /checkout (authenticated user with items) and /view_cart (graceful
   * redirect when the cart is empty). Use in read-only smoke tests that do not add
   * cart items as a precondition.
   */
  async assertCheckoutPageReachable(): Promise<void> {
    await expect(this.page).toHaveURL(
      new RegExp(`(${ROUTES.CART.CHECKOUT}|${ROUTES.CART.VIEW})`),
    );
  }

  /**
   * Assert that the delivery address section is visible and contains address text.
   * An empty section indicates the test account has no pre-filled delivery address.
   */
  async assertDeliveryAddressVisible(): Promise<void> {
    const section = this.page.locator(CART_UI.CHECKOUT.DELIVERY_ADDRESS_SELECTOR);
    await expect(section).toBeVisible();
    await expect(section).toHaveText(/\S/);
  }

  /** Assert that the billing address section is visible and contains address text. */
  async assertBillingAddressVisible(): Promise<void> {
    const section = this.page.locator(CART_UI.CHECKOUT.BILLING_ADDRESS_SELECTOR);
    await expect(section).toBeVisible();
    await expect(section).toHaveText(/\S/);
  }

  /** Assert that the order comment textarea is visible. */
  async assertCommentTextareaVisible(): Promise<void> {
    await expect(this.page.locator(CART_UI.CHECKOUT.COMMENT_TEXTAREA_SELECTOR)).toBeVisible();
  }

  // ── Checkout page interactions ───────────────────────────────────────────

  /**
   * Enter the given comment text in the order comment textarea and assert it is retained.
   */
  async enterOrderComment(comment: string): Promise<void> {
    const textarea = this.page.locator(CART_UI.CHECKOUT.COMMENT_TEXTAREA_SELECTOR);
    await textarea.fill(comment);
    await expect(textarea).toHaveValue(comment);
  }

  /**
   * Click "Place Order" on /checkout and wait for navigation to /payment.
   * The waitForURL pattern is anchored to /payment$ to avoid a false-positive
   * match against /payment_done (DISCOVER 2026-10-14).
   * Only call from e2e tests — this is a step in a mutating flow.
   */
  async clickPlaceOrder(): Promise<void> {
    await this.page.getByRole("link", { name: CART_UI.CHECKOUT.PLACE_ORDER_TEXT }).click();
    await this.page.waitForURL(new RegExp(ROUTES.CART.PAYMENT + "$"));
  }

  // ── Payment page assertions ──────────────────────────────────────────────

  /** Assert that the browser has navigated to /payment (not /payment_done). */
  async assertPaymentPageLoaded(): Promise<void> {
    // Anchored to avoid a false-positive match against /payment_done.
    await expect(this.page).toHaveURL(new RegExp(ROUTES.CART.PAYMENT + "$"));
  }

  /** Assert that all card detail fields and the submit button are visible on /payment. */
  async assertPaymentFormVisible(): Promise<void> {
    await expect(this.page.locator(CHECKOUT_UI.PAYMENT.NAME_ON_CARD_SELECTOR)).toBeVisible();
    await expect(this.page.locator(CHECKOUT_UI.PAYMENT.CARD_NUMBER_SELECTOR)).toBeVisible();
    await expect(this.page.locator(CHECKOUT_UI.PAYMENT.CVC_SELECTOR)).toBeVisible();
    await expect(this.page.locator(CHECKOUT_UI.PAYMENT.EXPIRY_MONTH_SELECTOR)).toBeVisible();
    await expect(this.page.locator(CHECKOUT_UI.PAYMENT.EXPIRY_YEAR_SELECTOR)).toBeVisible();
    await expect(
      this.page.getByRole("button", { name: CHECKOUT_UI.PAYMENT.PAY_BUTTON_TEXT }),
    ).toBeVisible();
  }

  // ── Payment page interactions ─────────────────────────────────────────────

  /**
   * Fill all payment form fields. Does not submit — call submitPaymentForm() separately.
   */
  async fillPaymentForm(card: CardDetails): Promise<void> {
    await this.page.locator(CHECKOUT_UI.PAYMENT.NAME_ON_CARD_SELECTOR).fill(card.nameOnCard);
    await this.page.locator(CHECKOUT_UI.PAYMENT.CARD_NUMBER_SELECTOR).fill(card.cardNumber);
    await this.page.locator(CHECKOUT_UI.PAYMENT.CVC_SELECTOR).fill(card.cvc);
    await this.page.locator(CHECKOUT_UI.PAYMENT.EXPIRY_MONTH_SELECTOR).fill(card.expiryMonth);
    await this.page.locator(CHECKOUT_UI.PAYMENT.EXPIRY_YEAR_SELECTOR).fill(card.expiryYear);
  }

  /**
   * Click "Pay and Confirm Order" and wait for the /payment_done/{order_id} URL.
   * A 20 s timeout is required — the site is slow after payment submission
   * (DISCOVER confirmed 2026-10-14).
   * The pattern includes /\d+ to confirm the numeric order ID segment is present
   * and to avoid a false-positive on a bare /payment_done prefix.
   * This places an order — only call from e2e tests.
   */
  async submitPaymentForm(): Promise<void> {
    await this.page.getByRole("button", { name: CHECKOUT_UI.PAYMENT.PAY_BUTTON_TEXT }).click();
    await this.page.waitForURL(new RegExp(ROUTES.CART.PAYMENT_DONE + "/\\d+"), { timeout: 20000 });
  }

  // ── Confirmation page assertions ──────────────────────────────────────────

  /**
   * Assert that the order confirmation page has loaded with a success heading and message visible.
   * Checks the URL matches /payment_done/{id}, the [data-qa="order-placed"] heading is visible,
   * and the confirmation paragraph text is present.
   * DISCOVER confirmed 2026-10-14: order-placed h2 and success paragraph both present.
   */
  async assertOrderConfirmed(): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(ROUTES.CART.PAYMENT_DONE + "/\\d+"));
    await expect(this.page.getByRole("heading", { name: "Order Placed!" })).toBeVisible();
    await expect(
      this.page.getByText(CHECKOUT_UI.CONFIRMATION.SUCCESS_TEXT, { exact: false }),
    ).toBeVisible();
  }

  /**
   * Assert that a non-empty numeric order ID is present in the URL after successful payment.
   * DISCOVER confirmed 2026-10-14: the order ID is NOT in the DOM — it appears only
   * in the URL path as /payment_done/{numeric_id}. The ID is extracted from the URL.
   *
   * @returns The order ID string extracted from the URL.
   */
  async assertOrderIdInUrl(): Promise<string> {
    const url = this.page.url();
    const match = url.match(new RegExp(ROUTES.CART.PAYMENT_DONE + "/(\\d+)"));
    expect(match, "Order ID not found in URL").toBeTruthy();
    return match![1];
  }

  // ── Full flow convenience ─────────────────────────────────────────────────

  /**
   * Execute the complete checkout-to-confirmation flow:
   *   /view_cart → /checkout → /payment → /payment_done/{order_id}
   *
   * Used by e2e tests that need to reach the confirmation page.
   * Assumes at least one product is already in the cart.
   *
   * @param card - Card details for the payment form. Defaults to SYNTHETIC_CARD.
   */
  async completeCheckoutFlow(card: CardDetails = SYNTHETIC_CARD): Promise<void> {
    await this.proceedToCheckoutFromCart();
    await this.clickPlaceOrder();
    await this.fillPaymentForm(card);
    await this.submitPaymentForm();
  }
}
