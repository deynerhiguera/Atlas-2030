import { z } from 'zod'

import { isoTimestampSchema } from '../primitives'

/**
 * meta.foundingStep exists only mid-founding (blueprint/04): present from
 * the moment a document is created, it advances step by step as the
 * ceremony (blueprint/02 C1) proceeds and is deleted entirely once it
 * finishes — its absence is what "founded" means. foundedAt is set once,
 * at document creation, and never moves again: day one of becoming is the
 * day the ceremony began, not the day it happened to finish.
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
