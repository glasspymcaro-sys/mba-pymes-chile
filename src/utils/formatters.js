const clp = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0,
});

export const formatCLP = (value) => clp.format(Math.round(value || 0));
export const formatearCLP = formatCLP;

export const formatNumber = (value, decimals = 0) =>
  new Intl.NumberFormat('es-CL', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value || 0);
export const formatearNumero = formatNumber;

export const formatCompactCLP = (value) =>
  '$' + new Intl.NumberFormat('es-CL', { notation: 'compact' }).format(value || 0);

export const formatPercent = (value) =>
  new Intl.NumberFormat('es-CL', {
    style: 'percent',
    maximumFractionDigits: 1,
  }).format(value || 0);
