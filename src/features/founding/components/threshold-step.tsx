import { useState } from 'react'

import { Button } from '@/design/primitives/button'
import { Text } from '@/design/primitives/text'
import {
  FOUNDING_THRESHOLD_BODY,
  FOUNDING_THRESHOLD_DECLINE_BODY,
  FOUNDING_THRESHOLD_DECLINE_TITLE,
  FOUNDING_THRESHOLD_TITLE,
} from '@/design/copy'

interface ThresholdStepProps {
  onBegin: () => void
}

/**
 * Step 1 (blueprint/02 C1). "Not tonight" (FR-F8) exits cleanly: nothing has
 * been written yet, so there is nothing to persist — the doc already exists,
 * unfounded, and closing the tab from here loses nothing.
 */
export function ThresholdStep({ onBegin }: ThresholdStepProps) {
  const [declined, setDeclined] = useState(false)

  if (declined) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <Text variant="title" as="h1">
          {FOUNDING_THRESHOLD_DECLINE_TITLE}
        </Text>
        <Text variant="body" as="p" muted>
          {FOUNDING_THRESHOLD_DECLINE_BODY}
        </Text>
        <Button variant="ghost" size="sm" onClick={() => setDeclined(false)}>
          Actually, let's begin
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <Text variant="display" as="h1">
        {FOUNDING_THRESHOLD_TITLE}
      </Text>
      <Text variant="body" as="p" muted>
        {FOUNDING_THRESHOLD_BODY}
      </Text>
      <div className="flex items-center gap-3">
        <Button variant="solid" onClick={onBegin}>
          Begin
        </Button>
        <Button variant="ghost" onClick={() => setDeclined(true)}>
          Not tonight
        </Button>
      </div>
    </div>
  )
}
