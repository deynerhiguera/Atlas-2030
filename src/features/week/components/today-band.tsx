import { setTodayEnergy, setTodayLine } from '@/data/actions'
import { EnergyDial, OneLiner } from '@/design/components'
import { ONE_LINER_PROMPTS } from '@/design/copy'
import type { Signal } from '@/domain/schema'

interface TodayBandProps {
  signal?: Signal
}

/**
 * The entire daily obligation (blueprint/02): energy + an optional line,
 * both same-day only, both persisted immediately through data/actions.
 * Rendered only for the current week — a past week has no "today".
 */
export function TodayBand({ signal }: TodayBandProps) {
  return (
    <div className="flex flex-col items-center gap-6 border-t border-line pt-8">
      <EnergyDial
        {...(signal?.energy !== undefined ? { value: signal.energy } : {})}
        onChange={setTodayEnergy}
      />
      <div className="w-full max-w-sm">
        <OneLiner
          {...(signal?.line !== undefined ? { value: signal.line } : {})}
          onCommit={setTodayLine}
          promptRotation={[...ONE_LINER_PROMPTS]}
        />
      </div>
    </div>
  )
}
