import React, { useState } from 'react';
import { AppStateProvider, useAppState } from './store/appState.jsx';
import { VISTAS } from './core/router.js';
import SeleccionPerfil from './modules/onboarding/SeleccionPerfil.jsx';
import DashboardPrincipal from './views/DashboardPrincipal.jsx';
import ModuloRestaurant from './modules/restaurant/index.jsx'; 
import ModuloMinimarket from './modules/minimarket/index.jsx';
import ModuloServicios from './modules/services/index.jsx';
import PanelFlujoCaja from './components/cashflow/PanelFlujoCaja.jsx';
import GestionMermas from './views/GestionMermas.jsx';
import ConfiguracionMargenes from './views/ConfiguracionMargenes.jsx';
import MercadoAlianzas from './views/MercadoAlianzas.jsx';
import SimuladorEscenarios from './views/SimuladorEscenarios.jsx';
import IntegracionErp from './views/IntegracionErp.jsx';
import GestionInventarioLIFO from './views/GestionInventarioLIFO.jsx';
import AsesorFinancieroIA from './components/ai/AsesorFinancieroIA.jsx';
import AuthModal from './components/auth/AuthModal.jsx';
import Logo from './components/illustrations/Logo.jsx';

function ContenidoPrincipal() {
  const {
    perfil,
    nombreNegocio,
    reiniciarNegocio,
    user,
    cerrarSesion,
    syncStatus,
    sincronizarConNube,
  } = useAppState();

  const [vista, setVista] = useState(VISTAS.PANEL);
  const [modalAuthAbierto, setModalAuthAbierto] = useState(false);

  if (!perfil) {
    return <SeleccionPerfil />;
  }

  const renderizarVista = () => {
    if (vista === VISTAS.PANEL) return <DashboardPrincipal />;
    if (vista === 'asesor_ia') return <AsesorFinancieroIA />;
    if (vista === 'flujo_caja') return <PanelFlujoCaja />;
    if (vista === 'inventario_lifo') return <GestionInventarioLIFO />;
    if (vista === 'mermas') return <GestionMermas />;
    if (vista === 'margenes') return <ConfiguracionMargenes />;
    if (vista === 'escenarios') return <SimuladorEscenarios />;
    if (vista === 'mercado_alianzas') return <MercadoAlianzas />;
    if (vista === 'integracion_erp') return <IntegracionErp />;
    if (vista === VISTAS.COSTOS) {
      if (perfil === 'restaurant') return <ModuloRestaurant />;
      if (perfil === 'minimarket') return <ModuloMinimarket />;
      if (perfil === 'services') return <ModuloServicios />;
    }
    return null;
  };

  const botonNavStyle = (activo) => ({
    padding: '7px 12px',
    borderRadius: '10px',
    fontSize: '11.5px',
    fontWeight: '700',
    cursor: 'pointer',
    background: 'var(--bg-neumorphic)',
    color: activo ? 'var(--primary-color)' : 'var(--text-muted)',
    boxShadow: activo ? 'var(--neu-pressed)' : 'var(--neu-flat-sm)',
    border: 'none',
    transition: 'all 0.15s ease',
    whiteSpace: 'nowrap',
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-neumorphic)' }}>
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
          position: 'relative',
          zIndex: 30,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Logo style={{ height: '30px' }} />
          <span
            style={{
              fontSize: '10.5px',
              fontWeight: '800',
              color: 'var(--text-muted)',
              padding: '4px 10px',
              borderRadius: '8px',
              boxShadow: 'var(--neu-pressed)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            {nombreNegocio}
          </span>

          {/* Indicador de sincronización en Nube */}
          {user && (
            <div
              onClick={sincronizarConNube}
              title="Haz clic para forzar sincronización con Supabase"
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
                color:
                  syncStatus === 'synced'
                    ? '#2f855a'
                    : syncStatus === 'syncing'
                    ? '#d69e2e'
                    : syncStatus === 'error'
                    ? '#e53e3e'
                    : 'var(--text-muted)',
              }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="8" />
              </svg>
              <span>
                {syncStatus === 'synced'
                  ? 'Nube Sincronizada'
                  : syncStatus === 'syncing'
                  ? 'Guardando...'
                  : syncStatus === 'error'
                  ? 'Error al guardar'
                  : 'Nube activa'}
              </span>
            </div>
          )}
        </div>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button onClick={() => setVista(VISTAS.PANEL)} style={botonNavStyle(vista === VISTAS.PANEL)}>
            Panel
          </button>
          <button onClick={() => setVista('asesor_ia')} style={botonNavStyle(vista === 'asesor_ia')}>
            Asesor Financiero IA
          </button>
          <button onClick={() => setVista('flujo_caja')} style={botonNavStyle(vista === 'flujo_caja')}>
            Flujo de caja
          </button>
          <button onClick={() => setVista('inventario_lifo')} style={botonNavStyle(vista === 'inventario_lifo')}>
            Inventario LIFO
          </button>
          <button onClick={() => setVista('mermas')} style={botonNavStyle(vista === 'mermas')}>
            Mermas
          </button>
          <button onClick={() => setVista('margenes')} style={botonNavStyle(vista === 'margenes')}>
            Márgenes y Precios
          </button>
          <button onClick={() => setVista('escenarios')} style={botonNavStyle(vista === 'escenarios')}>
            Simulador de Estrés
          </button>
          <button onClick={() => setVista('mercado_alianzas')} style={botonNavStyle(vista === 'mercado_alianzas')}>
            Mercado y Alianzas
          </button>
          <button onClick={() => setVista('integracion_erp')} style={botonNavStyle(vista === 'integracion_erp')}>
            Conector ERP
          </button>
          <button onClick={() => setVista(VISTAS.COSTOS)} style={botonNavStyle(vista === VISTAS.COSTOS)}>
            Estructura de costos
          </button>

          {/* Botón de cuenta de usuario / Supabase */}
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
                  maxWidth: '120px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
                title={user.email}
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
                  whiteSpace: 'nowrap',
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
                fontSize: '11px',
                fontWeight: '700',
                cursor: 'pointer',
                background: 'var(--bg-neumorphic)',
                color: 'var(--primary-color)',
                boxShadow: 'var(--neu-flat-sm)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                whiteSpace: 'nowrap',
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Iniciar Sesión
            </button>
          )}

          <button
            onClick={reiniciarNegocio}
            style={{
              padding: '7px 12px',
              borderRadius: '10px',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer',
              background: 'var(--bg-neumorphic)',
              color: 'var(--text-muted)',
              boxShadow: 'var(--neu-flat-sm)',
              border: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            Cambiar negocio
          </button>
        </nav>
      </header>

      <main style={{ flex: 1, padding: '24px', maxWidth: '1400px', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
        {renderizarVista()}
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