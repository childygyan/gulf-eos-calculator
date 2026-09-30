/**
 * scripts/lawyers-form.ts — client wiring for the lawyer lead-intake form.
 *
 * Reads its config from <script type="application/json" id="lawyers-config">.
 * Validates with src/lib/forms.ts (pure, unit-tested), then shows a
 * confirmation screen with a mailto: link to the placeholder inbox plus a
 * copyable summary. No backend: the "submission" is the user's own email.
 */
import {
  buildMailto,
  intakeInbox,
  isCaseType,
  isGccCountryCode,
  routeIntake,
  validateIntake,
  type IntakeError,
  type IntakeField,
  type IntakeInput,
} from '../lib/forms.js';
import { fill, type Dict } from '../i18n/dict.js';
import { copyText, selectForManualCopy } from './clipboard.js';

interface LawyersConfig {
  countries: { code: string; name: string }[];
  caseTypes: { id: string; label: string }[];
  strings: Dict['lawyers'];
}

type L = Dict['lawyers'];

function config(): LawyersConfig {
  const el = document.getElementById('lawyers-config');
  if (!el) throw new Error('lawyers-config missing');
  return JSON.parse(el.textContent ?? '{}') as LawyersConfig;
}

function val(id: string): string {
  return (document.getElementById(id) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null)?.value.trim() ?? '';
}

function setError(field: IntakeField, message: string | null): void {
  const err = document.getElementById(`lawyer-err-${field}`);
  const input = document.getElementById(`lawyer-${field}`);
  if (err) {
    err.textContent = message ?? '';
    err.classList.toggle('hidden', !message);
  }
  input?.setAttribute('aria-invalid', message ? 'true' : 'false');
}

export function initLawyersForm(): void {
  const cfg = config();
  const s: L = cfg.strings;
  const form = document.getElementById('lawyers-form') as HTMLFormElement | null;
  const confirm = document.getElementById('lawyers-confirm');
  if (!form || !confirm) return;

  const errorText = (key: IntakeError): string => s.errors[key] ?? s.errors.required;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input: IntakeInput = {
      country: val('lawyer-country'),
      caseType: val('lawyer-caseType'),
      name: val('lawyer-name'),
      contact: val('lawyer-contact'),
      description: val('lawyer-description'),
    };
    const errors = validateIntake(input);
    const fields: IntakeField[] = ['country', 'caseType', 'name', 'contact', 'description'];
    let firstBad: IntakeField | null = null;
    for (const f of fields) {
      const err = errors[f];
      setError(f, err ? errorText(err) : null);
      if (err && !firstBad) firstBad = f;
    }
    if (firstBad || Object.keys(errors).length > 0) {
      if (firstBad) document.getElementById(`lawyer-${firstBad}`)?.focus();
      return;
    }

    // Valid — route and build the summary.
    const country = input.country as Parameters<typeof routeIntake>[0];
    const caseType = input.caseType as Parameters<typeof routeIntake>[1];
    if (!isGccCountryCode(country) || !isCaseType(caseType)) return;
    const route = routeIntake(country, caseType);
    const countryName = cfg.countries.find((c) => c.code === country)?.name ?? country;
    const caseLabel = cfg.caseTypes.find((c) => c.id === caseType)?.label ?? caseType;
    const routeText = fill(s.routeLine, { country: countryName, caseType: caseLabel });

    const lines = [
      `${s.summaryLabels.country}: ${countryName}`,
      `${s.summaryLabels.caseType}: ${caseLabel}`,
      `${s.summaryLabels.name}: ${input.name}`,
      `${s.summaryLabels.contact}: ${input.contact}`,
      `${s.summaryLabels.description}: ${input.description}`,
      `${s.summaryLabels.route}: ${route.routeCode}`,
    ];
    const summary = lines.join('\n');

    const subject = fill(s.emailSubject, { country: countryName, caseType: caseLabel });
    const body = `${routeText}\n\n${summary}`;
    const mailto = document.getElementById('lawyers-mailto') as HTMLAnchorElement | null;
    if (mailto) mailto.href = buildMailto(intakeInbox(), subject, body);

    const summaryEl = document.getElementById('lawyers-summary');
    if (summaryEl) summaryEl.textContent = summary;
    const routeEl = document.getElementById('lawyers-route');
    if (routeEl) routeEl.textContent = routeText;

    form.classList.add('hidden');
    confirm.classList.remove('hidden');
    confirm.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  document.getElementById('lawyers-copy')?.addEventListener('click', async (e) => {
    const btn = e.currentTarget as HTMLButtonElement;
    const summaryEl = document.getElementById('lawyers-summary');
    const text = summaryEl?.textContent ?? '';
    const ok = await copyText(text);
    const original = btn.textContent;
    if (ok) {
      btn.textContent = s.copiedLabel;
    } else {
      // Honest fallback: never claim the copy worked. Select the summary so
      // the user can copy it manually, and say so on the button.
      selectForManualCopy(summaryEl);
      btn.textContent = s.manualCopyHint;
    }
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
    }, 4000);
  });

  document.getElementById('lawyers-back')?.addEventListener('click', () => {
    confirm.classList.add('hidden');
    form.classList.remove('hidden');
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}
