export function formatLabel(value: string) {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(' ');
}

export function getInitials(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((chunk) => chunk.charAt(0).toUpperCase())
    .join('');
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-IN', {
    currency: 'INR',
    maximumFractionDigits: 0,
    style: 'currency',
  }).format(value);
}

export function formatDateRange(startDate?: string | null, endDate?: string | null) {
  if (!startDate) return 'Dates coming soon';
  const start = new Date(startDate);
  if (Number.isNaN(start.getTime())) return 'Dates coming soon';
  const startLabel = start.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  if (!endDate) return startLabel;
  const end = new Date(endDate);
  if (Number.isNaN(end.getTime())) return startLabel;
  return `${startLabel} – ${end.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`;
}
