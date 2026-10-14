import { test } from "../../fixtures/base.fixture";

test(
  "[AE-PRODUCT-002] product detail page loads and displays correct product information",
  { tag: ["@AE-PRODUCT-002", "@P1", "@smoke"] },
  async ({ productDetailHelpers }) => {
    await productDetailHelpers.navigateToProductDetail("1");
    await productDetailHelpers.assertDetailFieldsVisible();
  },
);
