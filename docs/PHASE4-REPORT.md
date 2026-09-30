# PHASE4-REPORT.md — Programmatic content + internal linking (Phase 4)

Date: **2026-09-30**
Project: Gulf EOS Calculator / مستحقات (Mustahaqqat)
Repo: `childygyan/gulf-eos-calculator` — branch `main`
Drive folder: **Gulf EOS Calculator** (`1kZ51NAKI-l2QdSQ2jXXHrIEwWJU3JSMG`)

## Scope

Phase 4 only: content pages + internal linking + content SEO. Phases 1–3
reused unchanged — no legal figure altered, `docs/SOURCES.md` intact, all
seven Phase 2 modeling assumptions still explicitly labeled in code, docs,
and UI.

## What was built

### New lib — `src/lib/guide.ts`
Data-driven prose helpers for all content pages. **Honesty contract:** every
numeric phrase is derived from the Phase 2 data model at build time —
`tierSentence`, `resignationBandLine`, `capText`, `minServiceText`,
`rateWords`, `transitionCutoff`, and `guideExample()` (a worked example
computed through the real engine: 10,000 wage units × 6 years termination,
plus the resignation total only where the law reduces it). `guideNumericModel`
exposes the numeric model for the drift test.

### New pages (18 → 42 total, ar default + /en/ mirrors, same-path switcher)
| Path (ar) | Path (en) | Content |
|---|---|---|
| `/guides/<slug>/` × 6 | `/en/guides/<slug>/` × 6 | Per-country guides: eligibility, calculation (tiers in words + engine-computed worked example), resignation vs termination, cap, notice/leave basics (from `employment.ts`), transition regimes (BH/OM, with the OM split-date ambiguity flagged), common mistakes, labeled assumptions, official sources with links, 4-question FAQ, related links |
| `/faq/` | `/en/faq/` | FAQ hub — 10 questions (4 general + 6 country spotlights); figures filled from data at build time |
| `/compare/gulf-eos/` | `/en/compare/gulf-eos/` | All-6 comparison table: formula, wage base, resignation, cap, minimum service — all from data |
| `/compare/saudi-vs-uae/` | `/en/compare/saudi-vs-uae/` | Deep SA-vs-AE comparison: formula, wage base, resignation, cap, payout deadline, notice/leave, qualitative verdict |

### Internal linking
- Homepage country cards now link to each country's **guide** and **calculator**.
- Every guide links to its calculator, the 4 cluster tools, all 5 sibling
  country guides, and both comparison pages.
- Compare hub links every country row to its guide + calculator; FAQ hub and
  SA-vs-AE page link back to the hub.
- Footer: new "Country guides" column (6 links) + "Site content" column
  (FAQ, both comparisons, calculators). Header nav gains an FAQ link.

### SEO
- Per-page title/meta/OG/canonical/hreflang ar + en + x-default on all 18
  new pages; Article JSON-LD on all content pages; FAQPage JSON-LD on
  `/faq/` (10 Q) and every guide (4 Q each). All 18 pages in the sitemap
  (automatic via `@astrojs/sitemap`).
- Dictionary parity kept: Arabic is the type source of truth; natural
  native-quality Arabic copy, natural English (not word-by-word).

### Honesty safeguards
- No legal figure hardcoded in prose — the drift test asserts the guide
  model equals `EOS_RULES` field-for-field, and a digit-ban test asserts
  the qualitative strings (`guides.notes`, `guides.mistakes`,
  `transitionAmbiguityNote`, `compare.verdict`) contain **no digits at all**
  in either locale: numbers can only come from `src/data/`.
- The OM effective-date vs contract-date split ambiguity is flagged in-copy
  on the Oman guide (per `docs/SOURCES.md`).

## Verification (real output)

- `npm run typecheck` → **0 errors, 0 warnings** (80 files; 1 pre-existing
  hint in `src/engine/eos.ts` from Phase 3).
- `npm run build` → **clean, 42 pages** (24 + 18), sitemap + robots emitted.
- `npm test` → **86/86 pass** across 5 files:
  - 14 new in `tests/content.test.ts`: page inventory (18 URLs × ar/en in
    dist + sitemap), canonical/hreflang/Article JSON-LD + lang/dir on every
    new page, **internal-link resolution** (every internal href in every
    built page resolves — 0 broken), FAQ JSON-LD validity (10 Q on /faq/,
    4 Q per guide), drift tests (numeric model == data model, tier/band/cap
    segments carry data figures, worked example engine-consistent,
    digit-ban on qualitative strings).
  - 72 pre-existing Phase 1–3 tests still green (incl. all six official
    worked examples through the engine).

## Delivery

- GitHub: pushed to `childygyan/gulf-eos-calculator` branch `main`;
  implementation commit `PHASE4_SHA` (verified: remote default branch
  `main`, head matches after push).
- Drive: `gulf-eos-calculator-phase4-20260930.zip` in the project folder
  (excludes `node_modules/`, `dist/`, `.astro/`).
  - File ID: `PHASE4_DRIVE_ID`
  - Link: `PHASE4_DRIVE_LINK`

## Open notes for later phases

- `siteUrl` still the placeholder `https://gulf-eos.example.com` (Firoz to
  supply the real domain) — canonicals/hreflang will follow automatically.
- Phase 5 (lead-gen/monetization) may reuse the guide FAQ/related-link
  patterns established here.
