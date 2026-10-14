/**
 * Add verified application routes after discovery. Tests must not hardcode URLs.
 */
export const ROUTES = {
  LOGIN: {
    ROOT: "/login",
  },
  /**
   * Product module routes.
   * Source: DISCOVER phase — automationexercise.com (2026-10-09)
   */
  PRODUCTS: {
    /** All-products listing page */
    ROOT: "/products",
    /**
     * Product detail page. Replace the `{id}` placeholder with a numeric product id.
     * Example: ROUTES.PRODUCTS.DETAIL.replace("{id}", "1") → "/product_details/1"
     */
    DETAIL: "/product_details/{id}",
  },
  /**
   * Cart module routes.
   * Source: DISCOVER phase — automationexercise.com (2026-10-12)
   */
  CART: {
    /** Shopping cart page — publicly accessible; shows empty state for anonymous users */
    VIEW: "/view_cart",
    /**
     * Checkout page — requires authentication and at least one cart item.
     * Reached by clicking "Proceed To Checkout" on the cart page.
     */
    CHECKOUT: "/checkout",
    /**
     * Payment page — reached by clicking "Place Order" on the checkout page.
     * Not navigated to during DISCOVER to avoid order placement mutation.
     */
    PAYMENT: "/payment",
    /**
     * Order confirmation page — URL pattern after a successful payment submission.
     * Actual URL: /payment_done/{order_id}
     * Use as a RegExp prefix: new RegExp(ROUTES.CART.PAYMENT_DONE)
     */
    PAYMENT_DONE: "/payment_done",
  },
} as const;
