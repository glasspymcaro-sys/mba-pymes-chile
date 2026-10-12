import React from 'react';

export default function IlustracionServices({ className = "w-full h-auto max-w-[280px]", ...props }) {
  return (
    <svg
      viewBox="0 0 320 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <defs>
        <linearGradient id="servBg" x1="160" y1="20" x2="160" y2="220" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3B82F6" stopOpacity="0.12" />
          <stop stopColor="#6366F1" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id="servPrimary" x1="100" y1="60" x2="220" y2="180" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3B82F6" />
          <stop stopColor="#1D4ED8" />
        </linearGradient>
        <linearGradient id="servCard" x1="120" y1="80" x2="230" y2="190" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop stopColor="#F8FAFC" />
        </linearGradient>
        <filter id="servGlow" x="60" y="40" width="200" height="170" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feDropShadow dx="0" dy="14" stdDeviation="16" floodColor="#2563EB" floodOpacity="0.18" />
        </filter>
      </defs>

      {/* Fondo circular */}
      <circle cx="160" cy="120" r="95" fill="url(#servBg)" />

      <g filter="url(#servGlow)">
        {/* Tarjeta de soporte / consultoría de fondo */}
        <rect x="85" y="80" width="130" height="95" rx="14" fill="#EEF2FF" stroke="#C7D2FE" strokeWidth="1.5" />
        <rect x="100" y="98" width="50" height="6" rx="3" fill="#818CF8" />
        <rect x="100" y="112" width="80" height="4" rx="2" fill="#C7D2FE" />
        <rect x="100" y="122" width="65" height="4" rx="2" fill="#C7D2FE" />

        {/* Tarjeta frontal activa con gráfico de rendimiento */}
        <rect x="115" y="65" width="120" height="110" rx="16" fill="url(#servCard)" stroke="#E2E8F0" strokeWidth="2" />
        
        {/* Nodos y conexiones de consultoría */}
        <circle cx="140" cy="130" r="5" fill="#3B82F6" />
        <circle cx="175" cy="105" r="5" fill="#10B981" />
        <circle cx="210" cy="90" r="6" fill="#6366F1" />
        <path d="M140 130 L175 105 L210 90" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Badge de engranaje / optimización flotante */}
        <rect x="80" y="128" width="48" height="48" rx="12" fill="url(#servPrimary)" />
        <path
          d="M104 144 C99.6 144 96 147.6 96 152 C96 156.4 99.6 160 104 160 C108.4 160 112 156.4 112 152 C112 147.6 108.4 144 104 144ZM104 155 C102.3 155 101 153.7 101 152 C101 150.3 102.3 149 104 149 C105.7 149 107 150.3 107 152 C107 153.7 105.7 155 104 155Z"
          fill="#FFFFFF"
        />
        <path d="M103 141 H105 V143 H103 Z M103 161 H105 V163 H103 Z M93 151 H95 V153 H93 Z M113 151 H115 V153 H113 Z" fill="#FFFFFF" />

        {/* Indicador de check completado */}
        <circle cx="215" cy="150" r="12" fill="#10B981" />
        <path d="M211 150 L214 153 L220 147" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}