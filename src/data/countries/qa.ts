/**
 * data/countries/qa.ts — Qatar end-of-service rules (Phase 2).
 *
 * Law: Labour Law No. 14 of 2004.
 *
 * Verified figures — read directly from the law's text (Article 54):
 * - Worker with ONE YEAR or more of employment: end-of-service gratuity
 *   "agreed upon by the two parties, provided that it is not less than a
 *   three-week Remuneration for every year of employment."
 * - Pro-rata for fractions of a year.
 * - Basis: the LAST BASIC WAGE.
 * - The employer may deduct amounts the worker owes him.
 * - No statutory cap; no statutory increase after 5 or 10 years.
 * - No resignation reduction: resignation is treated the same as
 *   termination.
 *
 * Note: the tiered 3/4/5/6-week schedule found in some summaries belongs to
 * the REPEALED Labour Law No. 3 of 1962 (Art 24) and does NOT apply under
 * Law 14/2004 — see docs/SOURCES.md.
 *
 * Supporting:
 * - Art 49: indefinite-contract notice — monthly/annual-paid workers:
 *   1 month if service ≤5 years, 2 months if >5 years; other workers:
 *   1 week (<1 yr), 2 weeks (1–5 yrs), 1 month (>5 yrs).
 * - Art 79–81: annual leave — 3 weeks after 1 year of continuous service,
 *   4 weeks after 5 years; payment in lieu of untaken leave on termination.
 *
 * ASSUMPTION (labeled): "three weeks' remuneration" is modeled as 21 days
 * at monthly ÷ 30 (rate 21/30 = 0.7 months per year). The law does not
 * specify the divisor; ÷30 is the standard practice.
 */
import type { CountryEosRules, LegalSource } from '../types.js';

const LAW_EN = 'Labour Law No. 14 of 2004';
const LAW_AR = 'قانون العمل رقم 14 لسنة 2004';

export const QA_SOURCES: LegalSource[] = [
  {
    lawEn: LAW_EN,
    lawAr: LAW_AR,
    article: 'Article 54',
    url: 'https://www.almeezan.qa',
    noteEn:
      'Official legal portal of Qatar (Al Meezan). Minimum: three weeks\u2019 remuneration per year, ≥1 year service, pro-rata fractions, last basic wage basis.',
    noteAr:
      'البوابة القانونية الرسمية لدولة قطر (الميزان). الحد الأدنى: أجر ثلاثة أسابيع عن كل سنة، خدمة سنة فأكثر.',
  },
  {
    lawEn: LAW_EN,
    lawAr: LAW_AR,
    article: 'Articles 49, 79–81',
    url: 'https://www.almeezan.qa',
    noteEn:
      'Art 49: indefinite-contract notice tiers. Art 79–81: 3 weeks\u2019 annual leave after 1 year, 4 weeks after 5 years; pay in lieu on termination.',
    noteAr:
      'المادة 49: مدد الإشعار. المواد 79–81: إجازة سنوية 3 أسابيع بعد سنة و4 أسابيع بعد 5 سنوات؛ وبدل نقدي عند الإنهاء.',
  },
];

/** "Three weeks" expressed in months of wage (ASSUMPTION: ÷30 divisor). */
export const QA_WEEKS_TO_MONTHS = 21 / 30;

export const qa: CountryEosRules = {
  code: 'QA',
  nameEn: 'Qatar',
  nameAr: 'قطر',
  currencyCode: 'QAR',
  currencyEn: 'Qatari Riyal',
  currencyAr: 'الريال القطري',
  wageBasis: {
    kind: 'basic',
    descriptionEn:
      'The gratuity is calculated on the LAST BASIC WAGE — allowances are excluded (Article 54). The parties may agree a higher benefit; the statute sets only the minimum.',
    descriptionAr:
      'تُحسب المكافأة على آخر أجر أساسي — وتُستبعد البدلات (المادة 54). ويجوز للطرفين الاتفاق على مزايا أعلى؛ فالقانون يحدد الحد الأدنى فقط.',
    source: QA_SOURCES[0],
  },
  proRataFractions: true,
  scenarios: [
    {
      id: 'termination',
      labelEn: 'End of service (any reason)',
      labelAr: 'نهاية الخدمة (لأي سبب)',
      minServiceYears: 1,
      tiers: [{ rateMonthsPerYear: QA_WEEKS_TO_MONTHS, upToYears: null }],
      capMonths: null,
      noteEn:
        'Statutory MINIMUM only; contracts often grant more. No cap in the law. Domestic workers follow Law No. 15 of 2017 (same 3-week minimum).',
      noteAr:
        'الحد الأدنى النظامي فقط؛ وغالبًا ما تمنح العقود أكثر. لا سقف في القانون. وعمال الخدمة المنزلية يخضعون للقانون رقم 15 لسنة 2017 (الحد الأدنى نفسه).',
    },
    {
      id: 'resignation',
      labelEn: 'Resignation',
      labelAr: 'الاستقالة',
      minServiceYears: 1,
      tiers: [{ rateMonthsPerYear: QA_WEEKS_TO_MONTHS, upToYears: null }],
      resignationBands: [{ fromYears: 1, toYears: null, fraction: 1 }],
      capMonths: null,
      noteEn: 'No statutory reduction for resignation.',
      noteAr: 'لا يوجد تخفيض نظامي للاستقالة.',
    },
  ],
  payoutEn:
    'Gratuity is due at the date of termination, plus payment in lieu of untaken annual leave (Articles 54, 81). The employer may deduct amounts the worker owes him.',
  payoutAr:
    'تُستحق المكافأة بتاريخ الإنهاء، مضافًا إليها البدل النقدي عن الإجازة السنوية غير المستخدمة (المادتان 54 و81). ويجوز لصاحب العمل خصم ما يكون مستحقًا له على العامل.',
  sources: QA_SOURCES,
};
