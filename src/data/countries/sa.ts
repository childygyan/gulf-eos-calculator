/**
 * data/countries/sa.ts — Saudi Arabia end-of-service rules (Phase 2).
 *
 * Law: Labor Law promulgated by Royal Decree No. M/51 of 23/8/1426H
 * (27 Sep 2005), as amended; the 2024 amendments (Council of Ministers,
 * effective 18–19 Feb 2025) did NOT change Articles 84–87 — see
 * docs/SOURCES.md.
 *
 * Verified figures (official texts):
 * - Art 84: half a month's wage per year for the first five years, one
 *   month's wage per year after; on the last wage; pro-rata for fractions.
 * - Art 85 (resignation): <2 yrs → nothing; 2–5 yrs → 1/3; 5–10 yrs → 2/3;
 *   ≥10 yrs → full.
 * - Art 86: the wage basis may contractually exclude commissions / sales
 *   percentages / similar variable components.
 * - Art 87: full award on force majeure; full award for a female worker who
 *   ends her contract within 6 months of marriage or 3 months of childbirth.
 * - Art 88: employer settles entitlements within 1 week (2 weeks if the
 *   worker ended the contract).
 * - Art 109: annual leave 21 days/year, 30 days after 5 consecutive years.
 * - Art 75 (as amended, effective Feb 2025): indefinite-contract notice —
 *   30 days by the employee, 60 days by the employer. (Non-Saudi employees
 *   work on fixed-term contracts: resignation on 30 days' notice.)
 */
import type { CountryEosRules, LegalSource } from '../types.js';

const LAW_EN = 'Labor Law (Royal Decree No. M/51 of 23/8/1426H)';
const LAW_AR = 'نظام العمل (المرسوم الملكي رقم م/51 وتاريخ 23/8/1426هـ)';
const OFFICIAL_TEXT_URL =
  'https://laws.boe.gov.sa/Files/Download/?attId=704cf56e-eb7a-4ddb-8c28-adbb01244dc6';

export const SA_SOURCES: LegalSource[] = [
  {
    lawEn: LAW_EN,
    lawAr: LAW_AR,
    article: 'Articles 84, 85, 86, 87',
    url: OFFICIAL_TEXT_URL,
    noteEn: 'Official English translation via the Saudi Bureau of Experts (laws.boe.gov.sa).',
    noteAr: 'النص الإنجليزي الرسمي عبر هيئة الخبراء بمجلس الوزراء.',
  },
  {
    lawEn: LAW_EN,
    lawAr: LAW_AR,
    article: 'Article 88',
    url: OFFICIAL_TEXT_URL,
    noteEn: 'Settlement deadline: one week (two weeks if the worker ended the contract).',
    noteAr: 'مهلة التصفية: أسبوع (أسبوعان إذا أنهى العامل العقد).',
  },
  {
    lawEn: LAW_EN,
    lawAr: LAW_AR,
    article: 'Article 109',
    url: OFFICIAL_TEXT_URL,
    noteEn: 'Annual leave: 21 days per year, 30 days after five consecutive years with the same employer.',
    noteAr: 'الإجازة السنوية: 21 يومًا في السنة، و30 يومًا بعد خمس سنوات متتالية لدى صاحب العمل نفسه.',
  },
  {
    lawEn: LAW_EN + ' (2024 amendments, effective Feb 2025)',
    lawAr: LAW_AR + ' (تعديلات 2024، سارية من فبراير 2025)',
    article: 'Article 75',
    url: 'https://www.wtwco.com/en-in/insights/2024/08/saudi-arabia-labor-reforms-for-both-foreign-and-local-workers',
    noteEn:
      'Amendment summary (WTW): indefinite-contract notice is 30 days by the employee, 60 days by the employer; fixed-term resignation on 30 days\u2019 notice.',
    noteAr:
      'ملخص التعديلات: الإشعار في العقد غير المحدد المدة 30 يومًا من العامل و60 يومًا من صاحب العمل؛ والاستقالة في العقد محدد المدة بإشعار 30 يومًا.',
  },
];

export const sa: CountryEosRules = {
  code: 'SA',
  nameEn: 'Saudi Arabia',
  nameAr: 'السعودية',
  currencyCode: 'SAR',
  currencyEn: 'Saudi Riyal',
  currencyAr: 'الريال السعودي',
  wageBasis: {
    kind: 'total-wage',
    descriptionEn:
      'The award is calculated on the LAST WAGE — in MHRSD/HRSD practice this is the basic salary plus regular allowances. Variable components (commissions, sales percentages) may be excluded ONLY if the contract validly says so (Article 86).',
    descriptionAr:
      'تُحسب المكافأة على أساس الأجر الأخير — ويُقصد به عمليًا الراتب الأساسي مضافًا إليه البدلات المنتظمة. ولا تُستبعد المكونات المتغيرة (العمولات ونسب المبيعات) إلا إذا نص العقد على ذلك (المادة 86).',
    source: SA_SOURCES[0],
  },
  proRataFractions: true,
  scenarios: [
    {
      id: 'termination',
      labelEn: 'Termination by employer / contract expiry',
      labelAr: 'إنهاء صاحب العمل للعقد / انتهاء مدته',
      minServiceYears: 0,
      tiers: [
        { rateMonthsPerYear: 0.5, upToYears: 5 },
        { rateMonthsPerYear: 1.0, upToYears: null },
      ],
      capMonths: null,
      noteEn:
        'No statutory cap. Same award on contract expiry and on employer termination (Article 84).',
      noteAr: 'لا يوجد سقف نظامي. وتُستحق المكافأة نفسها عند انتهاء مدة العقد وعند إنهاء صاحب العمل له (المادة 84).',
    },
    {
      id: 'resignation',
      labelEn: 'Resignation',
      labelAr: 'الاستقالة',
      minServiceYears: 2,
      tiers: [
        { rateMonthsPerYear: 0.5, upToYears: 5 },
        { rateMonthsPerYear: 1.0, upToYears: null },
      ],
      resignationBands: [
        { fromYears: 2, toYears: 5, fraction: 1 / 3 },
        { fromYears: 5, toYears: 10, fraction: 2 / 3 },
        { fromYears: 10, toYears: null, fraction: 1 },
      ],
      capMonths: null,
      noteEn:
        'Resignation with under 2 years\u2019 service: no award (Article 85). Exception (Article 87): full award on force majeure, or for a female worker ending her contract within 6 months of marriage or 3 months of childbirth.',
      noteAr:
        'الاستقالة بخدمة أقل من سنتين: لا مكافأة (المادة 85). استثناء (المادة 87): المكافأة كاملة عند القوة القاهرة، أو للعاملة التي تنهي عقدها خلال 6 أشهر من زواجها أو 3 أشهر من وضعها.',
    },
  ],
  payoutEn:
    'The employer must pay wages and settle all entitlements within one week of the end of the contractual relation — two weeks if the worker ended the contract (Article 88).',
  payoutAr:
    'يلتزم صاحب العمل بدفع الأجور وتصفية جميع المستحقات خلال أسبوع من تاريخ انتهاء العلاقة التعاقدية — وأسبوعين إذا أنهى العامل العقد (المادة 88).',
  sources: SA_SOURCES,
};
