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
        <ThemeToggle />
      </header>
      <main className="min-h-0 flex-1">{children}</main>
    </div>
  )
}
