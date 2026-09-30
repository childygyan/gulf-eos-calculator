/**
 * dict.ts — the shared dictionary type and locale registry.
 *
 * `Dict` is `typeof ar` (Arabic is the default locale): every locale
 * dictionary must satisfy it, so a missing or extra key fails compilation
 * (and the dict-completeness test).
 */
import type { LocaleCode } from './locales.js';
import { ar } from './dicts/ar.js';
import { en } from './dicts/en.js';

export type Dict = typeof ar;

export const DICTS: Record<LocaleCode, Dict> = { ar, en };

/** Dictionary for a locale; falls back to Arabic on unknown codes. */
export function getDict(locale: LocaleCode): Dict {
  return DICTS[locale] ?? ar;
}

/** Fill {placeholders} in a template string. Unknown keys become empty. */
export function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_m, key: string) =>
    vars[key] === undefined ? '' : String(vars[key]),
  );
}
