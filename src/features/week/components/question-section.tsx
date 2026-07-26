import { memo, useState } from 'react'

import { askQuestion } from '@/data/actions'
import { useAtlasStore } from '@/data/store'
import { QuestionCard } from '@/design/components/question-card'
import { Button } from '@/design/primitives/button'
import { ASK_QUESTION_BODY, ASK_QUESTION_TITLE } from '@/design/copy'
import type { Question } from '@/domain/schema'

import { AskNextPrompt } from './ask-next-prompt'
import { QuestionSheet } from './question-sheet'
import { SectionLabel } from './section-label'

const EMPTY_QUESTIONS: Question[] = []

/**
 * Curiosity, above the systems grid (blueprint/00 "two engines"). Selects
 * only `doc.questions` — marking a session or editing today's line never
 * re-renders this section, and asking or closing a question never
 * re-renders Systems or Book (blueprint/07's performance note).
 */
export const QuestionSection = memo(function QuestionSection() {
  const questions = useAtlasStore((state) => state.doc?.questions ?? EMPTY_QUESTIONS)
  const [sheetOpen, setSheetOpen] = useState(false)

  const live = questions.find((question) => question.state !== 'answered')
  const history = questions.filter((question) => question.state === 'answered')

  return (
    <section className="flex flex-col gap-3">
      <SectionLabel>This week&rsquo;s question</SectionLabel>
      {live !== undefined ? (
        <QuestionCard question={live} onOpen={() => setSheetOpen(true)} />
      ) : (
        <AskNextPrompt title={ASK_QUESTION_TITLE} body={ASK_QUESTION_BODY} onAsk={askQuestion} />
      )}
      {history.length > 0 && (
        <Button variant="ghost" size="sm" className="self-start" onClick={() => setSheetOpen(true)}>
          {history.length} answered before
        </Button>
      )}
      <QuestionSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        {...(live !== undefined ? { question: live } : {})}
        history={history}
      />
    </section>
  )
})
