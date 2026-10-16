import React, { useState, useMemo } from 'react';
import { useAppState } from '../../store/appState.jsx';
import ImagenJson3D from '../svg3d/ImagenJson3D.jsx';
import {
  calcularDestructorDescuentos,
  calcularEscudoAntiInflacion,
} from '../../core/calculationEngine.js';
import { formatCLP } from '../../utils/formatters.js';

/**
 * Módulo de Simulación Estratégica: Descuentos, Combos y Anti-Inflación
 * Altamente editable y personalizable para la toma de decisiones financieras.
 * Cumple estrictamente con la regla de cero emojis y terminología ejecutiva limpia.
 */
export default function ModuloSimuladorQuePasaSi() {
  const {
    precioVentaConsolidado,
    setPrecioRecetaEnOlla,
    costoVariableConsolidado,
    ventasEstimadasMensuales,
    analisisFugasActivas,
    recetaEnOlla,
    recetas = [],
    insumos = [],
    agregarReceta,
    cargarRecetaEnOlla,
  } = useAppState();

  // Pestaña activa del módulo: 'descuentos' | 'combos' | 'inflacion'
  const [pestañaActiva, setPestañaActiva] = useState('descuentos');

  // --- ESTADOS: SIMULADOR DE DESCUENTOS ---
  const [modoDescuento, setModoDescuento] = useState('porcentaje'); // 'porcentaje' | 'monto'
  const [porcentajeDescuento, setPorcentajeDescuento] = useState(15);
  const [montoDescuentoFijo, setMontoDescuentoFijo] = useState(1500);
  const [motivoPromocion, setMotivoPromocion] = useState('Gancho Comercial');
  const [aumentoVentasEsperado, setAumentoVentasEsperado] = useState(25);

  // --- ESTADOS: CREADOR DE COMBOS & PACKS ---
  const [nombreCombo, setNombreCombo] = useState('Pack Dúo Especial');
  const [productoBaseId, setProductoBaseId] = useState(recetaEnOlla?.id || (recetas[0]?.id ?? ''));
  const [acompananteTipo, setAcompananteTipo] = useState('receta'); // 'receta' | 'insumo'
  const [acompananteId, setAcompananteId] = useState('');
  const [cantidadAcompanante, setCantidadAcompanante] = useState(1);
  const [costoEmpaqueExtra, setCostoEmpaqueExtra] = useState(200);
  const [precioPromocionalCombo, setPrecioPromocionalCombo] = useState('');
  const [mensajeComboGuardado, setMensajeComboGuardado] = useState('');

  // --- ESTADOS: ESCUDO ANTI-INFLACIÓN ---
  const [porcentajeInflacionProveedor, setPorcentajeInflacionProveedor] = useState(12);
  const [mensajePrecioBlindado, setMensajePrecioBlindado] = useState('');

  // Sincronizar producto base si cambia la receta activa
  const productoBaseActual = useMemo(() => {
    return recetas.find((r) => r.id === productoBaseId) || recetaEnOlla || recetas[0] || null;
  }, [recetas, productoBaseId, recetaEnOlla]);

  // Selección inicial de acompañante si no hay uno seleccionado
  const acompananteActual = useMemo(() => {
    if (acompananteTipo === 'receta') {
      const lista = recetas.filter((r) => r.id !== (productoBaseActual?.id || ''));
      if (lista.length === 0) return recetas[0] || null;
      return lista.find((r) => r.id === acompananteId) || lista[0];
    } else {
      if (insumos.length === 0) return null;
      return insumos.find((i) => i.id === acompananteId) || insumos[0];
    }
  }, [acompananteTipo, acompananteId, recetas, insumos, productoBaseActual]);

  // --- CÁLCULOS DEL SIMULADOR DE DESCUENTOS ---
  const precioBaseDescuento = Number(precioVentaConsolidado || 1000);
  const costoDirectoEfectivo = Number(analisisFugasActivas?.costoDirectoEfectivoTotal || costoVariableConsolidado || 0);

  const porcentajeEfectivo = useMemo(() => {
    if (modoDescuento === 'porcentaje') {
      return Math.min(80, Math.max(1, Number(porcentajeDescuento) || 1));
    }
    const monto = Math.max(0, Number(montoDescuentoFijo) || 0);
    return precioBaseDescuento > 0 ? Math.min(80, Math.round((monto / precioBaseDescuento) * 100)) : 10;
  }, [modoDescuento, porcentajeDescuento, montoDescuentoFijo, precioBaseDescuento]);

  const impactoDescuento = useMemo(() => {
    return calcularDestructorDescuentos({
      precioActual: precioBaseDescuento,
      costoDirectoEfectivoTotal: costoDirectoEfectivo,
      porcentajeDescuento: porcentajeEfectivo,
      ventasActuales: ventasEstimadasMensuales,
    });
  }, [precioBaseDescuento, costoDirectoEfectivo, porcentajeEfectivo, ventasEstimadasMensuales]);

  // Proyección de impacto neto con el aumento estimado de ventas por el usuario
  const proyeccionVentasDescuento = useMemo(() => {
    const qActual = Number(ventasEstimadasMensuales || 100);
    const gananciaActualTotal = (impactoDescuento.margenActualUnitario || 0) * qActual;
    const alzaPct = Math.max(0, Number(aumentoVentasEsperado) || 0);
    const qEstimadaConPromo = Math.round(qActual * (1 + alzaPct / 100));
    const gananciaConPromoTotal = (impactoDescuento.margenConDescuento || 0) * qEstimadaConPromo;
    const diferenciaLiquida = gananciaConPromoTotal - gananciaActualTotal;
    const esRentable = diferenciaLiquida >= 0 && !impactoDescuento.entraEnPerdidaDirecta;

    return {
      qActual,
      gananciaActualTotal,
      qEstimadaConPromo,
      gananciaConPromoTotal,
      diferenciaLiquida,
      esRentable,
    };
  }, [impactoDescuento, ventasEstimadasMensuales, aumentoVentasEsperado]);

  // --- CÁLCULOS DEL CREADOR DE COMBOS & PACKS ---
  const calculoCombo = useMemo(() => {
    const costoBase = (productoBaseActual?.ingredientes || []).reduce(
      (acc, ing) => acc + (Number(ing.costoUnitario) || 0) * (Number(ing.cantidad) || 1),
      0
    );
    const precioBase = Number(productoBaseActual?.precioVenta || 1000);

    let costoAcomp = 0;
    let precioAcomp = 0;
    const cantAcomp = Math.max(1, Number(cantidadAcompanante) || 1);

    if (acompananteTipo === 'receta' && acompananteActual) {
      costoAcomp = (acompananteActual.ingredientes || []).reduce(
        (acc, ing) => acc + (Number(ing.costoUnitario) || 0) * (Number(ing.cantidad) || 1),
        0
      ) * cantAcomp;
      precioAcomp = Number(acompananteActual.precioVenta || 1000) * cantAcomp;
    } else if (acompananteTipo === 'insumo' && acompananteActual) {
      costoAcomp = (Number(acompananteActual.costoUnitario) || 0) * cantAcomp;
      precioAcomp = Math.round(costoAcomp * 1.85); // Estimación de valor retail del insumo
    }

    const empaque = Math.max(0, Number(costoEmpaqueExtra) || 0);
    const costoTotalCombo = costoBase + costoAcomp + empaque;
    const precioSumaSeparada = precioBase + precioAcomp;

    // Si el usuario no ha ingresado un precio personalizado, sugerimos 12% de descuento para el cliente
    const precioSugeridoCombo = Math.ceil((precioSumaSeparada * 0.88) / 100) * 100;
    const precioFinalCombo = precioPromocionalCombo !== ''
      ? Math.max(100, Number(precioPromocionalCombo))
      : precioSugeridoCombo;

    const ahorroCliente = Math.max(0, precioSumaSeparada - precioFinalCombo);
    const ahorroClientePct = precioSumaSeparada > 0 ? Math.round((ahorroCliente / precioSumaSeparada) * 100) : 0;

    const tasaFugas = Number(analisisFugasActivas?.tasaFugasSobrePrecio || 0.18);
    const fugasEstimadas = Math.round(precioFinalCombo * tasaFugas);
    const margenLimpioCombo = precioFinalCombo - (costoTotalCombo + fugasEstimadas);
    const margenComboPct = precioFinalCombo > 0 ? Math.round((margenLimpioCombo / precioFinalCombo) * 100) : 0;

    // Comparación con descuento plano de 20% en el producto base
    const precioBaseConDcto20 = Math.round(precioBase * 0.8);
    const fugasBaseDcto = Math.round(precioBaseConDcto20 * tasaFugas);
    const margenBaseConDcto20 = precioBaseConDcto20 - (costoBase + fugasBaseDcto);

    const diferenciaGananciaVsDcto = margenLimpioCombo - margenBaseConDcto20;
    const porcentajeMasGanancia = margenBaseConDcto20 > 0
      ? Math.round((diferenciaGananciaVsDcto / margenBaseConDcto20) * 100)
      : 100;

    return {
      costoBase,
      precioBase,
      costoAcomp,
      precioAcomp,
      empaque,
      costoTotalCombo,
      precioSumaSeparada,
      precioSugeridoCombo,
      precioFinalCombo,
      ahorroCliente,
      ahorroClientePct,
      margenLimpioCombo,
      margenComboPct,
      margenBaseConDcto20,
      diferenciaGananciaVsDcto,
      porcentajeMasGanancia,
    };
  }, [
    productoBaseActual,
    acompananteActual,
    acompananteTipo,
    cantidadAcompanante,
    costoEmpaqueExtra,
    precioPromocionalCombo,
    analisisFugasActivas,
  ]);

  // Manejador para guardar el combo en el catálogo
  const handleGuardarCombo = () => {
    if (!productoBaseActual) return;

    // Consolidar ingredientes del producto base + acompañante + empaque
    const ingredientesBase = productoBaseActual.ingredientes || [];
    let ingredientesCombo = [...ingredientesBase];

    if (acompananteTipo === 'receta' && acompananteActual) {
      const ingredientesAcomp = (acompananteActual.ingredientes || []).map((ing) => ({
        ...ing,
        idAsignado: `ing_combo_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        cantidad: (Number(ing.cantidad) || 1) * (Number(cantidadAcompanante) || 1),
      }));
      ingredientesCombo = [...ingredientesCombo, ...ingredientesAcomp];
    } else if (acompananteTipo === 'insumo' && acompananteActual) {
      ingredientesCombo.push({
        idAsignado: `ing_combo_${Date.now()}`,
        id: acompananteActual.id,
        nombre: acompananteActual.nombre,
        costoUnitario: acompananteActual.costoUnitario,
        cantidad: Number(cantidadAcompanante) || 1,
        unidadMedida: acompananteActual.unidadMedida || 'un',
        tipologia: acompananteActual.tipologia || 'general',
      });
    }

    if (calculoCombo.empaque > 0) {
      ingredientesCombo.push({
        idAsignado: `ing_empaque_${Date.now()}`,
        id: `ins_empaque_${Date.now()}`,
        nombre: 'Packaging & Caja de Combo',
        costoUnitario: calculoCombo.empaque,
        cantidad: 1,
        unidadMedida: 'un',
        tipologia: 'empaque_embalaje',
      });
    }

    const nuevoCombo = {
      id: `receta_combo_${Date.now()}`,
      nombre: nombreCombo.trim() || 'Nuevo Combo Promocional',
      precioVenta: calculoCombo.precioFinalCombo,
      mixPorcentaje: 15,
      figuraProductoId: 'combo_pack',
      esCombo: true,
      ingredientes: ingredientesCombo,
    };

    agregarReceta(nuevoCombo);
    setMensajeComboGuardado(`Combo "${nuevoCombo.nombre}" guardado con éxito en tu catálogo.`);
    setTimeout(() => setMensajeComboGuardado(''), 5000);
  };

  // --- CÁLCULOS DEL ESCUDO ANTI-INFLACIÓN ---
  const impactoInflacion = useMemo(() => {
    return calcularEscudoAntiInflacion({
      precioActual: precioBaseDescuento,
      costoDirectoBase: costoVariableConsolidado,
      porcentajeAlzaProveedor: porcentajeInflacionProveedor,
      ventasMensuales: ventasEstimadasMensuales,
      tasaFugasSobrePrecio: analisisFugasActivas.tasaFugasSobrePrecio,
    });
  }, [
    precioBaseDescuento,
    costoVariableConsolidado,
    porcentajeInflacionProveedor,
    ventasEstimadasMensuales,
    analisisFugasActivas,
  ]);

  const handleBlindarPrecio = () => {
    setPrecioRecetaEnOlla(impactoInflacion.nuevoPrecioProtegido);
    setMensajePrecioBlindado(
      `Precio actualizado a ${formatCLP(impactoInflacion.nuevoPrecioProtegido)} para blindar tu margen.`
    );
    setTimeout(() => setMensajePrecioBlindado(''), 4000);
  };

  return (
    <div
      id="seccion-descuentos"
      className="card-ejecutiva"
      style={{
        padding: '22px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        border: '1.5px solid #CBD5E1',
        boxShadow: '0 4px 16px rgba(15, 23, 42, 0.05)',
      }}
    >
      {/* 1. Cabecera Ejecutiva con Selector de Módulos (Tabs) */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          borderBottom: '1px solid #E2E8F0',
          paddingBottom: '14px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ImagenJson3D idIcono="destructor_descuentos" tamaño={48} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontSize: '10.5px',
                  fontWeight: 800,
                  color: '#DC2626',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  backgroundColor: '#FEF2F2',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  border: '1px solid #FCA5A5',
                }}
              >
                3. Simulador de Decisiones & Políticas Comerciales
              </span>
              <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
                Evaluando: <strong style={{ color: '#0F172A' }}>{productoBaseActual?.nombre || 'Producto Principal'}</strong>
              </span>
            </div>
            <h2 className="heading-tight" style={{ fontSize: '18px', fontWeight: 800, color: '#09090B', margin: '4px 0 0 0' }}>
              Simulador & Editor de Descuentos, Combos y Alzas de Costos
            </h2>
          </div>
        </div>

        {/* Pestañas de Navegación Ejecutiva */}
        <div style={{ display: 'flex', gap: '6px', backgroundColor: '#F1F5F9', padding: '4px', borderRadius: '10px' }}>
          <button
            type="button"
            onClick={() => setPestañaActiva('descuentos')}
            style={{
              padding: '6px 14px',
              borderRadius: '7px',
              fontSize: '11.5px',
              fontWeight: pestañaActiva === 'descuentos' ? 700 : 500,
              backgroundColor: pestañaActiva === 'descuentos' ? '#FFFFFF' : 'transparent',
              color: pestañaActiva === 'descuentos' ? '#DC2626' : '#64748B',
              border: pestañaActiva === 'descuentos' ? '1px solid #E2E8F0' : 'none',
              boxShadow: pestañaActiva === 'descuentos' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            1. Simulador de Descuentos
          </button>

          <button
            type="button"
            onClick={() => setPestañaActiva('combos')}
            style={{
              padding: '6px 14px',
              borderRadius: '7px',
              fontSize: '11.5px',
              fontWeight: pestañaActiva === 'combos' ? 700 : 500,
              backgroundColor: pestañaActiva === 'combos' ? '#FFFFFF' : 'transparent',
              color: pestañaActiva === 'combos' ? '#0F766E' : '#64748B',
              border: pestañaActiva === 'combos' ? '1px solid #E2E8F0' : 'none',
              boxShadow: pestañaActiva === 'combos' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            2. Creador de Combos (Alternativa Rentable)
          </button>

          <button
            type="button"
            onClick={() => setPestañaActiva('inflacion')}
            style={{
              padding: '6px 14px',
              borderRadius: '7px',
              fontSize: '11.5px',
              fontWeight: pestañaActiva === 'inflacion' ? 700 : 500,
              backgroundColor: pestañaActiva === 'inflacion' ? '#FFFFFF' : 'transparent',
              color: pestañaActiva === 'inflacion' ? '#D97706' : '#64748B',
              border: pestañaActiva === 'inflacion' ? '1px solid #E2E8F0' : 'none',
              boxShadow: pestañaActiva === 'inflacion' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            3. Escudo Anti-Inflación
          </button>
        </div>
      </div>

      {/* --- SECCIÓN 1: SIMULADOR & EDITOR DE DESCUENTOS --- */}
      {pestañaActiva === 'descuentos' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Panel de Controles Editables del Descuento */}
          <div
            style={{
              backgroundColor: '#F8FAFC',
              borderRadius: '12px',
              border: '1.5px solid #CBD5E1',
              padding: '16px 18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                  Configuración de la Oferta Promocional
                </span>
                <div style={{ fontSize: '13px', color: '#0F172A', fontWeight: 600, marginTop: '2px' }}>
                  Precio Actual: <strong>{formatCLP(precioBaseDescuento)}</strong> • Costo Directo Total: <strong>{formatCLP(costoDirectoEfectivo)}</strong>
                </div>
              </div>

              {/* Selector de Modo: Porcentaje vs Monto Fijo */}
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Tipo:</span>
                <button
                  type="button"
                  onClick={() => setModoDescuento('porcentaje')}
                  className={modoDescuento === 'porcentaje' ? 'btn-bacan-primary' : 'btn-bacan-secondary'}
                  style={{ height: '28px', padding: '0 10px', fontSize: '11px' }}
                >
                  Porcentaje (%)
                </button>
                <button
                  type="button"
                  onClick={() => setModoDescuento('monto')}
                  className={modoDescuento === 'monto' ? 'btn-bacan-primary' : 'btn-bacan-secondary'}
                  style={{ height: '28px', padding: '0 10px', fontSize: '11px' }}
                >
                  Monto Fijo ($ CLP)
                </button>
              </div>
            </div>

            {/* Fila de Edición Numérica Libre + Presets */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              {modoDescuento === 'porcentaje' ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <label htmlFor="input-pct-dcto" style={{ fontSize: '12.5px', fontWeight: 700, color: '#0F172A' }}>
                    Descuento a aplicar:
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <input
                      id="input-pct-dcto"
                      type="number"
                      min="1"
                      max="75"
                      step="1"
                      value={porcentajeDescuento}
                      onChange={(e) => setPorcentajeDescuento(Number(e.target.value))}
                      style={{
                        width: '70px',
                        height: '34px',
                        padding: '0 8px',
                        borderRadius: '8px',
                        border: '1.5px solid #CBD5E1',
                        fontSize: '15px',
                        fontWeight: 700,
                        textAlign: 'center',
                        color: '#DC2626',
                        backgroundColor: '#FFFFFF',
                      }}
                    />
                    <span style={{ fontSize: '14px', fontWeight: 800, color: '#DC2626' }}>%</span>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <label htmlFor="input-monto-dcto" style={{ fontSize: '12.5px', fontWeight: 700, color: '#0F172A' }}>
                    Rebaja directa por unidad:
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#64748B' }}>$</span>
                    <input
                      id="input-monto-dcto"
                      type="number"
                      min="100"
                      max={precioBaseDescuento}
                      step="100"
                      value={montoDescuentoFijo}
                      onChange={(e) => setMontoDescuentoFijo(Number(e.target.value))}
                      style={{
                        width: '110px',
                        height: '34px',
                        padding: '0 8px',
                        borderRadius: '8px',
                        border: '1.5px solid #CBD5E1',
                        fontSize: '15px',
                        fontWeight: 700,
                        textAlign: 'right',
                        color: '#DC2626',
                        backgroundColor: '#FFFFFF',
                      }}
                    />
                    <span style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 600 }}>
                      (Equivale al {porcentajeEfectivo}%)
                    </span>
                  </div>
                </div>
              )}

              {/* Botones de Descuentos Rápidos y Clásicos */}
              <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Atajos:</span>
                {[
                  { label: '5%', valPct: 5, valMonto: Math.round(precioBaseDescuento * 0.05) },
                  { label: '10%', valPct: 10, valMonto: Math.round(precioBaseDescuento * 0.1) },
                  { label: '15%', valPct: 15, valMonto: Math.round(precioBaseDescuento * 0.15) },
                  { label: '20%', valPct: 20, valMonto: Math.round(precioBaseDescuento * 0.2) },
                  { label: '25%', valPct: 25, valMonto: Math.round(precioBaseDescuento * 0.25) },
                  { label: '2x1 (50%)', valPct: 50, valMonto: Math.round(precioBaseDescuento * 0.5) },
                  { label: '3x2 (33%)', valPct: 33, valMonto: Math.round(precioBaseDescuento * 0.33) },
                ].map((btn) => (
                  <button
                    key={btn.label}
                    type="button"
                    onClick={() => {
                      if (modoDescuento === 'porcentaje') {
                        setPorcentajeDescuento(btn.valPct);
                      } else {
                        setMontoDescuentoFijo(btn.valMonto);
                      }
                    }}
                    className={
                      (modoDescuento === 'porcentaje' && porcentajeDescuento === btn.valPct) ||
                      (modoDescuento === 'monto' && montoDescuentoFijo === btn.valMonto)
                        ? 'btn-bacan-primary'
                        : 'btn-bacan-secondary'
                    }
                    style={{ height: '28px', padding: '0 8px', fontSize: '11px' }}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Slider de Descuento */}
            <input
              type="range"
              className="slider-ingenieria"
              min="5"
              max="50"
              step="1"
              value={porcentajeEfectivo}
              onChange={(e) => {
                const val = Number(e.target.value);
                setPorcentajeDescuento(val);
                setMontoDescuentoFijo(Math.round(precioBaseDescuento * (val / 100)));
              }}
            />

            {/* Fila de Resumen de Precios */}
            <div className="tabular-nums" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#475569', fontWeight: 600, flexWrap: 'wrap', gap: '8px' }}>
              <span>Precio Normal: <strong>{formatCLP(impactoDescuento.precioOriginal)}</strong></span>
              <span>Rebaja por unidad: <strong style={{ color: '#DC2626' }}>-{formatCLP(impactoDescuento.precioOriginal - impactoDescuento.nuevoPrecioConDescuento)}</strong></span>
              <span>Precio con Descuento: <strong style={{ color: '#DC2626', fontSize: '14px' }}>{formatCLP(impactoDescuento.nuevoPrecioConDescuento)}</strong></span>
            </div>

            {/* Motivo / Estrategia de la Promoción */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', borderTop: '1px solid #E2E8F0', paddingTop: '10px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                Objetivo de la Promo:
              </span>
              {['Gancho Comercial', 'Liquidación de Stock', 'Fidelización Clientes', 'Temporada Baja'].map((motivo) => (
                <button
                  key={motivo}
                  type="button"
                  onClick={() => setMotivoPromocion(motivo)}
                  style={{
                    padding: '3px 9px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: motivoPromocion === motivo ? 700 : 500,
                    backgroundColor: motivoPromocion === motivo ? '#0F766E' : '#FFFFFF',
                    color: motivoPromocion === motivo ? '#FFFFFF' : '#475569',
                    border: `1px solid ${motivoPromocion === motivo ? '#0F766E' : '#CBD5E1'}`,
                    cursor: 'pointer',
                  }}
                >
                  {motivo}
                </button>
              ))}
            </div>
          </div>

          {/* Golpe de Realidad Financiera en Tiempo Real */}
          {impactoDescuento.entraEnPerdidaDirecta ? (
            <div
              style={{
                backgroundColor: '#FEF2F2',
                border: '2px solid #DC2626',
                borderRadius: '12px',
                padding: '16px 18px',
                color: '#7F1D1D',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', color: '#DC2626' }}>
                  Alerta Crítica • Aniquilación Total del Margen Directo
                </span>
                <span style={{ fontSize: '11px', fontWeight: 800, backgroundColor: '#DC2626', color: '#FFFFFF', padding: '2px 8px', borderRadius: '4px' }}>
                  Pérdida por Unidad
                </span>
              </div>
              <p style={{ fontSize: '13.5px', lineHeight: 1.5, margin: 0, fontWeight: 600 }}>
                Si bajas tu precio a <strong>{formatCLP(impactoDescuento.nuevoPrecioConDescuento)}</strong>, quedas por debajo de tus costos directos efectivos ({formatCLP(costoDirectoEfectivo)}).{' '}
                <strong>Pierdes {formatCLP(Math.abs(impactoDescuento.margenConDescuento))} de tu bolsillo en cada producto vendido.</strong> Entre más vendas, más dinero destruyes.
              </p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                <button
                  type="button"
                  onClick={() => setPestañaActiva('combos')}
                  className="btn-bacan-primary"
                  style={{ height: '32px', padding: '0 14px', fontSize: '11.5px' }}
                >
                  Armar un Combo en su Lugar (Protege tu Margen)
                </button>
              </div>
            </div>
          ) : (
            <div
              style={{
                backgroundColor: '#FFFBEB',
                border: '1.5px solid #F59E0B',
                borderRadius: '12px',
                padding: '16px 18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontSize: '11.5px', fontWeight: 800, textTransform: 'uppercase', color: '#B45309' }}>
                  El Golpe de Realidad Financiera ({motivoPromocion})
                </span>
                <span
                  className="tabular-nums"
                  style={{
                    backgroundColor: '#DC2626',
                    color: '#FFFFFF',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '11.5px',
                    fontWeight: 800,
                  }}
                >
                  Exige +{impactoDescuento.porcentajeEsfuerzoExtra}% más ventas para empatar
                </span>
              </div>

              <p style={{ fontSize: '13.5px', lineHeight: 1.55, margin: 0, color: '#09090B' }}>
                Al bajar el precio un <strong className="tabular-nums">{porcentajeEfectivo}%</strong>, tu ganancia limpia por unidad cae de{' '}
                <strong className="tabular-nums" style={{ color: '#059669' }}>{formatCLP(impactoDescuento.margenActualUnitario)}</strong> a{' '}
                <strong className="tabular-nums" style={{ color: '#DC2626' }}>{formatCLP(impactoDescuento.margenConDescuento)}</strong>.{' '}
                Tendrás que vender{' '}
                <strong>{impactoDescuento.unidadesNecesariasParaEmpatar} unidades</strong> (+{impactoDescuento.unidadesExtraRequeridas} unidades extras al mes){' '}
                <strong>solo para ganar exactamente lo mismo que ganas hoy</strong>.
              </p>

              {/* Simulador Interactivo: ¿Cuánto crees que van a subir tus ventas? */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '10px',
                  border: '1px solid #FCD34D',
                  padding: '12px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#78350F' }}>
                    Si estimas que tus ventas subirán un <strong className="tabular-nums" style={{ color: '#0F766E' }}>+{aumentoVentasEsperado}%</strong> gracias a la promoción:
                  </span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[10, 20, 25, 40, 60].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => setAumentoVentasEsperado(pct)}
                        style={{
                          height: '24px',
                          padding: '0 6px',
                          fontSize: '10.5px',
                          fontWeight: aumentoVentasEsperado === pct ? 700 : 500,
                          backgroundColor: aumentoVentasEsperado === pct ? '#0F766E' : '#F8FAFC',
                          color: aumentoVentasEsperado === pct ? '#FFFFFF' : '#475569',
                          border: `1px solid ${aumentoVentasEsperado === pct ? '#0F766E' : '#CBD5E1'}`,
                          borderRadius: '5px',
                          cursor: 'pointer',
                        }}
                      >
                        +{pct}%
                      </button>
                    ))}
                  </div>
                </div>

                <div className="tabular-nums" style={{ fontSize: '12.5px', color: '#09090B' }}>
                  {proyeccionVentasDescuento.esRentable ? (
                    <span style={{ color: '#059669', fontWeight: 600 }}>
                      Resultado positivo: Ganarías {formatCLP(proyeccionVentasDescuento.diferenciaLiquida)} extra al mes al vender {proyeccionVentasDescuento.qEstimadaConPromo} un.
                    </span>
                  ) : (
                    <span style={{ color: '#DC2626', fontWeight: 600 }}>
                      Trampa comercial: Aun vendiendo un +{aumentoVentasEsperado}% más ({proyeccionVentasDescuento.qEstimadaConPromo} un.), ganarás {formatCLP(Math.abs(proyeccionVentasDescuento.diferenciaLiquida))} MENOS a fin de mes que quedándote a precio normal.
                    </span>
                  )}
                </div>
              </div>

              {/* Botón de Enlace al Creador de Combos */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', borderTop: '1px solid #FCD34D', paddingTop: '8px' }}>
                <span style={{ fontSize: '11.5px', color: '#78350F', fontWeight: 600 }}>
                  Consejo financiero: El combo incrementa el ticket y protege tu margen líquido.
                </span>
                <button
                  type="button"
                  onClick={() => setPestañaActiva('combos')}
                  className="btn-bacan-primary"
                  style={{ height: '32px', padding: '0 12px', fontSize: '11.5px' }}
                >
                  Ir al Creador de Combos & Packs
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- SECCIÓN 2: CREADOR & EDITOR DE COMBOS & PACKS INTELIGENTES --- */}
      {pestañaActiva === 'combos' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {mensajeComboGuardado && (
            <div
              style={{
                backgroundColor: '#ECFDF5',
                border: '1.5px solid #6EE7B7',
                borderRadius: '10px',
                padding: '12px 16px',
                color: '#065F46',
                fontWeight: 700,
                fontSize: '13px',
              }}
            >
              {mensajeComboGuardado}
            </div>
          )}

          {/* Formulario de Configuración del Combo */}
          <div
            style={{
              backgroundColor: '#F8FAFC',
              borderRadius: '12px',
              border: '1.5px solid #CBD5E1',
              padding: '16px 18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#0F766E', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Diseño del Pack / Combo Rentable
              </span>
              <span style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 600 }}>
                Eleva el ticket promedio sin destruir el margen de contribución
              </span>
            </div>

            {/* Nombre del Combo */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label htmlFor="input-nombre-combo" style={{ fontSize: '11.5px', fontWeight: 700, color: '#334155', textTransform: 'uppercase' }}>
                Nombre del Combo / Pack Comercial:
              </label>
              <input
                id="input-nombre-combo"
                type="text"
                value={nombreCombo}
                onChange={(e) => setNombreCombo(e.target.value)}
                placeholder="Ej: Pack Degustación Premium, Combo Dúo Almuerzo"
                style={{
                  height: '36px',
                  padding: '0 12px',
                  borderRadius: '8px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  color: '#0F172A',
                  backgroundColor: '#FFFFFF',
                }}
              />
            </div>

            {/* Selección de Producto Base y Acompañante */}
            <div className="bento-grid-12" style={{ gap: '12px', alignItems: 'stretch' }}>
              {/* Producto Base */}
              <div className="bento-col-6" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label htmlFor="select-prod-base" style={{ fontSize: '11px', fontWeight: 700, color: '#334155', textTransform: 'uppercase' }}>
                  1. Producto Principal (Base):
                </label>
                <select
                  id="select-prod-base"
                  value={productoBaseActual?.id || ''}
                  onChange={(e) => setProductoBaseId(e.target.value)}
                  style={{
                    height: '36px',
                    padding: '0 10px',
                    borderRadius: '8px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    color: '#0F172A',
                    backgroundColor: '#FFFFFF',
                  }}
                >
                  {recetas.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.nombre} (Normal: {formatCLP(r.precioVenta)})
                    </option>
                  ))}
                </select>
                <div style={{ fontSize: '11.5px', color: '#64748B' }}>
                  Costo directo base: <strong>{formatCLP(calculoCombo.costoBase)}</strong>
                </div>
              </div>

              {/* Acompañante o Complemento */}
              <div className="bento-col-6" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label htmlFor="select-acomp" style={{ fontSize: '11px', fontWeight: 700, color: '#334155', textTransform: 'uppercase' }}>
                    2. Acompañante o Complemento:
                  </label>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      type="button"
                      onClick={() => setAcompananteTipo('receta')}
                      style={{
                        padding: '1px 6px',
                        fontSize: '10px',
                        borderRadius: '4px',
                        fontWeight: acompananteTipo === 'receta' ? 700 : 500,
                        backgroundColor: acompananteTipo === 'receta' ? '#0F766E' : '#E2E8F0',
                        color: acompananteTipo === 'receta' ? '#FFFFFF' : '#475569',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      Producto
                    </button>
                    <button
                      type="button"
                      onClick={() => setAcompananteTipo('insumo')}
                      style={{
                        padding: '1px 6px',
                        fontSize: '10px',
                        borderRadius: '4px',
                        fontWeight: acompananteTipo === 'insumo' ? 700 : 500,
                        backgroundColor: acompananteTipo === 'insumo' ? '#0F766E' : '#E2E8F0',
                        color: acompananteTipo === 'insumo' ? '#FFFFFF' : '#475569',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      Insumo / Extra
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <select
                    id="select-acomp"
                    value={acompananteActual?.id || ''}
                    onChange={(e) => setAcompananteId(e.target.value)}
                    style={{
                      flex: 1,
                      height: '36px',
                      padding: '0 8px',
                      borderRadius: '8px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      color: '#0F172A',
                      backgroundColor: '#FFFFFF',
                    }}
                  >
                    {acompananteTipo === 'receta'
                      ? recetas
                          .filter((r) => r.id !== (productoBaseActual?.id || ''))
                          .map((r) => (
                            <option key={r.id} value={r.id}>
                              {r.nombre} (Normal: {formatCLP(r.precioVenta)})
                            </option>
                          ))
                      : insumos.map((i) => (
                          <option key={i.id} value={i.id}>
                            {i.nombre} (Costo: {formatCLP(i.costoUnitario)})
                          </option>
                        ))}
                  </select>

                  <input
                    type="number"
                    min="1"
                    max="10"
                    title="Cantidad de unidades del acompañante"
                    value={cantidadAcompanante}
                    onChange={(e) => setCantidadAcompanante(Math.max(1, Number(e.target.value)))}
                    style={{
                      width: '52px',
                      height: '36px',
                      padding: '0 4px',
                      borderRadius: '8px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '13px',
                      fontWeight: 700,
                      textAlign: 'center',
                      color: '#0F172A',
                      backgroundColor: '#FFFFFF',
                    }}
                  />
                </div>

                <div style={{ fontSize: '11.5px', color: '#64748B' }}>
                  Costo acompañante: <strong>{formatCLP(calculoCombo.costoAcomp)}</strong>
                </div>
              </div>
            </div>

            {/* Fila de Empaque y Fijación de Precio Promocional del Combo */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
                borderTop: '1px solid #E2E8F0',
                paddingTop: '12px',
              }}
            >
              {/* Empaque Extra */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label htmlFor="input-empaque" style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>
                  Packaging / Caja Combo:
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 600 }}>$</span>
                  <input
                    id="input-empaque"
                    type="number"
                    min="0"
                    step="50"
                    value={costoEmpaqueExtra}
                    onChange={(e) => setCostoEmpaqueExtra(Number(e.target.value))}
                    style={{
                      width: '75px',
                      height: '32px',
                      padding: '0 6px',
                      borderRadius: '6px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '13px',
                      fontWeight: 600,
                      textAlign: 'right',
                      backgroundColor: '#FFFFFF',
                    }}
                  />
                </div>
              </div>

              {/* Fijación Libre del Precio Promocional del Combo */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#0F172A' }}>
                  Precio Final del Combo:
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#0F766E' }}>$</span>
                  <input
                    type="number"
                    min="1000"
                    step="100"
                    placeholder={String(calculoCombo.precioSugeridoCombo)}
                    value={precioPromocionalCombo}
                    onChange={(e) => setPrecioPromocionalCombo(e.target.value)}
                    style={{
                      width: '110px',
                      height: '36px',
                      padding: '0 8px',
                      borderRadius: '8px',
                      border: '2px solid #0F766E',
                      fontSize: '16px',
                      fontWeight: 800,
                      textAlign: 'right',
                      color: '#0F766E',
                      backgroundColor: '#FFFFFF',
                    }}
                  />
                </div>

                {/* Botón Restaurar Precio Sugerido */}
                <button
                  type="button"
                  onClick={() => setPrecioPromocionalCombo('')}
                  className="btn-bacan-secondary"
                  title="Calcular precio sugerido con 12% de descuento para el cliente"
                  style={{ height: '28px', padding: '0 8px', fontSize: '11px' }}
                >
                  Sugerido ({formatCLP(calculoCombo.precioSugeridoCombo)})
                </button>
              </div>
            </div>
          </div>

          {/* Tarjeta de Comparación Financiera: Combo vs Descuento Plano */}
          <div
            style={{
              backgroundColor: '#F0FDFA',
              border: '2px solid #0D9488',
              borderRadius: '12px',
              padding: '16px 18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', color: '#0F766E' }}>
                Evaluación de Rentabilidad del Combo vs Descuento Plano
              </span>
              <span
                className="tabular-nums"
                style={{
                  backgroundColor: '#0F766E',
                  color: '#FFFFFF',
                  padding: '3px 10px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 800,
                }}
              >
                Ganas +{calculoCombo.porcentajeMasGanancia}% más dinero que con descuento directo
              </span>
            </div>

            <div className="bento-grid-12" style={{ gap: '12px', alignItems: 'stretch' }}>
              <div
                className="bento-col-6"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  border: '1px solid #CCFBF1',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                  Lo que ve tu cliente:
                </span>
                <div style={{ fontSize: '13.5px', color: '#09090B' }}>
                  Suma por separado: <span style={{ textDecoration: 'line-through', color: '#94A3B8' }}>{formatCLP(calculoCombo.precioSumaSeparada)}</span>
                </div>
                <div style={{ fontSize: '14.5px', fontWeight: 800, color: '#0F766E' }}>
                  Paga solo {formatCLP(calculoCombo.precioFinalCombo)} (Ahorra {formatCLP(calculoCombo.ahorroCliente)} / -{calculoCombo.ahorroClientePct}%)
                </div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>
                  Sensación de oferta atractiva sin que tengas que abaratar tu producto estrella.
                </div>
              </div>

              <div
                className="bento-col-6"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  border: '1px solid #CCFBF1',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                  Lo que entra a tu bolsillo:
                </span>
                <div style={{ fontSize: '13.5px', color: '#09090B' }}>
                  Costo insumos total combo: <strong>{formatCLP(calculoCombo.costoTotalCombo)}</strong>
                </div>
                <div style={{ fontSize: '14.5px', fontWeight: 800, color: '#059669' }}>
                  Ganancia neta/combo: {formatCLP(calculoCombo.margenLimpioCombo)} ({calculoCombo.margenComboPct}% margen)
                </div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>
                  Frente a ganar solo {formatCLP(calculoCombo.margenBaseConDcto20)} con un descuento directo del 20%.
                </div>
              </div>
            </div>

            {/* Botón de Acción para Guardar en el Catálogo */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
              <button
                type="button"
                onClick={handleGuardarCombo}
                className="btn-bacan-primary"
                style={{ height: '38px', padding: '0 18px', fontSize: '13px' }}
              >
                Guardar este Combo en mi Catálogo de Productos
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- SECCIÓN 3: ESCUDO ANTI-INFLACIÓN EN EL BOLSILLO --- */}
      {pestañaActiva === 'inflacion' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {mensajePrecioBlindado && (
            <div
              style={{
                backgroundColor: '#ECFDF5',
                border: '1.5px solid #6EE7B7',
                borderRadius: '10px',
                padding: '12px 16px',
                color: '#065F46',
                fontWeight: 700,
                fontSize: '13px',
              }}
            >
              {mensajePrecioBlindado}
            </div>
          )}

          {/* Control Deslizante de Alza de Proveedor */}
          <div
            style={{
              backgroundColor: '#F8FAFC',
              borderRadius: '12px',
              border: '1.5px solid #CBD5E1',
              padding: '16px 18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#0F172A' }}>
                  Subida de costos del proveedor:
                </span>
                <input
                  type="number"
                  min="1"
                  max="50"
                  step="1"
                  value={porcentajeInflacionProveedor}
                  onChange={(e) => setPorcentajeInflacionProveedor(Number(e.target.value))}
                  style={{
                    width: '65px',
                    height: '32px',
                    padding: '0 6px',
                    borderRadius: '6px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '14px',
                    fontWeight: 700,
                    textAlign: 'center',
                    color: '#D97706',
                    backgroundColor: '#FFFFFF',
                  }}
                />
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#D97706' }}>%</span>
              </div>

              {/* Botones de Alza Rápida */}
              <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                {[5, 8, 10, 12, 15, 20, 25].map((alza) => (
                  <button
                    key={alza}
                    type="button"
                    onClick={() => setPorcentajeInflacionProveedor(alza)}
                    className={porcentajeInflacionProveedor === alza ? 'btn-bacan-primary' : 'btn-bacan-secondary'}
                    style={{ height: '28px', padding: '0 9px', fontSize: '11px' }}
                  >
                    +{alza}%
                  </button>
                ))}
              </div>
            </div>

            <input
              type="range"
              className="slider-ingenieria"
              min="2"
              max="35"
              step="1"
              value={porcentajeInflacionProveedor}
              onChange={(e) => setPorcentajeInflacionProveedor(Number(e.target.value))}
            />

            <div className="tabular-nums" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: '#475569', fontWeight: 600, flexWrap: 'wrap', gap: '6px' }}>
              <span>Costo Insumos Actual: <strong>{formatCLP(costoVariableConsolidado)}</strong></span>
              <span>
                Nuevo Costo Directo: <strong style={{ color: '#DC2626' }}>{formatCLP(impactoInflacion.nuevoCostoDirectoBase)} (+{formatCLP(impactoInflacion.alzaCostoUnitario)})</strong>
              </span>
            </div>
          </div>

          {/* Dictamen Instantáneo de Bolsillo */}
          <div
            style={{
              backgroundColor: '#09090B',
              color: '#FFFFFF',
              borderRadius: '12px',
              padding: '18px 20px',
              border: '1.5px solid #27272A',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div>
              <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#FEF08A', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Respuesta Instantánea para Compras en Terreno
              </span>
              <p style={{ fontSize: '14px', lineHeight: 1.5, margin: '6px 0 0 0' }}>
                Si tus insumos suben un <strong className="tabular-nums">{porcentajeInflacionProveedor}%</strong>,{' '}
                <strong style={{ color: '#5EEAD4', fontSize: '15px' }}>
                  sube tu precio {formatCLP(impactoInflacion.ajustePrecioNecesario)} hoy
                </strong>{' '}
                (a <strong className="tabular-nums">{formatCLP(impactoInflacion.nuevoPrecioProtegido)}</strong>) o{' '}
                <strong style={{ color: '#F87171' }}>
                  perderás {formatCLP(impactoInflacion.perdidaMensualProyectada)} a fin de mes
                </strong>{' '}
                ({formatCLP(impactoInflacion.perdidaAnualProyectada)} al año).
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', borderTop: '1px solid #27272A', paddingTop: '12px' }}>
              <span className="tabular-nums" style={{ fontSize: '12px', color: '#A1A1AA' }}>
                Precio Blindado Sugerido: <strong style={{ color: '#FFFFFF', fontSize: '14px' }}>{formatCLP(impactoInflacion.nuevoPrecioProtegido)}</strong>
              </span>
              <button
                type="button"
                onClick={handleBlindarPrecio}
                className="btn-bacan-primary"
                style={{ height: '36px', padding: '0 16px', fontSize: '12.5px' }}
              >
                Blindar mi Precio (+{formatCLP(impactoInflacion.ajustePrecioNecesario)} Ahora)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
