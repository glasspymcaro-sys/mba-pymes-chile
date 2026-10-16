import React, { useState } from 'react';
import { AppStateProvider, useAppState } from './store/appState.jsx';
import ErrorBoundary from './components/common/ErrorBoundary.jsx';
import DashboardPrincipal from './views/DashboardPrincipal.jsx';
import CarruselInsumos3D from './components/carousel3d/CarruselInsumos3D.jsx';
import GestionCostosFijosSimple from './components/costs/GestionCostosFijosSimple.jsx';
import FooterEjecutivo from './components/layout/FooterEjecutivo.jsx';
import AuthModal from './components/auth/AuthModal.jsx';
import Logo from './components/illustrations/Logo.jsx';
import { formatCLP } from './utils/formatters.js';

function ContenidoPrincipal() {
  const {
    perfil,
    cambiarPerfil,
    user,
    cerrarSesion,
    syncStatus,
    sincronizarConNube,
    insumos,
    insumosAsignados,
    costosFijos,
    recetaEnOlla,
    agregarInsumo,
    editarInsumo,
    eliminarInsumo,
    agregarIngredienteAOlla,
    costoVariableConsolidado,
    costoFijoTotal,
    precioVentaConsolidado,
    ventasEstimadasMensuales,
  } = useAppState();

  const [vista, setVista] = useState('punto_equilibrio'); // 'punto_equilibrio' | 'insumos' | 'costos_fijos'
  const [modalAuthAbierto, setModalAuthAbierto] = useState(false);

  // Cálculos de Punto de Equilibrio para el Header y Footer
  const margenContribucion = Math.max(0, precioVentaConsolidado - costoVariableConsolidado);
  const peUnidades = margenContribucion > 0 ? Math.ceil(costoFijoTotal / margenContribucion) : 0;
  const pePesos = peUnidades * precioVentaConsolidado;
  const esSolvente = ventasEstimadasMensuales >= peUnidades && peUnidades > 0;

  const botonNavStyle = (activo) => ({
    height: '34px',
    padding: '0 13px',
    borderRadius: '6px',
    fontSize: '12.5px',
    fontWeight: activo ? 600 : 500,
    cursor: 'pointer',
    backgroundColor: activo ? 'var(--color-brand-50)' : 'transparent',
    color: activo ? 'var(--color-primary)' : 'var(--color-muted-foreground)',
    border: activo ? '1px solid var(--color-brand-200)' : '1px solid transparent',
    transition: 'all 0.15s ease',
    whiteSpace: 'nowrap',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
  });

  const botonRubroStyle = (activo) => ({
    height: '28px',
    padding: '0 10px',
    borderRadius: '5px',
    fontSize: '12px',
    fontWeight: activo ? 600 : 500,
    cursor: 'pointer',
    backgroundColor: activo ? '#FFFFFF' : 'transparent',
    color: activo ? 'var(--color-foreground)' : 'var(--color-muted-foreground)',
    border: 'none',
    boxShadow: activo ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
    transition: 'all 0.15s ease',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-background)' }}>
      {/* 1. Barra de Navegación Superior Paper Technical */}
      <header
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.94)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid var(--color-border)',
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}
      >
        {/* Identidad y Selector de Rubro */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <Logo style={{ height: '26px' }} />

          {/* Selector de los 3 Modelos de Negocio con strokeWidth="1.5" */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '2px',
              padding: '3px',
              borderRadius: '7px',
              border: '1px solid var(--color-border)',
              backgroundColor: '#F4F4F5',
            }}
          >
            <button
              onClick={() => cambiarPerfil('restaurant')}
              style={botonRubroStyle(perfil === 'restaurant')}
              title="Cambiar a modelo Restaurante (Ollita de cocina)"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                <line x1="6" y1="1" x2="6" y2="4" />
                <line x1="10" y1="1" x2="10" y2="4" />
                <line x1="14" y1="1" x2="14" y2="4" />
              </svg>
              Restaurante
            </button>

            <button
              onClick={() => cambiarPerfil('minimarket')}
              style={botonRubroStyle(perfil === 'minimarket')}
              title="Cambiar a modelo Minimarket (Góndola)"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              Minimarket
            </button>

            <button
              onClick={() => cambiarPerfil('services')}
              style={botonRubroStyle(perfil === 'services')}
              title="Cambiar a modelo Servicios (Mesa de proyectos)"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
              Servicios
            </button>
          </div>

          {/* Badge del Punto de Equilibrio en Vivo */}
          <div
            className="tabular-nums"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              height: '28px',
              padding: '0 10px',
              borderRadius: '6px',
              backgroundColor: esSolvente ? 'var(--color-brand-50)' : 'var(--color-danger-bg)',
              border: `1px solid ${esSolvente ? 'var(--color-brand-200)' : 'var(--color-danger-border)'}`,
              fontSize: '11.5px',
              fontWeight: 600,
              color: esSolvente ? 'var(--color-primary)' : 'var(--color-danger)',
            }}
          >
            <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="8" />
            </svg>
            <span>PE: {peUnidades.toLocaleString('es-CL')} un.</span>
            <span style={{ color: 'var(--color-muted-foreground)', fontWeight: 500 }}>({formatCLP(pePesos)})</span>
          </div>

          {/* Indicador Nube Supabase */}
          {user && (
            <div
              onClick={sincronizarConNube}
              title="Clic para sincronizar con Supabase"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '11px',
                fontWeight: 600,
                height: '28px',
                padding: '0 8px',
                borderRadius: '6px',
                cursor: 'pointer',
                backgroundColor: syncStatus === 'synced' ? 'var(--color-success-bg)' : '#F4F4F5',
                border: `1px solid ${syncStatus === 'synced' ? 'var(--color-success-border)' : 'var(--color-border)'}`,
                color: syncStatus === 'synced' ? 'var(--color-success)' : 'var(--color-muted-foreground)',
              }}
            >
              <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="8" />
              </svg>
              <span>{syncStatus === 'synced' ? 'Sincronizado' : syncStatus === 'syncing' ? 'Guardando…' : 'Nube'}</span>
            </div>
          )}
        </div>

        {/* Navegación Principal (Centrada exclusivamente en Punto de Equilibrio, Costos Directos y Costos Fijos) */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setVista('punto_equilibrio')}
            className="btn-eng-secondary"
            style={botonNavStyle(vista === 'punto_equilibrio')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
            Punto de Equilibrio
          </button>

          <button
            onClick={() => setVista('insumos')}
            className="btn-eng-secondary"
            style={botonNavStyle(vista === 'insumos')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
            Insumos & Costos Directos
            <span
              className="tabular-nums"
              style={{
                fontSize: '10.5px',
                padding: '1px 5px',
                borderRadius: '4px',
                backgroundColor: vista === 'insumos' ? '#FFFFFF' : '#F4F4F5',
                color: 'var(--color-foreground)',
                fontWeight: 600,
              }}
            >
              {insumos.length}
            </span>
          </button>

          <button
            onClick={() => setVista('costos_fijos')}
            className="btn-eng-secondary"
            style={botonNavStyle(vista === 'costos_fijos')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Costos Fijos
            <span
              className="tabular-nums"
              style={{
                fontSize: '10.5px',
                padding: '1px 5px',
                borderRadius: '4px',
                backgroundColor: vista === 'costos_fijos' ? '#FFFFFF' : '#F4F4F5',
                color: 'var(--color-foreground)',
                fontWeight: 600,
              }}
            >
              {costosFijos.length}
            </span>
          </button>

          {/* Autenticación de Usuario */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  fontSize: '11.5px',
                  fontWeight: 500,
                  color: 'var(--color-muted-foreground)',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  border: '1px solid var(--color-border)',
                  maxWidth: '120px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {user.email}
              </span>
              <button
                onClick={cerrarSesion}
                className="btn-eng-secondary"
                style={{
                  height: '32px',
                  padding: '0 10px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  backgroundColor: 'var(--color-danger-bg)',
                  color: 'var(--color-danger)',
                  border: '1px solid var(--color-danger-border)',
                }}
              >
                Salir
              </button>
            </div>
          ) : (
            <button
              onClick={() => setModalAuthAbierto(true)}
              className="btn-eng-secondary"
              style={{
                height: '34px',
                padding: '0 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                backgroundColor: '#FFFFFF',
                color: 'var(--color-foreground)',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-card)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Iniciar Sesión
            </button>
          )}
        </nav>
      </header>

      {/* Sub-barra de Telemetría Rápida de Unidad de Costeo */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid var(--color-border)',
          padding: '6px 20px',
          fontSize: '11.5px',
          color: 'var(--color-muted-foreground)',
        }}
      >
        <div
          style={{
            maxWidth: '1360px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>
              Unidad Activa: <strong style={{ color: 'var(--color-foreground)' }}>{recetaEnOlla?.nombre || 'Producto Principal'}</strong>
            </span>
            <span>•</span>
            <span className="tabular-nums">
              Precio (P): <strong style={{ color: 'var(--color-foreground)' }}>{formatCLP(precioVentaConsolidado)}</strong>
            </span>
            <span>•</span>
            <span className="tabular-nums">
              Costo Directo (CV): <strong style={{ color: 'var(--color-foreground)' }}>{formatCLP(costoVariableConsolidado)}</strong>
            </span>
            <span>•</span>
            <span className="tabular-nums">
              Margen (P - CV): <strong style={{ color: 'var(--color-primary)' }}>{formatCLP(margenContribucion)}</strong>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {vista !== 'insumos' && (
              <button
                type="button"
                onClick={() => setVista('insumos')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-primary)',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span>Editar receta e insumos 3D</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Área de Trabajo Principal con Contención de Errores */}
      <main style={{ flex: 1, padding: '20px 16px', maxWidth: '1360px', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
        <ErrorBoundary>
          {vista === 'punto_equilibrio' && <DashboardPrincipal onIrAInsumos={() => setVista('insumos')} />}

          {vista === 'insumos' && (
            <CarruselInsumos3D
              rubro={perfil}
              insumos={insumos}
              insumosAsignados={insumosAsignados}
              onAgregarInsumo={agregarInsumo}
              onEditarInsumo={editarInsumo}
              onEliminarInsumo={eliminarInsumo}
              onAsignarCostoDirecto={agregarIngredienteAOlla}
            />
          )}

          {vista === 'costos_fijos' && <GestionCostosFijosSimple />}
        </ErrorBoundary>
      </main>

      {/* 3. Footer Ejecutivo de Ingeniería Financiera */}
      <FooterEjecutivo
        perfil={perfil}
        vistaActiva={vista}
        onCambiarVista={setVista}
        peUnidades={peUnidades}
        pePesos={pePesos}
        margenContribucion={margenContribucion}
        costoVariableConsolidado={costoVariableConsolidado}
        costoFijoTotal={costoFijoTotal}
        insumosCount={insumos.length}
        costosFijosCount={costosFijos.length}
      />

      <AuthModal
        isOpen={modalAuthAbierto}
        onClose={() => setModalAuthAbierto(false)}
        onAuthSuccess={() => setModalAuthAbierto(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppStateProvider>
        <ContenidoPrincipal />
      </AppStateProvider>
    </ErrorBoundary>
  );
}