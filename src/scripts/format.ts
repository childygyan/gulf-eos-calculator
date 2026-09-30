/**
 * scripts/format.ts — locale-aware formatting helpers for the client scripts.
 *
 * Arabic uses Latin digits (ar-u-nu-latn): familiar in financial contexts
 * and unambiguous next to currency codes.
 */
export type ScriptLocale = 'ar' | 'en';

export function getNumberFormatter(locale: ScriptLocale): Intl.NumberFormat {
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-u-nu-latn' : 'en-US', {
    maximumFractionDigits: 2,
  });
}

export function trim2(n: number): number {
  return Math.round(n * 100) / 100;
}

/** "5 سنوات" / "5 years" with Arabic plural rules. */
export function formatYears(locale: ScriptLocale, years: number): string {
  const r = trim2(years);
  const num = getNumberFormatter(locale).format(r);
  if (locale === 'ar') {
    if (r === 1) return 'سنة واحدة';
    if (r === 2) return 'سنتان';
    if (Number.isInteger(r) && r >= 3 && r <= 10) return `${num} سنوات`;
    return `${num} سنة`;
  }
  return r === 1 ? `${num} year` : `${num} years`;
}

/** ISO date → localized long date (UTC, no timezone shift). */
export function formatDateISO(locale: ScriptLocale, iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-u-nu-latn' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(d);
}

/** "12,500 SAR" — amount with the currency code. */
export function formatMoney(locale: ScriptLocale, amount: number, currencyCode: string): string {
  return `${getNumberFormatter(locale).format(trim2(amount))} ${currencyCode}`;
}
