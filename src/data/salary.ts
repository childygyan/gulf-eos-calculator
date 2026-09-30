/**
 * data/salary.ts — standard salary components and whether each counts
 * toward the statutory EOS wage base per country (Phase 2, supporting
 * data). The `includedInEosBasis` flags are DERIVED from each country's
 * wage-basis rule in its data module — no new figures are introduced here.
 */
import type { GccCountryCode } from './types.js';

export interface SalaryComponent {
  id: string;
  nameEn: string;
  nameAr: string;
  /** Counts toward the country's statutory EOS wage base. */
  includedInEosBasis: boolean;
  noteEn?: string;
  noteAr?: string;
}

export interface CountrySalaryStructure {
  code: GccCountryCode;
  components: SalaryComponent[];
}

const BASIC: SalaryComponent = {
  id: 'basic',
  nameEn: 'Basic wage',
  nameAr: 'الراتب الأساسي',
  includedInEosBasis: true,
};

function excluded(id: string, nameEn: string, nameAr: string): SalaryComponent {
  return { id, nameEn, nameAr, includedInEosBasis: false };
}

function included(id: string, nameEn: string, nameAr: string): SalaryComponent {
  return { id, nameEn, nameAr, includedInEosBasis: true };
}

export const SALARY_STRUCTURES: Record<GccCountryCode, CountrySalaryStructure> = {
  SA: {
    code: 'SA',
    components: [
      BASIC,
      included('housing', 'Housing allowance', 'بدل السكن'),
      included('transport', 'Transport allowance', 'بدل النقل'),
      included('other-allowances', 'Other regular allowances', 'بدلات منتظمة أخرى'),
      {
        id: 'commissions',
        nameEn: 'Commissions / sales percentages',
        nameAr: 'العمولات / نسب المبيعات',
        includedInEosBasis: false,
        noteEn: 'Excluded ONLY if the contract validly says so (Art 86); otherwise part of the last wage.',
        noteAr: 'تُستبعد فقط إذا نص العقد على ذلك (المادة 86)؛ وإلا فهي جزء من الأجر الأخير.',
      },
    ],
  },
  AE: {
    code: 'AE',
    components: [
      BASIC,
      excluded('housing', 'Housing allowance', 'بدل السكن'),
      excluded('transport', 'Transport allowance', 'بدل النقل'),
      excluded('other-allowances', 'Other allowances & benefits', 'بدلات ومزايا أخرى'),
      excluded('commissions', 'Commissions / bonuses', 'العمولات / المكافآت'),
    ],
  },
  KW: {
    code: 'KW',
    components: [
      BASIC,
      included('housing', 'Housing allowance', 'بدل السكن'),
      included('transport', 'Transport allowance', 'بدل النقل'),
      included('other-allowances', 'Periodic allowances, grants, monetary privileges', 'البدلات والمنح والمزايا النقدية الدورية'),
      included('bonuses', 'Bonuses / profit shares', 'المكافآت / حصص الأرباح'),
    ],
  },
  QA: {
    code: 'QA',
    components: [
      BASIC,
      excluded('housing', 'Housing allowance', 'بدل السكن'),
      excluded('transport', 'Transport allowance', 'بدل النقل'),
      excluded('other-allowances', 'Other allowances', 'بدلات أخرى'),
      excluded('cost-of-living', 'Cost-of-living allowance', 'علاوة غلاء المعيشة'),
    ],
  },
  BH: {
    code: 'BH',
    components: [
      BASIC,
      included('social-allowance', 'Social allowance', 'العلاوة الاجتماعية'),
      excluded('housing', 'Housing allowance', 'بدل السكن'),
      excluded('transport', 'Transport allowance', 'بدل النقل'),
      excluded('other-allowances', 'Other allowances', 'بدلات أخرى'),
    ],
  },
  OM: {
    code: 'OM',
    components: [
      BASIC,
      excluded('housing', 'Housing allowance', 'بدل السكن'),
      excluded('transport', 'Transport allowance', 'بدل النقل'),
      excluded('other-allowances', 'Other allowances', 'بدلات أخرى'),
      excluded('bonuses', 'Bonuses', 'المكافآت'),
    ],
  },
};
