const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/**
 * An ISO date as prose, at whatever precision it was recorded.
 *
 *   1536-03-13  →  13 March 1536
 *   1590-01     →  January 1590
 *   1531        →  1531
 *
 * The authority files record what their source gives and no more: Alamanni's
 * birth is known to the day and his death only to the month, and printing
 * "1536-03-13–1590-01" made a reader do the decoding. Parsed by hand rather
 * than through Date, which would shift a date across midnight depending on
 * where the reader happens to be.
 */
export function longDate(iso) {
  if (!iso) return '';
  const [y, m, d] = String(iso).split('-');
  if (!y) return '';
  const month = MONTHS[Number(m) - 1];
  if (!month) return y;
  return d ? `${Number(d)} ${month} ${y}` : `${month} ${y}`;
}

/**
 * Born and died. An en dash sits tight between bare years and takes spaces
 * once either side is more than one word, which is the usual typographic rule
 * and keeps "13 March 1536 – January 1590" from reading as one date.
 */
export function lifeSpan(birth, death) {
  const a = longDate(birth);
  const b = longDate(death);
  if (!a && !b) return '';
  if (!a || !b) return a || b;
  const spaced = a.includes(' ') || b.includes(' ');
  return spaced ? `${a} – ${b}` : `${a}–${b}`;
}
