<!--
ORDER OF AUTHORITY (the higher item wins on conflict):
  1. AGENTS.md (§6 Hard rules · §5 file naming)
  2. docs/phases/README.md
  3. docs/phases/19-tests/README.md (THIS FILE)
  4. Each NN-*.md phase file in this folder
ONLY EXCEPTION: a recorded owner decision ("Locked decisions") beats any proposal in this set.
WHERE WE ARE: 99-progress.md (per-area status table).
Sister set: next-boilerplate docs/phases/33-tests (same rules, adapted to Jest and a client app).
-->

# Phase 19 — tests: every area to ≥ 75 % lines / functions / branches

> Written 2026-10-21. Team request: "follow the tests in phases, ≥ 75 % coverage, plus harness tests" — the client
> counterpart of next-boilerplate's `33-tests`.

**Goal:** each area of the measured scope reaches at least 75 % on **each** of lines, functions and branches — not on
average — and stays there (ratchet). Harness tests cover what unit tests cannot: the API's failure modes, and the real
server contract.

## Measured scope

`jest.config.js` → `collectCoverageFrom`: `libs/**`, `stores/**`, `hooks/**`, `modules/**` (services + DTOs),
`utils/**`, `components/**`. Excluded: `modules/**/dictionaries/**` (data, not code) and `app/**` (screens — a later
phase, see decision L5).

## Baseline (2026-10-21, before phase 1)

Full `jest --coverage`, 21 suites, 494 tests: **62.3 % lines / 58.9 % functions / 49.4 % branches.**

| Area | Lines | Functions | Branches | Size (lines) |
|---|---|---|---|---|
| libs | 83.8 | 75.1 | 76.5 | 544 |
| stores | 91.8 | 91.5 | 90.0 | 61 |
| modules/auth | 100 | 100 | 69.6 | 95 |
| modules/tenant | 100 | 100 | 90.0 | 77 |
| modules/user | 100 | 100 | 66.7 | 35 |
| modules/localization | 100 | 100 | 75.0 | 17 |
| modules/compliance | 100 | 100 | 100 | 16 |
| modules/storage | 83.3 | 100 | 33.3 | 12 |
| modules/common.dto.ts | 0 | 0 | 100 | 4 |
| utils | 60.7 | 70.6 | 57.3 | 61 |
| components/* | 0 | 0 | 0 | 362 (6 folders, no test yet) |

Until 2026-10-21 `modules/**` and `utils/**` were not measured at all, and there was no threshold.

## Locked decisions

1. **L1 — Done means ≥ 75 % lines AND functions AND branches** for every path a phase owns, in the measured scope.
2. **L2 — Ratchet, never relax.** `jest.config.js` → `coverageThreshold`: a finished phase adds its paths at 75/75/75;
   `global` is the floor for the rest and only goes up. Checked by `npm run test:coverage`.
3. **L3 — Behaviour, not coverage.** Every test asserts an outcome (return value, thrown error, store state, request
   sent, rendered text). A call without an assertion does not count.
4. **L4 — No production change inside a test phase**, except the smallest testability fix, called out in the commit.
   Bugs a test finds go to `99-progress.md` and are fixed in a separate commit.
5. **L5 — Screens (`app/**`) are out of the first round** (owner, 2026-10-21): libs, stores, hooks, modules and
   components first; screens get their own phase later.
6. **L6 — Harness tests are listed here and never deleted or skipped silently.**

## Harness tests

| Harness | Where | Runs | Covers |
|---|---|---|---|
| API harness (msw) | `__tests__/_server.ts`, `_handlers.ts`, `_helpers.ts` (`mockRoute`, `fail`) | every `npm test` | Services and libs against a fake server: refresh on 401, session end, offline, malformed bodies |
| Contract harness | `jest.contract.config.js`, `__tests__/contract/*.contract.ts` | opt-in: `CONTRACT_API_URL=http://localhost:3000 npm run test:contract` | The app's own services and Zod schemas against a **real** next-boilerplate |

The contract harness exists because unit tests cannot see the server change under them: next-boilerplate
`53e7f105e` made every device token fail right after login (`401 INVALID_TOKEN`) while all 494 unit tests stayed
green. `auth.contract.ts` now pins exactly that call. Details: [00-harness-and-scope.md](00-harness-and-scope.md).

## Phases

| Phase | File | Scope | Status |
|---|---|---|---|
| 0 | [00-harness-and-scope.md](00-harness-and-scope.md) | Measured scope, ratchet, contract harness | ✅ 2026-10-21 |
| 1 | [01-i18n-translations.md](01-i18n-translations.md) | `libs/i18n`, `libs/translations`, `stores/translationStore`, `modules/localization` | ✅ 2026-10-21 |
| 2 | (to write) | Remaining `libs/` below 75: featureFlags, logger, logout, useUnreadPolling, avatar, deviceInfo, errorUtils, useCountdown, useAppLockWatcher, zustandStorage, biometrics, theme/brand | ⬜ |
| 3 | (to write) | `modules/` branches (auth, user, storage, common.dto) and `utils/` | ⬜ |
| 4 | (to write) | `components/` — render tests (account, auth, common, security, shell, tenant) | ⬜ |
| 5 | (to write) | Harness depth: API failure matrix per service (401 → refresh, 429, offline, malformed); contract harness for every route group the app calls | ⬜ |
| 6 | (to write) | Screens (`app/**`), after L5 is lifted | ⬜ |

Order: by damage if wrong — the session and transport libs are mostly covered already (libs 84/75/77), so the
largest gaps (components, module branches) come right after the small lib leftovers.

## Commands

```bash
npm run test:ci          # unit + API harness
npm run test:coverage    # same, with coverage and the ratchet
CONTRACT_API_URL=http://localhost:3000 npm run test:contract   # contract harness (needs a running next-boilerplate)
# add CONTRACT_EMAIL / CONTRACT_PASSWORD (a test account without 2FA) to run the device-session contract too
```
