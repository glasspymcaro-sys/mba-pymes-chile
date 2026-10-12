import React from 'react';

export default function Logo({ style = {} }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', userSelect: 'none', ...style }}>
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
        <rect width="36" height="36" rx="10" fill="var(--bg-neumorphic, #e8ecf2)" />
        <path d="M11 26V10H17C20.3137 10 23 12.6863 23 16C23 19.3137 20.3137 22 17 22H11" stroke="var(--primary-color, #3182ce)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="26" cy="23" r="3.5" fill="var(--accent-green, #38a169)" />
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <span style={{ fontSize: '18px', fontWeight: 900, color: '#1a202c', letterSpacing: '-0.5px', lineHeight: '1.1' }}>
          Integra <span style={{ color: 'var(--primary-color, #3182ce)' }}>Pyme</span>
        </span>
        <span style={{ fontSize: '9.5px', fontWeight: 800, color: 'var(--text-muted, #718096)', textTransform: 'uppercase', letterSpacing: '0.8px', marginTop: '2px' }}>
          Decisión Operativa
        </span>
      </div>
    </div>
  );
}