/**
 * locales.ts — the two Phase 1 locales.
 *
 * Arabic is the default locale and lives at the root (`/`, RTL).
 * English mirrors under `/en/` (LTR).
 */
export const LOCALES = [
  { code: 'ar', hreflang: 'ar', htmlLang: 'ar', dir: 'rtl', label: 'العربية', prefix: '' },
  { code: 'en', hreflang: 'en', htmlLang: 'en', dir: 'ltr', label: 'English', prefix: '/en' },
] as const;

export type LocaleCode = (typeof LOCALES)[number]['code'];

export const DEFAULT_LOCALE: LocaleCode = 'ar';

/** All non-default locale codes (locales that live under a path prefix). */
export const PREFIXED_LOCALES = LOCALES.filter((l) => l.code !== DEFAULT_LOCALE);

export function getLocale(code: string): (typeof LOCALES)[number] {
  const found = LOCALES.find((l) => l.code === code);
  if (!found) throw new RangeError(`Unknown locale: ${code}`);
  return found;
}
