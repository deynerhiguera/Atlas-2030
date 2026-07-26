import type { PillarId } from '@/domain/schema'

/**
 * Named microcopy constants (blueprint/05 "Voice in the system"). Features
 * import copy rather than inlining it, and the banned-vocabulary list
 * (overdue, missed, failed, streak, unlock, level…) applies here first.
 */

export const ONE_LINER_PROMPTS: readonly string[] = [
  'What mattered today?',
  'Anything worth remembering?',
  'How did today feel?',
]

export const ASK_QUESTION_TITLE = 'One question worth exploring'

export const ASK_QUESTION_BODY = 'A deep inquiry can sit with you for weeks. Ask one to begin.'

export const NOTE_ADD_LABEL = 'Add a note'

export const NOTE_EMPTY_HINT = 'Let it sit with you this week.'

export const START_BOOK_TITLE = 'One book worth reading'

export const START_BOOK_BODY = 'What are you reading toward right now?'

export const IDEA_ADD_LABEL = 'Add an idea'

export const IDEA_EMPTY_HINT = 'Ideas tend to arrive mid-page.'

export const CAPTURE_TITLE = 'Capture'

export const CAPTURE_DESCRIPTION =
  'Capture a milestone, or add to the notes on your current question or the ideas from your current book.'

export const CAPTURE_MILESTONE_PLACEHOLDER = 'What happened?'

export const FOUNDING_THRESHOLD_TITLE = 'Atlas begins with you.'

export const FOUNDING_THRESHOLD_BODY =
  "A short ceremony: a letter, six statements, the systems already running in your life, a season, a question, a book, and today's pulse. About thirty minutes. Stop anytime — Atlas resumes exactly where you left off."

export const FOUNDING_THRESHOLD_DECLINE_TITLE = "Whenever you're ready."

export const FOUNDING_THRESHOLD_DECLINE_BODY = 'Atlas will be here, exactly as you left it.'

export const FOUNDING_LETTER_TITLE = 'A letter to 2030.'

export const FOUNDING_LETTER_BODY =
  'Write to the person who finishes this. Nothing here is graded or shared — sealed until December 2030, and opened by no one but you.'

export const FOUNDING_LETTER_PLACEHOLDER = 'Dear 2030 me,'

export const FOUNDING_SEAL_TITLE = "Once sealed, it's sealed."

export const FOUNDING_SEAL_BODY =
  "Atlas doesn't keep secrets from you, and it won't peek either. This opens itself in December 2030 — nothing before then can open it early."

export const FOUNDING_SEAL_CONFIRM = 'Seal the letter'

export const FOUNDING_SEAL_CANCEL = 'Keep writing'

export const FOUNDING_SEALED_LINE = 'Sealed until December 2030.'

export const FOUNDING_IDENTITY_BODY = 'Who are you here, in 2030?'

export const identityPlaceholders: Record<PillarId, string> = {
  engineering: 'I build systems people trust, and understand them down to the metal.',
  university: 'I finished what I started, and it opened doors I built myself.',
  english: 'I write and speak with a precision that used to belong to someone else.',
  health: 'I show up for my body the way I show up for my work.',
  spirit: 'I know what I believe, and I live like it is true.',
  relationships: 'I am someone the people I love can actually rely on.',
}

export const FOUNDING_SYSTEMS_TITLE = "What's already running."

export const FOUNDING_SYSTEMS_BODY =
  'Not a plan — a recognition. Add what already runs in your life, and how many times a week it does.'

export const FOUNDING_SEASON_TITLE = 'Name this season.'

export const FOUNDING_SEASON_BODY = 'About twelve weeks. Choose 2–3 pillars to focus on, and 1–3 intentions.'

export const FOUNDING_PULSE_TITLE = 'One more thing before the week begins.'

export const FOUNDING_PULSE_BODY =
  "Today's check-in — the same sixty seconds you'll do most days from here on."

export const FOUNDING_ASSEMBLY_LINE = 'Your Atlas is beginning.'
