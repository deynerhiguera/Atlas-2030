import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useMemo, useState, type KeyboardEvent } from 'react'

import { useMotionMode } from '@/design/hooks/use-motion-mode'
import { TextField } from '@/design/primitives/text-field'
import { duration, easeSettle, reducedFade } from '@/design/tokens'

interface OneLinerProps {
  value?: string
  onCommit: (text: string) => void
  promptRotation: readonly string[]
  disabled?: boolean
}

/**
 * Today's sentence (blueprint/06 L2). Enter commits; the field settles with
 * a quiet underline that arrives and fades — never a toast or success
 * message (blueprint/05: "nothing thanks you"). Serif, because this is the
 * user's own words.
 */
export function OneLiner({ value, onCommit, promptRotation, disabled = false }: OneLinerProps) {
  const [draft, setDraft] = useState(value ?? '')
  const [settleKey, setSettleKey] = useState(0)
  const motionMode = useMotionMode()

  useEffect(() => {
    setDraft(value ?? '')
  }, [value])

  const placeholder = useMemo(() => {
    if (promptRotation.length === 0) return ''
    const index = Math.floor(Math.random() * promptRotation.length)
    return promptRotation[index]
  }, [promptRotation])

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== 'Enter' || disabled) return
    event.preventDefault()
    const trimmed = draft.trim()
    if (trimmed === (value ?? '')) return
    onCommit(trimmed)
    setSettleKey((key) => key + 1)
  }

  const fade =
    motionMode === 'full'
      ? {
          initial: { opacity: 0.5 },
          animate: { opacity: 0 },
          transition: { duration: duration.settle, ease: easeSettle },
        }
      : { initial: { opacity: 0.3 }, animate: { opacity: 0 }, transition: { duration: reducedFade } }

  return (
    <div className="relative">
      <TextField
        serif
        value={draft}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
        aria-label="Today's one line"
        className="border-transparent px-0 focus-visible:border-transparent"
      />
      <AnimatePresence>
        {settleKey > 0 && (
          <motion.span
            key={settleKey}
            {...fade}
            className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-ink-muted"
          />
        )}
      </AnimatePresence>
    </div>
  )
}
