import { test } from "../../../fixtures/base.fixture";

test.describe.configure({ mode: "serial" });

test.afterEach(async ({ cartHelpers }) => {
  await cartHelpers.navigateToCart();
  await cartHelpers.removeAllCartItems();
});

test(
  "[AE-CART-003] cart page displays correct product name, unit price, quantity, and line total",
  { tag: ["@AE-CART-003", "@P1", "@smoke"] },
  async ({ cartHelpers }) => {
    await cartHelpers.addProductToCart("1");
    await cartHelpers.clickViewCartFromModal();
    await cartHelpers.assertFirstCartItemDetails("Blue Top", "Rs. 500", "1", "Rs. 500");
  },
);
