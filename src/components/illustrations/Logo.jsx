import React from 'react';

export default function Logo({ style = {} }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', userSelect: 'none', ...style }}>
      <svg width="38" height="38" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0, overflow: 'visible' }}>
        <defs>
          <filter id="logoImpactGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#E2F800" floodOpacity="0.45" />
          </filter>
          <linearGradient id="logoBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#131A29" />
            <stop offset="100%" stopColor="#0B0F17" />
          </linearGradient>
          <linearGradient id="logoLimeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F4FF4D" />
            <stop offset="100%" stopColor="#E2F800" />
          </linearGradient>
        </defs>
        {/* Marco técnico biselado ImpactM5 */}
        <rect x="2" y="2" width="40" height="40" rx="10" fill="url(#logoBgGrad)" stroke="#1E293B" strokeWidth="1.5" />
        <rect x="3" y="3" width="38" height="38" rx="9" stroke="rgba(226, 248, 0, 0.25)" strokeWidth="1" />
        {/* Monograma geométrico de vector */}
        <path d="M12 31V13H21C25.4 13 28.5 16 28.5 20C28.5 24 25.4 27 21 27H12" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 21H24" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" strokeLinecap="round" />
        {/* Nodo de rentabilidad Electric Lime con resplandor */}
        <circle cx="31" cy="27" r="4.5" fill="url(#logoLimeGrad)" filter="url(#logoImpactGlow)" stroke="#070A0F" strokeWidth="1.5" />
        <circle cx="30" cy="25.5" r="1.2" fill="#FFFFFF" />
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <span style={{ fontSize: '18px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.3px', lineHeight: '1.1' }}>
          INTEGRA <span style={{ color: '#E2F800' }}>PYME</span>
        </span>
        <span style={{ fontSize: '9px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: '2px' }}>
          ESTRATEGIA & MARGEN MBA
        </span>
      </div>
    </div>
  );
}