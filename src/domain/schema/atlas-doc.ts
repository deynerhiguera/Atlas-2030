import { z } from 'zod'

import {
  bookSchema,
  defaultSettings,
  identityVersionSchema,
  letterSchema,
  metaSchema,
  milestoneCaptureSchema,
  seasonSchema,
  sessionMarkSchema,
  questionSchema,
  settingsSchema,
  signalSchema,
  systemSchema,
} from './entities'

/**
 * The current schema version this build reads and writes (blueprint/04).
 * Bump on any change a v-1 parser would reject or misread — additive-optional
 * fields still bump. Every bump ships a migration + a frozen fixture.
 */
export const CURRENT_SCHEMA_VERSION = 1

/**
 * The document (blueprint/03, /04): one root value, loaded fully into
 * memory, persisted whole. Collections are arrays — order is never semantic.
 *
 * `letter`, `identity`, `seasons`, `questions`, and `books` are empty until
 * the Founding ceremony populates them. Nothing here is fabricated to fill
 * the gap — a document may exist, mid-ceremony, before any of them do.
 */
export const atlasDocSchema = z.object({
  schemaVersion: z.literal(CURRENT_SCHEMA_VERSION),
  meta: metaSchema,
  letter: letterSchema.optional(),
  identity: z.array(identityVersionSchema),
  seasons: z.array(seasonSchema),
  systems: z.array(systemSchema),
  sessions: z.array(sessionMarkSchema),
  questions: z.array(questionSchema),
  books: z.array(bookSchema),
  signals: z.array(signalSchema),
  milestones: z.array(milestoneCaptureSchema),
  settings: settingsSchema,
})

export type AtlasDoc = z.infer<typeof atlasDocSchema>

/**
 * A fresh, honest document for a brand-new install: real timestamps, empty
 * collections, default settings — and `foundingStep: 'letter'`, marking it
 * unfounded. This is the state the Founding ceremony (blueprint/02 C1) is
 * entered from and writes into; it never fabricates a season, a system, or
 * an identity statement to fill the gap.
 */
export function createFreshAtlasDoc(now: Date, appVersion: string): AtlasDoc {
  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    meta: {
      foundedAt: now.toISOString(),
      appVersionAtFounding: appVersion,
      foundingStep: 'letter',
    },
    identity: [],
    seasons: [],
    systems: [],
    sessions: [],
    questions: [],
    books: [],
    signals: [],
    milestones: [],
    settings: { ...defaultSettings },
  }
}
