const clpFormatter = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0,
});

export function formatCurrency(value) {
  const amount = Number(value);
  if (Number.isNaN(amount)) {
    return clpFormatter.format(0);
  }
  return clpFormatter.format(amount);
}
