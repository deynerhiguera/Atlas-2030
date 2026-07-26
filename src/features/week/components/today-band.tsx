import { memo } from 'react'

import { setTodayEnergy, setTodayLine } from '@/data/actions'
import { useAtlasStore } from '@/data/store'
import { EnergyDial, OneLiner } from '@/design/components'
import { ONE_LINER_PROMPTS } from '@/design/copy'
import { todayLocal } from '@/domain/time'

/**
 * The entire daily obligation (blueprint/02): energy + an optional line,
 * both same-day only, both persisted immediately through data/actions.
 * Rendered only for the current week — a past week has no "today".
 *
 * Selects only today's own Signal — marking a session, closing a question,
 * or turning a book's page never re-renders this band (blueprint/07's
 * performance note), and vice versa.
 */
export const TodayBand = memo(function TodayBand() {
  const today = todayLocal()
  const signal = useAtlasStore((state) => state.doc?.signals.find((entry) => entry.date === today))

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
})
