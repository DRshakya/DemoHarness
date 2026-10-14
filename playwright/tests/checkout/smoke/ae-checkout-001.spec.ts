import { test } from "../../../fixtures/base.fixture";

test(
  "[AE-CHECKOUT-001] checkout page loads and displays pre-filled delivery address, billing address, and order comment section for an authenticated user with items in cart",
  { tag: ["@smoke", "@P0", "@AE-CHECKOUT-001"] },
  async ({ checkoutHelpers }) => {
    await checkoutHelpers.navigateDirectToCheckout();
    await checkoutHelpers.assertCheckoutPageReachable();
  },
);
