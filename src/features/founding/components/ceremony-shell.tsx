import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, type ReactNode } from 'react'

import { useMotionMode } from '@/design/hooks/use-motion-mode'
import { duration, easeSettle, reducedFade } from '@/design/tokens'

interface CeremonyShellProps {
  stepKey: string
  children: ReactNode
}

/**
 * The ceremony's page-turn (blueprint/02 transition spec: "old settles down
 * 8px, new rises 8px", `duration.page`, `easeSettle") — one shell shared by
 * every Founding step. Kept founding-local rather than promoted to design/
 * (blueprint/06 folder structure) since no other ceremony exists yet to
 * share it with; a second one earns the promotion, not a guess at its shape.
 *
 * Moves focus onto the new step's content on every transition, keyed by
 * `stepKey`, so a screen reader announces each step and keyboard focus is
 * never left stranded on a control that just animated away — unless the
 * step already put focus on its own primary input (blueprint/06: "Founding
 * is one input per screen"), in which case that autoFocus wins; native
 * autofocus lands during DOM insertion, before this effect runs, so
 * checking `document.activeElement` here is enough to defer to it.
 *
 * The exiting step gets `pointerEvents: 'none'` for the duration of its
 * exit: `mode="wait"` keeps its DOM alive while it fades, and without this
 * a fast click during that window lands on a control that is already on
 * its way out (blueprint/05's "rapid interactions" edge case) instead of
 * the step actually on screen.
 */
export function CeremonyShell({ stepKey, children }: CeremonyShellProps) {
  const motionMode = useMotionMode()
  const focusTargetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const target = focusTargetRef.current
    if (target === null) return
    if (!target.contains(document.activeElement)) {
      target.focus()
    }
  }, [stepKey])

  const stepMotion =
    motionMode === 'full'
      ? {
          initial: { opacity: 0, y: 8 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: 8, pointerEvents: 'none' as const },
          transition: { duration: duration.page, ease: easeSettle },
        }
      : {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0, pointerEvents: 'none' as const },
          transition: { duration: reducedFade },
        }

  return (
    <div className="grid min-h-screen place-items-center px-6 py-16">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={stepKey}
          {...stepMotion}
          ref={focusTargetRef}
          tabIndex={-1}
          className="flex w-full max-w-prose-atlas flex-col gap-8 outline-none"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
