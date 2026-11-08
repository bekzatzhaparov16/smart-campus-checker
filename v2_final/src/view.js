// UI presentation: pure view-model -> HTML string (F4 empty state, clear feedback).
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export function renderRoomList(view, selectedId) {
  if (view.error) return `<p class="msg bad" role="alert">${esc(view.error)}</p>`;
  if (view.matches.length === 0) return '<p class="msg empty">No rooms match. Lower the attendee count or remove some equipment.</p>';
  return view.matches.map(r => `
    <label class="room${r.id === selectedId ? ' sel' : ''}${r.blocked ? ' blocked' : ''}">
      <input type="radio" name="room" value="${esc(r.id)}"${r.id === selectedId ? ' checked' : ''}>
      <span class="name">${esc(r.name)} <small>${esc(r.id)}</small></span>
      <span class="meta">${r.capacity} seats · ${esc(r.equipment.join(', '))}${r.blocked ? ' · blocked' : ''}</span>
    </label>`).join('');
}

export function renderResult(view) {
  if (view.error) return '';
  if (!view.selectedRoom) return '<p class="msg">Select a room to check availability.</p>';
  if (!view.result) return '<p class="msg">Enter a start and end time.</p>';
  const { available, message } = view.result;
  return `<p class="msg ${available ? 'ok' : 'bad'}"><strong>${available ? 'Available' : 'Not available'}</strong> ${esc(message)}</p>`;
}
