import { IconButton } from '@/design/primitives/icon-button'

import type { ThemeSetting } from '../providers/theme-context'
import { useTheme } from '../providers/use-theme'

const order: ThemeSetting[] = ['system', 'light', 'dark']

const labels: Record<ThemeSetting, string> = {
  system: 'Theme: following the system',
  light: 'Theme: paper',
  dark: 'Theme: observatory',
}

function ThemeGlyph({ setting }: { setting: ThemeSetting }) {
  // 16px, stroke 1.5 — the iconography spec (blueprint/05).
  const common = {
    width: 16,
    height: 16,
    viewBox: '0 0 16 16',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  } as const

  if (setting === 'light') {
    return (
      <svg {...common}>
        <circle cx="8" cy="8" r="3" />
        <path d="M8 1.5v1.5M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1 1M11.6 11.6l1 1M12.6 3.4l-1 1M4.4 11.6l-1 1" />
      </svg>
    )
  }
  if (setting === 'dark') {
    return (
      <svg {...common}>
        <path d="M13.5 9.5a5.5 5.5 0 1 1-7-7 6 6 0 1 0 7 7Z" />
      </svg>
    )
  }
  return (
    <svg {...common}>
      <rect x="1.5" y="3" width="13" height="8.5" rx="1.5" />
      <path d="M5.5 14.5h5" />
    </svg>
  )
}

export function ThemeToggle() {
  const { setting, setSetting } = useTheme()
  const next = order[(order.indexOf(setting) + 1) % order.length] as ThemeSetting

  return (
    <IconButton label={`${labels[setting]} — switch`} onClick={() => setSetting(next)}>
      <ThemeGlyph setting={setting} />
    </IconButton>
  )
}
