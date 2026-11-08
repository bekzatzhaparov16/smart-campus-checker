'use strict';
// Smart Campus Room Availability Checker - INITIAL version (single room, monolithic).
// Reconstructed baseline equivalent to the Assignment #03 prototype.

const NOW = '09:00'; // fixed "current time"
const ROOM = Object.freeze({
  name: 'Aurora Lab (A101)',
  blocked: false,
  bookings: Object.freeze([
    Object.freeze({ start: '10:00', end: '11:00', title: 'Algorithms lecture' }),
    Object.freeze({ start: '13:00', end: '14:30', title: 'Project seminar' }),
  ]),
});

function checkRoom(start, end, room = ROOM) {
  const sp = start.split(':');
  const ep = end.split(':');
  if (sp.length !== 2 || ep.length !== 2 || !/^\d{2}$/.test(sp[0]) || !/^\d{2}$/.test(sp[1]) ||
      !/^\d{2}$/.test(ep[0]) || !/^\d{2}$/.test(ep[1]) ||
      +sp[0] > 23 || +sp[1] > 59 || +ep[0] > 23 || +ep[1] > 59) {
    return { available: false, code: 'INVALID_FORMAT', message: 'Enter times as HH:MM, e.g. 10:30.' };
  }
  const s = +sp[0] * 60 + +sp[1];
  const e = +ep[0] * 60 + +ep[1];
  const np = NOW.split(':');
  const now = +np[0] * 60 + +np[1];
  if (e <= s) return { available: false, code: 'END_BEFORE_START', message: 'End time must be after start time.' };
  if (s < now) return { available: false, code: 'IN_PAST', message: 'Start time is already in the past.' };
  if (s < 8 * 60 || e > 21 * 60) return { available: false, code: 'OUT_OF_HOURS', message: 'Rooms can be booked between 08:00 and 21:00.' };
  if (e - s > 120) return { available: false, code: 'TOO_LONG', message: 'Bookings are limited to 120 minutes.' };
  if (room.blocked) return { available: false, code: 'BLOCKED', message: 'This room is blocked.' };
  for (const b of room.bookings) {
    const bs = +b.start.split(':')[0] * 60 + +b.start.split(':')[1];
    const be = +b.end.split(':')[0] * 60 + +b.end.split(':')[1];
    if (s < be && e > bs) {
      return { available: false, code: 'OVERLAP', message: 'Conflicts with "' + b.title + '" (' + b.start + '-' + b.end + ').' };
    }
  }
  return { available: true, code: 'OK', message: 'Room is available.' };
}

// "Next free slot" hint - copy-pasted parsing and overlap logic
function nextFreeStart(durationMin) {
  const np = NOW.split(':');
  let t = +np[0] * 60 + +np[1];
  while (t + durationMin <= 21 * 60) {
    let clash = false;
    for (const b of ROOM.bookings) {
      const bs = +b.start.split(':')[0] * 60 + +b.start.split(':')[1];
      const be = +b.end.split(':')[0] * 60 + +b.end.split(':')[1];
      if (t < be && t + durationMin > bs) { clash = true; t = be; break; }
    }
    if (!clash) return String(Math.floor(t / 60)).padStart(2, '0') + ':' + String(t % 60).padStart(2, '0');
  }
  return null;
}

if (typeof document !== 'undefined') {
  const box = document.getElementById('result');
  document.getElementById('room-name').textContent = ROOM.name;
  document.getElementById('check').addEventListener('click', () => {
    const r = checkRoom(document.getElementById('start').value, document.getElementById('end').value);
    box.className = r.available ? 'ok' : 'bad';
    box.innerHTML = '<strong>' + (r.available ? 'Available' : 'Not available') + '</strong><p>' + r.message + '</p>';
  });
  document.getElementById('hint').addEventListener('click', () => {
    const next = nextFreeStart(60);
    box.className = next ? 'ok' : 'bad';
    box.innerHTML = '<strong>' + (next ? 'Next free 60-min slot' : 'No free slot') + '</strong><p>' + (next || 'Nothing left today.') + '</p>';
  });
}

if (typeof module !== 'undefined') module.exports = { checkRoom, nextFreeStart, ROOM, NOW };
