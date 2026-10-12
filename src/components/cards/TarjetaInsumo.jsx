import React, { useState } from 'react';
import { formatearCLP } from '../../utils/formatters.js';

// Una tarjeta por cada costo del negocio (por ejemplo "Arriendo" o
// "Ingredientes por plato"). Se puede editar el monto tocando el número,
// o borrar la tarjeta completa con el botón "Eliminar".
export default function TarjetaInsumo({ insumo, onEditar, onEliminar }) {
  const [editando, setEditando] = useState(false);
  const [montoTemporal, setMontoTemporal] = useState(insumo.monto);

  function guardarCambio() {
    onEditar(insumo.id, { monto: Number(montoTemporal) || 0 });
    setEditando(false);
  }

  const esFijo = insumo.tipo === 'fijo';

  return (
    <div
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: '10px',
        padding: '16px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span
            style={{
              fontSize: '10px',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '999px',
              color: esFijo ? 'var(--color-navy)' : 'var(--color-blue)',
              border: `1px solid ${esFijo ? 'var(--color-navy)' : 'var(--color-blue)'}`,
              textTransform: 'uppercase',
              letterSpacing: '0.3px',
            }}
          >
            {esFijo ? 'Costo fijo' : 'Costo por venta'}
          </span>
        </div>
        <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: 'var(--color-text)' }}>{insumo.nombre}</p>
      </div>

      {editando ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="number"
            value={montoTemporal}
            onChange={(e) => setMontoTemporal(e.target.value)}
            style={{
              width: '110px',
              padding: '8px 10px',
              borderRadius: '6px',
              border: '1px solid var(--color-border)',
              fontSize: '13px',
            }}
            autoFocus
          />
          <button
            onClick={guardarCambio}
            style={{
              backgroundColor: 'var(--color-navy)',
              color: 'white',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12.5px',
              fontWeight: 700,
            }}
          >
            Guardar
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span
            onClick={() => setEditando(true)}
            title="Tocar para editar el monto"
            style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-text)', cursor: 'pointer', fontFamily: 'var(--font-title)' }}
          >
            {formatearCLP(insumo.monto)}
          </span>
          <button
            onClick={() => onEliminar(insumo.id)}
            style={{
              background: 'transparent',
              border: '1px solid var(--color-border)',
              color: 'var(--color-red)',
              padding: '6px 10px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 600,
            }}
          >
            Eliminar
          </button>
        </div>
      )}
    </div>
  );
}
