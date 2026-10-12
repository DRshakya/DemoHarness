import { test } from "../../../fixtures/base.fixture";

test.describe.configure({ mode: "serial" });

test.afterEach(async ({ cartHelpers }) => {
  await cartHelpers.navigateToCart();
  await cartHelpers.removeAllCartItems();
});

test(
  "[AE-CART-007] clicking Continue Shopping from the add-to-cart modal dismisses the modal and stays on the product detail page",
  { tag: ["@AE-CART-007", "@P1", "@smoke"] },
  async ({ cartHelpers }) => {
    await cartHelpers.addProductToCart("1");
    await cartHelpers.clickContinueShoppingFromModal();
    await cartHelpers.assertStaysOnProductDetailPage("1");
  },
);
