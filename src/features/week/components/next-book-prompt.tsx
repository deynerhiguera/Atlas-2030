import { useState, type FormEvent } from 'react'

import type { StartBookInput } from '@/data/actions'
import { Button } from '@/design/primitives/button'
import { Text } from '@/design/primitives/text'
import { TextField } from '@/design/primitives/text-field'
import { PILLAR_IDS, pillarLabels, type PillarId } from '@/domain/schema'

interface NextBookPromptProps {
  title: string
  body: string
  onStart: (input: StartBookInput) => void
  submitLabel?: string
  onSkip?: () => void
  skipLabel?: string
}

/**
 * The permanent entry point for a new current book (blueprint/06
 * NextBookPrompt) — the Week screen's empty state, and, with `onSkip`
 * present, the inline offer inside BookSheet right after finishing or
 * setting one down (FR-B5: "both endings then offer starting the next
 * book"). Asks only what and why, like an inscription.
 */
export function NextBookPrompt({
  title,
  body,
  onStart,
  submitLabel = 'Start',
  onSkip,
  skipLabel = 'Not yet',
}: NextBookPromptProps) {
  const [bookTitle, setBookTitle] = useState('')
  const [why, setWhy] = useState('')
  const [pillar, setPillar] = useState<PillarId>('engineering')

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const trimmedTitle = bookTitle.trim()
    const trimmedWhy = why.trim()
    if (trimmedTitle.length === 0 || trimmedWhy.length === 0) return
    onStart({ title: trimmedTitle, pillar, why: trimmedWhy })
    setBookTitle('')
    setWhy('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center gap-4 rounded-card border border-line px-6 py-8 text-center"
      aria-label="Start a book"
    >
      <Text variant="body" as="p">
        {title}
      </Text>
      <Text variant="ui" as="p" muted>
        {body}
      </Text>
      <div className="flex w-full max-w-sm flex-col gap-2">
        <TextField
          value={bookTitle}
          onChange={(event) => setBookTitle(event.target.value)}
          placeholder="Title"
          maxLength={200}
          aria-label="Book title"
          autoFocus
        />
        <TextField
          serif
          value={why}
          onChange={(event) => setWhy(event.target.value)}
          placeholder="I'm reading this because…"
          maxLength={500}
          aria-label="Why you're reading it"
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
        <Button
          type="submit"
          variant="solid"
          size="sm"
          disabled={bookTitle.trim().length === 0 || why.trim().length === 0}
        >
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
