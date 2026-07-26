import type { InputHTMLAttributes } from 'react'

import { cn } from '@/lib/cn'

/**
 * The one generic text input (blueprint/06 L1). `serif` switches to the
 * Voice of Identity for fields that render the user's own words back to
 * them (the one-liner, a system's name) — everything else stays sans.
 */
interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  serif?: boolean
  className?: string
}

export function TextField({ serif = false, className, ...rest }: TextFieldProps) {
  return (
    <input
      className={cn(
        'w-full rounded-control border border-line bg-transparent px-3 py-2 text-ink',
        'placeholder:text-ink-muted',
        'transition-colors duration-instant ease-settle',
        'focus-visible:border-ink',
        'disabled:cursor-not-allowed disabled:opacity-40',
        serif ? 'font-serif text-read' : 'font-sans text-body',
        className,
      )}
      {...rest}
    />
  )
}
