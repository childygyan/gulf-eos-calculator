/**
 * engine/index.ts — Phase 3 calculation engine entry point.
 *
 * Pure functions over the Phase 2 data model. UI-free: no DOM, no
 * formatting, no locale strings — the client scripts localize output.
 */
export {
  calculateEos,
  yearsBetweenISO,
  type EosInput,
  type EosTierLine,
  type EosSplit,
  type EosAssumptionKey,
  type EosResult,
} from './eos.js';
export { calculateVat, type VatMode, type VatResult } from './vat.js';
export {
  calculateSalaryNet,
  type SalaryEarning,
  type SalaryDeduction,
  type SalaryNetResult,
} from './salaryNet.js';
export {
  annualEntitlementDays,
  accruedLeave,
  leaveBalance,
  type LeaveBalanceResult,
} from './leave.js';
export {
  isValidISODate,
  addDaysISO,
  lastWorkingDay,
} from './notice.js';
