/**
 * engine/vat.ts — VAT calculator engine (Phase 3).
 *
 * Rates come from src/data/vat.ts (verified 2026-09-30; see docs/SOURCES.md).
 * Qatar and Kuwait have no VAT implemented — the engine reports that instead
 * of computing with a 0% rate, so the UI can say so explicitly.
 */
import { VAT, type GccCountryCode } from '../data/index.js';

export type VatMode = 'exclusive' | 'inclusive';

export interface VatResult {
  implemented: boolean;
  ratePercent: number;
  /** Amount before VAT. */
  net: number;
  /** VAT amount. */
  vat: number;
  /** Amount including VAT. */
  gross: number;
}

export function calculateVat(
  code: GccCountryCode,
  amount: number,
  mode: VatMode,
): VatResult {
  if (!Number.isFinite(amount) || amount < 0) {
    throw new RangeError(`amount must be a finite number >= 0 (got ${amount})`);
  }
  const info = VAT[code];
  if (!info.implemented) {
    return { implemented: false, ratePercent: 0, net: amount, vat: 0, gross: amount };
  }
  const r = info.ratePercent / 100;
  if (mode === 'exclusive') {
    const vat = amount * r;
    return { implemented: true, ratePercent: info.ratePercent, net: amount, vat, gross: amount + vat };
  }
  const net = amount / (1 + r);
  return {
    implemented: true,
    ratePercent: info.ratePercent,
    net,
    vat: amount - net,
    gross: amount,
  };
}
