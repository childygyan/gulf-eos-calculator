/**
 * data/calc.ts — pure helpers over the data-layer types (Phase 2).
 *
 * These are intentionally UI-free: Phase 3's calculator UI will build on
 * them. All inputs are plain numbers; all outputs are plain numbers.
 * `yearsOfService` may be fractional (pro-rata); helpers never round —
 * the UI decides on presentation rounding.
 */
import type { EosScenario, EosTier, ResignationBand } from './types.js';

/**
 * Full statutory award for a scenario: walk the tier bands over
 * `yearsOfService` and multiply by the monthly wage base.
 *
 * Example: tiers [{0.5, upTo 5}, {1.0, upTo null}], 8 years, wage 6000
 * → (5×0.5 + 3×1.0) × 6000 = 33000.
 */
export function accrueEos(tiers: EosTier[], yearsOfService: number, monthlyWage: number): number {
  if (!Number.isFinite(yearsOfService) || !Number.isFinite(monthlyWage)) return NaN;
  if (yearsOfService <= 0 || monthlyWage < 0) return 0;
  let total = 0;
  let consumed = 0;
  for (const tier of tiers) {
    const bandEnd = tier.upToYears ?? Number.POSITIVE_INFINITY;
    const inBand = Math.min(Math.max(yearsOfService - consumed, 0), bandEnd - consumed);
    total += inBand * tier.rateMonthsPerYear * monthlyWage;
    consumed += inBand;
    if (consumed >= yearsOfService) break;
  }
  return total;
}

/** Fraction of the full award payable on resignation for `yearsOfService`. */
export function resignationFraction(
  bands: ResignationBand[] | undefined,
  yearsOfService: number,
): number {
  if (!bands) return 1;
  for (const band of bands) {
    const upper = band.toYears ?? Number.POSITIVE_INFINITY;
    if (yearsOfService >= band.fromYears && yearsOfService < upper) return band.fraction;
  }
  return 0;
}

/** Apply the statutory cap (months of the wage base); null cap = unchanged. */
export function applyCap(amount: number, capMonths: number | null, monthlyWage: number): number {
  if (capMonths === null) return amount;
  return Math.min(amount, capMonths * monthlyWage);
}

/**
 * Convenience: full pipeline for one scenario — eligibility, accrual,
 * resignation reduction (if any), cap.
 */
export function scenarioAward(
  scenario: EosScenario,
  yearsOfService: number,
  monthlyWage: number,
): number {
  if (yearsOfService < scenario.minServiceYears) return 0;
  const full = accrueEos(scenario.tiers, yearsOfService, monthlyWage);
  const fraction =
    scenario.id === 'resignation'
      ? resignationFraction(scenario.resignationBands, yearsOfService)
      : 1;
  return applyCap(full * fraction, scenario.capMonths, monthlyWage);
}
