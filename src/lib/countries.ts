/**
 * lib/countries.ts — URL slugs per GCC country (Phase 3).
 *
 * One stable Latin slug per country is used for BOTH locales so the
 * language switcher always links the same tool path across locales
 * (e.g. /calculator/saudi-arabia/ ↔ /en/calculator/saudi-arabia/).
 */
import type { GccCountryCode } from '../data/index.js';
import { COUNTRY_CODES } from '../data/index.js';

export const COUNTRY_SLUGS: Record<GccCountryCode, string> = {
  SA: 'saudi-arabia',
  AE: 'uae',
  KW: 'kuwait',
  QA: 'qatar',
  BH: 'bahrain',
  OM: 'oman',
};

const SLUG_TO_CODE = Object.fromEntries(
  Object.entries(COUNTRY_SLUGS).map(([code, slug]) => [slug, code]),
) as Record<string, GccCountryCode>;

/** Country code for a URL slug; undefined for unknown slugs. */
export function codeFromSlug(slug: string): GccCountryCode | undefined {
  return SLUG_TO_CODE[slug];
}

/** All country slugs (for getStaticPaths). */
export function allCountrySlugs(): string[] {
  return COUNTRY_CODES.map((c) => COUNTRY_SLUGS[c]);
}
