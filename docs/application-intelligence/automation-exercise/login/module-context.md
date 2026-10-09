# Module Context

Status: `APPROVED`

## Identity and evidence

| Field             | Value                                                                     |
| ----------------- | ------------------------------------------------------------------------- |
| Module            | `login`                                                                   |
| Business owner    | Dipankar Shakya (dipankarshakya@lftechnology.com)                         |
| Source references | Owner specification; public site https://www.automationexercise.com/login |
| Last verified     | 2026-10-08                                                                |

## Business intent

The login module allows a registered user to authenticate with the application using an email address and password. Authentication is the gateway to all protected features. Failure of the login flow blocks all downstream user journeys; it is a P0 risk for any release.

The test account designated for automation is configured via the `TEST_EMAIL` environment variable. The corresponding password is available only via the `TEST_PASSWORD` environment variable — neither value must ever appear as a literal value in any source file.

## Actors, permissions, and preconditions

| Actor or role         | Allowed behavior                                              | Preconditions                                              | Denied behavior                                        |
| --------------------- | ------------------------------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------ |
| Registered user       | Submit valid credentials and gain an authenticated session    | Account exists; correct email and password                 | Access protected pages without a session               |
| Unregistered visitor  | View the login page; receive an error for invalid credentials | No prior account for the supplied email                    | Gain an authenticated session with invalid credentials |
| Already-authenticated | Not in scope for current active requirements                  | Active session cookie/token present in the browser context | N/A                                                    |

## States and transitions

| Starting state          | Action                                        | Expected state               | Observable evidence                                                          |
| ----------------------- | --------------------------------------------- | ---------------------------- | ---------------------------------------------------------------------------- |
| Unauthenticated visitor | Navigate to login URL                         | Login form is visible        | Email input, password input, and submit control are present on the page      |
| Login form visible      | Submit valid email + password                 | Authenticated session active | Browser navigates away from `/login`; "Logout" nav link becomes visible      |
| Login form visible      | Submit invalid email or wrong password        | Error state on login page    | `Your email or password is incorrect!` shown in red `<p>`; URL stays `/login` |
| Login form visible      | Submit with empty email and/or empty password | Validation error visible     | Browser-native HTML5 required constraint blocks submission; `validity.valueMissing` is true |
| Already authenticated   | Navigate to login URL                         | Not in scope                 | Not covered by current active requirements                                    |

## Technical contract

- Routes:
  - Login page URL: `https://www.automationexercise.com/login` (confirmed via browser navigation during DISCOVER 2026-10-08)
  - Post-login redirect target: Not directly asserted — "Logout" nav link visibility is used as the authenticated indicator instead
- API requests and responses:
  - Login form submission method: Standard HTML form POST (confirmed via DISCOVER 2026-10-08; no XHR/fetch observed)
  - Request payload shape: Not asserted at the API layer — test coverage uses UI assertions only
  - Success response indicator: "Logout" nav link visible post-login
  - Error response indicator: `Your email or password is incorrect!` in `<p style="color: red;">`
- Stable selectors (confirmed via DISCOVER 2026-10-08):
  - Email input: `data-qa="login-email"` → `getByTestId("login-email")`
  - Password input: `data-qa="login-password"` → `getByTestId("login-password")`
  - Submit button: `data-qa="login-button"` → `getByRole("button", { name: "Login" })`
  - Error message: `getByText("Your email or password is incorrect!")`
  - Logout link (post-auth): `getByRole("link", { name: "Logout" })`
- Loading and error states:
  - No loading spinner observed; submit button is not disabled during submission.
  - Error message: `Your email or password is incorrect!` in a `<p style="color: red;">` element.
- External dependencies:
  - CAPTCHA: Google reCAPTCHA v2 iframe is present on the page but is NOT server-side enforced. Automated login proceeds without CAPTCHA solving.
  - Third-party authentication providers (social login): None observed.

## Test-data lifecycle

- Synthetic data shape: Email (from `TEST_EMAIL` env var) + password (from `TEST_PASSWORD` env var). Account is pre-existing on the public site.
- Creation mechanism: Manual — account was created by the project owner outside of automation. No programmatic account creation is in scope for the login module.
- Isolation key: The test account email address. Credentials are shared across all login tests; tests must not mutate account state (e.g., change password, delete account) within this module.
- Failure-safe cleanup: No state mutation occurs in smoke tests. If future e2e tests create session state, the storage-state file is ephemeral and does not require cleanup.
- Forbidden data: Real PII, production accounts, payment details. The `TEST_PASSWORD` value must never be written to any source file, log output, or test report.

## Risks and candidate scenarios

| Risk                                  | Candidate behavior                                                         | Suggested Type | Suggested Priority | Evidence                                                                                                 |
| ------------------------------------- | -------------------------------------------------------------------------- | -------------- | ------------------ | -------------------------------------------------------------------------------------------------------- |
| Login page is unreachable or broken   | Login page loads and form elements are present                             | SMOKE          | P0                 | Login is the entry point to all protected features                                                       |
| Valid credentials do not grant access | Submitting correct email + password results in an authenticated session    | SMOKE          | P0                 | Core happy path; failure blocks all downstream scenarios                                                 |
| Invalid credentials grant access      | Submitting wrong credentials shows an error, not a session                 | SMOKE          | P1                 | Security boundary; a bypass here is a critical defect                                                    |
| Empty submission accepted             | Submitting blank email and/or password triggers a visible validation error | REGRESSION     | P2                 | UX guard; failure degrades experience but is not a security breach if server-side validation also exists |

## Unknowns

| Question                                                                         | Owner           | Blocking?                                                | Resolution                                                                                  |
| -------------------------------------------------------------------------------- | --------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| What is the exact redirect target URL after successful login?                    | Dipankar Shakya | No — AE-LOGIN-002 asserts Logout link visibility instead of URL | Resolved — "Logout" nav link visible post-login (DISCOVER 2026-10-08)       |
| What is the exact error message shown for invalid credentials?                   | Dipankar Shakya | Resolved                                                        | `Your email or password is incorrect!` (DISCOVER 2026-10-08)                |
| Is CAPTCHA or bot-detection present on the login form?                           | Dipankar Shakya | Resolved — not enforced                                         | reCAPTCHA v2 iframe present but not server-enforced (DISCOVER 2026-10-08)   |
| What is the stable selector attribute on login form inputs?                      | Dipankar Shakya | Resolved                                                        | `data-qa` attribute confirmed on all login form elements (DISCOVER 2026-10-08) |
| Does submitting with empty fields produce client-side or server-side validation? | Dipankar Shakya | Resolved                                                        | Browser-native HTML5 `required` constraint — client-side only (DISCOVER 2026-10-08) |
| What happens when an already-authenticated user navigates to the login URL?      | Dipankar Shakya | No — affects a candidate scenario but not the P0 path           | Unresolved — not in scope for current active requirements                   |

## Approval

- [x] Business behavior matches the authoritative source.
- [x] Routes, APIs, selectors, and expected outcomes are verified.
- [x] Data creation and cleanup are safe.
- [x] Unknowns that affect assertions or safety are resolved.
