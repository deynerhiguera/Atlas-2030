import { motion } from 'motion/react'
import { useEffect, useRef } from 'react'

import { useMotionMode } from '@/design/hooks/use-motion-mode'
import { Text } from '@/design/primitives/text'
import { FOUNDING_ASSEMBLY_LINE } from '@/design/copy'
import { duration, reducedFade } from '@/design/tokens'

interface WeekAssemblyProps {
  onComplete: () => void
}

/**
 * Step 14, the exit (blueprint/02 C1: "Week assembles itself from the
 * entered data — signature transition"). A held beat before the app
 * navigates to `/`, so the room crossfade that follows lands on an already
 * fully-populated Week rather than cutting to it mid-motion. Uses
 * `duration.echo` — "a memory arriving" is the closest existing token to
 * "a world arriving."
 */
export function WeekAssembly({ onComplete }: WeekAssemblyProps) {
  const motionMode = useMotionMode()
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    const holdMs = (motionMode === 'full' ? duration.echo : reducedFade) * 1000
    const timer = setTimeout(() => onCompleteRef.current(), holdMs)
    return () => clearTimeout(timer)
  }, [motionMode])

  const lineMotion =
    motionMode === 'full'
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: duration.echo } }
      : { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: reducedFade } }

  return (
    <div className="flex flex-col items-center gap-4 text-center" role="status">
      <motion.div {...lineMotion}>
        <Text variant="display" as="p">
          {FOUNDING_ASSEMBLY_LINE}
        </Text>
      </motion.div>
    </div>
  )
}
