# Atlas 2030 — Roadmap & Open Questions

## Build philosophy

The data model is the decade-long commitment; the UI is seasonal. Design the storage format once, carefully, versioned. Rewrite views whenever taste improves.

**Use the app before it exists.** Run the first season in plain markdown files in this repo (a `journal/` folder with the exact structure from `01-concepts.md`). Two weeks of real use will teach more than two months of speculation, and the files become the app's first imported data.

## Milestones (each one is *usable end-to-end*, never a half of two features)

### v0.1 — "The Week" (smallest real thing)
Identity statements + one season + the Week screen with both lanes: systems with weekly rhythms, the Question, the current book, the daily pulse band, ⌘K capture (session marks, idea captures, question notes). Local storage. No Atlas, no Reflect yet.
The curiosity lane is v0.1 material, not a later feature — Deep Learning, the Engineering Question, and a book in progress are the *current* weekly reality; an Atlas that launched without them would be a habit tracker on day one.
*Success test: 30 consecutive days where the daily pulse genuinely takes ≤ 60 seconds, plus at least two questions carried to answers and five book ideas captured — and you want to open it.*

### v0.2 — "The Mirror"
Weekly Review & Vision ceremony + milestones (incl. auto-mint on finished books, promotion of answered questions) + Echo (resurfacing) + pillar detail pages.
*Success test: four weekly ceremonies done, and at least one echo that genuinely moved you.*

### v0.3 — "The Ritual"
Season review ceremony + season composition + sealed notes + the letter to 2030.
*Success test: the first full season transition performed inside the app.*

### v1.0 — "The Atlas"
The zoomable time view (season → year → decade altitudes), energy underlay, milestone timeline, and the curiosity layer: the Question Trail and the Shelf.
*Ship only after ~2 seasons of data exist — the Atlas screen is only honest when it has something true to show.*

### Beyond (2027+, only if earned)
- Year-in-review generated "chapter" (a typeset annual document from your own data)
- Photo attachments on milestones
- Mobile companion strictly scoped to pulse + capture (the phone is for capturing life, the desktop is for seeing it)
- Optional integrations (GitHub → Engineering evidence suggestions, health data → energy correlation) — always suggestions you confirm, never auto-ingested noise

## Explicitly rejected (so future-you doesn't re-litigate)

- Calendar/scheduling features — Atlas tracks becoming, not time slots; Notion Calendar already exists.
- Task management of any kind — the moment a "todo" object exists, Atlas dies as a concept.
- Social/sharing/accountability features — the audience is you-in-2030, no one else.
- AI-generated insights dashboards — echoes and playback quote *you*; the app should never tell you who you are in words you didn't write.

## Open product questions (decide before v0.1)

1. **Platform:** Desktop-first web app? Native Mac? (Recommendation: local-first web/Tauri desktop — keyboard-centric, owns its files, installable; phone comes later and stays thin.)
2. **The pillar-mode tension:** resolved in `01-concepts.md` §3 — Focus governs intentions, not rhythm; seven concurrent systems across five pillars is compatible with 2–3 focus pillars. Confirm it feels true after one real season.
3. **Energy granularity:** is a single daily energy value enough, or morning/evening? (Recommendation: single value for a full year before adding anything.)
4. **Spiritual & Mental Growth:** does this pillar want a distinct texture (e.g., gratitude/prayer/meditation notes rather than density dots)? Worth designing with real use, not upfront. Note it currently has no system — decide whether that's honest or a gap.
5. **The 60-second constraint:** hard cap or aspiration? (Recommendation: hard cap — it is the single most protective constraint in the product.)
6. **The Reading system's home pillar:** books carry their own pillars, but the Reading system (the sitting-down) needs one home for its density. (Recommendation: wherever you consider reading's core purpose to live — likely Spirit & Mind or Engineering; pick once, don't overthink.)
7. **Question cadence honesty:** "one per week" is the rhythm, but real questions span weeks. Is a carried question shown as *one continuing week* or as *the same question across several dots* on the Trail? (Recommendation: same question, several dots, rendered as a connected run — depth should look like depth.)
