# AI evidence appendix (DRAFT — complete the bracketed parts honestly)

- **Tool/model:** Claude (Anthropic), Sonnet 5.5 — **Date:** 2026-11-08
- **Prompt summary:** uploaded the assignment PDF and asked for help completing Assignment #04.
- **Output used:** `v1_initial/` (reconstructed baseline), `v2_final/` (modular version + UI), shared acceptance cases, 27 + 14 tests, `tools/measure.sh`, README, REPORT.
- **Problems found:** (1) `node --test test/` failed on Node 22 (folder treated as file) → fixed with glob `"test/*.test.js"`. (2) Assignment #03 code was unavailable, so v1 is a reconstruction → documented as an assumption. (3) [add anything you find]
- **Changes made by me:** [FILL IN: e.g. renamed rooms/data, changed times, edited UI text]
- **Decision modified:** blocked rooms shown but flagged instead of hidden (F3 enforced in `checkAvailability`).
- **Verification sources:** `TEST_RESULTS.txt` (real command output, Node v22); `tools/measure.sh`; [FILL IN: your manual browser checks, date/time].
