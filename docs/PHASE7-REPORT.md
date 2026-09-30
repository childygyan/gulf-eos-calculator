# PHASE7-REPORT.md — Cloudflare Pages deploy + live verification (Phase 7, FINAL)

Date: **2026-09-30**
Project: Gulf EOS Calculator / مستحقات (Mustahaqqat)
Repo: `childygyan/gulf-eos-calculator` — branch `main` (verified remote default branch)
Drive folder: **Gulf EOS Calculator** (`1kZ51NAKI-l2QdSQ2jXXHrIEwWJU3JSMG`)

## Deploy method

- Fresh `npm run build` → clean, **48 pages**, `dist/` verified (index.html, sitemap-index.xml, sitemap-0.xml, robots.txt, favicon.svg, `_astro/`).
- Deployed with the **official wrangler** (`wrangler@4` via `npx`), authenticated through the stored `custom.cloudflare` credential (surrogate mechanism from `~/workspace/skills/cloudflare/SKILL.md`). The repo's custom deploy script was NOT used (known-broken for static assets).
- **Incident during this phase (fixed):** the first deploy used `~/workspace/skills/cloudflare/bin/cf-wrangler`, which runs with cwd=`~/workspace/height-calculator`. Besides the known absolute-path risk (handled — absolute dist path was passed), wrangler ALSO picked up `functions/_middleware.js` from that cwd and bundled it into the gulf-eos deployment. That middleware 301s every `*.pages.dev` host to `https://height-calculator.net`, so the whole new project redirected to the Height Calculator site. Lesson added to `AGENTS.md` deploy notes: run Pages deploys with cwd set to the deploying repo, or a foreign `functions/` dir will contaminate the deployment.
- **Fix:** redeployed via a wrapper using the identical credential flow but cwd=`~/workspace/gulf-eos-calculator` (+ `CLOUDFLARE_ACCOUNT_ID` set, since the token can't list accounts). Second deploy log shows a pure static upload (67/67 files, no worker compiled, no functions bundle).

## Pages project

- Project: **`gulf-eos-calculator`** (direct-upload, production branch `main`; created during this phase — it did not exist before)
- Production deployment id: **`3af2adb7-f0b0-40f7-b26f-d9fa5a83d3a9`** (supersedes the contaminated first deployment `97d85db9-db86-4a3b-ad77-f6330fdb70fc`)
- Live URL: **https://gulf-eos-calculator.pages.dev** (placeholder `siteUrl` `https://gulf-eos.example.com` still in config — canonicals/hreflang/sitemap reference it until Firoz sets the real domain)

## Live smoke test (2026-09-30, on the production URL)

All checks via curl against `https://gulf-eos-calculator.pages.dev` (cache-busting query params used where edge cache held stale 301s from the brief contaminated window):

| URL | Status | Notes |
|---|---|---|
| `/` | 200 | Arabic homepage; `<html lang="ar" dir="rtl">` ✓ |
| `/en/` | 200 | `<html lang="en" dir="ltr">` ✓ |
| `/calculator/saudi-arabia/` | 200 | Arabic calculator page |
| `/en/calculator/saudi-arabia/` | 200 | English title "End-of-Service Calculator — Saudi Arabia \| Mustahaqqat" |
| `/calculators/` | 200 | calculators hub |
| `/guides/uae/` | 200 | canonical + hreflang ar/en/x-default present ✓ |
| `/faq/` | 200 | |
| `/compare/gulf-eos/` | 200 | |
| `/compare/saudi-vs-uae/` | 200 | |
| `/lawyers/` | 200 | |
| `/contact/` | 200 | |
| `/corrections/` | 200 | |
| `/favicon.svg` (static asset) | 200 | `content-type: image/svg+xml` — real file, not an error page |
| `/sitemap-index.xml` | 200 | valid XML sitemap index |
| `/sitemap-0.xml` | 200 | 48 URLs listed |
| `/robots.txt` | 200 | `User-agent: *` / `Allow: /` |
| `/sitemap.xml` | n/a | does not exist in dist (Astro emits `sitemap-index.xml`); correctly not expected |
| `/no-such-page-xyz/` | **unverifiable from sandbox** | see note below |

**Note on the 404 check:** from inside this sandbox, nonexistent paths return HTTP 200 with the homepage body. Evidence this is a sandbox-egress artifact, not the live site: (1) the clean deployment is provably static — deploy log shows no worker/functions compiled, 67 files = `dist/` exactly; (2) sibling static projects on the same account (`graphing-calc`, `real-online-ruler`) return proper 404s through the same sandbox proxy, so Cloudflare's default static-Pages behavior is 404; (3) the sandbox proxy demonstrably mishandles this brand-new hostname (empty replies on the preview subdomains, internal 198.18.x.x addresses). **Recommended: re-verify the 404 from a real browser** (parent agent has browser delegation).

No 500s on any static asset; no redirect contamination remains (spot-checked `/`, `/robots.txt`, `/guides/uae/` — no `Location: height-calculator.net`).

## GitHub

- Pushed to `childygyan/gulf-eos-calculator` branch **`main`** via `~/workspace/skills/github/bin/gh_datapush.py` (remote default branch verified `main` via API).
- Commit: `d29785611c97a10490ff2a81bb02c4f3ce480f6d` — "Phase 7: deploy to Cloudflare Pages + live verification (final phase)"

## Drive archive

- `gulf-eos-calculator-phase7-20260930.zip` (excludes `node_modules/`, `dist/`, `.astro/`, `.git/`) in **Gulf EOS Calculator**
- File ID: `1nddbcaAITaB3zY6DZ2yTH1G1289JLYtI`
- Link: https://drive.google.com/file/d/1nddbcaAITaB3zY6DZ2yTH1G1289JLYtI/view?usp=drivesdk

## Manual items for Firoz (unchanged, still his to do)

1. **Real domain**: buy a domain and point DNS at the Pages project (`gulf-eos-calculator.pages.dev`), then set `SITE.siteUrl` in `src/config/site.ts` to it and redeploy (canonicals, hreflang, sitemap, OG all derive from `siteUrl`).
2. **Real inbox**: set `SITE.contactEmail` in `src/config/site.ts` (lawyers/corrections/contact forms mailto to it; currently a placeholder).
3. **AdSense**: apply for AdSense, then put the publisher ID in `SITE.adsenseClientId` in `src/config/site.ts` (ad slots render nothing until then — by design).
4. **GSC/GA4 tags**: add verification + analytics tags when ready.
5. **Lawyer lead-gen partnerships**: outreach to Gulf labor lawyers for the `/lawyers/` intake funnel.
6. **Optional**: native-Arabic copy QA pass by a native speaker.

## Project status: ALL 7 PHASES COMPLETE

Phases 1–6: 155/155 tests green, typecheck clean, 48 pages. Phase 7: deployed and live at https://gulf-eos-calculator.pages.dev with all content pages verified 200. The only open verification is the 404-on-missing-path check, which needs a real browser (sandbox proxy artifact — see note above).
