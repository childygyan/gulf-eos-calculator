/**
 * tests/seo.test.ts — SEO plumbing checks.
 *
 * Part 1 (unit): canonical/hreflang helpers produce the right tags.
 * Part 2 (built pages): dist/index.html and dist/en/index.html actually
 * carry hreflang ar/en/x-default, the correct canonical, html lang/dir,
 * and the Organization/WebSite JSON-LD. Part 2 requires `astro build` to
 * have run; it fails loudly if dist is missing so a stale pass is
 * impossible.
 */
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  SITE_URL,
  canonicalUrl,
  headTags,
  hreflangLinks,
  localizedPath,
} from '../src/lib/seo.js';

describe('seo helpers', () => {
  it('localizedPath prefixes only the non-default locale', () => {
    expect(localizedPath('/', 'ar')).toBe('/');
    expect(localizedPath('/', 'en')).toBe('/en');
    expect(localizedPath('/about', 'en')).toBe('/en/about');
    expect(localizedPath('/about', 'ar')).toBe('/about');
  });

  it('canonicalUrl is absolute and locale-aware', () => {
    expect(canonicalUrl('/', 'ar')).toBe(`${SITE_URL}/`);
    expect(canonicalUrl('/', 'en')).toBe(`${SITE_URL}/en`);
  });

  it('hreflangLinks emits ar, en and x-default pointing at canonicals', () => {
    const tags = hreflangLinks('/');
    expect(tags).toContain(`hreflang="ar" href="${SITE_URL}/"`);
    expect(tags).toContain(`hreflang="en" href="${SITE_URL}/en"`);
    expect(tags).toContain(`hreflang="x-default" href="${SITE_URL}/"`);
  });

  it('headTags includes title, description, canonical, OG and JSON-LD', () => {
    const head = headTags({
      locale: 'ar',
      path: '/',
      title: 't',
      description: 'd',
    });
    expect(head).toContain('<title>t</title>');
    expect(head).toContain('name="description" content="d"');
    expect(head).toContain(`rel="canonical" href="${SITE_URL}/"`);
    expect(head).toContain('property="og:title"');
    expect(head).toContain('application/ld+json');
    expect(head).toContain('"@type":"Organization"');
    expect(head).toContain('"@type":"WebSite"');
  });

  it('JSON-LD uses the Arabic brand name for ar and Latin name for en', () => {
    const arHead = headTags({ locale: 'ar', path: '/', title: 't', description: 'd' });
    const enHead = headTags({ locale: 'en', path: '/', title: 't', description: 'd' });
    expect(arHead).toContain('مستحقات');
    expect(enHead).toContain('Mustahaqqat');
  });
});

describe('built pages carry hreflang + JSON-LD', () => {
  const dist = join(process.cwd(), 'dist');

  function readBuiltPage(rel: string): string {
    const file = join(dist, rel);
    if (!existsSync(file)) {
      throw new Error(
        `Built page missing: ${file}. Run "npm run build" before "npm test".`,
      );
    }
    return readFileSync(file, 'utf8');
  }

  it('Arabic homepage: lang=ar dir=rtl, canonical /, hreflang set', () => {
    const html = readBuiltPage('index.html');
    expect(html).toContain('<html lang="ar" dir="rtl"');
    expect(html).toContain(`rel="canonical" href="${SITE_URL}/"`);
    expect(html).toContain(`hreflang="ar" href="${SITE_URL}/"`);
    expect(html).toContain(`hreflang="en" href="${SITE_URL}/en"`);
    expect(html).toContain(`hreflang="x-default" href="${SITE_URL}/"`);
    expect(html).toContain('application/ld+json');
    expect(html).toContain('مستحقات');
  });

  it('English homepage: lang=en dir=ltr, canonical /en, hreflang set', () => {
    const html = readBuiltPage(join('en', 'index.html'));
    expect(html).toContain('<html lang="en" dir="ltr"');
    expect(html).toContain(`rel="canonical" href="${SITE_URL}/en"`);
    expect(html).toContain(`hreflang="ar" href="${SITE_URL}/"`);
    expect(html).toContain(`hreflang="en" href="${SITE_URL}/en"`);
    expect(html).toContain(`hreflang="x-default" href="${SITE_URL}/"`);
    expect(html).toContain('Mustahaqqat');
  });

  it('sitemap and robots.txt are emitted', () => {
    expect(existsSync(join(dist, 'sitemap-index.xml'))).toBe(true);
    const robots = readBuiltPage('robots.txt');
    expect(robots).toContain(`Sitemap: ${SITE_URL}/sitemap-index.xml`);
  });
});
