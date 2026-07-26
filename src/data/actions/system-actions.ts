import { nanoid } from 'nanoid'

import { systemSchema, type PillarId, type System } from '@/domain/schema'

import { getCurrentDoc, replaceDoc } from '../store/atlas-store'

export interface AddSystemInput {
  name: string
  pillar: PillarId
  rhythmPerWeek: number
}

/**
 * Declares a new recurring system (blueprint/07 F9 note: this is the
 * temporary path onto the roster until the Founding ceremony — roadmap M5 —
 * writes systems as part of its own flow; this action itself does not go
 * away, only the seed form that calls it today).
 *
 * The constructed record is parsed through the schema before it ever
 * reaches the store — a defensive boundary, not a substitute for the form's
 * own validation.
 */
export function addSystem(input: AddSystemInput): void {
  const doc = getCurrentDoc()
  if (doc === null) return

  const system: System = systemSchema.parse({
    id: nanoid(12),
    name: input.name.trim(),
    pillar: input.pillar,
    rhythmPerWeek: input.rhythmPerWeek,
    status: 'active',
    createdAt: new Date().toISOString(),
  })

  replaceDoc({ ...doc, systems: [...doc.systems, system] })
}
