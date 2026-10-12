import React, { useState } from 'react';

export default function CreadorInsumo({ onGuardarInsumo }) {
  const [nuevoInsumo, setNuevoInsumo] = useState({
    nombre: '',
    proveedor: '',
    unidad: 'kg',
    costoPorUnidad: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoInsumo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nuevoInsumo.nombre || !nuevoInsumo.costoPorUnidad) return;

    onGuardarInsumo({
      ...nuevoInsumo,
      id: `ins_${Date.now()}`,
      costoPorUnidad: Number(nuevoInsumo.costoPorUnidad),
    });

    setNuevoInsumo({
      nombre: '',
      proveedor: '',
      unidad: 'kg',
      costoPorUnidad: '',
    });
  };

  return (
    <div
      style={{
        background: '#ffffff',
        padding: '24px',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        border: '1px solid #e4ecf3',
        maxWidth: '500px',
        margin: '0 auto',
      }}
    >
      <h3 style={{ margin: '0 0 20px 0', color: '#1a252f', fontSize: '18px' }}>
        Registrar Nuevo Insumo
      </h3>

      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
      >
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Insumo (Ej. Queso, Pan)</label>
            <input
              type="text"
              name="nombre"
              value={nuevoInsumo.nombre}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Nombre del insumo"
              required
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Proveedor</label>
            <input
              type="text"
              name="proveedor"
              value={nuevoInsumo.proveedor}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Ej. Comercializadora Sur"
              required
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ flex: '0 0 120px' }}>
            <label style={labelStyle}>Unidad</label>
            <select
              name="unidad"
              value={nuevoInsumo.unidad}
              onChange={handleChange}
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              <option value="kg">Kilo (kg)</option>
              <option value="g">Gramo (g)</option>
              <option value="l">Litro (l)</option>
              <option value="ml">Mililitro (ml)</option>
              <option value="un">Unidad (un)</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Costo por Unidad ($)</label>
            <input
              type="number"
              name="costoPorUnidad"
              value={nuevoInsumo.costoPorUnidad}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Ej. 1200"
              min="1"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          style={{
            marginTop: '10px',
            padding: '12px',
            backgroundColor: '#2ecc71',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            fontSize: '15px',
            cursor: 'pointer',
            transition: 'background 0.2s ease',
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = '#27ae60')}
          onMouseLeave={(e) => (e.target.style.backgroundColor = '#2ecc71')}
        >
          + Agregar Insumo a la Base
        </button>
      </form>
    </div>
  );
}

const labelStyle = {
  display: 'block',
  fontSize: '13px',
  color: '#5c6c7b',
  marginBottom: '6px',
  fontWeight: '600',
};

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: '8px',
  border: '1px solid #d1d9e0',
  fontSize: '14px',
  color: '#1a252f',
  boxSizing: 'border-box',
  outline: 'none',
};
