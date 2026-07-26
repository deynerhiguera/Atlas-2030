import { z } from 'zod'

import { isoTimestampSchema } from '../primitives'

/**
 * The letter to 2030 (blueprint/04). Sealed client-side, never decoded by
 * any v≤2030 code path — the encoding prevents accidental self-spoiling in
 * exports, not determined adversaries; documented honestly, not "security".
 *
 * Optional at this stage of the build: the Founding ceremony that writes and
 * seals a real letter has not shipped yet (roadmap M6). A document may exist
 * — and be lived in — before a letter has been written.
 */
export const letterSchema = z.object({
  sealedBody: z.string().min(1).startsWith('ATLAS-SEALED-V1:'),
  sealedAt: isoTimestampSchema,
  opensAt: z.literal('2030-12-01'),
})

export type Letter = z.infer<typeof letterSchema>
