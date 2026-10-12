import React from 'react';

/**
 * Estación de Trabajo / Mesa de Servicios Tridimensional Isométrica en SVG Puro
 * Diseñada para el perfil de Servicios: asigna honorarios, software y horas-hombre para calcular costos directos.
 */
export default function MesaServicios3D({ tamaño = 120, itemsEnMesa = [], alHacerClic, animando = false }) {
  const costoTotalMesa = itemsEnMesa.reduce(
    (acc, item) => acc + Number(item.costoTotal || item.costoUnitario || 0),
    0
  );

  return (
    <div
      onClick={alHacerClic}
      title="Mesa de Proyectos 3D • Asigna recursos de consultoría o desarrollo para consolidar costos directos"
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: alHacerClic ? 'pointer' : 'default',
        transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
        userSelect: 'none',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05) translateY(-3px)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1) translateY(0)')}
    >
      <svg
        width={tamaño}
        height={tamaño * 1.15}
        viewBox="0 0 220 230"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          overflow: 'visible',
          filter: animando
            ? 'drop-shadow(0 14px 22px rgba(128, 90, 213, 0.35))'
            : 'drop-shadow(0 12px 18px rgba(0,0,0,0.18))',
          transform: animando ? 'scale(1.08)' : 'scale(1)',
          transition: 'all 0.3s ease',
        }}
      >
        <defs>
          <radialGradient id="sombraMesa" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1a202c" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#1a202c" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="superficieMesa" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#cbd5e0" />
            <stop offset="50%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#a0aec0" />
          </linearGradient>

          <linearGradient id="pantallaMonitor" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3182ce" />
            <stop offset="100%" stopColor="#1a365d" />
          </linearGradient>
        </defs>

        {/* 1. Sombra Suelo */}
        <ellipse cx="110" cy="210" rx="80" ry="16" fill="url(#sombraMesa)" />

        {/* 2. Patas Isométricas de la Mesa */}
        <path d="M 38 135 L 44 130 L 44 200 L 38 205 Z" fill="#4a5568" />
        <path d="M 176 135 L 182 130 L 182 200 L 176 205 Z" fill="#4a5568" />
        <path d="M 106 150 L 112 145 L 112 210 L 106 215 Z" fill="#2d3748" />

        {/* 3. Tablero Isométrico 3D de la Mesa */}
        <path d="M 25 125 L 110 75 L 195 125 L 110 175 Z" fill="url(#superficieMesa)" />
        <path d="M 25 125 L 110 175 L 110 185 L 25 135 Z" fill="#718096" />
        <path d="M 110 175 L 195 125 L 195 135 L 110 185 Z" fill="#4a5568" />

        {/* 4. Monitor Isométrico 3D en la mesa */}
        {/* Base */}
        <ellipse cx="110" cy="115" rx="16" ry="6" fill="#4a5568" />
        <path d="M 108 115 L 108 95 L 112 95 L 112 115 Z" fill="#2d3748" />
        {/* Pantalla */}
        <path d="M 80 60 L 140 60 L 140 98 L 80 98 Z" fill="#1a202c" />
        <path d="M 83 63 L 137 63 L 137 95 L 83 95 Z" fill="url(#pantallaMonitor)" />
        {/* Gráfico 3D en pantalla */}
        <path d="M 90 85 L 105 75 L 120 80 L 130 70" stroke="#63b3ed" strokeWidth="2" fill="none" />

        {/* 5. Documentos / Proyectos asignados si hay items */}
        {itemsEnMesa.length > 0 && (
          <g>
            <path d="M 50 135 L 68 124 L 80 131 L 62 142 Z" fill="#ffffff" />
            <path d="M 54 135 L 65 128" stroke="#a0aec0" strokeWidth="1.5" />
            <path d="M 56 138 L 70 130" stroke="#a0aec0" strokeWidth="1.5" />
          </g>
        )}
      </svg>

      <span
        style={{
          marginTop: '6px',
          fontSize: '11px',
          fontWeight: '800',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.4px',
        }}
      >
        Mesa de Proyecto
      </span>

      <span
        style={{
          fontSize: '10.5px',
          fontWeight: '800',
          color: itemsEnMesa.length > 0 ? '#805ad5' : 'var(--text-muted)',
          padding: '2px 8px',
          borderRadius: '6px',
          boxShadow: 'var(--neu-pressed)',
          marginTop: '2px',
        }}
      >
        {itemsEnMesa.length} {itemsEnMesa.length === 1 ? 'recurso' : 'recursos'} • ${Math.round(costoTotalMesa).toLocaleString('es-CL')}
      </span>
    </div>
  );
}
