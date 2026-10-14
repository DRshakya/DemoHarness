import { test } from "../../fixtures/base.fixture";

test(
  "[AE-PRODUCT-005] searching with a keyword that matches no products shows an empty result set",
  { tag: ["@AE-PRODUCT-005", "@regression", "@P2", "@e2e"] },
  async ({ productListingHelpers }) => {
    await productListingHelpers.navigateToProductListing();
    await productListingHelpers.searchByKeyword("qxzqxzqxz");
    await productListingHelpers.assertNoSearchResults("qxzqxzqxz");
  },
);
