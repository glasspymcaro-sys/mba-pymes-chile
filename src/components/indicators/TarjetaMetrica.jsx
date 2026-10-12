import React from 'react';

export default function TarjetaMetrica({ titulo, valor, subtitulo, tendencia, color = '#3182ce' }) {
  return (
    <div
      style={{
        background: 'var(--bg-neumorphic)',
        borderRadius: '20px',
        boxShadow: 'var(--neu-flat)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '130px',
      }}
    >
      <div>
        <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
          {titulo}
        </span>
        <div style={{ fontSize: '28px', fontWeight: '900', color: '#1a202c', marginTop: '8px' }}>
          {valor}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px' }}>
        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          {subtitulo}
        </span>
        {tendencia && (
          <span
            style={{
              fontSize: '12px',
              fontWeight: '800',
              color: color,
              padding: '4px 10px',
              borderRadius: '10px',
              boxShadow: 'var(--neu-pressed)',
              background: 'var(--bg-neumorphic)',
            }}
          >
            {tendencia}
          </span>
        )}
      </div>
    </div>
  );
}