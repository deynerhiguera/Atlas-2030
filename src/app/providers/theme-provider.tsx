import { useCallback, useEffect, useState, type ReactNode } from 'react'

import { setTheme } from '@/data/actions'
import { useAtlasStore } from '@/data/store'

import {
  THEME_STORAGE_KEY,
  ThemeContext,
  type ResolvedTheme,
  type ThemeSetting,
} from './theme-context'

function readStoredSetting(): ThemeSetting {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    return stored === 'light' || stored === 'dark' ? stored : 'system'
  } catch {
    return 'system'
  }
}

function writeStoredSetting(next: ThemeSetting): void {
  try {
    if (next === 'system') localStorage.removeItem(THEME_STORAGE_KEY)
    else localStorage.setItem(THEME_STORAGE_KEY, next)
  } catch {
    // Storage unavailable: the theme still applies for this session.
  }
}

function systemTheme(): ResolvedTheme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/**
 * `doc.settings.theme` is the single source of truth once the document
 * exists (which, by the time this ever mounts, it always does — `main.tsx`
 * awaits hydration first). `localStorage` remains only as the pre-paint
 * cache `index.html`'s inline script reads before React runs at all, and
 * as the fallback on the rare render where hydration itself failed.
 *
 * `setSetting` is the one path every theme control now goes through — both
 * the rail's ThemeToggle and `/data`'s ThemePicker call it, and it alone
 * decides where the change goes: local state (immediate visual), the
 * document (so it round-trips through export/import and survives reload),
 * and the pre-paint cache. Previously ThemeToggle only updated local state,
 * so a preference set from the rail never actually persisted.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const docTheme = useAtlasStore((state) => state.doc?.settings.theme)
  const [setting, setSettingState] = useState<ThemeSetting>(() => docTheme ?? readStoredSetting())
  const [resolved, setResolved] = useState<ResolvedTheme>(() =>
    setting === 'system' ? systemTheme() : setting,
  )

  useEffect(() => {
    if (docTheme !== undefined) setSettingState(docTheme)
  }, [docTheme])

  const setSetting = useCallback((next: ThemeSetting) => {
    setSettingState(next)
    setTheme(next)
    writeStoredSetting(next)
  }, [])

  useEffect(() => {
    if (setting !== 'system') {
      setResolved(setting)
      return
    }
    setResolved(systemTheme())
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => setResolved(systemTheme())
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [setting])

  useEffect(() => {
    document.documentElement.dataset.theme = resolved
  }, [resolved])

  return <ThemeContext value={{ setting, resolved, setSetting }}>{children}</ThemeContext>
}
