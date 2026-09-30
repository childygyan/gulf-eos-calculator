/**
 * lib/guide.ts — data-driven prose helpers for the Phase 4 content pages.
 *
 * HONESTY CONTRACT: every numeric phrase below is derived from the
 * Phase 2 data model (`src/data/`) at build time. No legal figure is
 * hardcoded here — the drift test (tests/content.test.ts) asserts that
 * the rendered segments match EOS_RULES exactly, and that the
 * qualitative dict strings (notes/mistakes) contain no digits at all.
 */
import {
  EOS_RULES,
  BH_SIO_EFFECTIVE_DATE,
  OM_NEW_LAW_EFFECTIVE_DATE,
  type EosTier,
  type GccCountryCode,
  type ResignationBand,
} from '../data/index.js';
import { calculateEos, type EosAssumptionKey } from '../engine/eos.js';
import type { LocaleCode } from '../i18n/locales.js';
import type { Dict } from '../i18n/dict.js';

type AssumptionKey = keyof Dict['eos']['assumptions'];

/** Which labeled assumptions apply to each country's guide. */
export const GUIDE_ASSUMPTIONS: Record<GccCountryCode, AssumptionKey[]> = {
  SA: ['saudiWageReading'],
  AE: [],
  KW: ['kuwaitDailyDivisor'],
  QA: ['qatarWeeksDivisor'],
  BH: ['bhNoStartDate'],
  OM: ['omanOldDivisor', 'omNoStartDate'],
};

const EPS = 1e-9;
const approx = (a: number, b: number) => Math.abs(a - b) < EPS;

/**
 * Words for an accrual rate (months of wage per year of service).
 * The numeric rate always comes from the data model; only the wording
 * (days vs weeks vs months) is locale/country context.
 */
export function rateWords(
  code: GccCountryCode,
  rateMonthsPerYear: number,
  locale: LocaleCode,
  preferDays = false,
): string {
  const ar = locale === 'ar';
  if (code === 'QA') return ar ? 'ثلاثة أسابيع' : 'three weeks';
  if (preferDays) {
    const days = Math.round(rateMonthsPerYear * 30);
    if (approx(days, rateMonthsPerYear * 30)) {
      return ar ? `${days} يومًا` : `${days} days`;
    }
  }
  if (approx(rateMonthsPerYear, 1)) return ar ? 'شهر كامل' : 'a full month';
  if (approx(rateMonthsPerYear, 0.5)) return ar ? 'نصف شهر' : 'half a month';
  if (approx(rateMonthsPerYear, 21 / 30)) return ar ? '21 يومًا' : '21 days';
  if (approx(rateMonthsPerYear, 15 / 26)) return ar ? '15 يومًا' : '15 days';
  const n = trim2(rateMonthsPerYear);
  return ar ? `${n} من الأجر الشهري` : `${n} of the monthly wage`;
}

/** One accrual tier rendered as a plain-language sentence fragment. */
export function tierSentence(
  code: GccCountryCode,
  tier: EosTier,
  index: number,
  tiers: EosTier[],
  locale: LocaleCode,
  preferDays = false,
): string {
  const ar = locale === 'ar';
  const rate = rateWords(code, tier.rateMonthsPerYear, locale, preferDays);
  if (tiers.length === 1) {
    return ar
      ? `${rate} عن كل سنة من سنوات الخدمة`
      : `${rate} for each year of service`;
  }
  if (tier.upToYears !== null) {
    return ar
      ? `${rate} عن كل سنة خلال أول ${tier.upToYears} سنوات من الخدمة`
      : `${rate} for each year during the first ${tier.upToYears} years of service`;
  }
  void index;
  return ar ? `${rate} عن كل سنة بعد ذلك` : `${rate} for each year after that`;
}

/** Words for a resignation fraction. */
export function fractionWords(fraction: number, locale: LocaleCode): string {
  const ar = locale === 'ar';
  if (approx(fraction, 1)) return ar ? 'المكافأة كاملة' : 'the full award';
  if (approx(fraction, 1 / 2)) return ar ? 'نصف المكافأة' : 'half the award';
  if (approx(fraction, 1 / 3)) return ar ? 'ثلث المكافأة' : 'one-third of the award';
  if (approx(fraction, 2 / 3)) return ar ? 'ثلثا المكافأة' : 'two-thirds of the award';
  const pct = trim2(fraction * 100);
  return ar ? `${pct}% من المكافأة` : `${pct}% of the award`;
}

/** One resignation band rendered as "range: fraction". */
export function resignationBandLine(band: ResignationBand, locale: LocaleCode): string {
  const ar = locale === 'ar';
  const range =
    band.toYears === null
      ? ar
        ? `من ${band.fromYears} سنوات فأكثر`
        : `${band.fromYears} years or more`
      : ar
        ? `من ${band.fromYears} إلى ${band.toYears} سنوات`
        : `from ${band.fromYears} to ${band.toYears} years`;
  return `${range}: ${fractionWords(band.fraction, locale)}`;
}

/** Minimum-service wording for a scenario. */
export function minServiceText(years: number, locale: LocaleCode): string {
  const ar = locale === 'ar';
  if (years <= 0) {
    return ar ? 'لا يوجد حد أدنى نظامي لمدة الخدمة' : 'no statutory minimum service period';
  }
  if (ar) {
    if (years === 1) return 'الحد الأدنى: سنة واحدة من الخدمة';
    if (years === 2) return 'الحد الأدنى: سنتان من الخدمة';
    return `الحد الأدنى: ${years} سنوات من الخدمة`;
  }
  return `minimum: ${years} year${years === 1 ? '' : 's'} of service`;
}

/** Statutory cap wording. */
export function capText(capMonths: number | null, locale: LocaleCode): string {
  const ar = locale === 'ar';
  if (capMonths === null) {
    return ar
      ? 'لا يوجد سقف نظامي لإجمالي المكافأة'
      : 'no statutory cap on the total award';
  }
  return ar
    ? `الحد الأقصى النظامي: ${capMonths} شهرًا من الأجر`
    : `statutory cap: ${capMonths} months of wages`;
}

/** "5 سنوات" / "5 years" with Arabic plural rules. */
export function yearsWord(n: number, locale: LocaleCode): string {
  const r = trim2(n);
  const num = formatNum(r, locale);
  if (locale === 'ar') {
    if (r === 1) return 'سنة واحدة';
    if (r === 2) return 'سنتان';
    if (Number.isInteger(r) && r >= 3 && r <= 10) return `${num} سنوات`;
    return `${num} سنة`;
  }
  return r === 1 ? `${num} year` : `${num} years`;
}

/** Locale-aware number formatting (Latin digits in Arabic, per format.ts). */
export function formatNum(n: number, locale: LocaleCode): string {
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-u-nu-latn' : 'en-US', {
    maximumFractionDigits: 2,
  }).format(trim2(n));
}

export function trim2(n: number): number {
  return Math.round(n * 100) / 100;
}

/** ISO date → localized long date (UTC). */
export function formatDateISO(iso: string, locale: LocaleCode): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-u-nu-latn' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(d);
}

export interface GuideExampleLine {
  yearsInBand: number;
  rateMonthsPerYear: number;
  amount: number;
}

export interface GuideExample {
  wage: number;
  years: number;
  currencyCode: string;
  lines: GuideExampleLine[];
  total: number;
  /** Resignation total when the law reduces resignation awards; null otherwise. */
  resignationTotal: number | null;
  assumptions: EosAssumptionKey[];
}

/**
 * A worked example computed through the real engine (10,000 wage units,
 * 6 years, termination) — so the guide's numbers can never drift from
 * the calculator. Resignation total is shown only where the law reduces it.
 */
export function guideExample(code: GccCountryCode): GuideExample {
  const term = calculateEos({
    code,
    scenario: 'termination',
    wageBasis: 10000,
    serviceYears: 6,
    serviceMonths: 0,
  });
  const resignScenario = EOS_RULES[code].scenarios.find((s) => s.id === 'resignation');
  const reduces =
    resignScenario?.resignationBands?.some((b) => b.fraction < 1 - EPS) ?? false;
  const resign = reduces
    ? calculateEos({
        code,
        scenario: 'resignation',
        wageBasis: 10000,
        serviceYears: 6,
        serviceMonths: 0,
      })
    : null;
  return {
    wage: 10000,
    years: 6,
    currencyCode: term.currencyCode,
    lines: term.tierLines.map((l) => ({
      yearsInBand: l.yearsInBand,
      rateMonthsPerYear: l.rateMonthsPerYear,
      amount: l.amount,
    })),
    total: term.total,
    resignationTotal: resign ? resign.total : null,
    assumptions: term.assumptions,
  };
}

/** Effective dates of the BH/OM transition regimes, formatted per locale. */
export function transitionCutoff(code: 'BH' | 'OM', locale: LocaleCode): string {
  const iso = code === 'BH' ? BH_SIO_EFFECTIVE_DATE : OM_NEW_LAW_EFFECTIVE_DATE;
  return formatDateISO(iso, locale);
}

/**
 * The numeric model behind a guide page — used by the drift test to prove
 * the rendered prose matches the data model exactly.
 */
export function guideNumericModel(code: GccCountryCode) {
  const rules = EOS_RULES[code];
  const term = rules.scenarios.find((s) => s.id === 'termination')!;
  const resign = rules.scenarios.find((s) => s.id === 'resignation')!;
  return {
    tiers: term.tiers.map((t) => ({
      rateMonthsPerYear: t.rateMonthsPerYear,
      upToYears: t.upToYears,
    })),
    resignationBands: (resign.resignationBands ?? []).map((b) => ({
      fromYears: b.fromYears,
      toYears: b.toYears,
      fraction: b.fraction,
    })),
    capMonths: term.capMonths,
    minServiceTermination: term.minServiceYears,
    minServiceResignation: resign.minServiceYears,
    wageBasisKind: rules.wageBasis.kind,
  };
}
