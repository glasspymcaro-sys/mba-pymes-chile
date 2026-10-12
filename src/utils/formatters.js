// Convierte números a formato de pesos chilenos, para que se vea
// "$1.500.000" y no "1500000".
export function formatearCLP(numero) {
  if (numero === null || numero === undefined || isNaN(numero)) return '$0';
  return '$' + Math.round(numero).toLocaleString('es-CL');
}

// Formatea números normales (unidades, cantidad de productos, etc.)
export function formatearNumero(numero) {
  if (numero === null || numero === undefined || isNaN(numero)) return '0';
  return Math.round(numero).toLocaleString('es-CL');
}
