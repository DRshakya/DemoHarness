import { test } from "../../fixtures/base.fixture";

test(
  "[AE-PRODUCT-003] searching for a known keyword returns matching product results",
  { tag: ["@AE-PRODUCT-003", "@P1", "@smoke"] },
  async ({ productListingHelpers }) => {
    await productListingHelpers.navigateToProductListing();
    await productListingHelpers.searchByKeyword("dress");
    await productListingHelpers.assertSearchResultsVisible("dress");
  },
);
