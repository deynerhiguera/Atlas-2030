import type { ReactNode } from 'react'

import { useAtlasStore } from '@/data/store'
import { MotionModeOverrideContext } from '@/design/hooks/motion-mode-context'

/**
 * Feeds `doc.settings.reducedMotion` into `MotionModeOverrideContext` — the
 * `app/`-side half of the split described in that file. `useAtlasStore`
 * itself already defaults to a document-less `null` before hydration and to
 * default Settings (`reducedMotion: 'system'`) once hydrated, so there is no
 * separate "not loaded yet" case to handle here.
 */
export function MotionModeProvider({ children }: { children: ReactNode }) {
  const override = useAtlasStore((state) => state.doc?.settings.reducedMotion ?? 'system')
  return <MotionModeOverrideContext value={override}>{children}</MotionModeOverrideContext>
}
