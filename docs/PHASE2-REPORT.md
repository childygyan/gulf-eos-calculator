# Phase 2 Report — Labor-Law Data Model

**Date:** 2026-09-30
**Scope:** Phase 2 — typed labor-law data model for all 6 GCC countries. Data only; no calculator UI, no new pages.

## What was built

### Core types — `src/data/types.ts`
- `GccCountryCode` (`SA | AE | KW | QA | BH | OM`), `LegalSource` (law EN/AR, article, URL, bilingual notes)
- `WageBasis` kinds: `basic` | `basic-plus-social-allowance` | `total-wage`
- `EosTier` (rate months/year + cumulative `upToYears`), `ResignationBand`, `EosScenario` (termination + resignation), `EosTransition` (for Bahrain 2024 SIO reform + Oman 2023 law split)
- `CountryEosRules`: wage basis, scenarios, caps, pro-rata, transition, payout, sources

### Pure data-layer helpers — `src/data/calc.ts` (UI-free)
- `accrueEos(tiers, years, wage)` — progressive tier accrual
- `resignationFraction(bands, years)` — resignation band lookup
- `applyCap(months, wage, capMonths)` — statutory cap enforcement
- `scenarioAward(scenario, years, wage)` — full eligibility→accrual→reduction→cap pipeline

### Country modules — `src/data/countries/`
| Country | Basis | Tiers | Resignation rule | Cap |
|---|---|---|---|---|
| SA (`sa.ts`) | Last wage (total, Art 86) | ½ mo/yr → 5y, 1 mo/yr after | <2y nil · 2–5 ⅓ · 5–10 ⅔ · ≥10 full | none |
| AE (`ae.ts`) | Basic salary | 21d/yr → 5y, 30d/yr after | none (1980-law reductions repealed) | 24 months |
| KW (`kw.ts`) | Last wage incl. contractual allowances (Art 55) | 15d/yr → 5y, 1 mo/yr after | <3y nil · 3–5 ½ · 5–10 ⅔ · ≥10 full (indefinite contracts) | 18 months |
| QA (`qa.ts`) | Last basic wage | ≥3 weeks/yr | none | none |
| BH (`bh.ts`) | Basic + social allowance | ½ mo/yr → 3y, 1 mo/yr after | none (no statutory reduction) | none |
| OM (`om.ts`) | Last basic wage | 1 mo/yr (RD 53/2023, Art 61) | none | none |

### Supporting data
- `src/data/vat.ts` — SA 15%, BH 10%, AE 5%, OM 5%, QA 0% (not implemented), KW 0% (not implemented)
- `src/data/employment.ts` — notice periods (SA 30/60; AE 30–90; KW 90/30; QA 30/60 or 15/60; BH 30; OM 30/15) + annual leave (SA 21→30; AE 30; KW 30; QA 21→28; BH 30; OM 30)
- `src/data/salary.ts` — per-country salary components with `includedInEosBasis` flags derived from each wage-basis rule
- `src/data/index.ts` — registry: `EOS_RULES`, `VAT`, `EMPLOYMENT`, `SALARY_STRUCTURES`, `getEosRules`

### Transition regimes modeled
- **Bahrain:** `transition` — pre-2024-03-01 service = employer-paid Art 116 indemnity; post = 4.2%/8.4% monthly SIO subscriptions claimed from SIO.
- **Oman:** `transition` — pre-2023-07-31 service = old RD 35/2003 formula (15d/yr→3y, 1 mo/yr after); post = 1 mo/yr; portions summed on last basic wage. `OM_OLD_TIERS` exported for the split-period calculation.

### Tests — `tests/data.test.ts` (24 new; 37 total with Phase 1)
- Integrity: all 6 countries in all 4 datasets; termination+resignation scenarios; tiers sorted/open-ended-last with positive finite rates; caps sane; resignation bands contiguous from 0 with fractions in (0,1]; every country has ≥1 source with `https://` URL; wage-basis/payout notes non-empty EN+AR; VAT consistency (not-implemented → 0%/no date); basic-wage component present everywhere.
- Formula sanity vs official worked examples: SA 33,000 (Art 84), SA resignation 22,000; UAE 117,000 + 24-month cap binds at 40 yrs; Kuwait resignation ≈1,294.83 (Art 51/53); Qatar 14,000; Bahrain 1,500; Oman 2,500 (new) / 1,250 (old formula).

## Verification
- `npm test` → **37/37 pass** (3 files)
- `npm run typecheck` → 0 errors, 0 warnings
- `npm run build` → clean (2 pages)

## Sources & honesty
- `docs/SOURCES.md` records every law, article, exact URL, verification date (2026-09-30), and 7 explicit assumptions (Kuwait ÷26, Qatar 21/30, Oman 15/30, Saudi "last wage" reading, UAE 30-day modeled minimum, QA/KW VAT=0, transition date splits).
- Ambiguities recorded: UAE misconduct/gratuity (Art 44 vs 39), Oman effective-date vs contract-date split, Bahrain blog claims of 50% resignation cut (NOT in law — excluded).
- Scope exclusions noted: domestic workers, free zones, pension/social-protection-covered workers (incl. Gulf nationals).

## Delivery
- GitHub: `childygyan/gulf-eos-calculator`, branch `main`
- Commit: `8f6913bc29d2e85790c0f0bf926c7de0d68e63ce` (verified: remote default branch `main`, head matches)
- Drive archive: `gulf-eos-calculator-phase2-20260930.zip` (126K, 60 files) → https://drive.google.com/file/d/1nqC2WwxJsWIuJKfqCtwx8KKJb4LJ5krN/view?usp=drivesdk

## Open questions / follow-ups for Phase 3
1. Oman split-date ambiguity (effective date vs contract-conclusion date) — modeled on effective-date; flag to Firoz's legal reviewers.
2. UAE misconduct forfeiture question — not modeled; needs legal clarification.
3. Saudi notice rule needs an official amendment text link (currently WTW secondary for the 30/60 figures; tiers unaffected).
4. Kuwait/Oman/Saudi official law-text hosts: prefer government mirrors if Firoz's legal partner supplies them.
5. Qatar divisor (21/30) is an assumption — flag in the calculator UI notes.

**STOP — Phase 2 complete. Phase 3 starts only on the parent agent's next instruction.**
