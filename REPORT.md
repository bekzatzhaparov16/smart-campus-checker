# Analysis & Refactoring Report — Smart Campus Room Checker

Assumption: the Assignment #03 prototype was not available, so an equivalent minimal version was reconstructed as `v1_initial`. Rules: valid HH:MM, end after start, not before current time 09:00, opening hours 08:00–21:00, max 120 min, blocked room, overlap (touching allowed), immutable bookings, clear messages.

## Task 1 — Codebase analysis (v1)
**Context given to the AI:** repository map (one file `app.js`, `index.html`), AC1–AC6, constraints (no backend, fictional data, no full rewrite), and the new requirements F1–F5.

**Maintainability risks (file/function):**
1. **Duplicated time parsing** — `app.js: checkRoom` and `nextFreeStart` parse "HH:MM" with `split(':')` on 8 separate lines. A fix to the format rule must be repeated everywhere.
2. **Duplicated overlap rule** — the overlap condition appears in the `checkRoom` loop and again in `nextFreeStart`; they can silently diverge.
3. **Single hard-coded room + mixed concerns** — global `ROOM` constant is read by default inside `checkRoom`, which also validates, applies business rules and builds message text; DOM handlers at the bottom build HTML strings twice (`box.innerHTML`). Multi-room support cannot be added without touching all of it.

**Prioritized plan (before editing):** (P1) extract `time.js`; (P2) single `overlaps()` + `availability.js` taking a `room` argument; (P3) room catalog + `filter.js`; (P4) pure controller/view-model + `view.js`; (P5) tests after each step.

**AI suggestion modified/rejected:** see *Task 6* and `AI_EVIDENCE.md`.

## Task 2 — Feature extension
Catalog of 5 fictional rooms (`rooms.js`), each with id, name, capacity, equipment, blocked, own bookings. UI filters by attendees (F1) and ALL selected equipment (F2); blocked rooms stay listed but flagged and can never be "Available" (F3); empty state (F4); any input change re-renders and re-evaluates (F5). Demonstrated by tests 16–27 in `TEST_RESULTS.txt` (successful and unsuccessful filtering, room switching, availability).

## Task 3 — Refactoring
```
BEFORE                                  AFTER
┌─────────────────────────┐   ┌────────────┐   ┌─────────────────┐
│ app.js                  │   │ main.js    │──▶│ controller.js   │
│  ROOM data              │   │ (DOM only) │   │ (view model)    │
│  checkRoom (validate +  │   └─────┬──────┘   └──┬──────────┬───┘
│   rules + messages)     │         ▼             ▼          ▼
│  nextFreeStart (copy)   │   ┌────────────┐ ┌──────────┐ ┌──────────────┐
│  DOM handlers + HTML    │   │ view.js    │ │ filter.js│ │availability.js│
└─────────────────────────┘   │ (HTML)     │ └────┬─────┘ └───┬──────────┘
                              └────────────┘      ▼           ▼
                                             ┌─────────┐  ┌─────────┐
                                             │rooms.js │  │ time.js │
                                             └─────────┘  └─────────┘
```
**Design decisions:**
1. *Pure controller returning a view model* — filtering, selection and availability can be integration-tested in Node without a browser; `main.js` only wires events.
2. *`time.js` is the only parser; `overlaps()` is the only overlap rule* — removes the duplicated sites and makes touching-vs-overlapping a single, tested decision.
3. *Blocked rooms are listed but flagged* (not hidden) — the user learns why a room is unavailable; F3 is enforced in `checkAvailability`, not by the UI.
4. *Deep-frozen room data* — enforces AC5; tests confirm mutation throws.

## Task 4 — Automated testing
Commands: `cd v2_final && npm test` (Node built-in runner). **27 tests, 27 pass.** Includes AC1–AC5 regression (shared cases from `shared/ac-cases.json`, also run on v1), F1–F5, boundaries (120 vs 121 min; touching vs overlapping; capacity 12 vs 13), and 6 integration/UI-behavior checks (empty state, room switching, stale selection, error alert, blocked flag, HTML escaping). Full output: `TEST_RESULTS.txt`. Limitation: UI is tested via the view model and rendered HTML, not in a real browser.

## Task 5 — Quality evaluation
| Measure | v1 (original) | v2 (final) | How obtained |
|---|---|---|---|
| Automated tests passed / total | 14 / 14 (AC1–AC5 only) | 27 / 27 | `npm test` in each folder |
| Duplicated logic sites | time parsing 8, overlap 2, result HTML 2 | 1, 1, 1 | `tools/measure.sh` (grep per rule) |
| Duplicated sites removed | — | 9 | sum of (v1 − v2) per category |
| Structure | 1 JS file, 73 lines, all responsibilities | 7 modules, 152 lines in `src/` (time, data, rules, filter, controller, view, DOM) | `wc -l` |

Same shared acceptance cases pass on both versions, which is the evidence that old behavior is preserved. **Limitations:** grep counts are a proxy, not a clone detector; no real-browser/E2E test; no booking creation, only availability; times are for one fixed day; the optional "next free slot" button from v1 is implemented in `nextFreeStart` but not yet wired into the v2 UI.

## Task 6 — AI reflection (DRAFT — rewrite in your own words, 200–300 words)
I gave the assistant (Claude) a repository map, AC1–AC6, the F1–F5 requirements and the constraint to avoid a full rewrite. It generated a reconstructed v1, the modular v2, and the tests. Useful: the split into small modules, the shared acceptance-case file that runs on both versions, and the grep-based measure script. Incorrect: the first test command (`node --test test/`) failed on Node 22 because it treated the folder as a file; I changed it to a glob pattern. I also modified one design choice: instead of hiding blocked rooms from the list, they are shown and flagged, so F3 is enforced in the availability rule rather than by the UI. I personally verified [FILL IN: ran both test suites myself, opened the app in a browser, tried invalid times, 120/121 minutes, touching intervals, switching rooms, changed filters until the empty state appeared, read the diff of each module]. Tests influenced decisions: running the same 13 cases on v1 and v2 let me refactor without fear, and the stale-selection test made me drop a selected room when filters exclude it. Next I would add a real browser test, wire "next free slot" into the UI, add booking creation, and replace grep-based duplication counts with a proper clone detector.
