// Filtering logic (F1, F2, F4 support). Pure.
/** F1 capacity >= attendees, F2 ALL required equipment. Blocked rooms stay listed (flagged); F3 is enforced in availability. */
export function filterRooms(rooms, { attendees = 1, equipment = [] } = {}) {
  return rooms.filter(r => r.capacity >= attendees && equipment.every(item => r.equipment.includes(item)));
}
