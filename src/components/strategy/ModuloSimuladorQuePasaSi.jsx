import React, { useState, useMemo } from 'react';
import { useAppState } from '../../store/appState.jsx';
import {
  Icono3DDescuento,
  Icono3DMargen,
  Icono3DInflacion,
  Icono3DEbit,
  Icono3DCentroEstrategico,
} from '../icons3d/SistemaIconografia3D.jsx';
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
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '22px',
        backgroundColor: '#0D131F',
        border: '1px solid #1E293B',
        boxShadow: '0 12px 30px -10px rgba(0, 0, 0, 0.7)',
        borderRadius: '16px',
      }}
    >
      {/* 1. Cabecera Ejecutiva con Selector de Módulos (Tabs) */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
          borderBottom: '1px solid #1E293B',
          paddingBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Icono3DDescuento size={46} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontSize: '10.5px',
                  fontWeight: 800,
                  color: '#EF4444',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  backgroundColor: 'rgba(239, 68, 68, 0.12)',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                }}
              >
                3. Simulador de Decisiones & Políticas Comerciales
              </span>
              <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>
                Evaluando: <strong style={{ color: '#E2F800' }}>{productoBaseActual?.nombre || 'Producto Principal'}</strong>
              </span>
            </div>
            <h2 className="heading-tight" style={{ fontSize: '18px', fontWeight: 800, color: '#F8FAFC', margin: '4px 0 0 0' }}>
              Simulador & Editor de Descuentos, Combos y Alzas de Costos
            </h2>
          </div>
        </div>

        {/* Pestañas de Navegación Ejecutiva ImpactM5 */}
        <div style={{ display: 'flex', gap: '6px', backgroundColor: '#111827', padding: '4px', borderRadius: '10px', border: '1px solid #1E293B' }}>
          <button
            type="button"
            onClick={() => setPestañaActiva('descuentos')}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: pestañaActiva === 'descuentos' ? 800 : 600,
              backgroundColor: pestañaActiva === 'descuentos' ? '#1E293B' : 'transparent',
              color: pestañaActiva === 'descuentos' ? '#EF4444' : '#94A3B8',
              border: pestañaActiva === 'descuentos' ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid transparent',
              boxShadow: pestañaActiva === 'descuentos' ? '0 2px 8px rgba(0,0,0,0.4)' : 'none',
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
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: pestañaActiva === 'combos' ? 800 : 600,
              backgroundColor: pestañaActiva === 'combos' ? '#1E293B' : 'transparent',
              color: pestañaActiva === 'combos' ? '#10B981' : '#94A3B8',
              border: pestañaActiva === 'combos' ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid transparent',
              boxShadow: pestañaActiva === 'combos' ? '0 2px 8px rgba(0,0,0,0.4)' : 'none',
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
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: pestañaActiva === 'inflacion' ? 800 : 600,
              backgroundColor: pestañaActiva === 'inflacion' ? '#1E293B' : 'transparent',
              color: pestañaActiva === 'inflacion' ? '#F59E0B' : '#94A3B8',
              border: pestañaActiva === 'inflacion' ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid transparent',
              boxShadow: pestañaActiva === 'inflacion' ? '0 2px 8px rgba(0,0,0,0.4)' : 'none',
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
              backgroundColor: '#0B0F17',
              borderRadius: '12px',
              border: '1px solid #1E293B',
              padding: '18px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#E2F800', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Configuración de la Oferta Promocional
                </span>
                <div style={{ fontSize: '13.5px', color: '#F8FAFC', fontWeight: 600, marginTop: '3px' }}>
                  Precio Actual: <strong style={{ color: '#FFFFFF' }}>{formatCLP(precioBaseDescuento)}</strong> • Costo Directo Total: <strong style={{ color: '#F87171' }}>{formatCLP(costoDirectoEfectivo)}</strong>
                </div>
              </div>

              {/* Selector de Modo: Porcentaje vs Monto Fijo */}
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>Tipo:</span>
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
                  <label htmlFor="input-pct-dcto" style={{ fontSize: '12.5px', fontWeight: 700, color: '#F8FAFC' }}>
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
                        border: '1px solid #1E293B',
                        fontSize: '15px',
                        fontWeight: 700,
                        textAlign: 'center',
                        color: '#EF4444',
                        backgroundColor: '#111827',
                      }}
                    />
                    <span style={{ fontSize: '14px', fontWeight: 800, color: '#EF4444' }}>%</span>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <label htmlFor="input-monto-dcto" style={{ fontSize: '12.5px', fontWeight: 700, color: '#F8FAFC' }}>
                    Rebaja directa por unidad:
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#94A3B8' }}>$</span>
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
                        border: '1px solid #1E293B',
                        fontSize: '15px',
                        fontWeight: 700,
                        textAlign: 'right',
                        color: '#EF4444',
                        backgroundColor: '#111827',
                      }}
                    />
                    <span style={{ fontSize: '11.5px', color: '#94A3B8', fontWeight: 600 }}>
                      (Equivale al {porcentajeEfectivo}%)
                    </span>
                  </div>
                </div>
              )}

              {/* Botones de Descuentos Rápidos y Clásicos */}
              <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>Atajos:</span>
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
            <div className="tabular-nums" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94A3B8', fontWeight: 600, flexWrap: 'wrap', gap: '8px' }}>
              <span>Precio Normal: <strong style={{ color: '#F8FAFC' }}>{formatCLP(impactoDescuento.precioOriginal)}</strong></span>
              <span>Rebaja por unidad: <strong style={{ color: '#EF4444' }}>-{formatCLP(impactoDescuento.precioOriginal - impactoDescuento.nuevoPrecioConDescuento)}</strong></span>
              <span>Precio con Descuento: <strong style={{ color: '#E2F800', fontSize: '14.5px' }}>{formatCLP(impactoDescuento.nuevoPrecioConDescuento)}</strong></span>
            </div>

            {/* Motivo / Estrategia de la Promoción */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', borderTop: '1px solid #1E293B', paddingTop: '12px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>
                Objetivo de la Promo:
              </span>
              {['Gancho Comercial', 'Liquidación de Stock', 'Fidelización Clientes', 'Temporada Baja'].map((motivo) => (
                <button
                  key={motivo}
                  type="button"
                  onClick={() => setMotivoPromocion(motivo)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: motivoPromocion === motivo ? 800 : 600,
                    backgroundColor: motivoPromocion === motivo ? '#1E293B' : '#0B0F17',
                    color: motivoPromocion === motivo ? '#E2F800' : '#94A3B8',
                    border: `1px solid ${motivoPromocion === motivo ? '#E2F800' : '#1E293B'}`,
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
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                border: '1.5px solid rgba(239, 68, 68, 0.5)',
                borderRadius: '12px',
                padding: '16px 18px',
                color: '#FCA5A5',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', color: '#EF4444' }}>
                  Alerta Crítica • Aniquilación Total del Margen Directo
                </span>
                <span style={{ fontSize: '11px', fontWeight: 800, backgroundColor: '#EF4444', color: '#FFFFFF', padding: '2px 8px', borderRadius: '4px' }}>
                  Pérdida por Unidad
                </span>
              </div>
              <p style={{ fontSize: '13.5px', lineHeight: 1.5, margin: 0, fontWeight: 600 }}>
                Si bajas tu precio a <strong style={{ color: '#FFFFFF' }}>{formatCLP(impactoDescuento.nuevoPrecioConDescuento)}</strong>, quedas por debajo de tus costos directos efectivos ({formatCLP(costoDirectoEfectivo)}).{' '}
                <strong style={{ color: '#EF4444' }}>Pierdes {formatCLP(Math.abs(impactoDescuento.margenConDescuento))} de tu bolsillo en cada producto vendido.</strong> Entre más vendas, más dinero destruyes.
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
                backgroundColor: 'rgba(245, 158, 11, 0.08)',
                border: '1.5px solid rgba(245, 158, 11, 0.35)',
                borderRadius: '12px',
                padding: '16px 18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontSize: '11.5px', fontWeight: 800, textTransform: 'uppercase', color: '#F59E0B' }}>
                  El Golpe de Realidad Financiera ({motivoPromocion})
                </span>
                <span
                  className="tabular-nums"
                  style={{
                    backgroundColor: '#EF4444',
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

              <p style={{ fontSize: '13.5px', lineHeight: 1.55, margin: 0, color: '#F8FAFC' }}>
                Al bajar el precio un <strong className="tabular-nums" style={{ color: '#E2F800' }}>{porcentajeEfectivo}%</strong>, tu ganancia limpia por unidad cae de{' '}
                <strong className="tabular-nums" style={{ color: '#10B981' }}>{formatCLP(impactoDescuento.margenActualUnitario)}</strong> a{' '}
                <strong className="tabular-nums" style={{ color: '#EF4444' }}>{formatCLP(impactoDescuento.margenConDescuento)}</strong>.{' '}
                Tendrás que vender{' '}
                <strong style={{ color: '#FFFFFF' }}>{impactoDescuento.unidadesNecesariasParaEmpatar} unidades</strong> (+{impactoDescuento.unidadesExtraRequeridas} unidades extras al mes){' '}
                <strong>solo para ganar exactamente lo mismo que ganas hoy</strong>.
              </p>

              {/* Simulador Interactivo: ¿Cuánto crees que van a subir tus ventas? */}
              <div
                style={{
                  backgroundColor: '#111827',
                  borderRadius: '10px',
                  border: '1px solid #1E293B',
                  padding: '14px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#F8FAFC' }}>
                    Si estimas que tus ventas subirán un <strong className="tabular-nums" style={{ color: '#E2F800' }}>+{aumentoVentasEsperado}%</strong> gracias a la promoción:
                  </span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[10, 20, 25, 40, 60].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => setAumentoVentasEsperado(pct)}
                        style={{
                          height: '24px',
                          padding: '0 8px',
                          fontSize: '10.5px',
                          fontWeight: aumentoVentasEsperado === pct ? 800 : 600,
                          backgroundColor: aumentoVentasEsperado === pct ? '#1E293B' : '#0B0F17',
                          color: aumentoVentasEsperado === pct ? '#E2F800' : '#94A3B8',
                          border: `1px solid ${aumentoVentasEsperado === pct ? '#E2F800' : '#1E293B'}`,
                          borderRadius: '5px',
                          cursor: 'pointer',
                        }}
                      >
                        +{pct}%
                      </button>
                    ))}
                  </div>
                </div>

                <div className="tabular-nums" style={{ fontSize: '12.5px', color: '#F8FAFC' }}>
                  {proyeccionVentasDescuento.esRentable ? (
                    <span style={{ color: '#10B981', fontWeight: 600 }}>
                      Resultado positivo: Ganarías {formatCLP(proyeccionVentasDescuento.diferenciaLiquida)} extra al mes al vender {proyeccionVentasDescuento.qEstimadaConPromo} un.
                    </span>
                  ) : (
                    <span style={{ color: '#F87171', fontWeight: 600 }}>
                      Trampa comercial: Aun vendiendo un +{aumentoVentasEsperado}% más ({proyeccionVentasDescuento.qEstimadaConPromo} un.), ganarás {formatCLP(Math.abs(proyeccionVentasDescuento.diferenciaLiquida))} MENOS a fin de mes que quedándote a precio normal.
                    </span>
                  )}
                </div>
              </div>

              {/* Botón de Enlace al Creador de Combos */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', borderTop: '1px solid rgba(245, 158, 11, 0.3)', paddingTop: '10px' }}>
                <span style={{ fontSize: '11.5px', color: '#FDE68A', fontWeight: 600 }}>
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
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                border: '1.5px solid rgba(16, 185, 129, 0.4)',
                borderRadius: '10px',
                padding: '12px 16px',
                color: '#10B981',
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
              backgroundColor: '#0B0F17',
              borderRadius: '12px',
              border: '1px solid #1E293B',
              padding: '18px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Diseño del Pack / Combo Rentable
              </span>
              <span style={{ fontSize: '11.5px', color: '#94A3B8', fontWeight: 600 }}>
                Eleva el ticket promedio sin destruir el margen de contribución
              </span>
            </div>

            {/* Nombre del Combo */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label htmlFor="input-nombre-combo" style={{ fontSize: '11.5px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>
                Nombre del Combo / Pack Comercial:
              </label>
              <input
                id="input-nombre-combo"
                type="text"
                value={nombreCombo}
                onChange={(e) => setNombreCombo(e.target.value)}
                placeholder="Ej: Pack Degustación Premium, Combo Dúo Almuerzo"
                style={{
                  height: '38px',
                  padding: '0 12px',
                  borderRadius: '8px',
                  border: '1px solid #1E293B',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  color: '#F8FAFC',
                  backgroundColor: '#111827',
                }}
              />
            </div>

            {/* Selección de Producto Base y Acompañante */}
            <div className="bento-grid-12" style={{ gap: '14px', alignItems: 'stretch' }}>
              {/* Producto Base */}
              <div className="bento-col-6" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label htmlFor="select-prod-base" style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>
                  1. Producto Principal (Base):
                </label>
                <select
                  id="select-prod-base"
                  value={productoBaseActual?.id || ''}
                  onChange={(e) => setProductoBaseId(e.target.value)}
                  style={{
                    height: '38px',
                    padding: '0 10px',
                    borderRadius: '8px',
                    border: '1px solid #1E293B',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    color: '#F8FAFC',
                    backgroundColor: '#111827',
                  }}
                >
                  {recetas.map((r) => (
                    <option key={r.id} value={r.id} style={{ backgroundColor: '#111827', color: '#F8FAFC' }}>
                      {r.nombre} (Normal: {formatCLP(r.precioVenta)})
                    </option>
                  ))}
                </select>
                <div style={{ fontSize: '11.5px', color: '#94A3B8' }}>
                  Costo directo base: <strong style={{ color: '#F8FAFC' }}>{formatCLP(calculoCombo.costoBase)}</strong>
                </div>
              </div>

              {/* Acompañante o Complemento */}
              <div className="bento-col-6" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label htmlFor="select-acomp" style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>
                    2. Acompañante o Complemento:
                  </label>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      type="button"
                      onClick={() => setAcompananteTipo('receta')}
                      style={{
                        padding: '2px 8px',
                        fontSize: '10.5px',
                        borderRadius: '5px',
                        fontWeight: acompananteTipo === 'receta' ? 800 : 600,
                        backgroundColor: acompananteTipo === 'receta' ? '#1E293B' : '#0B0F17',
                        color: acompananteTipo === 'receta' ? '#E2F800' : '#94A3B8',
                        border: `1px solid ${acompananteTipo === 'receta' ? '#E2F800' : '#1E293B'}`,
                        cursor: 'pointer',
                      }}
                    >
                      Producto
                    </button>
                    <button
                      type="button"
                      onClick={() => setAcompananteTipo('insumo')}
                      style={{
                        padding: '2px 8px',
                        fontSize: '10.5px',
                        borderRadius: '5px',
                        fontWeight: acompananteTipo === 'insumo' ? 800 : 600,
                        backgroundColor: acompananteTipo === 'insumo' ? '#1E293B' : '#0B0F17',
                        color: acompananteTipo === 'insumo' ? '#E2F800' : '#94A3B8',
                        border: `1px solid ${acompananteTipo === 'insumo' ? '#E2F800' : '#1E293B'}`,
                        cursor: 'pointer',
                      }}
                    >
                      Insumo / Extra
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <select
                    id="select-acomp"
                    value={acompananteActual?.id || ''}
                    onChange={(e) => setAcompananteId(e.target.value)}
                    style={{
                      flex: 1,
                      height: '38px',
                      padding: '0 10px',
                      borderRadius: '8px',
                      border: '1px solid #1E293B',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      color: '#F8FAFC',
                      backgroundColor: '#111827',
                    }}
                  >
                    {acompananteTipo === 'receta'
                      ? recetas
                          .filter((r) => r.id !== (productoBaseActual?.id || ''))
                          .map((r) => (
                            <option key={r.id} value={r.id} style={{ backgroundColor: '#111827', color: '#F8FAFC' }}>
                              {r.nombre} (Normal: {formatCLP(r.precioVenta)})
                            </option>
                          ))
                      : insumos.map((i) => (
                          <option key={i.id} value={i.id} style={{ backgroundColor: '#111827', color: '#F8FAFC' }}>
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
                      width: '56px',
                      height: '38px',
                      padding: '0 4px',
                      borderRadius: '8px',
                      border: '1px solid #1E293B',
                      fontSize: '14px',
                      fontWeight: 800,
                      textAlign: 'center',
                      color: '#E2F800',
                      backgroundColor: '#111827',
                    }}
                  />
                </div>

                <div style={{ fontSize: '11.5px', color: '#94A3B8' }}>
                  Costo acompañante: <strong style={{ color: '#F8FAFC' }}>{formatCLP(calculoCombo.costoAcomp)}</strong>
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
                borderTop: '1px solid #1E293B',
                paddingTop: '14px',
              }}
            >
              {/* Empaque Extra */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label htmlFor="input-empaque" style={{ fontSize: '12px', fontWeight: 600, color: '#94A3B8' }}>
                  Packaging / Caja Combo:
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <span style={{ fontSize: '13px', color: '#94A3B8', fontWeight: 600 }}>$</span>
                  <input
                    id="input-empaque"
                    type="number"
                    min="0"
                    step="50"
                    value={costoEmpaqueExtra}
                    onChange={(e) => setCostoEmpaqueExtra(Number(e.target.value))}
                    style={{
                      width: '80px',
                      height: '34px',
                      padding: '0 8px',
                      borderRadius: '6px',
                      border: '1px solid #1E293B',
                      fontSize: '13px',
                      fontWeight: 600,
                      textAlign: 'right',
                      backgroundColor: '#111827',
                      color: '#F8FAFC',
                    }}
                  />
                </div>
              </div>

              {/* Fijación Libre del Precio Promocional del Combo */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#F8FAFC' }}>
                  Precio Final del Combo:
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#E2F800' }}>$</span>
                  <input
                    type="number"
                    min="1000"
                    step="100"
                    placeholder={String(calculoCombo.precioSugeridoCombo)}
                    value={precioPromocionalCombo}
                    onChange={(e) => setPrecioPromocionalCombo(e.target.value)}
                    style={{
                      width: '120px',
                      height: '38px',
                      padding: '0 10px',
                      borderRadius: '8px',
                      border: '1.5px solid #E2F800',
                      fontSize: '16px',
                      fontWeight: 800,
                      textAlign: 'right',
                      color: '#E2F800',
                      backgroundColor: '#111827',
                    }}
                  />
                </div>

                {/* Botón Restaurar Precio Sugerido */}
                <button
                  type="button"
                  onClick={() => setPrecioPromocionalCombo('')}
                  className="btn-bacan-secondary"
                  title="Calcular precio sugerido con 12% de descuento para el cliente"
                  style={{ height: '32px', padding: '0 10px', fontSize: '11px', color: '#E2F800' }}
                >
                  Sugerido ({formatCLP(calculoCombo.precioSugeridoCombo)})
                </button>
              </div>
            </div>
          </div>

          {/* Tarjeta de Comparación Financiera: Combo vs Descuento Plano */}
          <div
            style={{
              backgroundColor: '#0B0F17',
              border: '1.5px solid #10B981',
              borderRadius: '12px',
              padding: '18px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.1)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', color: '#10B981' }}>
                Evaluación de Rentabilidad del Combo vs Descuento Plano
              </span>
              <span
                className="tabular-nums"
                style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.2)',
                  border: '1px solid #10B981',
                  color: '#10B981',
                  padding: '4px 10px',
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
                  backgroundColor: '#111827',
                  borderRadius: '10px',
                  padding: '14px 16px',
                  border: '1px solid #1E293B',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>
                  Lo que ve tu cliente:
                </span>
                <div style={{ fontSize: '13.5px', color: '#F8FAFC' }}>
                  Suma por separado: <span style={{ textDecoration: 'line-through', color: '#94A3B8' }}>{formatCLP(calculoCombo.precioSumaSeparada)}</span>
                </div>
                <div style={{ fontSize: '14.5px', fontWeight: 800, color: '#E2F800' }}>
                  Paga solo {formatCLP(calculoCombo.precioFinalCombo)} (Ahorra {formatCLP(calculoCombo.ahorroCliente)} / -{calculoCombo.ahorroClientePct}%)
                </div>
                <div style={{ fontSize: '11px', color: '#94A3B8' }}>
                  Sensación de oferta atractiva sin que tengas que abaratar tu producto estrella.
                </div>
              </div>

              <div
                className="bento-col-6"
                style={{
                  backgroundColor: '#111827',
                  borderRadius: '10px',
                  padding: '14px 16px',
                  border: '1px solid #1E293B',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>
                  Lo que entra a tu bolsillo:
                </span>
                <div style={{ fontSize: '13.5px', color: '#F8FAFC' }}>
                  Costo insumos total combo: <strong style={{ color: '#F87171' }}>{formatCLP(calculoCombo.costoTotalCombo)}</strong>
                </div>
                <div style={{ fontSize: '14.5px', fontWeight: 800, color: '#10B981' }}>
                  Ganancia neta/combo: {formatCLP(calculoCombo.margenLimpioCombo)} ({calculoCombo.margenComboPct}% margen)
                </div>
                <div style={{ fontSize: '11px', color: '#94A3B8' }}>
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
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                border: '1.5px solid rgba(16, 185, 129, 0.4)',
                borderRadius: '10px',
                padding: '12px 16px',
                color: '#10B981',
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
              backgroundColor: '#0B0F17',
              borderRadius: '12px',
              border: '1px solid #1E293B',
              padding: '18px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#F8FAFC' }}>
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
                    height: '34px',
                    padding: '0 6px',
                    borderRadius: '6px',
                    border: '1px solid #1E293B',
                    fontSize: '14px',
                    fontWeight: 700,
                    textAlign: 'center',
                    color: '#F59E0B',
                    backgroundColor: '#111827',
                  }}
                />
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#F59E0B' }}>%</span>
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

            <div className="tabular-nums" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: '#94A3B8', fontWeight: 600, flexWrap: 'wrap', gap: '6px' }}>
              <span>Costo Insumos Actual: <strong style={{ color: '#F8FAFC' }}>{formatCLP(costoVariableConsolidado)}</strong></span>
              <span>
                Nuevo Costo Directo: <strong style={{ color: '#EF4444' }}>{formatCLP(impactoInflacion.nuevoCostoDirectoBase)} (+{formatCLP(impactoInflacion.alzaCostoUnitario)})</strong>
              </span>
            </div>
          </div>

          {/* Dictamen Instantáneo de Bolsillo */}
          <div
            style={{
              backgroundColor: '#111827',
              color: '#F8FAFC',
              borderRadius: '12px',
              padding: '18px 20px',
              border: '1px solid #1E293B',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
            }}
          >
            <div>
              <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#E2F800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Respuesta Instantánea para Compras en Terreno
              </span>
              <p style={{ fontSize: '14px', lineHeight: 1.5, margin: '6px 0 0 0' }}>
                Si tus insumos suben un <strong className="tabular-nums" style={{ color: '#E2F800' }}>{porcentajeInflacionProveedor}%</strong>,{' '}
                <strong style={{ color: '#10B981', fontSize: '15px' }}>
                  sube tu precio {formatCLP(impactoInflacion.ajustePrecioNecesario)} hoy
                </strong>{' '}
                (a <strong className="tabular-nums" style={{ color: '#FFFFFF' }}>{formatCLP(impactoInflacion.nuevoPrecioProtegido)}</strong>) o{' '}
                <strong style={{ color: '#EF4444' }}>
                  perderás {formatCLP(impactoInflacion.perdidaMensualProyectada)} a fin de mes
                </strong>{' '}
                ({formatCLP(impactoInflacion.perdidaAnualProyectada)} al año).
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', borderTop: '1px solid #1E293B', paddingTop: '14px' }}>
              <span className="tabular-nums" style={{ fontSize: '12.5px', color: '#94A3B8' }}>
                Precio Blindado Sugerido: <strong style={{ color: '#E2F800', fontSize: '15px' }}>{formatCLP(impactoInflacion.nuevoPrecioProtegido)}</strong>
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
