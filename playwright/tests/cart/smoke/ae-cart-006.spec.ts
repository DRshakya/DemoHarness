import { test } from "../../../fixtures/base.fixture";

test.describe.configure({ mode: "serial" });

test.afterEach(async ({ cartHelpers }) => {
  await cartHelpers.navigateToCart();
  await cartHelpers.removeAllCartItems();
});

test(
  "[AE-CART-006] clicking View Cart from the add-to-cart modal navigates to the cart page",
  { tag: ["@AE-CART-006", "@P1", "@smoke"] },
  async ({ cartHelpers }) => {
    await cartHelpers.addProductToCart("1");
    await cartHelpers.clickViewCartFromModal();
    await cartHelpers.assertOnCartPage();
  },
);
