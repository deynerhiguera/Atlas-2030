import { z } from 'zod'

import { boundedText, dayStringSchema } from '../primitives'

/** One per local calendar date (I-5); writable/editable only on its own date. */
export const signalSchema = z.object({
  date: dayStringSchema,
  energy: z.number().int().min(1).max(5),
  line: boundedText(0, 280).optional(),
})

export type Signal = z.infer<typeof signalSchema>
