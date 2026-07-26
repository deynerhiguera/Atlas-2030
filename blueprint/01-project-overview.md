# 01 — Project Overview

## What Atlas is

Atlas 2030 is a **local-first personal operating system for identity change**, built and maintained by one person, for one person, from 2026 until at least 2035. It answers one question — *"Am I becoming the person I want to become?"* — by collecting evidence of growth across six pillars (Engineering, University, English, Health, Spirit & Mind, Relationships) and rendering it back across weeks, seasons, and years.

It is not a task manager, habit tracker, journal, or productivity dashboard. It is an instrument with two engines — **discipline** (Systems running on weekly rhythms) and **curiosity** (the weekly Engineering Question and Books in motion) — steered by a **reflection rudder** (weekly and seasonal ceremonies), rendered on a decade-long canvas (the Atlas view), and designed to **end in December 2030**.

Product requirements live in `design/00`–`05`. The ten experience journeys (conversation record, July 2026) are binding UX requirements. `design/06` was the v0.1 engineering plan; this blueprint supersedes and extends it as the engineering source of truth.

## Goals

1. **Daily habitability** — a pulse that takes ≤ 60 seconds, an app that opens instantly, an experience calm enough to live in for six years.
2. **A trustworthy decade of data** — zero loss, human-readable exports, migrations forever, no lock-in even to Atlas itself.
3. **Evidence over activity** — milestones, answered questions, finished books, and honest density; never scores, streaks, or counts-as-praise.
4. **Emotional payoff at every timescale** — the settle of a session mark (seconds), the week composing itself (Sundays), the season slotting into the year (quarterly), the letter opening (2030).
5. **Maintainability by one engineer through 2035** — boring technology, strict layering, minimal dependencies, code a future self can re-enter cold.

## Philosophy (engineering translation)

| Product law | Engineering consequence |
|---|---|
| Atlas never speaks first | No notification code paths exist. All time-based moments are computed at open. |
| Fast to feed, slow to read | Input surfaces optimize latency (<100 ms); retrospective surfaces optimize rendering craft. |
| Nothing thanks you | No toasts, no success modals; confirmation = the data visibly settling into place. |
| Seals take a breath | Exactly one sanctioned friction class: unsealing animations. Everything else removes steps. |
| Every ending is dignified | `setDown`, `retired`, `didntMove`, season close, and the 2030 ending are designed states, never error/failure states. |
| The data format is the product | Schema work is the highest-review-bar work in the repo. UI is seasonal; the document format is the decade. |

## Constraints

- **One developer**, evenings and weekends. Every milestone sized ≤ one weekend.
- **Local-first, zero-network** at runtime (CSP-enforced `default-src 'self'`); data leaves the machine only via explicit export (until an owner-approved sync phase, see `09`).
- **Desktop-browser first** (designed at 1280, correct ≥ 1024, functional ≥ 768); PWA for offline + install.
- **Single user, single live document** — no auth, no multi-tenancy, no concurrent editing (multi-tab guarded).
- **Dependency ceiling:** framework (React/Vite/Tailwind/TanStack Router) + zustand, zod, motion, idb, cmdk, nanoid, Radix (Dialog/Popover only). Additions require a written justification in `11-engineering-standards.md`.
- **The app must feel complete at every shipped milestone** — no stubs, no "coming soon," no empty rooms in navigation.

## Non-goals (permanent unless constitutionally amended — see `12`)

- Tasks, todos, scheduling, calendars, reminders, notifications.
- Time accounting (sessions are marked, never measured in minutes).
- Streaks, scores, grades-as-numbers, week-vs-week comparisons, leaderboards of one.
- Social features, sharing, accountability partners, publishing.
- A knowledge base: no backlinks, tags, web clipper, or note graph. Atlas records *that* you understood and *what* you understood, in your words; the learning lives outside.
- Telemetry, analytics, A/B anything.
- AI-generated judgments about the user (see `09 §AI` for the narrow permitted class).
- Self-tracking of the app (Weekly Review/Vision are hosted ceremonies, never tracked items).
- Continuation past 2030 without a deliberate re-founding.
