import React from 'react';

export default function IlustracionRestaurant({ className = "w-full h-auto max-w-[280px]", ...props }) {
  return (
    <svg
      viewBox="0 0 320 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <defs>
        <linearGradient id="restBg" x1="160" y1="20" x2="160" y2="220" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF6B4A" stopOpacity="0.12" />
          <stop stopColor="#FF9F43" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id="restPlate" x1="100" y1="120" x2="220" y2="200" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop stopColor="#F1F5F9" />
        </linearGradient>
        <linearGradient id="restCloche" x1="110" y1="70" x2="210" y2="160" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF7A59" />
          <stop stopColor="#EA4335" />
        </linearGradient>
        <linearGradient id="restAccent" x1="140" y1="50" x2="180" y2="90" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFD166" />
          <stop stopColor="#FA8C16" />
        </linearGradient>
        <filter id="restGlow" x="60" y="40" width="200" height="170" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#EA4335" floodOpacity="0.2" />
        </filter>
      </defs>

      {/* Halo de fondo */}
      <circle cx="160" cy="120" r="95" fill="url(#restBg)" />
      
      {/* Base plato con sombra */}
      <g filter="url(#restGlow)">
        {/* Plato exterior */}
        <ellipse cx="160" cy="172" rx="90" ry="20" fill="url(#restPlate)" stroke="#E2E8F0" strokeWidth="2" />
        {/* Borde interior del plato */}
        <ellipse cx="160" cy="170" rx="72" ry="14" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
        
        {/* Campana / Cloche */}
        <path
          d="M98 160 C98 100 130 78 160 78 C190 78 222 100 222 160 Z"
          fill="url(#restCloche)"
        />
        
        {/* Brillo dinámico de la campana */}
        <path
          d="M120 152 C116 120 134 94 152 86 C144 94 136 120 140 152 Z"
          fill="#FFFFFF"
          fillOpacity="0.25"
        />

        {/* Borde inferior de la campana */}
        <rect x="92" y="156" width="136" height="8" rx="4" fill="#B91C1C" />
        
        {/* Asa / Pomo superior */}
        <circle cx="160" cy="70" r="10" fill="url(#restAccent)" />
        <path d="M157 78 H163 V82 H157 Z" fill="#D97706" />

        {/* Hojas aromáticas flotantes (toque gourmet) */}
        <path d="M225 90 C235 85 242 92 240 102 C230 105 223 98 225 90 Z" fill="#10B981" />
        <path d="M232 94 C230 98 228 102 227 106" stroke="#047857" strokeWidth="1.5" strokeLinecap="round" />
        
        {/* Estrellas / Destellos de calidad */}
        <path d="M85 85 L88 92 L95 95 L88 98 L85 105 L82 98 L75 95 L82 92 Z" fill="#FBBF24" />
      </g>
    </svg>
  );
}