import React, { useState } from 'react';
import { formatearCLP } from '../../utils/formatters.js';

const PLANTILLAS_PREDEFINIDAS = {
  ferreteria: [
    { sku: 'FER-001', nombre: 'Tornillo Yeso Cartón 6x1 (Caja 1000)', costoCompra: 4500, precioVenta: 7990, ventasMensuales: 35, stockActual: 12, leadTimeDias: 3, mermaEsperada: 2 },
    { sku: 'FER-002', nombre: 'Disco Corte Metal 4 1/2 Pulgadas', costoCompra: 650, precioVenta: 1290, ventasMensuales: 180, stockActual: 45, leadTimeDias: 2, mermaEsperada: 1 },
    { sku: 'FER-003', nombre: 'Cinta Teflón 3/4 x 10m', costoCompra: 280, precioVenta: 690, ventasMensuales: 95, stockActual: 30, leadTimeDias: 4, mermaEsperada: 0.5 },
    { sku: 'FER-004', nombre: 'Broca Concreto 6mm', costoCompra: 1100, precioVenta: 2190, ventasMensuales: 40, stockActual: 8, leadTimeDias: 5, mermaEsperada: 1 },
    { sku: 'FER-005', nombre: 'Guante Cabritilla Par', costoCompra: 1800, precioVenta: 3490, ventasMensuales: 60, stockActual: 15, leadTimeDias: 3, mermaEsperada: 0 },
    { sku: 'FER-006', nombre: 'Silicona Neutra Transparente 280ml', costoCompra: 2400, precioVenta: 4290, ventasMensuales: 50, stockActual: 10, leadTimeDias: 4, mermaEsperada: 3 }
  ],
  minimarket: [
    { sku: 'AB-001', nombre: 'Arroz Grado 1 (1kg)', costoCompra: 1150, precioVenta: 1590, ventasMensuales: 240, stockActual: 50, leadTimeDias: 2, mermaEsperada: 1.5 },
    { sku: 'AB-002', nombre: 'Aceite Vegetal 900ml', costoCompra: 1450, precioVenta: 1990, ventasMensuales: 190, stockActual: 35, leadTimeDias: 3, mermaEsperada: 0.5 },
    { sku: 'AB-003', nombre: 'Azúcar Blanca 1kg', costoCompra: 980, precioVenta: 1350, ventasMensuales: 210, stockActual: 40, leadTimeDias: 2, mermaEsperada: 1 },
    { sku: 'AB-004', nombre: 'Leche Entera 1L Tetra', costoCompra: 820, precioVenta: 1190, ventasMensuales: 300, stockActual: 60, leadTimeDias: 1, mermaEsperada: 2.5 }
  ]
};

export default function ImportadorMasivoInventario({ onImportarLote }) {
  const [textoPegado, setTextoPegado] = useState('');
  const [previewDatos, setPreviewDatos] = useState([]);
  const [errorParsing, setErrorParsing] = useState('');

  const cargarPlantilla = (tipo) => {
    const items = PLANTILLAS_PREDEFINIDAS[tipo] || [];
    setPreviewDatos(items.map(item => ({
      ...item,
      id: `sku_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      puntoReorden: Math.ceil((item.ventasMensuales / 30) * item.leadTimeDias * 1.5)
    })));
    setErrorParsing('');
  };

  const procesarTextoPegado = () => {
    try {
      if (!textoPegado.trim()) return;
      const lineas = textoPegado.trim().split('\n');
      const resultado = [];

      lineas.forEach((linea, idx) => {
        const columnas = linea.includes('\t') ? linea.split('\t') : linea.split(',');
        if (columnas.length >= 4) {
          const sku = columnas[0].trim();
          const nombre = columnas[1].trim();
          const costo = Number(columnas[2].replace(/[^0-9.-]+/g, '')) || 0;
          const precio = Number(columnas[3].replace(/[^0-9.-]+/g, '')) || 0;
          const ventas = Number(columnas[4]?.replace(/[^0-9.-]+/g, '')) || 20;
          const stock = Number(columnas[5]?.replace(/[^0-9.-]+/g, '')) || 10;
          const leadTime = Number(columnas[6]?.replace(/[^0-9.-]+/g, '')) || 3;

          resultado.push({
            id: `sku_imp_${Date.now()}_${idx}`,
            sku,
            nombre,
            costoCompra: costo,
            precioVenta: precio,
            ventasMensuales: ventas,
            stockActual: stock,
            leadTimeDias: leadTime,
            mermaEsperada: 1,
            puntoReorden: Math.ceil((ventas / 30) * leadTime * 1.5)
          });
        }
      });

      if (resultado.length === 0) {
        setErrorParsing('Formato no reconocido. Asegúrate de separar por comas o tabulaciones: SKU, Nombre, Costo, Precio, VentasMes, Stock, DiasReposicion');
      } else {
        setPreviewDatos(resultado);
        setErrorParsing('');
      }
    } catch (err) {
      setErrorParsing('Error al interpretar las líneas ingresadas.');
    }
  };

  const confirmarImportacion = () => {
    if (previewDatos.length === 0) return;
    onImportarLote(previewDatos);
    setPreviewDatos([]);
    setTextoPegado('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      <div>
        <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#1a202c', margin: '0 0 6px 0' }}>
          Carga Masiva y Fast-Onboarding de Inventario
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>
          Ingresa catálogos extensos mediante plantillas industriales o copiando datos directamente desde tus planillas Excel.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        <div style={cardNeuStyle}>
          <span style={labelNeuStyle}>Plantilla Express</span>
          <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#1a202c', margin: '8px 0 12px 0' }}>
            Catálogo Ferretería Base (SKUs Críticos)
          </h4>
          <button onClick={() => cargarPlantilla('ferreteria')} style={btnSecundarioNeuStyle}>
            Cargar Lote Ferretero
          </button>
        </div>

        <div style={cardNeuStyle}>
          <span style={labelNeuStyle}>Plantilla Express</span>
          <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#1a202c', margin: '8px 0 12px 0' }}>
            Catálogo Abarrotes y Almacén
          </h4>
          <button onClick={() => cargarPlantilla('minimarket')} style={btnSecundarioNeuStyle}>
            Cargar Lote Abarrotes
          </button>
        </div>
      </div>

      <div style={cardNeuStyle}>
        <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#1a202c', marginBottom: '12px' }}>
          Pegar Datos desde Excel / CSV
        </h4>
        <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '12px' }}>
          Estructura por columnas: <code>SKU | Nombre | CostoCompra | PrecioVenta | VentasEstimadasMes | StockActual | DiasReposicion</code>
        </p>
        
        <textarea
          rows={4}
          placeholder="FER-001	Clavo Corriente 3 Pulg	1200	2100	80	25	3"
          value={textoPegado}
          onChange={(e) => setTextoPegado(e.target.value)}
          style={textareaNeuStyle}
        />

        {errorParsing && (
          <div style={{ color: 'var(--accent-red)', fontSize: '13px', fontWeight: 700, marginTop: '8px' }}>
            {errorParsing}
          </div>
        )}

        <div style={{ marginTop: '14px', display: 'flex', gap: '12px' }}>
          <button onClick={procesarTextoPegado} style={btnPrimaryNeuStyle}>
            Procesar Lote
          </button>
        </div>
      </div>

      {previewDatos.length > 0 && (
        <div style={cardNeuStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#1a202c', margin: 0 }}>
              Previsualización de Lote ({previewDatos.length} Productos)
            </h4>
            <button onClick={confirmarImportacion} style={btnExitoNeuStyle}>
              Confirmar y Agregar al Inventario
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #cbd5e0', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '10px 8px' }}>SKU</th>
                  <th style={{ padding: '10px 8px' }}>Producto</th>
                  <th style={{ padding: '10px 8px' }}>Costo Compra</th>
                  <th style={{ padding: '10px 8px' }}>Precio Venta</th>
                  <th style={{ padding: '10px 8px' }}>Margen Unit.</th>
                  <th style={{ padding: '10px 8px' }}>Pto. Reorden</th>
                </tr>
              </thead>
              <tbody>
                {previewDatos.map((item) => {
                  const margen = item.precioVenta > 0 ? (((item.precioVenta - item.costoCompra) / item.precioVenta) * 100).toFixed(1) : 0;
                  return (
                    <tr key={item.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '10px 8px', fontWeight: 800, color: 'var(--primary-color)' }}>{item.sku}</td>
                      <td style={{ padding: '10px 8px', fontWeight: 700, color: 'var(--text-main)' }}>{item.nombre}</td>
                      <td style={{ padding: '10px 8px' }}>{formatearCLP(item.costoCompra)}</td>
                      <td style={{ padding: '10px 8px' }}>{formatearCLP(item.precioVenta)}</td>
                      <td style={{ padding: '10px 8px', color: 'var(--accent-green)', fontWeight: 800 }}>{margen}%</td>
                      <td style={{ padding: '10px 8px', fontWeight: 800, color: '#2b6cb0' }}>{item.puntoReorden} un.</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}

const cardNeuStyle = {
  background: 'var(--bg-neumorphic)',
  borderRadius: '20px',
  boxShadow: 'var(--neu-flat)',
  padding: '24px',
};

const labelNeuStyle = {
  fontSize: '11px',
  fontWeight: '800',
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

const textareaNeuStyle = {
  width: '100%',
  padding: '12px',
  borderRadius: '12px',
  border: 'none',
  outline: 'none',
  background: 'var(--bg-neumorphic)',
  boxShadow: 'var(--neu-pressed)',
  fontSize: '13px',
  color: 'var(--text-main)',
  boxSizing: 'border-box',
  fontFamily: 'monospace',
};

const btnPrimaryNeuStyle = {
  padding: '10px 18px',
  borderRadius: '12px',
  background: 'var(--bg-neumorphic)',
  boxShadow: 'var(--neu-flat-sm)',
  color: 'var(--primary-color)',
  fontWeight: '800',
  fontSize: '12.5px',
  cursor: 'pointer',
};

const btnSecundarioNeuStyle = {
  padding: '10px 16px',
  borderRadius: '12px',
  background: 'var(--bg-neumorphic)',
  boxShadow: 'var(--neu-flat-sm)',
  color: 'var(--text-main)',
  fontWeight: '700',
  fontSize: '12px',
  cursor: 'pointer',
  width: '100%',
};

const btnExitoNeuStyle = {
  padding: '10px 18px',
  borderRadius: '12px',
  background: 'var(--bg-neumorphic)',
  boxShadow: 'var(--neu-flat-sm)',
  color: 'var(--accent-green)',
  fontWeight: '800',
  fontSize: '12.5px',
  cursor: 'pointer',
};