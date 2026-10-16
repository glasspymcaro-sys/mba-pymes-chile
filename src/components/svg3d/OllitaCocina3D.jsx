import React from 'react';
import InsumoFigura3D from './InsumoFigura3D.jsx';

/**
 * Ollita de Cocina Tridimensional Isométrica en SVG Puro con Integración 3D de Insumos
 * Diseñada para el perfil de Restaurante: acumula insumos en la receta y calcula el costo directo unitario.
 */
export default function OllitaCocina3D({ tamaño = 120, insumosEnOlla = [], alHacerClic, animando = false }) {
  const costoTotalOlla = insumosEnOlla.reduce((acc, item) => acc + Number(item.costoUnitario || item.costoTotal || 0), 0);

  return (
    <div
      onClick={alHacerClic}
      title="Ollita de Cocina 3D • Arrastra o asigna insumos para conformar el costo directo de la receta"
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
            ? 'drop-shadow(0 14px 22px rgba(229, 62, 62, 0.35))'
            : 'drop-shadow(0 12px 18px rgba(0,0,0,0.18))',
          transform: animando ? 'scale(1.08)' : 'scale(1)',
          transition: 'all 0.3s ease',
        }}
      >
        <defs>
          {/* Sombra de Suelo */}
          <radialGradient id="sombraSueloOlla" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1a202c" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#1a202c" stopOpacity="0" />
          </radialGradient>

          {/* Gradiente Cobre / Hierro Fundido de la Olla */}
          <linearGradient id="metalOlla" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7b341e" />
            <stop offset="25%" stopColor="#dd6b20" />
            <stop offset="55%" stopColor="#ed8936" />
            <stop offset="75%" stopColor="#c05621" />
            <stop offset="90%" stopColor="#7b341e" />
            <stop offset="100%" stopColor="#431407" />
          </linearGradient>

          {/* Gradiente de Borde Metálico */}
          <linearGradient id="bordeOlla" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#431407" />
            <stop offset="30%" stopColor="#feebc8" />
            <stop offset="60%" stopColor="#dd6b20" />
            <stop offset="100%" stopColor="#431407" />
          </linearGradient>

          {/* Gradiente del Caldo / Contenido Líquido */}
          <radialGradient id="caldoCoccion" cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#f6ad55" />
            <stop offset="60%" stopColor="#dd6b20" />
            <stop offset="100%" stopColor="#7b341e" />
          </radialGradient>

          {/* Asas Metálicas */}
          <linearGradient id="asaMetal" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#718096" />
            <stop offset="50%" stopColor="#cbd5e0" />
            <stop offset="100%" stopColor="#2d3748" />
          </linearGradient>
        </defs>

        {/* 1. Sombra Suelo */}
        <ellipse cx="110" cy="208" rx="75" ry="16" fill="url(#sombraSueloOlla)" />

        {/* 2. Vapor Vectorial Animado 3D */}
        <g opacity={insumosEnOlla.length > 0 ? 0.85 : 0.4}>
          <path
            d="M 85 60 C 80 40 95 30 90 12"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.6"
          />
          <path
            d="M 110 55 C 105 35 120 25 112 8"
            fill="none"
            stroke="#edf2f7"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.8"
          />
          <path
            d="M 135 60 C 130 40 145 30 138 12"
            fill="none"
            stroke="#cbd5e0"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.6"
          />
        </g>

        {/* 3. Asas 3D Laterales */}
        {/* Asa Izquierda */}
        <path
          d="M 38 105 C 18 105 16 130 38 132"
          fill="none"
          stroke="url(#asaMetal)"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M 38 106 C 22 106 20 128 38 130"
          fill="none"
          stroke="#edf2f7"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Asa Derecha */}
        <path
          d="M 182 105 C 202 105 204 130 182 132"
          fill="none"
          stroke="url(#asaMetal)"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M 182 106 C 198 106 200 128 182 130"
          fill="none"
          stroke="#edf2f7"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* 4. Cuerpo de la Olla (Panza volumétrica redondeada) */}
        <path
          d="M 38 85 Q 28 150 48 185 Q 110 216 172 185 Q 192 150 182 85 Q 110 115 38 85 Z"
          fill="url(#metalOlla)"
        />

        {/* Reflejo Curvo de Volumen 3D */}
        <path
          d="M 58 100 Q 50 145 68 175"
          fill="none"
          stroke="#feebc8"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.45"
        />

        {/* 5. Interior / Caldo de Cocción */}
        <ellipse cx="110" cy="85" rx="72" ry="20" fill="#431407" />
        <ellipse cx="110" cy="85" rx="70" ry="18" fill="url(#caldoCoccion)" />

        {/* Burbujitas o especias en el caldo si hay insumos */}
        {insumosEnOlla.length > 0 && (
          <g opacity="0.8">
            <circle cx="85" cy="84" r="3.5" fill="#feebc8" />
            <circle cx="125" cy="88" r="4.5" fill="#feebc8" />
            <circle cx="145" cy="82" r="3" fill="#fbd38d" />
            <circle cx="105" cy="80" r="2.5" fill="#fbd38d" />
          </g>
        )}

        {/* 6. Aro / Borde Superior 3D */}
        <ellipse
          cx="110"
          cy="85"
          rx="72"
          ry="20"
          fill="none"
          stroke="url(#bordeOlla)"
          strokeWidth="4.5"
        />
      </svg>

      {/* Miniaturas 3D fotorrealistas de los ingredientes adentro de la olla */}
      {insumosEnOlla.length > 0 && (
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
          {insumosEnOlla.slice(0, 4).map((ing, idx) => (
            <div
              key={ing.idAsignado || ing.id || idx}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 4px 10px rgba(0,0,0,0.22)',
                border: '1.5px solid #ffffff',
                backgroundColor: '#ffffff',
                transform: `rotate(${((idx % 2 === 0 ? 1 : -1) * (idx + 1) * 3)}deg)`,
                transition: 'transform 0.2s ease',
              }}
              title={`${ing.nombre} (${ing.cantidad || 1} ${ing.unidadMedida || 'un'})`}
            >
              <InsumoFigura3D nombre={ing.nombre} tamaño={32} imagenFalUrl={ing.imagenFalUrl} rubro="restaurant" tipologia={ing.tipologia} />
            </div>
          ))}
          {insumosEnOlla.length > 4 && (
            <span
              style={{
                fontSize: '10px',
                fontWeight: 700,
                color: '#ffffff',
                backgroundColor: 'var(--color-primary)',
                padding: '2px 6px',
                borderRadius: '10px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
              }}
            >
              +{insumosEnOlla.length - 4}
            </span>
          )}
        </div>
      )}

      <span
        style={{
          marginTop: insumosEnOlla.length > 0 ? '0px' : '6px',
          fontSize: '11px',
          fontWeight: '800',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.4px',
        }}
      >
        Ollita de Receta
      </span>

      <span
        style={{
          fontSize: '10.5px',
          fontWeight: '800',
          color: insumosEnOlla.length > 0 ? 'var(--primary-color)' : 'var(--text-muted)',
          padding: '2px 8px',
          borderRadius: '6px',
          boxShadow: 'var(--neu-pressed)',
          marginTop: '2px',
        }}
      >
        {insumosEnOlla.length} {insumosEnOlla.length === 1 ? 'insumo' : 'insumos'} • ${Math.round(costoTotalOlla).toLocaleString('es-CL')}
      </span>
    </div>
  );
}
