import { test as setup } from "@playwright/test";
import { LoginHelpers } from "../helpers/modules/login.helpers";
import { CartHelpers } from "../helpers/cart/cart.helper";
import { STORAGE_STATE_PATH } from "@configs/app/auth";

setup("authenticate", async ({ page }) => {
  const login = new LoginHelpers(page);
  await login.visitLoginPage();
  await login.submitValidCredentials();
  await login.assertAuthenticatedSession();

  // Clear any accumulated cart state so every suite starts with an empty cart.
  const cart = new CartHelpers(page);
  await cart.navigateToCart();
  await cart.removeAllCartItems();

  await page.context().storageState({ path: STORAGE_STATE_PATH });
});
