import React from 'react';
import ArmadorInventario from './components/ArmadorInventario.jsx';
import { formatearCLP } from '../../utils/formatters.js';

const CATALOGO_DEFAULT = [
  { id: 'cat_1', nombre: 'Tornillo Yeso Cartón 6x1 (Caja 1000)', categoria: 'Fijaciones', costoMayorista: 4500, precioSugerido: 7990, unidad: 'caja' },
  { id: 'cat_2', nombre: 'Disco Corte Metal 4 1/2"', categoria: 'Herramientas', costoMayorista: 650, precioSugerido: 1290, unidad: 'un' },
  { id: 'cat_3', nombre: 'Cinta Teflón 3/4 x 10m', categoria: 'Gasfitería', costoMayorista: 280, precioSugerido: 690, unidad: 'un' },
  { id: 'cat_4', nombre: 'Broca Concreto 6mm', categoria: 'Accesorios', costoMayorista: 1100, precioSugerido: 2190, unidad: 'un' },
  { id: 'cat_5', nombre: 'Guante Cabritilla Par', categoria: 'Seguridad', costoMayorista: 1800, precioSugerido: 3490, unidad: 'par' },
  { id: 'cat_6', nombre: 'Silicona Neutra 280ml', categoria: 'Adhesivos', costoMayorista: 2400, precioSugerido: 4290, unidad: 'un' },
  { id: 'cat_7', nombre: 'Arroz Grado 1 (1kg)', categoria: 'Abarrotes', costoMayorista: 1150, precioSugerido: 1590, unidad: 'kg' },
  { id: 'cat_8', nombre: 'Aceite Vegetal 900ml', categoria: 'Abarrotes', costoMayorista: 1450, precioSugerido: 1990, unidad: 'un' }
];

export default function GestionInventarioMini({ catalogoMayorista = [], inventario = [], onGuardarProducto }) {
  const listaCatalogo = catalogoMayorista && catalogoMayorista.length > 0 ? catalogoMayorista : CATALOGO_DEFAULT;

  const handleDragStart = (e, producto) => {
    e.dataTransfer.setData('application/json', JSON.stringify(producto));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '28px', alignItems: 'flex-start' }}>
        
        {/* Catálogo Mayorista */}
        <div
          style={{
            background: 'var(--bg-neumorphic)',
            borderRadius: '20px',
            boxShadow: 'var(--neu-flat)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            maxHeight: '520px',
            overflowY: 'auto'
          }}
        >
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1a202c', margin: '0 0 4px 0' }}>
              Catálogo Mayorista
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
              Arrastra productos para darlos de alta en tu inventario.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {listaCatalogo.map((item) => (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, item)}
                style={{
                  padding: '12px 14px',
                  borderRadius: '12px',
                  background: 'var(--bg-neumorphic)',
                  boxShadow: 'var(--neu-flat-sm)',
                  cursor: 'grab',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '13px', color: '#1a202c' }}>{item.nombre}</strong>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      color: 'var(--primary-color)',
                      padding: '2px 6px',
                      borderRadius: '6px',
                      background: 'var(--bg-neumorphic)',
                      boxShadow: 'var(--neu-pressed)'
                    }}
                  >
                    {item.categoria}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <span>Costo: <strong>{formatearCLP(item.costoMayorista)}</strong></span>
                  <span>Sugerido: {formatearCLP(item.precioSugerido)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Formulario / Drop Zone */}
        <ArmadorInventario onGuardarProducto={onGuardarProducto} />

      </div>

      {/* Tabla Inventario Activo */}
      <div
        style={{
          background: 'var(--bg-neumorphic)',
          borderRadius: '20px',
          boxShadow: 'var(--neu-flat)',
          padding: '24px',
        }}
      >
        <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1a202c', margin: '0 0 16px 0' }}>
          Inventario Activo en Sala / Bodega ({inventario.length} Productos)
        </h3>

        {inventario.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
            No tienes productos activos en inventario. Arrastra del catálogo o usa la carga masiva.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #cbd5e0', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '10px 8px' }}>SKU</th>
                  <th style={{ padding: '10px 8px' }}>Producto</th>
                  <th style={{ padding: '10px 8px' }}>Costo Compra</th>
                  <th style={{ padding: '10px 8px' }}>Precio Venta</th>
                  <th style={{ padding: '10px 8px' }}>Ventas/Mes</th>
                  <th style={{ padding: '10px 8px' }}>Stock Actual</th>
                  <th style={{ padding: '10px 8px' }}>Pto. Reorden</th>
                  <th style={{ padding: '10px 8px' }}>Estado Stock</th>
                </tr>
              </thead>
              <tbody>
                {inventario.map((item) => {
                  const stockCritico = (item.stockActual || 0) <= (item.puntoReorden || 0);
                  return (
                    <tr key={item.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '12px 8px', fontWeight: 800, color: 'var(--primary-color)' }}>{item.sku}</td>
                      <td style={{ padding: '12px 8px', fontWeight: 700, color: '#2d3748' }}>{item.nombre}</td>
                      <td style={{ padding: '12px 8px' }}>{formatearCLP(item.costoCompra)}</td>
                      <td style={{ padding: '12px 8px', fontWeight: 700 }}>{formatearCLP(item.precioVenta)}</td>
                      <td style={{ padding: '12px 8px' }}>{item.ventasMensuales} un.</td>
                      <td style={{ padding: '12px 8px', fontWeight: 800 }}>{item.stockActual} un.</td>
                      <td style={{ padding: '12px 8px', color: '#2b6cb0', fontWeight: 800 }}>{item.puntoReorden} un.</td>
                      <td style={{ padding: '12px 8px' }}>
                        <span
                          style={{
                            padding: '4px 8px',
                            borderRadius: '8px',
                            fontSize: '11px',
                            fontWeight: 800,
                            background: 'var(--bg-neumorphic)',
                            boxShadow: 'var(--neu-pressed)',
                            color: stockCritico ? 'var(--accent-red)' : 'var(--accent-green)'
                          }}
                        >
                          {stockCritico ? 'Pedir a Proveedor' : 'Stock Óptimo'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}