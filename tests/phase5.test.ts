/**
 * tests/phase5.test.ts — Phase 5 monetization + lead-gen checks.
 *
 * - Form validation logic: required fields, email/phone format, country +
 *   case-type routing map covers all 6 countries × 4 case types.
 * - Ad slots render empty (built-HTML check): no `adsbygoogle` markup
 *   anywhere while `SITE.adsenseClientId` is unconfigured.
 * - No invented contacts: scan ALL built HTML for phone-like numbers or
 *   non-placeholder emails — fail if found.
 * - New pages (/lawyers/, /corrections/, /contact/ × ar/en) exist with
 *   correct lang/dir, canonical, hreflang, and sitemap entries.
 * - Config placeholders documented: siteUrl + contactEmail still the
 *   example.com placeholders (Firoz must supply the real values).
 *
 * Requires `astro build` to have run (fails loudly if dist is missing).
 */
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { SITE } from '../src/config/site.js';
import { SITE_URL, localizedPath } from '../src/lib/seo.js';
import { adSlotHtml, adsConfigured } from '../src/lib/ads.js';
import {
  CASE_TYPES,
  INTAKE_ROUTES,
  buildMailto,
  intakeInbox,
  isValidEmail,
  isValidPhone,
  routeIntake,
  validateCorrection,
  validateIntake,
  type CaseType,
  type CorrectionInput,
  type IntakeInput,
} from '../src/lib/forms.js';
import { COUNTRY_CODES, type GccCountryCode } from '../src/data/index.js';

const dist = join(process.cwd(), 'dist');

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
    else if (entry.endsWith('.html')) acc.push(full);
  }
  return acc;
}

const VALID_INTAKE: IntakeInput = {
  country: 'SA',
  caseType: 'termination',
  name: 'Fahad Alotaibi',
  contact: 'fahad@example.com',
  description: 'My employer ended my contract without paying my full end-of-service award.',
};

const VALID_CORRECTION: CorrectionInput = {
  pageUrl: '/guides/saudi-arabia/',
  whatsWrong: 'The cap paragraph cites the wrong number of months for this scenario.',
  correctFigure: 'The official text sets the cap at the figure linked below.',
  sourceLink: 'https://www.example.gov.sa/labour-law',
};

/* ------------------------------------------------------------------ */
/* Config placeholders                                                 */
/* ------------------------------------------------------------------ */

describe('Phase 5 site config placeholders', () => {
  it('siteUrl is still the placeholder domain', () => {
    expect(SITE.siteUrl).toBe('https://gulf-eos.example.com');
    expect(SITE_URL).toBe('https://gulf-eos.example.com');
  });

  it('contactEmail is a clearly-labeled placeholder on example.com', () => {
    expect(SITE.contactEmail).toBe('intake@gulf-eos.example.com');
    expect(intakeInbox()).toBe('intake@gulf-eos.example.com');
  });

  it('adsenseClientId is empty by default', () => {
    expect(SITE.adsenseClientId).toBe('');
    expect(adsConfigured()).toBe(false);
  });
});

/* ------------------------------------------------------------------ */
/* Shared validators                                                   */
/* ------------------------------------------------------------------ */

describe('contact validators', () => {
  it('accepts valid emails and rejects bad ones', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
    expect(isValidEmail('user.name+tag@example.co.uk')).toBe(true);
    expect(isValidEmail('not-an-email')).toBe(false);
    expect(isValidEmail('user@')).toBe(false);
    expect(isValidEmail('user @example.com')).toBe(false);
  });

  it('accepts valid phones and rejects bad ones', () => {
    expect(isValidPhone('+966 50 123 4567')).toBe(true);
    expect(isValidPhone('0501234567')).toBe(true);
    expect(isValidPhone('(050) 123-4567')).toBe(true);
    expect(isValidPhone('123')).toBe(false);
    expect(isValidPhone('not a phone')).toBe(false);
  });
});

/* ------------------------------------------------------------------ */
/* Intake validation + routing                                         */
/* ------------------------------------------------------------------ */

describe('intake validation', () => {
  it('accepts a fully valid intake', () => {
    expect(validateIntake(VALID_INTAKE)).toEqual({});
  });

  it('accepts phone-only contact', () => {
    expect(validateIntake({ ...VALID_INTAKE, contact: '+966501234567' })).toEqual({});
  });

  it('requires every field', () => {
    const errors = validateIntake({ country: '', caseType: '', name: '', contact: '', description: '' });
    expect(errors.country).toBe('required');
    expect(errors.caseType).toBe('required');
    expect(errors.name).toBe('required');
    expect(errors.contact).toBe('contactRequired');
    expect(errors.description).toBe('required');
  });

  it('rejects unknown country and case type codes', () => {
    const errors = validateIntake({ ...VALID_INTAKE, country: 'US', caseType: 'divorce' });
    expect(errors.country).toBe('invalidCountry');
    expect(errors.caseType).toBe('invalidCaseType');
  });

  it('rejects malformed email and phone contacts', () => {
    expect(validateIntake({ ...VALID_INTAKE, contact: 'bad@' }).contact).toBe('contactInvalid');
    expect(validateIntake({ ...VALID_INTAKE, contact: '12' }).contact).toBe('contactInvalid');
  });

  it('rejects too-short name and description', () => {
    expect(validateIntake({ ...VALID_INTAKE, name: 'A' }).name).toBe('nameTooShort');
    expect(validateIntake({ ...VALID_INTAKE, description: 'too short' }).description).toBe(
      'descriptionTooShort',
    );
  });
});

describe('intake routing', () => {
  it('routing map covers all 6 countries × all 4 case types', () => {
    expect(COUNTRY_CODES).toHaveLength(6);
    expect(CASE_TYPES).toHaveLength(4);
    for (const country of COUNTRY_CODES) {
      for (const caseType of CASE_TYPES) {
        const code = INTAKE_ROUTES[country][caseType];
        expect(typeof code, `${country}/${caseType}`).toBe('string');
        expect(code.length, `${country}/${caseType}`).toBeGreaterThan(0);
      }
    }
  });

  it('routeIntake returns a route code carrying both country and case type', () => {
    for (const country of COUNTRY_CODES) {
      for (const caseType of CASE_TYPES) {
        const route = routeIntake(country as GccCountryCode, caseType as CaseType);
        expect(route.routeCode).toContain(country);
        expect(route.routeCode).toContain(caseType);
        expect(route.country).toBe(country);
        expect(route.caseType).toBe(caseType);
      }
    }
  });
});

describe('mailto builder', () => {
  it('builds an encoded mailto: link to the intake inbox', () => {
    const link = buildMailto(intakeInbox(), 'Legal inquiry: SA — test', 'line one\nline two');
    expect(link.startsWith('mailto:intake@gulf-eos.example.com?')).toBe(true);
    expect(link).toContain(encodeURIComponent('Legal inquiry: SA — test'));
    expect(link).toContain(encodeURIComponent('line one\nline two'));
  });
});

/* ------------------------------------------------------------------ */
/* Correction validation                                               */
/* ------------------------------------------------------------------ */

describe('correction validation', () => {
  it('accepts a fully valid correction', () => {
    expect(validateCorrection(VALID_CORRECTION)).toEqual({});
  });

  it('requires every field', () => {
    const errors = validateCorrection({ pageUrl: '', whatsWrong: '', correctFigure: '', sourceLink: '' });
    expect(errors.pageUrl).toBe('required');
    expect(errors.whatsWrong).toBe('required');
    expect(errors.correctFigure).toBe('required');
    expect(errors.sourceLink).toBe('required');
  });

  it('accepts a site-internal page path for pageUrl', () => {
    expect(validateCorrection({ ...VALID_CORRECTION, pageUrl: '/en/faq/' }).pageUrl).toBeUndefined();
  });

  it('rejects malformed page URLs', () => {
    expect(validateCorrection({ ...VALID_CORRECTION, pageUrl: 'not a url' }).pageUrl).toBe('invalidUrl');
  });

  it('requires a full absolute URL for the official source link', () => {
    expect(validateCorrection({ ...VALID_CORRECTION, sourceLink: '/guides/saudi-arabia/' }).sourceLink).toBe(
      'invalidSource',
    );
    expect(validateCorrection({ ...VALID_CORRECTION, sourceLink: 'www.example.gov.sa' }).sourceLink).toBe(
      'invalidSource',
    );
  });

  it('rejects too-short explanations', () => {
    expect(validateCorrection({ ...VALID_CORRECTION, whatsWrong: 'wrong' }).whatsWrong).toBe('tooShort');
    expect(validateCorrection({ ...VALID_CORRECTION, correctFigure: 'x' }).correctFigure).toBe('tooShort');
  });
});

/* ------------------------------------------------------------------ */
/* Ad slots: empty while unconfigured                                   */
/* ------------------------------------------------------------------ */

describe('ad slots', () => {
  it('adSlotHtml returns the empty string when no publisher ID is configured', () => {
    expect(adSlotHtml('header')).toBe('');
    expect(adSlotHtml('in-article')).toBe('');
    expect(adSlotHtml('footer')).toBe('');
  });

  it('no built page contains live ad markup', () => {
    const files = allBuiltHtml(dist);
    expect(files.length).toBeGreaterThan(0);
    for (const f of files) {
      const html = readFileSync(f, 'utf8');
      expect(html, `adsbygoogle in ${f}`).not.toContain('adsbygoogle');
      expect(html, `data-ad-client in ${f}`).not.toContain('data-ad-client');
    }
  });
});

/* ------------------------------------------------------------------ */
/* No invented contacts anywhere in built HTML                         */
/* ------------------------------------------------------------------ */

describe('no invented contacts in built HTML', () => {
  const PHONE_PATTERNS = [
    /\+\d[\d\s().-]{6,}\d/, // + followed by 7+ digits (international format)
    /\b\d{3}[-. ]\d{3}[-. ]\d{4}\b/, // 555-123-4567 style
    /\btel:/i,
  ];
  const EMAIL_PATTERN = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;

  it('no phone-like numbers or tel: links in any built page', () => {
    const files = allBuiltHtml(dist);
    for (const f of files) {
      const html = readFileSync(f, 'utf8');
      for (const pattern of PHONE_PATTERNS) {
        expect(html, `phone-like pattern ${pattern} in ${f}`).not.toMatch(pattern);
      }
    }
  });

  it('every email address in built HTML is the example.com placeholder', () => {
    const files = allBuiltHtml(dist);
    const offenders: string[] = [];
    for (const f of files) {
      const html = readFileSync(f, 'utf8');
      const matches = html.match(EMAIL_PATTERN) ?? [];
      for (const m of matches) {
        if (!m.endsWith('@gulf-eos.example.com')) offenders.push(`${f}: ${m}`);
      }
    }
    expect(offenders).toEqual([]);
  });
});

/* ------------------------------------------------------------------ */
/* New Phase 5 pages                                                   */
/* ------------------------------------------------------------------ */

const NEW_PAGES = ['/lawyers/', '/corrections/', '/contact/'];

describe('Phase 5 page inventory', () => {
  it('every new page exists in ar and en', () => {
    for (const p of NEW_PAGES) {
      const rel = p.replace(/^\//, '');
      expect(existsSync(join(dist, rel, 'index.html')), `ar ${p}`).toBe(true);
      expect(existsSync(join(dist, 'en', rel, 'index.html')), `en ${p}`).toBe(true);
    }
  });

  it('new pages carry correct lang/dir, canonical, and hreflang', () => {
    for (const p of NEW_PAGES) {
      const arHtml = readBuiltPage(`${p.replace(/^\//, '')}index.html`);
      expect(arHtml, `ar lang ${p}`).toContain('lang="ar" dir="rtl"');
      expect(arHtml, `ar canonical ${p}`).toContain(
        `<link rel="canonical" href="${SITE_URL}${p}" />`,
      );
      expect(arHtml, `ar hreflang ${p}`).toContain(`hreflang="ar" href="${SITE_URL}${p}"`);
      expect(arHtml, `ar hreflang en ${p}`).toContain(
        `hreflang="en" href="${SITE_URL}/en${p.slice(0, -1)}/"`,
      );
      const enHtml = readBuiltPage(`en/${p.replace(/^\//, '')}index.html`);
      expect(enHtml, `en lang ${p}`).toContain('lang="en" dir="ltr"');
      expect(enHtml, `en canonical ${p}`).toContain(
        `<link rel="canonical" href="${SITE_URL}/en${p.slice(0, -1)}/" />`,
      );
    }
  });

  it('sitemap lists every new page in both locales', () => {
    const sitemap = readBuiltPage('sitemap-0.xml');
    for (const p of NEW_PAGES) {
      expect(sitemap, `sitemap ar ${p}`).toContain(`${SITE_URL}${p}`);
      expect(sitemap, `sitemap en ${p}`).toContain(`${SITE_URL}/en${p.slice(0, -1)}/`);
    }
  });

  it('lawyers page embeds the intake form and config JSON', () => {
    const arHtml = readBuiltPage('lawyers/index.html');
    expect(arHtml).toContain('id="lawyers-form"');
    expect(arHtml).toContain('id="lawyers-config"');
    expect(arHtml).toContain('id="lawyers-confirm"');
    const enHtml = readBuiltPage('en/lawyers/index.html');
    expect(enHtml).toContain('id="lawyers-form"');
  });

  it('corrections page embeds the correction form and config JSON', () => {
    const arHtml = readBuiltPage('corrections/index.html');
    expect(arHtml).toContain('id="corrections-form"');
    expect(arHtml).toContain('id="corrections-config"');
    const enHtml = readBuiltPage('en/corrections/index.html');
    expect(enHtml).toContain('id="corrections-form"');
  });

  it('contact page shows the placeholder inbox and the placeholder note', () => {
    const arHtml = readBuiltPage('contact/index.html');
    expect(arHtml).toContain('intake@gulf-eos.example.com');
    expect(arHtml).toContain('mailto:intake@gulf-eos.example.com');
  });

  it('footer links to the three new pages from both locales', () => {
    const arHtml = readBuiltPage('index.html');
    expect(arHtml).toContain('href="/lawyers/"');
    expect(arHtml).toContain('href="/corrections/"');
    expect(arHtml).toContain('href="/contact/"');
    const enHtml = readBuiltPage('en/index.html');
    expect(enHtml).toContain('href="/en/lawyers/"');
    expect(enHtml).toContain('href="/en/corrections/"');
    expect(enHtml).toContain('href="/en/contact/"');
  });

  it('localizedPath resolves the new routes in both locales', () => {
    expect(localizedPath('/lawyers/', 'ar')).toBe('/lawyers/');
    expect(localizedPath('/lawyers/', 'en')).toBe('/en/lawyers/');
    expect(localizedPath('/corrections/', 'en')).toBe('/en/corrections/');
    expect(localizedPath('/contact/', 'en')).toBe('/en/contact/');
  });
});
