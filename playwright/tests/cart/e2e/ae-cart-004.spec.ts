import { test } from "../../../fixtures/base.fixture";

test.describe.configure({ mode: "serial" });

test.afterEach(async ({ cartHelpers }) => {
  await cartHelpers.navigateToCart();
  await cartHelpers.removeAllCartItems();
});

test(
  "[AE-CART-004] removing an item removes its row; last item removal shows empty state",
  { tag: ["@regression", "@AE-CART-004", "@P2", "@e2e"] },
  async ({ cartHelpers }) => {
    await cartHelpers.addProductToCart("1");
    await cartHelpers.clickViewCartFromModal();
    await cartHelpers.removeAllCartItems();
    await cartHelpers.assertCartIsEmpty();
  },
);
