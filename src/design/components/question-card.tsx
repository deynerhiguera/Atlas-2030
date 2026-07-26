import type { KeyboardEvent } from 'react'

import { Chip } from '@/design/primitives/chip'
import { Text } from '@/design/primitives/text'
import type { DayString, Question, QuestionState } from '@/domain/schema'
import { daysBetween, todayLocal } from '@/domain/time'

const stateLabels: Record<QuestionState, string> = {
  open: 'open',
  exploring: 'exploring',
  answered: 'answered',
}

function carriedLabel(askedOn: DayString): string | null {
  const weeks = Math.floor(daysBetween(askedOn, todayLocal()) / 7)
  if (weeks < 1) return null
  return `Carried for ${weeks} week${weeks === 1 ? '' : 's'}`
}

interface QuestionCardProps {
  question: Pick<Question, 'text' | 'state' | 'askedOn'>
  onOpen: () => void
}

/**
 * The week's inquiry, above the systems grid (blueprint/06). Serif, because
 * this is the user's own words — the interface's job is to stay out of the
 * way of it.
 */
export function QuestionCard({ question, onOpen }: QuestionCardProps) {
  const carried = carriedLabel(question.askedOn)

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onOpen()
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-haspopup="dialog"
      onClick={onOpen}
      onKeyDown={handleKeyDown}
      className="flex cursor-pointer flex-col items-start gap-2 rounded-card border border-line px-6 py-5 text-left outline-none transition-colors duration-instant ease-settle hover:bg-surface focus-visible:border-ink"
    >
      <div className="flex w-full items-center justify-between gap-4">
        <Text variant="quote" as="p" className="text-balance">
          {question.text}
        </Text>
        <Chip className="shrink-0">{stateLabels[question.state]}</Chip>
      </div>
      {carried !== null && (
        <Text variant="ui" as="p" muted>
          {carried}
        </Text>
      )}
    </div>
  )
}
