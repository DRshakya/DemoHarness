import { test } from "../../../fixtures/base.fixture";
import { SYNTHETIC_CARD } from "../../../support/helpers/checkout/checkout.helpers";
import { KNOWN_PRODUCT_ID } from "@configs/ui/modules/checkout/checkout.ui";

test.afterEach(async ({ cartHelpers }) => {
  await cartHelpers.navigateToCart();
  await cartHelpers.removeAllCartItems();
});

test(
  "[AE-CHECKOUT-003] submitting valid card details results in an order confirmation page",
  { tag: ["@regression", "@P1", "@AE-CHECKOUT-003", "@e2e"] },
  async ({ cartHelpers, checkoutHelpers }) => {
    await cartHelpers.addProductToCart(KNOWN_PRODUCT_ID);
    await checkoutHelpers.completeCheckoutFlow(SYNTHETIC_CARD);
    await checkoutHelpers.assertOrderConfirmed();
    // AE-CHECKOUT-004 assertion covered here to avoid placing two real orders
    await checkoutHelpers.assertOrderIdInUrl();
  },
);
