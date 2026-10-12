import React, { useState } from 'react';
import { useAppState } from '../store/appState.jsx';
import { formatearCLP } from '../utils/formatters.js';

export default function ConfiguracionMargenes() {
  const {
    margenObjetivoPorcentaje,
    setMargenObjetivoPorcentaje,
    costoVariableConsolidado,
    costoFijoTotal,
    ventasEstimadasMensuales
  } = useAppState();

  const [tasaImpuestoIva, setTasaImpuestoIva] = useState(19);

  // Costo fijo unitario asignado
  const costoFijoUnitario = ventasEstimadasMensuales > 0 ? (costoFijoTotal / ventasEstimadasMensuales) : 0;
  const costoTotalUnitario = costoVariableConsolidado + costoFijoUnitario;

  // Precio Sugerido en base a Margen sobre Venta: P = Costo / (1 - Margen%)
  const divisorMargen = Math.max(0.01, 1 - (margenObjetivoPorcentaje / 100));
  const precioSugeridoNeto = Math.round(costoTotalUnitario / divisorMargen);
  const precioSugeridoBruto = Math.round(precioSugeridoNeto * (1 + (tasaImpuestoIva / 100)));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      <div>
        <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#1a202c', margin: '0 0 6px 0' }}>
          Estrategia y Fijación de Precios (Pricing)
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>
          Calcula el precio óptimo para absorber costos fijos, variables y merma asegurando el margen comercial objetivo.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
        <div style={cardNeuStyle}>
          <span style={labelNeuStyle}>Costo Variable Unitario</span>
          <div style={{ fontSize: '26px', fontWeight: 900, color: '#1a202c', marginTop: '8px' }}>
            {formatearCLP(costoVariableConsolidado)}
          </div>
          <span style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '4px' }}>Directo + Merma ponderada</span>
        </div>

        <div style={cardNeuStyle}>
          <span style={labelNeuStyle}>Costo Fijo Ponderado</span>
          <div style={{ fontSize: '26px', fontWeight: 900, color: '#1a202c', marginTop: '8px' }}>
            {formatearCLP(costoFijoUnitario)}
          </div>
          <span style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '4px' }}>Por unidad según volumen proyectado</span>
        </div>

        <div style={cardNeuStyle}>
          <span style={labelNeuStyle}>Precio Sugerido (Neto)</span>
          <div style={{ fontSize: '26px', fontWeight: 900, color: 'var(--primary-color)', marginTop: '8px' }}>
            {formatearCLP(precioSugeridoNeto)}
          </div>
          <span style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '4px' }}>Margen comercial: {margenObjetivoPorcentaje}%</span>
        </div>

        <div style={cardNeuStyle}>
          <span style={labelNeuStyle}>Precio Final (Con IVA)</span>
          <div style={{ fontSize: '26px', fontWeight: 900, color: 'var(--accent-green)', marginTop: '8px' }}>
            {formatearCLP(precioSugeridoBruto)}
          </div>
          <span style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '4px' }}>Tarifa pública sugerida</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px', alignItems: 'stretch' }}>
        
        {/* Controles de Configuración */}
        <div style={cardNeuStyle}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1a202c', marginBottom: '20px' }}>
            Parámetros de Margen Comercial
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
                <span>Margen sobre Venta Deseado</span>
                <span style={{ color: 'var(--primary-color)', fontWeight: 900 }}>{margenObjetivoPorcentaje}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="80"
                step="1"
                value={margenObjetivoPorcentaje}
                onChange={(e) => setMargenObjetivoPorcentaje(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--primary-color)', cursor: 'pointer' }}
              />
            </div>

            <div>
              <label style={labelFormStyle}>Tasa de Impuesto / IVA (%)</label>
              <input
                type="number"
                value={tasaImpuestoIva}
                onChange={(e) => setTasaImpuestoIva(Number(e.target.value))}
                style={inputNeuStyle}
              />
            </div>
          </div>
        </div>

        {/* Desglose de Estructura de Precio */}
        <div style={cardNeuStyle}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1a202c', marginBottom: '20px' }}>
            Estructura de Absorción por Venta
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={filaDesgloseStyle}>
              <span>Costo Variable (Insumos/Stock/CIF)</span>
              <strong>{formatearCLP(costoVariableConsolidado)}</strong>
            </div>
            <div style={filaDesgloseStyle}>
              <span>Absorción de Gastos Fijos</span>
              <strong>{formatearCLP(costoFijoUnitario)}</strong>
            </div>
            <div style={filaDesgloseStyle}>
              <span>Utilidad Neta Esperada</span>
              <strong style={{ color: 'var(--primary-color)' }}>
                {formatearCLP(precioSugeridoNeto - costoTotalUnitario)}
              </strong>
            </div>
            <div style={{ ...filaDesgloseStyle, borderTop: '2px dashed #cbd5e0', paddingTop: '10px' }}>
              <span style={{ fontWeight: 800 }}>Precio Neto Recomendado</span>
              <strong style={{ color: 'var(--accent-green)', fontSize: '16px' }}>{formatearCLP(precioSugeridoNeto)}</strong>
            </div>
          </div>
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
  fontSize: '12px',
  fontWeight: '800',
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.6px',
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

const filaDesgloseStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '13.5px',
  color: '#4a5568',
};