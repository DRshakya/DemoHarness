# Module Context

Status: `DISCOVER confirmed 2026-10-14`

## Identity and evidence

| Field             | Value                                                                                                   |
| ----------------- | ------------------------------------------------------------------------------------------------------- |
| Module            | `checkout`                                                                                              |
| Business owner    | Dipankar Shakya (dipankarshakya@lftechnology.com)                                                       |
| Source references | Owner specification; public site https://automationexercise.com/checkout and /payment; cart module-context.md verified 2026-10-12; DISCOVER pass 2026-10-14 against live automationexercise.com |
| Last verified     | 2026-10-14 (DISCOVER confirmed)                                                                         |

## Business intent

The checkout module is the final purchase stage for authenticated users. It spans two
pages — the checkout review page (`/checkout`) and the payment page (`/payment`) — and
terminates at an order confirmation screen. Users review their pre-filled delivery and
billing addresses, optionally attach a comment to the order, advance to the payment page,
enter card details, and submit the order. A successful submission yields an order
confirmation containing a unique order ID.

The checkout module is a write path: placing an order is a mutation and must never be
exercised in a smoke or read-only tier. Smoke coverage is limited to verifying that the
checkout page renders correctly for an authenticated user who has items in the cart.
Payment submission and order confirmation are exclusively e2e coverage.

Authentication is required for the entire checkout flow. The cart module's `storageState`
setup project must be satisfied before any checkout test runs, and at least one product
must be present in the cart.

## Actors, permissions, and preconditions

| Actor or role      | Allowed behavior                                                                                  | Preconditions                                                                   | Denied behavior                                             |
| ------------------ | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| Anonymous visitor  | May access `/checkout` URL but is shown a "Register / Login" prompt modal, not address details    | Site is reachable                                                               | See address data; submit payment; receive confirmation      |
| Authenticated user | Review addresses, enter comment, navigate to payment page, enter card details, place order        | Valid session via TEST_EMAIL / TEST_PASSWORD; at least one item in cart         | Access checkout with an empty cart (button not rendered)    |

Note: The anonymous-user behaviour on `/checkout` (the `div#checkoutModal` containing a
"Register / Login" prompt) was observed in cart module DISCOVER 2026-10-12 but the exact
HTML of the prompt and the redirect target were not fully scripted. This is an unresolved
detail; see the Unknowns section.

## States and transitions

| Starting state                   | Action                                                       | Expected state               | Observable evidence                                                                                                  |
| -------------------------------- | ------------------------------------------------------------ | ---------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Cart page / has items / auth     | Click "Proceed To Checkout"                                  | Checkout page loaded         | Browser navigates to `/checkout`; `#address_delivery` and `#address_invoice` sections visible; `textarea.form-control` present |
| Checkout page / auth             | Inspect delivery address section                             | Address details rendered     | `#address_delivery` block contains the test account's pre-filled name and address text                               |
| Checkout page / auth             | Inspect billing address section                              | Address details rendered     | `#address_invoice` block contains pre-filled billing address text                                                    |
| Checkout page / auth             | Enter optional order comment in `textarea.form-control`      | Comment staged for order     | Text entered in the textarea is retained until form submission                                                       |
| Checkout page / auth             | Click "Place Order"                                          | Payment page loaded          | Browser navigates to `/payment`; card-detail form is visible (fields: name on card, card number, CVC, expiry)       |
| Payment page / auth              | Enter valid card details and click "Pay and Confirm Order"   | Order confirmation visible   | Browser navigates to order confirmation page; confirmation heading and order ID are visible                           |
| Order confirmation page          | Inspect page                                                 | Confirmation details visible | A unique order ID/number is displayed; a success message is present; user may continue shopping                      |

## Technical contract

- Routes:
  - Cart page (entry point): `/view_cart` (confirmed via cart module DISCOVER 2026-10-12)
  - Checkout review page: `/checkout` (confirmed — navigated to after clicking "Proceed To Checkout"; cart module DISCOVER 2026-10-12)
  - Payment page: `/payment` (href="/payment" observed in cart module DISCOVER HTML; not navigated to in DISCOVER to avoid mutation)
  - Order confirmation page: `/payment_done/{numeric_id}` — DISCOVER confirmed 2026-10-14 (e.g., `/payment_done/1500`)

- API requests and responses:
  - Checkout page load: standard HTML GET; no XHR/fetch observed for the address sections.
  - Payment submission: HTTP POST assumed (order-creation mutation). Exact endpoint, request payload shape, and response schema are unverified — requires DISCOVER or network inspection.
  - No API-layer assertions are defined for current draft requirements. Assertions are UI-observable only.

- Stable selectors — partially confirmed via cart module DISCOVER 2026-10-12. Payment and confirmation page selectors are unverified and require a dedicated DISCOVER pass before BUILD:

  **Checkout page (`/checkout`) — verified in cart module DISCOVER 2026-10-12:**
  - Delivery address block: `#address_delivery`
  - Billing address block: `#address_invoice`
  - Order comment textarea: `textarea.form-control`
  - Place Order button: `a.btn.btn-default.check_out` (text "Place Order"; navigates to `/payment`)

  **Payment page (`/payment`) — all `data-qa` attributes DISCOVER confirmed 2026-10-14:**
  - Name on card field: `[data-qa="name-on-card"]`
  - Card number field: `[data-qa="card-number"]`
  - CVC field: `[data-qa="cvc"]`
  - Expiration month field: `[data-qa="expiry-month"]`
  - Expiration year field: `[data-qa="expiry-year"]`
  - Pay and Confirm Order button: `[data-qa="pay-button"]`, text: "Pay and Confirm Order"
  - Note: `getByLabel()` is NOT feasible — labels have no `for` attribute and inputs have no `id`

  **Order confirmation page (`/payment_done/{numeric_id}`) — DISCOVER confirmed 2026-10-14:**
  - Confirmation heading: `[data-qa="order-placed"]` (`h2` element, text: "Order Placed!")
  - Success paragraph: `<p>Congratulations! Your order has been confirmed!</p>` — no `data-qa`, no class; matched by visible text
  - Order ID: NOT in the DOM — appears only in the URL path (e.g., `/payment_done/1500`)
  - Continue button: `[data-qa="continue-button"]` — returns user to home
  - `waitForURL` must use `{ timeout: 20000 }` — site is slow after payment submission

- Loading and error states:
  - No loading spinner was observed on `/checkout` during cart module DISCOVER.
  - If a user reaches `/checkout` without items in the cart, behaviour is unverified (likely redirect or empty state — not scripted).
  - Payment form validation (empty or invalid card fields) is unverified.
  - Payment failure state (declined card) is unverified.

- External dependencies:
  - Authentication: the full checkout flow requires an active authenticated session from the login module's `storageState`.
  - Cart state: at least one item must be in the cart before `/checkout` renders address details. The cart module's setup step (add product via `/product_details/{id}`) is a precondition.
  - Ad overlays: third-party ad iframes and the `div#checkoutModal` ad modal documented in the cart module are also present on the checkout entry path. Tests must account for ad overlay dismissal before interacting with checkout controls.

## Test-data lifecycle

- Synthetic data shape: Checkout tests require at least one product in the authenticated test account's cart. The test account must have a pre-existing delivery and billing address (filled during account registration or profile setup). The card details used on the payment page must be synthetic test values (no real card numbers).
- Creation mechanism: The setup step follows the cart module pattern — navigate to a known product detail page (e.g., `/product_details/1`), click "Add to cart", confirm the `#cartModal` appears, then navigate to `/view_cart` and click "Proceed To Checkout". This setup must run in a dedicated setup project or as an explicit before-hook in the e2e test.
- Isolation key: Checkout state is scoped to the authenticated session. Each e2e test that places an order creates a new order record. There is no known order-deletion mechanism on automationexercise.com, so placed orders accumulate in the test account. This is acceptable for a public demo site but must be noted.
- Failure-safe cleanup: The checkout flow is a forward-only mutation. If the test fails before order confirmation, the cart may retain items. A cleanup helper that navigates to `/view_cart` and removes all items (using `a.cart_quantity_delete` until `#empty_cart` is visible) must run in teardown.
- Forbidden data: Real card numbers, real PII, real payment credentials. All card inputs must use synthetic test values. No real orders must be placed with genuine financial instrument data.
- Known gap: The test account address is pre-filled from account registration. If the account has no address saved, the checkout page may render empty address fields. This has not been verified and is an open unknown.

## Risks and candidate scenarios

| Risk                                                                       | Candidate behavior                                                                                   | Suggested Type  | Suggested Priority | Evidence                                                                                                                    |
| -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | --------------- | ------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| Checkout page is unreachable or does not render address sections           | Checkout page loads and shows pre-filled delivery and billing address sections for auth user          | SMOKE           | P0                 | Entry point to the payment flow; a broken checkout page blocks all order journeys                                           |
| Payment page is unreachable or does not show card input fields             | Payment page loads and card detail fields are visible after clicking "Place Order"                   | SMOKE           | P1                 | Payment form must render before any submission can be tested; visibility confirms routing works                             |
| Placing an order with valid card details does not produce a confirmation   | Submitting valid card data on the payment page results in an order confirmation page                 | REGRESSION      | P1                 | Core e2e happy path — the only end-to-end proof that the purchase flow completes successfully                               |
| Order confirmation page does not display an order ID                       | Order confirmation page shows a unique order ID after a successful payment submission                | REGRESSION      | P1                 | Without a verifiable order ID, the confirmation cannot be linked to the placed order; this is an audit and trust risk        |
| Order comment entered at checkout is not submitted with the order          | Order comment text entered in `textarea.form-control` is accepted without error before placing order | REGRESSION      | P2                 | Comment feature is part of the stated checkout UI; a broken textarea is a regression against stated functionality            |
| Anonymous user accessing checkout is not prompted to log in                | An unauthenticated session reaching `/checkout` is shown the login/register prompt                  | REGRESSION      | P2                 | Access-control boundary; a missing prompt would expose address data to unauthenticated users (even on a demo site)          |

Suggested requirement IDs:
- AE-CHECKOUT-001: Checkout page loads and shows address sections and comment form — SMOKE P0
- AE-CHECKOUT-002: Payment page loads with card detail fields visible after proceeding from checkout — SMOKE P1
- AE-CHECKOUT-003: Full checkout: valid card details result in order confirmation page — REGRESSION P1
- AE-CHECKOUT-004: Order confirmation page displays a unique order ID — REGRESSION P1
- AE-CHECKOUT-005: Order comment entered at checkout is accepted without error — REGRESSION P2

## Unknowns

| Question                                                                                            | Owner           | Blocking?                                                        | Resolution                                                                                                                          |
| --------------------------------------------------------------------------------------------------- | --------------- | ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| What are the exact selectors on the payment page (`/payment`)?                                      | Dipankar Shakya | ~~Blocking for AE-CHECKOUT-002 and AE-CHECKOUT-003 BUILD~~       | **RESOLVED — DISCOVER 2026-10-14**: all `data-qa` selectors confirmed; see Technical contract above.                                |
| What is the route and HTML structure of the order confirmation page?                                | Dipankar Shakya | ~~Blocking for AE-CHECKOUT-003 and AE-CHECKOUT-004 BUILD~~       | **RESOLVED — DISCOVER 2026-10-14**: route is `/payment_done/{numeric_id}`; `[data-qa="order-placed"]` h2 confirmed; order ID is in the URL, not the DOM. |
| Does the test account have a pre-filled delivery and billing address?                               | Dipankar Shakya | ~~Blocking for AE-CHECKOUT-001, AE-CHECKOUT-002, AE-CHECKOUT-003~~ | **RESOLVED — DISCOVER 2026-10-14**: `#address_delivery` and `#address_invoice` confirmed pre-filled for the test account.          |
| What synthetic card values are accepted by the payment form without triggering a real transaction?  | Dipankar Shakya | ~~Blocking for AE-CHECKOUT-003 BUILD~~                           | **RESOLVED — DISCOVER 2026-10-14**: automationexercise.com demo site accepts any non-empty synthetic values; `4111111111111111` / CVC `123` / month `12` / year `2027` confirmed. |
| Does placing an order create a persistent order record that cannot be deleted?                      | Dipankar Shakya | No — acceptable for demo site; noted for cleanup strategy        | Unresolved — no order-management or deletion endpoint has been observed; orders accumulate in the test account. Acceptable for a public demo site. |
| What does an unauthenticated user see when navigating directly to `/checkout`?                      | Dipankar Shakya | Blocking for AE-CHECKOUT-006 (if added)                          | Partially unresolved — `div#checkoutModal` with "Register / Login" prompt observed in cart module DISCOVER; not fully scripted for this module. |
| Does the payment page (`/payment`) require a prior POST or session state from `/checkout`?          | Dipankar Shakya | No longer blocking — flow tested end-to-end                      | **RESOLVED — DISCOVER 2026-10-14**: full flow `/view_cart → /checkout → /payment → /payment_done/{id}` confirmed working.          |
| Are `data-qa` attributes present on any checkout or payment page elements?                          | Dipankar Shakya | ~~Affects locator strategy for BUILD~~                           | **RESOLVED — DISCOVER 2026-10-14**: all payment form fields and confirmation heading use `data-qa` attributes (see Technical contract). Checkout page address blocks use `id` selectors (already verified). |

## Approval

- [x] Business behavior matches the authoritative source.
- [x] Routes, APIs, selectors, and expected outcomes are verified (DISCOVER confirmed 2026-10-14).
- [x] Data creation and cleanup are safe.
- [x] Unknowns that affect assertions or safety are resolved (see Unknowns table above).
