import { useState } from 'react'

import { Button } from '@/design/primitives/button'
import { Text } from '@/design/primitives/text'
import { TextArea } from '@/design/primitives/textarea'
import { FOUNDING_LETTER_BODY, FOUNDING_LETTER_PLACEHOLDER, FOUNDING_LETTER_TITLE } from '@/design/copy'

interface LetterStepProps {
  onSeal: (text: string) => void
}

/** Step 2. The draft lives only in this component's state until sealed — nothing partial is ever persisted. */
export function LetterStep({ onSeal }: LetterStepProps) {
  const [text, setText] = useState('')

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Text variant="title" as="h1">
          {FOUNDING_LETTER_TITLE}
        </Text>
        <Text variant="body" as="p" muted>
          {FOUNDING_LETTER_BODY}
        </Text>
      </div>
      <TextArea
        serif
        rows={12}
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder={FOUNDING_LETTER_PLACEHOLDER}
        maxLength={20000}
        aria-label="Your letter to 2030"
        autoFocus
      />
      <div>
        <Button variant="solid" disabled={text.trim().length === 0} onClick={() => onSeal(text)}>
          Seal it
        </Button>
      </div>
    </div>
  )
}
