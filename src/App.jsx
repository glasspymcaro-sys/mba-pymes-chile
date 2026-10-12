import React, { useState } from 'react';
import { AppStateProvider, useAppState } from './store/appState.jsx';
import DashboardPrincipal from './views/DashboardPrincipal.jsx';
import CarruselInsumos3D from './components/carousel3d/CarruselInsumos3D.jsx';
import GestionCostosFijosSimple from './components/costs/GestionCostosFijosSimple.jsx';
import AsesorFinancieroIA from './components/ai/AsesorFinancieroIA.jsx';
import AuthModal from './components/auth/AuthModal.jsx';
import Logo from './components/illustrations/Logo.jsx';
import { formatearCLP } from './utils/formatters.js';

function ContenidoPrincipal() {
  const {
    perfil,
    cambiarPerfil,
    nombreNegocio,
    user,
    cerrarSesion,
    syncStatus,
    sincronizarConNube,
    insumos,
    insumosAsignados,
    agregarInsumo,
    eliminarInsumo,
    asignarInsumoAContenedor,
    costoVariableConsolidado,
    costoFijoTotal,
    precioVentaConsolidado,
  } = useAppState();

  const [vista, setVista] = useState('punto_equilibrio'); // 'punto_equilibrio' | 'insumos_3d' | 'costos_fijos' | 'asesor_ia'
  const [modalAuthAbierto, setModalAuthAbierto] = useState(false);

  // Cálculos rápidos de Punto de Equilibrio para el Header
  const margenContribucion = Math.max(0, precioVentaConsolidado - costoVariableConsolidado);
  const peUnidades = margenContribucion > 0 ? Math.ceil(costoFijoTotal / margenContribucion) : 0;
  const pePesos = peUnidades * precioVentaConsolidado;

  const botonNavStyle = (activo) => ({
    padding: '8px 14px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '800',
    cursor: 'pointer',
    background: 'var(--bg-neumorphic)',
    color: activo ? 'var(--primary-color)' : 'var(--text-muted)',
    boxShadow: activo ? 'var(--neu-pressed)' : 'var(--neu-flat-sm)',
    border: 'none',
    transition: 'all 0.15s ease',
    whiteSpace: 'nowrap',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  });

  const botonRubroStyle = (activo) => ({
    padding: '6px 12px',
    borderRadius: '10px',
    fontSize: '11px',
    fontWeight: '800',
    cursor: 'pointer',
    background: 'var(--bg-neumorphic)',
    color: activo ? '#ffffff' : 'var(--text-main)',
    backgroundColor: activo ? 'var(--primary-color)' : 'var(--bg-neumorphic)',
    boxShadow: activo ? 'var(--neu-pressed)' : 'var(--neu-flat-sm)',
    border: 'none',
    transition: 'all 0.15s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-neumorphic)' }}>
      {/* 1. Barra de Navegación y Control Directivo */}
      <header
        style={{
          backgroundColor: 'var(--bg-neumorphic)',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          boxShadow: 'var(--neu-flat-sm)',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}
      >
        {/* Identidad y Selector de Rubro de Negocio */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <Logo style={{ height: '28px' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px', borderRadius: '12px', boxShadow: 'var(--neu-pressed)' }}>
            <button
              onClick={() => cambiarPerfil('restaurant')}
              style={botonRubroStyle(perfil === 'restaurant')}
              title="Cambiar a modelo Restaurante (Ollita 3D)"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
              title="Cambiar a modelo Minimarket (Góndola 3D)"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              Minimarket
            </button>

            <button
              onClick={() => cambiarPerfil('services')}
              style={botonRubroStyle(perfil === 'services')}
              title="Cambiar a modelo Servicios (Mesa 3D)"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
              Servicios
            </button>
          </div>

          {/* Badge del Punto de Equilibrio en Vivo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '8px',
              boxShadow: 'var(--neu-pressed)',
              fontSize: '11px',
              fontWeight: '800',
              color: 'var(--primary-color)',
            }}
          >
            <span>PE: {peUnidades.toLocaleString('es-CL')} un.</span>
            <span style={{ color: 'var(--text-muted)' }}>({formatearCLP(pePesos)})</span>
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
                fontSize: '10.5px',
                fontWeight: '700',
                padding: '3px 8px',
                borderRadius: '6px',
                cursor: 'pointer',
                background: 'var(--bg-neumorphic)',
                boxShadow: 'var(--neu-flat-sm)',
                color: syncStatus === 'synced' ? '#2f855a' : syncStatus === 'syncing' ? '#d69e2e' : '#e53e3e',
              }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="8" />
              </svg>
              <span>{syncStatus === 'synced' ? 'Nube Sincronizada' : syncStatus === 'syncing' ? 'Guardando...' : 'Nube'}</span>
            </div>
          )}
        </div>

        {/* Módulos Principales Centrados en Punto de Equilibrio */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setVista('punto_equilibrio')}
            style={botonNavStyle(vista === 'punto_equilibrio')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
            Punto de Equilibrio
          </button>

          <button
            onClick={() => setVista('insumos_3d')}
            style={botonNavStyle(vista === 'insumos_3d')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
            Generador 3D & Costos Directos
          </button>

          <button
            onClick={() => setVista('costos_fijos')}
            style={botonNavStyle(vista === 'costos_fijos')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Costos Fijos
          </button>

          <button
            onClick={() => setVista('asesor_ia')}
            style={botonNavStyle(vista === 'asesor_ia')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            Asesor Financiero IA
          </button>

          {/* Gestión de Usuario */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  color: 'var(--text-muted)',
                  padding: '4px 8px',
                  borderRadius: '8px',
                  boxShadow: 'var(--neu-pressed)',
                  maxWidth: '110px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {user.email}
              </span>
              <button
                onClick={cerrarSesion}
                style={{
                  padding: '7px 10px',
                  borderRadius: '10px',
                  fontSize: '11px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  background: 'var(--bg-neumorphic)',
                  color: 'var(--accent-red)',
                  boxShadow: 'var(--neu-flat-sm)',
                  border: 'none',
                }}
              >
                Salir
              </button>
            </div>
          ) : (
            <button
              onClick={() => setModalAuthAbierto(true)}
              style={{
                padding: '7px 12px',
                borderRadius: '10px',
                fontSize: '11.5px',
                fontWeight: '700',
                cursor: 'pointer',
                background: 'var(--bg-neumorphic)',
                color: 'var(--primary-color)',
                boxShadow: 'var(--neu-flat-sm)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Iniciar Sesión
            </button>
          )}
        </nav>
      </header>

      {/* 2. Área de Trabajo Principal */}
      <main style={{ flex: 1, padding: '24px', maxWidth: '1400px', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
        {vista === 'punto_equilibrio' && <DashboardPrincipal />}

        {vista === 'insumos_3d' && (
          <CarruselInsumos3D
            rubro={perfil}
            insumos={insumos}
            insumosAsignados={insumosAsignados}
            onAgregarInsumo={agregarInsumo}
            onEliminarInsumo={eliminarInsumo}
            onAsignarCostoDirecto={asignarInsumoAContenedor}
          />
        )}

        {vista === 'costos_fijos' && <GestionCostosFijosSimple />}

        {vista === 'asesor_ia' && <AsesorFinancieroIA />}
      </main>

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
    <AppStateProvider>
      <ContenidoPrincipal />
    </AppStateProvider>
  );
}