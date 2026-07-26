import { dayStringSchema, type DayString } from '../schema/primitives'

/**
 * Local calendar date arithmetic (blueprint/04, /10). Day keys are the local
 * date a human would write on that day — never a UTC-derived string. Using
 * `Date#toISOString()` for a day key is the classic off-by-one-day bug and
 * is refused here on principle, not just by convention.
 */

function pad2(value: number): string {
  return value < 10 ? `0${value}` : `${value}`
}

/** The local calendar date of `reference` (defaults to now), as a DayString. */
export function todayLocal(reference: Date = new Date()): DayString {
  const value = `${reference.getFullYear()}-${pad2(reference.getMonth() + 1)}-${pad2(reference.getDate())}`
  return dayStringSchema.parse(value)
}

/** A local Date at midnight for the given day — safe for calendar math, not for instants. */
export function parseLocalDay(day: DayString): Date {
  const year = Number(day.slice(0, 4))
  const month = Number(day.slice(5, 7))
  const date = Number(day.slice(8, 10))
  return new Date(year, month - 1, date)
}

export function dayStringOf(date: Date): DayString {
  return todayLocal(date)
}

/** -1 if a < b, 0 if equal, 1 if a > b. */
export function compareDays(a: DayString, b: DayString): -1 | 0 | 1 {
  if (a < b) return -1
  if (a > b) return 1
  return 0
}

export function addDays(day: DayString, count: number): DayString {
  const date = parseLocalDay(day)
  date.setDate(date.getDate() + count)
  return dayStringOf(date)
}

/** Whole-day difference `b - a`. Positive when b is after a. */
export function daysBetween(a: DayString, b: DayString): number {
  const msPerDay = 24 * 60 * 60 * 1000
  const diff = parseLocalDay(b).getTime() - parseLocalDay(a).getTime()
  return Math.round(diff / msPerDay)
}
