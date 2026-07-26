import { createContext } from 'react'

export type ThemeSetting = 'system' | 'light' | 'dark'
export type ResolvedTheme = 'light' | 'dark'

export interface ThemeContextValue {
  setting: ThemeSetting
  resolved: ResolvedTheme
  setSetting: (next: ThemeSetting) => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

export const THEME_STORAGE_KEY = 'atlas.theme'
