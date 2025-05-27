export const monthsUA = [
  'січня', 'лютого', 'березня', 'квітня', 'травня', 'червня',
  'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'
];

export function formatDateUA(dateStr?: string) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';
  return `${date.getDate()} ${monthsUA[date.getMonth()]} ${date.getFullYear()}`;
} 