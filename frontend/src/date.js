/** Formats a due date as DD.MM.YYYY */
export function formatDate(value) {
  if (!value) return '';
  const [year, month, day] = new Date(value).toISOString().slice(0, 10).split('-');
  return `${day}.${month}.${year}`;
}

/** Start of the given day (00:00) */
export function startOfDay(value) {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
}

/** Start of today (00:00) */
export function today() {
  return startOfDay(new Date());
}
