import { z } from 'zod'

import { isoTimestampSchema } from '../primitives'

/**
 * The letter to 2030 (blueprint/04). Sealed client-side, never decoded by
 * any v≤2030 code path — the encoding prevents accidental self-spoiling in
 * exports, not determined adversaries; documented honestly, not "security".
 *
 * Optional because it does not exist until the Founding ceremony's seal
 * step writes it (`sealLetter`, `data/actions/founding-actions`) — a
 * document mid-ceremony is real before its letter is.
 */
export const letterSchema = z.object({
  sealedBody: z.string().min(1).startsWith('ATLAS-SEALED-V1:'),
  sealedAt: isoTimestampSchema,
  opensAt: z.literal('2030-12-01'),
})

export type Letter = z.infer<typeof letterSchema>
