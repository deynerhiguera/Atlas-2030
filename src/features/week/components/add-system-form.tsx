import { useState, type FormEvent } from 'react'

import { addSystem } from '@/data/actions'
import { Button } from '@/design/primitives/button'
import { TextField } from '@/design/primitives/text-field'
import { cn } from '@/lib/cn'
import { PILLAR_IDS, pillarLabels, type PillarId } from '@/domain/schema'

const RHYTHM_OPTIONS = [1, 2, 3, 4, 5, 6, 7] as const
const DEFAULT_RHYTHM = 3

/**
 * The temporary path onto the system roster (blueprint/07 F9 note) until the
 * Founding ceremony (roadmap M6) writes systems as part of its own flow.
 * This form is deleted then; the `addSystem` action it calls is not.
 */
export function AddSystemForm() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [pillar, setPillar] = useState<PillarId>('engineering')
  const [rhythmPerWeek, setRhythmPerWeek] = useState<number>(DEFAULT_RHYTHM)

  function reset() {
    setName('')
    setPillar('engineering')
    setRhythmPerWeek(DEFAULT_RHYTHM)
    setOpen(false)
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const trimmed = name.trim()
    if (trimmed.length === 0) return
    addSystem({ name: trimmed, pillar, rhythmPerWeek })
    reset()
  }

  if (!open) {
    return (
      <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
        + Add a system
      </Button>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-card border border-line p-4"
      aria-label="Add a system"
    >
      <TextField
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Deep Learning"
        maxLength={60}
        aria-label="Name"
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

      <div role="radiogroup" aria-label="Times per week" className="flex gap-2">
        {RHYTHM_OPTIONS.map((option) => (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={rhythmPerWeek === option}
            onClick={() => setRhythmPerWeek(option)}
            className={cn(
              'size-8 rounded-control border text-ui transition-colors duration-instant ease-settle',
              rhythmPerWeek === option
                ? 'border-ink bg-ink text-bg'
                : 'border-line text-ink-muted hover:border-ink-muted',
            )}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Button type="submit" variant="solid" size="sm" disabled={name.trim().length === 0}>
          Add
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={reset}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
