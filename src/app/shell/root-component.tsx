import { Outlet } from '@tanstack/react-router'

import { flushAutosave, useTabGuard } from '@/data'
import { GateScreen } from '@/design/primitives/gate-screen'

import { RoomShell } from './room-shell'

/**
 * The router's root: guards against a second open tab (blueprint/03 FR-D5)
 * before rendering the normal room frame.
 */
export function RootComponent() {
  const { status, takeOver } = useTabGuard(() => void flushAutosave())

  if (status === 'guarded') {
    return (
      <GateScreen
        title="Atlas is open in another window"
        message="To keep your data safe, Atlas stays active in one window at a time."
        action={{ label: 'Use here instead', onClick: takeOver }}
      />
    )
  }

  return (
    <RoomShell>
      <Outlet />
    </RoomShell>
  )
}
