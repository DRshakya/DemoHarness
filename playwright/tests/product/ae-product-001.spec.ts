import { test } from "../../fixtures/base.fixture";

test(
  "[AE-PRODUCT-001] product listing page loads and displays products",
  { tag: ["@AE-PRODUCT-001", "@P0", "@smoke"] },
  async ({ productListingHelpers }) => {
    await productListingHelpers.navigateToProductListing();
    await productListingHelpers.assertProductListingLoaded();
  },
);
