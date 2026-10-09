import { test } from "../../../fixtures/base.fixture";

test(
  "[AE-LOGIN-004] submitting an empty login form shows a validation error and keeps the user on the login page",
  { tag: ["@regression", "@P2", "@AE-LOGIN-004", "@e2e"] },
  async ({ loginHelpers }) => {
    // Arrange
    await loginHelpers.visitLoginPage();

    // Act — submit with both fields empty
    await loginHelpers.submitEmptyForm();

    // Assert — browser blocked submission; email input reports a missing-value validity error
    await loginHelpers.assertEmailValidityError();

    // Assert — page did not navigate away from the login URL
    await loginHelpers.assertRemainsOnLoginPage();

    // Assert — no session was established (Logout link must not be visible)
    await loginHelpers.assertNotAuthenticated();
  },
);
