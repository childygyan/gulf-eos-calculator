/**
 * tests/engine.test.ts — Phase 3 calculation engine.
 *
 * Every calculator is tested against the Phase 2 official worked examples
 * (same figures as tests/data.test.ts, now through the full engine
 * pipeline) plus edge cases: zero service, caps, resignation bands,
 * VAT inclusive/exclusive, leave over-use, and notice dates crossing
 * month ends. Transition splits (Oman, Bahrain) are tested structurally.
 */
import { describe, expect, it } from 'vitest';
import {
  calculateEos,
  yearsBetweenISO,
  calculateVat,
  calculateSalaryNet,
  annualEntitlementDays,
  accruedLeave,
  leaveBalance,
  addDaysISO,
  lastWorkingDay,
  isValidISODate,
  type EosInput,
} from '../src/engine/index.js';
import { accrueEos } from '../src/data/calc.js';
import { OM_OLD_TIERS } from '../src/data/index.js';

const approx = (a: number, b: number, tol = 0.01) => Math.abs(a - b) <= tol;

function eos(input: Partial<EosInput> & Pick<EosInput, 'code'>): ReturnType<typeof calculateEos> {
  return calculateEos({
    scenario: 'termination',
    wageBasis: 0,
    serviceYears: 0,
    serviceMonths: 0,
    ...input,
  });
}

describe('EOS engine — official worked examples (via full pipeline)', () => {
  it('SA: 6,000 × 8y termination → 33,000', () => {
    const r = eos({ code: 'SA', wageBasis: 6000, serviceYears: 8 });
    expect(r.eligible).toBe(true);
    expect(r.total).toBe(33000);
    expect(r.tierLines).toHaveLength(2);
    expect(r.tierLines[0].yearsInBand).toBe(5);
    expect(r.tierLines[1].yearsInBand).toBe(3);
    expect(r.capApplied).toBe(false);
    expect(r.assumptions).toContain('saudi-wage-reading');
  });

  it('SA: resignation 8y → 22,000 (2/3); 1y → ineligible; 10y → 45,000', () => {
    expect(eos({ code: 'SA', scenario: 'resignation', wageBasis: 6000, serviceYears: 8 }).total).toBe(22000);
    const r1 = eos({ code: 'SA', scenario: 'resignation', wageBasis: 6000, serviceYears: 1 });
    expect(r1.eligible).toBe(false);
    expect(r1.total).toBe(0);
    expect(eos({ code: 'SA', scenario: 'resignation', wageBasis: 6000, serviceYears: 10 }).total).toBe(45000);
  });

  it('AE: 18,000 × 8y → 117,000; 0.9y → ineligible; 40y caps at 24,000', () => {
    const r = eos({ code: 'AE', wageBasis: 18000, serviceYears: 8 });
    expect(r.total).toBe(117000);
    expect(r.capMonths).toBe(24);
    expect(eos({ code: 'AE', wageBasis: 18000, serviceYears: 0, serviceMonths: 11 }).eligible).toBe(false);
    const capped = eos({ code: 'AE', wageBasis: 1000, serviceYears: 40 });
    expect(capped.total).toBe(24000);
    expect(capped.capApplied).toBe(true);
  });

  it('KW: 500 × 6y resignation → ≈1,294.83; 2y resignation → ineligible', () => {
    const r = eos({ code: 'KW', scenario: 'resignation', wageBasis: 500, serviceYears: 6 });
    expect(approx(r.total, 1294.83, 0.1)).toBe(true);
    expect(r.assumptions).toContain('kuwait-daily-divisor');
    expect(eos({ code: 'KW', scenario: 'resignation', wageBasis: 500, serviceYears: 2 }).eligible).toBe(false);
  });

  it('QA: 4,000 × 5y → 14,000 with divisor assumption labeled', () => {
    const r = eos({ code: 'QA', wageBasis: 4000, serviceYears: 5 });
    expect(r.total).toBe(14000);
    expect(r.assumptions).toContain('qatar-weeks-divisor');
  });

  it('BH: 600 × 4y → 1,500; resignation identical', () => {
    expect(eos({ code: 'BH', wageBasis: 600, serviceYears: 4 }).total).toBe(1500);
    expect(
      eos({ code: 'BH', scenario: 'resignation', wageBasis: 600, serviceYears: 4 }).total,
    ).toBe(1500);
  });

  it('OM: 500 × 5y (new regime) → 2,500', () => {
    const r = eos({ code: 'OM', wageBasis: 500, serviceYears: 5 });
    expect(r.total).toBe(2500);
    expect(r.split).toBeNull();
    expect(r.assumptions).toContain('oman-old-divisor');
  });
});

describe('EOS engine — edge cases', () => {
  it('zero service and zero wage → 0 total, no crash', () => {
    expect(eos({ code: 'SA', wageBasis: 6000 }).total).toBe(0);
    expect(eos({ code: 'SA', wageBasis: 0, serviceYears: 5 }).total).toBe(0);
  });

  it('pro-rata months: SA 2y 6m → 7,500', () => {
    expect(eos({ code: 'SA', wageBasis: 6000, serviceYears: 2, serviceMonths: 6 }).total).toBe(7500);
  });

  it('rejects invalid inputs', () => {
    expect(() => eos({ code: 'SA', wageBasis: -1, serviceYears: 5 })).toThrow(RangeError);
    expect(() => eos({ code: 'SA', wageBasis: 1000, serviceYears: 5, serviceMonths: 12 })).toThrow(RangeError);
    expect(() => eos({ code: 'SA', wageBasis: 1000, serviceYears: 5, startDate: 'not-a-date' })).toThrow(RangeError);
    expect(() =>
      eos({ code: 'SA', wageBasis: 1000, serviceYears: 5, startDate: '2026-01-02', endDate: '2026-01-01' }),
    ).toThrow(RangeError);
  });

  it('KW 18-month cap binds on long service', () => {
    // 30y uncapped at 500: (5×15/26 + 25×1)×500 ≈ 13,942 → capped at 9,000.
    const r = eos({ code: 'KW', wageBasis: 500, serviceYears: 30 });
    expect(r.total).toBe(9000);
    expect(r.capApplied).toBe(true);
  });
});

describe('EOS engine — Oman transition split', () => {
  it('splits pre/post 2023-07-31 service on old/new tiers', () => {
    const r = eos({
      code: 'OM',
      wageBasis: 500,
      serviceYears: 6,
      startDate: '2020-01-01',
      endDate: '2026-01-01',
    });
    expect(r.split?.kind).toBe('om-regime');
    expect(r.split?.cutoff).toBe('2023-07-31');
    const pre = r.split!.preYears;
    const post = r.split!.postYears;
    expect(approx(pre + post, 6, 0.01)).toBe(true);
    expect(approx(pre, yearsBetweenISO('2020-01-01', '2023-07-31'), 0.01)).toBe(true);
    // Pre portion on old tiers, post portion at 1.0 — matches the MoL method.
    expect(approx(r.split!.preAmount ?? -1, accrueEos([...OM_OLD_TIERS], pre, 500), 0.01)).toBe(true);
    expect(approx(r.split!.postAmount ?? -1, post * 500, 0.01)).toBe(true);
    expect(approx(r.total, (r.split!.preAmount ?? 0) + (r.split!.postAmount ?? 0), 0.01)).toBe(true);
    expect(r.tierLines.some((l) => l.portion === 'pre')).toBe(true);
    expect(r.tierLines.some((l) => l.portion === 'post')).toBe(true);
  });

  it('no split when service started after the new law; assumption when no start date', () => {
    const r = eos({ code: 'OM', wageBasis: 500, serviceYears: 2, startDate: '2024-01-01' });
    expect(r.split).toBeNull();
    expect(r.total).toBe(1000);
    const r2 = eos({ code: 'OM', wageBasis: 500, serviceYears: 2 });
    expect(r2.assumptions).toContain('om-no-start-date');
  });
});

describe('EOS engine — Bahrain payer attribution', () => {
  it('attributes pre/post 2024-03-01 service without splitting the formula', () => {
    const r = eos({
      code: 'BH',
      wageBasis: 600,
      serviceYears: 4,
      startDate: '2022-01-01',
      endDate: '2026-01-01',
    });
    expect(r.split?.kind).toBe('bh-payer');
    expect(r.split?.preAmount).toBeNull();
    expect(r.split?.postAmount).toBeNull();
    expect(approx(r.split!.preYears + r.split!.postYears, 4, 0.01)).toBe(true);
    // The formula award itself is unchanged.
    expect(r.total).toBe(1500);
  });

  it('flags missing start date as an assumption', () => {
    const r = eos({ code: 'BH', wageBasis: 600, serviceYears: 4 });
    expect(r.assumptions).toContain('bh-no-start-date');
    expect(r.split).toBeNull();
  });
});

describe('VAT engine', () => {
  it('SA 15% exclusive: 1,000 → vat 150, gross 1,150', () => {
    const r = calculateVat('SA', 1000, 'exclusive');
    expect(r.implemented).toBe(true);
    expect(r.vat).toBe(150);
    expect(r.gross).toBe(1150);
    expect(r.net).toBe(1000);
  });

  it('SA 15% inclusive: 1,150 → net 1,000, vat 150', () => {
    const r = calculateVat('SA', 1150, 'inclusive');
    expect(approx(r.net, 1000, 0.01)).toBe(true);
    expect(approx(r.vat, 150, 0.01)).toBe(true);
    expect(r.gross).toBe(1150);
  });

  it('BH 10% and AE/OM 5% use their own rates', () => {
    expect(calculateVat('BH', 1000, 'exclusive').vat).toBe(100);
    expect(calculateVat('AE', 1000, 'exclusive').vat).toBe(50);
    expect(calculateVat('OM', 200, 'exclusive').vat).toBe(10);
  });

  it('QA/KW report not-implemented instead of 0%', () => {
    for (const code of ['QA', 'KW'] as const) {
      const r = calculateVat(code, 1000, 'exclusive');
      expect(r.implemented).toBe(false);
      expect(r.vat).toBe(0);
    }
  });

  it('rejects negative amounts', () => {
    expect(() => calculateVat('SA', -5, 'exclusive')).toThrow(RangeError);
  });
});

describe('salary-net engine', () => {
  it('sums earnings, subtracts user-entered deductions, derives the EOS basis', () => {
    // SA: basic + housing + transport included; commissions excluded.
    const r = calculateSalaryNet(
      'SA',
      [
        { id: 'basic', amount: 5000 },
        { id: 'housing', amount: 1500 },
        { id: 'commissions', amount: 2000 },
      ],
      [{ label: 'GOSI', amount: 800 }],
    );
    expect(r.gross).toBe(8500);
    expect(r.eosBasis).toBe(6500);
    expect(r.excludedFromBasis).toBe(2000);
    expect(r.totalDeductions).toBe(800);
    expect(r.net).toBe(7700);
  });

  it('AE basis is basic-only', () => {
    const r = calculateSalaryNet(
      'AE',
      [
        { id: 'basic', amount: 5000 },
        { id: 'housing', amount: 1500 },
      ],
      [],
    );
    expect(r.eosBasis).toBe(5000);
    expect(r.net).toBe(6500);
  });

  it('BH basis is basic + social allowance', () => {
    const r = calculateSalaryNet(
      'BH',
      [
        { id: 'basic', amount: 400 },
        { id: 'social-allowance', amount: 100 },
        { id: 'housing', amount: 200 },
      ],
      [{ label: 'advance', amount: 50 }],
    );
    expect(r.eosBasis).toBe(500);
    expect(r.net).toBe(650);
  });
});

describe('leave engine', () => {
  it('statutory entitlements with seniority step-ups', () => {
    expect(annualEntitlementDays('SA', 3)).toBe(21);
    expect(annualEntitlementDays('SA', 6)).toBe(30); // Art 109
    expect(annualEntitlementDays('QA', 3)).toBe(21);
    expect(annualEntitlementDays('QA', 6)).toBe(28); // Arts 79–81
    expect(annualEntitlementDays('AE', 10)).toBe(30);
    expect(annualEntitlementDays('OM', 1)).toBe(30);
  });

  it('balance = accrued − used; over-use is flagged', () => {
    expect(leaveBalance(30, 12)).toMatchObject({ balance: 18, overused: false, overusedBy: 0 });
    const over = leaveBalance(10, 15);
    expect(over.overused).toBe(true);
    expect(over.overusedBy).toBe(5);
    expect(over.balance).toBe(-5);
  });

  it('accruedLeave pro-rates the entitlement', () => {
    expect(accruedLeave(30, 2.5)).toBe(75);
  });
});

describe('notice engine', () => {
  it('adds calendar days in UTC', () => {
    expect(lastWorkingDay('2026-10-01', 30)).toBe('2026-10-31');
    expect(lastWorkingDay('2026-12-01', 30)).toBe('2026-12-31');
  });

  it('crosses month ends correctly', () => {
    // Jan 31 + 30 days = Mar 2 (2026 is not a leap year).
    expect(lastWorkingDay('2026-01-31', 30)).toBe('2026-03-02');
    expect(addDaysISO('2026-02-28', 1)).toBe('2026-03-01');
  });

  it('validates dates strictly', () => {
    expect(isValidISODate('2026-02-30')).toBe(false); // no such day
    expect(isValidISODate('2026-13-01')).toBe(false);
    expect(isValidISODate('2026-10-01')).toBe(true);
    expect(() => addDaysISO('2026-02-30', 5)).toThrow(RangeError);
    expect(() => addDaysISO('2026-10-01', -1)).toThrow(RangeError);
  });
});

describe('yearsBetweenISO', () => {
  it('measures fractional years between dates', () => {
    expect(approx(yearsBetweenISO('2020-01-01', '2021-01-01'), 366 / 365.25, 0.001)).toBe(true);
    expect(Number.isNaN(yearsBetweenISO('2021-01-01', '2020-01-01'))).toBe(true);
  });
});
