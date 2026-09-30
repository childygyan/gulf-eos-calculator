/**
 * scripts/eos-calculator.ts — client wiring for the per-country EOS pages.
 *
 * Reads its config from <script type="application/json" id="eos-config">,
 * builds the scenario radios + wage-component inputs from it, and renders
 * an instant step-by-step breakdown on every change (after the first
 * explicit calculation). All math runs through src/engine/eos.ts.
 */
import { calculateEos, type EosAssumptionKey } from '../engine/eos.js';
import type { GccCountryCode } from '../data/index.js';
import { fill, type Dict } from '../i18n/dict.js';
import {
  formatMoney,
  formatYears,
  getNumberFormatter,
  type ScriptLocale,
} from './format.js';

/** Engine kebab-case assumption keys → dictionary camelCase keys. */
const ASSUMPTION_KEY_MAP: Record<EosAssumptionKey, keyof Dict['eos']['assumptions']> = {
  'qatar-weeks-divisor': 'qatarWeeksDivisor',
  'kuwait-daily-divisor': 'kuwaitDailyDivisor',
  'oman-old-divisor': 'omanOldDivisor',
  'saudi-wage-reading': 'saudiWageReading',
  'om-no-start-date': 'omNoStartDate',
  'bh-no-start-date': 'bhNoStartDate',
};

interface ScenarioCfg {
  id: 'termination' | 'resignation';
  label: string;
  min: number;
}

interface ComponentCfg {
  id: string;
  name: string;
  included: boolean;
  note: string | null;
}

interface EosConfig {
  code: GccCountryCode;
  locale: ScriptLocale;
  currency: { code: string; name: string };
  scenarios: ScenarioCfg[];
  components: ComponentCfg[];
  showDates: boolean;
  dateHint: string;
  cutoffLabel: string;
  strings: { eos: Dict['eos']; common: Dict['common'] };
}

function rateDesc(cfg: EosConfig, rate: number): string {
  const s = cfg.strings.eos;
  const close = (a: number, b: number) => Math.abs(a - b) < 1e-9;
  if (close(rate, 0.5)) return s.rateHalf;
  if (close(rate, 1)) return s.rateFull;
  if (close(rate, 21 / 30)) {
    // Same numeric value, different legal meaning per country.
    return cfg.code === 'QA' ? fill(s.rateWeeks, { n: 3 }) : fill(s.rateDays, { n: 21 });
  }
  if (close(rate, 15 / 26)) return fill(s.rateDays, { n: 15 });
  return fill(s.rateMonths, {
    n: getNumberFormatter(cfg.locale).format(Math.round(rate * 100) / 100),
  });
}

function inputValue(id: string): string {
  return (document.getElementById(id) as HTMLInputElement | null)?.value.trim() ?? '';
}

function setHtml(id: string, html: string): void {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
}

function show(id: string, visible: boolean): void {
  document.getElementById(id)?.classList.toggle('hidden', !visible);
}

function selectedScenario(): 'termination' | 'resignation' {
  const checked = document.querySelector<HTMLInputElement>('input[name="eos-scenario"]:checked');
  return checked?.value === 'resignation' ? 'resignation' : 'termination';
}

export function initEosCalculator(): void {
  const cfgEl = document.getElementById('eos-config');
  const form = document.getElementById('eos-form') as HTMLFormElement | null;
  if (!cfgEl || !form) return;
  const cfg = JSON.parse(cfgEl.textContent ?? '{}') as EosConfig;
  const s = cfg.strings.eos;
  const { locale } = cfg;
  const money = (n: number) => formatMoney(locale, n, cfg.currency.code);

  // --- Build scenario radios ---
  setHtml(
    'eos-scenarios',
    cfg.scenarios
      .map(
        (sc, i) => `
      <label class="radio-card flex cursor-pointer items-center gap-3 rounded-xl border border-brand-200 bg-white px-4 py-3 transition">
        <input type="radio" name="eos-scenario" value="${sc.id}" ${i === 0 ? 'checked' : ''} class="h-4 w-4 accent-gold-600" />
        <span class="font-semibold text-brand-900">${sc.label}</span>
      </label>`,
      )
      .join(''),
  );

  // --- Build wage-component inputs (included components only) ---
  const included = cfg.components.filter((k) => k.included);
  const excluded = cfg.components.filter((k) => !k.included);
  setHtml(
    'eos-components',
    included
      .map(
        (k) => `
      <div>
        <label for="eos-comp-${k.id}" class="mb-1 block text-sm font-semibold text-brand-800">${k.name}</label>
        <input id="eos-comp-${k.id}" data-component="${k.id}" type="number" min="0" step="any" inputmode="decimal"
          placeholder="0"
          class="w-full rounded-xl border border-brand-200 bg-white px-4 py-2.5 text-brand-950 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-300" />
        ${k.note ? `<p class="mt-1 text-xs leading-5 text-brand-500">${k.note}</p>` : ''}
      </div>`,
      )
      .join(''),
  );
  if (excluded.length > 0) {
    setHtml(
      'eos-excluded',
      `<p class="text-sm leading-6 text-brand-500">${fill(s.excludedNote, {
        items: excluded.map((k) => k.name).join(locale === 'ar' ? '، ' : ', '),
      })}</p>`,
    );
  }

  // --- Dates (Oman / Bahrain only) ---
  show('eos-dates', cfg.showDates);
  if (cfg.showDates) {
    const hint = document.getElementById('eos-date-hint');
    if (hint) hint.textContent = cfg.dateHint;
    const end = document.getElementById('eos-end-date') as HTMLInputElement | null;
    if (end && !end.value) end.value = new Date().toISOString().slice(0, 10);
  }

  let calculated = false;

  function readInputs():
    | { ok: true; wage: number; years: number; months: number; start: string; end: string }
    | { ok: false; errors: string[] } {
    const errors: string[] = [];
    let wage = 0;
    let wageOk = false;
    for (const k of included) {
      const raw = inputValue(`eos-comp-${k.id}`);
      if (raw === '') continue;
      const v = Number(raw);
      if (!Number.isFinite(v) || v < 0) {
        errors.push(s.validation.wage);
        break;
      }
      wageOk = true;
      wage += v;
    }
    if (!wageOk && errors.length === 0) errors.push(s.validation.wage);

    const yearsRaw = inputValue('eos-years');
    const monthsRaw = inputValue('eos-months');
    const years = yearsRaw === '' ? 0 : Number(yearsRaw);
    const months = monthsRaw === '' ? 0 : Number(monthsRaw);
    if (!Number.isInteger(years) || years < 0) errors.push(s.validation.years);
    if (!Number.isInteger(months) || months < 0 || months > 11) errors.push(s.validation.months);

    let start = '';
    let end = '';
    if (cfg.showDates) {
      start = inputValue('eos-start-date');
      end = inputValue('eos-end-date');
      const iso = /^\d{4}-\d{2}-\d{2}$/;
      if (start !== '' && !iso.test(start)) errors.push(s.validation.date);
      if (end !== '' && !iso.test(end)) errors.push(s.validation.date);
      if (start !== '' && end !== '' && start > end) errors.push(s.validation.dateOrder);
    }
    return errors.length > 0
      ? { ok: false, errors }
      : { ok: true, wage, years, months, start, end };
  }

  function render(): void {
    const parsed = readInputs();
    if (!parsed.ok) {
      show('eos-result', false);
      show('eos-ineligible', false);
      if (calculated) {
        setHtml(
          'eos-errors',
          `<ul class="list-inside list-disc space-y-1">${parsed.errors
            .map((e) => `<li>${e}</li>`)
            .join('')}</ul>`,
        );
        show('eos-errors', true);
      }
      return;
    }
    show('eos-errors', false);
    const scenario = selectedScenario();
    let result;
    try {
      result = calculateEos({
        code: cfg.code,
        scenario,
        wageBasis: parsed.wage,
        serviceYears: parsed.years,
        serviceMonths: parsed.months,
        startDate: parsed.start || undefined,
        endDate: parsed.end || undefined,
      });
    } catch {
      setHtml(
        'eos-errors',
        `<ul class="list-inside list-disc space-y-1"><li>${s.validation.dateOrder}</li></ul>`,
      );
      show('eos-errors', true);
      show('eos-result', false);
      return;
    }

    if (!result.eligible) {
      const min = cfg.scenarios.find((x) => x.id === scenario)?.min ?? 0;
      setHtml(
        'eos-ineligible-body',
        `<p class="font-extrabold text-brand-950">${s.ineligibleTitle}</p>
         <p class="mt-2 leading-7 text-brand-700">${fill(s.ineligibleBody, {
           min: formatYears(locale, min),
         })}</p>`,
      );
      show('eos-ineligible', true);
      show('eos-result', false);
      return;
    }
    show('eos-ineligible', false);

    // --- Breakdown lines ---
    const lines: string[] = [];
    const prevUpToByPortion = new Map<string, number | null>();
    for (const line of result.tierLines) {
      const portionKey = line.portion ?? 'main';
      const prevUpTo = prevUpToByPortion.get(portionKey) ?? null;
      let band: string;
      if (line.bandIndex === 0 && line.bandUpTo !== null) {
        band = fill(s.bandFirst, { n: line.bandUpTo });
      } else if (line.bandIndex === 0) {
        band = s.bandAll;
      } else {
        band = fill(s.bandAfter, { n: prevUpTo ?? '' });
      }
      prevUpToByPortion.set(portionKey, line.bandUpTo);
      let portionSuffix = '';
      if (line.portion === 'pre') portionSuffix = ` ${fill(s.portionPre, { date: cfg.cutoffLabel })}`;
      if (line.portion === 'post')
        portionSuffix = ` ${fill(s.portionPost, { date: cfg.cutoffLabel })}`;
      lines.push(
        `<li class="flex items-baseline justify-between gap-4 border-b border-brand-100 py-2.5 last:border-0">
          <span class="leading-7 text-brand-800">${fill(s.tierLine, {
            band: band + portionSuffix,
            years: formatYears(locale, line.yearsInBand),
            rate: rateDesc(cfg, line.rateMonthsPerYear),
            amount: '',
          }).replace(/ =\s*$/, '')}</span>
          <span class="shrink-0 font-extrabold text-brand-950">${money(line.amount)}</span>
        </li>`,
      );
    }

    // --- Summary rows ---
    const rows: Array<[string, string, boolean]> = [
      [s.fullAwardLine, money(result.fullAward), false],
    ];
    if (scenario === 'resignation') {
      if (result.resignationFraction < 1) {
        const pct = `${Math.round(result.resignationFraction * 100)}%`;
        rows.push([
          fill(s.resignationLine, { pct }),
          `− ${money(result.fullAward - result.afterReduction)}`,
          false,
        ]);
      } else {
        rows.push([s.noReductionLine, '', false]);
      }
    }
    if (result.capApplied && result.capMonths !== null) {
      rows.push([fill(s.capLine, { n: result.capMonths }), money(result.total), false]);
    }
    setHtml(
      'eos-breakdown',
      `<ol>${lines.join('')}</ol>
       <dl class="mt-4 space-y-2 rounded-xl bg-brand-50 p-4">
        ${rows
          .map(
            ([label, amount]) => `
          <div class="flex items-baseline justify-between gap-4">
            <dt class="text-sm leading-6 text-brand-700">${label}</dt>
            <dd class="shrink-0 font-bold text-brand-950">${amount}</dd>
          </div>`,
          )
          .join('')}
       </dl>`,
    );

    // --- Total ---
    setHtml('eos-total', money(result.total));

    // --- Transition split ---
    if (result.split?.kind === 'om-regime') {
      setHtml(
        'eos-split',
        `<p class="mb-2 font-extrabold text-brand-950">${s.splitTitleOm}</p>
         <ul class="space-y-2 text-sm leading-6 text-brand-700">
          <li class="flex items-baseline justify-between gap-4">
            <span>${s.splitPreOm} (${formatYears(locale, result.split.preYears)})</span>
            <span class="font-bold text-brand-950">${money(result.split.preAmount ?? 0)}</span>
          </li>
          <li class="flex items-baseline justify-between gap-4">
            <span>${s.splitPostOm} (${formatYears(locale, result.split.postYears)})</span>
            <span class="font-bold text-brand-950">${money(result.split.postAmount ?? 0)}</span>
          </li>
         </ul>`,
      );
      show('eos-split', true);
    } else if (result.split?.kind === 'bh-payer') {
      setHtml(
        'eos-split',
        `<p class="mb-2 font-extrabold text-brand-950">${s.splitTitleBh}</p>
         <ul class="list-inside list-disc space-y-1 text-sm leading-6 text-brand-700">
          <li>${s.splitPreBh} (${formatYears(locale, result.split.preYears)})</li>
          <li>${s.splitPostBh} (${formatYears(locale, result.split.postYears)})</li>
         </ul>`,
      );
      show('eos-split', true);
    } else {
      show('eos-split', false);
    }

    // --- Assumptions ---
    if (result.assumptions.length > 0) {
      setHtml(
        'eos-assumptions',
        `<p class="mb-2 font-extrabold text-brand-950">${s.assumptionsTitle}</p>
         <ul class="list-inside list-disc space-y-1 text-sm leading-6 text-brand-700">
          ${result.assumptions.map((k) => `<li>${s.assumptions[ASSUMPTION_KEY_MAP[k]]}</li>`).join('')}
         </ul>`,
      );
      show('eos-assumptions', true);
    } else {
      show('eos-assumptions', false);
    }

    show('eos-result', true);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    calculated = true;
    render();
  });
  form.addEventListener('input', () => {
    if (calculated) render();
  });
  form.addEventListener('change', () => {
    if (calculated) render();
  });
  document.getElementById('eos-reset')?.addEventListener('click', () => {
    form.reset();
    calculated = false;
    show('eos-result', false);
    show('eos-ineligible', false);
    show('eos-errors', false);
    const end = document.getElementById('eos-end-date') as HTMLInputElement | null;
    if (end && cfg.showDates) end.value = new Date().toISOString().slice(0, 10);
  });
}
