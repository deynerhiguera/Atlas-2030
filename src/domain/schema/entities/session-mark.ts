import { z } from 'zod'

import { boundedText, dayStringSchema, idSchema } from '../primitives'

/**
 * Append-only plus a same-week delete (blueprint/04, I-2). Uniqueness on
 * (systemId, date) is enforced by domain/rules, not by this shape alone.
 */
export const sessionMarkSchema = z.object({
  id: idSchema,
  systemId: idSchema,
  date: dayStringSchema,
  note: boundedText(0, 200).optional(),
})

export type SessionMark = z.infer<typeof sessionMarkSchema>
