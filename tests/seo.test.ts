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
import { SITE } from '../src/config/site.js';

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

  it('headTags injects GA4 + search-console verification tags from site config', () => {
    const head = headTags({ locale: 'ar', path: '/', title: 't', description: 'd' });
    expect(SITE.ga4MeasurementId).not.toBe('');
    expect(head).toContain(
      `https://www.googletagmanager.com/gtag/js?id=${SITE.ga4MeasurementId}`,
    );
    expect(head).toContain(`gtag('config','${SITE.ga4MeasurementId}')`);
    expect(head).toContain(
      `<meta name="google-site-verification" content="${SITE.googleSiteVerification}" />`,
    );
    expect(head).toContain(
      `<meta name="msvalidate.01" content="${SITE.bingSiteVerification}" />`,
    );
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

describe('Phase 3 tool pages carry hreflang + JSON-LD', () => {
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

  it('Arabic EOS page: rtl, canonical, hreflang, SoftwareApplication + FAQ JSON-LD, config JSON', () => {
    const html = readBuiltPage(join('calculator', 'saudi-arabia', 'index.html'));
    expect(html).toContain('<html lang="ar" dir="rtl"');
    expect(html).toContain(`rel="canonical" href="${SITE_URL}/calculator/saudi-arabia/"`);
    expect(html).toContain(`hreflang="ar" href="${SITE_URL}/calculator/saudi-arabia/"`);
    expect(html).toContain(`hreflang="en" href="${SITE_URL}/en/calculator/saudi-arabia/"`);
    expect(html).toContain(`hreflang="x-default" href="${SITE_URL}/calculator/saudi-arabia/"`);
    expect(html).toContain('"@type":"SoftwareApplication"');
    expect(html).toContain('"@type":"FAQPage"');
    expect(html).toContain('id="eos-config"');
    expect(html).toContain('مكافأة نهاية الخدمة');
  });

  it('English EOS page mirrors with ltr and the same tool path', () => {
    const html = readBuiltPage(join('en', 'calculator', 'saudi-arabia', 'index.html'));
    expect(html).toContain('<html lang="en" dir="ltr"');
    expect(html).toContain(`rel="canonical" href="${SITE_URL}/en/calculator/saudi-arabia/"`);
    expect(html).toContain(`hreflang="ar" href="${SITE_URL}/calculator/saudi-arabia/"`);
    expect(html).toContain('id="eos-config"');
  });

  it('all six countries have ar + en calculator pages', () => {
    for (const slug of ['saudi-arabia', 'uae', 'kuwait', 'qatar', 'bahrain', 'oman']) {
      expect(existsSync(join(dist, 'calculator', slug, 'index.html')), `ar ${slug}`).toBe(true);
      expect(existsSync(join(dist, 'en', 'calculator', slug, 'index.html')), `en ${slug}`).toBe(true);
    }
  });

  it('calculators hub and the four tool pages exist in both locales', () => {
    const pages = [
      join('calculators', 'index.html'),
      join('tools', 'salary-net', 'index.html'),
      join('tools', 'vat', 'index.html'),
      join('tools', 'leave-balance', 'index.html'),
      join('tools', 'notice-period', 'index.html'),
    ];
    for (const p of pages) {
      expect(existsSync(join(dist, p)), `ar ${p}`).toBe(true);
      expect(existsSync(join(dist, 'en', p)), `en ${p}`).toBe(true);
    }
    const vat = readBuiltPage(join('tools', 'vat', 'index.html'));
    expect(vat).toContain('"@type":"SoftwareApplication"');
    expect(vat).toContain('id="vat-config"');
  });

  it('sitemap lists the new tool pages', () => {
    const sitemap = readBuiltPage('sitemap-0.xml');
    expect(sitemap).toContain(`${SITE_URL}/calculator/saudi-arabia/`);
    expect(sitemap).toContain(`${SITE_URL}/en/calculator/oman/`);
    expect(sitemap).toContain(`${SITE_URL}/tools/vat/`);
    expect(sitemap).toContain(`${SITE_URL}/en/tools/leave-balance/`);
    expect(sitemap).toContain(`${SITE_URL}/calculators/`);
  });
});
