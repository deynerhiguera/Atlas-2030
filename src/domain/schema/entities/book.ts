import { z } from 'zod'

import { boundedText, idSchema, isoTimestampSchema } from '../primitives'
import { pillarIdSchema } from '../pillars'
import { bookStatusSchema } from '../enums'

const bookProgressSchema = z.union([
  z.object({ kind: z.literal('page'), page: z.number().int().min(1) }),
  z.object({ kind: z.literal('percent'), percent: z.number().int().min(0).max(100) }),
])

const bookIdeaSchema = z.object({
  id: idSchema,
  text: boundedText(1, 2000),
  createdAt: isoTimestampSchema,
})

/** At most one book with status `reading` at a time (I-4, domain/rules). */
export const bookSchema = z.object({
  id: idSchema,
  title: boundedText(1, 200),
  author: boundedText(0, 120).optional(),
  pillar: pillarIdSchema,
  why: boundedText(1, 500),
  status: bookStatusSchema,
  progress: bookProgressSchema.optional(),
  startedAt: isoTimestampSchema,
  endedAt: isoTimestampSchema.optional(),
  endNote: boundedText(0, 1000).optional(),
  ideas: z.array(bookIdeaSchema),
})

export type Book = z.infer<typeof bookSchema>
export type BookProgress = z.infer<typeof bookProgressSchema>
export type BookIdea = z.infer<typeof bookIdeaSchema>
