import type { PillarId } from '@/domain/schema'

/**
 * Color tokens (blueprint/05). CSS custom properties in styles/index.css are
 * the rendering source; these mirrors exist for JS consumers (future canvas
 * renders in the Atlas view). Keep both in sync — a divergence is a bug.
 *
 * PillarId itself is re-exported, not redefined: domain/schema/pillars.ts is
 * the single source of truth for the enum (blueprint/04 "single source of
 * truth"); a second definition here would only be able to drift from it.
 */
export type { PillarId }

export const pillarHues: Record<PillarId, { light: string; dark: string }> = {
  engineering: { light: '#5B7A9D', dark: '#7A97B8' },
  university: { light: '#A98D4B', dark: '#C2A968' },
  english: { light: '#6E8F6E', dark: '#8CAB8C' },
  health: { light: '#B0725E', dark: '#C68D7B' },
  spirit: { light: '#8A7AA0', dark: '#A394BD' },
  relationships: { light: '#B07A8C', dark: '#C795A7' },
}

/**
 * Literal Tailwind class names, keyed by pillar (blueprint/05: pillar hues
 * appear only as accents). Written out in full — not built as `bg-${hue}` —
 * because Tailwind's build-time scanner only finds classes that appear as
 * literal strings in source; a template-interpolated class name would
 * silently fail to generate its CSS.
 */
export const pillarDotClass: Record<PillarId, string> = {
  engineering: 'bg-engineering',
  university: 'bg-university',
  english: 'bg-english',
  health: 'bg-health',
  spirit: 'bg-spirit',
  relationships: 'bg-relationships',
}

export const base = {
  light: {
    bg: '#FAF9F7',
    surface: '#FFFFFF',
    ink: '#1A1A18',
    inkMuted: '#6F6D66',
    line: '#E7E5E0',
  },
  dark: {
    bg: '#0E1116',
    surface: '#151A21',
    ink: '#E8E6E1',
    inkMuted: '#8A8F98',
    line: '#232933',
  },
} as const
