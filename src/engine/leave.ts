/**
 * engine/leave.ts — annual-leave balance engine (Phase 3).
 *
 * Statutory entitlements come from src/data/employment.ts; the two
 * seniority step-ups are modeled explicitly from the cited articles:
 * - Saudi Arabia (Art 109): 21 days/year, 30 after five consecutive years.
 * - Qatar (Arts 79–81): 3 weeks (21 days) after 1 year, 4 weeks (28) after 5.
 * Everything else uses the flat annualLeave.daysPerYear figure.
 */
import { EMPLOYMENT, type GccCountryCode } from '../data/index.js';

/** Statutory annual-leave days per year for this service length. */
export function annualEntitlementDays(code: GccCountryCode, serviceYears: number): number {
  if (code === 'SA') return serviceYears >= 5 ? 30 : 21; // Art 109
  if (code === 'QA') return serviceYears >= 5 ? 28 : 21; // Arts 79–81
  return EMPLOYMENT[code].annualLeave.daysPerYear;
}

/** Accrued leave days over a service length (simple pro-rata). */
export function accruedLeave(entitlementPerYear: number, serviceYears: number): number {
  if (!Number.isFinite(entitlementPerYear) || entitlementPerYear < 0) {
    throw new RangeError(`entitlementPerYear must be >= 0 (got ${entitlementPerYear})`);
  }
  if (!Number.isFinite(serviceYears) || serviceYears < 0) {
    throw new RangeError(`serviceYears must be >= 0 (got ${serviceYears})`);
  }
  return entitlementPerYear * serviceYears;
}

export interface LeaveBalanceResult {
  accrued: number;
  used: number;
  /** Remaining balance (negative when overused). */
  balance: number;
  overused: boolean;
  overusedBy: number;
}

export function leaveBalance(accrued: number, used: number): LeaveBalanceResult {
  if (!Number.isFinite(accrued) || accrued < 0) {
    throw new RangeError(`accrued must be >= 0 (got ${accrued})`);
  }
  if (!Number.isFinite(used) || used < 0) {
    throw new RangeError(`used must be >= 0 (got ${used})`);
  }
  const balance = accrued - used;
  return {
    accrued,
    used,
    balance,
    overused: balance < 0,
    overusedBy: Math.max(-balance, 0),
  };
}
