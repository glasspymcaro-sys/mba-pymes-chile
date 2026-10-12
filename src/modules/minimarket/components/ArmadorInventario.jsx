import React, { useState } from 'react';
import { formatearCLP } from '../../../utils/formatters.js';

export default function ArmadorInventario({ onGuardarProducto }) {
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [precioVenta, setPrecioVenta] = useState('');
  const [ventasEstimadas, setVentasEstimadas] = useState('');
  const [stockActual, setStockActual] = useState('');
  const [leadTimeDias, setLeadTimeDias] = useState(3);
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      if (data && data.nombre) {
        setProductoSeleccionado(data);
        setPrecioVenta(data.precioSugerido || Math.round(data.costoMayorista * 1.4));
        setVentasEstimadas(40);
        setStockActual(15);
      }
    } catch (err) {
      // Ignorar parsing inválido
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!productoSeleccionado || !precioVenta) return;

    const ventas = Number(ventasEstimadas) || 1;
    const dias = Number(leadTimeDias) || 3;
    const puntoReorden = Math.ceil((ventas / 30) * dias * 1.5);

    onGuardarProducto({
      id: `inv_${Date.now()}`,
      sku: `SKU-${Math.floor(100 + Math.random() * 900)}`,
      nombre: productoSeleccionado.nombre,
      categoria: productoSeleccionado.categoria || 'General',
      costoCompra: Number(productoSeleccionado.costoMayorista),
      precioVenta: Number(precioVenta),
      ventasMensuales: ventas,
      stockActual: Number(stockActual) || 0,
      leadTimeDias: dias,
      mermaEsperada: 1,
      puntoReorden
    });

    setProductoSeleccionado(null);
    setPrecioVenta('');
    setVentasEstimadas('');
    setStockActual('');
  };

  return (
    <div
      style={{
        background: 'var(--bg-neumorphic)',
        borderRadius: '20px',
        boxShadow: 'var(--neu-flat)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1a202c', margin: 0 }}>
        Configurar Parámetros de Rotación y Stock
      </h3>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          borderRadius: '16px',
          padding: '20px',
          textAlign: 'center',
          background: 'var(--bg-neumorphic)',
          boxShadow: dragOver ? 'var(--neu-pressed)' : 'var(--neu-flat-sm)',
          border: dragOver ? '2px dashed var(--primary-color)' : '2px dashed #cbd5e0',
          transition: 'all 0.2s ease',
          minHeight: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {productoSeleccionado ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--primary-color)', textTransform: 'uppercase' }}>
              Producto Seleccionado
            </span>
            <strong style={{ fontSize: '15px', color: '#1a202c' }}>{productoSeleccionado.nombre}</strong>
            <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
              Costo Mayorista: {formatearCLP(productoSeleccionado.costoMayorista)}
            </span>
          </div>
        ) : (
          <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>
            Arrastra un producto del catálogo mayorista aquí
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelFormStyle}>Precio de Venta ($)</label>
            <input
              type="number"
              value={precioVenta}
              onChange={(e) => setPrecioVenta(e.target.value)}
              placeholder="Ej. 2500"
              style={inputNeuStyle}
              required
              disabled={!productoSeleccionado}
            />
          </div>

          <div>
            <label style={labelFormStyle}>Ventas Estimadas (Mes)</label>
            <input
              type="number"
              value={ventasEstimadas}
              onChange={(e) => setVentasEstimadas(e.target.value)}
              placeholder="Ej. 60"
              style={inputNeuStyle}
              required
              disabled={!productoSeleccionado}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelFormStyle}>Stock Físico Inicial</label>
            <input
              type="number"
              value={stockActual}
              onChange={(e) => setStockActual(e.target.value)}
              placeholder="Ej. 20"
              style={inputNeuStyle}
              required
              disabled={!productoSeleccionado}
            />
          </div>

          <div>
            <label style={labelFormStyle}>Tiempo Entrega Proveedor (Días)</label>
            <input
              type="number"
              value={leadTimeDias}
              onChange={(e) => setLeadTimeDias(e.target.value)}
              style={inputNeuStyle}
              required
              disabled={!productoSeleccionado}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!productoSeleccionado}
          style={{
            padding: '12px',
            borderRadius: '12px',
            background: 'var(--bg-neumorphic)',
            boxShadow: !productoSeleccionado ? 'none' : 'var(--neu-flat-sm)',
            color: !productoSeleccionado ? 'var(--text-muted)' : 'var(--accent-green)',
            fontWeight: 800,
            fontSize: '13px',
            cursor: !productoSeleccionado ? 'not-allowed' : 'pointer',
            opacity: !productoSeleccionado ? 0.6 : 1,
            marginTop: '6px'
          }}
        >
          Registrar en Inventario
        </button>
      </form>
    </div>
  );
}

const labelFormStyle = {
  display: 'block',
  fontSize: '12.5px',
  fontWeight: '700',
  color: 'var(--text-main)',
  marginBottom: '6px',
};

const inputNeuStyle = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: '10px',
  border: 'none',
  outline: 'none',
  background: 'var(--bg-neumorphic)',
  boxShadow: 'var(--neu-pressed)',
  fontSize: '13px',
  color: 'var(--text-main)',
  boxSizing: 'border-box',
};