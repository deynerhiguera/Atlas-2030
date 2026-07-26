import { z } from 'zod'

import { boundedText, idSchema, isoTimestampSchema } from '../primitives'
import { pillarIdSchema } from '../pillars'

const milestoneSourceSchema = z.object({
  kind: z.enum(['book', 'question']),
  id: idSchema,
})

/**
 * Append-only. Write-only in v0.1 (blueprint/07 F0 scope note): capturable
 * from day one via the command bar, rendered starting in v0.2 — the record
 * must not wait for the render. note/enrichedAt/photoRef arrive at v0.2.
 */
export const milestoneCaptureSchema = z.object({
  id: idSchema,
  text: boundedText(1, 300),
  pillar: pillarIdSchema.optional(),
  capturedAt: isoTimestampSchema,
  source: milestoneSourceSchema.optional(),
})

export type MilestoneCapture = z.infer<typeof milestoneCaptureSchema>
