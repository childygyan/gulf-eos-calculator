# PHASE3-REPORT.md — Calculator engine (Phase 3)

Date: **2026-09-30**
Project: Gulf EOS Calculator / مستحقات (Mustahaqqat)
Repo: `childygyan/gulf-eos-calculator` — branch `main`
Drive folder: **Gulf EOS Calculator** (`1kZ51NAKI-l2QdSQ2jXXHrIEwWJU3JSMG`)

## Scope

Phase 3 only: the calculator engine and its interactive tool pages, in both
locales. Phase 1 (foundation) and Phase 2 (labor-law data model) are reused
unchanged — no legal figure was altered, `docs/SOURCES.md` is intact, and all
seven Phase 2 modeling assumptions stay explicitly labeled in code, docs, and UI.

## Engine modules (`src/engine/`)

- **`eos.ts`** — `calculateEos()` — the end-of-service engine. Tiered accrual
  with pro-rata months, resignation eligibility/fractions from the Phase 2
  scenarios, wage caps (AE 24 months, KW 18 months) with `capApplied` flagging,
  per-tier breakdown lines, assumption key tracking, and structured results.
- **Oman transition split** — when a start date is given and predates
  `2023-07-31` (effective-date reading per `docs/SOURCES.md`), pre-cutoff
  service is calculated on the old-law tiers (`OM_OLD_TIERS`, 15 days modeled
  as 15/30) and post-cutoff service at 1 month/year; both portions and their
  amounts are exposed separately. No start date → new-regime formula + an
  explicit `om-no-start-date` assumption.
- **Bahrain payer attribution** — with a start date, service is attributed
  pre/post `2024-03-01` (employer vs SIO) while the statutory formula is
  unchanged (only the payer changed — per `docs/SOURCES.md`). Without a start
  date → `bh-no-start-date` assumption.
- **`vat.ts`** — inclusive/exclusive VAT using Phase 2 VAT data (SA 15%,
  BH 10%, AE 5%, OM 5%). QA/KW return `implemented: false` (not 0%) — VAT is
  not implemented there.
- **`salaryNet.ts`** — gross → EOS wage basis (per-country earnings-component
  mapping from `src/data/salary.ts`) → net after user-entered deductions.
  No deduction rates are assumed; deductions are free-form inputs.
- **`leave.ts`** — statutory annual entitlement with seniority step-ups
  (SA 21→30 days after 5 years; QA 21→28 days after 5 years), pro-rated
  accrual, accrued−used balance, over-use flagging.
- **`notice.ts`** — UTC date arithmetic, `addDaysISO` with strict validation,
  notice day 1 = the day after notice is given.
- **`index.ts`** — public re-export surface.

## Pages / routes

Arabic default, English mirror, same tool path across locales (country slugs
stay identical: `saudi-arabia`, `uae`, `kuwait`, `qatar`, `bahrain`, `oman`).

| Path (ar) | Path (en) |
|---|---|
| `/calculators/` | `/en/calculators/` |
| `/calculator/<country>/` × 6 | `/en/calculator/<country>/` × 6 |
| `/tools/salary-net/` | `/en/tools/salary-net/` |
| `/tools/vat/` | `/en/tools/vat/` |
| `/tools/leave-balance/` | `/en/tools/leave-balance/` |
| `/tools/notice-period/` | `/en/tools/notice-period/` |

- EOS pages: `EosPage.astro` (scenario radio, wage basis, service years/months,
  optional start/end dates, tier breakdown, resignation note, cap note,
  assumption list, 3 FAQs → `FAQPage` JSON-LD) + `SoftwareApplication` JSON-LD.
- Tool pages: `CalculatorsHub.astro`, `SalaryNetPage.astro`, `VatPage.astro`,
  `LeavePage.astro`, `NoticePage.astro` — all with SoftwareApplication JSON-LD.
- Shared `Disclaimer.astro` ("estimated result, not binding") on every tool.
- `docs/GLOSSARY.md` — Arabic ↔ English ↔ definition terminology reference.

## Verification (real output)

- `npm run typecheck` → **0 errors, 0 warnings** (66 files).
- `npm run build` → **24 pages**, sitemap + robots emitted.
- `npm test` → **72/72 pass** across 4 files:
  - 30 new engine tests (all six official worked examples through the full
    pipeline, zero service, caps, resignation bands, partial years, Oman/Bahrain
    splits, VAT inclusive/exclusive incl. QA/KW not-implemented, leave
    over-use + step-ups, notice crossing month ends, invalid inputs).
  - 13 SEO tests incl. new Phase 3 blocks (ar/en calculator pages, hreflang
    ar/en/x-default, canonical, SoftwareApplication + FAQ JSON-LD, same-path
    language switcher, 24-page sitemap).
  - 37 pre-existing Phase 1+2 tests still green.
- Official worked examples re-verified via the engine: SA 33,000 / 22,000;
  AE 117,000 / 24,000 cap; KW ≈1,294.83 resignation; QA 14,000; BH 1,500;
  OM 2,500 (new regime).

## Notes

- Tailwind's `has-checked:` variant did not emit CSS in this setup; checked
  radio-card styling is done with a plain `.radio-card:has(input:checked)`
  rule in `src/styles/global.css`.
- The push on 2026-09-30 includes the Phase 2 staged tree together with Phase 3
  (local HEAD was still at the Phase 1 commit before this push).

## Delivery

- GitHub: pushed to `childygyan/gulf-eos-calculator` branch `main`;
  commit `e79e3ae7b76453d3ca10babf58a0e90ecd95aecc`, remote head verified
  via the API after push.
- Drive: `gulf-eos-calculator-phase3-20260930.zip` in the project folder
  (excludes `node_modules/`, `dist/`, `.astro/`).
  - File ID: `1MWQkpdclUIyeisj2jY_NkSMOhx3F6TSr`
  - Link: https://drive.google.com/file/d/1MWQkpdclUIyeisj2jY_NkSMOhx3F6TSr/view?usp=drivesdk
