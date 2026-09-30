/**
 * lib/seo.ts — canonical URL, hreflang, and head-tag builders.
 *
 * Arabic is the default locale at the root (`/`); English mirrors under
 * `/en/`. `path` is always the UNPREFIXED path (e.g. `/` or `/about`).
 */
import { DEFAULT_LOCALE, LOCALES, getLocale, type LocaleCode } from '../i18n/locales.js';
import { SITE } from '../config/site.js';

/**
 * Placeholder until Firoz supplies the real production domain.
 * Re-exported from the single config in src/config/site.ts (Phase 5).
 */
export const SITE_URL = SITE.siteUrl;

export const SITE_NAME_AR = 'مستحقات';
export const SITE_NAME_EN = 'Mustahaqqat';

/** Localized path: `/en/about` for English, `/about` for Arabic. */
export function localizedPath(path: string, locale: LocaleCode): string {
  const clean = path === '/' ? '' : path;
  return `${getLocale(locale).prefix}${clean}` || '/';
}

export function canonicalUrl(path: string, locale: LocaleCode): string {
  return `${SITE_URL}${localizedPath(path, locale)}`;
}

/** Alternate URLs for hreflang: one per locale plus x-default (Arabic). */
export function alternateUrls(path: string): { locale: LocaleCode; hreflang: string; href: string }[] {
  return LOCALES.map((l) => ({
    locale: l.code,
    hreflang: l.hreflang,
    href: canonicalUrl(path, l.code),
  }));
}

function xDefaultUrl(path: string): string {
  return canonicalUrl(path, DEFAULT_LOCALE);
}

function escapeAttr(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

/** `<link rel="alternate" hreflang="…">` tags for every locale + x-default. */
export function hreflangLinks(path: string): string {
  const links = alternateUrls(path).map(
    (a) => `<link rel="alternate" hreflang="${a.hreflang}" href="${a.href}" />`,
  );
  links.push(`<link rel="alternate" hreflang="x-default" href="${xDefaultUrl(path)}" />`);
  return links.join('\n');
}

export interface HeadInput {
  locale: LocaleCode;
  /** Unprefixed path, e.g. `/`. */
  path: string;
  title: string;
  description: string;
  /** Absolute OG image URL; defaults to the brand cover. */
  ogImage?: string;
}

/** Full `<head>` tag block: meta, OG/Twitter, canonical, hreflang, JSON-LD. */
/** Search-console verification meta tags (only the configured ones). */
function verificationTags(): string {
  const tags: string[] = [];
  if (SITE.googleSiteVerification) {
    tags.push(
      `<meta name="google-site-verification" content="${escapeAttr(SITE.googleSiteVerification)}" />`,
    );
  }
  if (SITE.bingSiteVerification) {
    tags.push(
      `<meta name="msvalidate.01" content="${escapeAttr(SITE.bingSiteVerification)}" />`,
    );
  }
  return tags.join('\n');
}

/** GA4 gtag.js snippet (only when a measurement ID is configured). */
function analyticsTags(): string {
  if (!SITE.ga4MeasurementId) return '';
  const id = escapeAttr(SITE.ga4MeasurementId);
  return [
    `<script async src="https://www.googletagmanager.com/gtag/js?id=${id}"></script>`,
    `<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${id}');</script>`,
  ].join('\n');
}

export function headTags(input: HeadInput): string {
  const { locale, path, title, description } = input;
  const canonical = canonicalUrl(path, locale);
  const ogImage = input.ogImage ?? `${SITE_URL}/og-cover.svg`;
  const t = escapeAttr(title);
  const d = escapeAttr(description);
  const localeMeta = getLocale(locale);

  return [
    `<meta charset="utf-8" />`,
    `<meta name="viewport" content="width=device-width, initial-scale=1" />`,
    verificationTags(),
    analyticsTags(),
    `<title>${t}</title>`,
    `<meta name="description" content="${d}" />`,
    `<link rel="icon" type="image/svg+xml" href="/favicon.svg" />`,
    `<link rel="canonical" href="${canonical}" />`,
    hreflangLinks(path),
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${escapeAttr(locale === 'ar' ? SITE_NAME_AR : SITE_NAME_EN)}" />`,
    `<meta property="og:title" content="${t}" />`,
    `<meta property="og:description" content="${d}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:image" content="${ogImage}" />`,
    `<meta property="og:locale" content="${localeMeta.htmlLang}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${t}" />`,
    `<meta name="twitter:description" content="${d}" />`,
    `<meta name="twitter:image" content="${ogImage}" />`,
    `<script type="application/ld+json">${jsonLd(locale)}</script>`,
  ].join('\n');
}

/** Organization + WebSite JSON-LD shared by every page. */
export function jsonLd(locale: LocaleCode): string {
  const name = locale === 'ar' ? SITE_NAME_AR : SITE_NAME_EN;
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name,
        url: SITE_URL,
        logo: `${SITE_URL}/logo.svg`,
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name,
        inLanguage: locale === 'ar' ? 'ar' : 'en',
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
    ],
  };
  return JSON.stringify(data);
}
