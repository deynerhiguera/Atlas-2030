/** Motion tokens (blueprint/05). Durations in seconds for the Motion library. */
export const duration = {
  instant: 0.12,
  room: 0.25,
  settle: 0.35,
  page: 0.4,
  seal: 0.9,
  echo: 1.0,
} as const

/** The single signature easing. Nothing snaps; nothing bounces. */
export const easeSettle = [0.25, 1, 0.5, 1] as const

/** Universal reduced-motion replacement: parity of meaning, not absence of design. */
export const reducedFade = 0.15
