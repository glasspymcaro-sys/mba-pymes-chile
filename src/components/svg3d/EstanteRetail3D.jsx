import React from 'react';
import InsumoFigura3D from './InsumoFigura3D.jsx';

/**
 * Estantería / Góndola de Retail Tridimensional Isométrica en SVG Puro (threejs-pbr-architect)
 * Diseñada para el perfil de Minimarket: organiza los productos en exhibición con miniaturas 3D fotorrealistas.
 */
export default function EstanteRetail3D({ tamaño = 120, itemsEnEstante = [], alHacerClic, animando = false }) {
  const costoTotalEstante = itemsEnEstante.reduce(
    (acc, item) => acc + Number(item.costoCompra || item.costoUnitario || 0) * Number(item.cantidad || 1),
    0
  );

  return (
    <div
      onClick={alHacerClic}
      title="Góndola de Exhibición • Asigna productos para determinar el costo de reposición directo"
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: alHacerClic ? 'pointer' : 'default',
        transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
        userSelect: 'none',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04) translateY(-2px)')}
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
            ? 'drop-shadow(0 14px 22px rgba(13, 148, 136, 0.35))'
            : 'drop-shadow(0 10px 16px rgba(9, 9, 11, 0.14))',
          transform: animando ? 'scale(1.06)' : 'scale(1)',
          transition: 'all 0.25s ease',
        }}
      >
        <defs>
          <radialGradient id="sombraEstante" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#09090B" stopOpacity="0.38" />
            <stop offset="100%" stopColor="#09090B" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="maderaRepisa" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D97706" />
            <stop offset="50%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>
        </defs>

        {/* 1. Sombra Suelo */}
        <ellipse cx="110" cy="210" rx="80" ry="16" fill="url(#sombraEstante)" />

        {/* 2. Postes Estructurales Isométricos */}
        <path d="M 40 40 L 46 36 L 46 195 L 40 199 Z" fill="#27272A" />
        <path d="M 174 40 L 180 36 L 180 195 L 174 199 Z" fill="#27272A" />
        <path d="M 28 60 L 34 56 L 34 205 L 28 209 Z" fill="#52525B" />
        <path d="M 186 60 L 192 56 L 192 205 L 186 209 Z" fill="#52525B" />

        {/* 3. Repisa Superior 3D */}
        <path d="M 28 60 L 40 40 L 180 40 L 186 60 Z" fill="url(#maderaRepisa)" />
        <path d="M 28 60 L 186 60 L 186 67 L 28 67 Z" fill="#92400E" />

        {/* 4. Repisa Intermedia 3D */}
        <path d="M 28 115 L 40 95 L 180 95 L 186 115 Z" fill="url(#maderaRepisa)" />
        <path d="M 28 115 L 186 115 L 186 122 L 28 122 Z" fill="#92400E" />

        {/* 5. Repisa Inferior 3D */}
        <path d="M 28 170 L 40 150 L 180 150 L 186 170 Z" fill="url(#maderaRepisa)" />
        <path d="M 28 170 L 186 170 L 186 177 L 28 177 Z" fill="#92400E" />

        {itemsEnEstante.length > 0 && (
          <g>
            <path d="M 60 90 L 75 80 L 95 80 L 80 90 Z" fill="#0D9488" />
            <path d="M 60 90 L 80 90 L 80 114 L 60 114 Z" fill="#0F766E" />
            <path d="M 80 90 L 95 80 L 95 104 L 80 114 Z" fill="#134E4A" />

            <path d="M 120 145 L 135 135 L 155 135 L 140 145 Z" fill="#059669" />
            <path d="M 120 145 L 140 145 L 140 169 L 120 169 Z" fill="#047857" />
            <path d="M 140 145 L 155 135 L 155 159 L 140 169 Z" fill="#064E3B" />
          </g>
        )}
      </svg>

      {itemsEnEstante.length > 0 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            marginTop: '-18px',
            marginBottom: '6px',
            zIndex: 10,
            flexWrap: 'wrap',
            maxWidth: `${tamaño * 1.4}px`,
          }}
        >
          {itemsEnEstante.slice(0, 4).map((ing, idx) => (
            <div
              key={ing.idAsignado || ing.id || idx}
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '7px',
                overflow: 'hidden',
                boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                border: '1.5px solid #FFFFFF',
                backgroundColor: '#FFFFFF',
              }}
              title={ing.nombre}
            >
              <InsumoFigura3D nombre={ing.nombre} tamaño={30} imagenFalUrl={ing.imagenFalUrl} rubro="minimarket" tipologia={ing.tipologia} />
            </div>
          ))}
        </div>
      )}

      <span
        style={{
          marginTop: itemsEnEstante.length > 0 ? '0px' : '6px',
          fontSize: '10.5px',
          fontWeight: 700,
          color: 'var(--color-muted-foreground)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        Góndola Retail
      </span>

      <span
        className="tabular-nums"
        style={{
          fontSize: '10.5px',
          fontWeight: 700,
          color: itemsEnEstante.length > 0 ? 'var(--color-primary)' : 'var(--color-muted-foreground)',
          padding: '2px 8px',
          borderRadius: '6px',
          backgroundColor: '#F4F4F5',
          marginTop: '2px',
        }}
      >
        {itemsEnEstante.length} {itemsEnEstante.length === 1 ? 'producto' : 'productos'} • ${Math.round(costoTotalEstante).toLocaleString('es-CL')}
      </span>
    </div>
  );
}
