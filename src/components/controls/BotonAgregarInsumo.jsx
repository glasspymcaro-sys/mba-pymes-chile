import React, { useState } from 'react';

// Formulario simple para agregar un costo nuevo. Se abre al tocar
// "Agregar un costo" y se cierra solo después de guardar.
export default function BotonAgregarInsumo({ onAgregar }) {
  const [abierto, setAbierto] = useState(false);
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState('variable');
  const [monto, setMonto] = useState('');

  function guardar() {
    if (!nombre.trim() || !monto) return;
    onAgregar({ nombre: nombre.trim(), tipo, monto: Number(monto) });
    setNombre('');
    setMonto('');
    setTipo('variable');
    setAbierto(false);
  }

  if (!abierto) {
    return (
      <button
        onClick={() => setAbierto(true)}
        style={{
          width: '100%',
          padding: '14px',
          borderRadius: '10px',
          border: '1.5px dashed var(--color-border)',
          background: 'transparent',
          color: 'var(--color-navy)',
          fontWeight: 700,
          fontSize: '13.5px',
          cursor: 'pointer',
        }}
      >
        Agregar un costo
      </button>
    );
  }

  return (
    <div
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: '10px',
        padding: '18px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      <div>
        <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-muted)' }}>
          ¿Cómo se llama este costo?
        </label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ejemplo: Arriendo, ingredientes, bolsas..."
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: '6px',
            border: '1px solid var(--color-border)',
            fontSize: '13.5px',
            marginTop: '6px',
          }}
        />
      </div>

      <div>
        <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-muted)' }}>
          ¿Este costo es siempre el mismo cada mes, o cambia según cuánto vendas?
        </label>
        <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
          <button
            onClick={() => setTipo('fijo')}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '6px',
              border: `1.5px solid ${tipo === 'fijo' ? 'var(--color-navy)' : 'var(--color-border)'}`,
              background: tipo === 'fijo' ? 'var(--color-navy)' : 'white',
              color: tipo === 'fijo' ? 'white' : 'var(--color-text)',
              fontWeight: 700,
              fontSize: '12.5px',
              cursor: 'pointer',
            }}
          >
            Es siempre el mismo monto
          </button>
          <button
            onClick={() => setTipo('variable')}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '6px',
              border: `1.5px solid ${tipo === 'variable' ? 'var(--color-blue)' : 'var(--color-border)'}`,
              background: tipo === 'variable' ? 'var(--color-blue)' : 'white',
              color: tipo === 'variable' ? 'white' : 'var(--color-text)',
              fontWeight: 700,
              fontSize: '12.5px',
              cursor: 'pointer',
            }}
          >
            Cambia según lo que venda
          </button>
        </div>
      </div>

      <div>
        <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-muted)' }}>
          {tipo === 'fijo' ? '¿Cuánto pagas al mes por esto?' : '¿Cuánto cuesta esto por cada venta?'}
        </label>
        <input
          type="number"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          placeholder="Monto en pesos"
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: '6px',
            border: '1px solid var(--color-border)',
            fontSize: '13.5px',
            marginTop: '6px',
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '4px' }}>
        <button
          onClick={() => setAbierto(false)}
          style={{
            padding: '10px 16px',
            borderRadius: '6px',
            border: '1px solid var(--color-border)',
            background: 'var(--color-surface-elevated, #131A29)',
            color: 'var(--color-foreground, #F8FAFC)',
            fontWeight: 600,
            fontSize: '12.5px',
            cursor: 'pointer',
          }}
        >
          Cancelar
        </button>
        <button
          onClick={guardar}
          style={{
            padding: '10px 18px',
            borderRadius: '6px',
            border: 'none',
            background: 'var(--color-navy)',
            color: 'white',
            fontWeight: 700,
            fontSize: '12.5px',
            cursor: 'pointer',
          }}
        >
          Guardar costo
        </button>
      </div>
    </div>
  );
}
