import type { ElementType, ReactNode } from 'react'

import { cn } from '@/lib/cn'

/**
 * The only way type styles are applied (blueprint/06).
 * Serif variants are reserved for words the user wrote — the Voice of
 * Identity. Sans variants are the Voice of the Instrument.
 */
export type TextVariant =
  | 'label'
  | 'ui'
  | 'body'
  | 'read'
  | 'quote'
  | 'title'
  | 'display'
  | 'monument'

const variantClasses: Record<TextVariant, string> = {
  label: 'font-sans text-label uppercase tracking-[0.08em]',
  ui: 'font-sans text-ui',
  body: 'font-sans text-body',
  read: 'font-serif text-read',
  quote: 'font-serif text-quote',
  title: 'font-serif text-title',
  display: 'font-serif text-display',
  monument: 'font-serif text-monument',
}

interface TextProps {
  variant: TextVariant
  as?: ElementType
  muted?: boolean
  className?: string
  children: ReactNode
}

export function Text({ variant, as, muted = false, className, children }: TextProps) {
  const Tag = as ?? 'p'
  return (
    <Tag className={cn(variantClasses[variant], muted ? 'text-ink-muted' : 'text-ink', className)}>
      {children}
    </Tag>
  )
}
