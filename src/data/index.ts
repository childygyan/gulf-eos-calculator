/**
 * data/index.ts — Phase 2 data-layer registry.
 *
 * Single entry point for the labor-law data model: EOS rules per country,
 * VAT, employment terms (notice + leave), and salary structures.
 */
import type { CountryEosRules, GccCountryCode } from './types.js';
import { sa } from './countries/sa.js';
import { ae } from './countries/ae.js';
import { kw } from './countries/kw.js';
import { qa } from './countries/qa.js';
import { bh } from './countries/bh.js';
import { om } from './countries/om.js';

export * from './types.js';
export { accrueEos, applyCap, resignationFraction, scenarioAward } from './calc.js';
export { VAT, type VatInfo } from './vat.js';
export { EMPLOYMENT, type EmploymentTerms, type NoticePeriod, type AnnualLeave } from './employment.js';
export {
  SALARY_STRUCTURES,
  type CountrySalaryStructure,
  type SalaryComponent,
} from './salary.js';
export { KW_DAILY_DIVISOR } from './countries/kw.js';
export { QA_WEEKS_TO_MONTHS } from './countries/qa.js';
export { BH_SIO_RATES, BH_SIO_EFFECTIVE_DATE } from './countries/bh.js';
export { OM_NEW_LAW_EFFECTIVE_DATE, OM_OLD_TIERS } from './countries/om.js';

export const COUNTRY_CODES: readonly GccCountryCode[] = ['SA', 'AE', 'KW', 'QA', 'BH', 'OM'];

export const EOS_RULES: Record<GccCountryCode, CountryEosRules> = { SA: sa, AE: ae, KW: kw, QA: qa, BH: bh, OM: om };

/** EOS rules for a country code; undefined for unknown codes. */
export function getEosRules(code: string): CountryEosRules | undefined {
  return (EOS_RULES as Record<string, CountryEosRules>)[code];
}
