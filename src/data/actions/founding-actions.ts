import { nanoid } from 'nanoid'

import {
  identityVersionSchema,
  letterSchema,
  metaSchema,
  seasonSchema,
  PILLAR_IDS,
  type FoundingStep,
  type IdentityVersion,
  type Letter,
  type Meta,
  type PillarId,
  type Season,
} from '@/domain/schema'
import { addDays, todayLocal } from '@/domain/time'

import { getCurrentDoc, replaceDoc } from '../store/atlas-store'
import type { AskQuestionInput } from './question-actions'
import { askQuestion } from './question-actions'
import type { StartBookInput } from './book-actions'
import { startBook } from './book-actions'

const SEASON_LENGTH_DAYS = 84 // ~12 weeks (blueprint/04 Season.plannedEndDate)

/**
 * The Founding ceremony (blueprint/02 C1) is the only writer of these
 * entities' first values and of `meta.foundingStep`'s advance — every other
 * action in this layer mutates a document that already has a season, an
 * identity, systems. These functions are what get it there, one step at a
 * time, each one atomic with the step advance it causes so a document is
 * never left claiming a step it already completed.
 */

function setFoundingStep(step: FoundingStep | undefined): void {
  const doc = getCurrentDoc()
  if (doc === null) return

  const meta: Meta =
    step === undefined
      ? { foundedAt: doc.meta.foundedAt, appVersionAtFounding: doc.meta.appVersionAtFounding }
      : { ...doc.meta, foundingStep: step }

  replaceDoc({ ...doc, meta: metaSchema.parse(meta) })
}

/**
 * Encodes with the sentinel prefix (blueprint/04: "a promise, not
 * cryptography"). Chunked to stay safe for a long letter — `btoa` requires a
 * latin1 string, and spreading a large `Uint8Array` in one call risks the
 * engine's argument-count ceiling.
 */
function sealBody(plainText: string): string {
  const bytes = new TextEncoder().encode(plainText)
  const chunkSize = 0x8000
  let binary = ''
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize))
  }
  return `ATLAS-SEALED-V1:${btoa(binary)}`
}

/** FR-F3: seals the letter and advances to the identity step. Irreversible in-app. */
export function sealLetter(body: string): void {
  const doc = getCurrentDoc()
  if (doc === null) return

  const trimmed = body.trim()
  if (trimmed.length === 0) return

  const letter: Letter = letterSchema.parse({
    sealedBody: sealBody(trimmed),
    sealedAt: new Date().toISOString(),
    opensAt: '2030-12-01',
  })

  replaceDoc({
    ...doc,
    letter,
    meta: metaSchema.parse({ ...doc.meta, foundingStep: 'identity' }),
  })
}

/**
 * FR-F4: one statement per pillar. Advances to the systems step once all six
 * are recorded — the resume view derives "which pillar is next" from
 * `doc.identity` itself (no separate counter to keep in sync, per I-9).
 */
export function recordIdentityStatement(pillar: PillarId, text: string): void {
  const doc = getCurrentDoc()
  if (doc === null) return

  const trimmed = text.trim()
  if (trimmed.length === 0) return

  const version: IdentityVersion = identityVersionSchema.parse({
    id: nanoid(12),
    pillar,
    text: trimmed,
    createdAt: new Date().toISOString(),
  })

  const identity = [...doc.identity, version]
  const allPillarsCovered = PILLAR_IDS.every((id) => identity.some((v) => v.pillar === id))

  replaceDoc({
    ...doc,
    identity,
    meta: metaSchema.parse({ ...doc.meta, foundingStep: allPillarsCovered ? 'systems' : 'identity' }),
  })
}

/**
 * FR-F5: systems are added one at a time through the existing `addSystem`
 * action (declaring one is identical during founding and after); this is
 * only the "I'm done declaring" step advance, refused with nothing declared.
 */
export function completeSystemsDeclaration(): void {
  const doc = getCurrentDoc()
  if (doc === null) return
  if (doc.systems.length === 0) return
  setFoundingStep('season')
}

export interface FoundSeasonInput {
  name: string
  focusPillars: PillarId[]
  intentions: string[]
}

/** FR-F6: the first season. `plannedEndDate` is computed — not a field the ceremony asks about. */
export function foundSeason(input: FoundSeasonInput): void {
  const doc = getCurrentDoc()
  if (doc === null) return

  const today = todayLocal()
  const intentions = input.intentions
    .map((text) => text.trim())
    .filter((text) => text.length > 0)
    .map((text) => ({ id: nanoid(12), text }))

  const season: Season = seasonSchema.parse({
    id: nanoid(12),
    name: input.name.trim(),
    startDate: today,
    plannedEndDate: addDays(today, SEASON_LENGTH_DAYS),
    focusPillars: input.focusPillars,
    intentions,
  })

  replaceDoc({
    ...doc,
    seasons: [...doc.seasons, season],
    meta: metaSchema.parse({ ...doc.meta, foundingStep: 'question' }),
  })
}

/** FR-F7: the first Question, asked through the same action the app uses ever after. */
export function foundQuestion(input: AskQuestionInput): void {
  askQuestion(input)
  setFoundingStep('book')
}

/** FR-F7: the current Book, started through the same action the app uses ever after. */
export function foundBook(input: StartBookInput): void {
  startBook(input)
  setFoundingStep('pulse')
}

/**
 * The last step: today's pulse must already be recorded (via the ordinary
 * `setTodayEnergy`) before founding can complete — the ceremony ends inside
 * day one's texture, not before it. Deletes `foundingStep` entirely, which
 * is what "founded" means (blueprint/04 Meta).
 */
export function completeFounding(): void {
  const doc = getCurrentDoc()
  if (doc === null) return

  const today = todayLocal()
  const hasEnergy = doc.signals.some((signal) => signal.date === today && signal.energy !== undefined)
  if (!hasEnergy) return

  setFoundingStep(undefined)
}
