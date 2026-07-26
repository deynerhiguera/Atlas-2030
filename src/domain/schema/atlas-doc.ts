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
 * `letter`, `identity`, `seasons`, `questions`, and `books` may be empty:
 * the Founding ceremony that would populate them (roadmap M6) has not
 * shipped yet. Nothing here is fabricated to fill the gap.
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
 * collections, default settings. Not a "founded" Atlas in the product sense
 * (blueprint/02's Founding ceremony is roadmap M6) — just a valid one.
 */
export function createFreshAtlasDoc(now: Date, appVersion: string): AtlasDoc {
  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    meta: {
      foundedAt: now.toISOString(),
      appVersionAtFounding: appVersion,
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
