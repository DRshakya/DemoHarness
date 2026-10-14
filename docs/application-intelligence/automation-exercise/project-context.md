# Project Context

Status: `APPROVED`

## Ownership and sources

| Field                  | Value                                                              |
| ---------------------- | ------------------------------------------------------------------ |
| Project                | `automation-exercise`                                              |
| Accountable owner      | Dipankar Shakya (dipankarshakya@lftechnology.com)                  |
| Application repository | Not applicable — third-party public demo site                      |
| Requirement source     | Owner-specified behaviors; no formal tracker or spec doc provided  |
| API/schema source      | Unknown — no published API contract or schema available            |
| Last verified          | 2026-10-08                                                         |

## Environments and safety

| Environment | Base URL                              | Data class   | Allowed operations     | Approval         |
| ----------- | ------------------------------------- | ------------ | ---------------------- | ---------------- |
| Production  | `https://www.automationexercise.com/` | Synthetic    | Read-only smoke; login with synthetic test account | Dipankar Shakya |

Notes:
- automationexercise.com is a public demo/test site intended for automation practice.
- No dedicated staging or development environment is available to this project.
- All testing runs against the live public URL. Mutation operations (registration, order placement, account deletion) must be limited to e2e tiers only, never in smoke, and must use synthetic disposable accounts.
- The test account email configured in the TEST_EMAIL environment variable is designated for automation. The password is stored as `TEST_PASSWORD` in a gitignored `.env` file and in CI secrets. Neither value must ever appear as a literal string in any source file.

## Contracts to verify

- Authentication and roles: Email + password login. Single role (authenticated user). No multi-role or admin workflow confirmed. Session mechanism confirmed as cookie-based (DISCOVER 2026-10-08).
- Stable selector attribute: `data-qa` confirmed on all login form elements (DISCOVER 2026-10-08).
- Supported browsers: Unknown — no browser matrix published. Chromium assumed for initial coverage; cross-browser support is unverified.
- API dependencies: Login uses a standard HTML form POST (confirmed DISCOVER 2026-10-08). No XHR/fetch observed for the login flow. Exact payload shape not asserted at the API layer.
- Test-data creation and cleanup: The test account set via the TEST_EMAIL environment variable is pre-existing. No programmatic account creation is in scope for the initial module. AE-LOGIN-004 (e2e tier) creates no state, so no cleanup is required for current active requirements.
- External integrations: Google reCAPTCHA v2 present on login page but not server-enforced (confirmed DISCOVER 2026-10-08). No social login observed.
- Accessibility or regulatory obligations: None stated by owner. The site is a third-party demo; no WCAG compliance commitment is known.
- CI lanes and branch policy: Inherited from the harness repository (GitHub Actions). Branch policy follows the harness default.

## Modules

| Module     | Business owner   | Risk   | Context status                    |
| ---------- | ---------------- | ------ | --------------------------------- |
| `login`    | Dipankar Shakya  | High   | APPROVED                          |
| `product`  | Dipankar Shakya  | Medium | APPROVED                          |
| `cart`     | Dipankar Shakya  | High   | APPROVED                          |
| `checkout` | Dipankar Shakya  | High   | DRAFT — awaiting owner approval   |

## Unknowns and decisions

| Item | Why it matters | Owner | Status |
| ---- | -------------- | ----- | ------ |
| Session mechanism (cookie vs. token) | Determines storage-state strategy for auth caching | Dipankar Shakya | Resolved — cookie-based (DISCOVER 2026-10-08) |
| Stable selector attribute (`data-qa` or similar) | Required before BUILD can place any locator constant in config | Dipankar Shakya | Resolved — `data-qa` confirmed (DISCOVER 2026-10-08) |
| CAPTCHA or bot-detection on login form | Would block automated credential submission entirely | Dipankar Shakya | Resolved — reCAPTCHA v2 present but not server-enforced (DISCOVER 2026-10-08) |
| Network API contract for login (endpoint, method, payload shape) | Required for API-layer assertions and auth storage-state setup script | Dipankar Shakya | Unresolved — form POST; exact payload shape not verified |
| Redirect target after successful login | Needed to define the expected outcome of AE-LOGIN-002 | Dipankar Shakya | Resolved — Logout link visibility used as authenticated indicator instead of URL |
| Error message copy for invalid credentials | Needed to define the acceptance criterion for AE-LOGIN-003 | Dipankar Shakya | Resolved — `Your email or password is incorrect!` (DISCOVER 2026-10-08) |
| AI coding tools the team will use | Determines adapter enforcement model (Claude Code blocks violating writes; Copilot is advisory only) | Dipankar Shakya | Resolved — Claude Code only |

## AI coding tools

Claude Code only (confirmed by owner 2026-10-08). The `harness.config.json` currently enables both `claude` and `copilot` adapters; the copilot adapter can be disabled by updating the project profile and running `npm run harness:compose && npm run harness:sync`.

Note on enforcement difference: Claude Code refuses a violating write at the point of generation. Both adapters are enforced in CI regardless.

## Approval

- [x] Sources are authoritative.
- [x] Environment and mutation boundaries are approved.
- [x] Authentication and test-data handling are approved.
- [x] At least one module is ready for requirement derivation.
