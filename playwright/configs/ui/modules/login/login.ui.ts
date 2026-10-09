/**
 * Verified selectors and test-data constants for the login module.
 * Source: DISCOVER phase — https://www.automationexercise.com/login (2026-10-08)
 * Both login and signup forms share the same page; data-qa attributes disambiguate.
 */
export const LOGIN_UI = {
  FORM: {
    EMAIL_INPUT: "login-email",
    PASSWORD_INPUT: "login-password",
    SUBMIT_BUTTON_NAME: "Login",
  },
  MESSAGES: {
    INVALID_CREDENTIALS: "Your email or password is incorrect!",
  },
  TEST_DATA: {
    INVALID_EMAIL: "invalid@example.com",
  },
} as const;
