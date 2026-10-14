import { test } from "../../../fixtures/base.fixture";

test(
  "[AE-CART-001] cart page loads and shows correct state for authenticated user",
  { tag: ["@AE-CART-001", "@P0", "@smoke"] },
  async ({ cartHelpers }) => {
    await cartHelpers.navigateToCart();
    await cartHelpers.assertCartPageLoaded();
  },
);
