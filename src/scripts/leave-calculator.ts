/**
 * scripts/leave-calculator.ts — client wiring for the leave-balance calculator.
 *
 * The statutory yearly entitlement is derived from the engine (with the
 * Saudi/Qatari seniority step-ups); accrued leave is pre-filled but
 * editable, since real balances depend on carry-over policies.
 */
import { annualEntitlementDays, accruedLeave, leaveBalance } from '../engine/leave.js';
import type { GccCountryCode } from '../data/index.js';
import { fill, type Dict } from '../i18n/dict.js';
import { getNumberFormatter, type ScriptLocale } from './format.js';

interface LeaveCountryCfg {
  code: GccCountryCode;
  name: string;
}

interface LeaveConfig {
  locale: ScriptLocale;
  countries: LeaveCountryCfg[];
  strings: { tool: Dict['tools']['leave']; common: Dict['common'] };
}

export function initLeave(): void {
  const cfgEl = document.getElementById('leave-config');
  if (!cfgEl) return;
  const cfg = JSON.parse(cfgEl.textContent ?? '{}') as LeaveConfig;
  const t = cfg.strings.tool;
  const { locale } = cfg;
  const fmt = getNumberFormatter(locale);

  const countrySelEl = document.getElementById('leave-country') as HTMLSelectElement | null;
  const yearsInputEl = document.getElementById('leave-years') as HTMLInputElement | null;
  const accruedInputEl = document.getElementById('leave-accrued') as HTMLInputElement | null;
  if (!countrySelEl || !yearsInputEl || !accruedInputEl) return;
  const countrySel: HTMLSelectElement = countrySelEl;
  const yearsInput: HTMLInputElement = yearsInputEl;
  const accruedInput: HTMLInputElement = accruedInputEl;

  countrySel.innerHTML = cfg.countries
    .map((c) => `<option value="${c.code}">${c.name}</option>`)
    .join('');

  function current(): LeaveCountryCfg {
    return cfg.countries.find((c) => c.code === countrySel.value) ?? cfg.countries[0];
  }
  function setHtml(id: string, html: string): void {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  }
  function show(id: string, visible: boolean): void {
    document.getElementById(id)?.classList.toggle('hidden', !visible);
  }

  let accruedTouched = false;
  accruedInput.addEventListener('input', () => {
    accruedTouched = true;
  });

  function render(prefill = false): void {
    const country = current();
    const yearsRaw = yearsInput.value.trim();
    const years = yearsRaw === '' ? 0 : Number(yearsRaw);
    if (!Number.isFinite(years) || years < 0 || years > 70) {
      show('leave-result', false);
      setHtml('leave-errors', `<p>${t.validation.numbers}</p>`);
      show('leave-errors', true);
      return;
    }
    const entitlement = annualEntitlementDays(country.code, years);
    setHtml(
      'leave-entitlement',
      `<span class="text-brand-700">${t.entitlement}:</span>
       <span class="font-extrabold text-brand-950">${fill(t.daysUnit, { n: fmt.format(entitlement) })}</span>`,
    );
    show('leave-entitlement', true);

    if (prefill || !accruedTouched) {
      accruedInput.value = String(Math.round(accruedLeave(entitlement, years) * 100) / 100);
    }
    const accruedRaw = accruedInput.value.trim();
    const usedRaw =
      (document.getElementById('leave-used') as HTMLInputElement)?.value.trim() ?? '';
    const accrued = accruedRaw === '' ? 0 : Number(accruedRaw);
    const used = usedRaw === '' ? 0 : Number(usedRaw);
    if (
      !Number.isFinite(accrued) ||
      accrued < 0 ||
      !Number.isFinite(used) ||
      used < 0
    ) {
      show('leave-result', false);
      setHtml('leave-errors', `<p>${t.validation.numbers}</p>`);
      show('leave-errors', true);
      return;
    }
    show('leave-errors', false);
    const r = leaveBalance(accrued, used);
    const balanceText = r.overused
      ? `<p class="font-extrabold text-red-700">${t.overused}</p>
         <p class="mt-1 text-sm leading-6 text-brand-700">${fill(t.overusedBy, {
           n: fill(t.daysUnit, { n: fmt.format(Math.round(r.overusedBy * 100) / 100) }),
         })}</p>`
      : `<p class="text-sm text-brand-700">${t.balance}</p>
         <p class="text-3xl font-black text-brand-950">${fill(t.daysUnit, {
           n: fmt.format(Math.round(r.balance * 100) / 100),
         })}</p>`;
    setHtml('leave-result-body', balanceText);
    show('leave-result', true);
  }

  countrySel.addEventListener('change', () => {
    accruedTouched = false;
    render(true);
  });
  yearsInput.addEventListener('input', () => {
    render(true);
  });
  document.getElementById('leave-form')?.addEventListener('input', (e) => {
    if ((e.target as HTMLElement).id !== 'leave-years') render();
  });
  document.getElementById('leave-form')?.addEventListener('submit', (e) => e.preventDefault());
  render(true);
}
