import { useState } from 'react'

import { Button } from '@/design/primitives/button'
import { Text } from '@/design/primitives/text'
import { TextArea } from '@/design/primitives/textarea'
import { FOUNDING_IDENTITY_BODY, identityPlaceholders } from '@/design/copy'
import { pillarLabels, type PillarId } from '@/domain/schema'

interface IdentityStepProps {
  pillar: PillarId
  index: number
  total: number
  onContinue: (text: string) => void
}

/** Steps 4–9. One pillar per screen (blueprint/06: "one input per screen"). */
export function IdentityStep({ pillar, index, total, onContinue }: IdentityStepProps) {
  const [text, setText] = useState('')

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Text variant="label" as="p" muted>
          Pillar {index} of {total}
        </Text>
        <Text variant="title" as="h1">
          {pillarLabels[pillar]}
        </Text>
        <Text variant="body" as="p" muted>
          {FOUNDING_IDENTITY_BODY}
        </Text>
      </div>
      <TextArea
        serif
        rows={5}
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder={identityPlaceholders[pillar]}
        maxLength={600}
        aria-label={`Your identity statement for ${pillarLabels[pillar]}`}
        autoFocus
      />
      <div>
        <Button variant="solid" disabled={text.trim().length === 0} onClick={() => onContinue(text)}>
          Continue
        </Button>
      </div>
    </div>
  )
}
