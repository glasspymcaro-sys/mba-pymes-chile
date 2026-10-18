import React, { useState } from 'react';
import { AppStateProvider, useAppState } from './store/appState.jsx';
import ErrorBoundary from './components/common/ErrorBoundary.jsx';
import DashboardPrincipal from './views/DashboardPrincipal.jsx';
import CarruselInsumos3D from './components/carousel3d/CarruselInsumos3D.jsx';
import GestionCostosFijosSimple from './components/costs/GestionCostosFijosSimple.jsx';
import FooterEjecutivo from './components/layout/FooterEjecutivo.jsx';
import CentroHistorialCatalogo from './components/history/CentroHistorialCatalogo.jsx';
import AuthModal from './components/auth/AuthModal.jsx';
import GuiaEmprendedorModal from './components/help/GuiaEmprendedorModal.jsx';
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
    recetas,
    recetaEnOlla,
    agregarInsumo,
    editarInsumo,
    eliminarInsumo,
    agregarIngredienteAOlla,
    costoVariableConsolidado,
    costoFijoTotal,
    sueldoObjetivo,
    analisisFugasActivas,
    precioVentaConsolidado,
    ventasEstimadasMensuales,
  } = useAppState();

  const [vista, setVista] = useState('punto_equilibrio'); // 'punto_equilibrio' | 'insumos' | 'costos_fijos'
  // Al abrir la aplicación, salta de inmediato el login a menos que ya se haya descartado en esta sesión
  const [modalAuthAbierto, setModalAuthAbierto] = useState(() => {
    return !sessionStorage.getItem('mba_auth_dismissed') && !localStorage.getItem('mba_pymes_user');
  });
  const [modalGuiaAbierto, setModalGuiaAbierto] = useState(false);

  // Cálculos de Punto de Equilibrio con Fugas Reales y Sueldo Objetivo
  const margenContribucion = Math.max(0, Number(analisisFugasActivas?.margenContribucionReal || (precioVentaConsolidado - costoVariableConsolidado)));
  const peUnidades = margenContribucion > 0 ? Math.ceil(costoFijoTotal / margenContribucion) : 0;
  const peConSueldoUnidades = margenContribucion > 0 ? Math.ceil((costoFijoTotal + sueldoObjetivo) / margenContribucion) : 0;
  const pePesos = peUnidades * precioVentaConsolidado;
  const esSolvente = ventasEstimadasMensuales >= peUnidades && peUnidades > 0;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-background)' }}>
      {/* 1. Barra de Navegación Superior con Bordes Biselados y Botones Táctiles ImpactM5 */}
      <header
        style={{
          backgroundColor: 'rgba(7, 10, 18, 0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #1E293B',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.6)',
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
        {/* Identidad y Selector de los 3 Rubros (Gastronomía, Comercio/Retail, Servicios) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <Logo style={{ height: '28px' }} />

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px',
              borderRadius: '9px',
              border: '1px solid #1E293B',
              backgroundColor: '#0B0F17',
              boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.5)',
            }}
          >
            <button
              onClick={() => cambiarPerfil('restaurant')}
              className={perfil === 'restaurant' ? 'btn-bacan-primary' : 'btn-bacan-secondary'}
              style={{
                height: '30px',
                padding: '0 11px',
                fontSize: '11.5px',
                borderRadius: '6px',
              }}
              title="Gastronomía / Restaurantes"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
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
              className={perfil === 'minimarket' ? 'btn-bacan-primary' : 'btn-bacan-secondary'}
              style={{
                height: '30px',
                padding: '0 11px',
                fontSize: '11.5px',
                borderRadius: '6px',
              }}
              title="Comercio / Retail / Minimarket (Góndola)"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              Comercio / Retail
            </button>

            <button
              onClick={() => cambiarPerfil('services')}
              className={perfil === 'services' ? 'btn-bacan-primary' : 'btn-bacan-secondary'}
              style={{
                height: '30px',
                padding: '0 11px',
                fontSize: '11.5px',
                borderRadius: '6px',
              }}
              title="Agencia / Servicios / Consultoría (Mesa de Proyectos)"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
              Servicios
            </button>
          </div>

          {/* Badge del Punto de Equilibrio + Meta Sueldo ImpactM5 */}
          <div
            className="tabular-nums"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              height: '32px',
              padding: '0 12px',
              borderRadius: '8px',
              backgroundColor: esSolvente ? 'rgba(226, 248, 0, 0.08)' : 'rgba(239, 68, 68, 0.12)',
              border: `1px solid ${esSolvente ? '#E2F800' : '#EF4444'}`,
              fontSize: '11.5px',
              fontWeight: 800,
              color: esSolvente ? '#E2F800' : '#F87171',
              boxShadow: esSolvente ? '0 0 12px rgba(226, 248, 0, 0.2)' : 'none',
            }}
          >
            <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="8" />
            </svg>
            <span>PE Base: {peUnidades.toLocaleString('es-CL')} un.</span>
            <span>•</span>
            <span style={{ color: esSolvente ? '#FFFFFF' : '#FCA5A5' }}>Meta c/Sueldo: {peConSueldoUnidades.toLocaleString('es-CL')} un.</span>
          </div>

          {user && (
            <div
              onClick={sincronizarConNube}
              title="Clic para sincronizar con Supabase"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '11px',
                fontWeight: 700,
                height: '30px',
                padding: '0 10px',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: '#0B0F17',
                border: `1px solid ${syncStatus === 'synced' ? 'rgba(226, 248, 0, 0.5)' : '#1E293B'}`,
                color: syncStatus === 'synced' ? '#E2F800' : '#94A3B8',
              }}
            >
              <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="8" />
              </svg>
              <span>{syncStatus === 'synced' ? 'Sincronizado' : syncStatus === 'syncing' ? 'Guardando…' : 'Nube'}</span>
            </div>
          )}
        </div>

        {/* Navegación Principal con Botones Bacanes */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setVista('punto_equilibrio')}
            className={vista === 'punto_equilibrio' ? 'btn-bacan-primary' : 'btn-bacan-secondary'}
            style={{ height: '36px', padding: '0 14px', fontSize: '12.5px' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
            Centro Estratégico & Precios
          </button>

          <button
            onClick={() => setVista('insumos')}
            className={vista === 'insumos' ? 'btn-bacan-primary' : 'btn-bacan-secondary'}
            style={{ height: '36px', padding: '0 14px', fontSize: '12.5px' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
            Costeo & Insumos
            <span
              className="tabular-nums"
              style={{
                fontSize: '10.5px',
                padding: '1px 6px',
                borderRadius: '5px',
                backgroundColor: vista === 'insumos' ? 'rgba(255,255,255,0.22)' : '#E2E8F0',
                color: vista === 'insumos' ? '#FFFFFF' : '#09090B',
                fontWeight: 800,
              }}
            >
              {insumos.length}
            </span>
          </button>

          <button
            onClick={() => setVista('costos_fijos')}
            className={vista === 'costos_fijos' ? 'btn-bacan-primary' : 'btn-bacan-secondary'}
            style={{ height: '36px', padding: '0 14px', fontSize: '12.5px' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
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
                padding: '1px 6px',
                borderRadius: '5px',
                backgroundColor: vista === 'costos_fijos' ? 'rgba(255,255,255,0.22)' : '#E2E8F0',
                color: vista === 'costos_fijos' ? '#FFFFFF' : '#09090B',
                fontWeight: 800,
              }}
            >
              {costosFijos.length}
            </span>
          </button>

          <button
            onClick={() => setVista('historial')}
            className={vista === 'historial' ? 'btn-bacan-primary' : 'btn-bacan-secondary'}
            style={{ height: '36px', padding: '0 14px', fontSize: '12.5px' }}
            title="Historial de recetas guardadas, catálogo y materias primas"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Historial & Catálogo
            <span
              className="tabular-nums"
              style={{
                fontSize: '10.5px',
                padding: '1px 6px',
                borderRadius: '5px',
                backgroundColor: vista === 'historial' ? 'rgba(255,255,255,0.22)' : '#E2E8F0',
                color: vista === 'historial' ? '#FFFFFF' : '#09090B',
                fontWeight: 800,
              }}
            >
              {recetas?.length || 0}
            </span>
          </button>

          {/* Botón de Impacto: "¿Necesitas Ayuda? - Guía del Emprendedor" */}
          <button
            onClick={() => setModalGuiaAbierto(true)}
            className="btn-impact-help"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              height: '36px',
              padding: '0 13px',
              fontSize: '12px',
              fontWeight: 800,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: '#0B0F17',
              backgroundColor: '#E2F800',
              border: '1.5px solid #D4E800',
              borderRadius: '8px',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(226, 248, 0, 0.35)',
              transition: 'all 0.15s ease',
            }}
            title="Aprende los conceptos clave de la aplicación sin rodeos ni jerga"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            ¿Necesitas Ayuda?
          </button>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  fontSize: '11.5px',
                  fontWeight: 600,
                  color: '#475569',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  border: '1px solid #CBD5E1',
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
                className="btn-bacan-secondary"
                style={{
                  height: '34px',
                  padding: '0 10px',
                  fontSize: '12px',
                  color: '#DC2626',
                  borderColor: '#FCA5A5',
                }}
              >
                Salir
              </button>
            </div>
          ) : (
            <button
              onClick={() => setModalAuthAbierto(true)}
              className="btn-bacan-secondary"
              style={{
                height: '36px',
                padding: '0 12px',
                fontSize: '12px',
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Iniciar Sesión
            </button>
          )}
        </nav>
      </header>

      {/* Sub-barra de Telemetría Rápida ImpactM5 */}
      <div
        style={{
          backgroundColor: '#0B0F19',
          borderBottom: '1px solid #1E293B',
          padding: '8px 20px',
          fontSize: '11.5px',
          color: '#94A3B8',
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
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#E2F800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>
              Producto Activo: <strong style={{ color: '#FFFFFF' }}>{recetaEnOlla?.nombre || 'Producto Principal'}</strong>
            </span>
            <span>•</span>
            <span className="tabular-nums">
              Precio (P): <strong style={{ color: '#FFFFFF' }}>{formatCLP(precioVentaConsolidado)}</strong>
            </span>
            <span>•</span>
            <span className="tabular-nums">
              Costo + Fugas: <strong style={{ color: '#EF4444' }}>{formatCLP(analisisFugasActivas.costoDirectoEfectivoTotal)}</strong>
            </span>
            <span>•</span>
            <span className="tabular-nums">
              Ganancia Limpia/u: <strong style={{ color: '#E2F800' }}>{formatCLP(margenContribucion)} ({analisisFugasActivas.margenBrutoRealPorcentaje}%)</strong>
            </span>
            <span>•</span>
            <span className="tabular-nums">
              Sueldo Objetivo: <strong style={{ color: '#38BDF8' }}>{formatCLP(sueldoObjetivo)}</strong>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {vista !== 'insumos' && (
              <button
                type="button"
                onClick={() => setVista('insumos')}
                className="btn-bacan-secondary"
                style={{
                  height: '28px',
                  padding: '0 10px',
                  fontSize: '11px',
                }}
              >
                <span>Abrir Costeo de Ingredientes</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
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

          {vista === 'historial' && (
            <CentroHistorialCatalogo onCargarReceta={() => setVista('insumos')} />
          )}
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

      {/* 4. Barra de Navegación Inferior Flotante Móvil (App / PWA) */}
      <nav className="app-mobile-nav" aria-label="Navegación Móvil">
        <button
          type="button"
          onClick={() => setVista('punto_equilibrio')}
          className={`app-mobile-nav-item ${vista === 'punto_equilibrio' ? 'active' : ''}`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
          <span>Equilibrio</span>
        </button>

        <button
          type="button"
          onClick={() => setVista('insumos')}
          className={`app-mobile-nav-item ${vista === 'insumos' ? 'active' : ''}`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
          </svg>
          <span>Costeo</span>
        </button>

        <button
          type="button"
          onClick={() => setVista('costos_fijos')}
          className={`app-mobile-nav-item ${vista === 'costos_fijos' ? 'active' : ''}`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
          <span>Costos Fijos</span>
        </button>

        <button
          type="button"
          onClick={() => setVista('historial')}
          className={`app-mobile-nav-item ${vista === 'historial' ? 'active' : ''}`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span>Historial</span>
        </button>

        <button
          type="button"
          onClick={() => setModalGuiaAbierto(true)}
          className="app-mobile-nav-item"
        >
          <div style={{ backgroundColor: '#E2F800', padding: '2px 8px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0B0F17" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <span style={{ color: '#0B0F17', fontWeight: 800 }}>Ayuda</span>
        </button>
      </nav>

      <AuthModal
        isOpen={modalAuthAbierto}
        onClose={() => {
          sessionStorage.setItem('mba_auth_dismissed', '1');
          setModalAuthAbierto(false);
        }}
        onAuthSuccess={() => {
          sessionStorage.setItem('mba_auth_dismissed', '1');
          setModalAuthAbierto(false);
        }}
      />

      <GuiaEmprendedorModal
        isOpen={modalGuiaAbierto}
        onClose={() => setModalGuiaAbierto(false)}
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