import React, { useState } from 'react';
import { useAppState } from '../store/appState.jsx';
import { formatearCLP } from '../utils/formatters.js';

export default function GestionInventarioLIFO() {
  const { inventario, lotesLIFO, setLotesLIFO } = useAppState();

  const [skuSeleccionado, setSkuSeleccionado] = useState('FER-001');
  const [nuevoLote, setNuevoLote] = useState({
    sku: 'FER-001',
    cantidad: '',
    costoUnitario: '',
    fecha: new Date().toISOString().split('T')[0]
  });

  const [salidaVenta, setSalidaVenta] = useState({
    sku: 'FER-001',
    unidadesVendidas: ''
  });

  const [ultimoCalculoCMV, setUltimoCalculoCMV] = useState(null);

  const lotesDelSku = lotesLIFO
    .filter((l) => l.sku === skuSeleccionado)
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  const stockTotalSku = lotesDelSku.reduce((acc, l) => acc + l.cantidadDisponible, 0);
  const valorizacionTotalLifo = lotesDelSku.reduce((acc, l) => acc + (l.cantidadDisponible * l.costoUnitario), 0);
  const costoPromedioPonderado = stockTotalSku > 0 ? (valorizacionTotalLifo / stockTotalSku) : 0;

  // Registrar nueva compra (nueva capa de costo)
  const handleAgregarLote = (e) => {
    e.preventDefault();
    if (!nuevoLote.cantidad || !nuevoLote.costoUnitario) return;

    const prodInfo = inventario.find(i => i.sku === nuevoLote.sku) || { nombre: 'Producto General' };

    const loteCreado = {
      id: `lot_${Date.now()}`,
      fecha: nuevoLote.fecha,
      sku: nuevoLote.sku,
      producto: prodInfo.nombre || 'Insumo Ferretería',
      cantidadComprada: Number(nuevoLote.cantidad),
      cantidadDisponible: Number(nuevoLote.cantidad),
      costoUnitario: Number(nuevoLote.costoUnitario)
    };

    setLotesLIFO([loteCreado, ...lotesLIFO]);
    setNuevoLote({ ...nuevoLote, cantidad: '', costoUnitario: '' });
  };

  // Despacho LIFO que altera el costo en toda la aplicación
  const handleProcesarSalidaLIFO = (e) => {
    e.preventDefault();
    const unidadesADescontar = Number(salidaVenta.unidadesVendidas);
    if (!unidadesADescontar || unidadesADescontar <= 0) return;
    if (unidadesADescontar > stockTotalSku) {
      alert('Stock disponible insuficiente en las capas registradas.');
      return;
    }

    let remanente = unidadesADescontar;
    let cmvTotal = 0;
    const capasAfectadas = [];

    const lotesActualizados = lotesLIFO.map((lote) => {
      if (lote.sku !== salidaVenta.sku || remanente === 0 || lote.cantidadDisponible === 0) {
        return lote;
      }

      const descuento = Math.min(lote.cantidadDisponible, remanente);
      const subtotalCosto = descuento * lote.costoUnitario;

      cmvTotal += subtotalCosto;
      remanente -= descuento;

      capasAfectadas.push({
        loteId: lote.id,
        fecha: lote.fecha,
        unidades: descuento,
        costoUnit: lote.costoUnitario,
        costoTotal: subtotalCosto
      });

      return {
        ...lote,
        cantidadDisponible: lote.cantidadDisponible - descuento
      };
    });

    setLotesLIFO(lotesActualizados);
    setUltimoCalculoCMV({
      unidades: unidadesADescontar,
      cmvTotal,
      costoUnitarioEfectivo: Math.round(cmvTotal / unidadesADescontar),
      capas: capasAfectadas
    });

    setSalidaVenta({ ...salidaVenta, unidadesVendidas: '' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#1a202c', margin: '0 0 6px 0' }}>
            Valoración de Inventario y Capas LIFO (UEPS)
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>
            Las compras registradas aquí actualizan en tiempo real el costo variable consolidado del panel y el flujo de caja.
          </p>
        </div>

        <div style={{ ...cardNeuStyle, padding: '10px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <label style={{ fontSize: '12.5px', fontWeight: '800', color: 'var(--text-main)' }}>Filtrar SKU:</label>
          <select
            value={skuSeleccionado}
            onChange={(e) => {
              setSkuSeleccionado(e.target.value);
              setNuevoLote({ ...nuevoLote, sku: e.target.value });
              setSalidaVenta({ ...salidaVenta, sku: e.target.value });
              setUltimoCalculoCMV(null);
            }}
            style={{ ...selectNeuStyle, marginTop: 0 }}
          >
            <option value="FER-001">FER-001 (Tornillo Yeso Cartón)</option>
            <option value="FER-002">FER-002 (Disco Corte Metal)</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '22px' }}>
        <div style={cardNeuStyle}>
          <span style={labelNeuStyle}>Stock Físico en Capas</span>
          <div style={{ fontSize: '26px', fontWeight: 900, color: '#1a202c', marginTop: '6px' }}>
            {stockTotalSku.toLocaleString('es-CL')} un.
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{lotesDelSku.filter(l => l.cantidadDisponible > 0).length} capas disponibles</span>
        </div>

        <div style={cardNeuStyle}>
          <span style={labelNeuStyle}>Valorización Total LIFO</span>
          <div style={{ fontSize: '26px', fontWeight: 900, color: 'var(--primary-color)', marginTop: '6px' }}>
            {formatearCLP(valorizacionTotalLifo)}
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Costo base de stock retenido</span>
        </div>

        <div style={cardNeuStyle}>
          <span style={labelNeuStyle}>Costo Promedio en Bodega</span>
          <div style={{ fontSize: '26px', fontWeight: 900, color: '#1a202c', marginTop: '6px' }}>
            {formatearCLP(costoPromedioPonderado)}
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Por unidad remanente</span>
        </div>

        <div style={cardNeuStyle}>
          <span style={labelNeuStyle}>Costo Reposición Activo (LIFO)</span>
          <div style={{ fontSize: '26px', fontWeight: 900, color: 'var(--accent-red)', marginTop: '6px' }}>
            {formatearCLP(lotesDelSku.find(l => l.cantidadDisponible > 0)?.costoUnitario || 0)}
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Impactando al Punto de Equilibrio</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '26px', alignItems: 'stretch' }}>
        
        {/* Nueva Capa */}
        <div style={cardNeuStyle}>
          <h3 style={{ fontSize: '15.5px', fontWeight: 800, color: '#1a202c', marginBottom: '16px' }}>
            + Ingresar Nueva Capa de Compra (Mayor Costo)
          </h3>
          <form onSubmit={handleAgregarLote} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={labelFormStyle}>Fecha de Factura</label>
              <input
                type="date"
                value={nuevoLote.fecha}
                onChange={(e) => setNuevoLote({ ...nuevoLote, fecha: e.target.value })}
                style={inputNeuStyle}
                required
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={labelFormStyle}>Cantidad</label>
                <input
                  type="number"
                  placeholder="Ej. 50"
                  value={nuevoLote.cantidad}
                  onChange={(e) => setNuevoLote({ ...nuevoLote, cantidad: e.target.value })}
                  style={inputNeuStyle}
                  min="1"
                  required
                />
              </div>
              <div>
                <label style={labelFormStyle}>Costo Unitario ($)</label>
                <input
                  type="number"
                  placeholder="Ej. 5200"
                  value={nuevoLote.costoUnitario}
                  onChange={(e) => setNuevoLote({ ...nuevoLote, costoUnitario: e.target.value })}
                  style={inputNeuStyle}
                  min="1"
                  required
                />
              </div>
            </div>
            <button type="submit" style={btnPrimaryNeuStyle}>
              Ingresar Capa de Costo
            </button>
          </form>
        </div>

        {/* Salida LIFO */}
        <div style={cardNeuStyle}>
          <h3 style={{ fontSize: '15.5px', fontWeight: 800, color: '#1a202c', marginBottom: '16px' }}>
            Despachar Venta (Consumo LIFO)
          </h3>
          <form onSubmit={handleProcesarSalidaLIFO} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={labelFormStyle}>Unidades a Despachar</label>
              <input
                type="number"
                placeholder={`Máximo disponible: ${stockTotalSku}`}
                value={salidaVenta.unidadesVendidas}
                onChange={(e) => setSalidaVenta({ ...salidaVenta, unidadesVendidas: e.target.value })}
                style={inputNeuStyle}
                min="1"
                max={stockTotalSku}
                required
              />
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
              Consume automáticamente la última compra ingresada para reconocer el CMV más reciente.
            </p>
            <button type="submit" style={btnWarningNeuStyle}>
              Procesar Salida LIFO
            </button>
          </form>

          {ultimoCalculoCMV && (
            <div style={{ marginTop: '16px', padding: '12px', borderRadius: '12px', background: 'var(--bg-neumorphic)', boxShadow: 'var(--neu-pressed)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', fontWeight: 800 }}>
                <span>CMV Reconocido ({ultimoCalculoCMV.unidades} un.):</span>
                <span style={{ color: 'var(--accent-red)' }}>{formatearCLP(ultimoCalculoCMV.cmvTotal)}</span>
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Costo unitario reconocido: <strong>{formatearCLP(ultimoCalculoCMV.costoUnitarioEfectivo)}</strong>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Tabla LIFO Stack */}
      <div style={cardNeuStyle}>
        <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1a202c', marginBottom: '16px' }}>
          Pila de Capas LIFO ({skuSeleccionado})
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #cbd5e0', color: 'var(--text-muted)' }}>
                <th style={{ padding: '10px 8px' }}>Prioridad LIFO</th>
                <th style={{ padding: '10px 8px' }}>Fecha Ingreso</th>
                <th style={{ padding: '10px 8px' }}>Cant. Inicial</th>
                <th style={{ padding: '10px 8px' }}>Stock Remanente</th>
                <th style={{ padding: '10px 8px' }}>Costo Unitario</th>
                <th style={{ padding: '10px 8px' }}>Valorización Capa</th>
                <th style={{ padding: '10px 8px', textAlign: 'center' }}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {lotesDelSku.map((lote, idx) => {
                const esSiguienteSalida = lote.cantidadDisponible > 0 && lotesDelSku.slice(0, idx).every(l => l.cantidadDisponible === 0);

                return (
                  <tr key={lote.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '12px 8px', fontWeight: 800, color: esSiguienteSalida ? 'var(--primary-color)' : 'var(--text-muted)' }}>
                      {esSiguienteSalida ? '▶ Siguiente Salida' : `Capa #${idx + 1}`}
                    </td>
                    <td style={{ padding: '12px 8px' }}>{lote.fecha}</td>
                    <td style={{ padding: '12px 8px' }}>{lote.cantidadComprada} un.</td>
                    <td style={{ padding: '12px 8px', fontWeight: 800, color: lote.cantidadDisponible > 0 ? '#1a202c' : 'var(--text-muted)' }}>
                      {lote.cantidadDisponible} un.
                    </td>
                    <td style={{ padding: '12px 8px', fontWeight: 700 }}>{formatearCLP(lote.costoUnitario)}</td>
                    <td style={{ padding: '12px 8px', fontWeight: 800, color: 'var(--primary-color)' }}>
                      {formatearCLP(lote.cantidadDisponible * lote.costoUnitario)}
                    </td>
                    <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                      <span
                        style={{
                          padding: '4px 8px',
                          borderRadius: '8px',
                          fontSize: '11px',
                          fontWeight: 800,
                          background: 'var(--bg-neumorphic)',
                          boxShadow: 'var(--neu-pressed)',
                          color: lote.cantidadDisponible === 0 ? 'var(--text-muted)' : 'var(--accent-green)'
                        }}
                      >
                        {lote.cantidadDisponible === 0 ? 'Agotada' : 'Disponible'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

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
  fontSize: '11.5px',
  fontWeight: '800',
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

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

const selectNeuStyle = {
  padding: '8px 12px',
  borderRadius: '10px',
  border: 'none',
  outline: 'none',
  background: 'var(--bg-neumorphic)',
  boxShadow: 'var(--neu-pressed)',
  fontSize: '12.5px',
  color: 'var(--text-main)',
  cursor: 'pointer',
};

const btnPrimaryNeuStyle = {
  padding: '11px',
  borderRadius: '12px',
  background: 'var(--bg-neumorphic)',
  boxShadow: 'var(--neu-flat-sm)',
  color: 'var(--primary-color)',
  fontWeight: '800',
  fontSize: '12.5px',
  cursor: 'pointer',
  marginTop: '4px',
};

const btnWarningNeuStyle = {
  padding: '11px',
  borderRadius: '12px',
  background: 'var(--bg-neumorphic)',
  boxShadow: 'var(--neu-flat-sm)',
  color: 'var(--accent-red)',
  fontWeight: '800',
  fontSize: '12.5px',
  cursor: 'pointer',
  marginTop: '4px',
};