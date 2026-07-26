import { z } from 'zod'

import { boundedText, idSchema, isoTimestampSchema } from '../primitives'
import { pillarIdSchema } from '../pillars'

const milestoneSourceSchema = z.object({
  kind: z.enum(['book', 'question']),
  id: idSchema,
})

/**
 * Append-only. Write-only in v0.1 (blueprint/07 F0 scope note): capturable
 * from day one via the Capture sheet, rendered starting in v0.2 — the
 * record must not wait for the render.
 *
 * `note` is a widening added for M4 (blueprint/04's optional-field pattern,
 * same as Signal.energy in M2): every previously-valid milestone remains
 * valid, so no migration is needed. `enrichedAt`/`photoRef` remain v0.2.
 */
export const milestoneCaptureSchema = z.object({
  id: idSchema,
  text: boundedText(1, 300),
  pillar: pillarIdSchema.optional(),
  note: boundedText(0, 2000).optional(),
  capturedAt: isoTimestampSchema,
  source: milestoneSourceSchema.optional(),
})

export type MilestoneCapture = z.infer<typeof milestoneCaptureSchema>
