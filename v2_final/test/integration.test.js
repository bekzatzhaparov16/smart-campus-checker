import test from 'node:test';
import assert from 'node:assert';
import { computeView } from '../src/controller.js';
import { renderRoomList, renderResult } from '../src/view.js';

const base = { attendees: 1, equipment: [], roomId: null, start: '', end: '' };

test('F4 integration: no match -> view has empty matches and HTML shows a clear empty state', () => {
  const v = computeView({ ...base, attendees: 500 });
  assert.strictEqual(v.matches.length, 0);
  assert.match(renderRoomList(v, null), /No rooms match/);
});
test('F5 integration: switching room re-evaluates the same time slot', () => {
  const inputs = { ...base, start: '10:00', end: '11:00' };
  const a = computeView({ ...inputs, roomId: 'A101' });
  const e = computeView({ ...inputs, roomId: 'E305' });
  assert.strictEqual(a.result.available, false);
  assert.strictEqual(e.result.available, true);
  assert.match(renderResult(a), /Not available/);
  assert.match(renderResult(e), /Available/);
});
test('F5 integration: selection that no longer matches the filters is dropped (no stale result)', () => {
  const v = computeView({ ...base, roomId: 'D010', start: '11:00', end: '12:00', attendees: 10 }); // D010 capacity 4
  assert.strictEqual(v.selectedRoom, null);
  assert.strictEqual(v.result, null);
  assert.match(renderResult(v), /Select a room/);
});
test('UI: invalid attendees show an error message instead of crashing', () => {
  const v = computeView({ ...base, attendees: 'abc' });
  assert.ok(v.error);
  assert.match(renderRoomList(v, null), /role="alert"/);
});
test('UI: blocked room is listed but flagged, and checking it fails with a clear reason', () => {
  const v = computeView({ ...base, attendees: 100, roomId: 'C001', start: '11:00', end: '12:00' });
  assert.match(renderRoomList(v, 'C001'), /blocked/);
  assert.match(renderResult(v), /Not available.*blocked/);
});
test('UI: output is HTML-escaped', () => {
  const v = computeView({ ...base, roomId: 'A101', start: '<b>', end: '11:00' });
  assert.ok(!renderResult(v).includes('<b>'));
});
