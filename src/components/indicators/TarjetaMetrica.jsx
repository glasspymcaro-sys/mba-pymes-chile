import React from 'react';

/**
 * Componente KpiCard de Ingeniería Financiera (Paper Technical Design System)
 * Incluye iconografía vectorial dedicada (strokeWidth="1.5"), cifras en tabular-nums y badge semántico.
 */
export default function TarjetaMetrica({
  titulo,
  valor,
  subtitulo,
  tendencia,
  icono = 'equilibrio', // 'equilibrio' | 'ebit' | 'margen' | 'fijos'
  color = 'var(--color-primary)',
}) {
  const esExito =
    color.includes('green') ||
    color.includes('success') ||
    color === '#059669' ||
    tendencia === 'Solvente' ||
    tendencia === 'Cubierto' ||
    tendencia === 'Ganancia';
  const esPeligro =
    color.includes('red') ||
    color.includes('danger') ||
    color === '#DC2626' ||
    tendencia === 'Déficit' ||
    tendencia === 'Pérdida';

  const renderIcono = () => {
    if (icono === 'ebit' || titulo.toLowerCase().includes('resultado')) {
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
          <polyline points="17 6 23 6 23 12" />
        </svg>
      );
    }
    if (icono === 'margen' || titulo.toLowerCase().includes('contribución')) {
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    }
    if (icono === 'fijos' || titulo.toLowerCase().includes('fija') || titulo.toLowerCase().includes('fijo')) {
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      );
    }
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    );
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--color-surface)',
        borderRadius: '10px',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-card)',
        padding: '18px 20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '132px',
        height: '100%',
        transition: 'all 0.15s ease',
      }}
    >
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', gap: '8px' }}>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--color-muted-foreground)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {titulo}
          </span>

          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: esExito ? '#ECFDF5' : esPeligro ? '#FEF2F2' : '#F0FDFA',
              border: `1.5px solid ${esExito ? '#6EE7B7' : esPeligro ? '#FCA5A5' : '#99F6E4'}`,
              color: esExito ? '#059669' : esPeligro ? '#DC2626' : '#0F766E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 2px 5px rgba(15, 23, 42, 0.05), inset 0 1px 0 #FFFFFF',
            }}
          >
            {renderIcono()}
          </div>
        </div>

        <div
          className="tabular-nums"
          style={{
            fontSize: '24px',
            fontWeight: 700,
            color: 'var(--color-foreground)',
            letterSpacing: '-0.025em',
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
          marginTop: '12px',
          paddingTop: '10px',
          borderTop: '1px solid var(--color-border)',
          gap: '8px',
        }}
      >
        <span className="tabular-nums" style={{ fontSize: '11.5px', color: 'var(--color-muted-foreground)', fontWeight: 500 }}>
          {subtitulo}
        </span>

        {tendencia && (
          <span
            style={{
              fontSize: '10.5px',
              fontWeight: 600,
              color: esExito ? 'var(--color-success)' : esPeligro ? 'var(--color-danger)' : 'var(--color-primary)',
              backgroundColor: esExito ? 'var(--color-success-bg)' : esPeligro ? 'var(--color-danger-bg)' : 'var(--color-brand-50)',
              border: `1px solid ${esExito ? 'var(--color-success-border)' : esPeligro ? 'var(--color-danger-border)' : 'var(--color-brand-200)'}`,
              padding: '2px 7px',
              borderRadius: '5px',
              whiteSpace: 'nowrap',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            {esExito && (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="18 15 12 9 6 15" />
              </svg>
            )}
            {esPeligro && (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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