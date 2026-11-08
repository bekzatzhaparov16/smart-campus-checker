// Booking/availability rules (AC1-AC5). Pure functions, no DOM.
import { NOW, OPEN, CLOSE, MAX_MINUTES, toMinutes } from './time.js';

export const fail = (code, message, extra = {}) => ({ available: false, code, message, ...extra });

/** Half-open intervals: touching ends do NOT overlap. */
export function overlaps(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && aEnd > bStart;
}

/** AC1 + AC2: returns null if valid, otherwise a failure result. */
export function validateRequest(start, end) {
  const s = toMinutes(start), e = toMinutes(end);
  if (s === null || e === null) return fail('INVALID_FORMAT', 'Enter times as HH:MM, e.g. 10:30.');
  if (e <= s) return fail('END_BEFORE_START', 'End time must be after start time.');
  if (s < toMinutes(NOW)) return fail('IN_PAST', `Start time is already in the past (current time is ${NOW}).`);
  if (s < toMinutes(OPEN) || e > toMinutes(CLOSE)) return fail('OUT_OF_HOURS', `Rooms can be booked between ${OPEN} and ${CLOSE}.`);
  if (e - s > MAX_MINUTES) return fail('TOO_LONG', `Bookings are limited to ${MAX_MINUTES} minutes.`);
  return null;
}

/** Full check for ONE room, using only that room's bookings. Never mutates the room (AC5). */
export function checkAvailability(room, start, end) {
  const invalid = validateRequest(start, end);
  if (invalid) return invalid;
  if (room.blocked) return fail('BLOCKED', `${room.name} is blocked and cannot be booked.`);
  const s = toMinutes(start), e = toMinutes(end);
  const clash = room.bookings.find(b => overlaps(s, e, toMinutes(b.start), toMinutes(b.end)));
  if (clash) return fail('OVERLAP', `Conflicts with "${clash.title}" (${clash.start}-${clash.end}).`, { conflict: clash });
  return { available: true, code: 'OK', message: `${room.name} is available.` };
}

/** Earliest free start for a given duration (reuses toMinutes/overlaps - no copy-paste). */
export function nextFreeStart(room, durationMin) {
  if (room.blocked) return null;
  let t = toMinutes(NOW);
  while (t + durationMin <= toMinutes(CLOSE)) {
    const clash = room.bookings.find(b => overlaps(t, t + durationMin, toMinutes(b.start), toMinutes(b.end)));
    if (!clash) return t;
    t = toMinutes(clash.end);
  }
  return null;
}
