/**
 * engine/salaryNet.ts — net-salary calculator engine (Phase 3).
 *
 * HONESTY: there is no official per-country "deduction rate" in the data
 * model, and we do not invent one. Deductions are USER-ENTERED absolute
 * amounts (from the worker's payslip). The engine only sums earnings,
 * subtracts deductions, and derives the EOS wage basis from the Phase 2
 * salary-component flags (src/data/salary.ts).
 */
import { SALARY_STRUCTURES, type GccCountryCode } from '../data/index.js';

export interface SalaryEarning {
  /** Component id from the country's salary structure (e.g. 'basic'). */
  id: string;
  amount: number;
}

export interface SalaryDeduction {
  label: string;
  amount: number;
}

export interface SalaryNetResult {
  code: GccCountryCode;
  gross: number;
  /** Sum of earnings flagged includedInEosBasis for this country. */
  eosBasis: number;
  /** Sum of earnings excluded from the EOS basis. */
  excludedFromBasis: number;
  totalDeductions: number;
  net: number;
  lines: Array<{ id: string; amount: number; inBasis: boolean }>;
}

export function calculateSalaryNet(
  code: GccCountryCode,
  earnings: SalaryEarning[],
  deductions: SalaryDeduction[],
): SalaryNetResult {
  const structure = SALARY_STRUCTURES[code];
  const inBasis = new Set(
    structure.components.filter((c) => c.includedInEosBasis).map((c) => c.id),
  );
  let gross = 0;
  let eosBasis = 0;
  const lines: SalaryNetResult['lines'] = [];
  for (const e of earnings) {
    if (!Number.isFinite(e.amount) || e.amount < 0) {
      throw new RangeError(`earning ${e.id} must be >= 0 (got ${e.amount})`);
    }
    gross += e.amount;
    const included = inBasis.has(e.id);
    if (included) eosBasis += e.amount;
    lines.push({ id: e.id, amount: e.amount, inBasis: included });
  }
  let totalDeductions = 0;
  for (const d of deductions) {
    if (!Number.isFinite(d.amount) || d.amount < 0) {
      throw new RangeError(`deduction "${d.label}" must be >= 0 (got ${d.amount})`);
    }
    totalDeductions += d.amount;
  }
  return {
    code,
    gross,
    eosBasis,
    excludedFromBasis: gross - eosBasis,
    totalDeductions,
    net: gross - totalDeductions,
    lines,
  };
}
