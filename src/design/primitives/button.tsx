import type { ButtonHTMLAttributes, ReactNode } from 'react'

import { cn } from '@/lib/cn'

/** Quiet by default (blueprint/05) — no primary-colored call-to-action exists in Atlas. */
export type ButtonVariant = 'quiet' | 'solid' | 'ghost'
export type ButtonSize = 'sm' | 'md'

const variantClasses: Record<ButtonVariant, string> = {
  quiet: 'border border-line bg-transparent text-ink hover:bg-surface',
  solid: 'border border-ink bg-ink text-bg hover:opacity-90',
  ghost: 'border border-transparent bg-transparent text-ink-muted hover:text-ink',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-ui',
  md: 'h-10 px-4 text-body',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
}

export function Button({
  variant = 'quiet',
  size = 'md',
  className,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-control font-sans',
        'transition-colors duration-instant ease-settle',
        'disabled:cursor-not-allowed disabled:opacity-40',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
