import React, { useState } from 'react';
import { useAppState } from '../../store/appState.jsx';
import Logo from '../../components/illustrations/Logo.jsx';
import IlustracionRestaurant from '../../components/illustrations/IlustracionRestaurant.jsx';
import IlustracionMinimarket from '../../components/illustrations/IlustracionMinimarket.jsx';
import IlustracionServices from '../../components/illustrations/IlustracionServices.jsx';
import AuthModal from '../../components/auth/AuthModal.jsx';

const OPCIONES = [
  {
    id: 'restaurant',
    titulo: 'Restaurante o local de comida',
    descripcion: 'Vendes platos o menús, y tus costos cambian según los ingredientes y recetas que utilices.',
    Ilustracion: IlustracionRestaurant,
    color: '#3182ce',
  },
  {
    id: 'minimarket',
    titulo: 'Minimarket o almacén',
    descripcion: 'Compras productos mayoristas para reventa, proyectando inventario, rotación y alertas de reposición.',
    Ilustracion: IlustracionMinimarket,
    color: '#38a169',
  },
  {
    id: 'services',
    titulo: 'Servicios (por hora o proyecto)',
    descripcion: 'Cobras por honorarios, horas-hombre de tu equipo o proyectos con costos directos asignados.',
    Ilustracion: IlustracionServices,
    color: '#4a5568',
  },
];

export default function SeleccionPerfil() {
  const { elegirPerfil, user, cerrarSesion } = useAppState();
  const [modalAuth, setModalAuth] = useState(false);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '36px 24px',
        backgroundColor: 'var(--bg-neumorphic)',
        boxSizing: 'border-box',
        position: 'relative',
      }}
    >
      {/* Barra de acceso superior */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          right: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>
              {user.email}
            </span>
            <button
              onClick={cerrarSesion}
              style={{
                padding: '6px 12px',
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
              Cerrar Sesión
            </button>
          </div>
        ) : (
          <button
            onClick={() => setModalAuth(true)}
            style={{
              padding: '8px 16px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              background: 'var(--bg-neumorphic)',
              color: 'var(--primary-color)',
              boxShadow: 'var(--neu-flat-sm)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Iniciar Sesión / Nube Supabase
          </button>
        )}
      </div>

      <div
        style={{
          background: 'var(--bg-neumorphic)',
          padding: '16px 32px',
          borderRadius: '24px',
          marginBottom: '28px',
          boxShadow: 'var(--neu-flat)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Logo />
      </div>

      <h1
        style={{
          fontSize: '30px',
          fontWeight: 900,
          color: '#1a202c',
          margin: '0 0 10px 0',
          textAlign: 'center',
          letterSpacing: '-0.5px',
        }}
      >
        Selecciona tu modelo de negocio
      </h1>

      <p
        style={{
          fontSize: '14.5px',
          color: 'var(--text-muted)',
          margin: '0 0 36px 0',
          textAlign: 'center',
          maxWidth: '580px',
          lineHeight: 1.6,
        }}
      >
        Configuraremos la estructura de costos y la matriz de punto de equilibrio según la dinámica de tu operación.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
          gap: '28px',
          width: '100%',
          maxWidth: '1100px',
        }}
      >
        {OPCIONES.map((opcion) => {
          const Ilustracion = opcion.Ilustracion;
          return (
            <div
              key={opcion.id}
              onClick={() => elegirPerfil(opcion.id)}
              style={{
                background: 'var(--bg-neumorphic)',
                borderRadius: '24px',
                padding: '24px',
                cursor: 'pointer',
                boxShadow: 'var(--neu-flat)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '12px 12px 24px #b8bec9, -12px -12px 24px #ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--neu-flat)';
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.boxShadow = 'var(--neu-pressed)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.boxShadow = 'var(--neu-flat)';
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '140px',
                  borderRadius: '16px',
                  boxShadow: 'var(--neu-pressed)',
                  background: 'var(--bg-neumorphic)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  marginBottom: '20px',
                  padding: '12px',
                  boxSizing: 'border-box',
                }}
              >
                <Ilustracion />
              </div>

              <h3
                style={{
                  margin: '0 0 10px 0',
                  fontSize: '18px',
                  fontWeight: 800,
                  color: opcion.color,
                  letterSpacing: '-0.3px',
                }}
              >
                {opcion.titulo}
              </h3>

              <p
                style={{
                  margin: 0,
                  fontSize: '13.5px',
                  color: 'var(--text-muted)',
                  lineHeight: 1.55,
                }}
              >
                {opcion.descripcion}
              </p>
            </div>
          );
        })}
      </div>

      <AuthModal
        isOpen={modalAuth}
        onClose={() => setModalAuth(false)}
        onAuthSuccess={() => setModalAuth(false)}
      />
    </div>
  );
}