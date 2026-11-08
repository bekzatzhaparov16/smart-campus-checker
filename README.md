# Smart Campus Room Availability Checker (Assignment #04)

Fictional data only. No login, payments, APIs or database. Fixed "current time" = 09:00 (bookings are for one fictional day).
The Assignment #03 prototype was reconstructed as `v1_initial` (single room); `v2_final` is the extended + refactored version.

## Requirements
Node.js 20+ (tested on v22). No `npm install` needed (zero dependencies).

## Run the app (v2)
ES modules need HTTP (not file://):
```bash
cd v2_final
python3 -m http.server 8000      # or: npx serve .
# open http://localhost:8000
```
v1 can be opened directly: `v1_initial/index.html`.

## Run the tests
```bash
cd v1_initial && npm test        # baseline: 14 tests (AC1-AC5)
cd v2_final   && npm test        # final: 27 tests (AC1-AC5 regression + F1-F5 + integration/UI)
./tools/measure.sh               # quality measures used in REPORT.md
```
Actual output is saved in `TEST_RESULTS.txt`.

## Layout
```
v1_initial/app.js                  monolith (data + rules + DOM)
v2_final/src/time.js               time parsing/formatting + constants
v2_final/src/rooms.js              room catalog (5 rooms, frozen)
v2_final/src/availability.js       AC1-AC5 rules
v2_final/src/filter.js             F1, F2 filtering
v2_final/src/controller.js         inputs -> view model (F3-F5 orchestration)
v2_final/src/view.js               view model -> HTML (F4 empty state, feedback)
v2_final/src/main.js               DOM wiring
shared/ac-cases.json              acceptance cases run against BOTH versions
```
