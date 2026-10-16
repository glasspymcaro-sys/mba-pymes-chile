import React from 'react';
import Logo from '../illustrations/Logo.jsx';
import { formatCLP } from '../../utils/formatters.js';

/**
 * Footer Ejecutivo de Ingeniería Financiera (Paper Technical Design System)
 * Presenta telemetría de Punto de Equilibrio en vivo, fórmulas de referencia contable,
 * accesos rápidos de navegación e indicadores de estado del motor 3D.
 */
export default function FooterEjecutivo({
  perfil = 'restaurant',
  vistaActiva = 'punto_equilibrio',
  onCambiarVista,
  peUnidades = 0,
  pePesos = 0,
  margenContribucion = 0,
  costoVariableConsolidado = 0,
  costoFijoTotal = 0,
  insumosCount = 0,
  costosFijosCount = 0,
}) {
  const nombreRubro =
    perfil === 'restaurant'
      ? 'Gastronomía & Restaurantes'
      : perfil === 'minimarket'
      ? 'Minimarket & Retail Comercial'
      : 'Servicios Profesionales & Proyectos';

  return (
    <footer
      style={{
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid var(--color-border)',
        marginTop: '36px',
        padding: '28px 20px 22px 20px',
        color: 'var(--color-foreground)',
      }}
    >
      <div
        style={{
          maxWidth: '1360px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '22px',
        }}
      >
        {/* Nivel Superior: 3 Columnas Técnicas */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px',
            alignItems: 'start',
          }}
        >
          {/* Columna 1: Identidad y Estado de Motor */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Logo style={{ height: '24px' }} />
              <span
                style={{
                  fontSize: '10.5px',
                  fontWeight: 600,
                  padding: '2px 7px',
                  borderRadius: '4px',
                  backgroundColor: 'var(--color-brand-50)',
                  color: 'var(--color-primary)',
                  border: '1px solid var(--color-brand-200)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Edición Corporativa
              </span>
            </div>

            <p style={{ fontSize: '12.5px', color: 'var(--color-muted-foreground)', lineHeight: 1.55, margin: 0 }}>
              Calculadora de costos, precios y punto de equilibrio para pymes.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginTop: '2px' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--color-success)',
                  backgroundColor: 'var(--color-success-bg)',
                  border: '1px solid var(--color-success-border)',
                  padding: '3px 8px',
                  borderRadius: '5px',
                }}
              >
                <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="8" />
                </svg>
                Ilustraciones & Fotos Activas
              </span>

              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 500,
                  color: 'var(--color-muted-foreground)',
                  backgroundColor: '#F4F4F5',
                  padding: '3px 8px',
                  borderRadius: '5px',
                  border: '1px solid var(--color-border)',
                }}
              >
                Rubro: {nombreRubro}
              </span>
            </div>
          </div>

          {/* Columna 2: Telemetría Consolidada del Punto de Equilibrio */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18" />
                <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
              </svg>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-foreground)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Resumen mensual de equilibrio
              </span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '8px',
              }}
            >
              <div style={{ padding: '8px 10px', borderRadius: '6px', backgroundColor: '#FAFAFA', border: '1px solid var(--color-border)' }}>
                <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--color-muted-foreground)', display: 'block' }}>
                  UMBRAL PE (UNIDADES)
                </span>
                <span className="tabular-nums" style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-primary)' }}>
                  {peUnidades.toLocaleString('es-CL')} un. ({formatCLP(pePesos)})
                </span>
              </div>

              <div style={{ padding: '8px 10px', borderRadius: '6px', backgroundColor: '#FAFAFA', border: '1px solid var(--color-border)' }}>
                <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--color-muted-foreground)', display: 'block' }}>
                  MARGEN CONTRIBUCIÓN
                </span>
                <span className="tabular-nums" style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-foreground)' }}>
                  {formatCLP(margenContribucion)} / un.
                </span>
              </div>

              <div style={{ padding: '8px 10px', borderRadius: '6px', backgroundColor: '#FAFAFA', border: '1px solid var(--color-border)' }}>
                <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--color-muted-foreground)', display: 'block' }}>
                  COSTO DIRECTO (CV)
                </span>
                <span className="tabular-nums" style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-foreground)' }}>
                  {formatCLP(costoVariableConsolidado)} ({insumosCount} insumos)
                </span>
              </div>

              <div style={{ padding: '8px 10px', borderRadius: '6px', backgroundColor: '#FAFAFA', border: '1px solid var(--color-border)' }}>
                <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--color-muted-foreground)', display: 'block' }}>
                  CARGA FIJA (CF)
                </span>
                <span className="tabular-nums" style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-foreground)' }}>
                  {formatCLP(costoFijoTotal)} ({costosFijosCount} ítems)
                </span>
              </div>
            </div>
          </div>

          {/* Columna 3: Módulos Operativos y Ecuación Rectora */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-foreground)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Accesos directos
              </span>
            </div>

            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {[
                { id: 'punto_equilibrio', label: '1. Punto de equilibrio' },
                { id: 'insumos', label: '2. Costeo e insumos' },
                { id: 'costos_fijos', label: '3. Costos fijos' },
                { id: 'historial', label: '4. Catálogo' },
              ].map((nav) => (
                <button
                  key={nav.id}
                  type="button"
                  onClick={() => onCambiarVista && onCambiarVista(nav.id)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: '6px',
                    fontSize: '11.5px',
                    fontWeight: vistaActiva === nav.id ? 600 : 500,
                    backgroundColor: vistaActiva === nav.id ? 'var(--color-brand-50)' : '#FAFAFA',
                    color: vistaActiva === nav.id ? 'var(--color-primary)' : 'var(--color-muted-foreground)',
                    border: `1px solid ${vistaActiva === nav.id ? 'var(--color-brand-200)' : 'var(--color-border)'}`,
                    cursor: 'pointer',
                  }}
                >
                  {nav.label}
                </button>
              ))}
            </div>

            <div
              className="tabular-nums"
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                backgroundColor: '#F4F4F5',
                border: '1px solid var(--color-border)',
                fontSize: '11.5px',
                color: 'var(--color-foreground)',
                fontFamily: 'var(--font-mono)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span>Fórmula: PE(Q) = CF / (P - CV)</span>
              <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
                {peUnidades} = {Math.round(costoFijoTotal / 1000)}k / {formatCLP(margenContribucion)}
              </span>
            </div>
          </div>
        </div>

        {/* Nivel Inferior: Créditos y Estándar de Precisión */}
        <div
          style={{
            borderTop: '1px solid var(--color-border)',
            paddingTop: '14px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px',
            fontSize: '11.5px',
            color: 'var(--color-muted-foreground)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>Sistema de Gestión de Punto de Equilibrio • Arquitectura Paper Technical</span>
          </div>

          <div className="tabular-nums" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span>Moneda: Peso Chileno ($ CLP)</span>
            <span>•</span>
            <span>Renderizado Vectorial Autónomo</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
