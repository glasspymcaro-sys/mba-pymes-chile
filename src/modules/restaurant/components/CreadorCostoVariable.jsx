import React, { useState } from 'react';

export default function CreadorCostoVariable({ onGuardarCostoVariable }) {
  const [nuevoCosto, setNuevoCosto] = useState({
    nombre: '',
    costoPorUnidad: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoCosto((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nuevoCosto.nombre || !nuevoCosto.costoPorUnidad) return;

    onGuardarCostoVariable({
      id: `cv_${Date.now()}`,
      nombre: nuevoCosto.nombre,
      costoPorUnidad: Number(nuevoCosto.costoPorUnidad)
    });

    setNuevoCosto({ nombre: '', costoPorUnidad: '' });
  };

  return (
    <div style={cardNeuStyle}>
      <h4 style={{ margin: '0 0 16px 0', color: '#1a202c', fontSize: '16px', fontWeight: 800 }}>
        Registrar Costo Variable
      </h4>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={labelFormStyle}>Concepto (Packaging, Comisiones)</label>
          <input
            type="text"
            name="nombre"
            value={nuevoCosto.nombre}
            onChange={handleChange}
            style={inputNeuStyle}
            placeholder="Nombre del concepto"
            required
          />
        </div>

        <div>
          <label style={labelFormStyle}>Costo Adicional por Venta ($)</label>
          <input
            type="number"
            name="costoPorUnidad"
            value={nuevoCosto.costoPorUnidad}
            onChange={handleChange}
            style={inputNeuStyle}
            placeholder="Ej. 250"
            min="1"
            required
          />
        </div>

        <button type="submit" style={btnPrimaryNeuStyle}>
          Agregar Costo
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