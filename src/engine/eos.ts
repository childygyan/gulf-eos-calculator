/**
 * engine/eos.ts — end-of-service calculation engine (Phase 3).
 *
 * Pure, UI-free functions on top of the Phase 2 data model. The engine
 * takes validated user inputs and returns a structured breakdown the UI
 * localizes; it never formats strings or touches the DOM.
 *
 * Transition handling (both labeled in docs/SOURCES.md):
 * - Oman: service before 2023-07-31 uses the OLD tiers (RD 35/2003, Art 39);
 *   service from that date uses one month's basic wage per year. The two
 *   portions are summed on the last basic wage (MoL worked example).
 * - Bahrain: the Article 116 formula is unchanged — only WHO PAYS changed
 *   (employer vs SIO fund from 1 March 2024). The engine reports the full
 *   formula award plus a payer attribution by service period; it does NOT
 *   split the formula amount between payers (the law defines no such split
 *   — the SIO portion is contribution-based).
 */
import {
  EOS_RULES,
  OM_OLD_TIERS,
  OM_NEW_LAW_EFFECTIVE_DATE,
  BH_SIO_EFFECTIVE_DATE,
  type EosTier,
  type GccCountryCode,
} from '../data/index.js';
import { applyCap, resignationFraction } from '../data/calc.js';

export interface EosInput {
  code: GccCountryCode;
  scenario: 'termination' | 'resignation';
  /** Monthly wage basis: the sum of the country's included components. */
  wageBasis: number;
  /** Whole years of service (>= 0). */
  serviceYears: number;
  /** Extra months of service (0–11). */
  serviceMonths: number;
  /** ISO employment start date (YYYY-MM-DD). Needed for OM/BH regime splits. */
  startDate?: string;
  /** ISO end-of-service date. Defaults to today (UTC). */
  endDate?: string;
}

export interface EosTierLine {
  /** Years of service consumed inside this band (fractional allowed). */
  yearsInBand: number;
  rateMonthsPerYear: number;
  amount: number;
  /** Position of the band inside its regime's tier list. */
  bandIndex: number;
  /** Band's upToYears (null = open-ended). */
  bandUpTo: number | null;
  /** For Oman splits: which regime this line belongs to. */
  portion: 'pre' | 'post' | null;
}

export interface EosSplit {
  kind: 'om-regime' | 'bh-payer';
  cutoff: string;
  preYears: number;
  postYears: number;
  /** Oman: formula amounts per regime. Bahrain: null (payer attribution only). */
  preAmount: number | null;
  postAmount: number | null;
}

export type EosAssumptionKey =
  | 'qatar-weeks-divisor'
  | 'kuwait-daily-divisor'
  | 'oman-old-divisor'
  | 'saudi-wage-reading'
  | 'om-no-start-date'
  | 'bh-no-start-date';

export interface EosResult {
  code: GccCountryCode;
  scenario: 'termination' | 'resignation';
  eligible: boolean;
  /** Total fractional service years (years + months/12). */
  serviceYearsTotal: number;
  wageBasis: number;
  currencyCode: string;
  tierLines: EosTierLine[];
  fullAward: number;
  /** 1 when the scenario has no reduction. */
  resignationFraction: number;
  afterReduction: number;
  capMonths: number | null;
  capApplied: boolean;
  /** Final award. */
  total: number;
  split: EosSplit | null;
  assumptions: EosAssumptionKey[];
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function parseISODate(iso: string): number {
  if (!ISO_DATE.test(iso)) return NaN;
  const t = Date.parse(`${iso}T00:00:00Z`);
  return t;
}

/** Fractional years between two ISO dates (UTC, 365.25-day year). */
export function yearsBetweenISO(fromISO: string, toISO: string): number {
  const from = parseISODate(fromISO);
  const to = parseISODate(toISO);
  if (!Number.isFinite(from) || !Number.isFinite(to) || to < from) return NaN;
  return (to - from) / 86_400_000 / 365.25;
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Walk the tier bands, recording how much service each band consumed. */
function accrueWithLines(
  tiers: EosTier[],
  yearsOfService: number,
  monthlyWage: number,
  portion: 'pre' | 'post' | null,
): EosTierLine[] {
  const lines: EosTierLine[] = [];
  let consumed = 0;
  tiers.forEach((tier, bandIndex) => {
    const bandEnd = tier.upToYears ?? Number.POSITIVE_INFINITY;
    const inBand = Math.min(Math.max(yearsOfService - consumed, 0), bandEnd - consumed);
    if (inBand > 0) {
      lines.push({
        yearsInBand: inBand,
        rateMonthsPerYear: tier.rateMonthsPerYear,
        amount: inBand * tier.rateMonthsPerYear * monthlyWage,
        bandIndex,
        bandUpTo: tier.upToYears,
        portion,
      });
    }
    consumed += inBand;
  });
  return lines;
}

function validateInput(input: EosInput): void {
  const { wageBasis, serviceYears, serviceMonths, startDate, endDate } = input;
  if (!Number.isFinite(wageBasis) || wageBasis < 0) {
    throw new RangeError(`wageBasis must be a finite number >= 0 (got ${wageBasis})`);
  }
  if (!Number.isInteger(serviceYears) || serviceYears < 0 || serviceYears > 70) {
    throw new RangeError(`serviceYears must be an integer 0–70 (got ${serviceYears})`);
  }
  if (!Number.isInteger(serviceMonths) || serviceMonths < 0 || serviceMonths > 11) {
    throw new RangeError(`serviceMonths must be an integer 0–11 (got ${serviceMonths})`);
  }
  for (const [name, v] of [
    ['startDate', startDate],
    ['endDate', endDate],
  ] as const) {
    if (v !== undefined && !Number.isFinite(parseISODate(v))) {
      throw new RangeError(`${name} must be an ISO date YYYY-MM-DD (got ${v})`);
    }
  }
  if (startDate && endDate && parseISODate(endDate) < parseISODate(startDate)) {
    throw new RangeError('endDate must not be before startDate');
  }
}

function countryAssumptions(code: GccCountryCode): EosAssumptionKey[] {
  switch (code) {
    case 'QA':
      // ASSUMPTION (docs/SOURCES.md #2): "three weeks" = 21/30 of monthly wage.
      return ['qatar-weeks-divisor'];
    case 'KW':
      // ASSUMPTION (docs/SOURCES.md #1): 15-day tier at monthly ÷ 26.
      return ['kuwait-daily-divisor'];
    case 'OM':
      // ASSUMPTION (docs/SOURCES.md #3): old-law 15 days = 15/30.
      return ['oman-old-divisor'];
    case 'SA':
      // ASSUMPTION (docs/SOURCES.md #4): "last wage" = basic + regular allowances.
      return ['saudi-wage-reading'];
    default:
      return [];
  }
}

/**
 * Full EOS calculation for one country + scenario.
 * Returns a structured breakdown; the UI localizes every label.
 */
export function calculateEos(input: EosInput): EosResult {
  validateInput(input);
  const { code, scenario: scenarioId, wageBasis } = input;
  const rules = EOS_RULES[code];
  const scenario = rules.scenarios.find((s) => s.id === scenarioId);
  if (!scenario) throw new RangeError(`Unknown scenario ${scenarioId} for ${code}`);

  const total = input.serviceYears + input.serviceMonths / 12;
  const assumptions = countryAssumptions(code);
  const base: Omit<EosResult, 'tierLines' | 'fullAward' | 'afterReduction' | 'total' | 'split'> = {
    code,
    scenario: scenarioId,
    eligible: total + 1e-9 >= scenario.minServiceYears,
    serviceYearsTotal: total,
    wageBasis,
    currencyCode: rules.currencyCode,
    resignationFraction: 1,
    capMonths: scenario.capMonths,
    capApplied: false,
    assumptions,
  };

  if (!base.eligible || total <= 0 || wageBasis <= 0) {
    return {
      ...base,
      tierLines: [],
      fullAward: 0,
      afterReduction: 0,
      total: 0,
      split: null,
    };
  }

  const endDate = input.endDate ?? todayISO();

  // --- Oman regime split (effective-date reading; see docs/SOURCES.md) ---
  if (code === 'OM' && input.startDate) {
    if (input.startDate < OM_NEW_LAW_EFFECTIVE_DATE) {
      const preYears = Math.min(
        yearsBetweenISO(input.startDate, OM_NEW_LAW_EFFECTIVE_DATE),
        total,
      );
      const postYears = Math.max(total - preYears, 0);
      const preLines = accrueWithLines([...OM_OLD_TIERS], preYears, wageBasis, 'pre');
      const postLines = accrueWithLines(
        [{ rateMonthsPerYear: 1.0, upToYears: null }],
        postYears,
        wageBasis,
        'post',
      );
      const preAmount = preLines.reduce((a, l) => a + l.amount, 0);
      const postAmount = postLines.reduce((a, l) => a + l.amount, 0);
      const fullAward = preAmount + postAmount;
      return {
        ...base,
        tierLines: [...preLines, ...postLines],
        fullAward,
        afterReduction: fullAward,
        total: fullAward,
        split: {
          kind: 'om-regime',
          cutoff: OM_NEW_LAW_EFFECTIVE_DATE,
          preYears,
          postYears,
          preAmount,
          postAmount,
        },
      };
    }
    // Started on/after the new law: single regime below (no assumption needed).
  } else if (code === 'OM') {
    assumptions.push('om-no-start-date');
  }

  // --- Bahrain payer attribution (formula unchanged; only who pays changed) ---
  let split: EosSplit | null = null;
  if (code === 'BH' && input.startDate) {
    if (input.startDate < BH_SIO_EFFECTIVE_DATE) {
      const preYears = Math.min(yearsBetweenISO(input.startDate, BH_SIO_EFFECTIVE_DATE), total);
      split = {
        kind: 'bh-payer',
        cutoff: BH_SIO_EFFECTIVE_DATE,
        preYears,
        postYears: Math.max(total - preYears, 0),
        preAmount: null,
        postAmount: null,
      };
    }
  } else if (code === 'BH') {
    assumptions.push('bh-no-start-date');
  }

  const tierLines = accrueWithLines(scenario.tiers, total, wageBasis, null);
  const fullAward = tierLines.reduce((a, l) => a + l.amount, 0);
  const fraction =
    scenarioId === 'resignation' ? resignationFraction(scenario.resignationBands, total) : 1;
  const afterReduction = fullAward * fraction;
  const capped = applyCap(afterReduction, scenario.capMonths, wageBasis);
  const capApplied =
    scenario.capMonths !== null && afterReduction > scenario.capMonths * wageBasis + 1e-9;

  return {
    ...base,
    tierLines,
    fullAward,
    resignationFraction: fraction,
    afterReduction,
    capApplied,
    total: capped,
    split,
  };
}
