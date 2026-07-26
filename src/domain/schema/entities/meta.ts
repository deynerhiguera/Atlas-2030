import { z } from 'zod'

import { isoTimestampSchema } from '../primitives'

/**
 * meta.foundingStep exists only mid-founding (blueprint/04); the Founding
 * ceremony itself is not yet built (roadmap M5), so it is always absent
 * today. foundedAt currently marks when this Atlas document first came
 * into existence — the ceremony will re-anchor its meaning without a
 * migration, since the field itself does not change shape.
 */
export const foundingStepSchema = z.enum([
  'letter',
  'identity',
  'systems',
  'season',
  'question',
  'book',
  'pulse',
])
export type FoundingStep = z.infer<typeof foundingStepSchema>

export const metaSchema = z.object({
  foundedAt: isoTimestampSchema,
  appVersionAtFounding: z.string().min(1),
  foundingStep: foundingStepSchema.optional(),
})

export type Meta = z.infer<typeof metaSchema>
