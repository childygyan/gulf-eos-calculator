/**
 * data/countries/kw.ts — Kuwait end-of-service rules (Phase 2).
 *
 * Law: Law No. 6 of 2010 Regarding Labor in the Private Sector
 * (Official Gazette Issue No. 963, 21 Feb 2010).
 *
 * Verified figures — read directly from the law's English text:
 * - Art 51(B) (monthly-paid workers): 15 days' remuneration per year for
 *   the first five years, one month's remuneration per year after; total
 *   not to exceed 1.5 years' remuneration; pro-rata for fractions of a year;
 *   debts/loans deducted; social-insurance offset.
 * - Art 52: FULL benefit when the employer terminates, a fixed-term contract
 *   expires without renewal, the contract ends under Arts 48–50, or a female
 *   worker terminates due to marriage within a year.
 * - Art 53 (resignation, worker's own termination of an INDEFINITE contract):
 *   3–5 yrs → 1/2; 5–10 yrs → 2/3; ≥10 yrs → full. (Below 3 years: no benefit.)
 * - Art 55: "wage" = basic wage plus all elements stipulated in the contract
 *   or employer's regulations (periodic bonuses, allowances, grants,
 *   monetary privileges).
 * - Art 62: dues computed on the LAST WAGE disbursed.
 * - Art 44: notice — 3 months (monthly-paid), 1 month (other workers).
 * - Art 70/73: 30 days' fully paid annual leave; no leave in the first year
 *   until 9 months; pro-rata; cash offset for unused leave on termination.
 *
 * ASSUMPTION (labeled): the 15-day tier uses a daily wage of monthly ÷ 26
 * (Kuwait working-days convention — weekly rest days excluded, per the
 * working-days divisor rule in the law; matches the published worked
 * example cited in docs/SOURCES.md).
 */
import type { CountryEosRules, LegalSource } from '../types.js';

const LAW_EN = 'Law No. 6 of 2010 Regarding Labor in the Private Sector';
const LAW_AR = 'القانون رقم 6 لسنة 2010 بشأن العمل في القطاع الأهلي';
const OFFICIAL_TRANSLATION_URL =
  'https://kuvait.mfa.gov.hu/storage/9bd1c388-b8b2-403e-af8c-223140c48e93/attachments/710342befe7a314fd2c809bf2a9ec32a.pdf';

export const KW_SOURCES: LegalSource[] = [
  {
    lawEn: LAW_EN,
    lawAr: LAW_AR,
    article: 'Articles 51, 52, 53',
    url: OFFICIAL_TRANSLATION_URL,
    noteEn:
      'English translation of the official law text. Art 51(B): 15 days/year (first 5 yrs), 1 month/year after, 1.5-year cap. Art 52: full benefit cases. Art 53: resignation fractions on indefinite contracts.',
    noteAr:
      'الترجمة الإنجليزية للنص الرسمي. المادة 51(ب): 15 يومًا/سنة (أول 5 سنوات)، وشهر/سنة بعدها، وسقف سنة ونصف.',
  },
  {
    lawEn: LAW_EN,
    lawAr: LAW_AR,
    article: 'Articles 55, 62',
    url: OFFICIAL_TRANSLATION_URL,
    noteEn:
      'Art 55: wage includes basic + contractual allowances/bonuses. Art 62: dues computed on the last wage disbursed.',
    noteAr:
      'المادة 55: الأجر يشمل الأساسي والبدلات/المكافآت التعاقدية. المادة 62: تُحسب المستحقات على آخر أجر.',
  },
  {
    lawEn: LAW_EN,
    lawAr: LAW_AR,
    article: 'Articles 44, 70, 73',
    url: OFFICIAL_TRANSLATION_URL,
    noteEn:
      'Art 44: 3 months\u2019 notice (monthly-paid), 1 month (others). Art 70: 30 days\u2019 annual leave (none before 9 months in year one). Art 73: cash offset for unused leave on termination.',
    noteAr:
      'المادة 44: إشعار 3 أشهر (شهري الأجر) وشهر (غيرهم). المادة 70: إجازة سنوية 30 يومًا. المادة 73: بدل نقدي عن الإجازة غير المستخدمة عند الإنهاء.',
  },
];

/** Daily wage divisor for the 15-day tier (Kuwait working-days convention). */
export const KW_DAILY_DIVISOR = 26;

export const kw: CountryEosRules = {
  code: 'KW',
  nameEn: 'Kuwait',
  nameAr: 'الكويت',
  currencyCode: 'KWD',
  currencyEn: 'Kuwaiti Dinar',
  currencyAr: 'الدينار الكويتي',
  wageBasis: {
    kind: 'total-wage',
    descriptionEn:
      'The benefit is computed on the LAST WAGE — basic wage plus all contract/regulation elements: periodic bonuses, allowances, grants, donations and monetary privileges (Articles 55, 62).',
    descriptionAr:
      'تُحسب المكافأة على آخر أجر — الأساسي مضافًا إليه كل عناصر العقد أو لائحة صاحب العمل: المكافآت والبدلات الدورية والمنح والمزايا النقدية (المادتان 55 و62).',
    source: KW_SOURCES[1],
  },
  proRataFractions: true,
  scenarios: [
    {
      id: 'termination',
      labelEn: 'Termination by employer / fixed-term expiry',
      labelAr: 'إنهاء صاحب العمل / انتهاء العقد محدد المدة',
      minServiceYears: 0,
      tiers: [
        // ASSUMPTION: 15 days at monthly ÷ 26 (Kuwait working-days convention).
        { rateMonthsPerYear: 15 / KW_DAILY_DIVISOR, upToYears: 5 },
        { rateMonthsPerYear: 1.0, upToYears: null },
      ],
      capMonths: 18,
      noteEn:
        'Full benefit in the Article 52 cases (employer termination, unrenewed fixed-term expiry, Arts 48–50, marriage termination within a year). Employer pays the net difference after the social-insurance offset.',
      noteAr:
        'المكافأة كاملة في حالات المادة 52. ويدفع صاحب العمل الفرق الصافي بعد خصم التأمينات الاجتماعية.',
    },
    {
      id: 'resignation',
      labelEn: 'Resignation (indefinite contract)',
      labelAr: 'الاستقالة (عقد غير محدد المدة)',
      minServiceYears: 3,
      tiers: [
        { rateMonthsPerYear: 15 / KW_DAILY_DIVISOR, upToYears: 5 },
        { rateMonthsPerYear: 1.0, upToYears: null },
      ],
      resignationBands: [
        { fromYears: 3, toYears: 5, fraction: 1 / 2 },
        { fromYears: 5, toYears: 10, fraction: 2 / 3 },
        { fromYears: 10, toYears: null, fraction: 1 },
      ],
      capMonths: 18,
      noteEn:
        'Article 53 applies to the worker\u2019s own termination of an INDEFINITE contract: under 3 years\u2019 service → no benefit.',
      noteAr: 'تنطبق المادة 53 على إنهاء العامل لعقد غير محدد المدة بنفسه: خدمة أقل من 3 سنوات ← لا مكافأة.',
    },
  ],
  payoutEn:
    'On termination the worker also gets a cash offset for all unused annual leave (Article 73). Debts/loans owed to the employer are deducted from the benefit.',
  payoutAr:
    'يستحق العامل عند الإنهاء بدلًا نقديًا عن كامل رصيد إجازته السنوية غير المستخدمة (المادة 73). وتُخصم الديون والقروض المستحقة لصاحب العمل من المكافأة.',
  sources: KW_SOURCES,
};
