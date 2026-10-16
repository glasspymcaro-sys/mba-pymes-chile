import React from 'react';
import InsumoFigura3D from './InsumoFigura3D.jsx';

/**
 * Estación de Trabajo / Mesa de Servicios Tridimensional Isométrica en SVG Puro (threejs-pbr-architect)
 * Diseñada para el perfil de Servicios: asigna honorarios, software y horas-hombre para calcular costos directos.
 */
export default function MesaServicios3D({ tamaño = 120, itemsEnMesa = [], alHacerClic, animando = false }) {
  const costoTotalMesa = itemsEnMesa.reduce(
    (acc, item) => acc + Number(item.costoTotal || item.costoUnitario || 0) * Number(item.cantidad || 1),
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
          <radialGradient id="sombraMesa" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#09090B" stopOpacity="0.38" />
            <stop offset="100%" stopColor="#09090B" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="superficieMesa" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E4E4E7" />
            <stop offset="50%" stopColor="#FAFAFA" />
            <stop offset="100%" stopColor="#A1A1AA" />
          </linearGradient>

          <linearGradient id="pantallaMonitor" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0D9488" />
            <stop offset="100%" stopColor="#134E4A" />
          </linearGradient>
        </defs>

        {/* 1. Sombra Suelo */}
        <ellipse cx="110" cy="210" rx="80" ry="16" fill="url(#sombraMesa)" />

        {/* 2. Patas Isométricas de la Mesa */}
        <path d="M 38 135 L 44 130 L 44 200 L 38 205 Z" fill="#52525B" />
        <path d="M 176 135 L 182 130 L 182 200 L 176 205 Z" fill="#52525B" />
        <path d="M 106 150 L 112 145 L 112 210 L 106 215 Z" fill="#27272A" />

        {/* 3. Tablero Isométrico 3D de la Mesa */}
        <path d="M 25 125 L 110 75 L 195 125 L 110 175 Z" fill="url(#superficieMesa)" />
        <path d="M 25 125 L 110 175 L 110 185 L 25 135 Z" fill="#71717A" />
        <path d="M 110 175 L 195 125 L 195 135 L 110 185 Z" fill="#52525B" />

        {/* 4. Monitor Isométrico 3D en la mesa */}
        <ellipse cx="110" cy="115" rx="16" ry="6" fill="#52525B" />
        <path d="M 108 115 L 108 95 L 112 95 L 112 115 Z" fill="#27272A" />
        <path d="M 80 60 L 140 60 L 140 98 L 80 98 Z" fill="#09090B" />
        <path d="M 83 63 L 137 63 L 137 95 L 83 95 Z" fill="url(#pantallaMonitor)" />
        <path d="M 90 85 L 105 75 L 120 80 L 130 70" stroke="#5EEAD4" strokeWidth="1.75" fill="none" />

        {itemsEnMesa.length > 0 && (
          <g>
            <path d="M 50 135 L 68 124 L 80 131 L 62 142 Z" fill="#FFFFFF" />
            <path d="M 54 135 L 65 128" stroke="#A1A1AA" strokeWidth="1.5" />
            <path d="M 56 138 L 70 130" stroke="#A1A1AA" strokeWidth="1.5" />
          </g>
        )}
      </svg>

      {itemsEnMesa.length > 0 && (
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
          {itemsEnMesa.slice(0, 4).map((ing, idx) => (
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
              <InsumoFigura3D nombre={ing.nombre} tamaño={30} imagenFalUrl={ing.imagenFalUrl} rubro="services" tipologia={ing.tipologia} />
            </div>
          ))}
        </div>
      )}

      <span
        style={{
          marginTop: itemsEnMesa.length > 0 ? '0px' : '6px',
          fontSize: '10.5px',
          fontWeight: 700,
          color: 'var(--color-muted-foreground)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        Mesa de Proyecto
      </span>

      <span
        className="tabular-nums"
        style={{
          fontSize: '10.5px',
          fontWeight: 700,
          color: itemsEnMesa.length > 0 ? 'var(--color-primary)' : 'var(--color-muted-foreground)',
          padding: '2px 8px',
          borderRadius: '6px',
          backgroundColor: '#F4F4F5',
          marginTop: '2px',
        }}
      >
        {itemsEnMesa.length} {itemsEnMesa.length === 1 ? 'recurso' : 'recursos'} • ${Math.round(costoTotalMesa).toLocaleString('es-CL')}
      </span>
    </div>
  );
}
