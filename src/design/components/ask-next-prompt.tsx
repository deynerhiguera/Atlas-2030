import { useState, type FormEvent } from 'react'

import { Button } from '@/design/primitives/button'
import { Text } from '@/design/primitives/text'
import { TextField } from '@/design/primitives/text-field'
import { PILLAR_IDS, pillarLabels, type PillarId } from '@/domain/schema'

interface AskNextPromptProps {
  title: string
  body: string
  onAsk: (input: { text: string; pillar: PillarId }) => void
  submitLabel?: string
  onSkip?: () => void
  skipLabel?: string
}

/**
 * The permanent entry point for a new Engineering Question (blueprint/06
 * AskNextPrompt) — shown both as the Week screen's empty state and, with
 * `onSkip` present, inline inside QuestionSheet right after a question
 * closes, and as the Founding ceremony's own question step. Lives in
 * design/ rather than a single feature (blueprint/03 layering) because both
 * `week` and `founding` need it and features never import one another.
 */
export function AskNextPrompt({
  title,
  body,
  onAsk,
  submitLabel = 'Ask',
  onSkip,
  skipLabel = 'Not yet',
}: AskNextPromptProps) {
  const [text, setText] = useState('')
  const [pillar, setPillar] = useState<PillarId>('engineering')

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const trimmed = text.trim()
    if (trimmed.length === 0) return
    onAsk({ text: trimmed, pillar })
    setText('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center gap-4 rounded-card border border-line px-6 py-8 text-center"
      aria-label="Ask a question"
    >
      <Text variant="body" as="p">
        {title}
      </Text>
      <Text variant="ui" as="p" muted>
        {body}
      </Text>
      <div className="flex w-full max-w-sm flex-col gap-2">
        <TextField
          serif
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Why does RAM exist?"
          maxLength={300}
          aria-label="Your question"
          autoFocus
        />
        <select
          value={pillar}
          onChange={(event) => setPillar(event.target.value as PillarId)}
          aria-label="Pillar"
          className="rounded-control border border-line bg-transparent px-3 py-2 text-body text-ink focus-visible:border-ink"
        >
          {PILLAR_IDS.map((id) => (
            <option key={id} value={id}>
              {pillarLabels[id]}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-2">
        <Button type="submit" variant="solid" size="sm" disabled={text.trim().length === 0}>
          {submitLabel}
        </Button>
        {onSkip !== undefined && (
          <Button type="button" variant="ghost" size="sm" onClick={onSkip}>
            {skipLabel}
          </Button>
        )}
      </div>
    </form>
  )
}
