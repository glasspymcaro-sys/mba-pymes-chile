import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [modo, setModo] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombreEmpresa, setNombreEmpresa] = useState('');
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [tipoMensaje, setTipoMensaje] = useState('info'); // 'info' | 'error' | 'success'

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje(null);

    try {
      if (modo === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) throw error;
        setTipoMensaje('success');
        setMensaje('Inicio de sesión exitoso.');
        setTimeout(() => {
          onAuthSuccess(data.user);
          onClose();
        }, 600);
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              nombre_negocio: nombreEmpresa.trim() || 'Mi Negocio PyME',
            },
          },
        });

        if (error) throw error;

        // Crear registro en tabla profiles
        if (data?.user) {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            email: data.user.email,
            nombre_negocio: nombreEmpresa.trim() || 'Mi Negocio PyME',
            perfil: 'restaurant',
          });
        }

        setTipoMensaje('success');
        setMensaje('Cuenta creada correctamente. Accediendo al sistema...');
        setTimeout(() => {
          onAuthSuccess(data.user);
          onClose();
        }, 800);
      }
    } catch (err) {
      setTipoMensaje('error');
      setMensaje(err.message || 'Error al procesar la solicitud.');
    } finally {
      setCargando(false);
    }
  };

  const handleIngresoInvitado = async () => {
    setCargando(true);
    setMensaje(null);
    try {
      // Generar o recuperar usuario local persistente
      let guestId = localStorage.getItem('mba_pyme_guest_id');
      if (!guestId) {
        guestId = 'guest_' + Math.random().toString(36).substring(2, 12);
        localStorage.setItem('mba_pyme_guest_id', guestId);
      }

      const guestUser = {
        id: guestId,
        email: 'invitado@mbapymes.cl',
        user_metadata: {
          nombre_negocio: 'Empresa Demo PyME',
        },
        isGuest: true,
      };

      // Intentar sincronizar en segundo plano sin bloquear la experiencia del usuario
      try {
        supabase.from('profiles').upsert({
          id: guestId,
          email: guestUser.email,
          nombre_negocio: 'Empresa Demo PyME',
          perfil: 'restaurant',
        }).catch(() => {});
      } catch (e) {}

      localStorage.setItem('mba_auth_guest', 'true');
      sessionStorage.setItem('mba_auth_dismissed', '1');
      setTipoMensaje('success');
      setMensaje('Sesión demo iniciada.');
      onAuthSuccess(guestUser);
      onClose();
    } catch (err) {
      setTipoMensaje('error');
      setMensaje('Error al crear sesión de invitado: ' + err.message);
    } finally {
      setCargando(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '8px',
    border: '1.5px solid #1E293B',
    outline: 'none',
    backgroundColor: '#070A0F',
    fontSize: '13px',
    color: '#F8FAFC',
    boxSizing: 'border-box',
    marginBottom: '14px',
    transition: 'border-color 0.15s ease',
  };

  const botonStyle = {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#E2F800',
    color: '#0B0F17',
    fontSize: '13px',
    fontWeight: '900',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    cursor: cargando ? 'not-allowed' : 'pointer',
    boxShadow: '0 4px 14px rgba(226, 248, 0, 0.25)',
    transition: 'all 0.15s ease',
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 8, 15, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '16px',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: '#0B0F17',
          color: '#F8FAFC',
          borderRadius: '16px',
          padding: '30px',
          boxShadow: '0 25px 60px -10px rgba(0, 0, 0, 0.7), 0 0 35px rgba(226, 248, 0, 0.08)',
          border: '1.5px solid #1E293B',
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer',
            color: '#64748B',
            fontWeight: 'bold',
            transition: 'color 0.15s ease',
          }}
          aria-label="Cerrar modal"
          onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#64748B')}
        >
          ✕
        </button>

        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <span
              style={{
                fontSize: '10px',
                fontWeight: 900,
                color: '#0B0F17',
                backgroundColor: '#E2F800',
                padding: '2px 8px',
                borderRadius: '4px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              ACCESO SEGURO
            </span>
          </div>
          <h2
            style={{
              fontSize: '20px',
              fontWeight: 900,
              color: '#FFFFFF',
              margin: '0 0 6px 0',
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
            }}
          >
            {modo === 'login' ? 'Iniciar Sesión' : 'Registro de Empresa'}
          </h2>
          <p style={{ fontSize: '12.5px', color: '#94A3B8', margin: 0, lineHeight: 1.45 }}>
            {modo === 'login'
              ? 'Ingresa tus credenciales para sincronizar tu estructura de costos'
              : 'Crea tu cuenta empresarial para guardar tus recetas y catálogo'}
          </p>
        </div>

        {mensaje && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 600,
              marginBottom: '16px',
              backgroundColor: tipoMensaje === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
              color: tipoMensaje === 'error' ? '#FCA5A5' : '#6EE7B7',
              border: `1px solid ${tipoMensaje === 'error' ? '#EF4444' : '#10B981'}`,
            }}
          >
            {mensaje}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {modo === 'register' && (
            <div>
              <label style={{ fontSize: '10.5px', fontWeight: 800, color: '#94A3B8', display: 'block', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Nombre del Negocio o PyME
              </label>
              <input
                type="text"
                value={nombreEmpresa}
                onChange={(e) => setNombreEmpresa(e.target.value)}
                placeholder="Ej: Cafetería Valdivia"
                required={modo === 'register'}
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#E2F800')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#1E293B')}
              />
            </div>
          )}

          <div>
            <label style={{ fontSize: '10.5px', fontWeight: 800, color: '#94A3B8', display: 'block', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Correo Electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@empresa.cl"
              required
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#E2F800')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#1E293B')}
            />
          </div>

          <div>
            <label style={{ fontSize: '10.5px', fontWeight: 800, color: '#94A3B8', display: 'block', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#E2F800')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#1E293B')}
            />
          </div>

          <button
            type="submit"
            disabled={cargando}
            style={botonStyle}
            onMouseEnter={(e) => !cargando && (e.currentTarget.style.transform = 'translateY(-1.5px)')}
            onMouseLeave={(e) => !cargando && (e.currentTarget.style.transform = 'translateY(0)')}
          >
            {cargando ? 'Procesando...' : modo === 'login' ? 'Acceder al Tablero' : 'Crear Cuenta'}
          </button>
        </form>

        <div style={{ marginTop: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => {
              setModo(modo === 'login' ? 'register' : 'login');
              setMensaje(null);
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#E2F800',
              fontSize: '11.5px',
              fontWeight: 800,
              cursor: 'pointer',
              padding: 0,
            }}
          >
            {modo === 'login' ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
          </button>

          <button
            type="button"
            onClick={handleIngresoInvitado}
            style={{
              background: 'none',
              border: 'none',
              color: '#94A3B8',
              fontSize: '11.5px',
              fontWeight: 600,
              textDecoration: 'underline',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            Entrar como Invitado Demo
          </button>
        </div>
      </div>
    </div>
  );
}

