import { useCallback, useEffect, useState, type ReactNode } from 'react'

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

function systemTheme(): ResolvedTheme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [setting, setSettingState] = useState<ThemeSetting>(readStoredSetting)
  const [resolved, setResolved] = useState<ResolvedTheme>(() =>
    setting === 'system' ? systemTheme() : setting,
  )

  const setSetting = useCallback((next: ThemeSetting) => {
    setSettingState(next)
    try {
      if (next === 'system') localStorage.removeItem(THEME_STORAGE_KEY)
      else localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      // Storage unavailable: the theme still applies for this session.
    }
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
