import { useTheme } from '@/app/providers/use-theme'
import type { ThemeSetting } from '@/app/providers/theme-context'
import { Button } from '@/design/primitives/button'
import { Text } from '@/design/primitives/text'

const options: { value: ThemeSetting; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Paper' },
  { value: 'dark', label: 'Observatory' },
]

/**
 * The rail's ThemeToggle (app/shell) is the quick, always-visible mechanism;
 * this is the same choice laid out explicitly. Both call `setSetting`
 * directly — it is the only path that persists a theme now, so there is
 * nothing else for either control to do.
 */
export function ThemePicker() {
  const { setting, setSetting } = useTheme()

  return (
    <section className="flex items-center justify-between gap-6 border-b border-line py-8">
      <div className="flex flex-col gap-1">
        <Text variant="body" as="h2">
          Theme
        </Text>
        <Text variant="ui" as="p" muted>
          Paper by day, Observatory by night — or follow the system.
        </Text>
      </div>
      <div className="flex items-center gap-2" role="group" aria-label="Theme">
        {options.map((option) => (
          <Button
            key={option.value}
            variant={setting === option.value ? 'solid' : 'quiet'}
            size="sm"
            aria-pressed={setting === option.value}
            onClick={() => setSetting(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </section>
  )
}
