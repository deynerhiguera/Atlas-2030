import { useState } from 'react'

import { Text } from '@/design/primitives/text'
import { WELCOME_BACK_LINE } from '@/design/copy'

export const WELCOME_BACK_THRESHOLD_DAYS = 14

interface WelcomeBackProps {
  daysSinceActivity: number | null
}

/**
 * Week state (blueprint/02, design/02 "the vanishing"): on return after
 * ≥14 days, one quiet line — no count of days missed, no streak-broken
 * framing. Dismissing it is a per-mount choice, not a persisted one: the
 * banner's only job is to acknowledge the gap once on the screen that
 * greets a real return, and a fresh mount only happens by actually coming
 * back to the app, not by re-rendering within a session already open.
 */
export function WelcomeBack({ daysSinceActivity }: WelcomeBackProps) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed || daysSinceActivity === null || daysSinceActivity < WELCOME_BACK_THRESHOLD_DAYS) {
    return null
  }

  return (
    <div className="flex items-center justify-between gap-4 rounded-control bg-surface px-4 py-3">
      <Text variant="body" as="p">
        {WELCOME_BACK_LINE}
      </Text>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss"
        className="text-ink-muted transition-colors duration-instant ease-settle hover:text-ink"
      >
        <Text variant="ui" as="span">
          Dismiss
        </Text>
      </button>
    </div>
  )
}
