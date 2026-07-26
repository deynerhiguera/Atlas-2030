import { motion } from 'motion/react'

import { useMotionMode } from '@/design/hooks/use-motion-mode'
import { Text } from '@/design/primitives/text'
import { duration, easeSettle, reducedFade } from '@/design/tokens'

function todayLabel(): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date())
}

/**
 * The Week room, at its founding size: the real date and the first day.
 * Everything that will ever live here arrives in later milestones;
 * the atmosphere arrives now.
 */
export function WeekScreen() {
  const motionMode = useMotionMode()
  const enter =
    motionMode === 'full'
      ? { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 } }
      : { initial: { opacity: 0 }, animate: { opacity: 1 } }
  const transition =
    motionMode === 'full'
      ? { duration: duration.echo, ease: easeSettle }
      : { duration: reducedFade }

  return (
    <div className="grid h-full place-items-center px-6">
      <motion.div {...enter} transition={transition} className="flex flex-col items-center gap-12">
        <Text variant="label" as="p" muted className="tabular">
          {todayLabel()}
        </Text>
        <p className="font-serif text-title leading-[1.3] text-ink">
          <span aria-hidden="true" className="text-ink-muted/60">
            ·&ensp;·&ensp;·&emsp;
          </span>
          Day 1 of becoming
          <span aria-hidden="true" className="text-ink-muted/60">
            &emsp;·&ensp;·&ensp;·
          </span>
        </p>
      </motion.div>
    </div>
  )
}
