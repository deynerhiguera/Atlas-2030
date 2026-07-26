import { Outlet, useLocation } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'motion/react'

import { flushAutosave, useTabGuard } from '@/data'
import { useMotionMode } from '@/design/hooks/use-motion-mode'
import { GateScreen } from '@/design/primitives/gate-screen'
import { duration, easeSettle, reducedFade } from '@/design/tokens'

import { RoomShell } from './room-shell'

/**
 * The router's root: guards against a second open tab (blueprint/03 FR-D5)
 * before rendering the normal room frame.
 *
 * Room-to-room motion lives here, once, rather than in each room's own
 * screen component: blueprint/02 specifies a plain crossfade between rooms
 * ("siblings, not a stack") at `duration.room`. `mode="wait"` lets the
 * leaving room finish fading out before the next one fades in — no absolute
 * positioning is needed to prevent the two from overlapping mid-transition,
 * since Week and Data differ enough in height that a true simultaneous
 * overlap would read as a layout jump, not a crossfade.
 */
export function RootComponent() {
  const { status, takeOver } = useTabGuard(() => void flushAutosave())
  const location = useLocation()
  const motionMode = useMotionMode()

  if (status === 'guarded') {
    return (
      <GateScreen
        title="Atlas is open in another window"
        message="To keep your data safe, Atlas stays active in one window at a time."
        action={{ label: 'Use here instead', onClick: takeOver }}
      />
    )
  }

  const transition =
    motionMode === 'full' ? { duration: duration.room, ease: easeSettle } : { duration: reducedFade }

  return (
    <RoomShell>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={transition}
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
    </RoomShell>
  )
}
