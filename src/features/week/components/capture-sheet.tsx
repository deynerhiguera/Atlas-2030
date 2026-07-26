import { useEffect, useState, type FormEvent } from 'react'

import { addBookIdea, addQuestionNote, captureMilestone } from '@/data/actions'
import { Button } from '@/design/primitives/button'
import { Sheet } from '@/design/primitives/sheet'
import { Text } from '@/design/primitives/text'
import { TextArea } from '@/design/primitives/textarea'
import { CAPTURE_DESCRIPTION, CAPTURE_MILESTONE_PLACEHOLDER, CAPTURE_TITLE } from '@/design/copy'
import { PILLAR_IDS, pillarLabels, type PillarId } from '@/domain/schema'
import { cn } from '@/lib/cn'

type Destination = 'milestone' | 'question' | 'book'

const destinationLabels: Record<Destination, string> = {
  milestone: 'Milestone',
  question: 'Question note',
  book: 'Book idea',
}

interface CaptureSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  liveQuestion?: { id: string; text: string }
  readingBook?: { id: string; title: string }
}

/**
 * The single, obvious way to capture without leaving the Week screen
 * (blueprint update, M4 — replaces the never-built ⌘K command bar). One
 * sheet, three possible destinations; the form adapts to whichever is
 * selected, and only destinations with somewhere to go appear at all.
 *
 * Writes nothing itself — every destination calls the exact action its own
 * Sheet already uses (captureMilestone, addQuestionNote, addBookIdea), so
 * there is exactly one place each of those mutations can happen.
 */
export function CaptureSheet({ open, onOpenChange, liveQuestion, readingBook }: CaptureSheetProps) {
  const available: Destination[] = [
    'milestone',
    ...(liveQuestion !== undefined ? (['question'] as const) : []),
    ...(readingBook !== undefined ? (['book'] as const) : []),
  ]

  const [destination, setDestination] = useState<Destination>('milestone')
  const [text, setText] = useState('')
  const [pillar, setPillar] = useState<PillarId | ''>('')
  const [note, setNote] = useState('')

  useEffect(() => {
    if (open) {
      setDestination('milestone')
      setText('')
      setPillar('')
      setNote('')
    }
  }, [open])

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const trimmed = text.trim()
    if (trimmed.length === 0) return

    if (destination === 'milestone') {
      captureMilestone({
        text: trimmed,
        ...(pillar !== '' ? { pillar } : {}),
        ...(note.trim().length > 0 ? { note: note.trim() } : {}),
      })
    } else if (destination === 'question' && liveQuestion !== undefined) {
      addQuestionNote(liveQuestion.id, trimmed)
    } else if (destination === 'book' && readingBook !== undefined) {
      addBookIdea(readingBook.id, trimmed)
    }

    onOpenChange(false)
  }

  const placeholder =
    destination === 'milestone'
      ? CAPTURE_MILESTONE_PLACEHOLDER
      : destination === 'question'
        ? 'What did you notice?'
        : 'What did this change?'

  const context =
    destination === 'question'
      ? liveQuestion?.text
      : destination === 'book'
        ? readingBook?.title
        : undefined

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      title={
        <Text variant="title" as="span">
          {CAPTURE_TITLE}
        </Text>
      }
      description={CAPTURE_DESCRIPTION}
    >
      <form onSubmit={handleSubmit} className="mt-6 flex flex-1 flex-col gap-6">
        {available.length > 1 && (
          <div role="radiogroup" aria-label="What are you capturing?" className="flex gap-2">
            {available.map((option) => (
              <button
                key={option}
                type="button"
                role="radio"
                aria-checked={destination === option}
                onClick={() => setDestination(option)}
                className={cn(
                  'rounded-full border px-3 py-1 text-ui transition-colors duration-instant ease-settle',
                  destination === option
                    ? 'border-ink bg-ink text-bg'
                    : 'border-line text-ink-muted hover:border-ink-muted',
                )}
              >
                {destinationLabels[option]}
              </button>
            ))}
          </div>
        )}

        {context !== undefined && (
          <Text variant="ui" as="p" muted>
            {context}
          </Text>
        )}

        <TextArea
          serif
          rows={destination === 'milestone' ? 3 : 5}
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder={placeholder}
          aria-label={destinationLabels[destination]}
          autoFocus
        />

        {destination === 'milestone' && (
          <>
            <select
              value={pillar}
              onChange={(event) => setPillar(event.target.value as PillarId | '')}
              aria-label="Pillar (optional)"
              className="rounded-control border border-line bg-transparent px-3 py-2 text-body text-ink focus-visible:border-ink"
            >
              <option value="">No pillar</option>
              {PILLAR_IDS.map((id) => (
                <option key={id} value={id}>
                  {pillarLabels[id]}
                </option>
              ))}
            </select>
            <TextArea
              serif
              rows={2}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="A note, if you'd like (optional)"
              aria-label="Note (optional)"
            />
          </>
        )}

        <Button
          type="submit"
          variant="solid"
          size="sm"
          disabled={text.trim().length === 0}
          className="self-start"
        >
          Capture
        </Button>
      </form>
    </Sheet>
  )
}
