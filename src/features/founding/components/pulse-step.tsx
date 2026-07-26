import { setTodayEnergy, setTodayLine } from '@/data/actions'
import { EnergyDial, OneLiner } from '@/design/components'
import { Button } from '@/design/primitives/button'
import { Text } from '@/design/primitives/text'
import { FOUNDING_PULSE_BODY, FOUNDING_PULSE_TITLE, ONE_LINER_PROMPTS } from '@/design/copy'

interface PulseStepProps {
  energy?: number
  line?: string
  onContinue: () => void
}

/** Step 13. The same actions and components the Today band uses ever after — today's texture is real, not a preview. */
export function PulseStep({ energy, line, onContinue }: PulseStepProps) {
  return (
    <div className="flex flex-col items-center gap-8 text-center">
      <div className="flex flex-col gap-2">
        <Text variant="title" as="h1">
          {FOUNDING_PULSE_TITLE}
        </Text>
        <Text variant="body" as="p" muted>
          {FOUNDING_PULSE_BODY}
        </Text>
      </div>

      <EnergyDial {...(energy !== undefined ? { value: energy } : {})} onChange={setTodayEnergy} />

      <div className="w-full max-w-sm">
        <OneLiner
          {...(line !== undefined ? { value: line } : {})}
          onCommit={setTodayLine}
          promptRotation={ONE_LINER_PROMPTS}
        />
      </div>

      <Button variant="solid" disabled={energy === undefined} onClick={onContinue}>
        Enter the week
      </Button>
    </div>
  )
}
