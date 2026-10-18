import React, { useState, useEffect } from 'react';
import { formatCLP, formatCompactCLP } from '../../utils/formatters.js';

/**
 * Gráfico Ejecutivo de Punto de Equilibrio y Zonificación de Rentabilidad
 * Incorpora visor modal ampliado con simulador dinámico de volumen ('moverte por el gráfico').
 * Cumple estrictamente con la regla de cero emojis.
 */
export default function GraficoPuntoEquilibrio({
  datos = [],
  puntoEquilibrioUnidades = 0,
  precioUnitario = 0,
  costoVariableUnitario = 0,
  costoFijoTotal = 0,
  sueldoObjetivo = 0,
  ventasEstimadas = 0,
}) {
  const [hoverIndex, setHoverIndex] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [escalaZoom, setEscalaZoom] = useState(1.0);
  const [unidadesScrubber, setUnidadesScrubber] = useState(
    ventasEstimadas > 0 ? ventasEstimadas : puntoEquilibrioUnidades || 50
  );

  // Escuchar tecla Escape para cerrar el modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && modalAbierto) {
        setModalAbierto(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalAbierto]);

  // Si cambian las ventas estimadas o el punto de equilibrio, sincronizar scrubber si no se ha interactuado
  useEffect(() => {
    if (ventasEstimadas > 0) {
      setUnidadesScrubber(ventasEstimadas);
    } else if (puntoEquilibrioUnidades > 0) {
      setUnidadesScrubber(puntoEquilibrioUnidades);
    }
  }, [ventasEstimadas, puntoEquilibrioUnidades]);

  if (!datos || datos.length === 0) {
    return (
      <div style={{ height: '340px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-muted-foreground)', fontSize: '13px' }}>
        No hay datos suficientes para proyectar el gráfico.
      </div>
    );
  }

  // --- Dimensiones Gráfico Normal (Inline) ---
  const width = 820;
  const height = 400;
  const padding = { top: 40, right: 35, bottom: 50, left: 80 };

  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const maxUnidades = Math.max(...datos.map((d) => d.unidades), 10);
  const maxMonto = Math.max(...datos.map((d) => Math.max(d.ingresos, d.costos)), 1000) * 1.15;

  const getX = (unidades) => padding.left + (unidades / maxUnidades) * chartW;
  const getY = (monto) => height - padding.bottom - (monto / maxMonto) * chartH;

  const pathIngresos = datos.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(d.unidades)} ${getY(d.ingresos)}`).join(' ');
  const pathCostos = datos.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(d.unidades)} ${getY(d.costos)}`).join(' ');

  // Coordenadas del Punto de Equilibrio en Gráfico Normal
  const peX = getX(puntoEquilibrioUnidades);
  const primerDatoSobrePe = datos.find((d) => d.unidades >= puntoEquilibrioUnidades);
  const montoPeEstimado = primerDatoSobrePe ? primerDatoSobrePe.costos : maxMonto * 0.5;
  const peY = getY(montoPeEstimado);

  // Polígono de Utilidad Neta (Zona a la derecha del PE)
  const datosPostPe = datos.filter((d) => d.unidades >= puntoEquilibrioUnidades);
  let areaUtilidad = '';
  if (datosPostPe.length > 0 && puntoEquilibrioUnidades <= maxUnidades) {
    const ptsIngresos = datosPostPe.map((d) => `L ${getX(d.unidades)} ${getY(d.ingresos)}`).join(' ');
    const ptsCostosRev = [...datosPostPe].reverse().map((d) => `L ${getX(d.unidades)} ${getY(d.costos)}`).join(' ');
    areaUtilidad = `M ${peX} ${peY} ${ptsIngresos} ${ptsCostosRev} Z`;
  }

  // Polígono de Déficit Operativo (Zona a la izquierda del PE)
  const datosPrePe = datos.filter((d) => d.unidades <= puntoEquilibrioUnidades);
  let areaDeficit = '';
  if (datosPrePe.length > 0 && puntoEquilibrioUnidades > 0) {
    const ptsCostos = datosPrePe.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(d.unidades)} ${getY(d.costos)}`).join(' ');
    const ptsIngresosRev = [...datosPrePe].reverse().map((d) => `L ${getX(d.unidades)} ${getY(d.ingresos)}`).join(' ');
    areaDeficit = `${ptsCostos} L ${peX} ${peY} ${ptsIngresosRev} Z`;
  }

  const yTicks = [0, maxMonto * 0.25, maxMonto * 0.5, maxMonto * 0.75, maxMonto];
  const activePoint = hoverIndex !== null ? datos[hoverIndex] : null;

  // --- Dimensiones & Proyección para el Modal Ampliado ---
  const modalW = 960;
  const modalH = 460;
  const modalPad = { top: 45, right: 45, bottom: 60, left: 95 };
  const modalChartW = modalW - modalPad.left - modalPad.right;
  const modalChartH = modalH - modalPad.top - modalPad.bottom;

  const maxUnidadesModal = Math.max(Math.round(maxUnidades * escalaZoom), 20);
  const pEfectivo = precioUnitario > 0 ? precioUnitario : (datos[1]?.ingresos || 1000) / (datos[1]?.unidades || 1);
  const cvEfectivo = costoVariableUnitario > 0 ? costoVariableUnitario : 0;
  const cfEfectivo = costoFijoTotal > 0 ? costoFijoTotal : datos[0]?.costos || 0;

  // Monto máximo en escala ampliada
  const maxIngresoModal = maxUnidadesModal * pEfectivo;
  const maxCostoModal = cfEfectivo + maxUnidadesModal * cvEfectivo;
  const maxMontoModal = Math.max(maxIngresoModal, maxCostoModal, 1000) * 1.15;

  const getModalX = (unidades) => modalPad.left + (Math.min(unidades, maxUnidadesModal) / maxUnidadesModal) * modalChartW;
  const getModalY = (monto) => modalH - modalPad.bottom - (Math.min(monto, maxMontoModal) / maxMontoModal) * modalChartH;

  // Curvas analíticas continuas para el modal
  const puntosModalCount = 12;
  const pasoModal = Math.ceil(maxUnidadesModal / puntosModalCount);
  const puntosSerieModal = [];
  for (let u = 0; u <= maxUnidadesModal; u += pasoModal) {
    puntosSerieModal.push({
      unidades: u,
      ingresos: u * pEfectivo,
      costos: cfEfectivo + u * cvEfectivo,
    });
  }
  if (puntosSerieModal[puntosSerieModal.length - 1].unidades < maxUnidadesModal) {
    puntosSerieModal.push({
      unidades: maxUnidadesModal,
      ingresos: maxUnidadesModal * pEfectivo,
      costos: cfEfectivo + maxUnidadesModal * cvEfectivo,
    });
  }

  const modalPathIngresos = `M ${getModalX(0)} ${getModalY(0)} L ${getModalX(maxUnidadesModal)} ${getModalY(maxIngresoModal)}`;
  const modalPathCostos = `M ${getModalX(0)} ${getModalY(cfEfectivo)} L ${getModalX(maxUnidadesModal)} ${getModalY(maxCostoModal)}`;
  const modalPathCostoFijo = `M ${getModalX(0)} ${getModalY(cfEfectivo)} L ${getModalX(maxUnidadesModal)} ${getModalY(cfEfectivo)}`;

  // Coordenadas del PE en el modal
  const peModalX = getModalX(puntoEquilibrioUnidades);
  const montoPeModal = cfEfectivo + puntoEquilibrioUnidades * cvEfectivo;
  const peModalY = getModalY(montoPeModal);

  // Áreas sombreadas en modal
  let modalAreaDeficit = '';
  if (puntoEquilibrioUnidades > 0) {
    modalAreaDeficit = `M ${getModalX(0)} ${getModalY(cfEfectivo)} L ${peModalX} ${peModalY} L ${getModalX(0)} ${getModalY(0)} Z`;
  }

  let modalAreaUtilidad = '';
  if (puntoEquilibrioUnidades < maxUnidadesModal) {
    modalAreaUtilidad = `M ${peModalX} ${peModalY} L ${getModalX(maxUnidadesModal)} ${getModalY(maxIngresoModal)} L ${getModalX(maxUnidadesModal)} ${getModalY(maxCostoModal)} Z`;
  }

  // Telemetría en tiempo real del Scrubber (Simulación interactiva de volumen)
  const valIngresoScrubber = Math.round(unidadesScrubber * pEfectivo);
  const valCostoVarScrubber = Math.round(unidadesScrubber * cvEfectivo);
  const valCostoTotalScrubber = Math.round(cfEfectivo + valCostoVarScrubber);
  const valMargenContribucionScrubber = Math.round(valIngresoScrubber - valCostoVarScrubber);
  const valResultadoScrubber = Math.round(valIngresoScrubber - valCostoTotalScrubber);
  const estaEnGanancia = valResultadoScrubber >= 0;
  const porcentajeCoberturaPE = puntoEquilibrioUnidades > 0
    ? Math.round((unidadesScrubber / puntoEquilibrioUnidades) * 100)
    : 100;

  // Meta con Sueldo Objetivo en unidades
  const margenUnitario = Math.max(0, pEfectivo - cvEfectivo);
  const metaConSueldoUnidades = margenUnitario > 0
    ? Math.ceil((cfEfectivo + Number(sueldoObjetivo || 0)) / margenUnitario)
    : 0;

  const modalYTicks = [0, maxMontoModal * 0.25, maxMontoModal * 0.5, maxMontoModal * 0.75, maxMontoModal];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative' }}>
      {/* Encabezado y Leyenda Superior */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <span style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Viabilidad y equilibrio
          </span>
          <h3 className="heading-tight" style={{ fontSize: '17px', fontWeight: 600, color: 'var(--color-foreground)', margin: '2px 0 0 0' }}>
            Punto de equilibrio y rentabilidad
          </h3>
          <p style={{ fontSize: '12.5px', color: 'var(--color-muted-foreground)', margin: '2px 0 0 0' }}>
            Muestra el volumen mínimo de ventas para cubrir costos y generar ganancias.
          </p>
        </div>

        {/* Badges de Leyenda y Botón de Explorar en Detalle */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '6px',
              border: '1px solid #1E293B',
              backgroundColor: '#111827',
              fontSize: '11.5px',
              fontWeight: 600,
              color: 'var(--color-foreground)',
            }}
          >
            <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'linear-gradient(135deg, #0F766E, #14B8A6)', display: 'inline-block' }} />
            <span>Ingresos</span>
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '6px',
              border: '1px solid #1E293B',
              backgroundColor: '#111827',
              fontSize: '11.5px',
              fontWeight: 600,
              color: 'var(--color-foreground)',
            }}
          >
            <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'linear-gradient(135deg, #DC2626, #F87171)', display: 'inline-block' }} />
            <span>Costos Totales</span>
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '6px',
              border: '1px solid rgba(226, 248, 0, 0.3)',
              backgroundColor: 'rgba(226, 248, 0, 0.1)',
              fontSize: '12px',
              fontWeight: 700,
              color: '#E2F800',
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-brand-700)', display: 'inline-block', boxShadow: '0 0 0 2px rgba(15,118,110,0.25)' }} />
            <span>PE: {puntoEquilibrioUnidades.toLocaleString('es-CL')} un.</span>
          </div>

          {/* Botón Principal: Abrir Explorador a Detalle */}
          <button
            type="button"
            onClick={() => setModalAbierto(true)}
            className="btn-bacan-secondary"
            title="Abrir vista detallada e interactiva para simular volúmenes sobre la curva"
            style={{
              height: '32px',
              padding: '0 12px',
              fontSize: '12px',
              fontWeight: 600,
              color: '#E2F800',
              backgroundColor: '#111827',
              border: '1.5px solid #E2F800',
              borderRadius: '6px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(15, 118, 110, 0.12)',
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0F766E" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 3 21 3 21 9" />
              <polyline points="9 21 3 21 3 15" />
              <line x1="21" y1="3" x2="14" y2="10" />
              <line x1="3" y1="21" x2="10" y2="14" />
            </svg>
            <span>Explorar en Detalle</span>
          </button>
        </div>
      </div>

      {/* Contenedor del Gráfico SVG Responsive Inline */}
      <div
        style={{
          width: '100%',
          borderRadius: '10px',
          border: '1px solid var(--color-border)',
          backgroundColor: '#111827',
          position: 'relative',
          padding: '14px 8px',
          boxSizing: 'border-box',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            overflow: 'visible',
          }}
        >
          <defs>
            <linearGradient id="pbrGradUtilidad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0F766E" stopOpacity="0.28" />
              <stop offset="60%" stopColor="#14B8A6" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#2DD4BF" stopOpacity="0.04" />
            </linearGradient>

            <linearGradient id="pbrGradDeficit" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#EF4444" stopOpacity="0.18" />
              <stop offset="70%" stopColor="#F87171" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#FCA5A5" stopOpacity="0.02" />
            </linearGradient>

            <filter id="pbrPuntoSombra" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#0F766E" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Área sombreada de déficit previo al PE */}
          {areaDeficit && <path d={areaDeficit} fill="url(#pbrGradDeficit)" />}

          {/* Área sombreada de utilidad neta posterior al PE */}
          {areaUtilidad && <path d={areaUtilidad} fill="url(#pbrGradUtilidad)" />}

          {/* Grilla horizontal de montos */}
          {yTicks.map((val, idx) => (
            <g key={idx}>
              <line
                x1={padding.left}
                y1={getY(val)}
                x2={width - padding.right}
                y2={getY(val)}
                stroke="#E2E8F0"
                strokeDasharray="4 4"
                strokeWidth="0.85"
              />
              <text
                x={padding.left - 12}
                y={getY(val) + 4}
                textAnchor="end"
                fill="#64748B"
                fontSize="11"
                fontWeight="500"
                className="tabular-nums"
              >
                {formatCompactCLP(val)}
              </text>
            </g>
          ))}

          {/* Líneas guía verticales para unidades */}
          {datos.map((d, idx) => (
            <g key={idx}>
              <line
                x1={getX(d.unidades)}
                y1={padding.top}
                x2={getX(d.unidades)}
                y2={height - padding.bottom}
                stroke="#F1F5F9"
                strokeWidth="1"
              />
              <text
                x={getX(d.unidades)}
                y={height - padding.bottom + 22}
                textAnchor="middle"
                fill="#64748B"
                fontSize="11"
                fontWeight="500"
                className="tabular-nums"
              >
                {d.unidades}
              </text>
            </g>
          ))}

          {/* Etiquetas de eje X y Y */}
          <text
            x={width - padding.right}
            y={height - padding.bottom + 38}
            textAnchor="end"
            fill="#94A3B8"
            fontSize="10"
            fontWeight="600"
            letterSpacing="0.04em"
          >
            VOLUMEN DE VENTAS (UNIDADES)
          </text>

          <text
            x={padding.left}
            y={padding.top - 16}
            textAnchor="start"
            fill="#94A3B8"
            fontSize="10"
            fontWeight="600"
            letterSpacing="0.04em"
          >
            MONTO ACUMULADO ($ CLP)
          </text>

          {/* Curva de Costos Totales */}
          <path
            d={pathCostos}
            fill="none"
            stroke="#DC2626"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Curva de Ingresos */}
          <path
            d={pathIngresos}
            fill="none"
            stroke="#0F766E"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Indicador Vertical y Pin del Punto de Equilibrio */}
          {puntoEquilibrioUnidades > 0 && puntoEquilibrioUnidades <= maxUnidades && (
            <g>
              <line
                x1={peX}
                y1={padding.top}
                x2={peX}
                y2={height - padding.bottom}
                stroke="#0F766E"
                strokeWidth="1.8"
                strokeDasharray="4 4"
              />

              <circle cx={peX} cy={peY} r="12" fill="#0F766E" fillOpacity="0.12" />
              <circle cx={peX} cy={peY} r="8" fill="#0F766E" stroke="#FFFFFF" strokeWidth="2.5" filter="url(#pbrPuntoSombra)" />

              <g transform={`translate(${Math.min(peX + 10, width - padding.right - 140)}, ${Math.max(peY - 32, padding.top + 6)})`}>
                <rect
                  x="0"
                  y="0"
                  width="132"
                  height="26"
                  rx="5"
                  fill="#0F766E"
                  filter="url(#pbrPuntoSombra)"
                />
                <text
                  x="66"
                  y="17"
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize="10.5"
                  fontWeight="700"
                  letterSpacing="0.02em"
                >
                  PE: {puntoEquilibrioUnidades.toLocaleString('es-CL')} un.
                </text>
              </g>
            </g>
          )}

          {/* Crosshair interactivo en hover */}
          {activePoint && (
            <g pointerEvents="none">
              <line
                x1={getX(activePoint.unidades)}
                y1={padding.top}
                x2={getX(activePoint.unidades)}
                y2={height - padding.bottom}
                stroke="#0F766E"
                strokeWidth="1.2"
                strokeDasharray="2 2"
                strokeOpacity="0.6"
              />
            </g>
          )}

          {/* Puntos interactivos hover */}
          {datos.map((d, idx) => (
            <g
              key={idx}
              onMouseEnter={() => setHoverIndex(idx)}
              onMouseLeave={() => setHoverIndex(null)}
              style={{ cursor: 'pointer' }}
            >
              <circle
                cx={getX(d.unidades)}
                cy={getY(d.ingresos)}
                r={hoverIndex === idx ? 7 : 4.5}
                fill="#0F766E"
                stroke="#FFFFFF"
                strokeWidth="2"
              />
              <circle
                cx={getX(d.unidades)}
                cy={getY(d.costos)}
                r={hoverIndex === idx ? 7 : 4.5}
                fill="#DC2626"
                stroke="#FFFFFF"
                strokeWidth="2"
              />
            </g>
          ))}
        </svg>

        {/* Tooltip Dinámico Flotante en Inline */}
        {activePoint && (
          <div
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              backgroundColor: '#111827',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              padding: '10px 14px',
              boxShadow: 'var(--shadow-popover)',
              fontSize: '12px',
              pointerEvents: 'none',
              zIndex: 10,
              minWidth: '170px',
            }}
          >
            <div style={{ fontWeight: 700, color: 'var(--color-foreground)', marginBottom: '6px', borderBottom: '1px solid var(--color-border)', paddingBottom: '4px' }}>
              Volumen: {activePoint.unidades} unidades
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', color: '#0F766E', fontWeight: 600, marginBottom: '2px' }}>
              <span>Ingresos:</span>
              <span className="tabular-nums">{formatCLP(activePoint.ingresos)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', color: '#DC2626', fontWeight: 600, marginBottom: '4px' }}>
              <span>Costos:</span>
              <span className="tabular-nums">{formatCLP(activePoint.costos)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', color: activePoint.ingresos >= activePoint.costos ? 'var(--color-success)' : 'var(--color-danger)', fontWeight: 700, borderTop: '1px solid #F1F5F9', paddingTop: '4px' }}>
              <span>Resultado:</span>
              <span className="tabular-nums">
                {activePoint.ingresos >= activePoint.costos ? '+' : ''}
                {formatCLP(activePoint.ingresos - activePoint.costos)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Dictamen Analítico del Punto de Retorno */}
      <div
        style={{
          fontSize: '12.5px',
          color: 'var(--color-muted-foreground)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
          padding: '10px 14px',
          backgroundColor: '#FAFAFA',
          borderRadius: '8px',
          border: '1px solid var(--color-border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <span>
            Desde <strong style={{ color: 'var(--color-foreground)' }}>{puntoEquilibrioUnidades.toLocaleString('es-CL')} unidades</strong> vendidas al mes, cubres los costos fijos y comienzas a generar utilidades.
          </span>
        </div>

        <button
          type="button"
          onClick={() => setModalAbierto(true)}
          style={{
            fontSize: '11.5px',
            fontWeight: 600,
            color: 'var(--color-primary)',
            background: 'transparent',
            border: 'none',
            textDecoration: 'underline',
            cursor: 'pointer',
            padding: '2px 4px',
          }}
        >
          Moverte por el gráfico a detalle &rarr;
        </button>
      </div>

      {/* ========================================================================= */}
      {/* MODAL DETALLADO E INTERACTIVO: EXPLORAR EN DETALLE & MOVERTE POR EL GRÁFICO */}
      {/* ========================================================================= */}
      {modalAbierto && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <div
            style={{
              backgroundColor: '#0D131F',
              borderRadius: '14px',
              border: '1px solid #1E293B',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              width: '100%',
              maxWidth: '1020px',
              maxHeight: '94vh',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              padding: '22px 26px',
            }}
          >
            {/* Cabecera del Modal */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #1E293B', paddingBottom: '14px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      fontSize: '10.5px',
                      fontWeight: 700,
                      color: '#E2F800',
                      backgroundColor: 'rgba(226, 248, 0, 0.1)',
                      border: '1px solid rgba(226, 248, 0, 0.3)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                    }}
                  >
                    Simulador de volumen
                  </span>
                  <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
                    Vista detallada
                  </span>
                </div>
                <h2 className="heading-tight" style={{ fontSize: '20px', fontWeight: 700, color: '#F8FAFC', margin: '6px 0 2px 0' }}>
                  Simulador de punto de equilibrio y volumen
                </h2>
                <p style={{ fontSize: '13px', color: '#94A3B8', margin: 0 }}>
                  Mueve la barra para revisar ingresos, costos y ganancias en cada nivel de venta.
                </p>
              </div>

              {/* Botón de Cerrar */}
              <button
                type="button"
                onClick={() => setModalAbierto(false)}
                title="Cerrar ventana (Esc)"
                style={{
                  height: '36px',
                  width: '36px',
                  borderRadius: '8px',
                  border: '1px solid #1E293B',
                  backgroundColor: '#111827',
                  color: '#94A3B8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Controles de Escala / Zoom y Botones de Salto Rápido */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
                backgroundColor: '#111827',
                border: '1px solid #1E293B',
                borderRadius: '10px',
                padding: '10px 14px',
              }}
            >
              {/* Selector de Escala de Proyección */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>
                  Ampliación del Rango:
                </span>
                <div style={{ display: 'inline-flex', gap: '4px' }}>
                  {[
                    { id: 1.0, label: '1.0x (Estándar)' },
                    { id: 1.5, label: '1.5x (Ampliación)' },
                    { id: 2.0, label: '2.0x (Gran Escala)' },
                  ].map((z) => (
                    <button
                      key={z.id}
                      type="button"
                      onClick={() => setEscalaZoom(z.id)}
                      style={{
                        padding: '4px 10px',
                        fontSize: '11px',
                        fontWeight: escalaZoom === z.id ? 700 : 500,
                        borderRadius: '6px',
                        border: `1px solid ${escalaZoom === z.id ? '#0F766E' : '#CBD5E1'}`,
                        backgroundColor: escalaZoom === z.id ? '#1E293B' : '#0B0F17',
                        color: escalaZoom === z.id ? '#E2F800' : '#94A3B8',
                        cursor: 'pointer',
                      }}
                    >
                      {z.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Saltos Rápidos de Simulación */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>
                  Saltar a:
                </span>
                <button
                  type="button"
                  onClick={() => setUnidadesScrubber(0)}
                  style={{
                    padding: '3px 8px',
                    fontSize: '11px',
                    borderRadius: '5px',
                    border: '1px solid #1E293B',
                    backgroundColor: '#111827',
                    color: '#94A3B8',
                    cursor: 'pointer',
                  }}
                >
                  0 un. (Base)
                </button>
                <button
                  type="button"
                  onClick={() => setUnidadesScrubber(puntoEquilibrioUnidades)}
                  style={{
                    padding: '3px 8px',
                    fontSize: '11px',
                    fontWeight: 600,
                    borderRadius: '5px',
                    border: '1px solid #99F6E4',
                    backgroundColor: '#CCFBF1',
                    color: '#0F766E',
                    cursor: 'pointer',
                  }}
                >
                  Equilibrio ({puntoEquilibrioUnidades} un.)
                </button>
                {metaConSueldoUnidades > 0 && metaConSueldoUnidades <= maxUnidadesModal && (
                  <button
                    type="button"
                    onClick={() => setUnidadesScrubber(metaConSueldoUnidades)}
                    style={{
                      padding: '3px 8px',
                      fontSize: '11px',
                      fontWeight: 600,
                      borderRadius: '5px',
                      border: '1px solid #BAE6FD',
                      backgroundColor: '#E0F2FE',
                      color: '#0369A1',
                      cursor: 'pointer',
                    }}
                  >
                    Meta Sueldo ({metaConSueldoUnidades} un.)
                  </button>
                )}
                {ventasEstimadas > 0 && ventasEstimadas <= maxUnidadesModal && (
                  <button
                    type="button"
                    onClick={() => setUnidadesScrubber(ventasEstimadas)}
                    style={{
                      padding: '3px 8px',
                      fontSize: '11px',
                      borderRadius: '5px',
                      border: '1px solid #1E293B',
                      backgroundColor: '#111827',
                      color: '#F8FAFC',
                      cursor: 'pointer',
                    }}
                  >
                    Venta Actual ({ventasEstimadas} un.)
                  </button>
                )}
              </div>
            </div>

            {/* CONTROL DESLIZANTE DE VOLUMEN (EL SCRUBBER: 'MOVERTE POR EL GRÁFICO') */}
            <div
              style={{
                backgroundColor: '#0B0F17',
                border: '1.5px solid #5EEAD4',
                borderRadius: '10px',
                padding: '14px 18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: 700, color: '#0F766E', letterSpacing: '0.02em' }}>
                  MOVERTE POR EL GRÁFICO: Desliza las unidades para inspeccionar cada punto
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '12px', color: '#94A3B8' }}>
                    Nivel simulado:
                  </span>
                  <span
                    className="tabular-nums"
                    style={{
                      fontSize: '16px',
                      fontWeight: 800,
                      color: '#0F766E',
                      backgroundColor: '#111827',
                      border: '1px solid #99F6E4',
                      padding: '2px 10px',
                      borderRadius: '6px',
                    }}
                  >
                    {unidadesScrubber.toLocaleString('es-CL')} unidades
                  </span>
                </div>
              </div>

              <input
                type="range"
                min="0"
                max={maxUnidadesModal}
                step="1"
                value={unidadesScrubber}
                onChange={(e) => setUnidadesScrubber(Number(e.target.value))}
                style={{
                  width: '100%',
                  cursor: 'pointer',
                  accentColor: '#0F766E',
                  height: '8px',
                }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748B' }}>
                <span>0 unidades</span>
                <span>Punto de Equilibrio: {puntoEquilibrioUnidades} un.</span>
                <span>Máximo proyectado: {maxUnidadesModal} un.</span>
              </div>
            </div>

            {/* GRÁFICO SVG AMPLIADO DE ALTA DEFINICIÓN */}
            <div
              style={{
                width: '100%',
                borderRadius: '10px',
                border: '1px solid #1E293B',
                backgroundColor: '#111827',
                position: 'relative',
                padding: '16px 10px',
                boxSizing: 'border-box',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.03)',
              }}
            >
              <svg
                viewBox={`0 0 ${modalW} ${modalH}`}
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  overflow: 'visible',
                }}
              >
                <defs>
                  <linearGradient id="modalGradUtilidad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0F766E" stopOpacity="0.32" />
                    <stop offset="70%" stopColor="#14B8A6" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#2DD4BF" stopOpacity="0.02" />
                  </linearGradient>

                  <linearGradient id="modalGradDeficit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#DC2626" stopOpacity="0.22" />
                    <stop offset="70%" stopColor="#F87171" stopOpacity="0.09" />
                    <stop offset="100%" stopColor="#FCA5A5" stopOpacity="0.02" />
                  </linearGradient>
                </defs>

                {/* Zonas sombreadas */}
                {modalAreaDeficit && <path d={modalAreaDeficit} fill="url(#modalGradDeficit)" />}
                {modalAreaUtilidad && <path d={modalAreaUtilidad} fill="url(#modalGradUtilidad)" />}

                {/* Grilla horizontal de montos */}
                {modalYTicks.map((val, idx) => (
                  <g key={idx}>
                    <line
                      x1={modalPad.left}
                      y1={getModalY(val)}
                      x2={modalW - modalPad.right}
                      y2={getModalY(val)}
                      stroke="#E2E8F0"
                      strokeDasharray="4 4"
                      strokeWidth="0.85"
                    />
                    <text
                      x={modalPad.left - 12}
                      y={getModalY(val) + 4}
                      textAnchor="end"
                      fill="#64748B"
                      fontSize="11"
                      fontWeight="500"
                      className="tabular-nums"
                    >
                      {formatCompactCLP(val)}
                    </text>
                  </g>
                ))}

                {/* Línea horizontal de Costos Fijos Base */}
                <line
                  x1={modalPad.left}
                  y1={getModalY(cfEfectivo)}
                  x2={modalW - modalPad.right}
                  y2={getModalY(cfEfectivo)}
                  stroke="#94A3B8"
                  strokeDasharray="6 4"
                  strokeWidth="1.5"
                />
                <text
                  x={modalPad.left + 8}
                  y={getModalY(cfEfectivo) - 6}
                  fill="#64748B"
                  fontSize="10"
                  fontWeight="600"
                >
                  COSTOS FIJOS BASE: {formatCLP(cfEfectivo)}
                </text>

                {/* Ejes y marcas de unidades */}
                {puntosSerieModal.map((p, idx) => (
                  <g key={idx}>
                    <line
                      x1={getModalX(p.unidades)}
                      y1={modalPad.top}
                      x2={getModalX(p.unidades)}
                      y2={modalH - modalPad.bottom}
                      stroke="#F1F5F9"
                      strokeWidth="1"
                    />
                    <text
                      x={getModalX(p.unidades)}
                      y={modalH - modalPad.bottom + 20}
                      textAnchor="middle"
                      fill="#64748B"
                      fontSize="11"
                      fontWeight="500"
                      className="tabular-nums"
                    >
                      {p.unidades}
                    </text>
                  </g>
                ))}

                {/* Curvas continuas */}
                <path
                  d={modalPathCostos}
                  fill="none"
                  stroke="#DC2626"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                />
                <path
                  d={modalPathIngresos}
                  fill="none"
                  stroke="#0F766E"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Punto de Equilibrio Marcador */}
                {puntoEquilibrioUnidades > 0 && puntoEquilibrioUnidades <= maxUnidadesModal && (
                  <g>
                    <line
                      x1={peModalX}
                      y1={modalPad.top}
                      x2={peModalX}
                      y2={modalH - modalPad.bottom}
                      stroke="#0F766E"
                      strokeWidth="1.6"
                      strokeDasharray="4 4"
                    />
                    <circle cx={peModalX} cy={peModalY} r="10" fill="#0F766E" fillOpacity="0.2" />
                    <circle cx={peModalX} cy={peModalY} r="6" fill="#0F766E" stroke="#FFFFFF" strokeWidth="2" />
                    <g transform={`translate(${Math.min(peModalX + 10, modalW - modalPad.right - 130)}, ${Math.max(peModalY - 28, modalPad.top + 6)})`}>
                      <rect x="0" y="0" width="124" height="24" rx="4" fill="#0F766E" />
                      <text x="62" y="16" textAnchor="middle" fill="#FFFFFF" fontSize="10.5" fontWeight="700">
                        P.E. {puntoEquilibrioUnidades} un.
                      </text>
                    </g>
                  </g>
                )}

                {/* CURSOR VERTICAL DINÁMICO DEL SCRUBBER ('MOVERTE POR EL GRÁFICO') */}
                {(() => {
                  const scrubX = getModalX(unidadesScrubber);
                  const scrubIngresoY = getModalY(valIngresoScrubber);
                  const scrubCostoY = getModalY(valCostoTotalScrubber);

                  return (
                    <g pointerEvents="none">
                      {/* Línea vertical del cursor */}
                      <line
                        x1={scrubX}
                        y1={modalPad.top}
                        x2={scrubX}
                        y2={modalH - modalPad.bottom}
                        stroke={estaEnGanancia ? '#0F766E' : '#DC2626'}
                        strokeWidth="2"
                        strokeDasharray="3 3"
                      />

                      {/* Marcador en curva de Ingresos */}
                      <circle
                        cx={scrubX}
                        cy={scrubIngresoY}
                        r="6"
                        fill="#0F766E"
                        stroke="#FFFFFF"
                        strokeWidth="2"
                      />

                      {/* Marcador en curva de Costos */}
                      <circle
                        cx={scrubX}
                        cy={scrubCostoY}
                        r="6"
                        fill="#DC2626"
                        stroke="#FFFFFF"
                        strokeWidth="2"
                      />

                      {/* Etiqueta superior del cursor */}
                      <g transform={`translate(${Math.min(Math.max(scrubX - 70, modalPad.left), modalW - modalPad.right - 140)}, ${modalPad.top - 12})`}>
                        <rect
                          x="0"
                          y="0"
                          width="140"
                          height="24"
                          rx="4"
                          fill={estaEnGanancia ? '#0F766E' : '#DC2626'}
                        />
                        <text
                          x="70"
                          y="16"
                          textAnchor="middle"
                          fill="#FFFFFF"
                          fontSize="10.5"
                          fontWeight="700"
                        >
                          {unidadesScrubber} un. • {estaEnGanancia ? '+' : ''}{formatCLP(valResultadoScrubber)}
                        </text>
                      </g>
                    </g>
                  );
                })()}

                {/* Etiquetas de los ejes */}
                <text
                  x={modalW - modalPad.right}
                  y={modalH - modalPad.bottom + 42}
                  textAnchor="end"
                  fill="#94A3B8"
                  fontSize="11"
                  fontWeight="700"
                  letterSpacing="0.04em"
                >
                  VOLUMEN DE VENTAS (UNIDADES)
                </text>

                <text
                  x={modalPad.left}
                  y={modalPad.top - 20}
                  textAnchor="start"
                  fill="#94A3B8"
                  fontSize="11"
                  fontWeight="700"
                  letterSpacing="0.04em"
                >
                  MONTO TOTAL ($ CLP)
                </text>
              </svg>
            </div>

            {/* PANEL DE MÉTRICAS EN TIEMPO REAL DEL VOLUMEN SIMULADO */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '12px',
              }}
            >
              {/* Tarjeta 1: Unidades Simuladas & Cobertura */}
              <div style={{ backgroundColor: '#111827', border: '1px solid #1E293B', borderRadius: '8px', padding: '12px' }}>
                <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#64748B', display: 'block', textTransform: 'uppercase' }}>
                  Volumen Seleccionado
                </span>
                <span className="tabular-nums" style={{ fontSize: '18px', fontWeight: 800, color: '#F8FAFC' }}>
                  {unidadesScrubber.toLocaleString('es-CL')} un.
                </span>
                <div style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: '2px' }}>
                  Cobertura del Equilibrio: <strong>{porcentajeCoberturaPE}%</strong>
                </div>
              </div>

              {/* Tarjeta 2: Ingresos Proyectados */}
              <div style={{ backgroundColor: '#0B0F17', border: '1px solid #1E293B', borderRadius: '8px', padding: '12px' }}>
                <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#0F766E', display: 'block', textTransform: 'uppercase' }}>
                  Ingresos Totales (Venta)
                </span>
                <span className="tabular-nums" style={{ fontSize: '18px', fontWeight: 800, color: '#0F766E' }}>
                  {formatCLP(valIngresoScrubber)}
                </span>
                <div style={{ fontSize: '11.5px', color: '#0F766E', marginTop: '2px' }}>
                  Precio Unitario: {formatCLP(pEfectivo)}
                </div>
              </div>

              {/* Tarjeta 3: Costos Totales */}
              <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '12px' }}>
                <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#DC2626', display: 'block', textTransform: 'uppercase' }}>
                  Costos Totales (CF + CV)
                </span>
                <span className="tabular-nums" style={{ fontSize: '18px', fontWeight: 800, color: '#DC2626' }}>
                  {formatCLP(valCostoTotalScrubber)}
                </span>
                <div style={{ fontSize: '11.5px', color: '#7F1D1D', marginTop: '2px' }}>
                  Fijos: {formatCLP(cfEfectivo)} | Variables: {formatCLP(valCostoVarScrubber)}
                </div>
              </div>

              {/* Tarjeta 4: Resultado Operacional Neto */}
              <div
                style={{
                  backgroundColor: estaEnGanancia ? '#ECFDF5' : '#FEF2F2',
                  border: `1.5px solid ${estaEnGanancia ? '#10B981' : '#EF4444'}`,
                  borderRadius: '8px',
                  padding: '12px',
                }}
              >
                <span
                  style={{
                    fontSize: '10.5px',
                    fontWeight: 700,
                    color: estaEnGanancia ? '#047857' : '#B91C1C',
                    display: 'block',
                    textTransform: 'uppercase',
                  }}
                >
                  {estaEnGanancia ? 'Zona de Ganancia Neta' : 'Zona de Déficit Operativo'}
                </span>
                <span
                  className="tabular-nums"
                  style={{
                    fontSize: '18px',
                    fontWeight: 800,
                    color: estaEnGanancia ? '#047857' : '#B91C1C',
                  }}
                >
                  {estaEnGanancia ? '+' : ''}{formatCLP(valResultadoScrubber)}
                </span>
                <div style={{ fontSize: '11.5px', color: estaEnGanancia ? '#065F46' : '#991B1B', marginTop: '2px' }}>
                  Margen Contribución: {formatCLP(valMargenContribucionScrubber)}
                </div>
              </div>
            </div>

            {/* Pie del Modal con Botón de Cierre */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '8px', borderTop: '1px solid #E2E8F0' }}>
              <button
                type="button"
                onClick={() => setModalAbierto(false)}
                className="btn-bacan-secondary"
                style={{
                  padding: '8px 20px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  borderRadius: '6px',
                  backgroundColor: '#0F172A',
                  color: '#FFFFFF',
                  border: 'none',
                }}
              >
                Cerrar Explorador
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}