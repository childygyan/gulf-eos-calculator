/**
 * tests/legal.test.ts — legal pages (privacy, terms, disclaimer).
 *
 * Requires `astro build` to have run (reads built HTML from dist/).
 * Guards: every legal page exists in ar + en, has exactly one H1, renders
 * all dict sections, shows the updated note, appears in the sitemap, and
 * is linked from the footer on both locales.
 */
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ar } from '../src/i18n/dicts/ar.js';
import { en } from '../src/i18n/dicts/en.js';
import { SITE_URL } from '../src/lib/seo.js';

const dist = join(process.cwd(), 'dist');

function readBuiltPage(rel: string): string {
  const file = join(dist, rel);
  if (!existsSync(file)) {
    throw new Error(`Built page missing: ${file}. Run "npm run build" before "npm test".`);
  }
  return readFileSync(file, 'utf8');
}

const LEGAL: Array<{ path: string; key: 'privacy' | 'terms' | 'disclaimerPage' }> = [
  { path: '/privacy/', key: 'privacy' },
  { path: '/terms/', key: 'terms' },
  { path: '/disclaimer/', key: 'disclaimerPage' },
];

describe('Legal pages exist in ar and en', () => {
  for (const { path } of LEGAL) {
    it(`${path} + /en${path}`, () => {
      expect(existsSync(join(dist, path.slice(1), 'index.html'))).toBe(true);
      expect(existsSync(join(dist, 'en', path.slice(1), 'index.html'))).toBe(true);
    });
  }
});

describe('Legal page content invariants', () => {
  for (const { path, key } of LEGAL) {
    for (const locale of ['ar', 'en'] as const) {
      const rel = locale === 'ar' ? `${path.slice(1)}index.html` : `en${path}index.html`;
      const dict = locale === 'ar' ? ar : en;
      const s = dict[key];
      it(`${locale}${path}: one H1, heading + updated note rendered`, () => {
        const html = readBuiltPage(rel);
        const h1s = html.match(/<h1[^>]*>/g) ?? [];
        expect(h1s).toHaveLength(1);
        expect(html).toContain(s.heading);
        expect(html).toContain(s.updated);
        expect(html).toContain(s.intro.slice(0, 40));
      });
      it(`${locale}${path}: all ${s.sections.length} sections rendered`, () => {
        const html = readBuiltPage(rel).replace(/&quot;/g, '"');
        for (const sec of s.sections) {
          expect(html).toContain(sec.h);
          expect(html).toContain(sec.p.slice(0, 40));
        }
        const h2s = html.match(/<h2[^>]*>/g) ?? [];
        expect(h2s).toHaveLength(s.sections.length);
      });
      it(`${locale}${path}: breadcrumb links home`, () => {
        const html = readBuiltPage(rel);
        expect(html).toContain('aria-label="breadcrumb"');
        expect(html).toContain('aria-current="page"');
      });
    }
  }
});

describe('Legal pages in sitemap and footer', () => {
  it('sitemap lists all 6 legal URLs', () => {
    const xml = readBuiltPage('sitemap-0.xml');
    for (const { path } of LEGAL) {
      expect(xml).toContain(`<loc>${SITE_URL}${path}</loc>`);
      expect(xml).toContain(`<loc>${SITE_URL}/en${path}</loc>`);
    }
  });

  it('footer links the legal pages on both locales', () => {
    for (const rel of ['index.html', 'en/index.html']) {
      const html = readBuiltPage(rel);
      const isAr = !rel.startsWith('en/');
      const dict = isAr ? ar : en;
      for (const p of ['/privacy/', '/terms/', '/disclaimer/'] as const) {
        const href = isAr ? p : `/en${p}`;
        expect(html, `${rel} footer → ${href}`).toContain(`href="${href}"`);
      }
      expect(html).toContain(dict.footer.legalTitle);
      expect(html).toContain(dict.footer.privacyLink);
      expect(html).toContain(dict.footer.termsLink);
      expect(html).toContain(dict.footer.disclaimerLink);
    }
  });

  it('no legal page leaks the old example.com domain', () => {
    for (const { path } of LEGAL) {
      for (const rel of [`${path.slice(1)}index.html`, `en${path}index.html`]) {
        expect(readBuiltPage(rel)).not.toContain('example.com');
      }
    }
  });
});
