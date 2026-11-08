'use strict';
const test = require('node:test');
const assert = require('node:assert');
const { checkRoom, ROOM } = require('../app.js');
const { cases } = require('../../shared/ac-cases.json');

for (const c of cases) {
  test(`[v1] ${c.id}: ${c.desc}`, () => {
    const room = c.blocked ? { ...ROOM, blocked: true } : ROOM;
    const r = checkRoom(c.start, c.end, room);
    assert.strictEqual(r.available, c.available);
    assert.strictEqual(r.code, c.code);
    assert.ok(r.message.length > 0);
  });
}

test('[v1] AC5: booking data is immutable and not changed by a check', () => {
  const before = JSON.stringify(ROOM);
  checkRoom('10:30', '11:30');
  assert.strictEqual(JSON.stringify(ROOM), before);
  assert.throws(() => ROOM.bookings.push({ start: '15:00', end: '16:00', title: 'x' }), TypeError);
});
