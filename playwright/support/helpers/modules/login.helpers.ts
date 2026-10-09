import { expect, type Page } from "@playwright/test";
import { ROUTES } from "@configs/app/routes";
import { LOGIN_UI } from "@configs/ui/modules/login/login.ui";
import { NAVIGATION_UI } from "@configs/ui/shared/navigation.ui";

export class LoginHelpers {
  constructor(private readonly page: Page) {}

  async visitLoginPage(): Promise<void> {
    await this.page.goto(ROUTES.LOGIN.ROOT);
  }

  async assertLoginFormVisible(): Promise<void> {
    await expect(
      this.page.getByTestId(LOGIN_UI.FORM.EMAIL_INPUT),
    ).toBeVisible();
    await expect(
      this.page.getByTestId(LOGIN_UI.FORM.PASSWORD_INPUT),
    ).toBeVisible();
    await expect(
      this.page.getByRole("button", { name: LOGIN_UI.FORM.SUBMIT_BUTTON_NAME }),
    ).toBeVisible();
  }

  /** Shared fill-and-submit logic. All credential submission methods delegate here. */
  private async submitCredentials(email: string, password: string): Promise<void> {
    await this.page.getByTestId(LOGIN_UI.FORM.EMAIL_INPUT).fill(email);
    await this.page.getByTestId(LOGIN_UI.FORM.PASSWORD_INPUT).fill(password);
    await this.page.getByRole("button", { name: LOGIN_UI.FORM.SUBMIT_BUTTON_NAME }).click();
  }

  async submitInvalidCredentials(email: string, password: string): Promise<void> {
    await this.submitCredentials(email, password);
  }

  async submitValidCredentials(): Promise<void> {
    const email = process.env.TEST_EMAIL;
    const password = process.env.TEST_PASSWORD;
    if (!email || !password) {
      throw new Error("TEST_EMAIL and TEST_PASSWORD must be set in .env");
    }
    await this.submitCredentials(email, password);
  }

  async assertInvalidCredentialsError(): Promise<void> {
    await expect(
      this.page.getByText(LOGIN_UI.MESSAGES.INVALID_CREDENTIALS),
    ).toBeVisible();
  }

  async assertRemainsOnLoginPage(): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(`${ROUTES.LOGIN.ROOT}$`));
  }

  async submitEmptyForm(): Promise<void> {
    await this.page.getByRole("button", { name: LOGIN_UI.FORM.SUBMIT_BUTTON_NAME }).click();
  }

  /** Asserts the email input's required constraint is active via auto-retrying poll. */
  async assertEmailValidityError(): Promise<void> {
    const locator = this.page.getByTestId(LOGIN_UI.FORM.EMAIL_INPUT);
    await expect
      .poll(() => locator.evaluate((el: HTMLInputElement) => el.validity.valueMissing))
      .toBe(true);
  }

  /** Asserts that no authenticated session exists: the Logout link must not be visible. */
  async assertNotAuthenticated(): Promise<void> {
    await expect(
      this.page.getByRole("link", { name: NAVIGATION_UI.LOGOUT_LINK_TEXT }),
    ).not.toBeVisible();
  }

  async assertAuthenticatedSession(): Promise<void> {
    await expect(this.page).not.toHaveURL(new RegExp(`${ROUTES.LOGIN.ROOT}$`));
    await expect(
      this.page.getByRole("link", { name: NAVIGATION_UI.LOGOUT_LINK_TEXT }),
    ).toBeVisible();
  }
}
