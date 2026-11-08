// Time helpers: the ONLY place where "HH:MM" strings are parsed or formatted.
export const NOW = '09:00';          // fixed current time
export const OPEN = '08:00';
export const CLOSE = '21:00';
export const MAX_MINUTES = 120;

/** "HH:MM" -> minutes since midnight, or null if invalid. */
export function toMinutes(hhmm) {
  const m = /^(\d{2}):(\d{2})$/.exec(String(hhmm).trim());
  if (!m) return null;
  const h = Number(m[1]), min = Number(m[2]);
  return h > 23 || min > 59 ? null : h * 60 + min;
}

/** minutes since midnight -> "HH:MM" */
export function toHHMM(total) {
  return String(Math.floor(total / 60)).padStart(2, '0') + ':' + String(total % 60).padStart(2, '0');
}
