import { dayStringSchema, type DayString } from '../schema/primitives'

import { addDays, dayStringOf, parseLocalDay, todayLocal } from './local-date'

/**
 * ISO-8601 weeks, Monday start (blueprint/04). `WeekKey` is always derived,
 * never stored — the document has no week-key field anywhere.
 *
 * The calculation is done entirely with `Date.UTC(localYear, localMonth,
 * localDate)` — a well-known technique that uses UTC arithmetic purely to
 * avoid DST discontinuities, while the Y/M/D values fed in are already the
 * user's local calendar values (from domain/time/local-date). This keeps
 * week math correct across DST transitions and timezone changes without
 * ever letting the runtime's local timezone influence the calculation twice.
 */
export type WeekKey = `${number}-W${string}`

const MS_PER_DAY = 24 * 60 * 60 * 1000

function isoWeekInfo(day: DayString): { isoYear: number; isoWeek: number } {
  const local = parseLocalDay(day)
  const utc = new Date(Date.UTC(local.getFullYear(), local.getMonth(), local.getDate()))

  // Shift to the Thursday of this ISO week (Mon=0 .. Sun=6).
  const isoDayOfWeek = (utc.getUTCDay() + 6) % 7
  utc.setUTCDate(utc.getUTCDate() - isoDayOfWeek + 3)

  const isoYear = utc.getUTCFullYear()
  const yearStartThursday = new Date(Date.UTC(isoYear, 0, 4))
  const startIsoDayOfWeek = (yearStartThursday.getUTCDay() + 6) % 7
  yearStartThursday.setUTCDate(yearStartThursday.getUTCDate() - startIsoDayOfWeek + 3)

  const isoWeek =
    1 + Math.round((utc.getTime() - yearStartThursday.getTime()) / (7 * MS_PER_DAY))

  return { isoYear, isoWeek }
}

function formatWeekKey(isoYear: number, isoWeek: number): WeekKey {
  const weekPart = isoWeek < 10 ? `0${isoWeek}` : `${isoWeek}`
  return `${isoYear}-W${weekPart}` as WeekKey
}

export function isoWeekKeyOf(day: DayString): WeekKey {
  const { isoYear, isoWeek } = isoWeekInfo(day)
  return formatWeekKey(isoYear, isoWeek)
}

export function currentWeekKey(reference: Date = new Date()): WeekKey {
  return isoWeekKeyOf(todayLocal(reference))
}

function parseWeekKey(weekKey: WeekKey): { isoYear: number; isoWeek: number } {
  const [yearPart, weekPart] = weekKey.split('-W')
  return { isoYear: Number(yearPart), isoWeek: Number(weekPart) }
}

/** The Monday of the given ISO week, as a local DayString. */
export function mondayOf(weekKey: WeekKey): DayString {
  const { isoYear, isoWeek } = parseWeekKey(weekKey)
  const yearStartThursday = new Date(Date.UTC(isoYear, 0, 4))
  const startIsoDayOfWeek = (yearStartThursday.getUTCDay() + 6) % 7
  yearStartThursday.setUTCDate(yearStartThursday.getUTCDate() - startIsoDayOfWeek + 3)

  const targetThursday = new Date(yearStartThursday.getTime() + (isoWeek - 1) * 7 * MS_PER_DAY)
  const monday = new Date(targetThursday.getTime() - 3 * MS_PER_DAY)

  const local = new Date(monday.getUTCFullYear(), monday.getUTCMonth(), monday.getUTCDate())
  return dayStringSchema.parse(dayStringOf(local))
}

/** The seven local days of the week, Monday through Sunday. */
export function daysOfWeek(weekKey: WeekKey): DayString[] {
  const monday = mondayOf(weekKey)
  return Array.from({ length: 7 }, (_, index) => addDays(monday, index))
}

export function weekBoundaries(weekKey: WeekKey): { start: DayString; end: DayString } {
  const monday = mondayOf(weekKey)
  return { start: monday, end: addDays(monday, 6) }
}

export function addWeeks(weekKey: WeekKey, count: number): WeekKey {
  const monday = mondayOf(weekKey)
  const shifted = addDays(monday, count * 7)
  return isoWeekKeyOf(shifted)
}

export function weekKeyOfDate(date: Date): WeekKey {
  return isoWeekKeyOf(todayLocal(date))
}
