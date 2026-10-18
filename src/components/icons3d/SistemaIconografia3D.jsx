import React, { useId } from 'react';

/**
 * SISTEMA MAESTRO DE ICONOGRAFÍA 3D VECTORIAL PBR (SVG + JSON)
 * Basado en la arquitectura de 7 capas físicas:
 * 1. Sombra de Elevación Multipaso (Ambient Occlusion + Elevación Difusa)
 * 2. Cuerpo Volumétrico Base (Highlight, Midtone, Core Shadow, Bounce Light)
 * 3. Oclusión Ambiental Interna (Cavidades / Inner Shadow)
 * 4. Subsurface Scattering / Brillo Esférico Radial
 * 5. Glassmorphism Frontal (Capas de Cristal Translúcido)
 * 6. Biselado Especular a 165deg (Rim Light)
 * 7. Destello Óptico Focal (Specular Glint)
 * 
 * Cumple estrictamente con:
 * - Cero Emojis
 * - Cero dependencias de librerías de iconos externas
 * - Cero colisiones en el DOM mediante React.useId()
 * - ViewBox estandarizado 0 0 64 64 con márgenes de seguridad para sombras
 */

// 1. Icono 3D Gastronomía / Restaurantes (Cloche PBR con plato biselado y asa esférica)
export function Icono3DRestaurante({ size = 24, className = '', elevated = true }) {
  const rawId = useId();
  const uid = rawId.replace(/[:]/g, '');

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none transition-transform duration-200 hover:scale-110 ${className}`}
      role="img"
      aria-label="Restaurante y Gastronomía 3D"
    >
      <defs>
        <filter id={`rest-shadow-${uid}`} x="-30%" y="-30%" width="160%" height="170%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#020617" floodOpacity="0.4" />
          <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#070A12" floodOpacity="0.5" />
        </filter>
        <linearGradient id={`rest-cloche-${uid}`} x1="12" y1="18" x2="52" y2="46" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="35%" stopColor="#E2F800" />
          <stop offset="75%" stopColor="#CA8A04" />
          <stop offset="100%" stopColor="#713F12" />
        </linearGradient>
        <linearGradient id={`rest-rim-${uid}`} x1="10" y1="14" x2="54" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#E2F800" stopOpacity="0.6" />
        </linearGradient>
        <radialGradient id={`rest-sphere-${uid}`} cx="30%" cy="25%" r="65%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
          <stop offset="45%" stopColor="#FEF08A" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#854D0E" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g filter={elevated ? `url(#rest-shadow-${uid})` : undefined}>
        {/* Bandeja / Plato inferior */}
        <ellipse cx="32" cy="46" rx="22" ry="5.5" fill="#1E293B" stroke={`url(#rest-rim-${uid})`} strokeWidth="1.2" />
        <ellipse cx="32" cy="45" rx="19" ry="3.8" fill="#0F172A" />
        {/* Cúpula / Cloche gastronómica */}
        <path d="M14 44 C14 26 22 18 32 18 C42 18 50 26 50 44 Z" fill={`url(#rest-cloche-${uid})`} stroke={`url(#rest-rim-${uid})`} strokeWidth="1.2" />
        {/* Reflejo esférico de luz */}
        <path d="M14 44 C14 26 22 18 32 18 C42 18 50 26 50 44 Z" fill={`url(#rest-sphere-${uid})`} />
        {/* Asa superior cilíndrica y esférica */}
        <rect x="30" y="14" width="4" height="5" rx="1" fill="#713F12" />
        <circle cx="32" cy="13" r="3.5" fill="#FDE68A" stroke={`url(#rest-rim-${uid})`} strokeWidth="0.8" />
        {/* Destello óptico superior */}
        <ellipse cx="24" cy="24" rx="4.5" ry="1.5" fill="#FFFFFF" fillOpacity="0.7" transform="rotate(-20 24 24)" />
      </g>
    </svg>
  );
}

// 2. Icono 3D Comercio & Retail (Góndola y bolsa de compras isométrica en cristal y titanio)
export function Icono3DComercio({ size = 24, className = '', elevated = true }) {
  const rawId = useId();
  const uid = rawId.replace(/[:]/g, '');

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none transition-transform duration-200 hover:scale-110 ${className}`}
      role="img"
      aria-label="Comercio y Retail 3D"
    >
      <defs>
        <filter id={`ret-shadow-${uid}`} x="-30%" y="-30%" width="160%" height="170%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#020617" floodOpacity="0.4" />
          <feDropShadow dx="0" dy="7" stdDeviation="6" floodColor="#070A12" floodOpacity="0.5" />
        </filter>
        <linearGradient id={`ret-bag-${uid}`} x1="14" y1="18" x2="50" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="40%" stopColor="#0284C7" />
          <stop offset="85%" stopColor="#0C4A6E" />
          <stop offset="100%" stopColor="#082F49" />
        </linearGradient>
        <linearGradient id={`ret-rim-${uid}`} x1="12" y1="12" x2="52" y2="54" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      <g filter={elevated ? `url(#ret-shadow-${uid})` : undefined}>
        {/* Cuerpo de la bolsa de retail */}
        <path d="M16 22 L20 50 L44 50 L48 22 Z" fill={`url(#ret-bag-${uid})`} stroke={`url(#ret-rim-${uid})`} strokeWidth="1.2" />
        {/* Pliegue superior */}
        <polygon points="16,22 48,22 46,26 18,26" fill="#0C4A6E" opacity="0.6" />
        {/* Asas tubulares 3D */}
        <path d="M25 22 V14 C25 10 39 10 39 14 V22" fill="none" stroke="#E2F800" strokeWidth="2.2" strokeLinecap="round" />
        {/* Tarjeta de crédito en Glassmorphism saliendo de la bolsa */}
        <rect x="23" y="27" width="18" height="12" rx="2.5" fill="#FFFFFF" fillOpacity="0.25" stroke="#FFFFFF" strokeWidth="0.8" />
        <line x1="25" y1="31" x2="33" y2="31" stroke="#E2F800" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="37" cy="35" r="1.5" fill="#E2F800" />
      </g>
    </svg>
  );
}

// 3. Icono 3D Servicios & Consultoría (Mesa ejecutiva / Maletín tecnológico en titanio y esmeralda)
export function Icono3DServicios({ size = 24, className = '', elevated = true }) {
  const rawId = useId();
  const uid = rawId.replace(/[:]/g, '');

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none transition-transform duration-200 hover:scale-110 ${className}`}
      role="img"
      aria-label="Servicios Profesionales 3D"
    >
      <defs>
        <filter id={`srv-shadow-${uid}`} x="-30%" y="-30%" width="160%" height="170%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#020617" floodOpacity="0.4" />
          <feDropShadow dx="0" dy="7" stdDeviation="6" floodColor="#070A12" floodOpacity="0.5" />
        </filter>
        <linearGradient id={`srv-body-${uid}`} x1="12" y1="18" x2="52" y2="50" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="45%" stopColor="#059669" />
          <stop offset="85%" stopColor="#064E3B" />
          <stop offset="100%" stopColor="#022C22" />
        </linearGradient>
        <linearGradient id={`srv-rim-${uid}`} x1="10" y1="16" x2="54" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#34D399" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      <g filter={elevated ? `url(#srv-shadow-${uid})` : undefined}>
        {/* Maletín / Estructura ejecutiva */}
        <rect x="13" y="21" width="38" height="28" rx="6" fill={`url(#srv-body-${uid})`} stroke={`url(#srv-rim-${uid})`} strokeWidth="1.2" />
        {/* División media biselada */}
        <line x1="13" y1="35" x2="51" y2="35" stroke="#022C22" strokeWidth="1.5" />
        <line x1="13" y1="36" x2="51" y2="36" stroke="#6EE7B7" strokeWidth="0.6" strokeOpacity="0.7" />
        {/* Asa superior de titanio */}
        <path d="M26 21 V16 C26 14 38 14 38 16 V21" fill="none" stroke="#E2F800" strokeWidth="2.4" strokeLinecap="round" />
        {/* Broches metálicos centrales */}
        <rect x="23" y="32" width="4" height="6" rx="1" fill="#FFFFFF" />
        <rect x="37" y="32" width="4" height="6" rx="1" fill="#FFFFFF" />
        <circle cx="32" cy="27" r="2" fill="#E2F800" />
      </g>
    </svg>
  );
}

// 4. Icono 3D Centro Estratégico (Gráfico de barras CAD 3D en cristal y electric lime)
export function Icono3DCentroEstrategico({ size = 24, className = '', elevated = true }) {
  const rawId = useId();
  const uid = rawId.replace(/[:]/g, '');

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none transition-transform duration-200 hover:scale-110 ${className}`}
      role="img"
      aria-label="Centro Estratégico 3D"
    >
      <defs>
        <filter id={`ce-shadow-${uid}`} x="-30%" y="-30%" width="160%" height="170%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#020617" floodOpacity="0.4" />
          <feDropShadow dx="0" dy="7" stdDeviation="6" floodColor="#070A12" floodOpacity="0.5" />
        </filter>
        <linearGradient id={`ce-lime-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="30%" stopColor="#E2F800" />
          <stop offset="100%" stopColor="#849600" />
        </linearGradient>
        <linearGradient id={`ce-glass-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#0369A1" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      <g filter={elevated ? `url(#ce-shadow-${uid})` : undefined}>
        {/* Plataforma base isométrica */}
        <polygon points="10,48 32,56 54,48 32,40" fill="#131A29" stroke="#1E293B" strokeWidth="1" />
        {/* Barra 1 (Corta) */}
        <rect x="16" y="34" width="7" height="14" rx="2" fill="#1E293B" stroke="#334155" strokeWidth="0.8" />
        {/* Barra 2 (Media - Cristal) */}
        <rect x="28" y="24" width="8" height="24" rx="2" fill={`url(#ce-glass-${uid})`} stroke="#7DD3FC" strokeWidth="0.9" />
        {/* Barra 3 (Alta - Electric Lime Neón) */}
        <rect x="41" y="14" width="8" height="34" rx="2" fill={`url(#ce-lime-${uid})`} stroke="#FFFFFF" strokeWidth="1" />
        {/* Destello sobre barra de rentabilidad */}
        <circle cx="45" cy="17" r="1.5" fill="#FFFFFF" />
        {/* Flecha de crecimiento ascendente */}
        <path d="M14 36 L28 26 L45 16" fill="none" stroke="#E2F800" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

// 5. Icono 3D Costeo e Insumos (Caja de ingredientes isométrica volumétrica)
export function Icono3DCosteoInsumos({ size = 24, className = '', elevated = true }) {
  const rawId = useId();
  const uid = rawId.replace(/[:]/g, '');

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none transition-transform duration-200 hover:scale-110 ${className}`}
      role="img"
      aria-label="Costeo e Insumos 3D"
    >
      <defs>
        <filter id={`ins-shadow-${uid}`} x="-30%" y="-30%" width="160%" height="170%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#020617" floodOpacity="0.4" />
          <feDropShadow dx="0" dy="7" stdDeviation="6" floodColor="#070A12" floodOpacity="0.5" />
        </filter>
        <linearGradient id={`ins-top-${uid}`} x1="12" y1="16" x2="52" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#CBD5E1" />
          <stop offset="100%" stopColor="#64748B" />
        </linearGradient>
        <linearGradient id={`ins-left-${uid}`} x1="12" y1="32" x2="32" y2="54" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="100%" stopColor="#1E293B" />
        </linearGradient>
        <linearGradient id={`ins-right-${uid}`} x1="32" y1="32" x2="52" y2="54" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
      </defs>
      <g filter={elevated ? `url(#ins-shadow-${uid})` : undefined}>
        {/* Cara superior */}
        <polygon points="32,14 52,24 32,34 12,24" fill={`url(#ins-top-${uid})`} stroke="#FFFFFF" strokeWidth="0.8" />
        {/* Cara izquierda */}
        <polygon points="12,24 32,34 32,52 12,42" fill={`url(#ins-left-${uid})`} stroke="#1E293B" strokeWidth="0.8" />
        {/* Cara derecha */}
        <polygon points="32,34 52,24 52,42 32,52" fill={`url(#ins-right-${uid})`} stroke="#0F172A" strokeWidth="0.8" />
        {/* Gema / Insumo cúbico flotante con acento Lime */}
        <polygon points="32,20 40,25 32,30 24,25" fill="#E2F800" stroke="#FFFFFF" strokeWidth="0.8" />
        <polygon points="24,25 32,30 32,36 24,31" fill="#A3B800" />
        <polygon points="32,30 40,25 40,31 32,36" fill="#718000" />
      </g>
    </svg>
  );
}

// 6. Icono 3D Costos Fijos (Bóveda acorazada con candado de seguridad)
export function Icono3DCostosFijos({ size = 24, className = '', elevated = true }) {
  const rawId = useId();
  const uid = rawId.replace(/[:]/g, '');

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none transition-transform duration-200 hover:scale-110 ${className}`}
      role="img"
      aria-label="Costos Fijos 3D"
    >
      <defs>
        <filter id={`cf-shadow-${uid}`} x="-30%" y="-30%" width="160%" height="170%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#020617" floodOpacity="0.4" />
          <feDropShadow dx="0" dy="7" stdDeviation="6" floodColor="#070A12" floodOpacity="0.5" />
        </filter>
        <linearGradient id={`cf-body-${uid}`} x1="12" y1="14" x2="52" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#94A3B8" />
          <stop offset="45%" stopColor="#475569" />
          <stop offset="85%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
      </defs>
      <g filter={elevated ? `url(#cf-shadow-${uid})` : undefined}>
        {/* Estructura de bóveda */}
        <rect x="12" y="14" width="40" height="38" rx="8" fill={`url(#cf-body-${uid})`} stroke="#CBD5E1" strokeWidth="1.2" />
        {/* Círculo de apertura con inner shadow */}
        <circle cx="32" cy="33" r="11" fill="#0B0F17" stroke="#334155" strokeWidth="1.5" />
        {/* Rayos del timón */}
        <circle cx="32" cy="33" r="6" fill="#1E293B" stroke="#E2F800" strokeWidth="1.8" />
        <circle cx="32" cy="33" r="2.5" fill="#E2F800" />
        <line x1="32" y1="23" x2="32" y2="27" stroke="#E2F800" strokeWidth="1.6" strokeLinecap="round" />
        <line x1="32" y1="39" x2="32" y2="43" stroke="#E2F800" strokeWidth="1.6" strokeLinecap="round" />
        <line x1="22" y1="33" x2="26" y2="33" stroke="#E2F800" strokeWidth="1.6" strokeLinecap="round" />
        <line x1="38" y1="33" x2="42" y2="33" stroke="#E2F800" strokeWidth="1.6" strokeLinecap="round" />
      </g>
    </svg>
  );
}

// 7. Icono 3D Historial & Catálogo (Discos holográficos apilados en cristal Z)
export function Icono3DHistorial({ size = 24, className = '', elevated = true }) {
  const rawId = useId();
  const uid = rawId.replace(/[:]/g, '');

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none transition-transform duration-200 hover:scale-110 ${className}`}
      role="img"
      aria-label="Historial y Catálogo 3D"
    >
      <defs>
        <filter id={`hist-shadow-${uid}`} x="-30%" y="-30%" width="160%" height="170%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#020617" floodOpacity="0.4" />
          <feDropShadow dx="0" dy="7" stdDeviation="6" floodColor="#070A12" floodOpacity="0.5" />
        </filter>
        <linearGradient id={`hist-top-${uid}`} x1="12" y1="18" x2="52" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#E2F800" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.7" />
        </linearGradient>
      </defs>
      <g filter={elevated ? `url(#hist-shadow-${uid})` : undefined}>
        {/* Disco Inferior 3 */}
        <ellipse cx="32" cy="46" rx="20" ry="6" fill="#0F172A" stroke="#1E293B" strokeWidth="1" />
        {/* Disco Medio 2 */}
        <ellipse cx="32" cy="36" rx="20" ry="6" fill="#1E293B" stroke="#334155" strokeWidth="1" />
        {/* Disco Superior 1 (Holográfico en cristal) */}
        <ellipse cx="32" cy="26" rx="20" ry="6" fill={`url(#hist-top-${uid})`} stroke="#FFFFFF" strokeWidth="1.2" />
        {/* Eje central cilíndrico */}
        <circle cx="32" cy="26" r="3.5" fill="#070A0F" stroke="#E2F800" strokeWidth="1.5" />
        {/* Indicador de reloj holográfico */}
        <line x1="32" y1="26" x2="38" y2="24" stroke="#E2F800" strokeWidth="1.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}

// 8. Icono 3D ¿Necesitas Ayuda? (Esfera 3D Electric Lime con halo y signo en relieve)
export function Icono3DAyuda({ size = 24, className = '', elevated = true }) {
  const rawId = useId();
  const uid = rawId.replace(/[:]/g, '');

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none transition-transform duration-200 hover:scale-110 ${className}`}
      role="img"
      aria-label="Guía y Ayuda 3D"
    >
      <defs>
        <filter id={`help-shadow-${uid}`} x="-30%" y="-30%" width="160%" height="170%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#020617" floodOpacity="0.4" />
          <feDropShadow dx="0" dy="8" stdDeviation="7" floodColor="#E2F800" floodOpacity="0.35" />
        </filter>
        <radialGradient id={`help-sphere-${uid}`} cx="32%" cy="28%" r="65%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="40%" stopColor="#E2F800" />
          <stop offset="85%" stopColor="#A3B800" />
          <stop offset="100%" stopColor="#4D5700" />
        </radialGradient>
        <linearGradient id={`help-rim-${uid}`} x1="12" y1="12" x2="52" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#4D5700" stopOpacity="0.7" />
        </linearGradient>
      </defs>
      <g filter={elevated ? `url(#help-shadow-${uid})` : undefined}>
        {/* Esfera 3D PBR */}
        <circle cx="32" cy="32" r="22" fill={`url(#help-sphere-${uid})`} stroke={`url(#help-rim-${uid})`} strokeWidth="1.2" />
        {/* Anillo de pulso exterior */}
        <circle cx="32" cy="32" r="25" fill="none" stroke="#E2F800" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
        {/* Signo de interrogación en relieve blanco */}
        <path d="M26 25 C26 20 38 20 38 26 C38 31 32 31 32 36" fill="none" stroke="#070A0F" strokeWidth="3.6" strokeLinecap="round" />
        <path d="M26 25 C26 20 38 20 38 26 C38 31 32 31 32 36" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="32" cy="42" r="2" fill="#070A0F" />
        <circle cx="32" cy="42" r="1.4" fill="#FFFFFF" />
        {/* Destello óptico focal */}
        <ellipse cx="25" cy="22" rx="4.5" ry="2" fill="#FFFFFF" fillOpacity="0.85" transform="rotate(-30 25 22)" />
      </g>
    </svg>
  );
}

// 9. Icono 3D Punto de Equilibrio (Balanza de precisión con fulcro neón)
export function Icono3DPuntoEquilibrio({ size = 24, className = '', elevated = true }) {
  const rawId = useId();
  const uid = rawId.replace(/[:]/g, '');

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none transition-transform duration-200 hover:scale-110 ${className}`}
      role="img"
      aria-label="Punto de Equilibrio 3D"
    >
      <defs>
        <filter id={`pe-shadow-${uid}`} x="-30%" y="-30%" width="160%" height="170%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#020617" floodOpacity="0.4" />
          <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#070A12" floodOpacity="0.5" />
        </filter>
      </defs>
      <g filter={elevated ? `url(#pe-shadow-${uid})` : undefined}>
        {/* Base pesada de balanza */}
        <ellipse cx="32" cy="52" rx="16" ry="4" fill="#0F172A" stroke="#1E293B" strokeWidth="1" />
        {/* Columna central */}
        <rect x="30" y="20" width="4" height="32" rx="1.5" fill="#E2E8F0" />
        {/* Barra superior basculante */}
        <rect x="14" y="20" width="36" height="3.5" rx="1.5" fill="#E2F800" stroke="#070A0F" strokeWidth="0.8" />
        {/* Platillo izquierdo */}
        <line x1="18" y1="23" x2="14" y2="34" stroke="#94A3B8" strokeWidth="1" />
        <line x1="18" y1="23" x2="22" y2="34" stroke="#94A3B8" strokeWidth="1" />
        <ellipse cx="18" cy="34" rx="6" ry="2" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="0.8" />
        {/* Platillo derecho */}
        <line x1="46" y1="23" x2="42" y2="34" stroke="#94A3B8" strokeWidth="1" />
        <line x1="46" y1="23" x2="50" y2="34" stroke="#94A3B8" strokeWidth="1" />
        <ellipse cx="46" cy="34" rx="6" ry="2" fill="#E2F800" stroke="#FFFFFF" strokeWidth="0.8" />
        {/* Fulcro central */}
        <circle cx="32" cy="22" r="3.5" fill="#FFFFFF" stroke="#070A0F" strokeWidth="1" />
      </g>
    </svg>
  );
}

// 10. Icono 3D Resultado Operacional / EBIT (Monedas y barras de oro 3D)
export function Icono3DEbit({ size = 24, className = '', elevated = true }) {
  const rawId = useId();
  const uid = rawId.replace(/[:]/g, '');

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none transition-transform duration-200 hover:scale-110 ${className}`}
      role="img"
      aria-label="Resultado Operacional 3D"
    >
      <defs>
        <filter id={`ebit-shadow-${uid}`} x="-30%" y="-30%" width="160%" height="170%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#020617" floodOpacity="0.4" />
          <feDropShadow dx="0" dy="7" stdDeviation="6" floodColor="#070A12" floodOpacity="0.5" />
        </filter>
        <linearGradient id={`gold-coin-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#78350F" />
        </linearGradient>
      </defs>
      <g filter={elevated ? `url(#ebit-shadow-${uid})` : undefined}>
        {/* Moneda 1 */}
        <ellipse cx="26" cy="46" rx="14" ry="5" fill="#78350F" />
        <ellipse cx="26" cy="44" rx="14" ry="5" fill={`url(#gold-coin-${uid})`} stroke="#FEF08A" strokeWidth="1" />
        {/* Moneda 2 */}
        <ellipse cx="26" cy="38" rx="14" ry="5" fill="#78350F" />
        <ellipse cx="26" cy="36" rx="14" ry="5" fill={`url(#gold-coin-${uid})`} stroke="#FEF08A" strokeWidth="1" />
        {/* Moneda 3 */}
        <ellipse cx="26" cy="30" rx="14" ry="5" fill="#78350F" />
        <ellipse cx="26" cy="28" rx="14" ry="5" fill={`url(#gold-coin-${uid})`} stroke="#FEF08A" strokeWidth="1" />
        {/* Flecha de crecimiento ascendente verde esmeralda */}
        <path d="M36 40 L48 24 L48 32 M48 24 L40 24" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="48" cy="24" r="2.5" fill="#E2F800" />
      </g>
    </svg>
  );
}

// 11. Icono 3D Margen de Contribución (Escudo protector con cristal y destello)
export function Icono3DMargen({ size = 24, className = '', elevated = true }) {
  const rawId = useId();
  const uid = rawId.replace(/[:]/g, '');

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none transition-transform duration-200 hover:scale-110 ${className}`}
      role="img"
      aria-label="Margen de Contribución 3D"
    >
      <defs>
        <filter id={`mrg-shadow-${uid}`} x="-30%" y="-30%" width="160%" height="170%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#020617" floodOpacity="0.4" />
          <feDropShadow dx="0" dy="7" stdDeviation="6" floodColor="#070A12" floodOpacity="0.5" />
        </filter>
        <linearGradient id={`mrg-shield-${uid}`} x1="14" y1="12" x2="50" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6EE7B7" />
          <stop offset="45%" stopColor="#10B981" />
          <stop offset="85%" stopColor="#064E3B" />
          <stop offset="100%" stopColor="#022C22" />
        </linearGradient>
      </defs>
      <g filter={elevated ? `url(#mrg-shadow-${uid})` : undefined}>
        {/* Cuerpo del escudo */}
        <path d="M32 12 L48 18 V34 C48 44 32 52 32 52 C32 52 16 44 16 34 V18 Z" fill={`url(#mrg-shield-${uid})`} stroke="#FFFFFF" strokeWidth="1.2" />
        {/* Reflejo interno de cristal */}
        <path d="M32 15 L45 20 V33 C45 41 32 48 32 48 V15 Z" fill="#FFFFFF" fillOpacity="0.22" />
        {/* Símbolo de porcentaje en Electric Lime */}
        <text x="32" y="36" textAnchor="middle" fill="#E2F800" fontSize="16" fontWeight="900" fontFamily="sans-serif">%</text>
      </g>
    </svg>
  );
}

// 12. Icono 3D Detector de Fugas (Embudo volumétrico con gota neón de fuga)
export function Icono3DFugas({ size = 24, className = '', elevated = true }) {
  const rawId = useId();
  const uid = rawId.replace(/[:]/g, '');

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none transition-transform duration-200 hover:scale-110 ${className}`}
      role="img"
      aria-label="Fugas de Margen 3D"
    >
      <defs>
        <filter id={`fug-shadow-${uid}`} x="-30%" y="-30%" width="160%" height="170%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#020617" floodOpacity="0.4" />
          <feDropShadow dx="0" dy="7" stdDeviation="6" floodColor="#070A12" floodOpacity="0.5" />
        </filter>
        <linearGradient id={`fug-funnel-${uid}`} x1="14" y1="14" x2="50" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F87171" />
          <stop offset="45%" stopColor="#DC2626" />
          <stop offset="85%" stopColor="#991B1B" />
          <stop offset="100%" stopColor="#450A0A" />
        </linearGradient>
      </defs>
      <g filter={elevated ? `url(#fug-shadow-${uid})` : undefined}>
        {/* Boca del embudo */}
        <ellipse cx="32" cy="18" rx="18" ry="5" fill="#EF4444" stroke="#FCA5A5" strokeWidth="1" />
        {/* Cuerpo cónico */}
        <path d="M14 18 L28 40 V48 L36 48 V40 L50 18 Z" fill={`url(#fug-funnel-${uid})`} stroke="#FFFFFF" strokeWidth="1" />
        {/* Gota de fuga de dinero cayendo */}
        <path d="M32 50 C30 54 30 57 32 59 C34 57 34 54 32 50 Z" fill="#E2F800" stroke="#FFFFFF" strokeWidth="0.8" />
      </g>
    </svg>
  );
}

// 13. Icono 3D Destructor de Descuentos (Etiqueta colgante 3D con corte biselado)
export function Icono3DDescuento({ size = 24, className = '', elevated = true }) {
  const rawId = useId();
  const uid = rawId.replace(/[:]/g, '');

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none transition-transform duration-200 hover:scale-110 ${className}`}
      role="img"
      aria-label="Descuentos y Promociones 3D"
    >
      <defs>
        <filter id={`desc-shadow-${uid}`} x="-30%" y="-30%" width="160%" height="170%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#020617" floodOpacity="0.4" />
          <feDropShadow dx="0" dy="7" stdDeviation="6" floodColor="#070A12" floodOpacity="0.5" />
        </filter>
        <linearGradient id={`desc-grad-${uid}`} x1="12" y1="12" x2="52" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FB7185" />
          <stop offset="50%" stopColor="#E11D48" />
          <stop offset="100%" stopColor="#4C0519" />
        </linearGradient>
      </defs>
      <g filter={elevated ? `url(#desc-shadow-${uid})` : undefined}>
        {/* Etiqueta inclinada 3D */}
        <polygon points="26,12 50,36 38,48 14,24 14,12" fill={`url(#desc-grad-${uid})`} stroke="#FFFFFF" strokeWidth="1.2" />
        {/* Ojal metálico */}
        <circle cx="22" cy="20" r="3" fill="#070A0F" stroke="#FFFFFF" strokeWidth="1" />
        {/* Símbolo de tijera o corte de margen */}
        <line x1="26" y1="38" x2="38" y2="26" stroke="#E2F800" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="28" cy="28" r="2" fill="#E2F800" />
        <circle cx="36" cy="36" r="2" fill="#E2F800" />
      </g>
    </svg>
  );
}

// 14. Icono 3D Día de la Libertad Financiera (Calendario y reloj de oro con alas)
export function Icono3DLibertad({ size = 24, className = '', elevated = true }) {
  const rawId = useId();
  const uid = rawId.replace(/[:]/g, '');

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none transition-transform duration-200 hover:scale-110 ${className}`}
      role="img"
      aria-label="Día de la Libertad 3D"
    >
      <defs>
        <filter id={`lib-shadow-${uid}`} x="-30%" y="-30%" width="160%" height="170%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#020617" floodOpacity="0.4" />
          <feDropShadow dx="0" dy="7" stdDeviation="6" floodColor="#070A12" floodOpacity="0.5" />
        </filter>
        <linearGradient id={`lib-cal-${uid}`} x1="14" y1="14" x2="50" y2="50" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="45%" stopColor="#E2F800" />
          <stop offset="85%" stopColor="#A3B800" />
          <stop offset="100%" stopColor="#3F4700" />
        </linearGradient>
      </defs>
      <g filter={elevated ? `url(#lib-shadow-${uid})` : undefined}>
        {/* Base del calendario */}
        <rect x="14" y="16" width="36" height="36" rx="7" fill={`url(#lib-cal-${uid})`} stroke="#FFFFFF" strokeWidth="1.2" />
        {/* Cabecera superior roja/oscura */}
        <rect x="14" y="16" width="36" height="11" rx="6" fill="#070A0F" />
        {/* Argollas del calendario */}
        <circle cx="23" cy="16" r="2" fill="#FFFFFF" />
        <circle cx="41" cy="16" r="2" fill="#FFFFFF" />
        {/* Estrella de libertad en el día clave */}
        <polygon points="32,32 34,38 40,38 35,42 37,48 32,44 27,48 29,42 24,38 30,38" fill="#070A0F" />
      </g>
    </svg>
  );
}

// 15. Icono 3D Capacidad Máxima (Tacómetro de presión y límites físicos)
export function Icono3DCapacidad({ size = 24, className = '', elevated = true }) {
  const rawId = useId();
  const uid = rawId.replace(/[:]/g, '');

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none transition-transform duration-200 hover:scale-110 ${className}`}
      role="img"
      aria-label="Capacidad Física 3D"
    >
      <defs>
        <filter id={`cap-shadow-${uid}`} x="-30%" y="-30%" width="160%" height="170%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#020617" floodOpacity="0.4" />
          <feDropShadow dx="0" dy="7" stdDeviation="6" floodColor="#070A12" floodOpacity="0.5" />
        </filter>
      </defs>
      <g filter={elevated ? `url(#cap-shadow-${uid})` : undefined}>
        {/* Cuadrante circular */}
        <circle cx="32" cy="32" r="21" fill="#0D131F" stroke="#1E293B" strokeWidth="2" />
        {/* Arco de capacidad verde -> amarillo -> rojo */}
        <path d="M18 38 A16 16 0 0 1 46 38" fill="none" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
        <path d="M18 38 A16 16 0 0 1 36 17" fill="none" stroke="#E2F800" strokeWidth="4" strokeLinecap="round" />
        <path d="M36 17 A16 16 0 0 1 46 38" fill="none" stroke="#EF4444" strokeWidth="4" strokeLinecap="round" />
        {/* Aguja de tacómetro en Electric Lime */}
        <line x1="32" y1="32" x2="38" y2="20" stroke="#E2F800" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="32" cy="32" r="3.5" fill="#FFFFFF" stroke="#070A0F" strokeWidth="1" />
      </g>
    </svg>
  );
}

// 16. Icono 3D Matriz de Rentabilidad (Cubo de 4 cuadrantes con gemas CAD)
export function Icono3DMatriz({ size = 24, className = '', elevated = true }) {
  const rawId = useId();
  const uid = rawId.replace(/[:]/g, '');

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none transition-transform duration-200 hover:scale-110 ${className}`}
      role="img"
      aria-label="Ingeniería de Menú y Matriz 3D"
    >
      <defs>
        <filter id={`mat-shadow-${uid}`} x="-30%" y="-30%" width="160%" height="170%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#020617" floodOpacity="0.4" />
          <feDropShadow dx="0" dy="7" stdDeviation="6" floodColor="#070A12" floodOpacity="0.5" />
        </filter>
      </defs>
      <g filter={elevated ? `url(#mat-shadow-${uid})` : undefined}>
        {/* Cuadrante 1: Mina de Oro (Arriba Derecha - Electric Lime) */}
        <rect x="33" y="13" width="18" height="18" rx="4" fill="#E2F800" stroke="#FFFFFF" strokeWidth="1" />
        <circle cx="42" cy="22" r="3.5" fill="#070A0F" />
        {/* Cuadrante 2: Caballo de Batalla (Arriba Izquierda - Cyan) */}
        <rect x="13" y="13" width="18" height="18" rx="4" fill="#0284C7" stroke="#38BDF8" strokeWidth="1" />
        <circle cx="22" cy="22" r="3.5" fill="#FFFFFF" />
        {/* Cuadrante 3: Puzle (Abajo Derecha - Violeta) */}
        <rect x="33" y="33" width="18" height="18" rx="4" fill="#7C3AED" stroke="#C084FC" strokeWidth="1" />
        <circle cx="42" cy="42" r="3.5" fill="#FFFFFF" />
        {/* Cuadrante 4: Vampiro de Margen (Abajo Izquierda - Rojo) */}
        <rect x="13" y="33" width="18" height="18" rx="4" fill="#DC2626" stroke="#F87171" strokeWidth="1" />
        <circle cx="22" cy="42" r="3.5" fill="#FFFFFF" />
      </g>
    </svg>
  );
}

// 17. Icono 3D Escudo Anti-Inflación (Cúpula de dispersión térmica y absorción)
export function Icono3DInflacion({ size = 24, className = '', elevated = true }) {
  const rawId = useId();
  const uid = rawId.replace(/[:]/g, '');

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none transition-transform duration-200 hover:scale-110 ${className}`}
      role="img"
      aria-label="Escudo Anti-Inflación 3D"
    >
      <defs>
        <filter id={`inf-shadow-${uid}`} x="-30%" y="-30%" width="160%" height="170%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#020617" floodOpacity="0.4" />
          <feDropShadow dx="0" dy="7" stdDeviation="6" floodColor="#070A12" floodOpacity="0.5" />
        </filter>
        <linearGradient id={`inf-dome-${uid}`} x1="14" y1="12" x2="50" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="50%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#1E1B4B" />
        </linearGradient>
      </defs>
      <g filter={elevated ? `url(#inf-shadow-${uid})` : undefined}>
        {/* Cúpula de fuerza */}
        <circle cx="32" cy="32" r="21" fill={`url(#inf-dome-${uid})`} stroke="#60A5FA" strokeWidth="1.2" />
        {/* Onda de dispersión neón */}
        <path d="M20 32 Q32 18 44 32 Q32 46 20 32 Z" fill="#E2F800" fillOpacity="0.25" stroke="#E2F800" strokeWidth="1.2" />
        {/* Flecha deflectora central */}
        <path d="M32 42 V22 M26 28 L32 22 L38 28" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}
