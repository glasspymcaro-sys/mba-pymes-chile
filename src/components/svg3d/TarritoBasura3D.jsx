import React from 'react';

/**
 * Tarrito de Basura Tridimensional Isométrico en SVG Puro
 * Diseñado con sombreado de gradientes, tapa volumétrica y relieve metálico.
 */
export default function TarritoBasura3D({ abierto = false, tamaño = 110, alHacerClic, itemsEnBasura = 0 }) {
  return (
    <div
      onClick={alHacerClic}
      title="Tarrito de Basura 3D • Arrastra o presiona para descartar insumos"
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
        viewBox="0 0 200 230"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible', filter: 'drop-shadow(0 12px 18px rgba(0,0,0,0.18))' }}
      >
        <defs>
          {/* Sombra de suelo */}
          <radialGradient id="sombraSueloBasura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1a202c" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#1a202c" stopOpacity="0" />
          </radialGradient>

          {/* Gradiente Metálico del Cuerpo Cilíndrico */}
          <linearGradient id="metalCuerpo" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#718096" />
            <stop offset="20%" stopColor="#cbd5e0" />
            <stop offset="45%" stopColor="#edf2f7" />
            <stop offset="70%" stopColor="#a0aec0" />
            <stop offset="90%" stopColor="#4a5568" />
            <stop offset="100%" stopColor="#2d3748" />
          </linearGradient>

          {/* Gradiente de Ranuras de Relieve */}
          <linearGradient id="ranuraSombra" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2d3748" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#edf2f7" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#1a202c" stopOpacity="0.7" />
          </linearGradient>

          {/* Gradiente de Tapa */}
          <linearGradient id="metalTapa" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#edf2f7" />
            <stop offset="40%" stopColor="#cbd5e0" />
            <stop offset="100%" stopColor="#4a5568" />
          </linearGradient>

          {/* Interior Oscuro del Tacho */}
          <radialGradient id="interiorTacho" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#2d3748" />
            <stop offset="80%" stopColor="#1a202c" />
            <stop offset="100%" stopColor="#0f172a" />
          </radialGradient>

          {/* Borde superior */}
          <linearGradient id="aroSuperior" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4a5568" />
            <stop offset="35%" stopColor="#edf2f7" />
            <stop offset="75%" stopColor="#a0aec0" />
            <stop offset="100%" stopColor="#2d3748" />
          </linearGradient>
        </defs>

        {/* 1. Sombra Proyectada en Suelo */}
        <ellipse cx="100" cy="210" rx="65" ry="16" fill="url(#sombraSueloBasura)" />

        {/* 2. Base Metálica Inferior */}
        <path d="M 45 190 Q 100 216 155 190 L 158 198 Q 100 224 42 198 Z" fill="#2d3748" />
        <ellipse cx="100" cy="190" rx="55" ry="12" fill="#718096" />

        {/* 3. Cuerpo Cilíndrico Principal */}
        <path
          d="M 45 75 L 45 190 Q 100 215 155 190 L 155 75 Q 100 100 45 75 Z"
          fill="url(#metalCuerpo)"
        />

        {/* 4. Ranuras de Relieve 3D (Acanalado industrial) */}
        <path d="M 65 83 L 65 186 Q 70 188 75 187 L 75 84 Z" fill="url(#ranuraSombra)" opacity="0.65" />
        <path d="M 95 87 L 95 193 Q 100 194 105 193 L 105 87 Z" fill="url(#ranuraSombra)" opacity="0.6" />
        <path d="M 125 83 L 125 186 Q 130 185 135 184 L 135 84 Z" fill="url(#ranuraSombra)" opacity="0.65" />

        {/* 5. Pedal Metálico 3D Inferior */}
        <path d="M 90 200 L 110 200 L 112 210 L 88 210 Z" fill="#4a5568" />
        <path d="M 88 206 L 112 206 L 110 210 L 90 210 Z" fill="#1a202c" />

        {/* 6. Aro Superior / Borde */}
        <ellipse cx="100" cy="75" rx="55" ry="14" fill="url(#interiorTacho)" />
        <ellipse cx="100" cy="75" rx="57" ry="15" fill="none" stroke="url(#aroSuperior)" strokeWidth="3" />

        {/* 7. Tapa 3D (Se abre o eleva según el estado `abierto`) */}
        <g
          style={{
            transformOrigin: '40px 60px',
            transform: abierto ? 'rotate(-28deg) translateY(-18px)' : 'rotate(0deg) translateY(0)',
            transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          {/* Asa de la tapa */}
          <path
            d="M 85 45 C 85 30 115 30 115 45"
            fill="none"
            stroke="url(#metalCuerpo)"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M 87 45 C 87 34 113 34 113 45"
            fill="none"
            stroke="#edf2f7"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Cúpula de la tapa */}
          <ellipse cx="100" cy="58" rx="60" ry="16" fill="url(#metalTapa)" />
          <ellipse cx="100" cy="55" rx="58" ry="14" fill="url(#metalCuerpo)" />
          <ellipse cx="100" cy="52" rx="42" ry="8" fill="#edf2f7" opacity="0.4" />
          <ellipse cx="100" cy="58" rx="60" ry="16" fill="none" stroke="#2d3748" strokeWidth="1.5" />
        </g>
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
        Tarrito Descarte
      </span>
      {itemsEnBasura > 0 && (
        <span
          style={{
            fontSize: '10px',
            fontWeight: '700',
            color: 'var(--accent-red)',
            padding: '2px 6px',
            borderRadius: '6px',
            boxShadow: 'var(--neu-pressed)',
            marginTop: '2px',
          }}
        >
          {itemsEnBasura} descartados
        </span>
      )}
    </div>
  );
}
