// Convierte el colchón de seguridad (un porcentaje) en un puntaje del 1 al 10,
// para que el dueño del negocio vea un solo número fácil de entender,
// en vez de tener que interpretar porcentajes.

export function calcularPuntajeSalud(colchonPorcentaje) {
  // Si el colchón es 0% o menos, el puntaje es 1 (muy mal).
  // Si el colchón es 50% o más, el puntaje es 10 (excelente).
  // Todo lo del medio se reparte de forma pareja entre esos dos extremos.
  const puntaje = 1 + (Math.max(0, Math.min(colchonPorcentaje, 50)) / 50) * 9;
  return Math.round(puntaje);
}

export function mensajeSegunPuntaje(puntaje) {
  if (puntaje >= 8) return 'Tu negocio está sano. Vas bien.';
  if (puntaje >= 5) return 'Tu negocio va estable, pero se puede mejorar.';
  if (puntaje >= 3) return 'Hay que tener cuidado. Revisa tus costos o tus precios.';
  return 'Ojo: tu negocio está en una situación riesgosa. Conviene revisar los números pronto.';
}
