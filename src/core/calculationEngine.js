/**
 * MOTOR MATEMÁTICO DE INGENIERÍA FINANCIERA & FIJACIÓN DE PRECIOS ($5,000+ USD SAAS STANDARD)
 * Incluye:
 * 1. Punto de Equilibrio Tradicional y con "Sueldo Objetivo" (Target Profit) + Capacidad Física Real
 * 2. Detector de "Fugas de Margen" (IVA 19%, POS Transbank/MercadoPago, Delivery Apps, Merma/Packaging)
 * 3. Diferenciador Markup vs. Margen Bruto Real + 3 Escenarios Psicológicos de Precios
 * 4. "Destructor de Descuentos" (Impacto exponencial en volumen exigido) + Escudo Anti-Inflación
 * 5. Calendario Mensual "El Día de la Libertad" (Día y hora exacta en que empieza a ganar dinero propio)
 * 6. Punto de Equilibrio Multi-Producto Ponderado + Matriz de Rentabilidad (Minas de Oro, Ganchos, Joyas, Vampiros)
 */

export function calcularCostosFijos(insumos) {
  return (insumos || [])
    .filter((item) => item.tipo === 'fijo')
    .reduce((total, item) => total + Number(item.monto || 0), 0);
}

export function calcularCostoVariablePorUnidad(insumos) {
  return (insumos || [])
    .filter((item) => item.tipo === 'variable')
    .reduce((total, item) => total + Number(item.monto || 0), 0);
}

export function calcularGananciaPorUnidad(precioVenta, costoVariablePorUnidad) {
  return Number(precioVenta || 0) - Number(costoVariablePorUnidad || 0);
}

export function calcularPuntoDeEquilibrioEnUnidades(costosFijos, gananciaPorUnidad) {
  if (gananciaPorUnidad <= 0) return null;
  return Math.ceil(costosFijos / gananciaPorUnidad);
}

export function calcularPuntoDeEquilibrioEnPesos(puntoDeEquilibrioUnidades, precioVenta) {
  if (puntoDeEquilibrioUnidades === null) return null;
  return puntoDeEquilibrioUnidades * Number(precioVenta || 0);
}

export function calcularGananciaTotal(unidadesVendidas, precioVenta, costoVariablePorUnidad, costosFijos) {
  const ingresos = unidadesVendidas * Number(precioVenta || 0);
  const costosVariablesTotales = unidadesVendidas * Number(costoVariablePorUnidad || 0);
  return ingresos - costosVariablesTotales - costosFijos;
}

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

/**
 * 1. DETECTOR DE "FUGAS DE MARGEN" (COSTOS OCULTOS) Y DIFERENCIADOR MARKUP VS MARGEN BRUTO REAL
 */
export function calcularFugasDeMargen({
  precioBruto = 8900,
  costoDirectoBase = 4250,
  incluirIVA = true,
  incluirPOS = true,
  comisionPOSPorcentaje = 2.95,
  incluirDelivery = false,
  comisionDeliveryPorcentaje = 28,
  mermaPackagingPorcentaje = 3.5,
}) {
  const precio = Math.max(0, Number(precioBruto || 0));
  const costoBase = Math.max(0, Number(costoDirectoBase || 0));

  // IVA 19% en Chile: Precio Bruto = Precio Neto * 1.19 -> IVA = Precio Bruto - (Precio Bruto / 1.19)
  const montoIVA = incluirIVA ? Math.round(precio - precio / 1.19) : 0;
  const precioNetoSinIVA = precio - montoIVA;

  // Pasarela POS (Transbank, MercadoPago, SumUp: 1.5% a 3.5%)
  const tasaPOS = incluirPOS ? Math.max(0, Number(comisionPOSPorcentaje || 0)) / 100 : 0;
  const montoPOS = Math.round(precio * tasaPOS);

  // Apps de Delivery o Marketplace (UberEats, PedidosYa, Rappi: 25% a 30%)
  const tasaDelivery = incluirDelivery ? Math.max(0, Number(comisionDeliveryPorcentaje || 0)) / 100 : 0;
  const montoDelivery = Math.round(precio * tasaDelivery);

  // Merma operativa y Packaging (2% a 5%)
  const tasaMerma = Math.max(0, Number(mermaPackagingPorcentaje || 0)) / 100;
  const montoMermaPackaging = Math.round(costoBase * tasaMerma);

  const totalFugasPorUnidad = montoIVA + montoPOS + montoDelivery + montoMermaPackaging;
  const costoDirectoEfectivoTotal = costoBase + totalFugasPorUnidad;
  const margenContribucionNominal = precio - costoBase;
  const margenContribucionReal = precio - costoDirectoEfectivoTotal;

  // Diferencia crítica: Markup (Recargo sobre el costo) vs Margen Bruto Real (% sobre el precio)
  const markupPorcentaje = costoBase > 0 ? Math.round(((precio - costoBase) / costoBase) * 100) : 0;
  const margenNominalPorcentaje = precio > 0 ? Math.round((margenContribucionNominal / precio) * 100) : 0;
  const margenBrutoRealPorcentaje = precio > 0 ? Math.round((margenContribucionReal / precio) * 100) : 0;

  // Cálculo del "Precio Delivery Blindado" para no perder plata al vender por UberEats/PedidosYa
  const comisionDeliveryRef = Math.max(0.25, Number(comisionDeliveryPorcentaje || 28) / 100);
  const margenSinDelivery = precio - (costoBase + montoIVA + montoPOS + montoMermaPackaging);
  const ingresoRequeridoAntesDelivery = costoBase + montoIVA + montoPOS + montoMermaPackaging + Math.max(1000, margenSinDelivery);
  const precioSugeridoDelivery = Math.ceil(ingresoRequeridoAntesDelivery / (1 - comisionDeliveryRef) / 100) * 100;

  return {
    precioBruto: precio,
    precioNetoSinIVA,
    costoDirectoBase: costoBase,
    montoIVA,
    montoPOS,
    montoDelivery,
    montoMermaPackaging,
    totalFugasPorUnidad,
    costoDirectoEfectivoTotal,
    margenContribucionNominal,
    margenContribucionReal,
    markupPorcentaje,
    margenNominalPorcentaje,
    margenBrutoRealPorcentaje,
    precioSugeridoDelivery,
    tasaFugasSobrePrecio: precio > 0 ? totalFugasPorUnidad / precio : 0,
  };
}

/**
 * 2. INGENIERÍA INVERSA: "EL SUELDO OBJETIVO" (TARGET PROFIT) Y ALERTA DE CAPACIDAD FÍSICA REAL
 */
export function calcularSueldoObjetivoYCapacidad({
  costosFijos = 2330000,
  sueldoObjetivo = 1500000,
  margenUnitarioReal = 3500,
  precioVenta = 8900,
  diasOperativosMes = 25,
  horasOperativasDia = 8,
  capacidadMaximaHora = 12,
}) {
  const cf = Math.max(0, Number(costosFijos || 0));
  const sueldo = Math.max(0, Number(sueldoObjetivo || 0));
  const margen = Number(margenUnitarioReal || 0);
  const precio = Math.max(1, Number(precioVenta || 1));
  const dias = Math.max(1, Number(diasOperativosMes || 25));
  const horas = Math.max(1, Number(horasOperativasDia || 8));
  const capMaxHora = Math.max(1, Number(capacidadMaximaHora || 12));

  const metaTotalExigida = cf + sueldo;

  if (margen <= 0) {
    return {
      esViable: false,
      peBaseUnidades: null,
      peBasePesos: null,
      peConSueldoUnidades: null,
      peConSueldoPesos: null,
      unidadesDiariasMeta: null,
      facturacionDiariaMeta: null,
      unidadesPorHoraMeta: null,
      excedeCapacidadFisica: true,
      porcentajeUsoCapacidad: 100,
      capacidadMaximaMensual: capMaxHora * horas * dias,
    };
  }

  const peBaseUnidades = Math.ceil(cf / margen);
  const peBasePesos = peBaseUnidades * precio;

  const peConSueldoUnidades = Math.ceil(metaTotalExigida / margen);
  const peConSueldoPesos = peConSueldoUnidades * precio;

  const unidadesDiariasMeta = Math.ceil(peConSueldoUnidades / dias);
  const facturacionDiariaMeta = unidadesDiariasMeta * precio;
  const unidadesPorHoraMeta = Number((unidadesDiariasMeta / horas).toFixed(1));

  const capacidadMaximaMensual = capMaxHora * horas * dias;
  const porcentajeUsoCapacidad = Math.round((unidadesPorHoraMeta / capMaxHora) * 100);
  const excedeCapacidadFisica = unidadesPorHoraMeta > capMaxHora;

  return {
    esViable: true,
    peBaseUnidades,
    peBasePesos,
    peConSueldoUnidades,
    peConSueldoPesos,
    unidadesDiariasMeta,
    facturacionDiariaMeta,
    unidadesPorHoraMeta,
    excedeCapacidadFisica,
    porcentajeUsoCapacidad,
    capacidadMaximaMensual,
  };
}

/**
 * 3. SIMULADOR PSICOLÓGICO DE PRECIOS (3 ESCENARIOS AUTOMÁTICOS DE POSICIONAMIENTO)
 */
export function calcularEscenariosPsicologicosPrecios({
  costoDirectoBase = 4250,
  tasaFugasSobrePrecio = 0.18,
  costosFijos = 2330000,
  sueldoObjetivo = 1500000,
  diasOperativosMes = 25,
}) {
  const costo = Math.max(100, Number(costoDirectoBase || 1000));
  const fugas = Math.min(0.55, Math.max(0, Number(tasaFugasSobrePrecio || 0)));
  const metaTotal = Math.max(0, Number(costosFijos || 0)) + Math.max(0, Number(sueldoObjetivo || 0));
  const dias = Math.max(1, Number(diasOperativosMes || 25));

  const configuraciones = [
    {
      id: 'penetracion',
      nombre: 'Precio Penetración',
      etiqueta: 'Volumen Alto • Margen Ajustado',
      iconoId: 'precio_penetracion',
      margenObjetivoSobrePrecio: 0.28,
      descripcion: 'Atrae clientes rápido por precio competitivo, pero exige alta rotación diaria sin descanso.',
      recomendado: false,
    },
    {
      id: 'saludable',
      nombre: 'Precio Saludable',
      etiqueta: 'Recomendado • Equilibrio Óptimo',
      iconoId: 'precio_saludable',
      margenObjetivoSobrePrecio: 0.44,
      descripcion: 'Equilibrio ideal entre margen de contribución libre y esfuerzo comercial diario sostenible.',
      recomendado: true,
    },
    {
      id: 'premium',
      nombre: 'Precio Premium',
      etiqueta: 'Alta Rentabilidad • Menor Esfuerzo',
      iconoId: 'precio_premium',
      margenObjetivoSobrePrecio: 0.58,
      descripcion: 'Maximiza la ganancia líquida por unidad; requieres pocas ventas al día para alcanzar tu sueldo.',
      recomendado: false,
    },
  ];

  return configuraciones.map((cfg) => {
    const denominador = Math.max(0.12, 1 - fugas - cfg.margenObjetivoSobrePrecio);
    const precioCalculado = Math.ceil(costo / denominador / 100) * 100;
    const margenLimpioUnitario = Math.max(100, Math.round(precioCalculado * (1 - fugas) - costo));
    const margenRealPct = Math.round((margenLimpioUnitario / precioCalculado) * 100);
    const unidadesMesMeta = Math.ceil(metaTotal / margenLimpioUnitario);
    const unidadesDiaMeta = Math.ceil(unidadesMesMeta / dias);

    return {
      ...cfg,
      precioSugerido: precioCalculado,
      margenUnitario: margenLimpioUnitario,
      margenPorcentaje: margenRealPct,
      unidadesMesMeta,
      unidadesDiaMeta,
    };
  });
}

/**
 * 4. EL "DESTRUCTOR DE DESCUENTOS" (SIMULADOR DE PROMOCIONES Y 2X1)
 */
export function calcularDestructorDescuentos({
  precioActual = 8900,
  costoDirectoEfectivoTotal = 4900,
  porcentajeDescuento = 15,
  ventasActuales = 450,
}) {
  const precio = Math.max(1, Number(precioActual || 1));
  const costo = Math.max(0, Number(costoDirectoEfectivoTotal || 0));
  const dcto = Math.min(80, Math.max(0, Number(porcentajeDescuento || 0)));
  const qActual = Math.max(1, Number(ventasActuales || 1));

  const margenActualUnitario = precio - costo;
  const gananciaBrutaActual = margenActualUnitario * qActual;

  const nuevoPrecioConDescuento = Math.round(precio * (1 - dcto / 100));
  const margenConDescuento = nuevoPrecioConDescuento - costo;

  if (margenConDescuento <= 0 || margenActualUnitario <= 0) {
    return {
      porcentajeDescuento: dcto,
      precioOriginal: precio,
      nuevoPrecioConDescuento,
      margenActualUnitario,
      margenConDescuento,
      entraEnPerdidaDirecta: true,
      porcentajeEsfuerzoExtra: null,
      unidadesNecesariasParaEmpatar: null,
      unidadesExtraRequeridas: null,
      precioComboSugerido: Math.round(precio * 1.75),
    };
  }

  const ratioEsfuerzo = margenActualUnitario / margenConDescuento;
  const porcentajeEsfuerzoExtra = Math.round((ratioEsfuerzo - 1) * 100);
  const unidadesNecesariasParaEmpatar = Math.ceil(gananciaBrutaActual / margenConDescuento);
  const unidadesExtraRequeridas = Math.max(0, unidadesNecesariasParaEmpatar - qActual);

  return {
    porcentajeDescuento: dcto,
    precioOriginal: precio,
    nuevoPrecioConDescuento,
    margenActualUnitario,
    margenConDescuento,
    entraEnPerdidaDirecta: false,
    porcentajeEsfuerzoExtra,
    unidadesNecesariasParaEmpatar,
    unidadesExtraRequeridas,
    precioComboSugerido: Math.ceil((precio * 2 * 0.88 + 600) / 100) * 100,
  };
}

/**
 * 5. ESCUDO ANTI-INFLACIÓN EN EL BOLSILLO (ALZA DE PROVEEDORES EN TIEMPO REAL)
 */
export function calcularEscudoAntiInflacion({
  precioActual = 8900,
  costoDirectoBase = 4250,
  porcentajeAlzaProveedor = 12,
  ventasMensuales = 450,
  tasaFugasSobrePrecio = 0.18,
}) {
  const precio = Math.max(1, Number(precioActual || 1));
  const costoBase = Math.max(0, Number(costoDirectoBase || 0));
  const alzaPct = Math.max(0, Number(porcentajeAlzaProveedor || 0));
  const ventas = Math.max(1, Number(ventasMensuales || 1));
  const fugas = Math.min(0.6, Math.max(0, Number(tasaFugasSobrePrecio || 0)));

  const alzaCostoUnitario = Math.round(costoBase * (alzaPct / 100));
  const nuevoCostoDirectoBase = costoBase + alzaCostoUnitario;

  // Para mantener intacto el margen líquido después de IVA/POS, el alza de precio debe compensar también la tasa de fuga
  const ajustePrecioNecesario = Math.ceil(alzaCostoUnitario / Math.max(0.2, 1 - fugas) / 50) * 50;
  const nuevoPrecioProtegido = precio + ajustePrecioNecesario;
  const perdidaMensualProyectada = alzaCostoUnitario * ventas;
  const perdidaAnualProyectada = perdidaMensualProyectada * 12;

  return {
    porcentajeAlzaProveedor: alzaPct,
    alzaCostoUnitario,
    nuevoCostoDirectoBase,
    ajustePrecioNecesario,
    nuevoPrecioProtegido,
    perdidaMensualProyectada,
    perdidaAnualProyectada,
  };
}

/**
 * 6. EL "DÍA DE LA LIBERTAD" (CALENDARIO VISUAL DEL MES 1 AL 30 CON HORA EXACTA)
 */
export function calcularCalendarioDiaLibertad({
  costosFijos = 2330000,
  sueldoObjetivo = 1500000,
  margenUnitarioReal = 4000,
  ventasMensualesEstimadas = 450,
  horaApertura = 9,
  horasJornada = 10,
}) {
  const cf = Math.max(0, Number(costosFijos || 0));
  const sueldo = Math.max(0, Number(sueldoObjetivo || 0));
  const margen = Math.max(0, Number(margenUnitarioReal || 0));
  const ventasMes = Math.max(1, Number(ventasMensualesEstimadas || 1));

  const margenTotalMensual = margen * ventasMes;
  const margenDiario = margenTotalMensual / 30;

  let diaEquilibrioExacto = margenDiario > 0 ? cf / margenDiario : 31;
  let diaSueldoExacto = margenDiario > 0 ? (cf + sueldo) / margenDiario : 31;

  const lograEquilibrioEnMes = diaEquilibrioExacto <= 30 && margen > 0;
  const lograSueldoEnMes = diaSueldoExacto <= 30 && margen > 0;

  const diaEquilibrioNumero = lograEquilibrioEnMes ? Math.max(1, Math.ceil(diaEquilibrioExacto)) : null;
  const fraccionDiaEquilibrio = diaEquilibrioExacto - Math.floor(diaEquilibrioExacto);
  const horaEquilibrioDecimal = horaApertura + fraccionDiaEquilibrio * horasJornada;
  const hhEq = Math.min(22, Math.max(horaApertura, Math.floor(horaEquilibrioDecimal)));
  const mmEq = Math.round((horaEquilibrioDecimal - Math.floor(horaEquilibrioDecimal)) * 60);
  const horaLibertadCostos = `${String(hhEq).padStart(2, '0')}:${String(mmEq === 60 ? 0 : mmEq).padStart(2, '0')} hrs`;

  const diaSueldoNumero = lograSueldoEnMes ? Math.max(1, Math.ceil(diaSueldoExacto)) : null;
  const fraccionDiaSueldo = diaSueldoExacto - Math.floor(diaSueldoExacto);
  const horaSueldoDecimal = horaApertura + fraccionDiaSueldo * horasJornada;
  const hhSueldo = Math.min(22, Math.max(horaApertura, Math.floor(horaSueldoDecimal)));
  const mmSueldo = Math.round((horaSueldoDecimal - Math.floor(horaSueldoDecimal)) * 60);
  const horaLibertadSueldo = `${String(hhSueldo).padStart(2, '0')}:${String(mmSueldo === 60 ? 0 : mmSueldo).padStart(2, '0')} hrs`;

  const diasCalendario = [];
  for (let dia = 1; dia <= 30; dia++) {
    const acumuladoMargen = Math.round(margenDiario * dia);
    let fase = 'costos_fijos'; // Trabajando para arriendo, sueldos y proveedores
    let etiqueta = 'Pagando Gastos';

    if (lograEquilibrioEnMes && dia >= diaEquilibrioNumero) {
      if (lograSueldoEnMes && dia >= diaSueldoNumero) {
        fase = 'utilidad_pura';
        etiqueta = 'Riqueza Extra';
      } else {
        fase = 'sueldo_objetivo';
        etiqueta = 'Tu Sueldo';
      }
    }

    diasCalendario.push({
      dia,
      fase,
      etiqueta,
      esDiaLibertadCostos: dia === diaEquilibrioNumero,
      esDiaLibertadSueldo: dia === diaSueldoNumero,
      saldoNetoAcumulado: acumuladoMargen - cf,
    });
  }

  return {
    lograEquilibrioEnMes,
    lograSueldoEnMes,
    diaEquilibrioNumero,
    horaLibertadCostos,
    diaSueldoNumero,
    horaLibertadSueldo,
    margenDiario: Math.round(margenDiario),
    diasParaPagarCostos: lograEquilibrioEnMes ? diaEquilibrioNumero - 1 : 30,
    diasParaGanarPlata: lograEquilibrioEnMes ? 30 - diaEquilibrioNumero + 1 : 0,
    diasCalendario,
  };
}

/**
 * 7. PUNTO DE EQUILIBRIO MULTI-PRODUCTO E INGENIERÍA DE MENÚ / CATÁLOGO (MATRIZ 4 CUADRANTES)
 */
export function calcularIngenieriaMenuMultiproducto({
  productos = [],
  costosFijos = 2330000,
  sueldoObjetivo = 1500000,
  tasaFugasSobrePrecio = 0,
}) {
  if (!Array.isArray(productos) || productos.length === 0) {
    return {
      productosClasificados: [],
      margenPonderado: 0,
      precioPonderado: 0,
      peMultiproductoBaseUnidades: 0,
      peMultiproductoConSueldoUnidades: 0,
      facturacionEquilibrioConSueldo: 0,
    };
  }

  // Calcular costo directo y margen de cada producto
  const enriquecidos = productos.map((p) => {
    const costoIngredientes = Array.isArray(p.ingredientes)
      ? p.ingredientes.reduce((acc, ing) => acc + Number(ing.costoUnitario || 0) * Number(ing.cantidad || 1), 0)
      : Number(p.costoTotal || p.costoDirecto || 2000);
    const precio = Math.max(100, Number(p.precioVenta || 5000));
    const fugasUnit = Math.round(precio * Math.max(0, Math.min(0.5, tasaFugasSobrePrecio)));
    const margenUnitario = precio - costoIngredientes - fugasUnit;
    const margenPorcentaje = Math.round((margenUnitario / precio) * 100);
    const mixPeso = Math.max(1, Number(p.mixPorcentaje ?? 25));

    return {
      ...p,
      precioVenta: precio,
      costoDirecto: costoIngredientes,
      margenUnitario,
      margenPorcentaje,
      mixPeso,
    };
  });

  const sumaPesos = enriquecidos.reduce((acc, p) => acc + p.mixPeso, 0) || 100;
  const promedioMargenUnitario =
    enriquecidos.reduce((acc, p) => acc + p.margenUnitario, 0) / enriquecidos.length;
  const promedioMixNormalizado = 100 / enriquecidos.length;

  let margenPonderado = 0;
  let precioPonderado = 0;

  const conMix = enriquecidos.map((p) => {
    const mixNormalizado = Number(((p.mixPeso / sumaPesos) * 100).toFixed(1));
    const fraccion = mixNormalizado / 100;
    margenPonderado += p.margenUnitario * fraccion;
    precioPonderado += p.precioVenta * fraccion;

    const esAltoMargen = p.margenUnitario >= promedioMargenUnitario;
    const esAltaVenta = mixNormalizado >= promedioMixNormalizado;

    let cuadrante = {
      id: 'mina_oro',
      titulo: 'Tus Minas de Oro',
      subtitulo: 'Alto margen • Se vende mucho',
      iconoId: 'mina_oro',
      color: '#D97706',
      bg: '#FFFBEB',
      borde: '#FDE68A',
      consejo: 'No los toques en calidad, asegúrate de no quedarte jamás sin stock.',
      accionTexto: 'Priorizar Stock',
    };

    if (!esAltoMargen && esAltaVenta) {
      cuadrante = {
        id: 'gancho',
        titulo: 'Tus Ganchos',
        subtitulo: 'Bajo margen • Se vende mucho',
        iconoId: 'gancho_comercial',
        color: '#2563EB',
        bg: '#EFF6FF',
        borde: '#BFDBFE',
        consejo: 'Súbeles el precio un 5% hoy o úsalos para vender un complemento caro.',
        accionTexto: 'Subir Precio +5%',
      };
    } else if (esAltoMargen && !esAltaVenta) {
      cuadrante = {
        id: 'joya_oculta',
        titulo: 'Tus Joyas Ocultas',
        subtitulo: 'Alto margen • Se vende poco',
        iconoId: 'joya_oculta',
        color: '#059669',
        bg: '#ECFDF5',
        borde: '#A7F3D0',
        consejo: 'Dales más visibilidad en carta o vitrina; te dejan mucha plata cada vez que salen.',
        accionTexto: 'Destacar Producto',
      };
    } else if (!esAltoMargen && !esAltaVenta) {
      cuadrante = {
        id: 'vampiro',
        titulo: 'Tus Vampiros',
        subtitulo: 'Bajo margen • Se vende poco',
        iconoId: 'vampiro_catalogo',
        color: '#DC2626',
        bg: '#FEF2F2',
        borde: '#FECACA',
        consejo: 'Reformúlalos o elimínalos del catálogo; solo te quitan tiempo e inventario.',
        accionTexto: 'Reajustar Margen +12%',
      };
    }

    return {
      ...p,
      mixNormalizado,
      fraccionMix: fraccion,
      cuadrante,
    };
  });

  const peMultiproductoBaseUnidades =
    margenPonderado > 0 ? Math.ceil(costosFijos / margenPonderado) : 0;
  const peMultiproductoConSueldoUnidades =
    margenPonderado > 0 ? Math.ceil((costosFijos + sueldoObjetivo) / margenPonderado) : 0;

  const productosClasificados = conMix.map((p) => ({
    ...p,
    unidadesEquilibrioBase: Math.ceil(peMultiproductoBaseUnidades * p.fraccionMix),
    unidadesEquilibrioConSueldo: Math.ceil(peMultiproductoConSueldoUnidades * p.fraccionMix),
  }));

  return {
    productosClasificados,
    margenPonderado: Math.round(margenPonderado),
    precioPonderado: Math.round(precioPonderado),
    peMultiproductoBaseUnidades,
    peMultiproductoConSueldoUnidades,
    facturacionEquilibrioConSueldo: Math.round(peMultiproductoConSueldoUnidades * precioPonderado),
  };
}
