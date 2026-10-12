import React from 'react';

export default function IlustracionMinimarket({ className = "w-full h-auto max-w-[280px]", ...props }) {
  return (
    <svg
      viewBox="0 0 320 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <defs>
        <linearGradient id="miniBg" x1="160" y1="20" x2="160" y2="220" gradientUnits="userSpaceOnUse">
          <stop stopColor="#10B981" stopOpacity="0.12" />
          <stop stopColor="#06B6D4" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id="miniBasket" x1="100" y1="90" x2="220" y2="180" gradientUnits="userSpaceOnUse">
          <stop stopColor="#10B981" />
          <stop stopColor="#059669" />
        </linearGradient>
        <linearGradient id="miniAccent" x1="130" y1="60" x2="190" y2="120" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F59E0B" />
          <stop stopColor="#D97706" />
        </linearGradient>
        <filter id="miniGlow" x="60" y="40" width="200" height="170" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feDropShadow dx="0" dy="14" stdDeviation="16" floodColor="#059669" floodOpacity="0.2" />
        </filter>
      </defs>

      {/* Halo de fondo */}
      <circle cx="160" cy="120" r="95" fill="url(#miniBg)" />

      <g filter="url(#miniGlow)">
        {/* Productos dentro del canasto */}
        {/* Botella / Envase */}
        <rect x="125" y="68" width="24" height="50" rx="6" fill="#38BDF8" />
        <rect x="131" y="58" width="12" height="10" rx="2" fill="#0284C7" />
        <rect x="128" y="86" width="18" height="16" rx="3" fill="#FFFFFF" fillOpacity="0.7" />

        {/* Caja de producto / Abarrote */}
        <rect x="156" y="60" width="34" height="60" rx="8" fill="url(#miniAccent)" />
        <circle cx="173" cy="80" r="7" fill="#FFFFFF" fillOpacity="0.4" />
        <rect x="163" y="94" width="20" height="4" rx="2" fill="#FFFFFF" fillOpacity="0.6" />

        {/* Manzana fresca / Frutería */}
        <circle cx="196" cy="106" r="14" fill="#EF4444" />
        <path d="M196 92 C196 95 198 97 200 96" stroke="#15803D" strokeWidth="2" strokeLinecap="round" />
        <ellipse cx="202" cy="94" rx="3" ry="1.5" fill="#22C55E" />

        {/* Canasta de compras moderna */}
        <path
          d="M95 110 H225 L212 174 C210.5 180 205 185 198 185 H122 C115 185 109.5 180 108 174 L95 110 Z"
          fill="url(#miniBasket)"
        />
        
        {/* Borde superior del canasto */}
        <rect x="88" y="104" width="144" height="10" rx="5" fill="#047857" />

        {/* Rejillas / Ranuras estilizadas del canasto */}
        <rect x="120" y="124" width="80" height="5" rx="2.5" fill="#FFFFFF" fillOpacity="0.3" />
        <rect x="125" y="139" width="70" height="5" rx="2.5" fill="#FFFFFF" fillOpacity="0.3" />
        <rect x="132" y="154" width="56" height="5" rx="2.5" fill="#FFFFFF" fillOpacity="0.3" />

        {/* Asa metálica plegada */}
        <path
          d="M112 106 C112 70 208 70 208 106"
          stroke="#94A3B8"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Etiqueta de precio / Código de barras flotante */}
        <rect x="75" y="78" width="38" height="24" rx="6" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
        <path d="M82 85 V95 M86 85 V95 M90 85 V95 M93 85 V95 M98 85 V95 M102 85 V95" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}