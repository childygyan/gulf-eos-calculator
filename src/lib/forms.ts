/**
 * lib/forms.ts — pure (DOM-free) logic for the Phase 5 lead-gen forms.
 *
 * This module is intentionally locale-free: validators return error KEYS
 * and the routing map returns route CODES; the client scripts map them to
 * localized strings from the dictionaries. Everything here is unit-tested
 * in tests/phase5.test.ts.
 *
 * There is NO backend on this static site. Both forms end in a
 * `mailto:` link to the placeholder inbox (`SITE.contactEmail`) plus a
 * copyable summary — never in a fake "submission received by our team"
 * claim.
 */
import { COUNTRY_CODES, type GccCountryCode } from '../data/index.js';
import { SITE } from '../config/site.js';

/* ------------------------------------------------------------------ */
/* Shared validators                                                   */
/* ------------------------------------------------------------------ */

/** Pragmatic email check: local@domain.tld with no whitespace. */
export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

/**
 * Pragmatic phone check: 7–15 digits, tolerating spaces, dashes,
 * parentheses, and a leading +. Deliberately loose — this is a contact
 * channel, not identity verification.
 */
export function isValidPhone(value: string): boolean {
  const digits = value.replace(/[^\d]/g, '');
  return (
    /^[+\d(][\d\s().-]*$/.test(value.trim()) && digits.length >= 7 && digits.length <= 15
  );
}

/** True for an absolute http(s) URL. */
export function isAbsoluteHttpUrl(value: string): boolean {
  return /^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(value.trim());
}

/** True for an absolute http(s) URL or a site-internal path starting with /. */
export function isUrlOrPath(value: string): boolean {
  const v = value.trim();
  return v.startsWith('/') || isAbsoluteHttpUrl(v);
}

/* ------------------------------------------------------------------ */
/* Lawyer lead-intake form                                             */
/* ------------------------------------------------------------------ */

export const CASE_TYPES = ['resignation', 'termination', 'notice-leave', 'other'] as const;
export type CaseType = (typeof CASE_TYPES)[number];

export interface IntakeInput {
  country: string;
  caseType: string;
  name: string;
  contact: string;
  description: string;
}

export type IntakeField = 'country' | 'caseType' | 'name' | 'contact' | 'description';
export type IntakeError =
  | 'required'
  | 'invalidCountry'
  | 'invalidCaseType'
  | 'nameTooShort'
  | 'contactRequired'
  | 'contactInvalid'
  | 'descriptionTooShort';

export function isGccCountryCode(value: string): value is GccCountryCode {
  return (COUNTRY_CODES as readonly string[]).includes(value);
}

export function isCaseType(value: string): value is CaseType {
  return (CASE_TYPES as readonly string[]).includes(value);
}

/** Validate the intake form; returns a map of field → error key (empty = valid). */
export function validateIntake(input: IntakeInput): Partial<Record<IntakeField, IntakeError>> {
  const errors: Partial<Record<IntakeField, IntakeError>> = {};
  if (!input.country.trim()) errors.country = 'required';
  else if (!isGccCountryCode(input.country.trim())) errors.country = 'invalidCountry';
  if (!input.caseType.trim()) errors.caseType = 'required';
  else if (!isCaseType(input.caseType.trim())) errors.caseType = 'invalidCaseType';
  if (!input.name.trim()) errors.name = 'required';
  else if (input.name.trim().length < 2) errors.name = 'nameTooShort';
  const contact = input.contact.trim();
  if (!contact) {
    errors.contact = 'contactRequired';
  } else if (contact.includes('@') ? !isValidEmail(contact) : !isValidPhone(contact)) {
    errors.contact = 'contactInvalid';
  }
  if (!input.description.trim()) errors.description = 'required';
  else if (input.description.trim().length < 10) errors.description = 'descriptionTooShort';
  return errors;
}

/**
 * Intake routing map: every country × case-type combination maps to a
 * route code. "Routing" here means labeling the intake summary with the
 * queue it would enter once the lawyer partner program exists — the
 * program itself is still being set up, so no partner names or firms are
 * (or may be) attached to these routes.
 */
export const INTAKE_ROUTES: Record<GccCountryCode, Record<CaseType, string>> = {
  SA: {
    resignation: 'SA/resignation',
    termination: 'SA/termination',
    'notice-leave': 'SA/notice-leave',
    other: 'SA/other',
  },
  AE: {
    resignation: 'AE/resignation',
    termination: 'AE/termination',
    'notice-leave': 'AE/notice-leave',
    other: 'AE/other',
  },
  KW: {
    resignation: 'KW/resignation',
    termination: 'KW/termination',
    'notice-leave': 'KW/notice-leave',
    other: 'KW/other',
  },
  QA: {
    resignation: 'QA/resignation',
    termination: 'QA/termination',
    'notice-leave': 'QA/notice-leave',
    other: 'QA/other',
  },
  BH: {
    resignation: 'BH/resignation',
    termination: 'BH/termination',
    'notice-leave': 'BH/notice-leave',
    other: 'BH/other',
  },
  OM: {
    resignation: 'OM/resignation',
    termination: 'OM/termination',
    'notice-leave': 'OM/notice-leave',
    other: 'OM/other',
  },
};

export interface IntakeRoute {
  /** e.g. `SA/resignation` — identifies the country + case-type queue. */
  routeCode: string;
  country: GccCountryCode;
  caseType: CaseType;
}

/** Route a validated intake to its country + case-type queue. */
export function routeIntake(country: GccCountryCode, caseType: CaseType): IntakeRoute {
  return { routeCode: INTAKE_ROUTES[country][caseType], country, caseType };
}

/** Build a mailto: link to the (placeholder) intake inbox. */
export function buildMailto(to: string, subject: string, body: string): string {
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/** The intake inbox address (placeholder until Firoz supplies the real one). */
export function intakeInbox(): string {
  return SITE.contactEmail;
}

/* ------------------------------------------------------------------ */
/* Correction / missing-rule form                                      */
/* ------------------------------------------------------------------ */

export interface CorrectionInput {
  pageUrl: string;
  whatsWrong: string;
  correctFigure: string;
  sourceLink: string;
}

export type CorrectionField = 'pageUrl' | 'whatsWrong' | 'correctFigure' | 'sourceLink';
export type CorrectionError = 'required' | 'invalidUrl' | 'tooShort' | 'invalidSource';

/** Validate the correction form; returns a map of field → error key. */
export function validateCorrection(
  input: CorrectionInput,
): Partial<Record<CorrectionField, CorrectionError>> {
  const errors: Partial<Record<CorrectionField, CorrectionError>> = {};
  const pageUrl = input.pageUrl.trim();
  if (!pageUrl) errors.pageUrl = 'required';
  else if (!isUrlOrPath(pageUrl)) errors.pageUrl = 'invalidUrl';
  if (!input.whatsWrong.trim()) errors.whatsWrong = 'required';
  else if (input.whatsWrong.trim().length < 10) errors.whatsWrong = 'tooShort';
  if (!input.correctFigure.trim()) errors.correctFigure = 'required';
  else if (input.correctFigure.trim().length < 3) errors.correctFigure = 'tooShort';
  const source = input.sourceLink.trim();
  if (!source) errors.sourceLink = 'required';
  // Sources must be checkable: require a full official-looking URL, never a bare path.
  else if (!isAbsoluteHttpUrl(source)) errors.sourceLink = 'invalidSource';
  return errors;
}
