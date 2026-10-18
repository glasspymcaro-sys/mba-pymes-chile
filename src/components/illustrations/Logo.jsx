import React from 'react';

export default function Logo({ style = {} }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', userSelect: 'none', ...style }}>
      <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0, overflow: 'visible' }}>
        <defs>
          <filter id="logoPbrShadow" x="-20%" y="-20%" width="150%" height="150%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#0F172A" floodOpacity="0.22" />
            <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#042F2E" floodOpacity="0.18" />
          </filter>
          <linearGradient id="logoBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#14B8A6" />
            <stop offset="35%" stopColor="#0F766E" />
            <stop offset="85%" stopColor="#115E59" />
            <stop offset="100%" stopColor="#042F2E" />
          </linearGradient>
          <linearGradient id="logoRimLight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#5EEAD4" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#042F2E" stopOpacity="0.8" />
          </linearGradient>
          <radialGradient id="logoSpecular" cx="30%" cy="25%" r="60%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="logoNodeSphere" cx="32%" cy="28%" r="65%">
            <stop offset="0%" stopColor="#6EE7B7" />
            <stop offset="45%" stopColor="#10B981" />
            <stop offset="80%" stopColor="#047857" />
            <stop offset="100%" stopColor="#064E3B" />
          </radialGradient>
        </defs>
        <rect x="3" y="3" width="42" height="42" rx="12" fill="url(#logoBodyGrad)" filter="url(#logoPbrShadow)" stroke="url(#logoRimLight)" strokeWidth="1.5" />
        <rect x="4" y="4" width="40" height="20" rx="11" fill="url(#logoSpecular)" />
        <path d="M15 34V14H23C27.4183 14 31 17.5817 31 22C31 26.4183 27.4183 30 23 30H15" stroke="#FFFFFF" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15 34V14H23C27.4183 14 31 17.5817 31 22C31 26.4183 27.4183 30 23 30H15" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="34" cy="30" r="5" fill="url(#logoNodeSphere)" stroke="#FFFFFF" strokeWidth="1.5" filter="url(#logoPbrShadow)" />
        <circle cx="32.5" cy="28.5" r="1.5" fill="#FFFFFF" fillOpacity="0.85" />
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <span style={{ fontSize: '18px', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.5px', lineHeight: '1.1' }}>
          Integra <span style={{ color: '#0F766E' }}>Pyme</span>
        </span>
        <span style={{ fontSize: '9.5px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.8px', marginTop: '2px' }}>
          Decisión Operativa
        </span>
      </div>
    </div>
  );
}