import { z } from 'zod'

import { boundedText, dayStringSchema } from '../primitives'

/**
 * One per local calendar date (I-5); writable/editable only on its own date.
 *
 * `energy` and `line` are each independently optional (M2): the Signal for
 * today is created by whichever control the user touches first — the dial
 * or the one-liner — and neither presupposes the other. This is a widening
 * of schemaVersion 1's validation (every previously-valid Signal, which
 * always carried an energy value, remains valid), not a breaking change, so
 * it needs no migration.
 */
export const signalSchema = z.object({
  date: dayStringSchema,
  energy: z.number().int().min(1).max(5).optional(),
  line: boundedText(0, 280).optional(),
})

export type Signal = z.infer<typeof signalSchema>
