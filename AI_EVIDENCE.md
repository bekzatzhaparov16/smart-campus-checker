# AI evidence appendix

- **Tool / model:** Claude (Anthropic), Sonnet 5.5
- **Date:** 2026-11-08
- **Prompt summary:**
  1. Uploaded the Assignment #04 PDF and asked for help completing it (no earlier prototype was available, so v1 was reconstructed).
  2. Asked Claude to review my submitted report and GitHub repository against the assignment requirements.
- **Output used:** `v1_initial/` (baseline), `v2_final/` (modular version with room catalog, filters and UI), `shared/ac-cases.json`, 14 tests for v1 and 27 tests for v2, `tools/measure.sh`, README, report text.
- **Problems found:**
  1. `node --test test/` failed on Node 22 (folder treated as a file); fixed with the glob `"test/*.test.js"`.
  2. The Assignment #03 code was not available, so v1 is a reconstruction (documented as an assumption).
  3. The first draft of the report had leftover placeholders and a wrong description of v1/v2; I corrected them.
- **Changes made by me:** No code changes. I edited the report text (fixed placeholders and the description of v1/v2) and added screenshots.
- **Decision modified:** blocked rooms are shown but flagged instead of hidden (F3 enforced in `checkAvailability`).
- **Verification sources:**
  - `TEST_RESULTS.txt`: real output of `npm test` in both folders (Node v22) and of `tools/measure.sh`.
  - I re-ran `npm test` in `v1_initial` and `v2_final` myself (14/14 and 27/27).
  - Manual browser checks on 2026-11-08: opened v2 via `python3 -m http.server`, entered invalid times, 120 vs 121 minutes, touching intervals, switched rooms, and changed filters until the empty state appeared; all behaved as expected.