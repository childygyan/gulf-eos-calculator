/**
 * tests/dict.test.ts — dictionary completeness, both directions.
 *
 * TypeScript already enforces the key shape (`Dict = typeof ar`), but this
 * test guards the runtime content: identical key trees in both locales and
 * no empty strings anywhere.
 */
import { describe, expect, it } from 'vitest';
import { ar } from '../src/i18n/dicts/ar.js';
import { en } from '../src/i18n/dicts/en.js';
import { DICTS } from '../src/i18n/dict.js';
import { LOCALES } from '../src/i18n/locales.js';

type KeyTree = Record<string, unknown> | unknown[];

function keyPaths(value: unknown, prefix = ''): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((item, i) => keyPaths(item, `${prefix}[${i}]`));
  }
  if (value !== null && typeof value === 'object') {
    return Object.entries(value as KeyTree).flatMap(([k, v]) =>
      keyPaths(v, prefix ? `${prefix}.${k}` : k),
    );
  }
  return [prefix];
}

function collectStrings(value: unknown, prefix = ''): { path: string; value: string }[] {
  if (Array.isArray(value)) {
    return value.flatMap((item, i) => collectStrings(item, `${prefix}[${i}]`));
  }
  if (value !== null && typeof value === 'object') {
    return Object.entries(value as KeyTree).flatMap(([k, v]) =>
      collectStrings(v, prefix ? `${prefix}.${k}` : k),
    );
  }
  return typeof value === 'string' ? [{ path: prefix, value }] : [];
}

describe('dictionary completeness', () => {
  it('registers one dictionary per locale', () => {
    expect(Object.keys(DICTS).sort()).toEqual(LOCALES.map((l) => l.code).sort());
  });

  it('every ar key exists in en (same key tree)', () => {
    const arKeys = keyPaths(ar).sort();
    const enKeys = keyPaths(en).sort();
    const missing = arKeys.filter((k) => !enKeys.includes(k));
    expect(missing).toEqual([]);
  });

  it('every en key exists in ar (no extras)', () => {
    const arKeys = keyPaths(ar).sort();
    const enKeys = keyPaths(en).sort();
    const extras = enKeys.filter((k) => !arKeys.includes(k));
    expect(extras).toEqual([]);
  });

  it('no empty strings in any dictionary', () => {
    for (const [code, dict] of Object.entries(DICTS)) {
      const empties = collectStrings(dict).filter((s) => s.value.trim() === '');
      expect(empties, `empty strings in ${code}`).toEqual([]);
    }
  });

  it('both locales list the same six GCC country codes', () => {
    const codes = (d: typeof ar) => d.countries.items.map((c) => c.code).sort();
    expect(codes(ar)).toEqual(['AE', 'BH', 'KW', 'OM', 'QA', 'SA']);
    expect(codes(en)).toEqual(codes(ar));
  });
});
