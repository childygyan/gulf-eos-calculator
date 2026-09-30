/**
 * data/countries/om.ts — Oman end-of-service rules (Phase 2).
 *
 * Law: Royal Decree No. 53/2023 promulgating the Labour Law
 * (issued 24 July 2023; Ministry of Labour treats 31 July 2023 as the
 * effective date for gratuity purposes).
 *
 * Verified figures — Article 61 of RD 53/2023 (law text):
 * - The employer pays workers NOT covered by the Social Protection Law a
 *   gratuity for the period of service "not less than the basic wage for
 *   each year of his service."
 * - Pro-rata for fractions of a year; the LAST BASIC WAGE is the basis.
 * - Service that began before the law's entry into force counts.
 * - Article 61 applies until the savings system under the Social Protection
 *   Law comes into force (then contributions replace accrual).
 *
 * Transition (Ministry of Labour clarifications, reported by Muscat Daily
 * and Oman Observer):
 * - Service BEFORE the new law's effect: OLD formula (RD 35/2003, Art 39) —
 *   15 days' basic wage per year for the first three years, one month's
 *   basic wage per year after.
 * - Service AFTER 31 July 2023: ONE MONTH'S BASIC WAGE per year from the
 *   first year.
 * AMBIGUITY (see docs/SOURCES.md): one MoL-era report splits by service
 * period (effective date); a later circular report splits by contract-
 * conclusion date. Modeled here on the effective-date split with the MoL
 * worked example.
 *
 * Supporting:
 * - Art 38: indefinite-contract notice — 30 days (monthly-paid), 15 days
 *   (other workers); longer notice may be agreed.
 * - Art 78: annual leave with full wage, ≥30 days/year, not before 6 months
 *   from joining; Art 81: full wage for the leave balance if service ends.
 * - Resignation: no statutory reduction — same as termination.
 *
 * ASSUMPTION (labeled): the old-law 15-day tier uses monthly ÷ 30.
 */
import type { CountryEosRules, LegalSource } from '../types.js';

const LAW_EN = 'Royal Decree No. 53/2023 promulgating the Labour Law';
const LAW_AR = 'المرسوم السلطاني رقم 53/2023 بإصدار قانون العمل';
const OLD_LAW_EN = 'Labour Law (Royal Decree No. 35/2003)';
const OLD_LAW_AR = 'قانون العمل (المرسوم السلطاني رقم 35/2003)';
const OFFICIAL_TEXT_URL = 'https://qanoon.om/p/2023/rd2023053/';

export const OM_SOURCES: LegalSource[] = [
  {
    lawEn: LAW_EN,
    lawAr: LAW_AR,
    article: 'Article 61',
    url: OFFICIAL_TEXT_URL,
    noteEn:
      'Official law text (qanoon.om): not less than the basic wage per year, pro-rata fractions, last basic wage basis, pre-law service counted; applies until the savings system starts.',
    noteAr:
      'النص الرسمي (قانون عمان): لا تقل عن الأجر الأساسي عن كل سنة خدمة، مع التناسب للكسور، وعلى أساس آخر أجر أساسي.',
  },
  {
    lawEn: OLD_LAW_EN,
    lawAr: OLD_LAW_AR,
    article: 'Article 39 (old formula, per MoL clarification)',
    url: 'https://www.muscatdaily.com/2024/10/23/mol-clarifies-gratuity-calculation-for-expats-in-oman/',
    noteEn:
      'MoL clarification (reported by Muscat Daily, Oct 2024): service under the previous law keeps the old formula — 15 days\u2019 basic per year for the first three years, one month per year after. Worked example: 2 years pre-law at half a month/year + post-law at one month/year.',
    noteAr:
      'توضيح وزارة العمل: الخدمة في ظل القانون السابق تحتفظ بالمعادلة القديمة — 15 يومًا من الأساسي سنويًا لأول 3 سنوات وشهر بعدها.',
  },
  {
    lawEn: LAW_EN,
    lawAr: LAW_AR,
    article: 'Articles 38, 78, 81',
    url: OFFICIAL_TEXT_URL,
    noteEn:
      'Art 38: 30 days\u2019 notice (monthly-paid), 15 days (others). Art 78: ≥30 days\u2019 annual leave after 6 months. Art 81: full wage for the leave balance on termination.',
    noteAr:
      'المادة 38: إشعار 30 يومًا (شهري الأجر) و15 يومًا (غيرهم). المادة 78: إجازة سنوية لا تقل عن 30 يومًا بعد 6 أشهر.',
  },
];

/** Effective date of the new-law gratuity regime (per MoL). */
export const OM_NEW_LAW_EFFECTIVE_DATE = '2023-07-31';

/** Old-law (RD 35/2003, Art 39) tiers for pre-transition service. */
export const OM_OLD_TIERS = [
  // ASSUMPTION: 15 days at monthly ÷ 30.
  { rateMonthsPerYear: 15 / 30, upToYears: 3 },
  { rateMonthsPerYear: 1.0, upToYears: null },
] as const;

export const om: CountryEosRules = {
  code: 'OM',
  nameEn: 'Oman',
  nameAr: 'عُمان',
  currencyCode: 'OMR',
  currencyEn: 'Omani Rial',
  currencyAr: 'الريال العُماني',
  wageBasis: {
    kind: 'basic',
    descriptionEn:
      'The gratuity is calculated on the LAST BASIC WAGE — allowances excluded (Article 61). The statute sets a minimum ("not less than"); contracts may grant more.',
    descriptionAr:
      'تُحسب المكافأة على آخر أجر أساسي — وتُستبعد البدلات (المادة 61). والقانون يحدد الحد الأدنى ("لا تقل عن")؛ ويجوز للعقود منح المزيد.',
    source: OM_SOURCES[0],
  },
  proRataFractions: true,
  scenarios: [
    {
      id: 'termination',
      labelEn: 'End of service (any reason)',
      labelAr: 'نهاية الخدمة (لأي سبب)',
      minServiceYears: 0,
      tiers: [{ rateMonthsPerYear: 1.0, upToYears: null }],
      capMonths: null,
      noteEn:
        'Current regime: one month\u2019s basic wage per year from the first year. For service that began before 31 July 2023, the old tiers (15 days/year for the first 3 years, then 1 month/year) apply to the pre-transition portion — see transition notes; the two portions are added.',
      noteAr:
        'النظام الحالي: شهر من الأجر الأساسي عن كل سنة من السنة الأولى. وللخدمة التي بدأت قبل 31 يوليو 2023 تُطبق شرائح القانون القديم على الجزء السابق للتحول.',
    },
    {
      id: 'resignation',
      labelEn: 'Resignation',
      labelAr: 'الاستقالة',
      minServiceYears: 0,
      tiers: [{ rateMonthsPerYear: 1.0, upToYears: null }],
      resignationBands: [{ fromYears: 0, toYears: null, fraction: 1 }],
      capMonths: null,
      noteEn: 'No statutory reduction for resignation.',
      noteAr: 'لا يوجد تخفيض نظامي للاستقالة.',
    },
  ],
  transition: {
    cutoffDate: OM_NEW_LAW_EFFECTIVE_DATE,
    descriptionEn:
      'Service before 31 July 2023: old formula — 15 days\u2019 basic wage per year for the first three years of that period, one month\u2019s basic wage per year after. Service from 31 July 2023: one month\u2019s basic wage per year. The two portions are calculated separately on the worker\u2019s last basic wage and added.',
    descriptionAr:
      'الخدمة قبل 31 يوليو 2023: المعادلة القديمة — 15 يومًا من الأساسي سنويًا لأول 3 سنوات ثم شهر سنويًا. والخدمة من 31 يوليو 2023: شهر من الأساسي سنويًا. ويُحسب الجزآن منفصلين على آخر أجر أساسي ثم يُجمعان.',
    source: OM_SOURCES[1],
  },
  payoutEn:
    'The gratuity is paid on termination of the employment relationship. Once the savings system under the Social Protection Law is enforced, employers will transition accrued gratuity into it (or settle it directly) — the employer may already settle pre-savings-system rights at the basic wage on the settlement date.',
  payoutAr:
    'تُصرف المكافأة عند إنهاء علاقة العمل. وبمجرد نفاذ نظام الادخار بموجب قانون الحماية الاجتماعية سينقل أصحاب العمل المستحقات إليه (أو يصفونها مباشرة).',
  sources: OM_SOURCES,
};
