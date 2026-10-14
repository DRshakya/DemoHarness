/**
 * Verified selectors and constants for the cart module.
 * Source: DISCOVER phase — https://automationexercise.com/view_cart and /checkout (2026-10-12)
 *
 * No data-qa attributes are present on any cart module elements. Selectors use stable IDs,
 * CSS classes, and role-based locators confirmed during browser discovery. Prefer getByRole()
 * and getByText() in helpers; fall back to these ID/class constants when no semantic locator
 * disambiguates.
 *
 * Authentication requirement: all cart interactions that involve items (adding, viewing,
 * removing) require an authenticated session. Use the storageState from the login module's
 * setup project.
 */
export const CART_UI = {
  PAGE: {
    /** CSS selector for the cart items table — present only when the cart has at least one item */
    TABLE_SELECTOR: "table#cart_info_table",
    /** CSS selector for each cart item row inside the cart table body */
    ITEM_ROW_SELECTOR: "tbody tr",
    /**
     * CSS selector for the empty-cart indicator element.
     * Visible text: "Cart is empty! Click here to buy products."
     * Present when the cart has zero items (both authenticated and anonymous sessions).
     */
    EMPTY_CART_SELECTOR: "#empty_cart",
    /** Visible text of the empty-cart message (partial match safe) */
    EMPTY_CART_TEXT: "Cart is empty!",
    /**
     * CSS selector for the "Proceed To Checkout" button.
     * Rendered only when the cart has at least one item.
     * No href attribute — JS-driven navigation to /checkout.
     */
    PROCEED_TO_CHECKOUT_SELECTOR: "a.btn.btn-default.check_out",
    /** Visible text of the Proceed To Checkout button */
    PROCEED_TO_CHECKOUT_TEXT: "Proceed To Checkout",
  },
  ITEM: {
    /**
     * CSS selector for the product name link inside a cart item row.
     * Link text is the product name; href is the product detail URL (/product_details/{id}).
     */
    NAME_LINK_SELECTOR: ".cart_description h4 a",
    /** CSS selector for the product category paragraph inside a cart item row */
    CATEGORY_SELECTOR: ".cart_description p",
    /**
     * CSS selector for the unit price paragraph inside a cart item row.
     * Format: "Rs. {amount}"  (e.g., "Rs. 500")
     */
    UNIT_PRICE_SELECTOR: ".cart_price p",
    /**
     * CSS selector for the quantity display inside a cart item row.
     * Rendered as a read-only disabled button showing the integer quantity (e.g., "1").
     * No quantity input was observed — editing quantity is not confirmed as supported.
     */
    QUANTITY_SELECTOR: ".cart_quantity button.disabled",
    /**
     * CSS selector for the line total paragraph inside a cart item row.
     * Format: "Rs. {amount}"  (e.g., "Rs. 500")
     */
    LINE_TOTAL_SELECTOR: ".cart_total p.cart_total_price",
    /**
     * CSS selector for the delete/remove link in a cart item row.
     * Carries a data-product-id attribute matching the product's numeric id.
     * Clicking this link removes the item from the cart asynchronously (no full page reload).
     * After clicking, wait for the row to disappear rather than using a fixed wait.
     */
    DELETE_LINK_SELECTOR: "a.cart_quantity_delete",
    /** data-product-id attribute name on the delete link — use to target a specific product */
    DELETE_LINK_PRODUCT_ID_ATTR: "data-product-id",
  },
  MODAL: {
    /**
     * ID of the "Added!" confirmation modal shown after a product is added to the cart
     * from the product detail page or product listing.
     * Note: a third-party ad modal (div#checkoutModal) may intercept pointer events and
     * block interaction with this modal. Tests must account for ad overlay dismissal.
     */
    CONTAINER_ID: "cartModal",
    /** CSS selector for the "Added!" modal container */
    CONTAINER_SELECTOR: "#cartModal",
    /** CSS selector for the modal heading — text "Added!" */
    HEADING_SELECTOR: ".modal-header h4.modal-title",
    /** Expected heading text in the modal */
    HEADING_TEXT: "Added!",
    /** CSS selector for the confirmation message paragraph in the modal body */
    BODY_TEXT_SELECTOR: ".modal-body p:first-of-type",
    /** Expected body confirmation text */
    BODY_TEXT: "Your product has been added to cart.",
    /**
     * CSS selector for the "View Cart" link in the modal body.
     * Navigates to /view_cart when clicked.
     */
    VIEW_CART_LINK_SELECTOR: ".modal-body a[href='/view_cart']",
    /**
     * CSS selector for the "Continue Shopping" button in the modal footer.
     * Closes the modal via data-dismiss="modal".
     */
    CONTINUE_SHOPPING_SELECTOR: "button.close-modal",
    /** Visible text of the Continue Shopping button */
    CONTINUE_SHOPPING_TEXT: "Continue Shopping",
  },
  ADD_TO_CART: {
    /**
     * CSS selector for the "Add to cart" link on product listing cards.
     * Two variants exist on each card:
     *   - In-card button (always visible): inside .productinfo.text-center
     *   - Overlay button (visible on hover): inside .product-overlay
     * Both carry the data-product-id attribute.
     * Prefer the role-based locator on the product detail page:
     *   getByRole('button', { name: ADD_TO_CART_BUTTON_NAME })
     */
    LISTING_CARD_SELECTOR: "a.add-to-cart",
    /** data-product-id attribute name on listing card add-to-cart links */
    PRODUCT_ID_ATTR: "data-product-id",
    /**
     * Role-based locator name for the "Add to cart" button on the product detail page.
     * Use: getByRole('button', { name: CART_UI.ADD_TO_CART.DETAIL_BUTTON_NAME })
     */
    DETAIL_BUTTON_NAME: "Add to cart",
  },
  CHECKOUT: {
    /** CSS selector for the delivery address section on the checkout page */
    DELIVERY_ADDRESS_SELECTOR: "#address_delivery",
    /** CSS selector for the billing address section on the checkout page */
    BILLING_ADDRESS_SELECTOR: "#address_invoice",
    /** CSS selector for the order comment textarea on the checkout page */
    COMMENT_TEXTAREA_SELECTOR: "textarea.form-control",
    /**
     * CSS selector for the "Place Order" button on the checkout page.
     * DO NOT click this in smoke or REGRESSION tiers — it initiates an order mutation.
     * Only in scope for a dedicated e2e payment requirement approved by the owner.
     */
    PLACE_ORDER_SELECTOR: "a.btn.btn-default.check_out",
    /** Visible text of the Place Order button */
    PLACE_ORDER_TEXT: "Place Order",
  },
} as const;
