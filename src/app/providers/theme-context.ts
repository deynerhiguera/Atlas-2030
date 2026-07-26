import { createContext } from 'react'

import type { ThemeSetting } from '@/domain/schema'

/**
 * Re-exported, not redefined: `domain/schema`'s `ThemeSetting` is the type
 * persisted in `doc.settings.theme`, and this app-level setting is that
 * same value — a second, separately-declared type here could only drift
 * from it (the same reasoning `design/tokens/color.ts` applies to `PillarId`).
 */
export type { ThemeSetting }
export type ResolvedTheme = 'light' | 'dark'

export interface ThemeContextValue {
  setting: ThemeSetting
  resolved: ResolvedTheme
  setSetting: (next: ThemeSetting) => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

export const THEME_STORAGE_KEY = 'atlas.theme'
