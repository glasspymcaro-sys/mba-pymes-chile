import React, { useState } from 'react';
import { useAppState } from '../../store/appState.jsx';
import { formatearCLP } from '../../utils/formatters.js';

export default function GestionCostosFijosSimple() {
  const { costosFijos, agregarCostoFijo, eliminarCostoFijo, costoFijoTotal } = useAppState();
  const [nombre, setNombre] = useState('');
  const [monto, setMonto] = useState('');
  const [categoria, setCategoria] = useState('Infraestructura');

  const handleCrear = (e) => {
    e.preventDefault();
    const val = Number(monto) || 0;
    if (!nombre.trim() || val <= 0) return;

    agregarCostoFijo({
      id: 'cf_' + Date.now(),
      nombre: nombre.trim(),
      monto: val,
      categoria,
    });

    setNombre('');
    setMonto('');
  };

  return (
    <div
      style={{
        background: 'var(--bg-neumorphic)',
        borderRadius: '24px',
        padding: '24px',
        boxShadow: 'var(--neu-flat)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--primary-color)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
            Estructura Estructural Fija
          </span>
          <h2 style={{ fontSize: '18px', fontWeight: '900', color: '#1a202c', margin: '4px 0 0 0' }}>
            Costos Fijos Operacionales
          </h2>
        </div>
        <div style={{ padding: '8px 16px', borderRadius: '12px', boxShadow: 'var(--neu-pressed)', textAlign: 'right' }}>
          <span style={{ fontSize: '10.5px', fontWeight: '700', color: 'var(--text-muted)', display: 'block' }}>TOTAL COSTOS FIJOS</span>
          <span style={{ fontSize: '17px', fontWeight: '900', color: '#1a202c' }}>{formatearCLP(costoFijoTotal)}</span>
        </div>
      </div>

      {/* Formulario para agregar nuevo costo fijo */}
      <form
        onSubmit={handleCrear}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr)) auto',
          gap: '12px',
          alignItems: 'flex-end',
        }}
      >
        <div>
          <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
            CONCEPTO DEL COSTO FIJO
          </label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Arriendo, Seguros, Sueldo básico..."
            required
            style={{
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
            }}
          />
        </div>

        <div>
          <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
            MONTO MENSUAL ($ CLP)
          </label>
          <input
            type="number"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            placeholder="Ej: 500000"
            required
            min="1"
            style={{
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
            }}
          />
        </div>

        <div>
          <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
            CATEGORÍA
          </label>
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            style={{
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
              cursor: 'pointer',
            }}
          >
            <option value="Infraestructura">Infraestructura</option>
            <option value="Personal">Personal</option>
            <option value="Operacional">Operacional</option>
            <option value="Tecnología">Tecnología</option>
          </select>
        </div>

        <button
          type="submit"
          style={{
            padding: '11px 18px',
            borderRadius: '10px',
            backgroundColor: 'var(--primary-color)',
            color: '#ffffff',
            border: 'none',
            fontSize: '12px',
            fontWeight: '800',
            cursor: 'pointer',
            boxShadow: 'var(--neu-flat-sm)',
            whiteSpace: 'nowrap',
          }}
        >
          Agregar Costo Fijo
        </button>
      </form>

      {/* Lista de Costos Fijos */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
        {costosFijos.map((cf) => (
          <div
            key={cf.id}
            style={{
              padding: '14px 18px',
              borderRadius: '16px',
              background: 'var(--bg-neumorphic)',
              boxShadow: 'var(--neu-flat-sm)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <span style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                {cf.categoria || 'Fijo'}
              </span>
              <h4 style={{ margin: '2px 0 4px 0', fontSize: '13.5px', fontWeight: '800', color: '#1a202c' }}>
                {cf.nombre}
              </h4>
              <span style={{ fontSize: '13px', fontWeight: '900', color: 'var(--primary-color)' }}>
                {formatearCLP(cf.monto)} / mes
              </span>
            </div>

            <button
              onClick={() => eliminarCostoFijo(cf.id)}
              title="Eliminar costo fijo"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: 'var(--bg-neumorphic)',
                color: 'var(--accent-red)',
                boxShadow: 'var(--neu-flat-sm)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
