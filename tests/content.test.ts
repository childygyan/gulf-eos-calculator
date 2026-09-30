/**
 * tests/content.test.ts — Phase 4 programmatic content checks.
 *
 * - Page inventory: every new ar/en URL exists in dist AND in the sitemap.
 * - hreflang + canonical on every new page (built-HTML checks).
 * - Internal-link resolution: every internal href in every built page
 *   resolves to a built page (no dead links).
 * - FAQ JSON-LD validity on /faq/ and on guide pages.
 * - No legal-figure drift: guide prose segments match the data model, the
 *   worked example is internally consistent, and qualitative dict strings
 *   contain no digits (numbers may only come from src/data/).
 *
 * Requires `astro build` to have run (fails loudly if dist is missing).
 */
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { SITE_URL, localizedPath } from '../src/lib/seo.js';
import { EOS_RULES, COUNTRY_CODES } from '../src/data/index.js';
import {
  capText,
  guideExample,
  guideNumericModel,
  resignationBandLine,
  tierSentence,
} from '../src/lib/guide.js';
import { ar } from '../src/i18n/dicts/ar.js';
import { en } from '../src/i18n/dicts/en.js';

const dist = join(process.cwd(), 'dist');

function readBuiltPage(rel: string): string {
  const file = join(dist, rel);
  if (!existsSync(file)) {
    throw new Error(`Built page missing: ${file}. Run "npm run build" before "npm test".`);
  }
  return readFileSync(file, 'utf8');
}

/** All Phase 4 pages as UNPREFIXED paths. */
const NEW_PAGES = [
  '/guides/saudi-arabia/',
  '/guides/uae/',
  '/guides/kuwait/',
  '/guides/qatar/',
  '/guides/bahrain/',
  '/guides/oman/',
  '/faq/',
  '/compare/saudi-vs-uae/',
  '/compare/gulf-eos/',
];

describe('Phase 4 page inventory', () => {
  it('every new page exists in ar and en', () => {
    for (const p of NEW_PAGES) {
      const rel = p.replace(/^\//, '');
      expect(existsSync(join(dist, rel, 'index.html')), `ar ${p}`).toBe(true);
      expect(existsSync(join(dist, 'en', rel, 'index.html')), `en ${p}`).toBe(true);
    }
  });

  it('sitemap lists every new page in both locales', () => {
    const sitemap = readBuiltPage('sitemap-0.xml');
    for (const p of NEW_PAGES) {
      expect(sitemap, `sitemap ar ${p}`).toContain(`${SITE_URL}${p}`);
      expect(sitemap, `sitemap en ${p}`).toContain(`${SITE_URL}/en${p.slice(0, -1)}/`);
    }
  });

  it('new pages carry canonical + full hreflang set', () => {
    for (const p of NEW_PAGES) {
      const rel = p.replace(/^\//, '');
      for (const locale of ['ar', 'en'] as const) {
        const html = readBuiltPage(join(locale === 'ar' ? rel : join('en', rel), 'index.html'));
        const canonical = SITE_URL + localizedPath(p, locale);
        expect(html, `${locale} ${p} canonical`).toContain(
          `rel="canonical" href="${canonical}"`,
        );
        expect(html, `${locale} ${p} hreflang ar`).toContain(
          `hreflang="ar" href="${SITE_URL}${p}"`,
        );
        expect(html, `${locale} ${p} hreflang en`).toContain(
          `hreflang="en" href="${SITE_URL}/en${p}"`,
        );
        expect(html, `${locale} ${p} hreflang x-default`).toContain(
          `hreflang="x-default" href="${SITE_URL}${p}"`,
        );
      }
    }
  });

  it('new pages carry Article JSON-LD', () => {
    for (const p of NEW_PAGES) {
      const html = readBuiltPage(join(p.replace(/^\//, ''), 'index.html'));
      expect(html, `ar ${p} Article`).toContain('"@type":"Article"');
    }
  });

  it('html lang/dir is correct on new pages', () => {
    const arGuide = readBuiltPage(join('guides', 'oman', 'index.html'));
    expect(arGuide).toContain('<html lang="ar" dir="rtl"');
    const enGuide = readBuiltPage(join('en', 'guides', 'oman', 'index.html'));
    expect(enGuide).toContain('<html lang="en" dir="ltr"');
  });
});

describe('internal links resolve', () => {
  function allHtmlFiles(dir: string): string[] {
    const out: string[] = [];
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) out.push(...allHtmlFiles(full));
      else if (entry.endsWith('.html')) out.push(full);
    }
    return out;
  }

  function resolves(href: string): boolean {
    const p = join(dist, href);
    if (existsSync(p) && statSync(p).isFile()) return true;
    return existsSync(join(p, 'index.html'));
  }

  it('every internal href in every built page resolves to a built file', () => {
    const files = allHtmlFiles(dist);
    expect(files.length).toBeGreaterThan(30);
    const broken: string[] = [];
    for (const file of files) {
      const html = readFileSync(file, 'utf8');
      const hrefs = [...html.matchAll(/href="(\/[^"#]*)"/g)].map((m) => m[1]);
      for (const href of new Set(hrefs)) {
        if (!resolves(href)) broken.push(`${file} -> ${href}`);
      }
    }
    expect(broken, `broken internal links:\n${broken.join('\n')}`).toEqual([]);
  });
});

describe('FAQ JSON-LD validity', () => {
  function faqPageNode(rel: string) {
    const html = readBuiltPage(rel);
    const scripts = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)];
    expect(scripts.length).toBeGreaterThan(0);
    for (const [, body] of scripts) {
      const data = JSON.parse(body) as {
        '@graph'?: { '@type'?: string }[];
        '@type'?: string;
      };
      const nodes = data['@graph'] ?? [data];
      const faq = nodes.find((n) => n['@type'] === 'FAQPage') as
        | { mainEntity: { '@type': string; name: string; acceptedAnswer: { text: string } }[] }
        | undefined;
      if (faq) return faq;
    }
    throw new Error(`No FAQPage node in ${rel}`);
  }

  it('/faq/ has a valid FAQPage with 10 questions', () => {
    const faq = faqPageNode(join('faq', 'index.html'));
    expect(faq.mainEntity).toHaveLength(10);
    for (const q of faq.mainEntity) {
      expect(q['@type']).toBe('Question');
      expect(q.name.trim().length).toBeGreaterThan(0);
      expect(q.acceptedAnswer.text.trim().length).toBeGreaterThan(0);
    }
  });

  it('guide pages have a valid FAQPage with 4 questions', () => {
    for (const code of COUNTRY_CODES) {
      const slugs: Record<string, string> = {
        SA: 'saudi-arabia',
        AE: 'uae',
        KW: 'kuwait',
        QA: 'qatar',
        BH: 'bahrain',
        OM: 'oman',
      };
      const faq = faqPageNode(join('guides', slugs[code], 'index.html'));
      expect(faq.mainEntity, code).toHaveLength(4);
      for (const q of faq.mainEntity) {
        expect(q.name.trim().length, code).toBeGreaterThan(0);
        expect(q.acceptedAnswer.text.trim().length, code).toBeGreaterThan(0);
      }
    }
  });
});

describe('no legal-figure drift', () => {
  it('guide numeric model matches the data model exactly', () => {
    for (const code of COUNTRY_CODES) {
      const rules = EOS_RULES[code];
      const term = rules.scenarios.find((s) => s.id === 'termination')!;
      const resign = rules.scenarios.find((s) => s.id === 'resignation')!;
      expect(guideNumericModel(code)).toEqual({
        tiers: term.tiers.map((t) => ({
          rateMonthsPerYear: t.rateMonthsPerYear,
          upToYears: t.upToYears,
        })),
        resignationBands: (resign.resignationBands ?? []).map((b) => ({
          fromYears: b.fromYears,
          toYears: b.toYears,
          fraction: b.fraction,
        })),
        capMonths: term.capMonths,
        minServiceTermination: term.minServiceYears,
        minServiceResignation: resign.minServiceYears,
        wageBasisKind: rules.wageBasis.kind,
      });
    }
  });

  it('tier sentences carry the data-model band years', () => {
    const sa = EOS_RULES.SA.scenarios.find((s) => s.id === 'termination')!;
    const arTiers = sa.tiers.map((t, i) => tierSentence('SA', t, i, sa.tiers, 'ar'));
    expect(arTiers[0]).toContain('5');
    expect(arTiers[0]).toContain('نصف شهر');
    expect(arTiers[1]).toContain('شهر كامل');
    const ae = EOS_RULES.AE.scenarios.find((s) => s.id === 'termination')!;
    const aeTiers = ae.tiers.map((t, i) => tierSentence('AE', t, i, ae.tiers, 'en'));
    expect(aeTiers[0]).toContain('21 days');
    expect(aeTiers[0]).toContain('5');
  });

  it('resignation band lines carry the data-model fractions and bounds', () => {
    const kw = EOS_RULES.KW.scenarios.find((s) => s.id === 'resignation')!;
    const lines = kw.resignationBands!.map((b) => resignationBandLine(b, 'ar'));
    expect(lines[0]).toContain('3');
    expect(lines[0]).toContain('نصف المكافأة');
    expect(lines[1]).toContain('ثلثا المكافأة');
  });

  it('cap text carries the data-model cap months', () => {
    expect(capText(24, 'ar')).toContain('24');
    expect(capText(null, 'en')).toContain('no statutory cap');
  });

  it('the guide worked example is engine-consistent', () => {
    for (const code of COUNTRY_CODES) {
      const ex = guideExample(code);
      // total == sum of tier lines
      const sum = ex.lines.reduce((a, l) => a + l.amount, 0);
      expect(Math.abs(ex.total - sum), `${code} total`).toBeLessThan(0.01);
      // lines cover the full 6 example years
      const years = ex.lines.reduce((a, l) => a + l.yearsInBand, 0);
      expect(Math.abs(years - 6), `${code} years`).toBeLessThan(0.01);
    }
    // Resignation totals only where the law reduces them, at the right ratio.
    const sa = guideExample('SA');
    expect(sa.resignationTotal).not.toBeNull();
    expect(Math.abs(sa.resignationTotal! / sa.total - 2 / 3)).toBeLessThan(0.01);
    const kw = guideExample('KW');
    expect(kw.resignationTotal).not.toBeNull();
    expect(Math.abs(kw.resignationTotal! / kw.total - 2 / 3)).toBeLessThan(0.01);
    for (const code of ['AE', 'QA', 'BH', 'OM'] as const) {
      expect(guideExample(code).resignationTotal, code).toBeNull();
    }
  });

  it('qualitative guide strings contain no digits (numbers come only from data)', () => {
    const digitRe = /[0-9٠-٩]/;
    for (const localeDict of [ar, en]) {
      for (const code of COUNTRY_CODES) {
        expect(localeDict.guides.notes[code], `notes ${code}`).not.toMatch(digitRe);
        for (const m of localeDict.guides.mistakes[code]) {
          expect(m, `mistakes ${code}`).not.toMatch(digitRe);
        }
      }
      expect(localeDict.guides.transitionAmbiguityNote).not.toMatch(digitRe);
      expect(localeDict.compare.verdict).not.toMatch(digitRe);
    }
  });
});
