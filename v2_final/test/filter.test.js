import test from 'node:test';
import assert from 'node:assert';
import { ROOMS } from '../src/rooms.js';
import { filterRooms } from '../src/filter.js';
import { checkAvailability } from '../src/availability.js';

const ids = rs => rs.map(r => r.id);

test('catalog has at least 4 rooms with id, name, capacity, equipment, blocked, bookings', () => {
  assert.ok(ROOMS.length >= 4);
  for (const r of ROOMS) {
    assert.ok(r.id && r.name && Number.isInteger(r.capacity) && Array.isArray(r.equipment) &&
              typeof r.blocked === 'boolean' && Array.isArray(r.bookings));
  }
});

test('F1 capacity boundary: exact capacity matches', () => {
  assert.ok(ids(filterRooms(ROOMS, { attendees: 12 })).includes('B204')); // capacity exactly 12
});
test('F1 capacity boundary: one more than capacity does not match', () => {
  assert.ok(!ids(filterRooms(ROOMS, { attendees: 13 })).includes('B204'));
  assert.ok(!ids(filterRooms(ROOMS, { attendees: 5 })).includes('D010')); // capacity 4
});
test('F2 equipment: room must contain ALL selected items', () => {
  const r = ids(filterRooms(ROOMS, { attendees: 1, equipment: ['projector', 'computers'] }));
  assert.deepStrictEqual(r.sort(), ['A101', 'E305']);
  assert.deepStrictEqual(ids(filterRooms(ROOMS, { equipment: ['computers', 'video-conferencing'] })), []); // no room has both
});
test('F1+F2 combined', () => {
  assert.deepStrictEqual(ids(filterRooms(ROOMS, { attendees: 25, equipment: ['projector'] })).sort(), ['A101', 'C001']);
});
test('F3 blocked room is never reported as available', () => {
  const blocked = ROOMS.find(r => r.blocked);
  assert.ok(blocked, 'catalog must contain a blocked room');
  const r = checkAvailability(blocked, '11:00', '12:00');
  assert.strictEqual(r.available, false);
  assert.strictEqual(r.code, 'BLOCKED');
});
test('availability uses the chosen room bookings, not another room\'s', () => {
  // 10:00-11:00 is booked in A101 but free in E305 and D010
  assert.strictEqual(checkAvailability(ROOMS.find(r => r.id === 'A101'), '10:00', '11:00').available, false);
  assert.strictEqual(checkAvailability(ROOMS.find(r => r.id === 'E305'), '10:00', '11:00').available, true);
  assert.strictEqual(checkAvailability(ROOMS.find(r => r.id === 'D010'), '10:00', '11:00').available, true);
});
