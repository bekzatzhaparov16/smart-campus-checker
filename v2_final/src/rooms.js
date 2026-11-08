// Room data only. Fictional catalog; deeply frozen so bookings are immutable (AC5).
function deepFreeze(o) {
  Object.values(o).forEach(v => { if (typeof v === 'object' && v !== null) deepFreeze(v); });
  return Object.freeze(o);
}

export const EQUIPMENT = Object.freeze(['projector', 'whiteboard', 'computers', 'video-conferencing', 'microphone']);

export const ROOMS = deepFreeze([
  { id: 'A101', name: 'Aurora Lab', capacity: 30, equipment: ['projector', 'whiteboard', 'computers'], blocked: false,
    bookings: [{ start: '10:00', end: '11:00', title: 'Algorithms lecture' }, { start: '13:00', end: '14:30', title: 'Project seminar' }] },
  { id: 'B204', name: 'Birch Seminar Room', capacity: 12, equipment: ['whiteboard', 'video-conferencing'], blocked: false,
    bookings: [{ start: '09:30', end: '10:30', title: 'Thesis consultation' }, { start: '15:00', end: '17:00', title: 'Research group' }] },
  { id: 'C001', name: 'Cedar Auditorium', capacity: 120, equipment: ['projector', 'microphone', 'video-conferencing', 'whiteboard'], blocked: true,
    bookings: [] },
  { id: 'D010', name: 'Delta Study Pod', capacity: 4, equipment: ['whiteboard'], blocked: false,
    bookings: [{ start: '12:00', end: '13:00', title: 'Study group' }] },
  { id: 'E305', name: 'Elm Workshop', capacity: 20, equipment: ['projector', 'whiteboard', 'computers', 'microphone'], blocked: false,
    bookings: [{ start: '11:00', end: '13:00', title: 'Hackathon prep' }] },
]);
