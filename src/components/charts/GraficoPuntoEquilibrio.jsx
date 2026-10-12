import React, { useState } from 'react';
import { formatCLP, formatCompactCLP } from '../../utils/formatters.js';

export default function GraficoPuntoEquilibrio({ datos = [], puntoEquilibrioUnidades = 0 }) {
  const [hoverIndex, setHoverIndex] = useState(null);

  if (!datos || datos.length === 0) {
    return (
      <div style={{ height: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-muted-foreground)', fontSize: '13px' }}>
        No hay datos suficientes para proyectar el gráfico.
      </div>
    );
  }

  const width = 800;
  const height = 380;
  const padding = { top: 35, right: 30, bottom: 45, left: 75 };

  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const maxUnidades = Math.max(...datos.map((d) => d.unidades), 10);
  const maxMonto = Math.max(...datos.map((d) => Math.max(d.ingresos, d.costos)), 1000) * 1.15;

  const getX = (unidades) => padding.left + (unidades / maxUnidades) * chartW;
  const getY = (monto) => height - padding.bottom - (monto / maxMonto) * chartH;

  const pathIngresos = datos.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(d.unidades)} ${getY(d.ingresos)}`).join(' ');
  const pathCostos = datos.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(d.unidades)} ${getY(d.costos)}`).join(' ');

  const areaIngresos = `${pathIngresos} L ${getX(datos[datos.length - 1].unidades)} ${height - padding.bottom} L ${getX(0)} ${height - padding.bottom} Z`;

  // Coordenadas del Punto de Equilibrio
  const peX = getX(puntoEquilibrioUnidades);
  const montoPeEstimado = datos.find((d) => d.unidades >= puntoEquilibrioUnidades)?.costos || (maxMonto * 0.5);
  const peY = getY(montoPeEstimado);

  const yTicks = [0, maxMonto * 0.25, maxMonto * 0.5, maxMonto * 0.75, maxMonto];

  const badgeLeyendaStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    borderRadius: '6px',
    border: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-surface)',
    fontSize: '11.5px',
    fontWeight: 600,
    color: 'var(--color-foreground)',
  };

  const activePoint = hoverIndex !== null ? datos[hoverIndex] : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative' }}>
      {/* Encabezado y Leyenda Superior según Sección 10 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-foreground)', margin: '0 0 2px 0' }}>
            Curva de Umbral de Rentabilidad
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--color-muted-foreground)', margin: 0 }}>
            Cruce de ingresos por ventas vs. costos totales operacionales
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={badgeLeyendaStyle}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0D9488', display: 'inline-block' }} />
            <span>Ingresos (Brand 600)</span>
          </div>
          <div style={badgeLeyendaStyle}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#B91C1C', display: 'inline-block' }} />
            <span>Costos Totales</span>
          </div>
          <div style={{ ...badgeLeyendaStyle, borderColor: 'var(--color-brand-200)', backgroundColor: 'var(--color-brand-50)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-brand-700)', display: 'inline-block' }} />
            <span style={{ color: 'var(--color-brand-900)' }}>
              PE: {puntoEquilibrioUnidades.toLocaleString('es-CL')} un.
            </span>
          </div>
        </div>
      </div>

      {/* Contenedor del Gráfico SVG Responsive */}
      <div
        style={{
          width: '100%',
          borderRadius: '10px',
          border: '1px solid var(--color-border)',
          backgroundColor: '#ffffff',
          position: 'relative',
          padding: '12px 6px',
          boxSizing: 'border-box',
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
            <linearGradient id="gradIngresosGuia" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0D9488" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#0D9488" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Área sombreada bajo la curva de ingresos */}
          <path d={areaIngresos} fill="url(#gradIngresosGuia)" />

          {/* Grilla horizontal sutil (slate-200) */}
          {yTicks.map((val, idx) => (
            <g key={idx}>
              <line
                x1={padding.left}
                y1={getY(val)}
                x2={width - padding.right}
                y2={getY(val)}
                stroke="#E2E8F0"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text
                x={padding.left - 10}
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

          {/* Líneas Guía Verticales para cada punto de dato */}
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
                y={height - padding.bottom + 20}
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

          {/* Curva de Costos Totales (#B91C1C) */}
          <path
            d={pathCostos}
            fill="none"
            stroke="#B91C1C"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Curva de Ingresos (#0D9488 - Brand 600) */}
          <path
            d={pathIngresos}
            fill="none"
            stroke="#0D9488"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Línea vertical indicadora del Punto de Equilibrio */}
          {puntoEquilibrioUnidades > 0 && puntoEquilibrioUnidades <= maxUnidades && (
            <g>
              <line
                x1={peX}
                y1={padding.top}
                x2={peX}
                y2={height - padding.bottom}
                stroke="#0F766E"
                strokeWidth="2"
                strokeDasharray="5 4"
              />
              <circle cx={peX} cy={peY} r="7" fill="#0F766E" stroke="#ffffff" strokeWidth="2.5" />
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
                r={hoverIndex === idx ? 6 : 4}
                fill="#0D9488"
                stroke="#ffffff"
                strokeWidth="2"
              />
              <circle
                cx={getX(d.unidades)}
                cy={getY(d.costos)}
                r={hoverIndex === idx ? 6 : 4}
                fill="#B91C1C"
                stroke="#ffffff"
                strokeWidth="2"
              />
            </g>
          ))}
        </svg>

        {/* Tooltip Dinámico */}
        {activePoint && (
          <div
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              padding: '8px 12px',
              boxShadow: 'var(--shadow-popover)',
              fontSize: '11.5px',
              pointerEvents: 'none',
              zIndex: 10,
            }}
          >
            <div style={{ fontWeight: 700, color: 'var(--color-foreground)', marginBottom: '4px' }}>
              Volumen: {activePoint.unidades} unidades
            </div>
            <div style={{ color: '#0D9488', fontWeight: 600 }}>
              Ingresos: {formatCLP(activePoint.ingresos)}
            </div>
            <div style={{ color: '#B91C1C', fontWeight: 600 }}>
              Costos: {formatCLP(activePoint.costos)}
            </div>
          </div>
        )}
      </div>

      {/* Conclusión del gráfico según Sección 10 */}
      <div
        style={{
          fontSize: '12.5px',
          color: 'var(--color-muted-foreground)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <span>
          A partir de <strong>{puntoEquilibrioUnidades.toLocaleString('es-CL')} unidades</strong> comercializadas, los ingresos cubren la totalidad de los costos fijos y cada venta adicional genera utilidad operacional neta.
        </span>
      </div>
    </div>
  );
}