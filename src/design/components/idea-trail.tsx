import { useState, type KeyboardEvent } from 'react'

import { Text } from '@/design/primitives/text'
import { TextArea } from '@/design/primitives/textarea'

const dateFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' })

export interface IdeaTrailItem {
  id: string
  text: string
  createdAt: string
}

interface IdeaTrailProps {
  items: readonly IdeaTrailItem[]
  onAdd: (text: string) => void
  addLabel: string
  emptyHint: string
}

/**
 * Dated serif fragments, oldest first — shared shape for Question notes and
 * Book ideas (blueprint/06). A real `<ol>` rather than styled divs: screen
 * readers announce it as a list and move through it with native list
 * navigation, which is all "navigable" needs to mean for read-only content.
 */
export function IdeaTrail({ items, onAdd, addLabel, emptyHint }: IdeaTrailProps) {
  const [draft, setDraft] = useState('')

  function commit() {
    const trimmed = draft.trim()
    if (trimmed.length === 0) return
    onAdd(trimmed)
    setDraft('')
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      commit()
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {items.length === 0 ? (
        <Text variant="ui" as="p" muted>
          {emptyHint}
        </Text>
      ) : (
        <ol className="flex flex-col gap-3">
          {items.map((item) => (
            <li key={item.id} className="flex flex-col gap-1">
              <Text variant="label" as="span" muted className="tabular">
                {dateFormatter.format(new Date(item.createdAt))}
              </Text>
              <Text variant="read" as="p">
                {item.text}
              </Text>
            </li>
          ))}
        </ol>
      )}
      <TextArea
        serif
        rows={2}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
        aria-label={addLabel}
        placeholder={addLabel}
      />
    </div>
  )
}
