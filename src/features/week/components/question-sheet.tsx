import { useEffect, useState, type FormEvent } from 'react'

import { addQuestionNote, closeQuestion } from '@/data/actions'
import { Button } from '@/design/primitives/button'
import { Chip } from '@/design/primitives/chip'
import { Sheet } from '@/design/primitives/sheet'
import { Text } from '@/design/primitives/text'
import { TextArea } from '@/design/primitives/textarea'
import { IdeaTrail } from '@/design/components/idea-trail'
import { NOTE_ADD_LABEL, NOTE_EMPTY_HINT } from '@/design/copy'
import type { Question, QuestionState } from '@/domain/schema'

const dateFormatter = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' })

const stateLabels: Record<QuestionState, string> = {
  open: 'open',
  exploring: 'exploring',
  answered: 'answered',
}

type Phase = { kind: 'viewing' } | { kind: 'closing' }

interface QuestionSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  question?: Question
  history: readonly Question[]
}

/**
 * blueprint/02: question hero, note trail, close-with-answer, and the
 * history of every question answered so far — reachable whether or not a
 * question is currently live (opened either from QuestionCard or from the
 * "Past questions" link beside AskNextPrompt).
 *
 * Closing a question closes the sheet immediately rather than opening an
 * inline "ask next" step here too: QuestionSection's own empty state
 * already renders AskNextPrompt the instant no live question remains, and
 * showing that same form a second time, layered inside the sheet over the
 * identical form on the page behind it, was tried and rejected during M3 —
 * two live "ask a question" forms on screen at once is confusion, not
 * guidance. One prompt, one place is the guide.
 *
 * `phase` resets whenever `open` becomes true — the effect only re-runs on
 * that transition (not on every render while already open), so reopening
 * always starts from "viewing" without needing to watch `question` too.
 */
export function QuestionSheet({ open, onOpenChange, question, history }: QuestionSheetProps) {
  const [phase, setPhase] = useState<Phase>({ kind: 'viewing' })
  const [answer, setAnswer] = useState('')

  useEffect(() => {
    if (open) {
      setPhase({ kind: 'viewing' })
      setAnswer('')
    }
  }, [open])

  function handleCloseSubmit(event: FormEvent) {
    event.preventDefault()
    if (question === undefined) return
    const trimmed = answer.trim()
    if (trimmed.length === 0) return
    closeQuestion(question.id, trimmed)
    onOpenChange(false)
  }

  const title =
    question !== undefined ? (
      <Text variant="quote" as="span">
        {question.text}
      </Text>
    ) : (
      <Text variant="title" as="span">
        Questions
      </Text>
    )

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description="The current question, its notes, and every question answered so far."
    >
      <div className="mt-6 flex flex-1 flex-col gap-8 overflow-y-auto">
        {question !== undefined && phase.kind === 'viewing' && (
          <section className="flex flex-col gap-6">
            <Chip className="self-start">{stateLabels[question.state]}</Chip>
            <IdeaTrail
              items={question.notes}
              onAdd={(text) => addQuestionNote(question.id, text)}
              addLabel={NOTE_ADD_LABEL}
              emptyHint={NOTE_EMPTY_HINT}
            />
            <Button
              variant="quiet"
              size="sm"
              className="self-start"
              onClick={() => setPhase({ kind: 'closing' })}
            >
              Close this question
            </Button>
          </section>
        )}

        {question !== undefined && phase.kind === 'closing' && (
          <form
            onSubmit={handleCloseSubmit}
            className="flex flex-col gap-3"
            aria-label="Close this question"
          >
            <Text variant="ui" as="p" muted>
              Write the answer in your own words.
            </Text>
            <TextArea
              serif
              rows={6}
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              aria-label="Answer"
              autoFocus
            />
            <div className="flex items-center gap-2">
              <Button type="submit" variant="solid" size="sm" disabled={answer.trim().length === 0}>
                Close
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

        {history.length > 0 && (
          <section className="flex flex-col gap-6">
            <Text variant="label" as="h3" muted>
              Answered before
            </Text>
            <ol className="flex flex-col gap-6">
              {history.map((entry) => (
                <li key={entry.id} className="flex flex-col gap-1 border-t border-line pt-4">
                  {entry.answeredAt !== undefined && (
                    <Text variant="label" as="span" muted className="tabular">
                      {dateFormatter.format(new Date(entry.answeredAt))}
                    </Text>
                  )}
                  <Text variant="read" as="p">
                    {entry.text}
                  </Text>
                  {entry.answer !== undefined && (
                    <Text variant="read" as="p" muted>
                      {entry.answer}
                    </Text>
                  )}
                </li>
              ))}
            </ol>
          </section>
        )}
      </div>
    </Sheet>
  )
}
