import { test } from "../../../fixtures/base.fixture";
import { LOGIN_UI } from "@configs/ui/modules/login/login.ui";

test(
  "[AE-LOGIN-001] login page loads and displays the authentication form",
  { tag: ["@smoke", "@P0", "@AE-LOGIN-001"] },
  async ({ loginHelpers }) => {
    await loginHelpers.visitLoginPage();
    await loginHelpers.assertLoginFormVisible();
  },
);

test(
  "[AE-LOGIN-002] valid credentials result in an authenticated session",
  { tag: ["@smoke", "@P0", "@AE-LOGIN-002"] },
  async ({ loginHelpers }) => {
    await loginHelpers.visitLoginPage();
    await loginHelpers.submitValidCredentials();
    await loginHelpers.assertAuthenticatedSession();
  },
);

test(
  "[AE-LOGIN-003] invalid credentials display an error message and deny access",
  { tag: ["@smoke", "@P1", "@AE-LOGIN-003"] },
  async ({ loginHelpers }) => {
    await loginHelpers.visitLoginPage();
    await loginHelpers.submitInvalidCredentials(
      LOGIN_UI.TEST_DATA.INVALID_EMAIL,
      `invalid-${crypto.randomUUID()}`,
    );
    await loginHelpers.assertInvalidCredentialsError();
    await loginHelpers.assertRemainsOnLoginPage();
    await loginHelpers.assertNotAuthenticated();
  },
);
