/**
 * scripts/notice-calculator.ts — client wiring for the notice-period calculator.
 *
 * Country → notice rule (from src/data/employment.ts) → party → statutory
 * days pre-filled (editable) → notice date → last working day.
 */
import { lastWorkingDay } from '../engine/notice.js';
import type { GccCountryCode } from '../data/index.js';
import { fill, type Dict } from '../i18n/dict.js';
import { formatDateISO, getNumberFormatter, type ScriptLocale } from './format.js';

interface NoticeRuleCfg {
  employeeDays: number;
  employerDays: number;
  appliesTo: string;
}

interface NoticeCountryCfg {
  code: GccCountryCode;
  name: string;
  notice: NoticeRuleCfg[];
}

interface NoticeConfig {
  locale: ScriptLocale;
  countries: NoticeCountryCfg[];
  strings: { tool: Dict['tools']['notice']; common: Dict['common'] };
}

export function initNotice(): void {
  const cfgEl = document.getElementById('notice-config');
  if (!cfgEl) return;
  const cfg = JSON.parse(cfgEl.textContent ?? '{}') as NoticeConfig;
  const t = cfg.strings.tool;
  const { locale } = cfg;
  const fmt = getNumberFormatter(locale);

  const countrySelEl = document.getElementById('notice-country') as HTMLSelectElement | null;
  const ruleSelEl = document.getElementById('notice-rule') as HTMLSelectElement | null;
  const partySelEl = document.getElementById('notice-party') as HTMLSelectElement | null;
  const daysInputEl = document.getElementById('notice-days') as HTMLInputElement | null;
  const startInputEl = document.getElementById('notice-start') as HTMLInputElement | null;
  if (!countrySelEl || !ruleSelEl || !partySelEl || !daysInputEl || !startInputEl) return;
  const countrySel: HTMLSelectElement = countrySelEl;
  const ruleSel: HTMLSelectElement = ruleSelEl;
  const partySel: HTMLSelectElement = partySelEl;
  const daysInput: HTMLInputElement = daysInputEl;
  const startInput: HTMLInputElement = startInputEl;

  countrySel.innerHTML = cfg.countries
    .map((c) => `<option value="${c.code}">${c.name}</option>`)
    .join('');
  partySel.innerHTML = `
    <option value="employee">${t.partyEmployee}</option>
    <option value="employer">${t.partyEmployer}</option>`;

  function current(): NoticeCountryCfg {
    return cfg.countries.find((c) => c.code === countrySel.value) ?? cfg.countries[0];
  }
  function setHtml(id: string, html: string): void {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  }
  function show(id: string, visible: boolean): void {
    document.getElementById(id)?.classList.toggle('hidden', !visible);
  }

  let daysTouched = false;
  daysInput.addEventListener('input', () => {
    daysTouched = true;
  });

  function rebuildRules(): void {
    const country = current();
    ruleSel.innerHTML = country.notice
      .map((n, i) => `<option value="${i}">${n.appliesTo}</option>`)
      .join('');
    daysTouched = false;
  }

  function prefillDays(): void {
    const rule = current().notice[Number(ruleSel.value)] ?? current().notice[0];
    const party = partySel.value === 'employer' ? 'employer' : 'employee';
    daysInput.value = String(party === 'employer' ? rule.employerDays : rule.employeeDays);
  }

  function render(): void {
    if (!daysTouched) prefillDays();
    const start = startInput.value.trim();
    const daysRaw = daysInput.value.trim();
    if (start === '') {
      show('notice-result', false);
      show('notice-errors', false);
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(start)) {
      show('notice-result', false);
      setHtml('notice-errors', `<p>${t.validation.date}</p>`);
      show('notice-errors', true);
      return;
    }
    const days = Number(daysRaw);
    if (!Number.isInteger(days) || days <= 0 || days > 3660) {
      show('notice-result', false);
      setHtml('notice-errors', `<p>${t.validation.days}</p>`);
      show('notice-errors', true);
      return;
    }
    show('notice-errors', false);
    let end: string;
    try {
      end = lastWorkingDay(start, days);
    } catch {
      show('notice-result', false);
      setHtml('notice-errors', `<p>${t.validation.date}</p>`);
      show('notice-errors', true);
      return;
    }
    setHtml(
      'notice-result-body',
      `<p class="text-sm text-brand-700">${t.lastDay}</p>
       <p class="mt-1 text-3xl font-black text-brand-950">${formatDateISO(locale, end)}</p>
       <p class="mt-3 text-sm leading-6 text-brand-600">${fill(t.resultLine, {
         start: formatDateISO(locale, start),
         days: fill(t.daysUnit, { n: fmt.format(days) }),
         end: formatDateISO(locale, end),
       })}</p>`,
    );
    show('notice-result', true);
  }

  countrySel.addEventListener('change', () => {
    rebuildRules();
    render();
  });
  ruleSel.addEventListener('change', render);
  partySel.addEventListener('change', () => {
    daysTouched = false;
    render();
  });
  document.getElementById('notice-form')?.addEventListener('input', render);
  document.getElementById('notice-form')?.addEventListener('change', render);
  document.getElementById('notice-form')?.addEventListener('submit', (e) => e.preventDefault());

  rebuildRules();
  render();
}
