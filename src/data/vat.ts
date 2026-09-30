/**
 * data/vat.ts — VAT status per GCC country (Phase 2, supporting data).
 *
 * Verified 2026-09-30 (see docs/SOURCES.md):
 * - Saudi Arabia: 15% — introduced Jan 2018 at 5%, raised to 15% in Jul 2020 (ZATCA).
 * - Bahrain: 10% — introduced Jan 2019 at 5%, raised to 10% in Jan 2022 (NBR).
 * - UAE: 5% — since Jan 2018, unchanged (FTA).
 * - Oman: 5% — since Apr 2021, unchanged (OTA).
 * - Qatar: not implemented (0%). The General Tax Authority states VAT is
 *   not implemented; a 5% rate is only anticipated, with no official date.
 * - Kuwait: not implemented (0%).
 */
import type { GccCountryCode } from './types.js';

export interface VatInfo {
  code: GccCountryCode;
  implemented: boolean;
  /** Current standard rate in percent (0 when not implemented). */
  ratePercent: number;
  effectiveFrom: string | null;
  authorityEn: string;
  authorityAr: string;
  historyEn: string;
  historyAr: string;
}

export const VAT: Record<GccCountryCode, VatInfo> = {
  SA: {
    code: 'SA',
    implemented: true,
    ratePercent: 15,
    effectiveFrom: '2020-07-01',
    authorityEn: 'ZATCA (Zakat, Tax and Customs Authority)',
    authorityAr: 'هيئة الزكاة والضريبة والجمارك (زاتكا)',
    historyEn: 'Introduced Jan 2018 at 5%; raised to 15% in July 2020.',
    historyAr: 'طُبقت في يناير 2018 بنسبة 5%؛ ورُفعت إلى 15% في يوليو 2020.',
  },
  BH: {
    code: 'BH',
    implemented: true,
    ratePercent: 10,
    effectiveFrom: '2022-01-01',
    authorityEn: 'NBR (National Bureau for Revenue)',
    authorityAr: 'الجهاز الوطني للإيرادات',
    historyEn: 'Introduced Jan 2019 at 5%; raised to 10% in January 2022.',
    historyAr: 'طُبقت في يناير 2019 بنسبة 5%؛ ورُفعت إلى 10% في يناير 2022.',
  },
  AE: {
    code: 'AE',
    implemented: true,
    ratePercent: 5,
    effectiveFrom: '2018-01-01',
    authorityEn: 'FTA (Federal Tax Authority)',
    authorityAr: 'الهيئة الاتحادية للضرائب',
    historyEn: 'Introduced Jan 2018 at 5%; unchanged since.',
    historyAr: 'طُبقت في يناير 2018 بنسبة 5%؛ ولم تتغير منذ ذلك.',
  },
  OM: {
    code: 'OM',
    implemented: true,
    ratePercent: 5,
    effectiveFrom: '2021-04-01',
    authorityEn: 'OTA (Oman Tax Authority)',
    authorityAr: 'جهاز الضرائب العُماني',
    historyEn: 'Introduced April 2021 at 5%; unchanged since.',
    historyAr: 'طُبقت في أبريل 2021 بنسبة 5%؛ ولم تتغير منذ ذلك.',
  },
  QA: {
    code: 'QA',
    implemented: false,
    ratePercent: 0,
    effectiveFrom: null,
    authorityEn: 'GTA (General Tax Authority)',
    authorityAr: 'الهيئة العامة للضرائب',
    historyEn:
      'Not implemented as of Sep 2026. The GTA states Qatar has not implemented VAT; a 5% standard rate is only anticipated and no official date exists.',
    historyAr:
      'غير مطبقة حتى سبتمبر 2026. وتؤكد الهيئة العامة للضرائب عدم تطبيقها؛ ونسبة 5% متوقعة فقط دون موعد رسمي.',
  },
  KW: {
    code: 'KW',
    implemented: false,
    ratePercent: 0,
    effectiveFrom: null,
    authorityEn: 'Ministry of Finance (no VAT administration)',
    authorityAr: 'وزارة المالية (لا توجد إدارة لضريبة القيمة المضافة)',
    historyEn: 'Not implemented as of Sep 2026.',
    historyAr: 'غير مطبقة حتى سبتمبر 2026.',
  },
};
