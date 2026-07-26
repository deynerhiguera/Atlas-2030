import { memo, useState } from 'react'

import { useAtlasStore } from '@/data/store'

import { CaptureSheet } from './capture-sheet'

/**
 * The visible, always-reachable "+ Capture" affordance (blueprint update,
 * M4). Fixed to the corner rather than embedded in any one section, so it
 * stays discoverable regardless of scroll position without needing a
 * keyboard shortcut or command palette to find it.
 *
 * Selects only the two scalars the sheet needs to know which destinations
 * exist — not the full question/book objects — so adding a note or an idea
 * through the sheet itself doesn't ripple back into re-rendering this
 * trigger (blueprint/07's performance note, same discipline as Question/
 * Book/Systems sections).
 */
export const CaptureAction = memo(function CaptureAction() {
  const [open, setOpen] = useState(false)
  const liveQuestion = useAtlasStore((state) =>
    state.doc?.questions.find((question) => question.state !== 'answered'),
  )
  const readingBook = useAtlasStore((state) =>
    state.doc?.books.find((book) => book.status === 'reading'),
  )

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className="fixed bottom-8 right-8 z-30 rounded-full border border-line bg-bg px-5 py-2.5 text-ui text-ink shadow-raised transition-colors duration-instant ease-settle hover:bg-surface focus-visible:border-ink"
      >
        + Capture
      </button>
      <CaptureSheet
        open={open}
        onOpenChange={setOpen}
        {...(liveQuestion !== undefined
          ? { liveQuestion: { id: liveQuestion.id, text: liveQuestion.text } }
          : {})}
        {...(readingBook !== undefined
          ? { readingBook: { id: readingBook.id, title: readingBook.title } }
          : {})}
      />
    </>
  )
})
