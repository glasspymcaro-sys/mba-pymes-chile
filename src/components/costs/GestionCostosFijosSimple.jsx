import React, { useState } from 'react';
import { useAppState } from '../../store/appState.jsx';
import { formatCLP } from '../../utils/formatters.js';

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
        backgroundColor: 'var(--color-surface)',
        borderRadius: '12px',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-card)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-foreground)', margin: 0 }}>
            Costos Fijos Operacionales
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--color-muted-foreground)', margin: '2px 0 0 0' }}>
            Compromisos mensuales estructurales independientes del volumen de ventas
          </p>
        </div>
        <div style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: '#f8fafc', textAlign: 'right' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-muted-foreground)', display: 'block' }}>TOTAL COSTOS FIJOS</span>
          <span className="tabular-nums" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-foreground)' }}>
            {formatCLP(costoFijoTotal)}
          </span>
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
          <label style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--color-muted-foreground)', display: 'block', marginBottom: '4px' }}>
            CONCEPTO DEL COSTO FIJO
          </label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Arriendo, Sueldos fijos..."
            required
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid var(--color-border)',
              backgroundColor: '#ffffff',
              fontSize: '14px',
              color: 'var(--color-foreground)',
              boxSizing: 'border-box',
              outline: 'none',
            }}
          />
        </div>

        <div>
          <label style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--color-muted-foreground)', display: 'block', marginBottom: '4px' }}>
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
              borderRadius: '8px',
              border: '1px solid var(--color-border)',
              backgroundColor: '#ffffff',
              fontSize: '14px',
              color: 'var(--color-foreground)',
              boxSizing: 'border-box',
              outline: 'none',
            }}
          />
        </div>

        <div>
          <label style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--color-muted-foreground)', display: 'block', marginBottom: '4px' }}>
            CATEGORÍA
          </label>
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid var(--color-border)',
              backgroundColor: '#ffffff',
              fontSize: '14px',
              color: 'var(--color-foreground)',
              boxSizing: 'border-box',
              outline: 'none',
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
            padding: '10px 18px',
            minHeight: '40px',
            borderRadius: '8px',
            backgroundColor: 'var(--color-primary)',
            color: '#ffffff',
            border: 'none',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Agregar costo fijo
        </button>
      </form>

      {/* Lista de Costos Fijos */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
        {costosFijos.map((cf) => (
          <div
            key={cf.id}
            style={{
              padding: '14px 18px',
              borderRadius: '8px',
              border: '1px solid var(--color-border)',
              backgroundColor: '#ffffff',
              boxShadow: 'var(--shadow-card)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <span style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--color-muted-foreground)', textTransform: 'uppercase' }}>
                {cf.categoria || 'Fijo'}
              </span>
              <h4 style={{ margin: '2px 0 4px 0', fontSize: '14px', fontWeight: 700, color: 'var(--color-foreground)' }}>
                {cf.nombre}
              </h4>
              <span className="tabular-nums" style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-primary)' }}>
                {formatCLP(cf.monto)} / mes
              </span>
            </div>

            <button
              onClick={() => eliminarCostoFijo(cf.id)}
              title="Eliminar costo fijo"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                border: '1px solid var(--color-border)',
                backgroundColor: '#ffffff',
                color: 'var(--color-danger)',
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
