/**
 * scripts/vat-calculator.ts — client wiring for the VAT calculator.
 *
 * Country selector covers all six states; Qatar and Kuwait show an
 * explicit "not implemented" notice instead of a 0% calculation.
 */
import { calculateVat, type VatMode } from '../engine/vat.js';
import type { GccCountryCode } from '../data/index.js';
import { fill, type Dict } from '../i18n/dict.js';
import { formatMoney, getNumberFormatter, type ScriptLocale } from './format.js';

interface VatCountryCfg {
  code: GccCountryCode;
  name: string;
  currencyCode: string;
  implemented: boolean;
  rate: number;
  authority: string;
}

interface VatConfig {
  locale: ScriptLocale;
  countries: VatCountryCfg[];
  strings: { tool: Dict['tools']['vat']; common: Dict['common'] };
}

export function initVat(): void {
  const cfgEl = document.getElementById('vat-config');
  if (!cfgEl) return;
  const cfg = JSON.parse(cfgEl.textContent ?? '{}') as VatConfig;
  const t = cfg.strings.tool;
  const { locale } = cfg;
  const fmt = getNumberFormatter(locale);

  const countrySelEl = document.getElementById('vat-country') as HTMLSelectElement | null;
  if (!countrySelEl) return;
  const countrySel: HTMLSelectElement = countrySelEl;
  countrySel.innerHTML = cfg.countries
    .map((c) => `<option value="${c.code}">${c.name}</option>`)
    .join('');

  function current(): VatCountryCfg {
    return cfg.countries.find((c) => c.code === countrySel.value) ?? cfg.countries[0];
  }
  function setHtml(id: string, html: string): void {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  }
  function show(id: string, visible: boolean): void {
    document.getElementById(id)?.classList.toggle('hidden', !visible);
  }
  function mode(): VatMode {
    const checked = document.querySelector<HTMLInputElement>('input[name="vat-mode"]:checked');
    return checked?.value === 'inclusive' ? 'inclusive' : 'exclusive';
  }

  function render(): void {
    const country = current();
    const raw = (document.getElementById('vat-amount') as HTMLInputElement)?.value.trim() ?? '';
    if (!country.implemented) {
      setHtml('vat-result-body', `<p>${fill(t.notImplemented, { country: country.name })}</p>`);
      show('vat-result', true);
      show('vat-errors', false);
      return;
    }
    if (raw === '') {
      show('vat-result', false);
      show('vat-errors', false);
      return;
    }
    const amount = Number(raw);
    if (!Number.isFinite(amount) || amount < 0) {
      show('vat-result', false);
      setHtml('vat-errors', `<p>${t.validation.amount}</p>`);
      show('vat-errors', true);
      return;
    }
    show('vat-errors', false);
    const r = calculateVat(country.code, amount, mode());
    const money = (n: number) => formatMoney(locale, n, country.currencyCode);
    const row = (label: string, value: string, big = false) => `
      <div class="flex items-baseline justify-between gap-4 border-b border-brand-100 py-2.5 last:border-0">
        <span class="${big ? 'font-extrabold text-brand-950' : 'text-brand-700'}">${label}</span>
        <span class="${big ? 'text-2xl font-black text-brand-950' : 'font-bold text-brand-950'}">${value}</span>
      </div>`;
    setHtml(
      'vat-result-body',
      row(t.net, money(r.net)) +
        row(`${t.vatAmount} (${fmt.format(r.ratePercent)}%)`, money(r.vat)) +
        row(t.gross, money(r.gross), true) +
        `<p class="mt-3 text-xs leading-5 text-brand-500">${fill(t.rateNote, {
          country: country.name,
          rate: fmt.format(r.ratePercent),
          authority: country.authority,
        })}</p>`,
    );
    show('vat-result', true);
  }

  document.getElementById('vat-form')?.addEventListener('input', render);
  document.getElementById('vat-form')?.addEventListener('change', render);
  document.getElementById('vat-form')?.addEventListener('submit', (e) => e.preventDefault());
  render();
}
