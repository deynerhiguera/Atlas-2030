# 09 — Backend Evolution

v1 is local-first with zero network, and that is a feature, not a phase. This document exists so that *if* Atlas ever grows beyond one browser profile, it does so without violating its architecture — and so that future-you can tell the difference between evolution and erosion.

## The two properties that make evolution cheap

Everything below is possible because of two decisions already made in `04`:

1. **Append-only collections merge by set-union.** `sessions`, `milestones`, `identity`, `signals` (per-day), `reflections`, `gaps`, and all idea/note fragments have no update conflicts by construction: two devices' histories merge as `union by id` (+ last-write-wins on the same-day `Signal` and on the few mutable heads: question state, book progress, settings). No CRDT library required — the *data model is the CRDT*.
2. **The document is the unit.** Sync, backup, migration, and export are all operations on one validated JSON value. Any transport that can move a small JSON document can be Atlas's backend.

**Architectural rule for all evolution:** new capabilities arrive as **adapters behind existing seams** (`data/persist`, `data/transfer`), never as changes to `domain/`. If a proposal requires touching `domain/schema` for transport reasons, the proposal is wrong.

## Stage 0 → 1: File-based sync (no server at all)

Export/import already works; Stage 1 automates it: a `SyncAdapter` interface (`load() · save(doc) · watch()`) with a first implementation writing the encrypted doc to a user-chosen folder (File System Access API) that the OS already syncs (iCloud/Drive/Syncthing). Conflict = both sides changed since common ancestor → run the union-merge above; genuinely conflicting scalar fields (rare by construction) resolve newest-wins with the loser preserved in a `conflicts/` sidecar file, never silently dropped. **No accounts, no server, no company to trust.** This stage probably satisfies Atlas's needs until 2030.

## Stage 2: A sync server (only if Stage 1 chafes)

A deliberately dumb server: authenticated blob store with version vectors — `GET/PUT /doc` + change notification. Merging stays client-side (same union-merge code as Stage 1; the server never parses the document). **End-to-end encrypted:** the doc is sealed client-side (age/libsodium, key derived from a passphrase only the user holds); the server stores ciphertext. This keeps the privacy invariant intact: the CSP rule relaxes to exactly one origin, and the server learns nothing but timing and size.

**Authentication**, if Stage 2 exists: passkeys, single user, no OAuth, no email, no password reset flows (the user *is* the operator; key loss = restore from any export, which remains the true source of durability).

## Collaboration

**Deliberately, permanently minimal.** Atlas's audience is you-in-2030; multi-user editing is constitutionally out (`12`). The only sanctioned sharing shapes, ever: exporting a **read-only rendered artifact** (a season review as a typeset page, the 2030 book) as a static file the user hands to someone. No live shares, no comments, no presence. This paragraph exists so a future lonely evening doesn't talk you into building a social feature and calling it "accountability."

## Mobile

A **thin capture client**, not a port. Scope, fixed: pulse (energy + line + session marks), ⌘K-grammar capture (ideas, question notes, milestones), read-only glance at the current week. No founding, no ceremonies, no Atlas view on a phone — the phone captures life; the desk is where you see it. Architecture: the same `domain/` package (pure TS — this is why it imports nothing) compiled into a PWA-first mobile shell syncing via whatever stage is live. If Stage 1 file-sync is the transport, mobile writes an **append-only outbox** (captures only) merged by the desktop — captures never conflict, so the phone never needs the merge engine at all.

## AI integrations — the narrow gate

The vision bans AI-generated judgment: *Atlas must never tell you who you are in words you didn't write.* Within that, exactly three assistant shapes are compatible with the soul, all optional, all local-inference-or-nothing, all producing **selections of your own words, never new sentences about you**:

1. **Echo curation** — choosing *which* of your past entries resurfaces (better than date heuristics; output = a quotation).
2. **Playback curation** — selecting reflection excerpts for season/year playbacks (output = your excerpts).
3. **Capture routing** — classifying an ambiguous ⌘K line to the right destination (output = a filing decision, confirmable).

Banned forever regardless of model quality: sentiment analysis of the user, productivity insights, coaching copy, auto-written reflections or answers, "you seem tired lately." If a model writes prose the user might mistake for their own voice, it's out.

## What never becomes a backend concern

No telemetry even when a server exists (the server sees ciphertext). No feature flags served remotely. No server-side rendering of user data. No account recovery that could read the doc. No third-party analytics/crash SDKs — crash reporting, if ever, is a local log the user can choose to export.

## Decision gates

| Trigger | Consider | Not before |
|---|---|---|
| Second computer in regular use | Stage 1 file sync | it actually happens |
| Capture friction away from desk proven (missing real milestones/ideas) | Mobile outbox client | one month of noted misses |
| Stage 1 conflicts observed monthly | Stage 2 server | Stage 1 has genuinely chafed |
| Echo heuristics feel stale after a year of data | AI shape #1, local-only | v1.1 |

Each gate opens with a decision record (`11 §DRs`) arguing against `01 §Non-goals` — the burden of proof is on the network, always.
