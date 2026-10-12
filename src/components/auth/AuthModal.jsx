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

      // Registrar o sincronizar en profiles de Supabase
      await supabase.from('profiles').upsert({
        id: guestId,
        email: guestUser.email,
        nombre_negocio: 'Empresa Demo PyME',
        perfil: 'restaurant',
      });

      setTipoMensaje('success');
      setMensaje('Sesión demo iniciada correctamente.');
      setTimeout(() => {
        onAuthSuccess(guestUser);
        onClose();
      }, 500);
    } catch (err) {
      setTipoMensaje('error');
      setMensaje('Error al crear sesión de invitado: ' + err.message);
    } finally {
      setCargando(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '10px',
    border: 'none',
    outline: 'none',
    backgroundColor: 'var(--bg-neumorphic)',
    boxShadow: 'var(--neu-pressed)',
    fontSize: '13px',
    color: 'var(--text-main)',
    boxSizing: 'border-box',
    marginBottom: '14px',
  };

  const botonStyle = {
    width: '100%',
    padding: '11px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: 'var(--primary-color)',
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: '700',
    cursor: cargando ? 'not-allowed' : 'pointer',
    boxShadow: 'var(--neu-flat-sm)',
    transition: 'all 0.15s ease',
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '16px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: 'var(--bg-neumorphic)',
          borderRadius: '20px',
          padding: '28px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
          border: '1px solid rgba(255, 255, 255, 0.5)',
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
            color: 'var(--text-muted)',
            fontWeight: 'bold',
          }}
          aria-label="Cerrar modal"
        >
          ✕
        </button>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2
            style={{
              fontSize: '18px',
              fontWeight: '800',
              color: 'var(--text-main)',
              margin: '0 0 6px 0',
              letterSpacing: '-0.3px',
            }}
          >
            {modo === 'login' ? 'Iniciar Sesión en MBA PyMEs' : 'Registro de Empresa / Usuario'}
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
            {modo === 'login'
              ? 'Conéctate a tu base de datos centralizada en Supabase'
              : 'Crea tu cuenta institucional para persistir tu estructura de costos'}
          </p>
        </div>

        {mensaje && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '10px',
              fontSize: '12px',
              marginBottom: '16px',
              backgroundColor: tipoMensaje === 'error' ? '#fee2e2' : '#ecfdf5',
              color: tipoMensaje === 'error' ? '#b91c1c' : '#047857',
              border: `1px solid ${tipoMensaje === 'error' ? '#fca5a5' : '#a7f3d0'}`,
            }}
          >
            {mensaje}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {modo === 'register' && (
            <div>
              <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                NOMBRE DE LA EMPRESA O NEGOCIO
              </label>
              <input
                type="text"
                value={nombreEmpresa}
                onChange={(e) => setNombreEmpresa(e.target.value)}
                placeholder="Ej: Cafetería y Tostaduría Valdivia"
                required={modo === 'register'}
                style={inputStyle}
              />
            </div>
          )}

          <div>
            <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              CORREO ELECTRÓNICO
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@empresa.cl"
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              CONTRASEÑA
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              style={inputStyle}
            />
          </div>

          <button type="submit" disabled={cargando} style={botonStyle}>
            {cargando ? 'Procesando...' : modo === 'login' ? 'Acceder al Sistema' : 'Crear Cuenta y Conectar'}
          </button>
        </form>

        <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => {
              setModo(modo === 'login' ? 'register' : 'login');
              setMensaje(null);
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--primary-color)',
              fontSize: '11.5px',
              fontWeight: '700',
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
              color: 'var(--text-muted)',
              fontSize: '11.5px',
              textDecoration: 'underline',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            Acceso Rápido Demo
          </button>
        </div>
      </div>
    </div>
  );
}
