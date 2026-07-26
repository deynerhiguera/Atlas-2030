import type { ReducedMotionSetting, ThemeSetting } from '@/domain/schema'

import { getCurrentDoc, replaceDoc } from '../store/atlas-store'

/** Settings is the one freely-mutable entity (blueprint/04) — no invariant to check. */
export function setTheme(theme: ThemeSetting): void {
  const doc = getCurrentDoc()
  if (doc === null) return
  replaceDoc({ ...doc, settings: { ...doc.settings, theme } })
}

export function setReducedMotion(mode: ReducedMotionSetting): void {
  const doc = getCurrentDoc()
  if (doc === null) return
  replaceDoc({ ...doc, settings: { ...doc.settings, reducedMotion: mode } })
}
