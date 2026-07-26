# 12 — Future Vision: 2026 → 2035

How Atlas evolves for a decade without losing its soul — and the constitutional machinery that makes "without losing its soul" enforceable rather than sentimental.

## The trajectory (life-order, not feature-order)

**2026 — Inhabitation.** v0.1 → v0.2. The Week becomes home; the first questions are answered; the first Sunday ceremonies happen. The only goal: the app is genuinely lived in. Every feature decision this year is subordinate to the 60-second pulse staying true.

**2027 — Rhythm.** v0.3 → v1.0. The first real season ceremonies (built *for* their occasions, per `07`). Two closed seasons unlock the Atlas canvas. By year's end, zooming out shows a year that looks like a life. Possible: Stage-1 file sync if a second machine has become real.

**2028 — Depth.** v1.1: the Year Chapter at the anniversary. The data is now old enough for echoes to genuinely move; echo curation (AI shape #1, local-only, if heuristics have gone stale) may pass its decision gate. The UI may want its first partial rewrite — welcomed, because `domain/` doesn't move. Possible: the mobile capture outbox, if missed-capture notes accumulated per `09`'s gate.

**2029 — Weight.** No new features by default. A polish year: performance against the now-large document, visual refinement, the typeset-artifact renderer (season reviews as beautiful static pages — groundwork for the 2030 book). The discipline of a no-feature year is itself a product feature: Atlas enters its final year calm.

**2030 — The Ending.** F23 built across the year, unhurried, finished before December. In December: the Final Opening, the last answer, Close the Book — the six-year artifact generated, the app entering archive mode. If chosen: Found Atlas 2040, a re-founding, not a rollover.

**2031–2035 — Stewardship.** The maintenance covenant: the archive stays openable. Dependency updates only for security/compatibility; the export outlives even this (plain JSON + the typeset book). If Atlas 2040 exists, it begins from the same `domain/` layer — the decade layer's second decade. Success in 2035 looks like: a bound book on a shelf, a JSON file that still parses, and possibly a new Atlas four years into its own life.

## What should NEVER be added — the consolidated register

Gathered from every design document, in one place, so "it's just a small feature" always has this list to answer to:

**The productivity cluster:** tasks, todos, checklists, projects, deadlines, scheduling, calendar integration, reminders, notifications of any kind, time tracking, pomodoro anything.
**The judgment cluster:** scores, grades-as-numbers, streaks, week-vs-week comparisons, rankings, "best" anything, progress percentages on a life, red/alarm states, overdue states.
**The engagement cluster:** feeds, badges, gamification, confetti, daily-active mechanics, "come back" hooks, variable-reward patterns beyond the honest unpredictability of echoes.
**The social cluster:** sharing (beyond hand-carried static artifacts), accountability partners, comments, presence, community, publishing pipelines.
**The platform cluster:** plugins, extension APIs, theming marketplaces, templates, multi-user, teams, workspaces.
**The knowledge cluster:** backlinks, tags, graphs, web clipping, rich text, embeds, a second-brain — Atlas records understanding; it refuses to become where understanding is manufactured.
**The surveillance cluster:** telemetry, analytics, sentiment analysis of the user, AI-authored prose about the user, auto-ingested data the user didn't deliberately hand over (no automatic GitHub/health scraping — *suggestions you confirm* was the ceiling, and even that waits for a decision record).
**The immortality cluster:** subscriptions, accounts-as-identity, auto-renewal into 2031, any mechanism by which Atlas continues without being deliberately re-founded.

## The constitutional machinery

Sentiment doesn't survive a decade; process does.

1. **The register above and `01 §Non-goals` are constitutional.** Amending them requires: a written Decision Record arguing the change against the North Star question · a full season (~12 weeks) between proposal and implementation — the cooling-off period is the point · and the honest test: *does this help answer "am I becoming who I want to become," or does it help the app want me?*
2. **The laws travel with the code.** The five experiential laws (never speaks first · fast to feed, slow to read · nothing thanks you · seals take a breath · every ending is dignified) live in `design/`, are cited in PRs, and are enforced where automatable (banned-vocab lint, no-notification-code-paths, no-spinner tokens).
3. **The soul test for every future feature:** (a) does it render the user's own words or evidence back to them? (b) does it remove friction from capture or add meaning to retrospect? (c) would it still make sense if only one person ever used it? A feature failing all three is not an Atlas feature, however good it is — it belongs in some other product, unbuilt.
4. **Drift is measured annually.** Each anniversary, alongside the Year Chapter, an hour with `design/00-vision.md`: read the anti-goals against the running app. Anything that crept in gets a removal milestone. Removal milestones are celebrated in the CHANGELOG with the same dignity as features — pruning is progress.

## The last word

Atlas is a bet that software can be built the way a cathedral or a journal is built — slowly, by one person, for one purpose, with an ending. The engineering serves a sentence written before any of it existed: *you don't achieve a future self; you accumulate evidence of one.* Every document in this blueprint is that sentence, operationalized. Protect the data, protect the calm, protect the ending — and in December 2030, the answer to the North Star question will be sitting in a file that still opens.
