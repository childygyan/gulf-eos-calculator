/**
 * data/countries/ae.ts — UAE end-of-service rules (Phase 2).
 *
 * Law: Federal Decree-Law No. 33 of 2021 Regulating Labour Relations
 * (effective 2 Feb 2022; repealed Federal Law No. 8 of 1980).
 *
 * Verified figures (official consolidated text, Article 51):
 * - Foreign full-time worker with ≥1 year continuous service: 21 days'
 *   remuneration per year for the first five years, 30 days per year after.
 * - Pro-rata for fractions of a year once one full year is complete.
 * - Basis: the LAST BASIC SALARY (allowances excluded).
 * - Cap: the gratuity shall not in its entirety exceed two years'
 *   remuneration.
 * - Deductions only for amounts due legally or by judicial ruling.
 * - UAE nationals fall under pensions/social security legislation instead.
 * - NO resignation reduction under the current law (the old 1980-law
 *   limited/unlimited-contract reductions were abolished in 2022).
 *
 * Supporting:
 * - Art 29: annual leave — 30 days/year after 1 year; 2 days/month for
 *   service between 6 months and 1 year.
 * - Art 43: notice 30–90 days as agreed in the contract.
 * - Art 53: entitlements paid within 14 days of termination.
 */
import type { CountryEosRules, LegalSource } from '../types.js';

const LAW_EN = 'Federal Decree-Law No. 33 of 2021 Regulating Labour Relations';
const LAW_AR = 'المرسوم بقانون اتحادي رقم 33 لسنة 2021 بشأن تنظيم علاقات العمل';

export const AE_SOURCES: LegalSource[] = [
  {
    lawEn: LAW_EN,
    lawAr: LAW_AR,
    article: 'Article 51 (paras 2–7)',
    url: 'https://elaws.gov.ae',
    noteEn:
      'Official UAE legislation portal (UAE Official Gazette). Figures verified against the consolidated law text: 21 days/year (first 5 years), 30 days/year after, on the last basic salary, pro-rata fractions, 2-year cap.',
    noteAr:
      'البوابة الرسمية للتشريعات الإماراتية (الجريدة الرسمية). تم التحقق من الأرقام مقابل النص الموحد للقانون.',
  },
  {
    lawEn: LAW_EN,
    lawAr: LAW_AR,
    article: 'Articles 29, 43, 53',
    url: 'https://elaws.gov.ae',
    noteEn:
      'Art 29: 30 days annual leave after 1 year (2 days/month for 6–12 months). Art 43: 30–90 days notice. Art 53: entitlements paid within 14 days.',
    noteAr:
      'المادة 29: إجازة سنوية 30 يومًا بعد سنة (يومان شهريًا لخدمة 6–12 شهرًا). المادة 43: إشعار 30–90 يومًا. المادة 53: صرف المستحقات خلال 14 يومًا.',
  },
];

export const ae: CountryEosRules = {
  code: 'AE',
  nameEn: 'United Arab Emirates',
  nameAr: 'الإمارات العربية المتحدة',
  currencyCode: 'AED',
  currencyEn: 'UAE Dirham',
  currencyAr: 'الدرهم الإماراتي',
  wageBasis: {
    kind: 'basic',
    descriptionEn:
      'Gratuity is calculated on the BASIC SALARY ONLY — housing, transport and other allowances are excluded (Article 51). The law uses "days of basic wage"; the standard divisor is 30 (daily wage = monthly basic ÷ 30).',
    descriptionAr:
      'تُحسب المكافأة على الراتب الأساسي فقط — وتُستبعد بدلات السكن والنقل وغيرها (المادة 51). ويُستخدم القاسم 30 لحساب الأجر اليومي (الأساسي الشهري ÷ 30).',
    source: AE_SOURCES[0],
  },
  proRataFractions: true,
  scenarios: [
    {
      id: 'termination',
      labelEn: 'End of service (any reason)',
      labelAr: 'نهاية الخدمة (لأي سبب)',
      minServiceYears: 1,
      tiers: [
        { rateMonthsPerYear: 21 / 30, upToYears: 5 },
        { rateMonthsPerYear: 30 / 30, upToYears: null },
      ],
      capMonths: 24,
      noteEn:
        'Under one year of service: no gratuity. The 1980 law\u2019s limited/unlimited-contract resignation reductions were abolished in 2022 — resignation is treated the same as termination.',
      noteAr:
        'خدمة أقل من سنة: لا مكافأة. أُلغيت تخفيضات الاستقالة الخاصة بعقود 1980 المحددة/غير المحددة في 2022 — وتُعامل الاستقالة كالإنهاء.',
    },
    {
      id: 'resignation',
      labelEn: 'Resignation',
      labelAr: 'الاستقالة',
      minServiceYears: 1,
      tiers: [
        { rateMonthsPerYear: 21 / 30, upToYears: 5 },
        { rateMonthsPerYear: 30 / 30, upToYears: null },
      ],
      resignationBands: [{ fromYears: 1, toYears: null, fraction: 1 }],
      capMonths: 24,
      noteEn: 'No statutory reduction for resignation under Decree-Law 33/2021.',
      noteAr: 'لا يوجد تخفيض نظامي للاستقالة بموجب المرسوم بقانون 33/2021.',
    },
  ],
  payoutEn:
    'All end-of-service entitlements must be paid within 14 days of the contract\u2019s termination (Article 53). Scope: private-sector mainland; DIFC/ADGM and domestic workers follow separate regimes.',
  payoutAr:
    'يجب صرف جميع مستحقات نهاية الخدمة خلال 14 يومًا من إنهاء العقد (المادة 53). النطاق: القطاع الخاص في البر الرئيسي؛ ومركز دبي المالي وسوق أبوظبي العالمي وعمال الخدمة المنزلية لهم أنظمة منفصلة.',
  sources: AE_SOURCES,
};
