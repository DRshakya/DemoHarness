/**
 * Verified selectors and constants for the product module.
 * Source: DISCOVER phase — https://automationexercise.com/products and /product_details/{id} (2026-10-09)
 *
 * No data-qa attributes are present on any product-module elements. Selectors use stable IDs,
 * CSS classes, and role-based locators confirmed during browser discovery. Prefer getByRole()
 * and getByText() in helpers; fall back to these ID/class constants when no semantic locator
 * disambiguates.
 */
export const PRODUCT_UI = {
  LISTING: {
    /** h2.title — heading text on the all-products page */
    ALL_PRODUCTS_HEADING_TEXT: "All Products",
    /** h2.title — heading text after a keyword search is submitted */
    SEARCHED_PRODUCTS_HEADING_TEXT: "Searched Products",
    /** CSS selector for the heading element on both the listing and search-results views */
    HEADING_SELECTOR: "h2.title",
    /** CSS selector for the product name paragraph inside each product card */
    PRODUCT_NAME_SELECTOR: ".productinfo p",
    /** CSS selector for the product price heading inside each product card */
    PRODUCT_PRICE_SELECTOR: ".productinfo h2",
    /** CSS selector for the "View Product" link on each product card */
    VIEW_PRODUCT_LINK_SELECTOR: ".choose a",
    /** CSS selector for the top-level product card wrapper; count equals total products shown */
    PRODUCT_CARD_SELECTOR: ".product-image-wrapper",
    /** ID of the search text input (type=text, placeholder "Search Product"; no data-qa) */
    SEARCH_INPUT_ID: "search_product",
    /** ID of the search submit button (icon-only button; no accessible text and no data-qa) */
    SEARCH_BUTTON_ID: "submit_search",
    /** URL query parameter key appended when a keyword search is submitted */
    SEARCH_PARAM: "search",
  },
  DETAIL: {
    /**
     * CSS selector for the container holding all product metadata on the detail page.
     * Children: h2 (name), p (category), span>span (price), p (availability/condition/brand).
     */
    INFO_CONTAINER_SELECTOR: ".product-information",
    /** Within INFO_CONTAINER_SELECTOR — product name heading (h2) */
    NAME_SELECTOR: ".product-information h2",
    /**
     * Within INFO_CONTAINER_SELECTOR — price is the inner span of a nested span pair.
     * Format: "Rs. {amount}"  (e.g., "Rs. 500")
     */
    PRICE_SELECTOR: ".product-information span span",
    /**
     * Category paragraph. Format: "Category: {Gender} > {Subcategory}"
     * Use getByText() with a substring or has-text filter in helpers.
     */
    CATEGORY_LABEL: "Category:",
    /** Availability paragraph prefix — full text format: "Availability: In Stock" */
    AVAILABILITY_LABEL: "Availability:",
    /** Condition paragraph prefix — full text format: "Condition: New" */
    CONDITION_LABEL: "Condition:",
    /** Brand paragraph prefix — full text format: "Brand: {brand}" */
    BRAND_LABEL: "Brand:",
    /** ID of the numeric quantity input on the product detail page (default value: 1) */
    QUANTITY_INPUT_ID: "quantity",
    /**
     * Role-based locator key for the "Add to cart" button on the detail page.
     * Use: getByRole('button', { name: PRODUCT_UI.DETAIL.ADD_TO_CART_BUTTON_NAME })
     * Note: adding to cart requires authentication; use in e2e tier only.
     */
    ADD_TO_CART_BUTTON_NAME: "Add to cart",
  },
  REVIEW: {
    /** ID of the review submitter name input (placeholder "Your Name") */
    NAME_INPUT_ID: "name",
    /** ID of the review submitter email input (placeholder "Email Address") */
    EMAIL_INPUT_ID: "email",
    /** ID of the review textarea (placeholder "Add Review Here!") */
    REVIEW_TEXTAREA_ID: "review",
    /** ID of the review submit button (text "Submit") */
    SUBMIT_BUTTON_ID: "button-review",
    /** ID of the reviews section anchor on the product detail page */
    SECTION_ID: "reviews",
  },
} as const;
