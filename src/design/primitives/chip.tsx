import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'
import { pillarDotClass } from '@/design/tokens'
import type { PillarId } from '@/domain/schema'

/** A small muted pill (blueprint/06 L1) — mode chips, state chips, counts. */
interface ChipProps {
  hue?: PillarId
  children: ReactNode
  className?: string
}

export function Chip({ hue, children, className }: ChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-line px-2.5 py-0.5 text-ui text-ink-muted',
        className,
      )}
    >
      {hue !== undefined && <span className={cn('size-1.5 rounded-full', pillarDotClass[hue])} />}
      {children}
    </span>
  )
}
