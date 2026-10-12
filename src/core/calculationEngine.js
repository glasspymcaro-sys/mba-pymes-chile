// Este archivo hace todas las cuentas del sistema.
// La idea es responder tres preguntas simples:
// 1. ¿Cuánto tengo que vender para no perder plata?
// 2. ¿Cuánta plata me queda libre por cada venta?
// 3. ¿Cuánto gano si vendo una cantidad X?

/**
 * Suma todos los costos que NO cambian aunque vendas más o menos
 * (arriendo, luz, sueldos fijos, internet, etc.)
 */
export function calcularCostosFijos(insumos) {
  return insumos
    .filter((item) => item.tipo === 'fijo')
    .reduce((total, item) => total + Number(item.monto || 0), 0);
}

/**
 * Suma todos los costos que SÍ cambian según cuánto vendas
 * (ingredientes, empaques, comisiones, etc.), por unidad vendida.
 */
export function calcularCostoVariablePorUnidad(insumos) {
  return insumos
    .filter((item) => item.tipo === 'variable')
    .reduce((total, item) => total + Number(item.monto || 0), 0);
}

/**
 * Cuánta plata te queda libre por cada unidad que vendes,
 * después de pagar lo que cuesta hacer o comprar esa unidad.
 * Ejemplo: vendes algo en $1.000 y te cuesta $600 hacerlo -> te quedan $400 libres.
 */
export function calcularGananciaPorUnidad(precioVenta, costoVariablePorUnidad) {
  return Number(precioVenta || 0) - Number(costoVariablePorUnidad || 0);
}

/**
 * Cuántas unidades tienes que vender en el mes para cubrir
 * todos tus costos fijos (ni ganar ni perder, quedar en cero).
 */
export function calcularPuntoDeEquilibrioEnUnidades(costosFijos, gananciaPorUnidad) {
  if (gananciaPorUnidad <= 0) return null; // si no ganas nada por unidad, nunca vas a cubrir los costos
  return Math.ceil(costosFijos / gananciaPorUnidad);
}

/**
 * Lo mismo de arriba pero en pesos: cuánto tienes que facturar
 * en el mes para quedar en cero.
 */
export function calcularPuntoDeEquilibrioEnPesos(puntoDeEquilibrioUnidades, precioVenta) {
  if (puntoDeEquilibrioUnidades === null) return null;
  return puntoDeEquilibrioUnidades * Number(precioVenta || 0);
}

/**
 * Cuánto ganas o pierdes si vendes una cantidad determinada de unidades.
 */
export function calcularGananciaTotal(unidadesVendidas, precioVenta, costoVariablePorUnidad, costosFijos) {
  const ingresos = unidadesVendidas * Number(precioVenta || 0);
  const costosVariablesTotales = unidadesVendidas * Number(costoVariablePorUnidad || 0);
  return ingresos - costosVariablesTotales - costosFijos;
}

/**
 * Arma los puntos para dibujar el gráfico: a medida que suben las unidades
 * vendidas, cómo suben los ingresos y cómo suben los costos totales.
 * Donde esas dos líneas se cruzan, ahí está el punto de equilibrio.
 */
export function generarDatosGrafico(costosFijos, costoVariablePorUnidad, precioVenta, unidadesMaximas) {
  const puntos = [];
  const pasos = 10;
  const salto = Math.max(1, Math.round(unidadesMaximas / pasos));

  for (let unidades = 0; unidades <= unidadesMaximas; unidades += salto) {
    const ingresos = unidades * Number(precioVenta || 0);
    const costosTotales = costosFijos + unidades * Number(costoVariablePorUnidad || 0);
    puntos.push({
      unidades,
      ingresos: Math.round(ingresos),
      costos: Math.round(costosTotales),
    });
  }
  return puntos;
}
