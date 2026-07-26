import { useState } from 'react'

import { Button } from '@/design/primitives/button'
import { Text } from '@/design/primitives/text'
import { TextField } from '@/design/primitives/text-field'
import { FOUNDING_SEASON_BODY, FOUNDING_SEASON_TITLE } from '@/design/copy'
import { PILLAR_IDS, pillarLabels, type PillarId } from '@/domain/schema'
import { cn } from '@/lib/cn'

const MAX_FOCUS_PILLARS = 3
const MIN_FOCUS_PILLARS = 2
const MAX_INTENTIONS = 3

interface SeasonStepProps {
  onContinue: (input: { name: string; focusPillars: PillarId[]; intentions: string[] }) => void
}

/** Step 11 (FR-F6). `startDate`/`plannedEndDate` are computed by `foundSeason` — no field for them here. */
export function SeasonStep({ onContinue }: SeasonStepProps) {
  const [name, setName] = useState('')
  const [focusPillars, setFocusPillars] = useState<PillarId[]>([])
  const [intentions, setIntentions] = useState<string[]>([''])

  function togglePillar(pillar: PillarId) {
    setFocusPillars((current) => {
      if (current.includes(pillar)) return current.filter((id) => id !== pillar)
      if (current.length >= MAX_FOCUS_PILLARS) return current
      return [...current, pillar]
    })
  }

  function updateIntention(index: number, text: string) {
    setIntentions((current) => current.map((value, i) => (i === index ? text : value)))
  }

  function removeIntention(index: number) {
    setIntentions((current) => current.filter((_, i) => i !== index))
  }

  const trimmedIntentions = intentions.map((text) => text.trim()).filter((text) => text.length > 0)
  const canContinue =
    name.trim().length > 0 &&
    focusPillars.length >= MIN_FOCUS_PILLARS &&
    focusPillars.length <= MAX_FOCUS_PILLARS &&
    trimmedIntentions.length > 0

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Text variant="title" as="h1">
          {FOUNDING_SEASON_TITLE}
        </Text>
        <Text variant="body" as="p" muted>
          {FOUNDING_SEASON_BODY}
        </Text>
      </div>

      <TextField
        serif
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Foundations"
        maxLength={80}
        aria-label="Season name"
        autoFocus
      />

      <div className="flex flex-col gap-2">
        <Text variant="label" as="span" muted>
          Focus pillars
        </Text>
        <div role="group" aria-label="Focus pillars" className="flex flex-wrap gap-2">
          {PILLAR_IDS.map((pillar) => {
            const selected = focusPillars.includes(pillar)
            return (
              <button
                key={pillar}
                type="button"
                aria-pressed={selected}
                onClick={() => togglePillar(pillar)}
                className={cn(
                  'rounded-full border px-3 py-1 text-ui transition-colors duration-instant ease-settle',
                  selected
                    ? 'border-ink bg-ink text-bg'
                    : 'border-line text-ink-muted hover:border-ink-muted',
                )}
              >
                {pillarLabels[pillar]}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Text variant="label" as="span" muted>
          Intentions
        </Text>
        {intentions.map((intention, index) => (
          <div key={index} className="flex items-center gap-2">
            <TextField
              serif
              value={intention}
              onChange={(event) => updateIntention(index, event.target.value)}
              placeholder="Ship something real"
              maxLength={200}
              aria-label={`Intention ${index + 1}`}
            />
            {intentions.length > 1 && (
              <Button variant="ghost" size="sm" onClick={() => removeIntention(index)}>
                Remove
              </Button>
            )}
          </div>
        ))}
        {intentions.length < MAX_INTENTIONS && (
          <Button
            variant="ghost"
            size="sm"
            className="self-start"
            onClick={() => setIntentions((current) => [...current, ''])}
          >
            + Another intention
          </Button>
        )}
      </div>

      <div>
        <Button variant="solid" disabled={!canContinue} onClick={() => onContinue({ name, focusPillars, intentions })}>
          Begin this season
        </Button>
      </div>
    </div>
  )
}
