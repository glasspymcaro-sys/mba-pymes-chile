import React from 'react';

/**
 * Componente KpiCard alineado con la Sección 8.3 de la Guía de Frontend ERP Pyme.
 * Estilo sobrio, flat con bordes refinados (slate-200), cifra destacada en tabular-nums y badge semántico.
 */
export default function TarjetaMetrica({ titulo, valor, subtitulo, tendencia, color = 'var(--color-primary)' }) {
  const esExito = color.includes('green') || color === '#15803d' || tendencia === 'Solvente' || tendencia === 'Cubierto' || tendencia === 'Ganancia';
  const esPeligro = color.includes('red') || color === '#b91c1c' || tendencia === 'Déficit' || tendencia === 'Pérdida';

  return (
    <div
      style={{
        backgroundColor: 'var(--color-surface)',
        borderRadius: '12px',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-card)',
        padding: '20px 22px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '135px',
        transition: 'all 0.15s ease',
      }}
    >
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span
            style={{
              fontSize: '11.5px',
              fontWeight: 600,
              color: 'var(--color-muted-foreground)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {titulo}
          </span>
        </div>

        <div
          className="tabular-nums"
          style={{
            fontSize: '26px',
            fontWeight: 700,
            color: 'var(--color-foreground)',
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
          }}
        >
          {valor}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '14px',
          paddingTop: '10px',
          borderTop: '1px solid #f1f5f9',
          gap: '8px',
        }}
      >
        <span style={{ fontSize: '12px', color: 'var(--color-muted-foreground)', fontWeight: 500 }}>
          {subtitulo}
        </span>

        {tendencia && (
          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: esExito ? 'var(--color-success)' : esPeligro ? 'var(--color-danger)' : 'var(--color-primary)',
              backgroundColor: esExito ? 'var(--color-success-bg)' : esPeligro ? 'var(--color-danger-bg)' : 'var(--color-brand-50)',
              border: `1px solid ${esExito ? 'var(--color-success-border)' : esPeligro ? 'var(--color-danger-border)' : 'var(--color-brand-200)'}`,
              padding: '3px 8px',
              borderRadius: '6px',
              whiteSpace: 'nowrap',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            {esExito && (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="18 15 12 9 6 15" />
              </svg>
            )}
            {esPeligro && (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            )}
            {tendencia}
          </span>
        )}
      </div>
    </div>
  );
}