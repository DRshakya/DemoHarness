import { test, expect } from "../../fixtures/base.fixture";

test(
  "[AE-PRODUCT-004] clicking View Product from the listing navigates to the correct product detail page",
  { tag: ["@AE-PRODUCT-004", "@P1", "@smoke"] },
  async ({ page, productListingHelpers, productDetailHelpers }) => {
    await productListingHelpers.navigateToProductListing();
    const productName =
      await productListingHelpers.clickFirstViewProductAndGetName();
    await expect(page).toHaveURL(/\/product_details\/\d+/);
    await productDetailHelpers.assertDetailProductNameMatches(productName);
  },
);
