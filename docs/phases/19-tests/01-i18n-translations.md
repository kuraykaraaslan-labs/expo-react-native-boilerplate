# Phase 19.1 — i18n and remote translations

**Goal:** the client half of Phase 14A (remote translations) at ≥ 75 / 75 / 75, ratcheted.

Paths: `libs/i18n.ts`, `libs/translations.ts`, `stores/translationStore.ts`, `modules/localization/`.

## Tasks

- [x] Sync shares one request between overlapping calls.
- [x] A language the server withdrew is forgotten with its texts — unless it is on screen (never yank the UI).
- [x] A pending profile language stays pending while its download keeps failing, and is dropped when the server
      withdraws it.
- [x] `useLocales` re-renders with the server's list.
- [x] Store: removing a module of a language never cached is a no-op; an older persisted cache (other key format) is
      dropped by `migrate`.
- [x] Paths added to `coverageThreshold` at 75/75/75.

## Files touched / created

- Changed: `__tests__/translations.test.ts` (+8 tests), `jest.config.js` (thresholds)

## Result

| Path | Before L / F / B | After L / F / B |
|---|---|---|
| `libs/i18n.ts` | 100 / 100 / 83.3 | 100 / 100 / 83.3 |
| `libs/translations.ts` | 91.9 / 91.7 / 85.2 | 100 / 100 / 86.9 |
| `stores/translationStore.ts` | 92.3 / 90 / 75 | 100 / 100 / 100 |
| `modules/localization/` | 100 / 100 / 75 | 100 / 100 / 75 |

Left uncovered on purpose: `i18n.ts`'s already-initialized guard (a second module instance), the `"unknown"` message
of a non-`Error` throw, and the service's `?? "invalid"` fallback for a Zod issue without a message.

## Acceptance criteria

- Every path above ≥ 75 % on each metric; `npm run test:coverage` passes.
- Contract harness `localization.contract.ts` passes against a running next-boilerplate (Phase 19.0).

## Risks

- `modules/localization/` branches sit exactly at 75 %: any new branch there needs its test in the same commit.

---

## ✅ CODED — 2026-10-21

**Deliberate deviations:** none.
