import test from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import { ROOMS } from '../src/rooms.js';
import { checkAvailability } from '../src/availability.js';

const { cases } = JSON.parse(readFileSync(new URL('../../shared/ac-cases.json', import.meta.url)));
const A101 = ROOMS.find(r => r.id === 'A101');

for (const c of cases) {
  test(`[v2] ${c.id}: ${c.desc}`, () => {
    const room = c.blocked ? { ...A101, blocked: true } : A101;
    const r = checkAvailability(room, c.start, c.end);
    assert.strictEqual(r.available, c.available);
    assert.strictEqual(r.code, c.code);
    assert.ok(r.message.length > 0); // AC6: always a human-readable message
  });
}

test('[v2] AC5: booking data is immutable and not changed by a check', () => {
  const before = JSON.stringify(ROOMS);
  checkAvailability(A101, '10:30', '11:30');
  assert.strictEqual(JSON.stringify(ROOMS), before);
  assert.throws(() => A101.bookings.push({ start: '15:00', end: '16:00', title: 'x' }), TypeError);
  assert.throws(() => { A101.bookings[0].start = '00:00'; }, TypeError);
});
