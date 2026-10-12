import { test } from "../../../fixtures/base.fixture";

test.describe.configure({ mode: "serial" });

test.afterEach(async ({ cartHelpers }) => {
  await cartHelpers.navigateToCart();
  await cartHelpers.removeAllCartItems();
});

test(
  "[AE-CART-005] cart line total equals unit price multiplied by displayed quantity for each item",
  { tag: ["@AE-CART-005", "@regression", "@P2", "@e2e"] },
  async ({ cartHelpers }) => {
    await cartHelpers.addProductToCart("1");
    await cartHelpers.clickViewCartFromModal();
    await cartHelpers.assertLineTotalsMatchPriceTimesQuantity();
  },
);
