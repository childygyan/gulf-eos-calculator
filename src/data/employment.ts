/**
 * data/employment.ts — notice periods and annual leave per GCC country
 * (Phase 2, supporting data). Figures verified against the labor laws;
 * see docs/SOURCES.md for the article-level citations.
 */
import type { GccCountryCode } from './types.js';

export interface NoticePeriod {
  /** Notice the employee must give (days). */
  employeeDays: number;
  /** Notice the employer must give (days). */
  employerDays: number;
  /** When this notice applies, e.g. "indefinite contracts". */
  appliesToEn: string;
  appliesToAr: string;
  noteEn?: string;
  noteAr?: string;
}

export interface AnnualLeave {
  /** Paid annual leave days per year (the general statutory figure). */
  daysPerYear: number;
  eligibilityEn: string;
  eligibilityAr: string;
  noteEn?: string;
  noteAr?: string;
}

export interface EmploymentTerms {
  code: GccCountryCode;
  notice: NoticePeriod[];
  annualLeave: AnnualLeave;
}

export const EMPLOYMENT: Record<GccCountryCode, EmploymentTerms> = {
  SA: {
    code: 'SA',
    notice: [
      {
        employeeDays: 30,
        employerDays: 60,
        appliesToEn: 'Indefinite-term contracts (2024 amendments, effective Feb 2025)',
        appliesToAr: 'العقود غير محددة المدة (تعديلات 2024، سارية من فبراير 2025)',
        noteEn:
          'Fixed-term contracts (all non-Saudi employees): resignation on 30 days\u2019 notice; the employer may delay acceptance up to 60 days with written operational justification. Payment in lieu of notice is allowed (Art 76).',
        noteAr:
          'العقود محددة المدة (جميع العمالة غير السعودية): الاستقالة بإشعار 30 يومًا؛ ويجوز لصاحب العمل تأجيل القبول حتى 60 يومًا بمبرر كتابي. ويجوز التعويض بدل الإشعار (المادة 76).',
      },
    ],
    annualLeave: {
      daysPerYear: 21,
      eligibilityEn: 'Per year of service; 30 days after five consecutive years with the same employer (Art 109).',
      eligibilityAr: 'عن كل سنة خدمة؛ و30 يومًا بعد خمس سنوات متتالية لدى صاحب العمل نفسه (المادة 109).',
    },
  },
  AE: {
    code: 'AE',
    notice: [
      {
        employeeDays: 30,
        employerDays: 30,
        appliesToEn: 'Either party, 30–90 days as agreed in the contract (Art 43)',
        appliesToAr: 'أي من الطرفين، 30–90 يومًا حسب المتفق عليه في العقد (المادة 43)',
        noteEn:
          'Modeled at the statutory minimum (30 days); the contract may set up to 90 days. Compensation for unserved notice applies.',
        noteAr:
          'مُنمذج بالحد الأدنى النظامي (30 يومًا)؛ ويجوز للعقد تحديد حتى 90 يومًا. ويُستحق تعويض عن مدة الإشعار غير المُخدَّمة.',
      },
    ],
    annualLeave: {
      daysPerYear: 30,
      eligibilityEn: 'After 1 year of service; 2 days per month for service between 6 months and 1 year (Art 29).',
      eligibilityAr: 'بعد سنة من الخدمة؛ ويومان شهريًا للخدمة من 6 أشهر إلى سنة (المادة 29).',
    },
  },
  KW: {
    code: 'KW',
    notice: [
      {
        employeeDays: 90,
        employerDays: 90,
        appliesToEn: 'Indefinite contracts, monthly-paid workers (Art 44)',
        appliesToAr: 'العقود غير محددة المدة، العمال شهريو الأجر (المادة 44)',
      },
      {
        employeeDays: 30,
        employerDays: 30,
        appliesToEn: 'Indefinite contracts, other workers (Art 44)',
        appliesToAr: 'العقود غير محددة المدة، العمال الآخرون (المادة 44)',
        noteEn:
          'A party that skips notice pays the other the wage for the notice period. On employer termination the worker may take one day / eight hours per week (paid) to seek another job.',
        noteAr:
          'من لم يلتزم بالإشعار دفع للطرف الآخر أجر مدته. وعند إنهاء صاحب العمل يحق للعامل التغيب يومًا / ثماني ساعات أسبوعيًا (بأجر) للبحث عن عمل.',
      },
    ],
    annualLeave: {
      daysPerYear: 30,
      eligibilityEn: 'Fully paid; none in the first year until 9 months; pro-rata fractions; cash offset for unused leave on termination (Arts 70, 73).',
      eligibilityAr: 'بأجر كامل؛ ولا إجازة في السنة الأولى قبل 9 أشهر؛ وتناسب للكسور؛ وبدل نقدي عن غير المستخدمة عند الإنهاء (المادتان 70 و73).',
    },
  },
  QA: {
    code: 'QA',
    notice: [
      {
        employeeDays: 30,
        employerDays: 30,
        appliesToEn: 'Indefinite contracts, monthly/annual-paid workers, service ≤5 years (Art 49)',
        appliesToAr: 'العقود غير محددة المدة، شهريو/سنويو الأجر، خدمة 5 سنوات فأقل (المادة 49)',
      },
      {
        employeeDays: 60,
        employerDays: 60,
        appliesToEn: 'Indefinite contracts, monthly/annual-paid workers, service >5 years (Art 49)',
        appliesToAr: 'العقود غير محددة المدة، شهريو/سنويو الأجر، خدمة أكثر من 5 سنوات (المادة 49)',
        noteEn:
          'Other workers: 1 week (<1 yr), 2 weeks (1–5 yrs), 1 month (>5 yrs). Compensation for unserved notice applies.',
        noteAr:
          'العمال الآخرون: أسبوع (أقل من سنة)، وأسبوعان (1–5 سنوات)، وشهر (أكثر من 5 سنوات). ويُستحق تعويض عن مدة الإشعار غير المُخدَّمة.',
      },
    ],
    annualLeave: {
      daysPerYear: 21,
      eligibilityEn: '3 weeks after 1 year of continuous service; 4 weeks after 5 years; pay in lieu of untaken leave on termination (Arts 79–81).',
      eligibilityAr: '3 أسابيع بعد سنة خدمة متواصلة؛ و4 أسابيع بعد 5 سنوات؛ وبدل نقدي عن غير المستخدمة عند الإنهاء (المواد 79–81).',
    },
  },
  BH: {
    code: 'BH',
    notice: [
      {
        employeeDays: 30,
        employerDays: 30,
        appliesToEn: 'Termination with notice (Art 99)',
        appliesToAr: 'الإنهاء بإشعار (المادة 99)',
        noteEn:
          'Compensation for the notice period (or remaining part) applies if notice is not observed; the worker keeps time to seek another job during an employer-issued notice.',
        noteAr:
          'يُستحق تعويض عن مدة الإشعار (أو المتبقي منها) عند عدم الالتزام؛ ويحتفظ العامل بوقت للبحث عن عمل أثناء إشعار صاحب العمل.',
      },
    ],
    annualLeave: {
      daysPerYear: 30,
      eligibilityEn: 'On full pay after 1 year of service, accruing at 2.5 days per month.',
      eligibilityAr: 'بأجر كامل بعد سنة من الخدمة، بواقع يومين ونصف شهريًا.',
    },
  },
  OM: {
    code: 'OM',
    notice: [
      {
        employeeDays: 30,
        employerDays: 30,
        appliesToEn: 'Indefinite contracts, monthly-paid workers (Art 38)',
        appliesToAr: 'العقود غير محددة المدة، شهريو الأجر (المادة 38)',
      },
      {
        employeeDays: 15,
        employerDays: 15,
        appliesToEn: 'Indefinite contracts, other workers (Art 38)',
        appliesToAr: 'العقود غير محددة المدة، العمال الآخرون (المادة 38)',
        noteEn: 'A longer notice period may be agreed in the contract.',
        noteAr: 'يجوز الاتفاق في العقد على مدة إشعار أطول.',
      },
    ],
    annualLeave: {
      daysPerYear: 30,
      eligibilityEn: 'With full wage, after 6 months from joining; full wage for the leave balance if service ends before use (Arts 78, 81).',
      eligibilityAr: 'بأجر شامل، بعد 6 أشهر من الالتحاق بالعمل؛ والأجر الكامل عن رصيد الإجازة إذا انتهت الخدمة قبل استخدامها (المادتان 78 و81).',
    },
  },
};
