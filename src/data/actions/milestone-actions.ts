import { nanoid } from 'nanoid'

import { milestoneCaptureSchema, type MilestoneCapture, type PillarId } from '@/domain/schema'

import { getCurrentDoc, replaceDoc } from '../store/atlas-store'

export interface CaptureMilestoneInput {
  text: string
  pillar?: PillarId
  note?: string
}

/**
 * Append-only (blueprint/04). Milestones remain write-only in v0.1 — this
 * action is the record; rendering them is a v0.2 concern (Pillars) that
 * doesn't exist yet, so nothing here waits for a UI that isn't built.
 */
export function captureMilestone(input: CaptureMilestoneInput): void {
  const doc = getCurrentDoc()
  if (doc === null) return

  const trimmedText = input.text.trim()
  if (trimmedText.length === 0) return

  const trimmedNote = input.note?.trim()

  const milestone: MilestoneCapture = milestoneCaptureSchema.parse({
    id: nanoid(12),
    text: trimmedText,
    ...(input.pillar !== undefined ? { pillar: input.pillar } : {}),
    ...(trimmedNote !== undefined && trimmedNote.length > 0 ? { note: trimmedNote } : {}),
    capturedAt: new Date().toISOString(),
  })

  replaceDoc({ ...doc, milestones: [...doc.milestones, milestone] })
}
