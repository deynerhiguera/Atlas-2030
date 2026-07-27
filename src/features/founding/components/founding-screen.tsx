import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

import {
  completeFounding,
  completeSystemsDeclaration,
  foundBook,
  foundQuestion,
  foundSeason,
  recordIdentityStatement,
  sealLetter,
} from '@/data/actions'
import { useAtlasStore } from '@/data/store'
import { AskNextPrompt, NextBookPrompt } from '@/design/components'
import { ASK_QUESTION_BODY, ASK_QUESTION_TITLE, START_BOOK_BODY, START_BOOK_TITLE } from '@/design/copy'
import { useToday } from '@/design/hooks/use-today'
import { PILLAR_IDS, type PillarId } from '@/domain/schema'

import { CeremonyShell } from './ceremony-shell'
import { IdentityStep } from './identity-step'
import { LetterStep } from './letter-step'
import { PulseStep } from './pulse-step'
import { SealConfirmStep } from './seal-confirm-step'
import { SealMoment } from './seal-moment'
import { SeasonStep } from './season-step'
import { SystemsStep } from './systems-step'
import { ThresholdStep } from './threshold-step'
import { WeekAssembly } from './week-assembly'

type LetterPhase = 'threshold' | 'writing' | 'confirm' | 'sealing'

/**
 * The Founding ceremony (blueprint/02 C1). Resumes at exactly the step
 * `doc.meta.foundingStep` names; within the letter step, the finer-grained
 * threshold/writing/confirm/sealing phases live only in local state — the
 * ceremony's own instruction is "no duplicate state, no temporary document
 * model," so nothing here is durable until a `founding-actions` call makes
 * it so. Resuming mid-letter always re-enters at the threshold: an unsealed
 * draft is never persisted, so there is nothing else to resume into.
 */
export function FoundingScreen() {
  const navigate = useNavigate()
  const doc = useAtlasStore((state) => state.doc)
  const today = useToday()

  const [letterPhase, setLetterPhase] = useState<LetterPhase>('threshold')
  const [pendingLetterText, setPendingLetterText] = useState('')
  const [assembling, setAssembling] = useState(false)

  if (doc === null) return null
  const step = doc.meta.foundingStep
  if (step === undefined) return null

  if (assembling) {
    return (
      <CeremonyShell stepKey="assembly">
        <WeekAssembly
          onComplete={() => {
            completeFounding()
            void navigate({ to: '/' })
          }}
        />
      </CeremonyShell>
    )
  }

  if (step === 'letter') {
    if (letterPhase === 'threshold') {
      return (
        <CeremonyShell stepKey="letter-threshold">
          <ThresholdStep onBegin={() => setLetterPhase('writing')} />
        </CeremonyShell>
      )
    }
    if (letterPhase === 'writing') {
      return (
        <CeremonyShell stepKey="letter-writing">
          <LetterStep
            initialText={pendingLetterText}
            onSeal={(text) => {
              setPendingLetterText(text)
              setLetterPhase('confirm')
            }}
          />
        </CeremonyShell>
      )
    }
    if (letterPhase === 'confirm') {
      return (
        <CeremonyShell stepKey="letter-confirm">
          <SealConfirmStep
            onConfirm={() => setLetterPhase('sealing')}
            onCancel={() => setLetterPhase('writing')}
          />
        </CeremonyShell>
      )
    }
    return (
      <CeremonyShell stepKey="letter-sealing">
        <SealMoment onComplete={() => sealLetter(pendingLetterText)} />
      </CeremonyShell>
    )
  }

  if (step === 'identity') {
    const nextPillar: PillarId =
      PILLAR_IDS.find((id) => !doc.identity.some((version) => version.pillar === id)) ?? PILLAR_IDS[0]
    return (
      <CeremonyShell stepKey={`identity-${nextPillar}`}>
        <IdentityStep
          pillar={nextPillar}
          index={doc.identity.length + 1}
          total={PILLAR_IDS.length}
          onContinue={(text) => recordIdentityStatement(nextPillar, text)}
        />
      </CeremonyShell>
    )
  }

  if (step === 'systems') {
    return (
      <CeremonyShell stepKey="systems">
        <SystemsStep systems={doc.systems} onContinue={completeSystemsDeclaration} />
      </CeremonyShell>
    )
  }

  if (step === 'season') {
    return (
      <CeremonyShell stepKey="season">
        <SeasonStep onContinue={foundSeason} />
      </CeremonyShell>
    )
  }

  if (step === 'question') {
    return (
      <CeremonyShell stepKey="question">
        <AskNextPrompt
          title={ASK_QUESTION_TITLE}
          body={ASK_QUESTION_BODY}
          onAsk={foundQuestion}
          submitLabel="Ask it"
        />
      </CeremonyShell>
    )
  }

  if (step === 'book') {
    return (
      <CeremonyShell stepKey="book">
        <NextBookPrompt
          title={START_BOOK_TITLE}
          body={START_BOOK_BODY}
          onStart={foundBook}
          submitLabel="Start reading"
        />
      </CeremonyShell>
    )
  }

  const todaySignal = doc.signals.find((signal) => signal.date === today)
  return (
    <CeremonyShell stepKey="pulse">
      <PulseStep
        {...(todaySignal?.energy !== undefined ? { energy: todaySignal.energy } : {})}
        {...(todaySignal?.line !== undefined ? { line: todaySignal.line } : {})}
        onContinue={() => setAssembling(true)}
      />
    </CeremonyShell>
  )
}
