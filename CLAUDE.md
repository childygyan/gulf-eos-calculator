# AGENTS.md — gulf-eos-calculator

## Project rules

- Arabic default locale at `/` (RTL); English mirror at `/en/` (LTR).
- Dictionaries: `Dict = typeof ar` in `src/i18n/dict.ts` — Arabic is the type source of truth.
- Always pass **unprefixed** paths to SEO helpers; `localizedPath()` handles the `/en` prefix.
- RTL-first styling: logical properties only (`ms-/me-/ps-/pe-/text-start`); never physical `ml-/mr-/pl-/pr-` for directional spacing.
- Honesty rule: no invented legal figures, stats, or rates anywhere.

## Phase log

- **Phase 1** (2026-09-30): foundation — Astro 5 + TS strict + Tailwind v3 scaffold, original
  RTL-first design system (brand navy + gold), ar/en i18n with typed dicts, hreflang
  ar/en + x-default, language switcher, sitemap + robots.txt, per-page meta/OG,
  Organization/WebSite JSON-LD, vitest suite. See `docs/PHASE1-REPORT.md`.
- **Phase 4** (2026-09-30): programmatic content — 18 new pages (6 country guides,
  FAQ hub, 2 comparisons; ar + /en/ mirrors, 42 pages total), all legal figures
  rendered from `src/data/` via `src/lib/guide.ts` (digit-ban test on qualitative
  strings), internal linking (hero cards, guide related-links, footer columns,
  header FAQ), Article + FAQPage JSON-LD, sitemap auto. Tests 86/86. See
  `docs/PHASE4-REPORT.md`. (Phases 2–3: data model + calculator engine; see their reports.)
- **Phase 5** (2026-09-30): monetization + lead-gen (honest only) — lawyer lead-intake
  form (`/lawyers/` + `/en/`), correction form (`/corrections/` + `/en/`), contact page
  (`/contact/` + `/en/`), all via mailto: to the placeholder inbox + copyable summary
  (no backend); client validation + country×case-type routing in `src/lib/forms.ts`;
  `AdSlot` renders nothing while `SITE.adsenseClientId` is empty; single config in
  `src/config/site.ts` (`siteUrl`, `contactEmail`, `adsenseClientId` — all placeholders
  Firoz must fill); footer links to the 3 new pages. Tests 118/118. See
  `docs/PHASE5-REPORT.md`.
- **Phase 6** (2026-09-30): hardening — removed dead `endDate`/`todayISO` in
  `src/engine/eos.ts` (endDate stays validated: start ≤ end); replaced the
  deprecated `document.execCommand('copy')` fallback with a shared
  `src/scripts/clipboard.ts` (Clipboard API only + honest manual-copy hint,
  `lawyers`/`corrections.manualCopyHint` dict keys); `<noscript>` fallbacks
  on all 24 interactive pages (calculators: `common.jsRequired` notice;
  lawyers/corrections: visible mailto fallback via `common.noJsMailtoLead` +
  SITE.contactEmail); explicit ids on the VAT mode radios; 37 new tests in
  `tests/phase6.test.ts` (dict parity for all Phase 4/5 sections both ways,
  sitemap↔dist bidirectional, unique titles/descriptions, canonical==
  hreflang self-ref, a11y invariants, no-JS, placeholder discipline,
  perf budget). All 155/155 green; typecheck 0/0/0; build clean (48 pages).
  See `docs/PHASE6-REPORT.md`.

## Deploy notes (for later phases)

- cf-wrangler runs with cwd=`~/workspace/height-calculator` — always pass an ABSOLUTE dist path to `pages deploy`.
- **2026-09-30 (Phase 7 incident):** absolute path is NOT enough — wrangler also picks up `functions/` (and `_redirects`/`_headers`) from its cwd. The first Phase 7 deploy bundled height-calculator's `functions/_middleware.js` into this project and 301'd every URL to height-calculator.net. Fix was redeploying with cwd=`~/workspace/gulf-eos-calculator` (same surrogate auth + `CLOUDFLARE_ACCOUNT_ID=1abe704f3449834965689b3b47db3926` since the token can't list accounts). Rule: Pages deploys must run with cwd = the deploying repo.
- Cloudflare Pages project `gulf-eos-calculator` created in Phase 7 (direct-upload, production branch `main`); live at https://gulf-eos-calculator.pages.dev. See `docs/PHASE7-REPORT.md`.
- **2026-09-30 (domain go-live):** production domain `endofservicegulf.org` (+ `www`, both active on the Pages project). Deploys now run via `scripts/cf-pages-deploy.py` (durable wrapper: surrogate auth + `CLOUDFLARE_ACCOUNT_ID`, cwd=repo root) since `/tmp` gets wiped and `cf-wrangler` forces the wrong cwd.
