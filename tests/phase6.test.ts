/**
 * tests/phase6.test.ts — Phase 6 hardening checks.
 *
 * - Dictionary parity explicitly for every Phase 4/5 section
 *   (guides, faq, compare, lawyers, corrections, contact) in BOTH directions,
 *   plus the new Phase 6 common/manual-copy keys.
 * - Sitemap ↔ dist bidirectional: every built page is in the sitemap and
 *   every sitemap URL resolves to a built file (all 54 pages).
 * - Titles and meta descriptions unique across all pages.
 * - canonical == hreflang self-reference + full ar/en/x-default set, every page.
 * - Accessibility: exactly one h1 with logical heading order; skip link +
 *   <main> landmark; correct lang/dir; every input has a label; every img
 *   has alt text; no noindex; OG tags complete — every page.
 * - Graceful no-JS degradation: <noscript> on all interactive pages; the
 *   mailto fallback is visible in the lawyers/corrections noscript blocks.
 * - Shipped client code hygiene: no console.* and no deprecated
 *   document.execCommand in src/scripts/.
 * - Placeholder discipline: the example.com placeholder domain/email appears
 *   in src/ only inside src/config/site.ts; no tel: links in src or dist.
 * - Performance sanity: no oversized client JS chunks.
 *
 * Requires `astro build` to have run (fails loudly if dist is missing).
 */
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { SITE } from '../src/config/site.js';
import { SITE_URL } from '../src/lib/seo.js';
import { ar } from '../src/i18n/dicts/ar.js';
import { en } from '../src/i18n/dicts/en.js';

const root = process.cwd();
const dist = join(root, 'dist');
const src = join(root, 'src');

function readBuiltPage(rel: string): string {
  const file = join(dist, rel);
  if (!existsSync(file)) {
    throw new Error(`Built page missing: ${file}. Run "npm run build" before "npm test".`);
  }
  return readFileSync(file, 'utf8');
}

function allBuiltHtml(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) allBuiltHtml(full, acc);
    // 404.html is an error document, not a content page: it is intentionally
    // absent from the sitemap and its hreflang alternates (/en/404) do not
    // exist as files (Pages serves the single 404.html for every unknown path).
    else if (entry.endsWith('.html') && entry !== '404.html') acc.push(full);
  }
  return acc;
}

/** dist-relative POSIX path, e.g. "en/guides/oman/index.html". */
function relOf(abs: string): string {
  return abs.slice(dist.length + 1).split('\\').join('/');
}

function srcFiles(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) srcFiles(full, acc);
    else acc.push(full);
  }
  return acc;
}

/* Key-tree helpers (same shape as dict.test.ts). */
type KeyTree = Record<string, unknown> | unknown[];
function keyPaths(value: unknown, prefix = ''): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((item, i) => keyPaths(item, `${prefix}[${i}]`));
  }
  if (value !== null && typeof value === 'object') {
    return Object.entries(value as KeyTree).flatMap(([k, v]) =>
      keyPaths(v, prefix ? `${prefix}.${k}` : k),
    );
  }
  return [prefix];
}

/* ------------------------------------------------------------------ */
/* Dictionary parity — Phase 4/5 sections + Phase 6 keys, both ways     */
/* ------------------------------------------------------------------ */

describe('Phase 6 dictionary parity (Phase 4/5 sections, both directions)', () => {
  const sections = ['guides', 'faq', 'compare', 'lawyers', 'corrections', 'contact'] as const;
  const arRec = ar as unknown as Record<string, unknown>;
  const enRec = en as unknown as Record<string, unknown>;

  for (const section of sections) {
    it(`${section}: every ar key exists in en`, () => {
      const arKeys = keyPaths(arRec[section]).sort();
      const enKeys = keyPaths(enRec[section]).sort();
      expect(arKeys.filter((k) => !enKeys.includes(k))).toEqual([]);
    });
    it(`${section}: every en key exists in ar (no extras)`, () => {
      const arKeys = keyPaths(arRec[section]).sort();
      const enKeys = keyPaths(enRec[section]).sort();
      expect(enKeys.filter((k) => !arKeys.includes(k))).toEqual([]);
    });
  }

  it('common: Phase 6 no-JS keys exist in both locales', () => {
    for (const key of ['jsRequired', 'noJsMailtoLead'] as const) {
      expect(ar.common[key], `ar.common.${key}`).toBeTruthy();
      expect(en.common[key], `en.common.${key}`).toBeTruthy();
    }
  });

  it('lawyers/corrections: manualCopyHint exists in both locales', () => {
    for (const section of ['lawyers', 'corrections'] as const) {
      expect(ar[section].manualCopyHint, `ar.${section}.manualCopyHint`).toBeTruthy();
      expect(en[section].manualCopyHint, `en.${section}.manualCopyHint`).toBeTruthy();
    }
  });
});

/* ------------------------------------------------------------------ */
/* Sitemap ↔ dist bidirectional (all 54 pages)                           */
/* ------------------------------------------------------------------ */

describe('Phase 6 sitemap ↔ dist bidirectional', () => {
  function sitemapUrls(): string[] {
    const xml = readBuiltPage('sitemap-0.xml');
    return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  }

  it('lists exactly the 54 built pages', () => {
    const urls = sitemapUrls();
    const files = allBuiltHtml(dist);
    expect(files).toHaveLength(54);
    expect(urls).toHaveLength(54);
  });

  it('every sitemap URL resolves to a built file', () => {
    const missing: string[] = [];
    for (const url of sitemapUrls()) {
      expect(url.startsWith(SITE_URL)).toBe(true);
      const rel = url.slice(SITE_URL.length).replace(/^\//, '');
      const file = join(dist, rel, 'index.html');
      if (!existsSync(file)) missing.push(url);
    }
    expect(missing).toEqual([]);
  });

  it('every built page appears in the sitemap', () => {
    const urls = new Set(sitemapUrls());
    const missing: string[] = [];
    for (const file of allBuiltHtml(dist)) {
      const rel = relOf(file).replace(/index\.html$/, '');
      const url = `${SITE_URL}/${rel}`;
      if (!urls.has(url)) missing.push(url);
    }
    expect(missing).toEqual([]);
  });
});

/* ------------------------------------------------------------------ */
/* Titles / descriptions unique; canonical == hreflang self-ref         */
/* ------------------------------------------------------------------ */

describe('Phase 6 SEO invariants across all pages', () => {
  it('titles are unique across all 54 pages', () => {
    const seen = new Map<string, string[]>();
    for (const file of allBuiltHtml(dist)) {
      const html = readFileSync(file, 'utf8');
      const t = (html.match(/<title>([^<]*)<\/title>/) || [])[1] ?? '';
      expect(t, `${relOf(file)} has a title`).not.toBe('');
      seen.set(t, [...(seen.get(t) ?? []), relOf(file)]);
    }
    const dups = [...seen.entries()].filter(([, fs]) => fs.length > 1);
    expect(dups, `duplicate titles: ${JSON.stringify(dups)}`).toEqual([]);
  });

  it('meta descriptions are unique across all 54 pages', () => {
    const seen = new Map<string, string[]>();
    for (const file of allBuiltHtml(dist)) {
      const html = readFileSync(file, 'utf8');
      const d = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] ?? '';
      expect(d, `${relOf(file)} has a description`).not.toBe('');
      seen.set(d, [...(seen.get(d) ?? []), relOf(file)]);
    }
    const dups = [...seen.entries()].filter(([, fs]) => fs.length > 1);
    expect(dups, `duplicate descriptions: ${JSON.stringify(dups)}`).toEqual([]);
  });

  it('canonical equals an hreflang self-reference with the full ar/en/x-default set', () => {
    const bad: string[] = [];
    for (const file of allBuiltHtml(dist)) {
      const html = readFileSync(file, 'utf8');
      const can = (html.match(/<link rel="canonical" href="([^"]*)"/) || [])[1];
      const hls = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]*)"/g)];
      const langs = hls.map((m) => m[1]).sort().join(',');
      if (!can || langs !== 'ar,en,x-default' || !hls.some((m) => m[2] === can)) {
        bad.push(relOf(file));
      }
    }
    expect(bad).toEqual([]);
  });

  it('no page carries a noindex directive', () => {
    const bad: string[] = [];
    for (const file of allBuiltHtml(dist)) {
      const html = readFileSync(file, 'utf8');
      if (/noindex/i.test(html)) bad.push(relOf(file));
    }
    expect(bad).toEqual([]);
  });

  it('OG tags are complete on every page', () => {
    const bad: string[] = [];
    for (const file of allBuiltHtml(dist)) {
      const html = readFileSync(file, 'utf8');
      for (const prop of ['og:title', 'og:description', 'og:type', 'og:url', 'og:image']) {
        if (!html.includes(`property="${prop}"`)) {
          bad.push(`${relOf(file)}: missing ${prop}`);
        }
      }
    }
    expect(bad).toEqual([]);
  });
});

/* ------------------------------------------------------------------ */
/* Accessibility invariants across all pages                             */
/* ------------------------------------------------------------------ */

describe('Phase 6 accessibility invariants across all pages', () => {
  it('every page has exactly one h1 in logical heading order', () => {
    const bad: string[] = [];
    for (const file of allBuiltHtml(dist)) {
      const html = readFileSync(file, 'utf8');
      const h1s = html.match(/<h1[\s>]/g) ?? [];
      if (h1s.length !== 1) {
        bad.push(`${relOf(file)}: ${h1s.length} h1 tags`);
        continue;
      }
      const heads = [...html.matchAll(/<h([1-6])[\s>]/g)].map((m) => Number(m[1]));
      let lvl = 0;
      for (const h of heads) {
        if (h > lvl + 1) {
          bad.push(`${relOf(file)}: heading jump h${lvl} -> h${h}`);
          break;
        }
        lvl = h;
      }
    }
    expect(bad).toEqual([]);
  });

  it('html lang/dir is correct on every page (ar → rtl, en → ltr)', () => {
    const bad: string[] = [];
    for (const file of allBuiltHtml(dist)) {
      const rel = relOf(file);
      const html = readFileSync(file, 'utf8');
      const tag = (html.match(/<html[^>]*>/) || [])[0] ?? '';
      const expected = rel.startsWith('en/') ? 'lang="en" dir="ltr"' : 'lang="ar" dir="rtl"';
      if (!tag.includes(expected)) bad.push(`${rel}: ${tag}`);
    }
    expect(bad).toEqual([]);
  });

  it('skip link and <main id="main"> landmark exist on every page', () => {
    const bad: string[] = [];
    for (const file of allBuiltHtml(dist)) {
      const html = readFileSync(file, 'utf8');
      if (!html.includes('href="#main"')) bad.push(`${relOf(file)}: no skip link`);
      if (!/<main[^>]*id="main"/.test(html)) bad.push(`${relOf(file)}: no main landmark`);
    }
    expect(bad).toEqual([]);
  });

  it('every form control has an associated label', () => {
    const bad: string[] = [];
    for (const file of allBuiltHtml(dist)) {
      const html = readFileSync(file, 'utf8');
      const labelFors = new Set(
        [...html.matchAll(/<label[^>]*for="([^"]+)"/g)].map((m) => m[1]),
      );
      // Implicit association: inputs wrapped in <label>…</label>.
      const wrappedInputs = new Set<string>();
      for (const m of html.matchAll(/<label[^>]*>([\s\S]*?)<\/label>/g)) {
        const idm = m[1].match(/<(input|select|textarea)[^>]*id="([^"]+)"/);
        if (idm) wrappedInputs.add(idm[2]);
      }
      for (const m of html.matchAll(/<(input|select|textarea)[^>]*>/g)) {
        const tag = m[0];
        if (/type="hidden"/.test(tag)) continue;
        const idm = tag.match(/id="([^"]+)"/);
        if (!idm) {
          bad.push(`${relOf(file)}: control without id`);
        } else if (!labelFors.has(idm[1]) && !wrappedInputs.has(idm[1])) {
          bad.push(`${relOf(file)}: #${idm[1]} has no label`);
        }
      }
    }
    expect(bad).toEqual([]);
  });

  it('every image has alt text', () => {
    const bad: string[] = [];
    for (const file of allBuiltHtml(dist)) {
      const html = readFileSync(file, 'utf8');
      for (const m of html.matchAll(/<img[^>]*>/g)) {
        if (!/alt=/.test(m[0])) bad.push(`${relOf(file)}: img without alt`);
      }
    }
    expect(bad).toEqual([]);
  });
});

/* ------------------------------------------------------------------ */
/* No-JS degradation                                                     */
/* ------------------------------------------------------------------ */

const EOS_PAGES = [
  'calculator/saudi-arabia',
  'calculator/uae',
  'calculator/kuwait',
  'calculator/qatar',
  'calculator/bahrain',
  'calculator/oman',
].flatMap((p) => [`${p}/index.html`, `en/${p}/index.html`]);

const TOOL_PAGES = ['tools/salary-net', 'tools/vat', 'tools/leave-balance', 'tools/notice-period'].flatMap(
  (p) => [`${p}/index.html`, `en/${p}/index.html`],
);

const FORM_PAGES = [
  'lawyers/index.html',
  'en/lawyers/index.html',
  'corrections/index.html',
  'en/corrections/index.html',
];

const INTERACTIVE_PAGES = [...EOS_PAGES, ...TOOL_PAGES, ...FORM_PAGES];

describe('Phase 6 no-JS degradation', () => {
  it('every interactive page renders a <noscript> fallback', () => {
    expect(INTERACTIVE_PAGES).toHaveLength(24);
    const bad: string[] = [];
    for (const rel of INTERACTIVE_PAGES) {
      const html = readBuiltPage(rel);
      if (!html.includes('<noscript>')) bad.push(rel);
    }
    expect(bad).toEqual([]);
  });

  it('lawyers/corrections noscript blocks show a visible mailto fallback', () => {
    for (const rel of FORM_PAGES) {
      const html = readBuiltPage(rel);
      const noscript = (html.match(/<noscript>([\s\S]*?)<\/noscript>/) || [])[1] ?? '';
      expect(noscript, `${rel} noscript block`).toContain(`mailto:${SITE.contactEmail}`);
      expect(noscript, `${rel} noscript block`).toContain(SITE.contactEmail);
    }
  });

  it('calculator noscript blocks explain that JavaScript is required', () => {
    for (const rel of [...EOS_PAGES, ...TOOL_PAGES]) {
      const html = readBuiltPage(rel);
      const noscript = (html.match(/<noscript>([\s\S]*?)<\/noscript>/) || [])[1] ?? '';
      const arHint = ar.common.jsRequired;
      const enHint = en.common.jsRequired;
      expect(noscript.includes(arHint) || noscript.includes(enHint), rel).toBe(true);
    }
  });
});

/* ------------------------------------------------------------------ */
/* Shipped-code hygiene                                                  */
/* ------------------------------------------------------------------ */

describe('Phase 6 shipped client-code hygiene', () => {
  it('no console.* calls in src/scripts/', () => {
    const bad: string[] = [];
    for (const f of srcFiles(join(src, 'scripts'))) {
      const text = readFileSync(f, 'utf8');
      if (/\bconsole\.\w+/.test(text)) bad.push(f.slice(src.length + 1));
    }
    expect(bad).toEqual([]);
  });

  it('no deprecated document.execCommand in src/', () => {
    const bad: string[] = [];
    for (const f of srcFiles(src)) {
      const text = readFileSync(f, 'utf8');
      if (text.includes('execCommand')) bad.push(f.slice(src.length + 1));
    }
    expect(bad).toEqual([]);
  });
});

/* ------------------------------------------------------------------ */
/* Placeholder discipline                                                */
/* ------------------------------------------------------------------ */

describe('Phase 6 domain discipline', () => {
  it('the production domain appears in src/ only inside src/config/site.ts', () => {
    const bad: string[] = [];
    for (const f of srcFiles(src)) {
      const rel = f.slice(src.length + 1);
      if (rel === 'config/site.ts') continue;
      const text = readFileSync(f, 'utf8');
      if (text.includes('endofservicegulf.org')) bad.push(rel);
    }
    expect(bad).toEqual([]);
  });

  it('no stale example.com domain remains anywhere in src/', () => {
    const bad: string[] = [];
    for (const f of srcFiles(src)) {
      const rel = f.slice(src.length + 1);
      const text = readFileSync(f, 'utf8');
      if (text.includes('gulf-eos.example.com')) bad.push(rel);
    }
    expect(bad).toEqual([]);
  });

  it('no tel: links anywhere in src/ or dist/', () => {
    const bad: string[] = [];
    for (const f of srcFiles(src)) {
      if (readFileSync(f, 'utf8').includes('tel:')) bad.push(`src: ${f.slice(src.length + 1)}`);
    }
    for (const f of allBuiltHtml(dist)) {
      if (readFileSync(f, 'utf8').includes('tel:')) bad.push(`dist: ${relOf(f)}`);
    }
    expect(bad).toEqual([]);
  });

  it('no long digit runs (phone-like) in components or pages', () => {
    const bad: string[] = [];
    const scanDirs = ['components', 'pages'].map((d) => join(src, d));
    for (const dir of scanDirs) {
      for (const f of srcFiles(dir)) {
        const text = readFileSync(f, 'utf8');
        // 7+ continuous digits, excluding 4-digit years.
        const hits = text.match(/\b\d{7,}\b/g) ?? [];
        if (hits.length > 0) bad.push(`${f.slice(src.length + 1)}: ${hits.join(', ')}`);
      }
    }
    expect(bad).toEqual([]);
  });
});

/* ------------------------------------------------------------------ */
/* Performance sanity                                                    */
/* ------------------------------------------------------------------ */

describe('Phase 6 performance sanity', () => {
  it('client JS chunks stay small', () => {
    const astroDir = join(dist, '_astro');
    const chunks = readdirSync(astroDir).filter((f) => f.endsWith('.js'));
    expect(chunks.length).toBeGreaterThan(0);
    const oversized: string[] = [];
    let total = 0;
    for (const c of chunks) {
      const size = statSync(join(astroDir, c)).size;
      total += size;
      if (size > 100 * 1024) oversized.push(`${c} (${Math.round(size / 1024)}KB)`);
    }
    expect(oversized).toEqual([]);
    // Whole client JS budget: well under 300KB uncompressed across all chunks.
    expect(total).toBeLessThan(300 * 1024);
  });

  it('no oversized inline scripts in built HTML', () => {
    const bad: string[] = [];
    for (const f of allBuiltHtml(dist)) {
      const html = readFileSync(f, 'utf8');
      for (const m of html.matchAll(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/g)) {
        if (m[1].length > 50 * 1024) bad.push(`${relOf(f)}: ${(m[1].length / 1024).toFixed(0)}KB inline`);
      }
    }
    expect(bad).toEqual([]);
  });
});
