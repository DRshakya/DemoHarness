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
} as const;
