<!--
Append-only. Do not rewrite earlier rows; strike text with ~~…~~ and add a dated note.
-->

# Progress — every area to 75 / 75 / 75

Target per path: lines ≥ 75 %, functions ≥ 75 %, branches ≥ 75 %. Measured scope: [README.md](README.md#measured-scope).

## Status

| Area / path | Phase | Baseline L / F / B (2026-10-21) | Now L / F / B | Threshold set | Done |
|---|---|---|---|---|---|
| `libs/i18n.ts` | 1 | 100 / 100 / 83.3 | 100 / 100 / 83.3 | ✅ | ✅ |
| `libs/translations.ts` | 1 | 91.9 / 91.7 / 85.2 | 100 / 100 / 86.9 | ✅ | ✅ |
| `stores/translationStore.ts` | 1 | 92.3 / 90 / 75 | 100 / 100 / 100 | ✅ | ✅ |
| `modules/localization/` | 1 | 100 / 100 / 75 | 100 / 100 / 75 | ✅ | ✅ |
| `libs/` (rest) | 2 | 83.8 / 75.1 / 76.5 (whole folder) | — | global floor | ⬜ |
| `modules/auth` | 3 | 100 / 100 / 69.6 | — | global floor | ⬜ |
| `modules/user` | 3 | 100 / 100 / 66.7 | — | global floor | ⬜ |
| `modules/storage` | 3 | 83.3 / 100 / 33.3 | — | global floor | ⬜ |
| `modules/tenant` | 3 | 100 / 100 / 90 | — | global floor | ⬜ |
| `modules/compliance` | 3 | 100 / 100 / 100 | — | global floor | ⬜ |
| `utils/` | 3 | 60.7 / 70.6 / 57.3 | — | global floor | ⬜ |
| `components/` | 4 | 0 / 0 / 0 | — | global floor | ⬜ |

**Global floor** (everything not listed in `coverageThreshold`): 58 lines / 57 statements / 54 functions / 45 branches,
set 2026-10-21 at the measured remainder.

## Harness runs

| Date | Harness | Server | Result |
|---|---|---|---|
| 2026-10-21 | contract — localization | local next-boilerplate `feat/translations-db` | 6 / 6 (ios, android, web) |
| 2026-10-21 | contract — device session | — | skipped: no test account |

## Findings

| Date | Area | Finding | Status |
|---|---|---|---|
| 2026-10-21 | server contract | next-boilerplate `53e7f105e`: every device token refused right after login (`401 INVALID_TOKEN`; the session reader re-verified with the `web` audience). Found by hand during the Phase 14A end-to-end run; now pinned by `auth.contract.ts`. | Fixed in next-boilerplate (`feat/translations-db`) |
| 2026-10-21 | server contract | Mobile downloaded 133 modules for `bg` (shared rows of every web module) though it uses 15. | Server change requested (mobile scope limited to the mobile snapshot's modules) |
