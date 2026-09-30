/**
 * lib/toolSeo.ts — extra JSON-LD for calculator/tool pages (Phase 3).
 *
 * Each interactive tool page gets a SoftwareApplication node (in addition
 * to the site-wide Organization/WebSite nodes from lib/seo.ts); pages with
 * FAQs also get a FAQPage node.
 */
import type { LocaleCode } from '../i18n/locales.js';
import { SITE_URL } from './seo.js';

export interface FaqItem {
  q: string;
  a: string;
}

/** SoftwareApplication JSON-LD for one calculator/tool page. */
export function softwareAppJsonLd(input: {
  name: string;
  description: string;
  /** Unprefixed path, e.g. `/calculator/saudi-arabia/`. */
  path: string;
  locale: LocaleCode;
}): string {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: input.name,
    description: input.description,
    url: `${SITE_URL}${input.path}`,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    inLanguage: input.locale,
    publisher: { '@id': `${SITE_URL}/#organization` },
  };
  return JSON.stringify(data);
}

/** FAQPage JSON-LD. */
export function faqJsonLd(faqs: FaqItem[]): string {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
  return JSON.stringify(data);
}
