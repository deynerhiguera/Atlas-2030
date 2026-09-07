import { Link, useNavigate } from '@tanstack/react-router'
import { useEffect, type ReactNode } from 'react'

import { Text } from '@/design/primitives/text'

import { ThemeToggle } from './theme-toggle'

/**
 * The quiet top rail and room frame (blueprint/02, /06).
 * Keyboard contract: `W` returns to the Week room from anywhere;
 * bindings are inert while typing in inputs.
 */
export function RoomShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate()

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      const target = event.target as HTMLElement | null
      if (target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)))
        return
      if (event.key === 'w' || event.key === 'W') {
        void navigate({ to: '/' })
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [navigate])

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex items-center justify-between px-6 py-4 md:px-12">
        <div className="flex items-baseline gap-8">
          <Text variant="label" as="span" className="select-none">
            Atlas
          </Text>
          <nav aria-label="Rooms">
            <Link to="/" className="group">
              {({ isActive }) => (
                <Text
                  variant="label"
                  as="span"
                  muted={!isActive}
                  className="transition-colors duration-instant ease-settle group-hover:text-ink"
                >
                  Week
                </Text>
              )}
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-1">
          <Link
            to="/foundations"
            aria-label="Foundations"
            title="Foundations"
            className="grid size-8 place-items-center rounded-control text-ink-muted transition-colors duration-instant ease-settle hover:bg-surface hover:text-ink"
          >
            <svg
              width={16}
              height={16}
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M2 13.5V3.8c0-.4.3-.7.7-.8l4.8-1.3a1 1 0 0 1 .5 0l4.8 1.3c.4.1.7.4.7.8v9.7" />
              <path d="M8 2.7v10.8M2 13.5h12" />
            </svg>
          </Link>
          <Link
            to="/data"
            aria-label="Data & Settings"
            title="Data & Settings"
            className="grid size-8 place-items-center rounded-control text-ink-muted transition-colors duration-instant ease-settle hover:bg-surface hover:text-ink"
          >
            <svg
              width={16}
              height={16}
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="8" cy="8" r="2" />
              <path d="M8 1.8v1.6M8 12.6v1.6M14.2 8h-1.6M3.4 8H1.8M12.3 3.7l-1.1 1.1M4.8 11.1l-1.1 1.1M12.3 12.3l-1.1-1.1M4.8 4.9 3.7 3.7" />
            </svg>
          </Link>
          <ThemeToggle />
        </div>
      </header>
      <main className="min-h-0 flex-1">{children}</main>
    </div>
  )
}
