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
