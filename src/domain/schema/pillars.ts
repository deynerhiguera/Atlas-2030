import { z } from 'zod'

/**
 * The six pillars (blueprint/04). Fixed for the decade — display names and
 * hues live here as config, never as data, so they can never drift per-record.
 */
export const PILLAR_IDS = [
  'engineering',
  'university',
  'english',
  'health',
  'spirit',
  'relationships',
] as const

export const pillarIdSchema = z.enum(PILLAR_IDS)

export type PillarId = z.infer<typeof pillarIdSchema>

export const pillarLabels: Record<PillarId, string> = {
  engineering: 'Engineering',
  university: 'University',
  english: 'English',
  health: 'Health',
  spirit: 'Spirit & Mind',
  relationships: 'Relationships',
}
