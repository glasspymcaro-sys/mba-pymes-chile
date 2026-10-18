import React from 'react';

/**
 * Ilustración Vectorial Técnica de 3 Capas (bespoke-svg-craftsman)
 * Capa 1: Retícula técnica isométrica (<pattern>) con opacidad 0.06
 * Capa 2: Curvas Bezier de flujo de datos con strokeDasharray="3 3"
 * Capa 3: Nodos de punto focal con gradientes y precisión geométrica (strokeWidth="1.5")
 */
export default function TechnicalEmptyStateSVG({
  tipo = 'receta', // 'receta' | 'busqueda' | 'ia'
  titulo = 'Sistema en espera de parámetros',
  descripcion = 'Asigne o arrastre elementos al nodo central para inicializar el cálculo.',
}) {
  const uid = `tech-svg-${tipo}`;

  return (
    <div
      style={{
        border: '1px solid var(--color-border)',
        borderRadius: '10px',
        padding: '28px 20px',
        textAlign: 'center',
        backgroundColor: 'var(--color-surface)',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
      }}
    >
      <svg
        width="260"
        height="110"
        viewBox="0 0 260 110"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ maxWidth: '100%', height: 'auto', display: 'block' }}
      >
        <defs>
          {/* Capa 1: Patrón de Cuadrícula de Ingeniería */}
          <pattern id={`${uid}-grid`} width="20" height="20" patternUnits="userSpaceOnUse">
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="#09090B"
              strokeWidth="0.75"
              strokeOpacity="0.06"
            />
          </pattern>

          {/* Gradiente de Superficie Técnica */}
          <linearGradient id={`${uid}-node-grad`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0D9488" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#0F766E" stopOpacity="0.03" />
          </linearGradient>

          {/* Gradiente de Pulso Vectorial */}
          <linearGradient id={`${uid}-flow`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0D9488" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#0D9488" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#09090B" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Capa 1: Retícula Técnica de Fondo */}
        <rect x="4" y="4" width="252" height="102" rx="8" fill={`url(#${uid}-grid)`} />

        {/* Ejes cartesianos de referencia sutil */}
        <line x1="20" y1="55" x2="240" y2="55" stroke="#09090B" strokeOpacity="0.08" strokeWidth="1" strokeDasharray="2 3" />
        <line x1="130" y1="12" x2="130" y2="98" stroke="#09090B" strokeOpacity="0.08" strokeWidth="1" strokeDasharray="2 3" />

        {/* Capa 2: Curvas Bezier de Flujo de Datos */}
        <path
          d="M 38 76 C 75 76, 85 34, 130 55 C 175 76, 185 34, 222 34"
          stroke={`url(#${uid}-flow)`}
          strokeWidth="1.5"
          strokeDasharray="3 3"
          fill="none"
        />
        <path
          d="M 38 34 C 75 34, 90 55, 130 55 C 170 55, 185 76, 222 76"
          stroke="#09090B"
          strokeOpacity="0.18"
          strokeWidth="1.25"
          fill="none"
        />

        {/* Nodos Periféricos de Entrada/Salida */}
        <rect x="28" y="26" width="16" height="16" rx="4" fill="#FFFFFF" stroke="#09090B" strokeOpacity="0.3" strokeWidth="1.5" />
        <circle cx="36" cy="34" r="2.5" fill="#0D9488" />

        <rect x="28" y="68" width="16" height="16" rx="4" fill="#FFFFFF" stroke="#09090B" strokeOpacity="0.3" strokeWidth="1.5" />
        <circle cx="36" cy="76" r="2.5" fill="#52525B" />

        <rect x="216" y="26" width="16" height="16" rx="4" fill="#FFFFFF" stroke="#0D9488" strokeWidth="1.5" />
        <circle cx="224" cy="34" r="2.5" fill="#0D9488" />

        <rect x="216" y="68" width="16" height="16" rx="4" fill="#FFFFFF" stroke="#09090B" strokeOpacity="0.3" strokeWidth="1.5" />
        <circle cx="224" cy="76" r="2.5" fill="#52525B" />

        {/* Capa 3: Nodo Central de Procesamiento Isométrico */}
        <rect
          x="104"
          y="29"
          width="52"
          height="52"
          rx="10"
          fill="#FFFFFF"
          stroke="#0D9488"
          strokeWidth="1.5"
        />
        <rect
          x="108"
          y="33"
          width="44"
          height="44"
          rx="7"
          fill={`url(#${uid}-node-grad)`}
        />

        {tipo === 'receta' && (
          <g stroke="#0F766E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 130 42 L 118 49 L 130 56 L 142 49 Z" fill="#FFFFFF" />
            <path d="M 118 49 L 118 61 L 130 68 L 130 56" />
            <path d="M 142 49 L 142 61 L 130 68" />
          </g>
        )}

        {tipo === 'busqueda' && (
          <g stroke="#0F766E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="128" cy="53" r="8" fill="#FFFFFF" />
            <line x1="134" y1="59" x2="141" y2="66" />
          </g>
        )}

        {tipo === 'ia' && (
          <g stroke="#0F766E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="130 41 119 55 129 55 127 69 141 53 131 53 130 41" fill="#FFFFFF" />
          </g>
        )}
      </svg>

      <div style={{ maxWidth: '380px' }}>
        <h4
          style={{
            fontSize: '13.5px',
            fontWeight: 600,
            color: 'var(--color-foreground)',
            letterSpacing: '-0.015em',
            margin: '0 0 4px 0',
          }}
        >
          {titulo}
        </h4>
        <p style={{ fontSize: '12.5px', color: 'var(--color-muted-foreground)', lineHeight: 1.5, margin: 0 }}>
          {descripcion}
        </p>
      </div>
    </div>
  );
}
