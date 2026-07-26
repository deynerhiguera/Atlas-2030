import { setReducedMotion } from '@/data/actions'
import { useAtlasStore } from '@/data/store'
import { Button } from '@/design/primitives/button'
import { Text } from '@/design/primitives/text'
import type { ReducedMotionSetting } from '@/domain/schema'

const options: { value: ReducedMotionSetting; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'on', label: 'Always reduced' },
]

/**
 * The `/data` half of "system preference + `/data` override"
 * (blueprint/03) — `useMotionMode` already reads `doc.settings.reducedMotion`
 * via `MotionModeProvider`; this is the one control that ever writes it.
 */
export function ReducedMotionPicker() {
  const setting = useAtlasStore((state) => state.doc?.settings.reducedMotion ?? 'system')

  return (
    <section className="flex items-center justify-between gap-6 border-b border-line py-8">
      <div className="flex flex-col gap-1">
        <Text variant="body" as="h2">
          Motion
        </Text>
        <Text variant="ui" as="p" muted>
          Follows your system's reduced-motion setting, or turn it off here.
        </Text>
      </div>
      <div className="flex items-center gap-2" role="group" aria-label="Motion">
        {options.map((option) => (
          <Button
            key={option.value}
            variant={setting === option.value ? 'solid' : 'quiet'}
            size="sm"
            aria-pressed={setting === option.value}
            onClick={() => setReducedMotion(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </section>
  )
}
