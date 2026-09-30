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

## Deploy notes (for later phases)

- cf-wrangler runs with cwd=`~/workspace/height-calculator` — always pass an ABSOLUTE dist path to `pages deploy`.
- Cloudflare Pages project does not exist yet; deploy comes in Phase 7.
