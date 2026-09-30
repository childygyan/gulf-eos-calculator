# مستحقات — Mustahaqqat

Arabic-first Gulf end-of-service (EOS) benefits calculator + directory site.

- **Stack:** Astro 5 · TypeScript strict · Tailwind v3 · vitest
- **Locales:** Arabic default at `/` (RTL) · English at `/en/` (LTR)
- **Brand:** مستحقات (Mustahaqqat) — original name and design, nothing copied.
- **siteUrl:** `https://gulf-eos.example.com` (placeholder — real domain comes from Firoz later)

## Project structure

```text
src/
  i18n/            locales.ts, dict.ts (Dict = typeof ar), dicts/{ar,en}.ts
  lib/seo.ts       canonical / hreflang / head-tag / JSON-LD builders
  layouts/         BaseLayout.astro (html lang+dir, SEO head, header/footer)
  components/      Header, Footer, LanguageSwitcher, Hero
  pages/           index.astro (ar) · en/index.astro (en)
  styles/global.css
tests/             dict.test.ts · seo.test.ts
public/            robots.txt, favicon.svg, logo.svg, og-cover.svg
docs/              PHASE<n>-REPORT.md
```

## Commands

| Command          | Action                                  |
| :--------------- | :-------------------------------------- |
| `npm install`    | Installs dependencies                   |
| `npm run dev`    | Local dev server at `localhost:4321`    |
| `npm run build`  | Production build to `./dist/`           |
| `npm test`       | vitest (run **after** `npm run build` — seo tests read `dist/`) |
| `npm run typecheck` | `astro check`                        |

## Conventions

- Arabic is the source of truth for dictionaries (`Dict = typeof ar`).
- `path` is always the **unprefixed** path (`/`, `/about`); `localizedPath()` adds `/en` for English.
- RTL-first CSS: use Tailwind logical utilities (`ms-`, `me-`, `ps-`, `pe-`, `text-start`).
- **Honesty rule:** never invent legal figures, statistics, or rates. Phase content carries no legal numbers yet.
