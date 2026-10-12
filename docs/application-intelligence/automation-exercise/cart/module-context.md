# Module Context

Status: `APPROVED`

## Identity and evidence

| Field             | Value                                                                                         |
| ----------------- | --------------------------------------------------------------------------------------------- |
| Module            | `cart`                                                                                        |
| Business owner    | Dipankar Shakya (dipankarshakya@lftechnology.com)                                             |
| Source references | Owner specification; public site https://automationexercise.com/view_cart and /checkout       |
| Last verified     | 2026-10-12                                                                                    |

## Business intent

The cart module allows authenticated users to review the products they have selected for
purchase, adjust item quantities (quantity display only — no quantity editing observed),
remove individual items, and proceed to the checkout flow. The cart is the critical bridge
between product discovery and order placement. A broken cart blocks all purchase journeys
regardless of whether the catalog is functioning correctly.

An anonymous visitor can view the cart page at `/view_cart`, but the cart will always be
empty for an unauthenticated session because adding products requires authentication. The
"Proceed To Checkout" button is only rendered when the cart contains at least one item.

## Actors, permissions, and preconditions

| Actor or role      | Allowed behavior                                                                                    | Preconditions                                          | Denied behavior                                              |
| ------------------ | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------ |
| Anonymous visitor  | View `/view_cart` (sees empty cart state only); cannot add products                                 | Site is reachable                                      | Add to cart; proceed to checkout (button not shown)          |
| Authenticated user | View cart with items; remove items; proceed to checkout; add products from listing or detail page   | Valid session via TEST_EMAIL / TEST_PASSWORD env vars  | Place order without address data (out of scope)              |

## States and transitions

| Starting state               | Action                                                       | Expected state               | Observable evidence                                                                                    |
| ---------------------------- | ------------------------------------------------------------ | ---------------------------- | ------------------------------------------------------------------------------------------------------ |
| Any page / authenticated     | Click "Add to cart" on product detail page                   | "Added!" modal shown         | `#cartModal` with heading "Added!" and "Your product has been added to cart." text is visible          |
| "Added!" modal visible       | Click "View Cart" link in modal                              | Cart page with item visible  | Browser navigates to `/view_cart`; `table#cart_info_table` is visible; item row exists in `tbody tr`  |
| "Added!" modal visible       | Click "Continue Shopping"                                    | Modal closed; current page   | `#cartModal` dismisses; user remains on product page                                                   |
| Any page / authenticated     | Navigate directly to `/view_cart`                            | Cart page visible            | Page title "Automation Exercise - Checkout"; cart table present if items exist; breadcrumb shows "Shopping Cart" |
| Cart page / has items        | Inspect item row                                             | All item fields visible      | Product name, unit price, quantity, and line total are all present in the row                          |
| Cart page / has items        | Click delete link (`a.cart_quantity_delete`) for an item     | Item removed from cart       | That item's `tbody tr` is removed from the DOM; if cart is now empty, `#empty_cart` becomes visible   |
| Cart page / empty            | Inspect page                                                 | Empty cart state             | `#empty_cart` element visible; text "Cart is empty! Click here to buy products."; no table present    |
| Cart page / has items        | Click "Proceed To Checkout"                                  | Checkout page visible        | Browser navigates to `/checkout`; delivery and billing address sections and comment textarea visible    |
| Checkout page                | Inspect address details                                      | Address fields rendered      | `#address_delivery` and `#address_invoice` sections are visible with delivery/billing address text     |

## Technical contract

- Routes:
  - Cart page: `/view_cart` (confirmed via browser navigation, DISCOVER 2026-10-12)
  - Checkout page: `/checkout` (confirmed — navigated to after clicking "Proceed To Checkout")
  - Payment page: `/payment` (linked from "Place Order" button on `/checkout` — not scripted in DISCOVER)

- API requests and responses:
  - Cart and checkout pages: standard HTML page loads; no XHR/fetch observed during DISCOVER
  - Remove item: triggered by clicking `a.cart_quantity_delete` — DOM updates asynchronously without a full page reload; the row disappears from the table
  - Add to cart (from detail page): clicking `getByRole('button', { name: 'Add to cart' })` triggers the `#cartModal` modal — no XHR response was asserted at the API layer

- Stable selectors — confirmed via DISCOVER 2026-10-12. No `data-qa` attributes are present on any cart module elements:
  - **Cart page table**: `table#cart_info_table` (present only when cart contains items)
  - **Cart item row**: `tbody tr` (one per cart item; no specific row class observed)
  - **Product name in row**: `.cart_description h4 a` (link text = product name; href = `/product_details/{id}`)
  - **Product category in row**: `.cart_description p` (format: "{Gender} > {Subcategory}")
  - **Unit price in row**: `.cart_price p` (format: "Rs. {amount}")
  - **Quantity display in row**: `.cart_quantity button.disabled` (read-only button showing integer quantity; no input field)
  - **Line total in row**: `.cart_total p.cart_total_price` (format: "Rs. {amount}")
  - **Delete item link**: `a.cart_quantity_delete` (carries `data-product-id` attribute; no accessible text; clicking removes the item)
  - **Delete icon**: `i.fa.fa-times` (inside `a.cart_quantity_delete`; no text)
  - **Empty cart indicator**: `#empty_cart` (visible when cart has no items; text "Cart is empty! Click here to buy products.")
  - **Proceed to Checkout button**: `a.btn.btn-default.check_out` (text "Proceed To Checkout"; no href attribute; JS-driven navigation to `/checkout`; rendered only when cart has items)
  - **Checkout page — delivery address**: `#address_delivery`
  - **Checkout page — billing address**: `#address_invoice`
  - **Checkout page — comment textarea**: `textarea.form-control`
  - **Checkout page — Place Order**: `a.btn.btn-default.check_out` (text "Place Order"; navigates to `/payment`)
  - **"Added!" modal container**: `#cartModal`
  - **"Added!" modal heading**: `.modal-header h4.modal-title` (text "Added!")
  - **"Added!" modal body text**: `.modal-body p:first-of-type` (text "Your product has been added to cart.")
  - **"Added!" modal View Cart link**: `.modal-body a[href='/view_cart']`
  - **"Added!" modal Continue Shopping**: `button.close-modal` (data-dismiss="modal"; text "Continue Shopping")
  - **Add to cart from listing card (in-card button)**: `a.add-to-cart[data-product-id="{id}"]` inside `.productinfo.text-center`
  - **Add to cart from listing card (overlay button — visible on hover)**: `a.add-to-cart[data-product-id="{id}"]` inside `.product-overlay`

- Loading and error states:
  - No loading spinner observed on cart or checkout pages.
  - Empty cart state: `#empty_cart` is rendered when cart is empty (confirmed — authenticated and anonymous). No table is shown.
  - Remove-item DOM update is asynchronous: the row disappears without a full page reload. Tests must wait for the row's `a.cart_quantity_delete` count to decrease or for `#empty_cart` to appear, not use a fixed wait.
  - An ad overlay modal (`div#checkoutModal`) is injected on the cart page and can intercept pointer events on the `#cartModal`. This is the same ad-iframe risk documented in the product module. Dismissing or routing around ad overlays before interacting with cart modals is required.

- External dependencies:
  - Ad iframes: third-party advertising iframes and overlays are injected on `/view_cart`. The `div#checkoutModal` ad modal can intercept clicks on the add-to-cart confirmation modal. Tests must account for this.
  - Authentication: adding items to cart, viewing cart items, removing items, and proceeding to checkout all require an authenticated session established via the login module's `storageState`.

## Test-data lifecycle

- Synthetic data shape: Cart tests require at least one product to exist in the authenticated test account's cart. The product is added via the "Add to cart" button on a known product detail page (e.g., `/product_details/1`). No account creation is needed.
- Creation mechanism: A setup step navigates to a known product detail page and clicks "Add to cart", verifying the `#cartModal` appears. This must happen within the test or in a dedicated storage-state setup project.
- Isolation key: Cart state is scoped to the authenticated session. Each test that requires a specific cart state (empty, one item, multiple items) must establish that state explicitly, not rely on leftover state from prior tests.
- Failure-safe cleanup: Any item added during a test must be removed during teardown, even if the test fails. The delete mechanism (`a.cart_quantity_delete`) is available on `/view_cart`. A cleanup helper should navigate to `/view_cart` and click all delete links until `#empty_cart` is visible.
- Forbidden data: Real PII, real payment data, real order placement. Cart tests must not proceed past the `/checkout` page — the "Place Order" button must not be clicked in any tier until a dedicated payment-module requirement is approved. The product IDs used must be from the known catalog (e.g., product 1 "Blue Top", product 2, product 3) and must be treated as potentially unstable (same risk as the product module).

## Risks and candidate scenarios

| Risk                                                        | Candidate behavior                                                                               | Suggested Type | Suggested Priority | Evidence                                                                                                 |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | -------------- | ------------------ | -------------------------------------------------------------------------------------------------------- |
| Cart page is unreachable or broken                          | Cart page loads and shows correct empty or item state for authenticated user                     | SMOKE          | P0                 | Entry point to the purchase flow; a broken cart blocks all order journeys                                |
| Add to cart does not work from product detail page          | Clicking "Add to cart" on a detail page shows the "Added!" modal for an authenticated user       | SMOKE          | P1                 | Primary mechanism for populating the cart; silent failures block the purchase path                       |
| Cart does not display item details correctly                | Cart page shows correct product name, unit price, quantity, and line total for each item         | SMOKE          | P1                 | Incorrect totals or missing items cause user confusion and loss of trust                                 |
| Removing an item does not update the cart                   | Clicking the delete link removes the item row; empty cart state appears when last item is removed | REGRESSION    | P2                 | Cart cleanup is required for isolation in all cart tests; a broken delete blocks isolation strategy      |
| Cart total does not reflect quantity                        | Line total equals unit price multiplied by displayed quantity for each item                      | REGRESSION     | P2                 | A calculation error here is a pricing defect — high business impact even in a demo environment           |
| "Proceed To Checkout" navigates to the correct page         | Clicking "Proceed To Checkout" lands on `/checkout` with address and comment fields visible       | SMOKE          | P1                 | The checkout entry point must function for purchase journeys to be testable                              |
| Ad overlay intercepts modal interaction                     | Observed during DISCOVER — `div#checkoutModal` ad modal can intercept clicks on `#cartModal`     | (risk/defect)  | (note only)        | Tests must include a strategy to dismiss ad overlays before interacting with the add-to-cart modal       |

Suggested requirement IDs:
- AE-CART-001: Cart page loads and displays correct state (SMOKE P0)
- AE-CART-002: Adding a product to the cart from the product detail page shows the confirmation modal (SMOKE P1 — requires auth)
- AE-CART-003: Cart page displays correct product name, unit price, quantity, and line total (SMOKE P1 — requires auth + item in cart)
- AE-CART-004: Removing an item from the cart removes its row and shows empty state when last item is deleted (REGRESSION P2 — requires auth + item in cart)
- AE-CART-005: Cart line total equals unit price multiplied by quantity for each item (REGRESSION P2 — requires auth + item in cart)

## Unknowns

| Question                                                                              | Owner           | Blocking?                                              | Resolution                                                                                                     |
| ------------------------------------------------------------------------------------- | --------------- | ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| Can the quantity of a cart item be edited on the cart page?                           | Dipankar Shakya | Blocking for any quantity-update requirement           | Unresolved — DISCOVER confirmed the quantity displays as a `button.disabled` with no input; no edit observed   |
| Does the "Proceed To Checkout" button trigger a login modal for anonymous users?      | Dipankar Shakya | No — anonymous users see no button when cart is empty | Unresolved — the `div#checkoutModal` modal HTML contains a "Register / Login" prompt; not tested in DISCOVER   |
| What URL does the "Place Order" button on `/checkout` navigate to?                    | Dipankar Shakya | Blocking for any payment-module requirement            | Partially resolved — href="/payment" observed in HTML; not navigated to in DISCOVER to avoid mutation           |
| Are product IDs stable over time (same products available between sessions)?          | Dipankar Shakya | No — risk noted; use structure assertions              | Unresolved — inherited from product module; product_details/1 was "Blue Top" at Rs. 500 on 2026-10-12          |
| Does removing an item trigger a full page reload or an async DOM update?              | Dipankar Shakya | No — DISCOVER confirmed async DOM update              | Resolved — row removed from DOM without page reload; `a.cart_quantity_delete` count changes (DISCOVER 2026-10-12) |
| Is there a cart item count badge in the navigation bar?                               | Dipankar Shakya | No — not required for current draft requirements       | Unresolved — nav link text is " Cart" with no badge count observed in DISCOVER                                  |
| How does the ad overlay affect the add-to-cart modal interaction in automated tests?  | Dipankar Shakya | Potentially blocking — observed in DISCOVER            | Unresolved — `div#checkoutModal` intercepted clicks; a dismissal or ad-route-around strategy is required        |

## Approval

- [x] Business behavior matches the authoritative source.
- [x] Routes, APIs, selectors, and expected outcomes are verified.
- [x] Data creation and cleanup are safe.
- [x] Unknowns that affect assertions or safety are resolved.
