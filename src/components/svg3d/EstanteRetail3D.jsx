import React from 'react';

/**
 * Estantería / Góndola de Retail Tridimensional Isométrica en SVG Puro
 * Diseñada para el perfil de Minimarket: organiza los productos en exhibición para calcular costos directos.
 */
export default function EstanteRetail3D({ tamaño = 120, itemsEnEstante = [], alHacerClic, animando = false }) {
  const costoTotalEstante = itemsEnEstante.reduce(
    (acc, item) => acc + Number(item.costoCompra || item.costoUnitario || 0),
    0
  );

  return (
    <div
      onClick={alHacerClic}
      title="Góndola de Exhibición 3D • Asigna productos para determinar el costo de reposición directo"
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
            ? 'drop-shadow(0 14px 22px rgba(49, 130, 206, 0.35))'
            : 'drop-shadow(0 12px 18px rgba(0,0,0,0.18))',
          transform: animando ? 'scale(1.08)' : 'scale(1)',
          transition: 'all 0.3s ease',
        }}
      >
        <defs>
          <radialGradient id="sombraEstante" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1a202c" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#1a202c" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="metalEstante" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4a5568" />
            <stop offset="50%" stopColor="#718096" />
            <stop offset="100%" stopColor="#2d3748" />
          </linearGradient>

          <linearGradient id="maderaRepisa" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#d69e2e" />
            <stop offset="50%" stopColor="#ecc94b" />
            <stop offset="100%" stopColor="#b7791f" />
          </linearGradient>
        </defs>

        {/* 1. Sombra Suelo */}
        <ellipse cx="110" cy="210" rx="80" ry="16" fill="url(#sombraEstante)" />

        {/* 2. Postes Estructurales Isométricos */}
        {/* Poste Izquierdo Trasero */}
        <path d="M 40 40 L 46 36 L 46 195 L 40 199 Z" fill="#2d3748" />
        {/* Poste Derecho Trasero */}
        <path d="M 174 40 L 180 36 L 180 195 L 174 199 Z" fill="#2d3748" />
        {/* Poste Izquierdo Frontal */}
        <path d="M 28 60 L 34 56 L 34 205 L 28 209 Z" fill="#4a5568" />
        {/* Poste Derecho Frontal */}
        <path d="M 186 60 L 192 56 L 192 205 L 186 209 Z" fill="#4a5568" />

        {/* 3. Repisa Superior 3D */}
        <path d="M 28 60 L 40 40 L 180 40 L 186 60 Z" fill="url(#maderaRepisa)" />
        <path d="M 28 60 L 186 60 L 186 67 L 28 67 Z" fill="#975a16" />

        {/* 4. Repisa Intermedia 3D */}
        <path d="M 28 115 L 40 95 L 180 95 L 186 115 Z" fill="url(#maderaRepisa)" />
        <path d="M 28 115 L 186 115 L 186 122 L 28 122 Z" fill="#975a16" />

        {/* 5. Repisa Inferior 3D */}
        <path d="M 28 170 L 40 150 L 180 150 L 186 170 Z" fill="url(#maderaRepisa)" />
        <path d="M 28 170 L 186 170 L 186 177 L 28 177 Z" fill="#975a16" />

        {/* Cajas y productos en el estante si hay items */}
        {itemsEnEstante.length > 0 && (
          <g>
            {/* Producto en repisa intermedia */}
            <path d="M 60 90 L 75 80 L 95 80 L 80 90 Z" fill="#3182ce" />
            <path d="M 60 90 L 80 90 L 80 114 L 60 114 Z" fill="#2b6cb0" />
            <path d="M 80 90 L 95 80 L 95 104 L 80 114 Z" fill="#1a365d" />

            {/* Producto en repisa inferior */}
            <path d="M 120 145 L 135 135 L 155 135 L 140 145 Z" fill="#38a169" />
            <path d="M 120 145 L 140 145 L 140 169 L 120 169 Z" fill="#2f855a" />
            <path d="M 140 145 L 155 135 L 155 159 L 140 169 Z" fill="#1c4532" />
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
        Góndola Retail
      </span>

      <span
        style={{
          fontSize: '10.5px',
          fontWeight: '800',
          color: itemsEnEstante.length > 0 ? '#38a169' : 'var(--text-muted)',
          padding: '2px 8px',
          borderRadius: '6px',
          boxShadow: 'var(--neu-pressed)',
          marginTop: '2px',
        }}
      >
        {itemsEnEstante.length} {itemsEnEstante.length === 1 ? 'producto' : 'productos'} • ${Math.round(costoTotalEstante).toLocaleString('es-CL')}
      </span>
    </div>
  );
}
