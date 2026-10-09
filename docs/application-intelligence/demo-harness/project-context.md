# Project Context — DemoHarness

Status: `DRAFT`

## Ownership and sources

| Field                  | Value                                                                    |
| ---------------------- | ------------------------------------------------------------------------ |
| Project                | `DemoHarness`                                                            |
| Accountable owner      | Dipankar Shakya (dipankarshakya@lftechnology.com)                        |
| Application repository | `<vyaguta app repo URL — confirm before first sync>`                     |
| Requirement source     | Derived from running application — no formal requirement doc available   |
| API/schema source      | `<unknown — network trace or backend repo needed; confirm with owner>`   |
| Last verified          | 2026-10-05                                                               |

## Application summary

Vyaguta is an internal HR/workforce platform operated by Leapfrog Technology. The entry point
for this project is the self-service attendance view at:

```
https://vyaguta.lftechnology.com/attendance/self/all
```

The `/attendance/self/all` path indicates a page that displays the authenticated user's own
attendance records across all time or all record types. No further behavioral detail has been
verified from source — the application could not be accessed without credentials during intake.

## Environments and safety

| Environment | Base URL                                   | Data class      | Allowed operations      | Approval          |
| ----------- | ------------------------------------------ | --------------- | ----------------------- | ----------------- |
| Development | `<unknown — confirm dev base URL>`         | Synthetic        | `<unknown>`             | Dipankar Shakya   |
| QA          | `<unknown — confirm QA base URL>`          | Synthetic        | `<unknown>`             | Dipankar Shakya   |
| Staging     | `<unknown — confirm staging base URL>`     | Synthetic        | `<unknown>`             | Dipankar Shakya   |
| Production  | `https://vyaguta.lftechnology.com`         | Real user data   | Read-only smoke only    | Dipankar Shakya   |

Mutation tests (POST/PUT/PATCH/DELETE) must not run against production or any shared
environment unless explicitly approved. Smoke scenarios targeting production must remain
read-only per the `smoke-read-only` harness rule.

## Contracts to verify

- **Authentication and roles:** The application URL requires authentication before any inner
  page is accessible. The login mechanism, identity provider (SSO, OAuth, local credentials),
  session format, and available test roles are all unknown. This is a blocking unknown — see
  the Unknowns table below. No module context or requirements can be verified until resolved.
- **Stable selector attribute:** Unknown. The presence or absence of `data-testid`, `data-cy`,
  or similar test attributes has not been verified. Requires browser inspection after auth is
  established.
- **Supported browsers:** Unknown. Confirm browser matrix with the owner before declaring
  coverage targets.
- **API dependencies:** Unknown. The attendance view likely calls one or more internal APIs
  to load records. Endpoints, request shape, and error codes are unverified.
- **Test-data creation and cleanup:** Unknown. Whether synthetic attendance records can be
  seeded in non-production environments and cleaned up safely is unverified.
- **External integrations:** Unknown. Vyaguta may integrate with payroll, leave, or HRIS
  systems. Side effects of test data on downstream systems are unverified.
- **Accessibility or regulatory obligations:** Unknown. No WCAG level, internal policy, or
  regulatory requirement has been stated.
- **CI lanes and branch policy:** Unknown. No CI configuration for this project has been
  provided. Confirm the target pipeline before wiring the harness.

## Modules

| Module              | Business owner    | Risk   | Context status                         |
| ------------------- | ----------------- | ------ | -------------------------------------- |
| attendance-self-all | Dipankar Shakya   | Medium | BLOCKED — auth gap unresolved; see below |

## Unknowns and decisions

| Item                              | Why it matters                                                                                                 | Owner           | Status      |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------- | --------------- | ----------- |
| Authentication mechanism          | Without knowing the identity provider, session format, and test credential source, no page can be reached or asserted. The `storage-state` auth strategy is declared in the profile, but the login flow, credential shape, and env-var names are unverified. No module context or E2E requirement can be implemented until this is resolved. | Dipankar Shakya | OPEN — BLOCKING |
| Test user roles                   | The attendance view may differ for regular employees vs. managers or admins. Available roles and permission boundaries must be confirmed to scope requirements correctly. | Dipankar Shakya | OPEN        |
| Non-production environment URLs   | Dev, QA, and staging base URLs have not been provided. Without them, environment-specific playwright projects cannot be configured. | Dipankar Shakya | OPEN        |
| Synthetic test-data strategy      | Whether attendance records can be seeded and cleaned up in non-production environments is unknown. E2E requirements that assert specific record data depend on this. | Dipankar Shakya | OPEN        |
| API contract for attendance view  | The endpoints, request parameters, and response schema behind `/attendance/self/all` are unknown. Helper and config design depends on the API shape. | Dipankar Shakya | OPEN        |
| Stable selector attribute         | The presence of `data-testid` or equivalent test hooks is unverified. Selector strategy cannot be finalised until the application is accessible. | Dipankar Shakya | OPEN        |
| Application repository URL        | The source repository for the Vyaguta frontend has not been provided. Confirming it enables network-trace-free selector and route discovery. | Dipankar Shakya | OPEN        |
| CI pipeline and branch policy     | Target CI system, branch triggers, and environment promotion rules are unknown.                                 | Dipankar Shakya | OPEN        |

## AI tooling

The team will use **Claude Code** only. Copilot is disabled in the project profile. Note that
only Claude Code can refuse a violating write at prompt time; `npm run verify` and the pre-push
hook serve as the real gate for all other collaborators.

## Approval

- [ ] Sources are authoritative.
- [ ] Environment and mutation boundaries are approved.
- [ ] Authentication mechanism and test-data handling are approved.
- [ ] At least one module is ready for requirement derivation.
