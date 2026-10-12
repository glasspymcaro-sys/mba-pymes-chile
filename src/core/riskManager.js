// Este archivo calcula qué tan "colchón" tienes por si las ventas bajan.
// Es decir: si un mes vendes menos de lo normal, ¿qué tan cerca estás
// de empezar a perder plata?

/**
 * Calcula el porcentaje de "colchón": cuánto pueden bajar tus ventas
 * actuales antes de llegar al punto donde ya no ganas ni pierdes.
 * Un número alto es bueno (tienes margen). Un número bajo o negativo es riesgoso.
 */
export function calcularColchonDeSeguridad(ventasActualesUnidades, puntoDeEquilibrioUnidades) {
  if (!ventasActualesUnidades || ventasActualesUnidades <= 0) return 0;
  if (puntoDeEquilibrioUnidades === null) return -100; // nunca cubres los costos fijos

  const colchon = ((ventasActualesUnidades - puntoDeEquilibrioUnidades) / ventasActualesUnidades) * 100;
  return Math.round(colchon);
}

/**
 * Traduce el número del colchón a una palabra simple y a un color,
 * para que se entienda de un vistazo sin tener que leer números.
 */
export function clasificarRiesgo(colchonPorcentaje) {
  if (colchonPorcentaje >= 30) {
    return {
      nivel: 'Bajo',
      color: 'verde',
      mensaje: 'Tu negocio tiene harto margen. Aunque bajen las ventas, no debieras tener problemas.',
    };
  }
  if (colchonPorcentaje >= 10) {
    return {
      nivel: 'Medio',
      color: 'amarillo',
      mensaje: 'Tienes algo de margen, pero conviene no confiarse. Si las ventas bajan mucho, puedes empezar a perder plata.',
    };
  }
  return {
    nivel: 'Alto',
    color: 'rojo',
    mensaje: 'Estás muy cerca del límite. Casi cualquier baja en las ventas te puede hacer perder plata este mes.',
  };
}
