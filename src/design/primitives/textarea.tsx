import type { TextareaHTMLAttributes } from 'react'

import { cn } from '@/lib/cn'

/**
 * The multi-line counterpart to TextField (blueprint/06 L1) — question
 * answers, notes, and ideas run long enough (up to 2000 characters) that a
 * single-line input would be the wrong shape for them.
 */
interface TextAreaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> {
  serif?: boolean
  className?: string
}

export function TextArea({ serif = false, rows = 3, className, ...rest }: TextAreaProps) {
  return (
    <textarea
      rows={rows}
      className={cn(
        'w-full resize-none rounded-control border border-line bg-transparent px-3 py-2 text-ink',
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
