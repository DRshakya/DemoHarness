import { test } from "../../../fixtures/base.fixture";
import { KNOWN_PRODUCT_ID } from "@configs/ui/modules/checkout/checkout.ui";

test.afterEach(async ({ cartHelpers }) => {
  await cartHelpers.navigateToCart();
  await cartHelpers.removeAllCartItems();
});

test(
  "[AE-CHECKOUT-005] order comment entered on checkout page is accepted without error before proceeding to payment",
  { tag: ["@regression", "@P2", "@AE-CHECKOUT-005", "@e2e"] },
  async ({ cartHelpers, checkoutHelpers }) => {
    const orderComment =
      "This is a synthetic test comment used to verify the checkout textarea accepts free-form text input without any validation error. Character count is within the 200-character acceptance threshold.";

    await cartHelpers.addProductToCart(KNOWN_PRODUCT_ID);
    await checkoutHelpers.proceedToCheckoutFromCart();
    await checkoutHelpers.enterOrderComment(orderComment);
    await checkoutHelpers.clickPlaceOrder();
    await checkoutHelpers.assertPaymentPageLoaded();
  },
);
