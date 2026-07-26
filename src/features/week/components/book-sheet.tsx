import { useEffect, useState, type FormEvent } from 'react'

import { addBookIdea, finishBook, setDownBook, updateBookProgress } from '@/data/actions'
import { Button } from '@/design/primitives/button'
import { Sheet } from '@/design/primitives/sheet'
import { Text } from '@/design/primitives/text'
import { TextArea } from '@/design/primitives/textarea'
import { IdeaTrail } from '@/design/components/idea-trail'
import { IDEA_ADD_LABEL, IDEA_EMPTY_HINT } from '@/design/copy'
import type { Book } from '@/domain/schema'

import { ProgressEditor } from './progress-editor'

type EndingOutcome = 'finished' | 'setDown'
type Phase = { kind: 'viewing' } | { kind: 'ending'; outcome: EndingOutcome }

interface BookSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  book?: Book
}

const endingCopy: Record<
  EndingOutcome,
  { formLabel: string; prompt: string; submitLabel: string }
> = {
  finished: { formLabel: 'Finish this book', prompt: 'What did it change?', submitLabel: 'Finish' },
  setDown: {
    formLabel: 'Set this book down',
    prompt: "Why you're setting it down (optional).",
    submitLabel: 'Set down',
  },
}

/**
 * blueprint/02: why, progress, the idea trail, and the finish/set-down
 * flows. Finishing or setting down closes the sheet immediately rather than
 * opening an inline "start the next book" step here too — see
 * QuestionSheet's note: BookSection's own empty state already renders
 * NextBookPrompt the instant no book is being read, and a second identical
 * form layered inside the sheet over that one was confusion, not guidance.
 *
 * `phase` resets whenever `open` becomes true, the same way QuestionSheet's
 * does — see its comment for why watching `open` alone is enough.
 */
export function BookSheet({ open, onOpenChange, book }: BookSheetProps) {
  const [phase, setPhase] = useState<Phase>({ kind: 'viewing' })
  const [endNote, setEndNote] = useState('')

  useEffect(() => {
    if (open) {
      setPhase({ kind: 'viewing' })
      setEndNote('')
    }
  }, [open])

  function beginEnding(outcome: EndingOutcome) {
    setEndNote('')
    setPhase({ kind: 'ending', outcome })
  }

  function handleEndingSubmit(event: FormEvent) {
    event.preventDefault()
    if (book === undefined || phase.kind !== 'ending') return
    const note = endNote.trim().length > 0 ? endNote.trim() : undefined
    if (phase.outcome === 'finished') finishBook(book.id, note)
    else setDownBook(book.id, note)
    onOpenChange(false)
  }

  const title =
    book !== undefined ? (
      <Text variant="title" as="span">
        {book.title}
      </Text>
    ) : (
      <Text variant="title" as="span">
        Reading
      </Text>
    )

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description="The current book, its progress, and the ideas it has changed."
    >
      <div className="mt-6 flex flex-1 flex-col gap-8 overflow-y-auto">
        {book !== undefined && phase.kind === 'viewing' && (
          <section className="flex flex-col gap-6">
            <Text variant="read" as="p" muted>
              {book.why}
            </Text>
            <ProgressEditor
              {...(book.progress !== undefined ? { progress: book.progress } : {})}
              onChange={(progress) => updateBookProgress(book.id, progress)}
            />
            <IdeaTrail
              items={book.ideas}
              onAdd={(text) => addBookIdea(book.id, text)}
              addLabel={IDEA_ADD_LABEL}
              emptyHint={IDEA_EMPTY_HINT}
            />
            <div className="flex items-center gap-2">
              <Button variant="quiet" size="sm" onClick={() => beginEnding('finished')}>
                Finish
              </Button>
              <Button variant="ghost" size="sm" onClick={() => beginEnding('setDown')}>
                Set down
              </Button>
            </div>
          </section>
        )}

        {phase.kind === 'ending' && (
          <form
            onSubmit={handleEndingSubmit}
            className="flex flex-col gap-3"
            aria-label={endingCopy[phase.outcome].formLabel}
          >
            <Text variant="ui" as="p" muted>
              {endingCopy[phase.outcome].prompt}
            </Text>
            <TextArea
              serif
              rows={4}
              value={endNote}
              onChange={(event) => setEndNote(event.target.value)}
              aria-label={endingCopy[phase.outcome].prompt}
              autoFocus
            />
            <div className="flex items-center gap-2">
              <Button type="submit" variant="solid" size="sm">
                {endingCopy[phase.outcome].submitLabel}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setPhase({ kind: 'viewing' })}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
    </Sheet>
  )
}
