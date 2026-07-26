import { nanoid } from 'nanoid'

import type { DayString } from '@/domain/schema'
import { InvariantViolationError, isSessionCellEditable } from '@/domain/rules'
import { todayLocal } from '@/domain/time'

import { getCurrentDoc, replaceDoc } from '../store/atlas-store'

/**
 * Toggles a system's session mark for `date` (blueprint/04 FR-S1..S3, I-2).
 * Only today or an earlier day in the current ISO week may be toggled — the
 * UI never wires this to an inert cell, so this check is the action layer's
 * own line of defense (blueprint/03), not the primary guard.
 */
export function toggleSession(systemId: string, date: DayString): void {
  const doc = getCurrentDoc()
  if (doc === null) return

  const today = todayLocal()
  if (!isSessionCellEditable(date, today)) {
    throw new InvariantViolationError(
      'session-cell-not-editable',
      'Only today or an earlier day in the current week can be marked.',
    )
  }

  const existing = doc.sessions.find(
    (session) => session.systemId === systemId && session.date === date,
  )

  if (existing !== undefined) {
    replaceDoc({ ...doc, sessions: doc.sessions.filter((session) => session.id !== existing.id) })
    return
  }

  replaceDoc({
    ...doc,
    sessions: [...doc.sessions, { id: nanoid(12), systemId, date }],
  })
}
