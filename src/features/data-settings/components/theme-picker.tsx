import { useTheme } from '@/app/providers/use-theme'
import type { ThemeSetting } from '@/app/providers/theme-context'
import { setTheme as persistTheme } from '@/data/actions'
import { Button } from '@/design/primitives/button'
import { Text } from '@/design/primitives/text'

const options: { value: ThemeSetting; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Paper' },
  { value: 'dark', label: 'Observatory' },
]

/**
 * The rail's ThemeToggle (app/shell) is the live mechanism — untouched here.
 * This picker calls it directly for the immediate visual effect, and also
 * writes through to the document's Settings so the preference round-trips
 * through export/import; the two are not yet reconciled on load (a future
 * milestone's cleanup item, matching how `letter`/`seasons`/etc. are also
 * unwired to any UI yet at this stage).
 */
export function ThemePicker() {
  const { setting, setSetting } = useTheme()

  function choose(next: ThemeSetting) {
    setSetting(next)
    persistTheme(next)
  }

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
            onClick={() => choose(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </section>
  )
}
