/**
 * data/types.ts — shared types for the labor-law data layer (Phase 2).
 *
 * All monetary/rate figures live in the per-country modules under
 * `src/data/countries/`. Every legal figure MUST carry a `LegalSource`
 * with an official URL; anything not sourced is labeled an assumption in
 * a code comment and in docs/SOURCES.md.
 */

/** The six GCC countries covered, by ISO code. */
export type GccCountryCode = 'SA' | 'AE' | 'KW' | 'QA' | 'BH' | 'OM';

/** An official legal citation for one figure or rule. */
export interface LegalSource {
  /** Law name, e.g. "Federal Decree-Law No. 33 of 2021" */
  lawEn: string;
  /** Law name in Arabic, e.g. "المرسوم بقانون اتحادي رقم 33 لسنة 2021" */
  lawAr: string;
  /** Article / provision, e.g. "Article 51" */
  article: string;
  /** Official URL (ministry, gazette, or official legal portal). */
  url: string;
  /** Optional clarifying note. */
  noteEn?: string;
  noteAr?: string;
}

/**
 * How the statute defines the wage used as the EOS calculation base.
 * - `basic`: basic wage only (allowances excluded by law).
 * - `basic-plus-social-allowance`: basic wage plus the social allowance only.
 * - `total-wage`: last actual wage — basic plus regular allowances.
 */
export type WageBasisKind = 'basic' | 'basic-plus-social-allowance' | 'total-wage';

export interface WageBasis {
  kind: WageBasisKind;
  descriptionEn: string;
  descriptionAr: string;
  source: LegalSource;
}

/**
 * One accrual band: months of the wage base earned per year of service
 * while service falls inside this band.
 */
export interface EosTier {
  /** e.g. 0.5 = half a month's wage per year; 21/30 for 21 days of a 30-day month. */
  rateMonthsPerYear: number;
  /** Service years (from the start of employment) where this band ends; null = open-ended. */
  upToYears: number | null;
}

/**
 * One resignation-entitlement band: the fraction of the full statutory
 * award payable when the worker resigns with this much service.
 */
export interface ResignationBand {
  /** Inclusive lower bound of service years. */
  fromYears: number;
  /** Exclusive upper bound of service years; null = no upper bound. */
  toYears: number | null;
  /** Fraction of the full award, e.g. 1/3. */
  fraction: number;
}

/**
 * One end-of-service scenario (termination by employer / resignation).
 * `tiers` always describe the FULL statutory award; `resignationBands`
 * reduce it for resignation where the law does so.
 */
export interface EosScenario {
  id: 'termination' | 'resignation';
  labelEn: string;
  labelAr: string;
  /** Minimum service years to be eligible at all (0 = no statutory minimum). */
  minServiceYears: number;
  tiers: EosTier[];
  /** Fraction bands for resignation; absence means the full award is due. */
  resignationBands?: ResignationBand[];
  /** Cap in months of the wage base; null = no statutory cap. */
  capMonths: number | null;
  noteEn?: string;
  noteAr?: string;
}

/**
 * A transitional split (two legal regimes by date), used by Oman and
 * Bahrain whose EOS rules changed while past service kept old rights.
 */
export interface EosTransition {
  /** ISO date the new regime took effect, e.g. "2023-07-31". */
  cutoffDate: string;
  descriptionEn: string;
  descriptionAr: string;
  source: LegalSource;
}

export interface CountryEosRules {
  code: GccCountryCode;
  nameEn: string;
  nameAr: string;
  currencyCode: string;
  currencyEn: string;
  currencyAr: string;
  wageBasis: WageBasis;
  /** Fractions of a year are pro-rated once eligible (true for all six GCC states). */
  proRataFractions: boolean;
  scenarios: EosScenario[];
  /** Optional regime-change split (Oman, Bahrain). */
  transition?: EosTransition;
  /** Free-text payout notes (who pays, deadlines), bilingual. */
  payoutEn: string;
  payoutAr: string;
  sources: LegalSource[];
}
