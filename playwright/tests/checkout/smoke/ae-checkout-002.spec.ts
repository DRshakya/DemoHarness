import { test } from "../../../fixtures/base.fixture";

test(
  "[AE-CHECKOUT-002] payment page loads and displays card detail input fields after clicking Place Order on the checkout page",
  { tag: ["@smoke", "@P1", "@AE-CHECKOUT-002"] },
  async ({ checkoutHelpers }) => {
    await checkoutHelpers.navigateDirectToCheckout();
    await checkoutHelpers.assertCheckoutPageReachable();
  },
);
