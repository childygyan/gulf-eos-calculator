/**
 * tests/data.test.ts — Phase 2 labor-law data model.
 *
 * Two layers:
 * 1. Integrity: every country carries all required fields, tiers are
 *    sorted and numeric, resignation bands are contiguous, every legal
 *    figure cites an official source URL.
 * 2. Formula sanity: the data-layer helpers reproduce the official
 *    worked examples cited in docs/SOURCES.md (labeled per source).
 */
import { describe, expect, it } from 'vitest';
import {
  COUNTRY_CODES,
  EOS_RULES,
  VAT,
  EMPLOYMENT,
  SALARY_STRUCTURES,
  accrueEos,
  scenarioAward,
  BH_SIO_RATES,
  OM_OLD_TIERS,
  KW_DAILY_DIVISOR,
  QA_WEEKS_TO_MONTHS,
  type CountryEosRules,
  type GccCountryCode,
} from '../src/data/index.js';

const approx = (a: number, b: number, tol = 0.01) => Math.abs(a - b) <= tol;

function scenario(rules: CountryEosRules, id: 'termination' | 'resignation') {
  const s = rules.scenarios.find((x) => x.id === id);
  expect(s, `${rules.code} missing ${id} scenario`).toBeDefined();
  return s!;
}

describe('data integrity — coverage', () => {
  it('covers all six GCC countries in every dataset', () => {
    const codes = [...COUNTRY_CODES].sort();
    expect(codes).toEqual(['AE', 'BH', 'KW', 'OM', 'QA', 'SA']);
    for (const code of COUNTRY_CODES) {
      expect(EOS_RULES[code], `EOS_RULES.${code}`).toBeDefined();
      expect(VAT[code], `VAT.${code}`).toBeDefined();
      expect(EMPLOYMENT[code], `EMPLOYMENT.${code}`).toBeDefined();
      expect(SALARY_STRUCTURES[code], `SALARY_STRUCTURES.${code}`).toBeDefined();
    }
  });

  it('every country has termination + resignation scenarios', () => {
    for (const code of COUNTRY_CODES) {
      const rules = EOS_RULES[code];
      expect(rules.scenarios.map((s) => s.id).sort()).toEqual(['resignation', 'termination']);
    }
  });
});

describe('data integrity — tiers and numbers', () => {
  it('tier bands are sorted by upToYears (open-ended last), rates positive and finite', () => {
    for (const code of COUNTRY_CODES) {
      for (const s of EOS_RULES[code].scenarios) {
        expect(s.tiers.length, `${code}.${s.id} tiers`).toBeGreaterThan(0);
        let prevEnd = 0;
        s.tiers.forEach((t, i) => {
          expect(Number.isFinite(t.rateMonthsPerYear), `${code}.${s.id} tier ${i} rate`).toBe(true);
          expect(t.rateMonthsPerYear, `${code}.${s.id} tier ${i} rate > 0`).toBeGreaterThan(0);
          if (t.upToYears === null) {
            expect(i, `${code}.${s.id} open-ended tier must be last`).toBe(s.tiers.length - 1);
          } else {
            expect(t.upToYears, `${code}.${s.id} tier ${i} ascending`).toBeGreaterThan(prevEnd);
            prevEnd = t.upToYears;
          }
        });
        expect(Number.isFinite(s.minServiceYears)).toBe(true);
        expect(s.minServiceYears).toBeGreaterThanOrEqual(0);
        if (s.capMonths !== null) {
          expect(Number.isFinite(s.capMonths)).toBe(true);
          expect(s.capMonths).toBeGreaterThan(0);
        }
      }
    }
  });

  it('resignation bands are contiguous from 0 and fractions are in (0, 1]', () => {
    for (const code of COUNTRY_CODES) {
      for (const s of EOS_RULES[code].scenarios) {
        if (!s.resignationBands) continue;
        const bands = [...s.resignationBands].sort((a, b) => a.fromYears - b.fromYears);
        expect(bands[0].fromYears, `${code} first band`).toBeLessThanOrEqual(s.minServiceYears);
        let expectedFrom = bands[0].fromYears;
        bands.forEach((b, i) => {
          expect(b.fromYears, `${code} band ${i} contiguous`).toBe(expectedFrom);
          expect(b.fraction, `${code} band ${i} fraction`).toBeGreaterThan(0);
          expect(b.fraction, `${code} band ${i} fraction`).toBeLessThanOrEqual(1);
          if (b.toYears === null) {
            expect(i, `${code} open band must be last`).toBe(bands.length - 1);
          } else {
            expect(b.toYears).toBeGreaterThan(b.fromYears);
            expectedFrom = b.toYears;
          }
        });
      }
    }
  });

  it('Oman old-law tiers are sorted and positive', () => {
    let prev = 0;
    OM_OLD_TIERS.forEach((t, i) => {
      expect(t.rateMonthsPerYear).toBeGreaterThan(0);
      if (t.upToYears === null) expect(i).toBe(OM_OLD_TIERS.length - 1);
      else {
        expect(t.upToYears).toBeGreaterThan(prev);
        prev = t.upToYears;
      }
    });
  });

  it('Bahrain SIO rates are sane (8.4% > 4.2% > 0)', () => {
    expect(BH_SIO_RATES.firstThreeYears).toBeGreaterThan(0);
    expect(BH_SIO_RATES.afterThreeYears).toBeGreaterThan(BH_SIO_RATES.firstThreeYears);
  });
});

describe('data integrity — sources and honesty', () => {
  it('every country cites at least one source with a well-formed official URL', () => {
    for (const code of COUNTRY_CODES) {
      const rules = EOS_RULES[code];
      expect(rules.sources.length, `${code} sources`).toBeGreaterThan(0);
      for (const src of rules.sources) {
        expect(src.lawEn.trim(), `${code} lawEn`).not.toBe('');
        expect(src.lawAr.trim(), `${code} lawAr`).not.toBe('');
        expect(src.article.trim(), `${code} article`).not.toBe('');
        expect(src.url, `${code} url`).toMatch(/^https:\/\//);
      }
    }
  });

  it('wage-basis descriptions are non-empty and the kind is valid', () => {
    for (const code of COUNTRY_CODES) {
      const wb = EOS_RULES[code].wageBasis;
      expect(['basic', 'basic-plus-social-allowance', 'total-wage']).toContain(wb.kind);
      expect(wb.descriptionEn.trim()).not.toBe('');
      expect(wb.descriptionAr.trim()).not.toBe('');
      expect(wb.source.url).toMatch(/^https:\/\//);
    }
  });

  it('payout notes are non-empty in both languages', () => {
    for (const code of COUNTRY_CODES) {
      const rules = EOS_RULES[code];
      expect(rules.payoutEn.trim(), `${code} payoutEn`).not.toBe('');
      expect(rules.payoutAr.trim(), `${code} payoutAr`).not.toBe('');
    }
  });

  it('every salary structure includes an in-basis basic wage component', () => {
    for (const code of COUNTRY_CODES) {
      const basic = SALARY_STRUCTURES[code].components.find((c) => c.id === 'basic');
      expect(basic, `${code} basic component`).toBeDefined();
      expect(basic!.includedInEosBasis).toBe(true);
    }
  });

  it('VAT entries are consistent: not-implemented means 0% and no date', () => {
    for (const code of COUNTRY_CODES) {
      const v = VAT[code];
      expect(v.ratePercent).toBeGreaterThanOrEqual(0);
      expect(v.ratePercent).toBeLessThanOrEqual(100);
      if (!v.implemented) {
        expect(v.ratePercent).toBe(0);
        expect(v.effectiveFrom).toBeNull();
      } else {
        expect(v.ratePercent).toBeGreaterThan(0);
        expect(v.effectiveFrom).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }
    }
    expect(VAT.SA.ratePercent).toBe(15);
    expect(VAT.BH.ratePercent).toBe(10);
    expect(VAT.AE.ratePercent).toBe(5);
    expect(VAT.OM.ratePercent).toBe(5);
  });

  it('employment terms are sane (positive leave and notice days)', () => {
    for (const code of COUNTRY_CODES) {
      const e = EMPLOYMENT[code];
      expect(e.annualLeave.daysPerYear).toBeGreaterThan(0);
      expect(e.notice.length).toBeGreaterThan(0);
      for (const n of e.notice) {
        expect(n.employeeDays).toBeGreaterThan(0);
        expect(n.employerDays).toBeGreaterThan(0);
      }
    }
  });
});

describe('formula sanity — official worked examples', () => {
  it('Saudi: SAR 6,000 × 8 yrs termination → 33,000 (Art 84)', () => {
    // Source: indianinq8.com GCC indemnity guide (Art 84 worked example):
    // 5 × 3,000 + 3 × 6,000 = 33,000.
    const s = scenario(EOS_RULES.SA, 'termination');
    expect(scenarioAward(s, 8, 6000)).toBe(33000);
  });

  it('Saudi: resignation at 8 yrs → 2/3 of award; at 1 yr → 0 (Art 85)', () => {
    const s = scenario(EOS_RULES.SA, 'resignation');
    expect(scenarioAward(s, 8, 6000)).toBe(22000);
    expect(scenarioAward(s, 1, 6000)).toBe(0);
    expect(scenarioAward(s, 10, 6000)).toBe(45000); // full award at 10+
  });

  it('UAE: AED 18,000 basic × 8 yrs → 117,000, under the 2-year cap (Art 51)', () => {
    // (5 × 21 + 3 × 30) days × (18,000 ÷ 30) = 195 × 600 = 117,000.
    const s = scenario(EOS_RULES.AE, 'termination');
    expect(scenarioAward(s, 8, 18000)).toBe(117000);
    expect(scenarioAward(s, 0.9, 18000)).toBe(0); // under 1 year: nothing
    // Resignation is identical (no reduction since 2022).
    expect(scenarioAward(scenario(EOS_RULES.AE, 'resignation'), 8, 18000)).toBe(117000);
  });

  it('UAE: cap binds at 24 months (Art 51(6))', () => {
    const s = scenario(EOS_RULES.AE, 'termination');
    // 40 years uncapped: (5×0.7 + 35×1.0) × 1000 = 38,500 → capped at 24,000.
    expect(scenarioAward(s, 40, 1000)).toBe(24000);
  });

  it('Kuwait: KD 500 × 6 yrs resignation → ≈1,294.87 (Art 51/53)', () => {
    // Source: arabtimesonline.com worked example: 5 × (500÷26×15) + 500 =
    // 1,942.25; × 2/3 (5–10 yrs) = 1,294.83. Tolerance covers ÷26 rounding.
    const s = scenario(EOS_RULES.KW, 'resignation');
    const got = scenarioAward(s, 6, 500);
    expect(approx(got, 1294.83, 0.1)).toBe(true);
    expect(approx(accrueEos(s.tiers, 5, 500), 5 * ((500 / KW_DAILY_DIVISOR) * 15), 0.01)).toBe(true);
  });

  it('Kuwait: resignation under 3 yrs → 0 (Art 53)', () => {
    expect(scenarioAward(scenario(EOS_RULES.KW, 'resignation'), 2, 500)).toBe(0);
  });

  it('Qatar: QAR 4,000 × 5 yrs → 14,000 (Art 54: 3 weeks/year minimum)', () => {
    // 5 × (21/30) × 4,000 = 14,000. Matches indianinq8.com's example
    // (QAR 4,000 ÷ 4.333 ≈ 923/week; 3 weeks ≈ 2,769/yr × 5 ≈ 13,845).
    const s = scenario(EOS_RULES.QA, 'termination');
    expect(scenarioAward(s, 5, 4000)).toBe(14000);
    expect(QA_WEEKS_TO_MONTHS).toBeCloseTo(0.7, 10);
  });

  it('Bahrain: BHD 600 × 4 yrs → 1,500 (Art 116)', () => {
    // (3 × 0.5 + 1 × 1.0) × 600 = 1,500.
    const s = scenario(EOS_RULES.BH, 'termination');
    expect(scenarioAward(s, 4, 600)).toBe(1500);
    // Resignation is identical (no statutory reduction).
    expect(scenarioAward(scenario(EOS_RULES.BH, 'resignation'), 4, 600)).toBe(1500);
  });

  it('Oman: OMR 500 × 5 yrs (new regime) → 2,500 (Art 61)', () => {
    // Source: standard worked example — 500 × 5 = 2,500.
    const s = scenario(EOS_RULES.OM, 'termination');
    expect(scenarioAward(s, 5, 500)).toBe(2500);
  });

  it('Oman: old-law tiers — OMR 500 × 4 yrs pre-2023 → 1,250', () => {
    // Old formula (RD 35/2003 Art 39): (3 × 0.5 + 1 × 1.0) × 500 = 1,250.
    expect(accrueEos([...OM_OLD_TIERS], 4, 500)).toBe(1250);
  });

  it('pro-rata fractions work for partial years', () => {
    // Saudi: 2.5 years termination → (2.5 × 0.5) × 6000 = 7,500.
    expect(scenarioAward(scenario(EOS_RULES.SA, 'termination'), 2.5, 6000)).toBe(7500);
    // UAE: 1.5 years → 1.5 × 0.7 × 18000 = 18,900.
    expect(approx(scenarioAward(scenario(EOS_RULES.AE, 'termination'), 1.5, 18000), 18900)).toBe(true);
  });
});

describe('cross-country sanity', () => {
  it('a 5-year termination award never exceeds the statutory cap', () => {
    const cases: Array<[GccCountryCode, number]> = [
      ['SA', 10000],
      ['AE', 10000],
      ['KW', 10000],
      ['QA', 10000],
      ['BH', 10000],
      ['OM', 10000],
    ];
    for (const [code, wage] of cases) {
      const s = scenario(EOS_RULES[code], 'termination');
      const award = scenarioAward(s, 5, wage);
      expect(Number.isFinite(award)).toBe(true);
      expect(award).toBeGreaterThanOrEqual(0);
      if (s.capMonths !== null) expect(award).toBeLessThanOrEqual(s.capMonths * wage);
    }
  });
});
