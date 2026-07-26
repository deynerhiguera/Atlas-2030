import { z } from 'zod'

import { boundedText, idSchema, isoTimestampSchema } from '../primitives'
import { pillarIdSchema } from '../pillars'
import { systemStatusSchema } from '../enums'

/**
 * rhythmHistory (for rhythm-change proration, DR-7) arrives at schemaVersion 2
 * alongside the ceremonies that let rhythm change. At schemaVersion 1 a
 * system's rhythm is fixed for its lifetime.
 */
export const systemSchema = z.object({
  id: idSchema,
  name: boundedText(1, 60),
  pillar: pillarIdSchema,
  rhythmPerWeek: z.number().int().min(1).max(7),
  status: systemStatusSchema,
  createdAt: isoTimestampSchema,
  pausedAt: isoTimestampSchema.optional(),
  retiredAt: isoTimestampSchema.optional(),
})

export type System = z.infer<typeof systemSchema>
