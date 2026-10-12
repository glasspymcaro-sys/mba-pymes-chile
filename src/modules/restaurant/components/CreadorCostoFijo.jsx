import React, { useState } from 'react';

export default function CreadorCostoFijo({ onGuardarCostoFijo }) {
  const [nuevoCosto, setNuevoCosto] = useState({
    nombre: '',
    monto: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoCosto((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nuevoCosto.nombre || !nuevoCosto.monto) return;

    onGuardarCostoFijo({
      id: `cf_${Date.now()}`,
      nombre: nuevoCosto.nombre,
      monto: Number(nuevoCosto.monto)
    });

    setNuevoCosto({ nombre: '', monto: '' });
  };

  return (
    <div style={cardNeuStyle}>
      <h4 style={{ margin: '0 0 16px 0', color: '#1a202c', fontSize: '16px', fontWeight: 800 }}>
        Registrar Costo Fijo
      </h4>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={labelFormStyle}>Concepto (Arriendo, Sueldos, Servicios)</label>
          <input
            type="text"
            name="nombre"
            value={nuevoCosto.nombre}
            onChange={handleChange}
            style={inputNeuStyle}
            placeholder="Ej. Arriendo Local"
            required
          />
        </div>

        <div>
          <label style={labelFormStyle}>Monto Mensual ($)</label>
          <input
            type="number"
            name="monto"
            value={nuevoCosto.monto}
            onChange={handleChange}
            style={inputNeuStyle}
            placeholder="Ej. 650000"
            min="1"
            required
          />
        </div>

        <button type="submit" style={btnPrimaryNeuStyle}>
          Agregar Costo Fijo
        </button>
      </form>
    </div>
  );
}

const cardNeuStyle = {
  background: 'var(--bg-neumorphic)',
  borderRadius: '20px',
  boxShadow: 'var(--neu-flat)',
  padding: '24px',
};

const labelFormStyle = {
  display: 'block',
  fontSize: '13px',
  fontWeight: '700',
  color: 'var(--text-main)',
  marginBottom: '6px',
};

const inputNeuStyle = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: '10px',
  border: 'none',
  outline: 'none',
  background: 'var(--bg-neumorphic)',
  boxShadow: 'var(--neu-pressed)',
  fontSize: '13.5px',
  color: 'var(--text-main)',
  boxSizing: 'border-box',
};

const btnPrimaryNeuStyle = {
  padding: '12px',
  borderRadius: '12px',
  background: 'var(--bg-neumorphic)',
  boxShadow: 'var(--neu-flat-sm)',
  color: 'var(--primary-color)',
  fontWeight: '800',
  fontSize: '13px',
  cursor: 'pointer',
  marginTop: '6px',
};