import { z } from 'zod'

import { boundedText, dayStringSchema, idSchema, isoTimestampSchema } from '../primitives'
import { pillarIdSchema } from '../pillars'
import { questionStateSchema } from '../enums'

const questionNoteSchema = z.object({
  id: idSchema,
  text: boundedText(1, 2000),
  createdAt: isoTimestampSchema,
})

/** At most one question not in `answered` at a time (I-3, domain/rules). */
export const questionSchema = z.object({
  id: idSchema,
  text: boundedText(1, 300),
  pillar: pillarIdSchema,
  state: questionStateSchema,
  askedOn: dayStringSchema,
  notes: z.array(questionNoteSchema),
  answeredAt: isoTimestampSchema.optional(),
  answer: boundedText(1, 20000).optional(),
})

export type Question = z.infer<typeof questionSchema>
export type QuestionNote = z.infer<typeof questionNoteSchema>
