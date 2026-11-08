#!/usr/bin/env bash
# Reproducible measures for the quality table. Run from the repository root.
# "Site" = one source line that implements the rule. Counts are grep-based, so they are a proxy, not a full clone detector.
set -u
V1="v1_initial/app.js"; V2="v2_final/src/*.js"
count() { grep -hE "$1" $2 2>/dev/null | wc -l; }
p1=$(count "split\(':'\)" "$V1");  p2=$(count "\.exec\(" "$V2")      # time parsing
o1=$(count "< (be|bEnd)\b" "$V1"); o2=$(count "< (be|bEnd)\b" "$V2") # overlap test
r1=$(count "<strong>" "$V1");      r2=$(count "<strong>" "$V2")      # result HTML template
echo "category                 v1  v2  removed"
echo "time parsing sites       $p1   $p2   $((p1-p2))"
echo "overlap test sites       $o1   $o2   $((o1-o2))"
echo "result rendering sites   $r1   $r2   $((r1-r2))"
echo "TOTAL duplicated sites removed: $(( (p1-p2)+(o1-o2)+(r1-r2) ))"
echo; echo "Lines of code per file:"; wc -l $V1 $V2 | sed 's/^/  /'
echo; echo "JS source files: v1=$(ls $V1 | wc -l) v2=$(ls $V2 | wc -l)"
