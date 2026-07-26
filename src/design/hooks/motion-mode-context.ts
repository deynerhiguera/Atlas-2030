import { createContext } from 'react'

/**
 * The `/data` override for reduced motion (blueprint/03: "system preference
 * + `/data` override"). Defined here, in `design/`, rather than in `app/`
 * where the provider that actually reads `doc.settings.reducedMotion`
 * lives — `design/` may not import `@/data` or `@/app`, so the context
 * object itself has to be something `design/hooks/use-motion-mode.ts` can
 * reach without crossing that boundary. The default value, `'system'`, is
 * exactly what every consumer already got before this existed: with no
 * provider in the tree (every isolated component test), `use()` returns
 * this default and behavior is unchanged.
 */
export const MotionModeOverrideContext = createContext<'system' | 'on'>('system')
