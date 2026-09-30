# PHASE5-REPORT.md — Monetization + lead-gen, honest only (Phase 5)

Date: **2026-09-30**
Project: Gulf EOS Calculator / مستحقات (Mustahaqqat)
Repo: `childygyan/gulf-eos-calculator` — branch `main`
Drive folder: **Gulf EOS Calculator** (`1kZ51NAKI-l2QdSQ2jXXHrIEwWJU3JSMG`)

## Scope

Phase 5 only: monetization + lead-gen scaffolding with strict honesty rules.
Phases 1–4 reused unchanged — no legal figure altered, `docs/SOURCES.md`
intact, all seven Phase 2 modeling assumptions still labeled. This is a
**static site with no backend**, so every "submission" is a user-sent email.

## What was built

### Config centralization — `src/config/site.ts` (new)
One `SITE` object holding all site-wide placeholders. `SITE_URL` in
`src/lib/seo.ts` now re-exports `SITE.siteUrl` (canonicals/hreflang/sitemap/OG
all follow it automatically).

### Lawyer lead-intake form — `/lawyers/` + `/en/lawyers/` (new)
- `src/components/LawyersPage.astro` + `src/pages/lawyers.astro` + `src/pages/en/lawyers.astro`.
- Fields: country (6 GCC), case type (resignation / termination-EOS underpayment /
  notice-leave / other), name, email **or** phone, brief description.
- Client-side validation + confirmation screen. On submit: routes the intake
  summary by country+case type (`src/lib/forms.ts` `routeIntake`, route codes
  like `SA/resignation`), builds a pre-filled `mailto:` to the placeholder
  inbox, and shows a copyable summary. Copy is explicit: *"This form only
  sends an email inquiry — the lawyer partner program is still being set up,
  and we cannot guarantee anyone will reply."* No lawyer names, firms, or
  testimonials anywhere — none invented.

### AdSense slot placeholders — `AdSlot` (new)
- `src/lib/ads.ts` + `src/components/AdSlot.astro`. Renders the **empty string**
  (zero height, no layout shift, no third-party requests) while
  `SITE.adsenseClientId` is empty — which it is. Slots placed at
  header + footer positions (in `BaseLayout`) and in-article on the three new
  pages. They become live `<ins class="adsbygoogle">` units only after Firoz
  configures a real publisher ID.

### Correction form — `/corrections/` + `/en/corrections/` (new)
- Fields: page URL (full link or `/path`), what's wrong, correct figure /
  missing rule, official source link (must be a full `http(s)` URL — a bare
  path is rejected). Same mailto/copy pattern. Copy is explicit: corrections
  are reviewed against official sources; no promise of an immediate fix.

### Contact page — `/contact/` + `/en/contact/` (new)
- Shows the placeholder inbox `intake@gulf-eos.example.com` labeled as a
  temporary address, plus cross-links to the correction and lawyer forms.
  No invented phone numbers, office addresses, or contact details.

### Navigation
- Footer "Site content" column gains links to `/lawyers/`, `/corrections/`,
  `/contact/` (both locales). Header unchanged.

### i18n
- Arabic source-of-truth dictionaries extended (`lawyers`, `corrections`,
  `contact` sections + footer link labels); natural native-quality English
  mirrors. Dict parity enforced by `Dict = typeof ar` + the completeness test.

## Verification (real output)

- `npm run typecheck` → **0 errors, 0 warnings** (96 files; 3 pre-existing
  hints in `src/engine/eos.ts` from Phase 3, untouched).
- `npm run build` → **clean, 48 pages** (42 + 6 new), sitemap + robots emitted.
- `npm test` → **118/118 pass** across 6 files:
  - 32 new in `tests/phase5.test.ts`: config placeholders still placeholder;
    email/phone validators; intake validation (required, unknown country/case,
    malformed email/phone, short name/description); routing map covers all
    6 countries × 4 case types with codes carrying both; mailto encoding;
    correction validation (required, page-path accepted, source must be a full
    URL, too-short explanations rejected); `adSlotHtml` returns `''` for all
    positions and **no built page contains `adsbygoogle`/`data-ad-client`**;
    **no phone-like numbers or `tel:` links in any built HTML**; every email
    in built HTML is the `@gulf-eos.example.com` placeholder; the 6 new pages
    exist with correct lang/dir/canonical/hreflang + sitemap entries; footer
    links resolve in both locales.
  - 86 pre-existing Phase 1–4 tests still green (incl. the internal-link
    resolution test over all 48 pages — 0 broken).

## Placeholder inventory — Firoz must supply

| Placeholder | Current value | Used by | Needed for |
|---|---|---|---|
| `SITE.siteUrl` | `https://gulf-eos.example.com` | canonicals, hreflang, sitemap, OG, JSON-LD | Real domain before Phase 7 deploy |
| `SITE.contactEmail` | `intake@gulf-eos.example.com` | lawyer intake, corrections, contact page mailto links | Real inbox before any partner replies are possible |
| `SITE.adsenseClientId` | `''` (empty) | `AdSlot` header/in-article/footer | Real AdSense publisher ID (`ca-pub-…`) before any ads render |

Everything lives in `src/config/site.ts` — one edit activates the real values.
Until then: forms produce user-sent emails to a placeholder address, and ad
slots are invisible.

## Delivery

- GitHub: pushed to `childygyan/gulf-eos-calculator` branch `main`;
  implementation commit `<SHA>` (verified: remote default branch `main`,
  head matches after push).
- Drive: `gulf-eos-calculator-phase5-20260930.zip` (excludes `node_modules/`,
  `dist/`, `.astro/`, `.git/`) in the project folder.
  - File ID: `<DRIVE_ID>`
  - Link: https://drive.google.com/file/d/<DRIVE_ID>/view?usp=drivesdk

## Open notes for later phases

- No backend exists: when the lawyer partner program launches, Phase 5 forms
  can be rewired to a real endpoint without changing copy or validation.
- `siteUrl` still placeholder — Phase 7 deploy needs the real domain from Firoz.
