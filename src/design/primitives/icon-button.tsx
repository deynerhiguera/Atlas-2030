import type { ButtonHTMLAttributes, ReactNode } from 'react'

import { cn } from '@/lib/cn'

/**
 * Keyboard contract: focusable, activates on Enter/Space (native button).
 * The accessible label is required — icons never appear unnamed.
 */
interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'> {
  label: string
  children: ReactNode
}

export function IconButton({ label, className, children, ...rest }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        'grid size-8 place-items-center rounded-control text-ink-muted',
        'transition-colors duration-instant ease-settle',
        'hover:bg-surface hover:text-ink',
        'disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-ink-muted',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
