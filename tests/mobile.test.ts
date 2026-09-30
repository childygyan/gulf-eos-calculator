/**
 * tests/mobile.test.ts — mobile-viewport regression guards.
 *
 * The header's desktop row (brand + 4 nav links + language switcher) has an
 * intrinsic width of ~700px and forced page-level horizontal scrolling on
 * phones (verified: documentElement.scrollWidth 664px at a 500px viewport).
 * The header must collapse to a hamburger menu below lg, and the document
 * must never scroll horizontally at small widths.
 *
 * Requires `astro build` to have run (reads built HTML/CSS from dist/).
 */
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const dist = join(process.cwd(), 'dist');

function readBuiltPage(rel: string): string {
  const file = join(dist, rel);
  if (!existsSync(file)) {
    throw new Error(`Built page missing: ${file}. Run "npm run build" before "npm test".`);
  }
  return readFileSync(file, 'utf8');
}

function builtCss(): string {
  const astroDir = join(dist, '_astro');
  const cssFiles = readdirSync(astroDir).filter((f) => f.endsWith('.css'));
  expect(cssFiles.length).toBeGreaterThan(0);
  return cssFiles.map((f) => readFileSync(join(astroDir, f), 'utf8')).join('\n');
}

describe('mobile header (ar + en)', () => {
  for (const [locale, rel] of [
    ['ar', 'index.html'],
    ['en', join('en', 'index.html')],
  ] as const) {
    const html = () => readBuiltPage(rel);

    it(`[${locale}] has a hamburger button hidden on desktop`, () => {
      const h = html();
      expect(h).toContain('id="site-menu-button"');
      expect(h).toMatch(/id="site-menu-button"[^>]*aria-expanded="false"/);
      expect(h).toMatch(/id="site-menu-button"[^>]*aria-controls="site-menu"/);
      expect(h).toMatch(/id="site-menu-button"[^>]*lg:hidden/);
    });

    it(`[${locale}] has a hidden mobile menu panel with nav links`, () => {
      const h = html();
      // Panel starts hidden and never shows at desktop widths.
      expect(h).toMatch(/id="site-menu"[^>]*hidden/);
      expect(h).toMatch(/id="site-menu"[^>]*lg:hidden/);
      // All four nav destinations reachable from the panel.
      const panel = h.slice(h.indexOf('id="site-menu"'));
      for (const href of ['calculators/', 'faq/']) {
        expect(panel).toContain(href);
      }
    });

    it(`[${locale}] desktop nav and switcher are hidden below lg`, () => {
      const h = html();
      // Desktop nav row: hidden until lg.
      expect(h).toMatch(/<nav[^>]*class="[^"]*hidden[^"]*lg:flex"/);
      // Desktop language switcher wrapper: hidden until lg.
      expect(h).toMatch(/<div class="hidden lg:block">/);
    });

    it(`[${locale}] menu toggle script is present`, () => {
      expect(html()).toContain("getElementById('site-menu-button')");
    });
  }
});

describe('no page-level horizontal overflow', () => {
  it('body clips horizontal overflow (sticky-safe)', () => {
    const css = builtCss();
    expect(css.replace(/\s+/g, '')).toContain('overflow-x:clip');
  });
});
