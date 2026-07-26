import { useState, type KeyboardEvent } from 'react'

import { TextField } from '@/design/primitives/text-field'
import { cn } from '@/lib/cn'
import type { BookProgress } from '@/domain/schema'

const KINDS = ['page', 'percent'] as const

interface ProgressEditorProps {
  progress?: BookProgress
  onChange: (progress: BookProgress) => void
}

/**
 * FR-B2: progress as a marginal note, not a bar — a unit toggle and a
 * number, persisted on Enter or on leaving the field. Local state is the
 * source of truth once mounted; nothing else can change a book's progress,
 * so there is no external value to reconcile back into it.
 */
export function ProgressEditor({ progress, onChange }: ProgressEditorProps) {
  const [kind, setKind] = useState<(typeof KINDS)[number]>(progress?.kind ?? 'page')
  const [value, setValue] = useState<string>(() => {
    if (progress === undefined) return ''
    return String(progress.kind === 'page' ? progress.page : progress.percent)
  })

  function commit() {
    const parsed = Number.parseInt(value, 10)
    if (!Number.isFinite(parsed)) return
    if (kind === 'page') {
      if (parsed < 1) return
      onChange({ kind: 'page', page: parsed })
    } else {
      if (parsed < 0 || parsed > 100) return
      onChange({ kind: 'percent', percent: parsed })
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault()
      commit()
    }
  }

  return (
    <div className="flex items-center gap-2">
      <div role="radiogroup" aria-label="Progress unit" className="flex items-center gap-1">
        {KINDS.map((option) => (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={kind === option}
            onClick={() => setKind(option)}
            className={cn(
              'rounded-control border px-2 py-1 text-ui transition-colors duration-instant ease-settle',
              kind === option
                ? 'border-ink bg-ink text-bg'
                : 'border-line text-ink-muted hover:border-ink-muted',
            )}
          >
            {option === 'page' ? 'Page' : '%'}
          </button>
        ))}
      </div>
      <TextField
        type="number"
        inputMode="numeric"
        min={kind === 'page' ? 1 : 0}
        {...(kind === 'percent' ? { max: 100 } : {})}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={commit}
        aria-label={kind === 'page' ? 'Current page' : 'Percent complete'}
        className="w-24"
      />
    </div>
  )
}
