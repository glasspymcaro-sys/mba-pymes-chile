import React, { useState } from 'react';
import { formatCLP, formatCompactCLP } from '../../utils/formatters.js';

/**
 * Gráfico Ejecutivo de Punto de Equilibrio con Iluminación PBR y Zonificación de Rentabilidad
 * Visualiza el umbral crítico, la zona de déficit operativo y la zona de beneficio neto con estética institucional.
 */
export default function GraficoPuntoEquilibrio({ datos = [], puntoEquilibrioUnidades = 0 }) {
  const [hoverIndex, setHoverIndex] = useState(null);

  if (!datos || datos.length === 0) {
    return (
      <div style={{ height: '340px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-muted-foreground)', fontSize: '13px' }}>
        No hay datos suficientes para proyectar el gráfico.
      </div>
    );
  }

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

  // Coordenadas del Punto de Equilibrio
  const peX = getX(puntoEquilibrioUnidades);
  const primerDatoSobrePe = datos.find((d) => d.unidades >= puntoEquilibrioUnidades);
  const montoPeEstimado = primerDatoSobrePe ? primerDatoSobrePe.costos : maxMonto * 0.5;
  const peY = getY(montoPeEstimado);

  // Polígono de Utilidad Neta (Zona a la derecha del Punto de Equilibrio donde Ingresos > Costos)
  const datosPostPe = datos.filter((d) => d.unidades >= puntoEquilibrioUnidades);
  let areaUtilidad = '';
  if (datosPostPe.length > 0 && puntoEquilibrioUnidades <= maxUnidades) {
    const ptsIngresos = datosPostPe.map((d) => `L ${getX(d.unidades)} ${getY(d.ingresos)}`).join(' ');
    const ptsCostosRev = [...datosPostPe].reverse().map((d) => `L ${getX(d.unidades)} ${getY(d.costos)}`).join(' ');
    areaUtilidad = `M ${peX} ${peY} ${ptsIngresos} ${ptsCostosRev} Z`;
  }

  // Polígono de Déficit Operativo (Zona a la izquierda del Punto de Equilibrio donde Costos > Ingresos)
  const datosPrePe = datos.filter((d) => d.unidades <= puntoEquilibrioUnidades);
  let areaDeficit = '';
  if (datosPrePe.length > 0 && puntoEquilibrioUnidades > 0) {
    const ptsCostos = datosPrePe.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(d.unidades)} ${getY(d.costos)}`).join(' ');
    const ptsIngresosRev = [...datosPrePe].reverse().map((d) => `L ${getX(d.unidades)} ${getY(d.ingresos)}`).join(' ');
    areaDeficit = `${ptsCostos} L ${peX} ${peY} ${ptsIngresosRev} Z`;
  }

  const yTicks = [0, maxMonto * 0.25, maxMonto * 0.5, maxMonto * 0.75, maxMonto];
  const activePoint = hoverIndex !== null ? datos[hoverIndex] : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative' }}>
      {/* Encabezado y Leyenda Superior PBR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <span style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Análisis de Viabilidad & Umbral de Retorno
          </span>
          <h3 className="heading-tight" style={{ fontSize: '17px', fontWeight: 600, color: 'var(--color-foreground)', margin: '2px 0 0 0' }}>
            Curva de Umbral de Rentabilidad (Break-Even)
          </h3>
          <p style={{ fontSize: '12.5px', color: 'var(--color-muted-foreground)', margin: '2px 0 0 0' }}>
            Zonificación dinámica: Área de absorción de costos fijos vs. vector de generación de utilidades
          </p>
        </div>

        {/* Badges de Leyenda y Estado */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '6px',
              border: '1px solid var(--color-border)',
              backgroundColor: '#FFFFFF',
              fontSize: '11.5px',
              fontWeight: 600,
              color: 'var(--color-foreground)',
            }}
          >
            <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'linear-gradient(135deg, #0F766E, #14B8A6)', display: 'inline-block' }} />
            <span>Ingresos por Ventas</span>
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '6px',
              border: '1px solid var(--color-border)',
              backgroundColor: '#FFFFFF',
              fontSize: '11.5px',
              fontWeight: 600,
              color: 'var(--color-foreground)',
            }}
          >
            <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'linear-gradient(135deg, #DC2626, #F87171)', display: 'inline-block' }} />
            <span>Costos Totales (CF + CV)</span>
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '6px',
              border: '1px solid var(--color-brand-300)',
              backgroundColor: 'var(--color-brand-50)',
              fontSize: '12px',
              fontWeight: 700,
              color: 'var(--color-brand-900)',
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-brand-700)', display: 'inline-block', boxShadow: '0 0 0 2px rgba(15,118,110,0.25)' }} />
            <span>PE: {puntoEquilibrioUnidades.toLocaleString('es-CL')} un.</span>
          </div>
        </div>
      </div>

      {/* Contenedor del Gráfico SVG Responsive con Sombras de Estudio */}
      <div
        style={{
          width: '100%',
          borderRadius: '10px',
          border: '1px solid var(--color-border)',
          backgroundColor: '#FFFFFF',
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
            {/* Gradiente multi-stop para zona de utilidad neta */}
            <linearGradient id="pbrGradUtilidad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0F766E" stopOpacity="0.28" />
              <stop offset="60%" stopColor="#14B8A6" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#2DD4BF" stopOpacity="0.04" />
            </linearGradient>

            {/* Gradiente para zona de déficit operativo */}
            <linearGradient id="pbrGradDeficit" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#EF4444" stopOpacity="0.18" />
              <stop offset="70%" stopColor="#F87171" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#FCA5A5" stopOpacity="0.02" />
            </linearGradient>

            {/* Sombra de punto de equilibrio */}
            <filter id="pbrPuntoSombra" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#0F766E" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Área sombreada de déficit previo al PE */}
          {areaDeficit && <path d={areaDeficit} fill="url(#pbrGradDeficit)" />}

          {/* Área sombreada de utilidad neta posterior al PE */}
          {areaUtilidad && <path d={areaUtilidad} fill="url(#pbrGradUtilidad)" />}

          {/* Grilla horizontal de precisión financiera */}
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

              {/* Anillo de pulso visual */}
              <circle cx={peX} cy={peY} r="12" fill="#0F766E" fillOpacity="0.12" />
              <circle cx={peX} cy={peY} r="8" fill="#0F766E" stroke="#FFFFFF" strokeWidth="2.5" filter="url(#pbrPuntoSombra)" />

              {/* Pin flotante con etiqueta técnica */}
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

        {/* Tooltip Dinámico Flotante */}
        {activePoint && (
          <div
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              backgroundColor: '#FFFFFF',
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
          gap: '8px',
          padding: '10px 14px',
          backgroundColor: '#FAFAFA',
          borderRadius: '8px',
          border: '1px solid var(--color-border)',
        }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <span>
          A partir de <strong style={{ color: 'var(--color-foreground)' }}>{puntoEquilibrioUnidades.toLocaleString('es-CL')} unidades</strong> comercializadas, los ingresos cubren íntegramente la estructura de costos fijos y el negocio entra en zona de beneficio operacional neta.
        </span>
      </div>
    </div>
  );
}