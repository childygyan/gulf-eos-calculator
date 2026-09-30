# SOURCES.md — legal sources for the Phase 2 data model

**Verified 2026-09-30.** Every legal figure in `src/data/` traces to one of the
sources below. Where a figure could not be taken from an official text, the
code marks it `ASSUMPTION` and it is listed at the bottom of this document.
Nothing in `src/data/` comes from forums or blogs presented as fact — blog
URLs below are cited only as *secondary explainers*, never as authority.

---

## 1. Saudi Arabia — Labor Law (Royal Decree No. M/51 of 23/8/1426H)

| Figure | Provision | Official source |
|---|---|---|
| EOS award: ½ month's wage/yr (first 5 yrs) + 1 month's wage/yr after; on last wage; pro-rata fractions | Art 84 | Official English translation, Saudi Bureau of Experts (laws.boe.gov.sa): `https://laws.boe.gov.sa/Files/Download/?attId=704cf56e-eb7a-4ddb-8c28-adbb01244dc6` (mirror: WIPO Lex `https://www.wipo.int/wipolex/en/legislation/details/14685`) |
| Resignation: <2 yrs → nil; 2–5 → ⅓; 5–10 → ⅔; ≥10 → full | Art 85 | same |
| Contract may exclude commissions/variable pay from the wage basis | Art 86 | same |
| Full award on force majeure; full award for a woman ending her contract within 6 months of marriage / 3 months of childbirth | Art 87 | same |
| Settlement within 1 week (2 weeks if the worker ended the contract) | Art 88 | same |
| Annual leave: 21 days/yr; 30 days after 5 consecutive years | Art 109 | same |
| Indefinite-contract notice: 30 days (employee) / 60 days (employer); fixed-term resignation on 30 days' notice | Art 75, **as amended** | 2024 amendments summary (WTW): `https://www.wtwco.com/en-in/insights/2024/08/saudi-arabia-labor-reforms-for-both-foreign-and-local-workers` |

**Notes**
- The 2024 amendments (Council of Ministers, effective 18–19 Feb 2025) did
  NOT touch Articles 84–87 — the EOS tiers are unchanged (per the WTW and
  Mondaq amendment summaries, which list the changed articles; EOS is not
  among them). The pre-amendment notice figures (60/30 monthly-paid) are
  superseded by the amended Article 75 modeled here.
- Wage basis "the last wage": MHRSD/HRSD practice treats this as basic
  salary + regular allowances. This is an administrative reading, not the
  statute's text — modeled as `total-wage` with the caveat in code.

## 2. UAE — Federal Decree-Law No. 33 of 2021

| Figure | Provision | Official source |
|---|---|---|
| Gratuity: 21 days' basic wage/yr (first 5 yrs) + 30 days/yr after; ≥1 yr continuous service; pro-rata fractions; on last basic salary; cap 2 years' remuneration; deductions only by law/court order | Art 51(2)–(7) | UAE Official Gazette portal (elaws.gov.ae): `https://elaws.gov.ae`. Figures verified against the consolidated official text. |
| Nationals → pensions/social security | Art 51(1) | same |
| Annual leave: 30 days/yr after 1 yr; 2 days/month for 6–12 months | Art 29 | same |
| Notice 30–90 days as agreed in the contract | Art 43 | same |
| Entitlements paid within 14 days of termination | Art 53 | same |
| 1980 law (incl. limited/unlimited-contract resignation reductions) repealed 2 Feb 2022; NO resignation reduction under current law | — | same |

**Ambiguity (NOT modeled either way):** some secondary sources claim an
Article 44 summary dismissal forfeits gratuity; a legal-firm analysis
(`https://sklegalfirm.com/gratuity-calculator-uae/`) argues Article 39(1)
preserves it as the maximum disciplinary sanction. Until clarified, the
calculator will not model misconduct cases.

## 3. Kuwait — Law No. 6 of 2010 (Private Sector)

Official Gazette Issue No. 963 (21 Feb 2010). Figures read from the law's
English text (official translation hosted by the Hungarian MFA):
`https://kuvait.mfa.gov.hu/storage/9bd1c388-b8b2-403e-af8c-223140c48e93/attachments/710342befe7a314fd2c809bf2a9ec32a.pdf`

| Figure | Provision |
|---|---|
| Monthly-paid: 15 days' remuneration/yr (first 5 yrs) + 1 month/yr after; cap 1.5 yrs' remuneration; pro-rata fractions; debts deducted; social-insurance offset | Art 51(B) |
| Full benefit: employer termination; unrenewed fixed-term expiry; Arts 48–50 cases; marriage termination within a year | Art 52 |
| Resignation (worker's own termination of an indefinite contract): 3–5 yrs → ½; 5–10 → ⅔; ≥10 → full | Art 53 |
| "Wage" = basic + all contractual/regulatory elements (bonuses, allowances, grants, monetary privileges) | Art 55 |
| Dues computed on the last wage disbursed | Art 62 |
| Notice: 3 months (monthly-paid), 1 month (others); wage for the notice period if skipped | Art 44 |
| Annual leave: 30 days, fully paid; none before 9 months in year one; pro-rata; cash offset for unused leave on termination | Arts 70, 73 |

## 4. Qatar — Labour Law No. 14 of 2004

Official legal portal (Al Meezan): `https://www.almeezan.qa`

| Figure | Provision |
|---|---|
| ≥1 yr service → gratuity agreed by the parties, NOT LESS than 3 weeks' remuneration per year; pro-rata fractions; on the LAST BASIC WAGE; employer may deduct debts | Art 54 |
| No statutory cap; no statutory tier increase after 5/10 yrs; no resignation reduction | Art 54 |
| Indefinite-contract notice: monthly/annual-paid — 1 month (≤5 yrs), 2 months (>5 yrs); others — 1 wk (<1 yr), 2 wks (1–5 yrs), 1 mo (>5 yrs) | Art 49 |
| Annual leave: 3 weeks after 1 yr continuous service; 4 weeks after 5 yrs; pay in lieu on termination | Arts 79–81 |

**Note:** the tiered 3/4/5/6-week schedule in some summaries belongs to the
REPEALED Labour Law No. 3 of 1962 (Art 24) and does not apply under Law
14/2004.

## 5. Bahrain — Labour Law No. 36 of 2012 + Edict 109/2023

| Figure | Provision | Official source |
|---|---|---|
| Leaving indemnity: ½ month's wage/yr (first 3 yrs) + 1 month's wage/yr after; pro-rata fractions; no statutory cap; no resignation reduction | Art 116 | `https://www.sio.gov.bh/en/end-of-service-gratuity-for-non-bahrainis` (official SIO page quoting the formula) |
| Basis: basic salary + social allowance (if any), on the last wages | Art 47 | same SIO page |
| From 1 Mar 2024: employer pays MONTHLY SIO subscriptions — 4.2% of monthly wages (first 3 yrs of service), 8.4% after; worker claims gratuity from SIO (lump sum); pre-1-Mar-2024 service still owed by the employer | Edict 109/2023 | same SIO page |
| 30 days' notice | Art 99 | same (law text) |

**Correction of a common error:** several blogs claim resignation cuts the
indemnity by 50%. Article 116 contains no such reduction — it is NOT modeled.

## 6. Oman — Royal Decree No. 53/2023 (Labour Law)

Official law text (qanoon.om): `https://qanoon.om/p/2023/rd2023053/`

| Figure | Provision | Source |
|---|---|---|
| Workers not under the Social Protection Law: gratuity "not less than the basic wage" per year; pro-rata fractions; on the LAST BASIC WAGE; pre-law service counts; applies until the savings system starts | Art 61 | qanoon.om (official text) |
| OLD formula for pre-law service: 15 days' basic/yr (first 3 yrs) + 1 month/yr after | RD 35/2003, Art 39 | MoL clarification reported by Muscat Daily: `https://www.muscatdaily.com/2024/10/23/mol-clarifies-gratuity-calculation-for-expats-in-oman/` and Oman Observer: `https://www.omanobserver.om/article/1194067/oman/labour/labour-ministry-clarifies-end-of-service-gratuity` |
| Indefinite-contract notice: 30 days (monthly-paid), 15 days (others) | Art 38 | qanoon.om |
| Annual leave: ≥30 days/yr with full wage, not before 6 months from joining; full wage for the leave balance on termination | Arts 78, 81 | qanoon.om (Arabic text: المادة 78 «إجازة سنوية بأجر شامل لا تقل عن 30 يومًا… قبل انقضاء 6 أشهر») |

**Ambiguity (modeled with a note):** Muscat Daily's report of the MoL
clarification splits service by the law's EFFECTIVE DATE (31 Jul 2023) with
a worked example; a later Oman Observer circular report frames the split by
CONTRACT-CONCLUSION date. The data model uses the effective-date split.

## 7. VAT (supporting data)

| Country | Rate | Introduced | Authority | Source |
|---|---|---|---|---|
| Saudi Arabia | 15% | Jan 2018 (5%; raised Jul 2020) | ZATCA | `https://vatcalculator.ai/gcc-vat-comparison/` (updated Aug 2026); Khaleej Times GCC VAT overhaul: `https://www.khaleejtimes.com/business/gcc-vat-overhaul-set-to-tighten-cross-border-trade-raise-compliance-stakes` |
| Bahrain | 10% | Jan 2019 (5%; raised Jan 2022) | NBR | same |
| UAE | 5% | Jan 2018 | FTA | same |
| Oman | 5% | Apr 2021 | OTA | same |
| Qatar | — (not implemented) | — | GTA | GTA states VAT is not implemented; vatcalc.com notes an anticipated 5% with no date: `https://www.vatcalc.com/qatar/qatar-bides-its-time-on-vat-implementation/` |
| Kuwait | — (not implemented) | — | — | same |

---

## ASSUMPTIONS (explicitly labeled in code + here)

1. **Kuwait daily-wage divisor (÷26)** for the 15-day tier: the law's
   working-days divisor rule (weekly rest days excluded) implies ÷26; matches
   the published worked example (arabtimesonline.com). Labeled in
   `src/data/countries/kw.ts` (`KW_DAILY_DIVISOR`).
2. **Qatar "three weeks" = 21/30 of monthly basic wage**: the law does not
   specify the divisor; ÷30 is the standard practice. Labeled in
   `src/data/countries/qa.ts` (`QA_WEEKS_TO_MONTHS`).
3. **Oman old-law 15-day tier = 15/30**: standard reading; labeled in
   `src/data/countries/om.ts`.
4. **Saudi "last wage" = basic + regular allowances**: the MHRSD/HRSD
   administrative reading, not the statute's text; labeled in
   `src/data/countries/sa.ts`.
5. **UAE modeled notice = 30 days** (the statutory minimum; contracts may set
   30–90): labeled in `src/data/employment.ts`.
6. **Qatar/Kuwait VAT = 0% (not implemented)**: official status; the
   "anticipated 5%" for Qatar is NOT modeled.
7. **Bahrain/Oman transition splits** follow the MoL/SIO dates (31 Jul 2023 /
   1 Mar 2024) as stated; the Oman contract-date-vs-effective-date ambiguity
   is modeled on the effective-date reading with the ambiguity noted.
