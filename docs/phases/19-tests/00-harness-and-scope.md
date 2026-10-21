# Phase 19.0 — harness and scope

**Goal:** measure the whole client (not only `libs`/`stores`/`components`), lock the level in with a ratchet, and add
a harness that checks the app against a real next-boilerplate server.

## Tasks

- [x] `collectCoverageFrom` adds `modules/**` and `utils/**`; `modules/**/dictionaries/**` excluded (data).
- [x] Baseline measured and recorded in [README.md](README.md) and [99-progress.md](99-progress.md).
- [x] `coverageThreshold` in `jest.config.js`: `global` floor at the measured remainder, finished paths at 75/75/75.
- [x] `npm run test:coverage` (coverage + ratchet) and `npm run test:contract`.
- [x] `coverage/` in `.gitignore`.
- [x] Contract harness: `jest.contract.config.js` reuses the unit config without msw; `__tests__/contract/env.ts`
      points `libs/env` at `CONTRACT_API_URL`; `setup.ts` switches the shared axios instance to Node's http adapter
      (react-native's jest setup mocks XMLHttpRequest) with a 30 s timeout (a next dev server compiles a route on its
      first hit).
- [x] `localization.contract.ts` — for `ios`, `android` and `web`: every language in the list parses with the app's
      schema (strictly: the service would skip a bad item silently), each bundle parses, echoes `code`/`platform`,
      carries the version the list announced, and only holds keys of its module. At most 20 bundles per language and
      platform, to stay under the server's `i18n` rate limit.
- [x] `auth.contract.ts` — device session end to end: login → Bearer call → refresh (both tokens rotate) → Bearer
      call → revoke → the old token is refused. Skipped without `CONTRACT_EMAIL` / `CONTRACT_PASSWORD`; fails if
      the account needs 2FA.

## Files touched / created

- Changed: `jest.config.js`, `package.json` (scripts), `.gitignore`
- New: `jest.contract.config.js`, `__tests__/contract/{env,setup}.ts`, `__tests__/contract/{localization,auth}.contract.ts`

## Acceptance criteria

- `npm run test:coverage` passes, and fails when a listed path drops below its threshold.
- `npm test` does not pick up `*.contract.ts` (different `testRegex`).
- Against a running next-boilerplate the localization contract passes on all three platforms.

## Risks

- **The contract harness needs a running server and seeded data**, so it is not in CI yet; it is run by hand before a
  release and whenever the server's routes change. Moving it to CI needs a server + database job.
- **The auth contract needs a real account.** Use a dedicated test user without 2FA; never a personal account.

---

## ✅ CODED — 2026-10-21

Run against the local next-boilerplate (`feat/translations-db`, with the `user_session` audience fix applied):
localization contract 6/6 on `ios`/`android`/`web`; auth contract skipped (no test account given). Unit suite
502/502, `npm run test:coverage` passes.

**Deliberate deviations:** none.
