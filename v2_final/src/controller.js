// Orchestration: turns raw UI inputs into a view model. Pure, so it is testable without a browser.
import { ROOMS } from './rooms.js';
import { filterRooms } from './filter.js';
import { checkAvailability } from './availability.js';

export function parseAttendees(raw) {
  const n = Number(raw);
  return Number.isInteger(n) && n >= 1 ? n : null;
}

/** inputs: { attendees, equipment[], roomId, start, end } */
export function computeView(inputs, rooms = ROOMS) {
  const attendees = parseAttendees(inputs.attendees);
  if (attendees === null) return { error: 'Attendees must be a whole number of 1 or more.', matches: [], selectedRoom: null, result: null };
  const matches = filterRooms(rooms, { attendees, equipment: inputs.equipment ?? [] });
  const selectedRoom = matches.find(r => r.id === inputs.roomId) ?? null; // F5: stale selection is dropped
  const hasTimes = Boolean(inputs.start && inputs.end);
  const result = selectedRoom && hasTimes ? checkAvailability(selectedRoom, inputs.start, inputs.end) : null;
  return { error: null, matches, selectedRoom, result };
}
