import React, { useState } from 'react';
import { useAppState } from '../store/appState.jsx';
import { formatearCLP } from '../utils/formatters.js';

export default function IntegracionErp() {
  const { setVentasEstimadasMensuales, ventasEstimadasMensuales, precioVentaConsolidado } = useAppState();

  const [proveedorErp, setProveedorErp] = useState('defontana');
  const [archivoCargado, setArchivoCargado] = useState(null);
  const [estadoSincronizacion, setEstadoSincronizacion] = useState(null);
  const [registrosImportados, setRegistrosImportados] = useState([]);

  const simularCargaErp = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setArchivoCargado(file.name);
    setEstadoSincronizacion('procesando');

    setTimeout(() => {
      const datosSimulados = [
        { dte: 'Factura 1042', cliente: 'Constructora Austral SpA', fecha: '2026-08-25', totalNeto: 485000, unidades: 65 },
        { dte: 'Boleta 8921', cliente: 'Cliente Mostrador', fecha: '2026-08-25', totalNeto: 38900, unidades: 8 },
        { dte: 'Boleta 8922', cliente: 'Cliente Mostrador', fecha: '2026-08-26', totalNeto: 112000, unidades: 22 },
        { dte: 'Factura 1043', cliente: 'Comercial del Sur Ltda', fecha: '2026-08-26', totalNeto: 340000, unidades: 45 },
        { dte: 'Boleta 8923', cliente: 'Cliente Mostrador', fecha: '2026-08-27', totalNeto: 78500, unidades: 15 }
      ];

      const volumenCalculado = datosSimulados.reduce((acc, r) => acc + r.unidades, 0);

      setRegistrosImportados(datosSimulados);
      setVentasEstimadasMensuales(volumenCalculado);
      setEstadoSincronizacion('exitoso');
    }, 900);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#1a202c', margin: '0 0 6px 0' }}>
          Integración Externa con ERP y Facturación
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>
          Sincroniza tus reportes de ventas diarias (DTE / Facturas / Boletas) desde tu ERP actual para recalcular tu punto de equilibrio y rotación sin migrar de software contable.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        <div style={cardNeuStyle}>
          <span style={labelNeuStyle}>Sistema Origen</span>
          <select
            value={proveedorErp}
            onChange={(e) => setProveedorErp(e.target.value)}
            style={selectNeuStyle}
          >
            <option value="defontana">Defontana (Reporte Ventas CSV)</option>
            <option value="softland">Softland ERP (Libro de Ventas TXT)</option>
            <option value="sii">Servicio de Impuestos Internos (SII DTE)</option>
            <option value="bsale">Bsale (Reporte Consolidado)</option>
          </select>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px', display: 'block' }}>
            Integra Pyme no reemplaza tu facturación; actúa como motor de optimización de stock.
          </span>
        </div>

        <div style={cardNeuStyle}>
          <span style={labelNeuStyle}>Volumen Mensual Sincronizado</span>
          <div style={{ fontSize: '26px', fontWeight: 900, color: 'var(--primary-color)', marginTop: '8px' }}>
            {ventasEstimadasMensuales.toLocaleString('es-CL')} un.
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Ingresos base proyectados: {formatearCLP(ventasEstimadasMensuales * (precioVentaConsolidado || 0))}
          </span>
        </div>

        <div style={cardNeuStyle}>
          <span style={labelNeuStyle}>Estado del Conector</span>
          <div style={{ fontSize: '16px', fontWeight: 800, color: estadoSincronizacion === 'exitoso' ? 'var(--accent-green)' : '#1a202c', marginTop: '10px' }}>
            {estadoSincronizacion === 'exitoso' ? 'Sincronizado y Actualizado' : 'Listo para Importar'}
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            {archivoCargado ? `Archivo: ${archivoCargado}` : 'Sin archivo cargado'}
          </span>
        </div>
      </div>

      <div style={cardNeuStyle}>
        <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1a202c', marginBottom: '14px' }}>
          Cargar Reporte de Ventas del ERP
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
          Selecciona el archivo exportado desde <strong>{proveedorErp.toUpperCase()}</strong> para actualizar en tiempo real el volumen del negocio:
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <label style={btnSubirArchivoStyle}>
            Seleccionar Archivo (CSV / Excel)
            <input type="file" accept=".csv,.txt,.xlsx" onChange={simularCargaErp} style={{ display: 'none' }} />
          </label>
          {estadoSincronizacion === 'procesando' && (
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary-color)' }}>
              Procesando comprobantes y mapeando SKUs...
            </span>
          )}
        </div>
      </div>

      {registrosImportados.length > 0 && (
        <div style={cardNeuStyle}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1a202c', marginBottom: '16px' }}>
            Comprobantes Electrónicos Procesados ({registrosImportados.length} Transacciones)
          </h3>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #cbd5e0', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '10px 8px' }}>Comprobante</th>
                  <th style={{ padding: '10px 8px' }}>Cliente / Destino</th>
                  <th style={{ padding: '10px 8px' }}>Fecha</th>
                  <th style={{ padding: '10px 8px' }}>Unidades</th>
                  <th style={{ padding: '10px 8px', textAlign: 'right' }}>Monto Neto</th>
                </tr>
              </thead>
              <tbody>
                {registrosImportados.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '12px 8px', fontWeight: 800, color: 'var(--primary-color)' }}>{item.dte}</td>
                    <td style={{ padding: '12px 8px', fontWeight: 700, color: 'var(--text-main)' }}>{item.cliente}</td>
                    <td style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>{item.fecha}</td>
                    <td style={{ padding: '12px 8px', fontWeight: 700 }}>{item.unidades} un.</td>
                    <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: 800, color: 'var(--accent-green)' }}>
                      {formatearCLP(item.totalNeto)}
                    </td>
                  </tr>
                ))}
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
  fontSize: '11.5px',
  fontWeight: '800',
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

const selectNeuStyle = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: '10px',
  border: 'none',
  outline: 'none',
  background: 'var(--bg-neumorphic)',
  boxShadow: 'var(--neu-pressed)',
  fontSize: '13.5px',
  color: 'var(--text-main)',
  marginTop: '10px',
  cursor: 'pointer',
  boxSizing: 'border-box',
};

const btnSubirArchivoStyle = {
  padding: '12px 20px',
  borderRadius: '12px',
  background: 'var(--bg-neumorphic)',
  boxShadow: 'var(--neu-flat-sm)',
  color: 'var(--primary-color)',
  fontWeight: '800',
  fontSize: '13px',
  cursor: 'pointer',
  display: 'inline-block',
};