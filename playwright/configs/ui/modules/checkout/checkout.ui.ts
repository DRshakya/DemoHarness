/**
 * Selectors and constants for the checkout payment and confirmation pages.
 * Source: Owner specification — automationexercise.com /payment and /payment_done
 * DISCOVER confirmed 2026-10-14 against live automationexercise.com.
 *
 * Checkout page (/checkout) selectors are already verified in CART_UI.CHECKOUT (cart.ui.ts)
 * and are reused directly from that config in checkout helpers. Only the payment page and
 * order confirmation page selectors — which have no prior verified home — are defined here.
 *
 * Payment page data-qa attributes confirmed by DISCOVER 2026-10-14:
 *   [data-qa="name-on-card"], [data-qa="card-number"], [data-qa="cvc"],
 *   [data-qa="expiry-month"], [data-qa="expiry-year"], [data-qa="pay-button"].
 * getByLabel() is NOT feasible — labels have no `for` attribute and inputs have no `id`.
 *
 * Confirmation page (DISCOVER 2026-10-14):
 *   URL pattern: /payment_done/{numeric_id}
 *   [data-qa="order-placed"] — h2 heading, text "Order Placed!"
 *   [data-qa="continue-button"] — "Continue" link back to home
 *   Order ID is NOT in the DOM — it appears only in the URL path.
 *   Success paragraph has no data-qa; matched by visible text.
 */
/**
 * A known valid product ID available on automationexercise.com.
 * Used in e2e checkout tests that require at least one cart item.
 * Product 1 ("Blue Top") is persistently available on the live site (DISCOVER 2026-10-14).
 */
export const KNOWN_PRODUCT_ID = "1";

export const CHECKOUT_UI = {
  /**
   * Third-party ad overlay modal that may appear on checkout-adjacent pages.
   * Observed as div#checkoutModal during cart module DISCOVER 2026-10-12.
   * Tests must dismiss this overlay before interacting with checkout controls.
   */
  AD_OVERLAY: {
    /** CSS selector for the ad overlay modal container */
    CONTAINER_SELECTOR: "div#checkoutModal",
    /**
     * CSS selector for the close button(s) within the ad overlay.
     * Multiple variants exist; the first visible one is used.
     */
    CLOSE_BUTTON_SELECTOR: "button.close-button, .modal-header button",
  },
  PAYMENT: {
    /**
     * Name on card input field.
     * Use: page.locator(CHECKOUT_UI.PAYMENT.NAME_ON_CARD_SELECTOR)
     */
    NAME_ON_CARD_SELECTOR: '[data-qa="name-on-card"]',
    /**
     * Card number input field.
     */
    CARD_NUMBER_SELECTOR: '[data-qa="card-number"]',
    /**
     * CVC input field.
     */
    CVC_SELECTOR: '[data-qa="cvc"]',
    /**
     * Expiration month input field.
     */
    EXPIRY_MONTH_SELECTOR: '[data-qa="expiry-month"]',
    /**
     * Expiration year input field.
     */
    EXPIRY_YEAR_SELECTOR: '[data-qa="expiry-year"]',
    /**
     * Pay and Confirm Order submit button.
     */
    PAY_BUTTON_SELECTOR: '[data-qa="pay-button"]',
    /** Visible text on the payment submit button */
    PAY_BUTTON_TEXT: "Pay and Confirm Order",
  },
  CONFIRMATION: {
    /**
     * Text content of the order confirmation success message.
     * The paragraph has no data-qa attribute; matched by visible text.
     * DISCOVER confirmed 2026-10-14: exact text is
     * "Congratulations! Your order has been confirmed!"
     * Matched with { exact: false } to tolerate minor copy changes.
     */
    SUCCESS_TEXT: "Congratulations! Your order has been confirmed!",
    /**
     * Order confirmation heading element.
     * DISCOVER confirmed 2026-10-14: h2[data-qa="order-placed"], text "Order Placed!"
     * Use: page.locator(CHECKOUT_UI.CONFIRMATION.ORDER_PLACED_SELECTOR)
     */
    ORDER_PLACED_SELECTOR: '[data-qa="order-placed"]',
    /**
     * "Continue" link on the confirmation page that returns the user to the home page.
     * DISCOVER confirmed 2026-10-14: [data-qa="continue-button"]
     */
    CONTINUE_BUTTON_SELECTOR: '[data-qa="continue-button"]',
  },
} as const;
