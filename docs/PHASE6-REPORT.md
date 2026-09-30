# PHASE6-REPORT.md — Hardening + quality pass (Phase 6)

Date: **2026-09-30**
Project: Gulf EOS Calculator / مستحقات (Mustahaqqat)
Repo: `childygyan/gulf-eos-calculator` — branch `main`
Drive folder: **Gulf EOS Calculator** (`1kZ51NAKI-l2QdSQ2jXXHrIEwWJU3JSMG`)

## Scope

Phase 6 only: harden the whole site. No new features, no legal-figure
changes, no data-model changes. Phases 1–5 reused as-is; every fix below
is a correction, cleanup, or guardrail.

## Issues found and fixed

### 1. Dead `endDate` in the engine (`src/engine/eos.ts`) — FIXED
`calculateEos()` declared `const endDate = input.endDate ?? todayISO()` and
never read it (the pre-existing ts(6133) hint). Analysis: service length
deliberately comes from the explicit years/months inputs; dates only drive
the OM/BH regime attribution. `endDate` is genuinely dead, not a
half-implemented feature. Fix: removed the dead local and the now-unused
`todayISO()` helper; updated the `EosInput.endDate` doc comment to state it
is validated (must not precede `startDate`) but does not change the award.
`endDate` validation is still covered by `tests/engine.test.ts`
(start ≤ end, ISO format). Safe: no behavior change, all 30 engine tests
still green.

### 2. Deprecated `document.execCommand('copy')` fallback — FIXED
`src/scripts/lawyers-form.ts` and `src/scripts/corrections-form.ts` used the
deprecated clipboard fallback (2 pre-existing ts(6387) hints). Fix: new
shared `src/scripts/clipboard.ts` with `copyText()` (async Clipboard API
only → `true`/`false`) and `selectForManualCopy()`. On denial the button no
longer lies about success: it selects the summary text (so Ctrl/Cmd+C works
immediately) and shows a new honest hint (`lawyers`/`corrections.
manualCopyHint`, added to both dicts). Typecheck is now **0 errors,
0 warnings, 0 hints**.

### 3. No-JS degradation gaps — FIXED
- The lawyers/corrections confirmation screens (and their mailto links) are
  JS-built; the static `href="#"` mailto anchor did nothing without JS.
  Added `<noscript>` blocks with a **visible** mailto link to
  `SITE.contactEmail` (`common.noJsMailtoLead` dict key, both locales).
- The EOS calculator builds scenario radios + wage-component inputs
  client-side; the four tool pages need JS to calculate. Added `<noscript>`
  notices on all 20 calculator/tool pages (`common.jsRequired`, both
  locales) so a no-JS user gets an honest explanation instead of a dead form.
- The forms remain readable and submittable without JS (plain GET reload).

### 4. VAT radio inputs without explicit ids — FIXED
`/tools/vat/` radios relied solely on implicit `<label>` wrapping (valid
WCAG, but fragile). Added `id="vat-exclusive"` / `id="vat-inclusive"`.

### 5. New dict keys — ADDED (ar source of truth + natural en mirrors)
`common.jsRequired`, `common.noJsMailtoLead`, `lawyers.manualCopyHint`,
`corrections.manualCopyHint`. Dict parity enforced by `Dict = typeof ar` +
tests.

## Issues found and verified clean (no fix needed)

- **RTL QA:** all Arabic pages `lang="ar" dir="rtl"`, all English pages
  `lang="en" dir="ltr"` (swept all 48 built pages in tests). No physical
  `ml-/mr-/pl-/pr-`, `text-left/right`, or `left/right` positioning anywhere
  in components or CSS — logical properties only.
- **WCAG:** exactly one `<h1>` per page in logical heading order (48/48);
  zero `<img>` tags in the build (nothing to alt-text); every form control
  has an associated `<label>`; skip link + `<main id="main">` on every page;
  focus rings on all interactive elements (`focus:ring-2`, visible skip
  link). Contrast computed for all 13 key text/background pairs — **all pass
  WCAG AA** (lowest: 5.21 gold-700 on white; body text 18.83).
- **Client JS:** no `console.*` in `src/scripts/`; every DOM lookup null-
  guarded (`?.` / early return); client bundles small (largest chunk 25KB;
  all `_astro` JS ≈ 70KB total, no oversized inline scripts).
- **SEO:** sitemap lists exactly the 48 built pages and every sitemap URL
  resolves (bidirectional test); robots.txt `Allow: /` + sitemap; no `noindex`
  anywhere; canonical == hreflang self-reference with the full
  ar/en/x-default set on all 48 pages; OG tags complete on all pages;
  all 48 titles and all 48 descriptions unique.
- **Placeholders:** `gulf-eos.example.com` / the inbox appear in `src/` only
  inside `src/config/site.ts`; no `tel:` links and no phone-like digit runs
  anywhere in `src/` or `dist/`. (The three Phase 5 placeholders
  `siteUrl`/`contactEmail`/`adsenseClientId` remain Firoz's to fill — by
  design, unchanged.)
- **Internal links:** 0 broken across all 48 pages (pre-existing test, still
  green).

## Verification (real output)

- `npm run typecheck` → **0 errors, 0 warnings, 0 hints** (98 files; the 3
  pre-existing hints are eliminated).
- `npm run build` → **clean, 48 pages**, sitemap + robots emitted.
- `npm test` → **155/155 pass** across 7 files:
  - 37 new in `tests/phase6.test.ts`: explicit Phase 4/5 section dict parity
    both directions (guides/faq/compare/lawyers/corrections/contact) + the
    4 new Phase 6 keys; sitemap↔dist bidirectional (48 = 48); unique
    titles/descriptions; canonical==hreflang self-ref on all pages; one h1 +
    heading order, lang/dir, skip link + main landmark, label association,
    img alt — all swept over all 48 pages; `<noscript>` on all 24
    interactive pages + visible mailto fallback on lawyers/corrections +
    JS-required notice on calculators; no `console.*` / no `execCommand` in
    src; placeholder-domain discipline; no `tel:`; client-JS size budget.
  - 118 pre-existing Phase 1–5 tests still green.

## Delivery

- GitHub: pushed to `childygyan/gulf-eos-calculator` branch `main`;
  implementation commit `a3925fdf02ac92892db76b707f25a5c7c08fb1b4`
  (verified: remote default branch `main`, head matches after push).
- Drive: `gulf-eos-calculator-phase6-20260930.zip` in the project folder
  (excludes `node_modules/`, `dist/`, `.astro/`, `.git/`).
  - File ID: `1HKxjqriG88I2zOGWaICdMZaltneLtFpj`
  - Link: https://drive.google.com/file/d/1HKxjqriG88I2zOGWaICdMZaltneLtFpj/view?usp=drivesdk

## Open notes / NOT fixed

- Nothing found was left unfixed. The three pre-existing items still owned
  by Firoz carry over unchanged: real domain for `SITE.siteUrl`, real inbox
  for `SITE.contactEmail`, real AdSense publisher ID for
  `SITE.adsenseClientId` (all in `src/config/site.ts`).
- Copy-to-clipboard on very old browsers without the async Clipboard API
  now falls back to manual selection + an honest message (no silent
  `execCommand` path anymore) — acceptable and deliberate.
- No real-browser QA was performed (no browser tooling in this environment);
  all checks are static/build-time plus unit tests.

**STOP — Phase 6 complete. Phase 7 starts only on the parent agent's next instruction.**
