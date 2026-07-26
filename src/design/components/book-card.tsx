import type { KeyboardEvent } from 'react'

import { Text } from '@/design/primitives/text'
import type { Book, BookProgress } from '@/domain/schema'

function formatProgress(progress: BookProgress | undefined): string | null {
  if (progress === undefined) return null
  return progress.kind === 'page' ? `p. ${progress.page}` : `${progress.percent}%`
}

interface BookCardProps {
  book: Pick<Book, 'title' | 'why' | 'progress'>
  onOpen: () => void
}

/**
 * The book in motion, above the systems grid (blueprint/06). Progress is a
 * marginal note, never a bar or a percentage-as-achievement — just where
 * you are. The title is a fact (sans); the why is the user's own reflection
 * (serif).
 */
export function BookCard({ book, onOpen }: BookCardProps) {
  const progressLabel = formatProgress(book.progress)

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
      <div className="flex w-full items-baseline justify-between gap-4">
        <Text variant="body" as="p">
          {book.title}
        </Text>
        {progressLabel !== null && (
          <Text variant="ui" as="span" muted className="shrink-0 tabular">
            {progressLabel}
          </Text>
        )}
      </div>
      <Text variant="read" as="p" muted className="text-balance">
        {book.why}
      </Text>
    </div>
  )
}
