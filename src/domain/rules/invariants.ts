import type { AtlasDoc } from '../schema/atlas-doc'
import type { Book, Question, Season, SessionMark, Signal } from '../schema/entities'
import type { DayString } from '../schema/primitives'
import { compareDays, todayLocal } from '../time/local-date'
import { isoWeekKeyOf } from '../time/iso-week'

/**
 * Invariants (blueprint/04). Each is a pure predicate the action layer
 * consults before committing a mutation — this file never mutates anything.
 *
 * Two invariants from the blueprint do not yet apply and are intentionally
 * absent: I-6 (one weekly Reflection) needs the Reflection entity, which
 * arrives at schemaVersion 2; I-9 (identity has a version per pillar) needs
 * the Founding ceremony, which arrives at roadmap M6. Neither is deferred
 * work sitting unfinished — they simply have no subject yet.
 */

/**
 * I-1, relaxed for schemaVersion 1: at most one season exists at all. The
 * open/closed distinction (and the "exactly one" form of this rule) arrives
 * with season sealing at schemaVersion 3 — until then nothing in the
 * document can close a season, so every season present is implicitly current.
 */
export function hasAtMostOneSeason(seasons: readonly Season[]): boolean {
  return seasons.length <= 1
}

/** I-2: unique (systemId, date) pair among session marks. */
export function isSessionSlotFree(
  sessions: readonly SessionMark[],
  systemId: string,
  date: DayString,
): boolean {
  return !sessions.some((session) => session.systemId === systemId && session.date === date)
}

/** I-2 companion: a mark may only be deleted while its date is in the current ISO week. */
export function isSessionInCurrentWeek(
  session: SessionMark,
  today: DayString = todayLocal(),
): boolean {
  return isoWeekKeyOf(session.date) === isoWeekKeyOf(today)
}

/**
 * Whether a week-grid cell may be marked or unmarked at all (blueprint/02
 * FR-W3/FR-W4): today or an earlier day in the current ISO week — never a
 * future day, and never a day belonging to a past week. The single source
 * of truth for cell interactivity, consulted by both the UI (to decide
 * which cells render as interactive) and the action layer (to refuse the
 * mutation even if a caller somehow bypassed the UI).
 */
export function isSessionCellEditable(date: DayString, today: DayString = todayLocal()): boolean {
  return compareDays(date, today) <= 0 && isoWeekKeyOf(date) === isoWeekKeyOf(today)
}

/** I-3: at most one question not yet answered. */
export function hasAtMostOneLiveQuestion(questions: readonly Question[]): boolean {
  return questions.filter((question) => question.state !== 'answered').length <= 1
}

/** I-4: at most one book with status `reading` (UI constraint, enforced here for v0.1). */
export function hasAtMostOneReadingBook(books: readonly Book[]): boolean {
  return books.filter((book) => book.status === 'reading').length <= 1
}

/** I-5: a Signal is writable/editable only on its own local calendar date. */
export function isSignalEditableToday(date: DayString, today: DayString = todayLocal()): boolean {
  return date === today
}

export function findSignal(signals: readonly Signal[], date: DayString): Signal | undefined {
  return signals.find((signal) => signal.date === date)
}

/**
 * I-10: no record dated before the document's founding, except records the
 * founding itself creates. Available to the action layer once mutations
 * that could violate it exist (roadmap M2+); genuinely checkable and tested
 * today even though nothing yet calls it end-to-end.
 */
export function noRecordsBeforeFounding(doc: AtlasDoc): boolean {
  const foundedDay = todayLocal(new Date(doc.meta.foundedAt))

  const dayFields: DayString[] = [
    ...doc.sessions.map((session) => session.date),
    ...doc.signals.map((signal) => signal.date),
    ...doc.questions.map((question) => question.askedOn),
    ...doc.seasons.map((season) => season.startDate),
  ]
  if (dayFields.some((day) => compareDays(day, foundedDay) < 0)) return false

  const timestampFields: string[] = [
    ...doc.identity.map((version) => version.createdAt),
    ...doc.milestones.map((milestone) => milestone.capturedAt),
    ...doc.books.map((book) => book.startedAt),
  ]
  const foundedAtMs = new Date(doc.meta.foundedAt).getTime()
  return timestampFields.every((timestamp) => new Date(timestamp).getTime() >= foundedAtMs)
}
