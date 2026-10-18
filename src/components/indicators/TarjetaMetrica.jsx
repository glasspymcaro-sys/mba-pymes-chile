import React from 'react';
import {
  Icono3DPuntoEquilibrio,
  Icono3DEbit,
  Icono3DMargen,
  Icono3DCostosFijos,
} from '../icons3d/SistemaIconografia3D.jsx';

/**
 * Componente KpiCard de Ingeniería Financiera (Estética ImpactM5 Dark Tech)
 * Incluye iconografía 3D PBR dedicada, cifras en tabular-nums y badge semántico.
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
    color === '#10B981' ||
    tendencia === 'Solvente' ||
    tendencia === 'Cubierto' ||
    tendencia === 'Ganancia' ||
    tendencia === 'Meta Lograda' ||
    tendencia === 'Positivo';

  const esPeligro =
    color.includes('red') ||
    color.includes('danger') ||
    color === '#DC2626' ||
    color === '#EF4444' ||
    tendencia === 'Déficit' ||
    tendencia === 'Pérdida';

  const renderIcono = () => {
    if (icono === 'ebit' || titulo.toLowerCase().includes('resultado')) {
      return <Icono3DEbit size={26} />;
    }
    if (icono === 'margen' || titulo.toLowerCase().includes('contribución') || titulo.toLowerCase().includes('ganancia')) {
      return <Icono3DMargen size={26} />;
    }
    if (icono === 'fijos' || titulo.toLowerCase().includes('fija') || titulo.toLowerCase().includes('fijo')) {
      return <Icono3DCostosFijos size={26} />;
    }
    return <Icono3DPuntoEquilibrio size={26} />;
  };

  return (
    <div
      style={{
        backgroundColor: '#0D131F',
        borderRadius: '12px',
        border: '1px solid #1E293B',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)',
        padding: '18px 20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '132px',
        height: '100%',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(226, 248, 0, 0.4)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#1E293B';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', gap: '8px' }}>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 800,
              color: '#94A3B8',
              textTransform: 'uppercase',
              letterSpacing: '0.07em',
            }}
          >
            {titulo}
          </span>

          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '9px',
              backgroundColor: esExito
                ? 'rgba(16, 185, 129, 0.15)'
                : esPeligro
                ? 'rgba(239, 68, 68, 0.15)'
                : 'rgba(226, 248, 0, 0.12)',
              border: `1px solid ${
                esExito
                  ? 'rgba(16, 185, 129, 0.4)'
                  : esPeligro
                  ? 'rgba(239, 68, 68, 0.4)'
                  : 'rgba(226, 248, 0, 0.35)'
              }`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
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