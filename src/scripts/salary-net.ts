/**
 * scripts/salary-net.ts — client wiring for the net-salary calculator.
 *
 * One page with a country selector: component inputs rebuild per country
 * from the Phase 2 salary structures. Deduction amounts are always
 * user-entered (we assume no rates — see the honesty note in the UI).
 */
import { calculateSalaryNet } from '../engine/salaryNet.js';
import type { GccCountryCode } from '../data/index.js';
import { fill, type Dict } from '../i18n/dict.js';
import { formatMoney, type ScriptLocale } from './format.js';

interface CountryCfg {
  code: GccCountryCode;
  name: string;
  currencyCode: string;
  components: Array<{ id: string; name: string; included: boolean }>;
}

interface SalaryNetConfig {
  locale: ScriptLocale;
  countries: CountryCfg[];
  strings: { tool: Dict['tools']['salaryNet']; common: Dict['common'] };
}

function val(id: string): string {
  return (document.getElementById(id) as HTMLInputElement | null)?.value.trim() ?? '';
}

export function initSalaryNet(): void {
  const cfgEl = document.getElementById('salarynet-config');
  if (!cfgEl) return;
  const cfg = JSON.parse(cfgEl.textContent ?? '{}') as SalaryNetConfig;
  const t = cfg.strings.tool;
  const { locale } = cfg;

  const countrySelEl = document.getElementById('salarynet-country') as HTMLSelectElement | null;
  const earningsBoxEl = document.getElementById('salarynet-earnings');
  const deductionsBoxEl = document.getElementById('salarynet-deductions');
  if (!countrySelEl || !earningsBoxEl || !deductionsBoxEl) return;
  const countrySel: HTMLSelectElement = countrySelEl;
  const earningsBox: HTMLElement = earningsBoxEl;
  const deductionsBox: HTMLElement = deductionsBoxEl;

  countrySel.innerHTML = cfg.countries
    .map((c) => `<option value="${c.code}">${c.name}</option>`)
    .join('');

  function currentCountry(): CountryCfg {
    return cfg.countries.find((c) => c.code === countrySel.value) ?? cfg.countries[0];
  }

  const money = (n: number) => formatMoney(locale, n, currentCountry().currencyCode);

  const inputCls =
    'w-full rounded-xl border border-brand-200 bg-white px-4 py-2.5 text-brand-950 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-300';

  function buildEarnings(): void {
    const country = currentCountry();
    earningsBox!.innerHTML = country.components
      .map(
        (k) => `
      <div>
        <label for="sn-earn-${k.id}" class="mb-1 flex items-center justify-between text-sm font-semibold text-brand-800">
          <span>${k.name}</span>
          ${
            k.included
              ? `<span class="rounded-full bg-gold-100 px-2 py-0.5 text-[11px] font-bold text-gold-800">EOS</span>`
              : ''
          }
        </label>
        <input id="sn-earn-${k.id}" data-earn="${k.id}" type="number" min="0" step="any" inputmode="decimal"
          placeholder="0" class="${inputCls}" />
      </div>`,
      )
      .join('');
  }

  function deductionRow(): string {
    return `
      <div class="flex items-end gap-2" data-deduction-row>
        <div class="flex-1">
          <label class="mb-1 block text-sm font-semibold text-brand-800">${t.deductionName}</label>
          <input type="text" data-ded-label placeholder="${t.deductionPlaceholder}" class="${inputCls}" />
        </div>
        <div class="w-32">
          <label class="mb-1 block text-sm font-semibold text-brand-800">${t.totalDeductions}</label>
          <input type="number" min="0" step="any" inputmode="decimal" data-ded-amount placeholder="0" class="${inputCls}" />
        </div>
        <button type="button" data-ded-remove
          class="rounded-xl border border-brand-200 px-3 py-2.5 text-sm font-semibold text-brand-600 transition hover:border-red-300 hover:text-red-600">
          ${t.removeDeduction}
        </button>
      </div>`;
  }

  function setHtml(id: string, html: string): void {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  }
  function show(id: string, visible: boolean): void {
    document.getElementById(id)?.classList.toggle('hidden', !visible);
  }

  deductionsBox.innerHTML = deductionRow();
  document.getElementById('salarynet-add-deduction')?.addEventListener('click', () => {
    deductionsBox.insertAdjacentHTML('beforeend', deductionRow());
  });
  deductionsBox.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest('[data-ded-remove]');
    if (!btn) return;
    const rows = deductionsBox.querySelectorAll('[data-deduction-row]');
    if (rows.length > 1) btn.closest('[data-deduction-row]')?.remove();
  });

  function render(): void {
    const country = currentCountry();
    const earnings: Array<{ id: string; amount: number }> = [];
    let valid = true;
    for (const k of country.components) {
      const raw = val(`sn-earn-${k.id}`);
      if (raw === '') continue;
      const v = Number(raw);
      if (!Number.isFinite(v) || v < 0) {
        valid = false;
        break;
      }
      earnings.push({ id: k.id, amount: v });
    }
    const deductions: Array<{ label: string; amount: number }> = [];
    deductionsBox.querySelectorAll('[data-deduction-row]').forEach((row) => {
      const label =
        (row.querySelector('[data-ded-label]') as HTMLInputElement)?.value.trim() || '—';
      const raw = (row.querySelector('[data-ded-amount]') as HTMLInputElement)?.value.trim() ?? '';
      if (raw === '') return;
      const v = Number(raw);
      if (!Number.isFinite(v) || v < 0) valid = false;
      else deductions.push({ label, amount: v });
    });
    if (!valid) {
      show('salarynet-result', false);
      setHtml('salarynet-errors', `<p>${t.validation.amount}</p>`);
      show('salarynet-errors', true);
      return;
    }
    show('salarynet-errors', false);
    const r = calculateSalaryNet(country.code, earnings, deductions);
    const row = (label: string, value: string, big = false) => `
      <div class="flex items-baseline justify-between gap-4 border-b border-brand-100 py-2.5 last:border-0">
        <span class="${big ? 'font-extrabold text-brand-950' : 'text-brand-700'}">${label}</span>
        <span class="${big ? 'text-2xl font-black text-brand-950' : 'font-bold text-brand-950'}">${value}</span>
      </div>`;
    setHtml(
      'salarynet-result-body',
      row(t.gross, money(r.gross)) +
        row(t.totalDeductions, `− ${money(r.totalDeductions)}`) +
        row(t.net, money(r.net), true) +
        `<div class="mt-3 rounded-xl bg-gold-50 p-4">
           <p class="text-sm font-extrabold text-brand-950">${t.eosBasis}: ${money(r.eosBasis)}</p>
           <p class="mt-1 text-xs leading-5 text-brand-600">${fill(t.eosBasisHint, { country: country.name })}</p>
         </div>`,
    );
    show('salarynet-result', true);
  }

  countrySel.addEventListener('change', () => {
    buildEarnings();
    render();
  });
  document.getElementById('salarynet-form')?.addEventListener('input', render);
  document.getElementById('salarynet-form')?.addEventListener('submit', (e) => e.preventDefault());
  document.getElementById('salarynet-add-deduction')?.addEventListener('click', render);

  buildEarnings();
  render();
}
