// DOM wiring only. Any change in any input re-renders everything (F5).
import { EQUIPMENT } from './rooms.js';
import { computeView } from './controller.js';
import { renderRoomList, renderResult } from './view.js';

const $ = id => document.getElementById(id);
let roomId = null;

$('equipment').innerHTML = EQUIPMENT.map(e => `<label><input type="checkbox" value="${e}"> ${e}</label>`).join('');

function render() {
  const inputs = {
    attendees: $('attendees').value, roomId,
    equipment: [...document.querySelectorAll('#equipment input:checked')].map(i => i.value),
    start: $('start').value, end: $('end').value,
  };
  const view = computeView(inputs);
  roomId = view.selectedRoom ? view.selectedRoom.id : null;
  $('rooms').innerHTML = renderRoomList(view, roomId);
  $('result').innerHTML = renderResult(view);
}

$('form').addEventListener('input', render);
$('rooms').addEventListener('change', e => { roomId = e.target.value; render(); });
render();
