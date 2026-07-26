import { z } from 'zod'

/**
 * Global conventions (blueprint/04):
 * - day keys are LOCAL calendar dates, `YYYY-MM-DD` — never UTC timestamps.
 * - event timestamps are ISO 8601 WITH offset.
 * - ids are opaque nanoid strings.
 * - text is trimmed and soft-limited; limits protect renders, not expression.
 */

const DAY_PATTERN = /^\d{4}-\d{2}-\d{2}$/

/** Rejects malformed shapes AND calendar-impossible dates (e.g. 2026-02-30). */
export const dayStringSchema = z
  .string()
  .regex(DAY_PATTERN, 'Expected a local calendar date as YYYY-MM-DD')
  .refine(isRealCalendarDay, 'Not a real calendar date')

export type DayString = z.infer<typeof dayStringSchema>

function isRealCalendarDay(value: string): boolean {
  const match = DAY_PATTERN.exec(value)
  if (match === null) return false
  const year = Number(value.slice(0, 4))
  const month = Number(value.slice(5, 7))
  const day = Number(value.slice(8, 10))
  const date = new Date(year, month - 1, day)
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
}

const ISO_TIMESTAMP_PATTERN =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/

export const isoTimestampSchema = z
  .string()
  .regex(ISO_TIMESTAMP_PATTERN, 'Expected an ISO 8601 timestamp with offset or Z')

export type IsoTimestamp = z.infer<typeof isoTimestampSchema>

/** Opaque nanoid(12) identifiers. Never meaningful, never parsed for content. */
export const idSchema = z.string().min(6).max(40)
export type Id = z.infer<typeof idSchema>

/** Bounded, trimmed user text — the only text shape in the document. */
export function boundedText(min: number, max: number) {
  return z.string().trim().min(min).max(max)
}
