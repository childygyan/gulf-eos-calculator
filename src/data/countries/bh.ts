/**
 * data/countries/bh.ts — Bahrain end-of-service rules (Phase 2).
 *
 * Laws: Labour Law No. 36 of 2012 (Article 116) + Edict No. 109 of 2023
 * (Social Insurance Organisation reform, effective 1 March 2024).
 *
 * Verified figures:
 * - Art 116 (Law 36/2012): a worker not subject to the Social Insurance
 *   Law is entitled, on termination, to a leaving indemnity of HALF A
 *   MONTH'S WAGE for each of the first THREE years and ONE MONTH'S WAGE
 *   for each following year; pro-rata for fractions of a year.
 * - Basis: the most recent BASIC WAGE plus the SOCIAL ALLOWANCE, if any
 *   (per the SIO; Article 47 of the Labour Law).
 * - NO statutory reduction for resignation — the law pays the same
 *   indemnity on resignation as on termination. (Some blogs claim a 50%
 *   resignation cut; it is NOT in Article 116 — see docs/SOURCES.md.)
 * - Edict 109/2023 (effective 1 March 2024, per the official SIO page):
 *   for expatriate private-sector employees covered by the employment-
 *   injuries insurance branch, the employer now pays a MONTHLY SIO
 *   subscription of 4.2% of monthly wages for each of the first three
 *   years of service and 8.4% for subsequent years. The worker claims the
 *   gratuity for that period from the SIO directly (lump sum at end of
 *   employment). Service BEFORE 1 March 2024 is still owed directly by
 *   the employer under Article 116.
 *
 * Supporting:
 * - Art 99: 30 days' notice for termination.
 * - Annual leave: 30 days on full pay after 1 year of service (2.5 days/month).
 */
import type { CountryEosRules, LegalSource } from '../types.js';

const LAW_EN = 'Labour Law No. 36 of 2012';
const LAW_AR = 'قانون العمل رقم 36 لسنة 2012';
const EDICT_EN = 'Edict No. 109 of 2023 (SIO end-of-service reform)';
const EDICT_AR = 'المرسوم رقم 109 لسنة 2023 (إصلاح مكافأة نهاية الخدمة لدى التأمينات)';

export const BH_SOURCES: LegalSource[] = [
  {
    lawEn: LAW_EN,
    lawAr: LAW_AR,
    article: 'Article 116',
    url: 'https://www.sio.gov.bh/en/end-of-service-gratuity-for-non-bahrainis',
    noteEn:
      'Formula verified against the law text: half a month/year (first 3 years), one month/year after, pro-rata fractions. The SIO page states the wage basis: basic salary + social allowance, on the last wages.',
    noteAr:
      'تم التحقق من المعادلة مقابل نص القانون: نصف شهر/سنة (أول 3 سنوات)، وشهر/سنة بعدها، مع التناسب للكسور.',
  },
  {
    lawEn: EDICT_EN,
    lawAr: EDICT_AR,
    article: 'Effective 1 March 2024',
    url: 'https://www.sio.gov.bh/en/end-of-service-gratuity-for-non-bahrainis',
    noteEn:
      'Official SIO page: 4.2% of monthly wages for the first three years, 8.4% after; worker claims from SIO. Pre-March-2024 service remains the employer\u2019s liability under Article 116.',
    noteAr:
      'صفحة التأمينات الرسمية: 4.2% من الأجر الشهري لأول 3 سنوات و8.4% بعدها؛ ويطالب العامل التأمينات. والخدمة قبل مارس 2024 تبقى على صاحب العمل.',
  },
  {
    lawEn: LAW_EN,
    lawAr: LAW_AR,
    article: 'Article 99',
    url: 'https://www.sio.gov.bh/en/end-of-service-gratuity-for-non-bahrainis',
    noteEn: '30 days\u2019 notice for termination.',
    noteAr: 'إشعار الإنهاء 30 يومًا.',
  },
];

/** SIO monthly subscription rates on the worker's monthly wages. */
export const BH_SIO_RATES = {
  /** First three years of service. */
  firstThreeYears: 0.042,
  /** Subsequent years. */
  afterThreeYears: 0.084,
} as const;

/** Date the SIO fund system took effect. */
export const BH_SIO_EFFECTIVE_DATE = '2024-03-01';

export const bh: CountryEosRules = {
  code: 'BH',
  nameEn: 'Bahrain',
  nameAr: 'البحرين',
  currencyCode: 'BHD',
  currencyEn: 'Bahraini Dinar',
  currencyAr: 'الدينار البحريني',
  wageBasis: {
    kind: 'basic-plus-social-allowance',
    descriptionEn:
      'The indemnity is calculated on the most recent BASIC WAGE plus the SOCIAL ALLOWANCE, if any (Labour Law Article 47; confirmed by the SIO). Other allowances (housing, transport) are excluded.',
    descriptionAr:
      'تُحسب المكافأة على آخر أجر أساسي مضافًا إليه علاوة السكن الاجتماعية إن وجدت (المادة 47؛ وأكدتها التأمينات). وتُستبعد البدلات الأخرى (السكن والنقل).',
    source: BH_SOURCES[0],
  },
  proRataFractions: true,
  scenarios: [
    {
      id: 'termination',
      labelEn: 'End of service (any reason)',
      labelAr: 'نهاية الخدمة (لأي سبب)',
      minServiceYears: 0,
      tiers: [
        { rateMonthsPerYear: 0.5, upToYears: 3 },
        { rateMonthsPerYear: 1.0, upToYears: null },
      ],
      capMonths: null,
      noteEn:
        'The underlying formula is unchanged; since 1 March 2024 only WHO PAYS changed (SIO fund vs employer) — see payout notes.',
      noteAr:
        'المعادلة نفسها لم تتغير؛ ومنذ 1 مارس 2024 تغيرت جهة الصرف فقط (صندوق التأمينات مقابل صاحب العمل).',
    },
    {
      id: 'resignation',
      labelEn: 'Resignation',
      labelAr: 'الاستقالة',
      minServiceYears: 0,
      tiers: [
        { rateMonthsPerYear: 0.5, upToYears: 3 },
        { rateMonthsPerYear: 1.0, upToYears: null },
      ],
      resignationBands: [{ fromYears: 0, toYears: null, fraction: 1 }],
      capMonths: null,
      noteEn: 'No statutory reduction for resignation under Article 116.',
      noteAr: 'لا يوجد تخفيض نظامي للاستقالة بموجب المادة 116.',
    },
  ],
  transition: {
    cutoffDate: BH_SIO_EFFECTIVE_DATE,
    descriptionEn:
      'Service before 1 March 2024: the employer owes the Article 116 indemnity directly (lump sum on leaving). Service from 1 March 2024: the employer pays monthly SIO subscriptions (4.2% of monthly wages for the first three years of service, 8.4% after) and the worker claims the gratuity from the SIO. Workers leaving now typically claim TWO amounts from two places.',
    descriptionAr:
      'الخدمة قبل 1 مارس 2024: يدفع صاحب العمل مكافأة المادة 116 مباشرة (دفعة واحدة عند المغادرة). والخدمة من 1 مارس 2024: يسدد صاحب العمل اشتراكات شهرية للتأمينات (4.2% من الأجر الشهري لأول 3 سنوات خدمة، و8.4% بعدها) ويطالب العامل التأمينات بالمكافأة.',
    source: BH_SOURCES[1],
  },
  payoutEn:
    'Gratuity is a lump sum paid at the end of employment. For post-1-March-2024 service the worker applies to the Social Insurance Organisation (no application charges). Scope: expatriate private-sector employees covered by the employment-injuries insurance branch; Bahraini employees fall under the pension system.',
  payoutAr:
    'تُصرف المكافأة دفعة واحدة عند نهاية الخدمة. وعن الخدمة اللاحقة لـ1 مارس 2024 يتقدم العامل بطلب إلى الهيئة العامة للتأمين الاجتماعي (بلا رسوم). النطاق: العمالة الوافدة بالقطاع الخاص المشمولة بفرع التأمين ضد إصابات العمل؛ والبحرينيون يخضعون لنظام التقاعد.',
  sources: BH_SOURCES,
};
