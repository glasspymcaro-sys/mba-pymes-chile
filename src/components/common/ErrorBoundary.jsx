import React from 'react';

/**
 * ErrorBoundary de Grado Producción (core-architecture-hardener)
 * Captura excepciones de renderizado sin colapsar la aplicación completa.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary] Excepción capturada en módulo:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '320px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            backgroundColor: 'var(--color-background, #FAFAFA)',
          }}
        >
          <div
            style={{
              maxWidth: '480px',
              width: '100%',
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              borderRadius: '10px',
              padding: '24px',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FECACA',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#DC2626',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 2 22 22 22 12 2" />
                  <line x1="12" y1="9" x2="12" y2="14" />
                  <circle cx="12" cy="18" r="0.8" fill="currentColor" />
                </svg>
              </div>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#DC2626', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block' }}>
                  Diagnóstico de Sistema • Contención Activa
                </span>
                <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#09090B', letterSpacing: '-0.02em', margin: 0 }}>
                  Anomalía detectada en el módulo de interfaz
                </h3>
              </div>
            </div>

            <p style={{ fontSize: '13px', color: '#52525B', lineHeight: 1.5, margin: 0 }}>
              El contenedor de seguridad aisló un error de ejecución para proteger la integridad de sus datos financieros y recetas activas.
            </p>

            {this.state.error?.message && (
              <div
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  backgroundColor: '#F4F4F5',
                  border: '1px solid rgba(0, 0, 0, 0.06)',
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                  fontSize: '11.5px',
                  color: '#09090B',
                  overflowX: 'auto',
                }}
              >
                {this.state.error.message}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '4px' }}>
              <button
                type="button"
                onClick={this.handleReset}
                className="btn-eng-primary"
                style={{
                  height: '34px',
                  padding: '0 14px',
                  borderRadius: '6px',
                  backgroundColor: '#09090B',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '12.5px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                  <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                  <path d="M16 21h5v-5" />
                </svg>
                Reintentar módulo
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
