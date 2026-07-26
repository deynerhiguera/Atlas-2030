import { motion } from 'motion/react'
import { useEffect, useRef } from 'react'

import { useMotionMode } from '@/design/hooks/use-motion-mode'
import { Text } from '@/design/primitives/text'
import { FOUNDING_SEALED_LINE } from '@/design/copy'
import { duration, easeSettle, reducedFade } from '@/design/tokens'

interface SealMomentProps {
  onComplete: () => void
}

/**
 * Step 3, part two — the held beat (blueprint/02 transition spec: "fold with
 * a held beat, 250ms pause before reveal; the only intentional friction;
 * 900ms total"). The actual `sealLetter` write happens when this beat
 * finishes, not before — the animation is the moment of commitment.
 *
 * `onComplete` is read through a ref rather than the effect's own
 * dependency array: an unrelated document change elsewhere in the app can
 * re-render this component with a new `onComplete` closure mid-hold, and
 * this must fire exactly once regardless.
 */
export function SealMoment({ onComplete }: SealMomentProps) {
  const motionMode = useMotionMode()
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    const holdMs = (motionMode === 'full' ? duration.seal : reducedFade) * 1000
    const timer = setTimeout(() => onCompleteRef.current(), holdMs)
    return () => clearTimeout(timer)
  }, [motionMode])

  const textMotion =
    motionMode === 'full'
      ? {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { delay: 0.25, duration: duration.seal - 0.25, ease: easeSettle },
        }
      : {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: reducedFade },
        }

  return (
    <div className="flex flex-col items-center gap-4 text-center" role="status">
      <motion.div {...textMotion}>
        <Text variant="quote" as="p">
          {FOUNDING_SEALED_LINE}
        </Text>
      </motion.div>
    </div>
  )
}
