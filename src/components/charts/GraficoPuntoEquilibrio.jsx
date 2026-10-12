import React, { useState } from 'react';
import { formatearCLP } from '../../utils/formatters.js';

export default function GraficoPuntoEquilibrio({ datos = [], puntoEquilibrioUnidades = 0 }) {
  const [hoverData, setHoverData] = useState(null);

  if (!datos || datos.length === 0) {
    return (
      <div style={{ height: '360px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
        No hay datos suficientes para proyectar el gráfico.
      </div>
    );
  }

  const width = 800;
  const height = 400;
  const padding = { top: 50, right: 45, bottom: 55, left: 95 };

  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const maxUnidades = Math.max(...datos.map((d) => d.unidades), 10);
  const maxMonto = Math.max(...datos.map((d) => Math.max(d.ingresos, d.costos)), 1000) * 1.15;

  const getX = (unidades) => padding.left + (unidades / maxUnidades) * chartW;
  const getY = (monto) => height - padding.bottom - (monto / maxMonto) * chartH;

  const pathIngresos = datos.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(d.unidades)} ${getY(d.ingresos)}`).join(' ');
  const pathCostos = datos.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(d.unidades)} ${getY(d.costos)}`).join(' ');

  // Áreas sombreadas bajo las curvas
  const areaIngresos = `${pathIngresos} L ${getX(datos[datos.length - 1].unidades)} ${height - padding.bottom} L ${getX(0)} ${height - padding.bottom} Z`;

  // Coordenadas del Punto de Equilibrio
  const peX = getX(puntoEquilibrioUnidades);
  const montoPeEstimado = datos.find((d) => d.unidades >= puntoEquilibrioUnidades)?.costos || (maxMonto * 0.5);
  const peY = getY(montoPeEstimado);

  const formatEjeY = (num) => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `$${Math.round(num / 1000)}k`;
    return `$${Math.round(num)}`;
  };

  const yTicks = [0, maxMonto * 0.25, maxMonto * 0.5, maxMonto * 0.75, maxMonto];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
      
      {/* Encabezado y Leyenda Superior */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '17px', fontWeight: 900, color: '#1a202c', margin: '0 0 2px 0' }}>
            Curva de Umbral de Rentabilidad
          </h3>
          <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: 0 }}>
            Proyección del Punto de Equilibrio Operativo
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={badgeLeyendaStyle}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#38a169', display: 'inline-block' }} />
            <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#2d3748' }}>Ingresos</span>
          </div>
          <div style={badgeLeyendaStyle}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#e53e3e', display: 'inline-block' }} />
            <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#2d3748' }}>Costos Totales</span>
          </div>
          <div style={{ ...badgeLeyendaStyle, background: '#ebf8ff', border: '1px solid #bee3f8' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#3182ce', display: 'inline-block' }} />
            <span style={{ fontSize: '11.5px', fontWeight: 900, color: '#2b6cb0' }}>
              P.E. ({puntoEquilibrioUnidades.toLocaleString('es-CL')} un.)
            </span>
          </div>
        </div>
      </div>

      {/* Contenedor Neumórfico SVG */}
      <div
        style={{
          width: '100%',
          overflowX: 'auto',
          borderRadius: '20px',
          padding: '16px 10px',
          background: 'var(--bg-neumorphic)',
          boxShadow: 'var(--neu-pressed)',
          position: 'relative',
          boxSizing: 'border-box',
        }}
      >
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', minWidth: '680px', display: 'block' }}>
          <defs>
            <linearGradient id="gradIngresosPyme" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38a169" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#38a169" stopOpacity="0.0" />
            </linearGradient>

            <filter id="shadowCurva" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000000" floodOpacity="0.14" />
            </filter>
          </defs>

          {/* Área de Ingresos */}
          <path d={areaIngresos} fill="url(#gradIngresosPyme)" />

          {/* Grilla Horizontal */}
          {yTicks.map((val, idx) => (
            <g key={idx}>
              <line
                x1={padding.left}
                y1={getY(val)}
                x2={width - padding.right}
                y2={getY(val)}
                stroke="#cbd5e0"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text
                x={padding.left - 14}
                y={getY(val) + 4}
                textAnchor="end"
                fontSize="11"
                fontWeight="800"
                fill="#718096"
              >
                {formatEjeY(val)}
              </text>
            </g>
          ))}

          {/* Eje Base Horizontal */}
          <line
            x1={padding.left}
            y1={height - padding.bottom}
            x2={width - padding.right}
            y2={height - padding.bottom}
            stroke="#a0aec0"
            strokeWidth="1.5"
          />

          {/* Etiquetas Eje X */}
          {datos.map((d, i) => (
            <text
              key={i}
              x={getX(d.unidades)}
              y={height - padding.bottom + 22}
              textAnchor="middle"
              fontSize="11"
              fontWeight="700"
              fill="#718096"
            >
              {d.unidades.toLocaleString('es-CL')}
            </text>
          ))}

          {/* Línea de Costos Totales */}
          <path
            d={pathCostos}
            fill="none"
            stroke="#e53e3e"
            strokeWidth="3.5"
            strokeLinecap="round"
            filter="url(#shadowCurva)"
          />

          {/* Línea de Ingresos */}
          <path
            d={pathIngresos}
            fill="none"
            stroke="#38a169"
            strokeWidth="3.5"
            strokeLinecap="round"
            filter="url(#shadowCurva)"
          />

          {/* Punto de Equilibrio Visual */}
          {puntoEquilibrioUnidades > 0 && peX <= width - padding.right && (
            <g>
              <line
                x1={peX}
                y1={peY}
                x2={peX}
                y2={height - padding.bottom}
                stroke="#3182ce"
                strokeWidth="2.5"
                strokeDasharray="4 4"
              />

              {/* Anillos concéntricos */}
              <circle cx={peX} cy={peY} r="16" fill="#3182ce" fillOpacity="0.18" />
              <circle cx={peX} cy={peY} r="10" fill="#ffffff" stroke="#3182ce" strokeWidth="3.5" />
              <circle cx={peX} cy={peY} r="4.5" fill="#3182ce" />

              {/* Tag Superior */}
              <g transform={`translate(${peX}, ${Math.max(peY - 14, padding.top - 10)})`}>
                <rect
                  x="-52"
                  y="-22"
                  width="104"
                  height="22"
                  rx="6"
                  fill="#1a202c"
                  filter="drop-shadow(0px 3px 6px rgba(0,0,0,0.2))"
                />
                <text
                  x="0"
                  y="-7"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="10"
                  fontWeight="900"
                  letterSpacing="0.4px"
                >
                  P.E. {puntoEquilibrioUnidades.toLocaleString('es-CL')} un.
                </text>
              </g>

              {/* Indicador en el eje X */}
              <text
                x={peX}
                y={height - padding.bottom + 38}
                textAnchor="middle"
                fontSize="11.5"
                fontWeight="900"
                fill="#3182ce"
              >
                ▲ {puntoEquilibrioUnidades.toLocaleString('es-CL')} un.
              </text>
            </g>
          )}

          {/* Nodos Interactivos */}
          {datos.map((d, i) => {
            const x = getX(d.unidades);
            const yIng = getY(d.ingresos);
            const yCost = getY(d.costos);

            return (
              <g
                key={i}
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoverData(d)}
                onMouseLeave={() => setHoverData(null)}
              >
                <circle cx={x} cy={yIng} r="5" fill="#38a169" stroke="#ffffff" strokeWidth="1.5" />
                <circle cx={x} cy={yCost} r="5" fill="#e53e3e" stroke="#ffffff" strokeWidth="1.5" />
                <rect x={x - 15} y={padding.top} width="30" height={chartH} fill="transparent" />
              </g>
            );
          })}
        </svg>

        {/* Tooltip Flotante */}
        {hoverData && (
          <div
            style={{
              position: 'absolute',
              top: '16px',
              left: `${Math.min(Math.max(getX(hoverData.unidades) - 80, 20), chartW - 60)}px`,
              background: '#1a202c',
              color: '#ffffff',
              padding: '8px 14px',
              borderRadius: '10px',
              fontSize: '11.5px',
              pointerEvents: 'none',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              gap: '3px',
              boxShadow: '0 8px 16px rgba(0,0,0,0.25)'
            }}
          >
            <strong style={{ color: '#e2e8f0', borderBottom: '1px solid #4a5568', paddingBottom: '3px' }}>
              Volumen: {hoverData.unidades.toLocaleString('es-CL')} un.
            </strong>
            <span style={{ color: '#68d391' }}>Ingresos: {formatearCLP(hoverData.ingresos)}</span>
            <span style={{ color: '#fc8181' }}>Costos: {formatearCLP(hoverData.costos)}</span>
            <span style={{ color: hoverData.ingresos >= hoverData.costos ? '#63b3ed' : '#f6ad55', fontWeight: 800 }}>
              Resultado: {formatearCLP(hoverData.ingresos - hoverData.costos)}
            </span>
          </div>
        )}
      </div>

      <div style={{ textAlign: 'center', fontSize: '11.5px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
        Volumen Mensual de Unidades Vendidas
      </div>
    </div>
  );
}

const badgeLeyendaStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  padding: '6px 12px',
  borderRadius: '10px',
  background: 'var(--bg-neumorphic)',
  boxShadow: 'var(--neu-flat-sm)',
};