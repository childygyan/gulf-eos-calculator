/**
 * scripts/corrections-form.ts — client wiring for the correction form.
 *
 * Same pattern as lawyers-form.ts: validates with src/lib/forms.ts, then
 * shows a confirmation screen with a mailto: link to the placeholder inbox
 * plus a copyable summary. No backend.
 */
import {
  buildMailto,
  intakeInbox,
  validateCorrection,
  type CorrectionError,
  type CorrectionField,
  type CorrectionInput,
} from '../lib/forms.js';
import { fill, type Dict } from '../i18n/dict.js';
import { copyText, selectForManualCopy } from './clipboard.js';

interface CorrectionsConfig {
  strings: Dict['corrections'];
}

type C = Dict['corrections'];

function config(): CorrectionsConfig {
  const el = document.getElementById('corrections-config');
  if (!el) throw new Error('corrections-config missing');
  return JSON.parse(el.textContent ?? '{}') as CorrectionsConfig;
}

function val(id: string): string {
  return (document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement | null)?.value.trim() ?? '';
}

function setError(field: CorrectionField, message: string | null): void {
  const err = document.getElementById(`corr-err-${field}`);
  const input = document.getElementById(`corr-${field}`);
  if (err) {
    err.textContent = message ?? '';
    err.classList.toggle('hidden', !message);
  }
  input?.setAttribute('aria-invalid', message ? 'true' : 'false');
}

export function initCorrectionsForm(): void {
  const cfg = config();
  const s: C = cfg.strings;
  const form = document.getElementById('corrections-form') as HTMLFormElement | null;
  const confirm = document.getElementById('corrections-confirm');
  if (!form || !confirm) return;

  const errorText = (key: CorrectionError): string => s.errors[key] ?? s.errors.required;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input: CorrectionInput = {
      pageUrl: val('corr-pageUrl'),
      whatsWrong: val('corr-whatsWrong'),
      correctFigure: val('corr-correctFigure'),
      sourceLink: val('corr-sourceLink'),
    };
    const errors = validateCorrection(input);
    const fields: CorrectionField[] = ['pageUrl', 'whatsWrong', 'correctFigure', 'sourceLink'];
    let firstBad: CorrectionField | null = null;
    for (const f of fields) {
      const err = errors[f];
      setError(f, err ? errorText(err) : null);
      if (err && !firstBad) firstBad = f;
    }
    if (firstBad || Object.keys(errors).length > 0) {
      if (firstBad) document.getElementById(`corr-${firstBad}`)?.focus();
      return;
    }

    const lines = [
      `${s.summaryLabels.pageUrl}: ${input.pageUrl}`,
      `${s.summaryLabels.whatsWrong}: ${input.whatsWrong}`,
      `${s.summaryLabels.correctFigure}: ${input.correctFigure}`,
      `${s.summaryLabels.sourceLink}: ${input.sourceLink}`,
    ];
    const summary = lines.join('\n');
    const subject = fill(s.emailSubject, { page: input.pageUrl });
    const mailto = document.getElementById('corrections-mailto') as HTMLAnchorElement | null;
    if (mailto) mailto.href = buildMailto(intakeInbox(), subject, summary);

    const summaryEl = document.getElementById('corrections-summary');
    if (summaryEl) summaryEl.textContent = summary;

    form.classList.add('hidden');
    confirm.classList.remove('hidden');
    confirm.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  document.getElementById('corrections-copy')?.addEventListener('click', async (e) => {
    const btn = e.currentTarget as HTMLButtonElement;
    const summaryEl = document.getElementById('corrections-summary');
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

  document.getElementById('corrections-back')?.addEventListener('click', () => {
    confirm.classList.add('hidden');
    form.classList.remove('hidden');
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}
