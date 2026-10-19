import React from 'react';

/**
 * Skeleton Anatómico de Cero Layout Shift (core-architecture-hardener)
 * Preserva las dimensiones exactas del contenedor mientras cargan modelos 3D o respuestas de IA.
 */
export default function SkeletonAnatomico({
  width = '100%',
  height = '24px',
  borderRadius = '8px',
  variant = 'rect', // 'rect' | '3d-card' | 'ai-report'
}) {
  if (variant === '3d-card') {
    return (
      <div
        className="skeleton-shimmer"
        style={{
          width,
          height,
          borderRadius,
          border: '1px solid rgba(0, 0, 0, 0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(15, 118, 110, 0.35)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      </div>
    );
  }

  if (variant === 'ai-report') {
    return (
      <div
        style={{
          padding: '18px',
          borderRadius: '10px',
          border: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-surface-elevated, #131A29)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <div className="skeleton-shimmer" style={{ width: '38%', height: '12px', borderRadius: '4px' }} />
        <div className="skeleton-shimmer" style={{ width: '92%', height: '14px', borderRadius: '4px' }} />
        <div className="skeleton-shimmer" style={{ width: '86%', height: '14px', borderRadius: '4px' }} />
        <div className="skeleton-shimmer" style={{ width: '74%', height: '14px', borderRadius: '4px' }} />
      </div>
    );
  }

  return (
    <div
      className="skeleton-shimmer"
      style={{
        width,
        height,
        borderRadius,
      }}
    />
  );
}
