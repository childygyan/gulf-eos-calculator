/**
 * engine/notice.ts — notice-period date engine (Phase 3).
 *
 * Adds calendar days to a notice start date to find the last working day.
 * All math is UTC so results never shift with the viewer's timezone.
 */
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** True for a real calendar date in YYYY-MM-DD form. */
export function isValidISODate(value: string): boolean {
  if (!ISO_DATE.test(value)) return false;
  const [y, m, d] = value.split('-').map(Number);
  const t = Date.UTC(y, m - 1, d);
  const back = new Date(t);
  return (
    back.getUTCFullYear() === y && back.getUTCMonth() === m - 1 && back.getUTCDate() === d
  );
}

/** ISO date plus N calendar days (N >= 0). */
export function addDaysISO(isoDate: string, days: number): string {
  if (!isValidISODate(isoDate)) {
    throw new RangeError(`isoDate must be a valid YYYY-MM-DD date (got ${isoDate})`);
  }
  if (!Number.isInteger(days) || days < 0 || days > 3660) {
    throw new RangeError(`days must be an integer 0–3660 (got ${days})`);
  }
  const t = Date.parse(`${isoDate}T00:00:00Z`) + days * 86_400_000;
  return new Date(t).toISOString().slice(0, 10);
}

/**
 * Last working day when notice is given on `noticeStartISO` and the notice
 * period is `noticeDays` days. Convention: notice day 1 is the day AFTER
 * the notice is given, so the last working day is start + noticeDays.
 */
export function lastWorkingDay(noticeStartISO: string, noticeDays: number): string {
  return addDaysISO(noticeStartISO, noticeDays);
}
