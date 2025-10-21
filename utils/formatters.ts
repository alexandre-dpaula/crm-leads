export function formatCurrency(value?: number | string | null) {
  if (value === undefined || value === null || value === '') return '—';
  const numeric = typeof value === 'number' ? value : Number(value);
  if (Number.isNaN(numeric)) return '—';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(numeric);
}
