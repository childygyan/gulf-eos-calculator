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

## Deploy notes (for later phases)

- cf-wrangler runs with cwd=`~/workspace/height-calculator` — always pass an ABSOLUTE dist path to `pages deploy`.
- Cloudflare Pages project does not exist yet; deploy comes in Phase 7.
