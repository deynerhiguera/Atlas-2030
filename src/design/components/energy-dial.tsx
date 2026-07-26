import { useId, type KeyboardEvent } from 'react'

import { cn } from '@/lib/cn'

const STOPS = [1, 2, 3, 4, 5] as const

/**
 * A labeled slider, five stops (blueprint/06 L2). Keyboard: arrow keys move
 * the value by one, Home/End jump to the ends — handled on the outer
 * `role="slider"` element. The five stop marks are plain, non-focusable
 * click targets layered underneath for pointer users; keyboard users never
 * need to reach them individually.
 */
interface EnergyDialProps {
  value?: number
  onChange: (value: number) => void
  disabled?: boolean
}

export function EnergyDial({ value, onChange, disabled = false }: EnergyDialProps) {
  const labelId = useId()

  function commit(next: number) {
    if (disabled) return
    onChange(Math.min(5, Math.max(1, next)))
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (disabled) return
    const current = value ?? 0
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        event.preventDefault()
        commit(current + 1)
        break
      case 'ArrowLeft':
      case 'ArrowDown':
        event.preventDefault()
        commit(current === 0 ? 1 : current - 1)
        break
      case 'Home':
        event.preventDefault()
        commit(1)
        break
      case 'End':
        event.preventDefault()
        commit(5)
        break
      default:
        break
    }
  }

  return (
    <div className="flex items-center gap-4">
      <span id={labelId} className="text-label font-sans uppercase tracking-[0.08em] text-ink-muted">
        Energy
      </span>
      <div
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-labelledby={labelId}
        aria-valuemin={0}
        aria-valuemax={5}
        aria-valuenow={value ?? 0}
        aria-valuetext={value === undefined ? 'Not recorded yet' : `${value} of 5`}
        aria-disabled={disabled || undefined}
        onKeyDown={handleKeyDown}
        className={cn('flex items-center gap-3 rounded-full', disabled && 'opacity-40')}
      >
        {STOPS.map((stop) => {
          const filled = value !== undefined && stop <= value
          return (
            <span
              key={stop}
              aria-hidden="true"
              onClick={() => commit(stop)}
              className={cn(
                'size-3 rounded-full border transition-colors duration-instant ease-settle',
                filled ? 'border-ink bg-ink' : 'border-line bg-transparent',
                disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:border-ink-muted',
              )}
            />
          )
        })}
      </div>
    </div>
  )
}
