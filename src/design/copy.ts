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

export const WEEK_NO_SYSTEMS_TITLE = 'Nothing running yet'

export const WEEK_NO_SYSTEMS_BODY =
  "Add what already runs in your life — a system shows up here once it's declared."

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
