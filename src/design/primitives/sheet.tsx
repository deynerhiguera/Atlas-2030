import * as Dialog from '@radix-ui/react-dialog'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, type ReactNode } from 'react'

import { useMotionMode } from '@/design/hooks/use-motion-mode'
import { duration, easeSettle, reducedFade } from '@/design/tokens'

/**
 * The side sheet (blueprint/06 L1): Question, Book, and — later — Milestone
 * detail all rise from the right over a dimmed backdrop. Built on Radix's
 * Dialog for its own sake, not decoration: focus trapping and Esc-to-close
 * come from it for free (blueprint/02, /05's accessibility requirements).
 *
 * `Dialog.Portal`/`Overlay`/`Content` are all `forceMount` so Motion's
 * AnimatePresence — not Radix — controls the exit animation and unmount
 * timing; without forceMount, Radix removes the content the instant it
 * closes and there is nothing left to animate out.
 *
 * Focus restoration is handled explicitly here rather than left to Radix's
 * own `onCloseAutoFocus`: that fires the instant `open` becomes false, but
 * `forceMount` keeps the real DOM node alive for another `duration.settle`
 * while it animates out — Radix ends up trying to restore focus before the
 * content it's restoring focus *away from* has actually left the document.
 * Capturing the trigger on open and refocusing it in `onExitComplete`
 * (which fires once the exit animation has actually finished) ties the
 * restoration to what's really on screen instead of racing it.
 */
interface SheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: ReactNode
  description: string
  children: ReactNode
}

export function Sheet({ open, onOpenChange, title, description, children }: SheetProps) {
  const motionMode = useMotionMode()
  const previouslyFocusedRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (open) {
      previouslyFocusedRef.current = document.activeElement as HTMLElement | null
    }
  }, [open])

  function restoreFocus() {
    previouslyFocusedRef.current?.focus()
    previouslyFocusedRef.current = null
  }

  const overlayMotion =
    motionMode === 'full'
      ? {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: { duration: duration.settle, ease: easeSettle },
        }
      : {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: { duration: reducedFade },
        }

  const panelMotion =
    motionMode === 'full'
      ? {
          initial: { opacity: 0, x: 16 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: 16 },
          transition: { duration: duration.settle, ease: easeSettle },
        }
      : {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: { duration: reducedFade },
        }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence onExitComplete={restoreFocus}>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div {...overlayMotion} className="fixed inset-0 z-40 bg-ink/30" />
            </Dialog.Overlay>
            <Dialog.Content
              asChild
              forceMount
              aria-describedby={undefined}
              onCloseAutoFocus={(event) => event.preventDefault()}
            >
              <motion.div
                {...panelMotion}
                className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col overflow-y-auto border-l border-line bg-bg p-8 shadow-raised outline-none"
              >
                {/*
                  No `asChild` here: Radix attaches an auto-generated `id` to
                  this element to wire up `aria-labelledby`, and the design
                  system's `Text` primitive doesn't forward arbitrary props
                  (including `id`) the way `asChild`'s cloning requires. The
                  caller's pre-styled `title` node is rendered as children of
                  Radix's own heading element instead, so the id lands where
                  Radix expects it.
                */}
                <Dialog.Title className="contents">{title}</Dialog.Title>
                <Dialog.Description className="sr-only">{description}</Dialog.Description>
                {children}
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}
