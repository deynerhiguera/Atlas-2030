import { z } from 'zod'

import { boundedText, idSchema, isoTimestampSchema } from '../primitives'
import { pillarIdSchema } from '../pillars'

/** Append-only (blueprint/04): the current statement per pillar is the latest. */
export const identityVersionSchema = z.object({
  id: idSchema,
  pillar: pillarIdSchema,
  text: boundedText(1, 600),
  createdAt: isoTimestampSchema,
})

export type IdentityVersion = z.infer<typeof identityVersionSchema>
