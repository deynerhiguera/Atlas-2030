import { useState, type FormEvent } from 'react'

import { addSystem } from '@/data/actions'
import { Button } from '@/design/primitives/button'
import { Text } from '@/design/primitives/text'
import { TextField } from '@/design/primitives/text-field'
import { FOUNDING_SYSTEMS_BODY, FOUNDING_SYSTEMS_TITLE } from '@/design/copy'
import { PILLAR_IDS, pillarLabels, type PillarId, type System } from '@/domain/schema'
import { cn } from '@/lib/cn'

const RHYTHM_OPTIONS = [1, 2, 3, 4, 5, 6, 7] as const
const DEFAULT_RHYTHM = 3
const MAX_SYSTEMS = 10

interface SystemsStepProps {
  systems: readonly System[]
  onContinue: () => void
}

/** Step 10 (FR-F5): 1–10 systems. Declaring one here is exactly `addSystem` — the ceremony adds no shape of its own. */
export function SystemsStep({ systems, onContinue }: SystemsStepProps) {
  const [name, setName] = useState('')
  const [pillar, setPillar] = useState<PillarId>('engineering')
  const [rhythmPerWeek, setRhythmPerWeek] = useState<number>(DEFAULT_RHYTHM)
  const atLimit = systems.length >= MAX_SYSTEMS

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const trimmed = name.trim()
    if (trimmed.length === 0 || atLimit) return
    addSystem({ name: trimmed, pillar, rhythmPerWeek })
    setName('')
    setPillar('engineering')
    setRhythmPerWeek(DEFAULT_RHYTHM)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Text variant="title" as="h1">
          {FOUNDING_SYSTEMS_TITLE}
        </Text>
        <Text variant="body" as="p" muted>
          {FOUNDING_SYSTEMS_BODY}
        </Text>
      </div>

      {systems.length > 0 && (
        <ul className="flex flex-col gap-2">
          {systems.map((system) => (
            <li
              key={system.id}
              className="flex items-center justify-between rounded-control border border-line px-3 py-2"
            >
              <Text variant="body" as="span">
                {system.name}
              </Text>
              <Text variant="ui" as="span" muted>
                {pillarLabels[system.pillar]} · {system.rhythmPerWeek}×/week
              </Text>
            </li>
          ))}
        </ul>
      )}

      {!atLimit && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" aria-label="Declare a system">
          <TextField
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Deep Learning"
            maxLength={60}
            aria-label="Name"
            autoFocus={systems.length === 0}
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
          <div>
            <Button type="submit" variant="quiet" size="sm" disabled={name.trim().length === 0}>
              + Add
            </Button>
          </div>
        </form>
      )}

      <div>
        <Button variant="solid" disabled={systems.length === 0} onClick={onContinue}>
          Continue
        </Button>
      </div>
    </div>
  )
}
