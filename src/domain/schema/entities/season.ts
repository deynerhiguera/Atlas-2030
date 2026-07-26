import { z } from 'zod'

import { boundedText, dayStringSchema, idSchema } from '../primitives'
import { pillarIdSchema } from '../pillars'

const intentionSchema = z.object({
  id: idSchema,
  text: boundedText(1, 200),
})

/**
 * schemaVersion 1 shape (blueprint/04). Sealed notes, grading, and
 * closedAt arrive with season sealing at schemaVersion 3 (roadmap M11-M12) —
 * until then every season in the document is, by construction, the current one.
 */
export const seasonSchema = z.object({
  id: idSchema,
  name: boundedText(1, 80),
  startDate: dayStringSchema,
  plannedEndDate: dayStringSchema,
  focusPillars: z.array(pillarIdSchema).min(2).max(3),
  intentions: z.array(intentionSchema).min(1).max(3),
})

export type Season = z.infer<typeof seasonSchema>
export type Intention = z.infer<typeof intentionSchema>
