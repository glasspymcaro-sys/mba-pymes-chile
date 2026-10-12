import React, { useState } from 'react';
import { useAppState } from '../store/appState.jsx';
import { formatearCLP } from '../utils/formatters.js';

export default function GestionMermas() {
  const {
    porcentajeMermaGlobal,
    setPorcentajeMermaGlobal,
    costoVariableConsolidado,
    ventasEstimadasMensuales,
    precioVentaConsolidado
  } = useAppState();

  const [registrosMerma, setRegistrosMerma] = useState([
    { id: 'm_1', motivo: 'Caducidad / Descomposición', porcentaje: 3.0, impactoMensual: 0 },
    { id: 'm_2', motivo: 'Manipulación y Roturas', porcentaje: 1.5, impactoMensual: 0 },
    { id: 'm_3', motivo: 'Diferencia en Inventario Físico', porcentaje: 0.5, impactoMensual: 0 }
  ]);

  const [nuevoMotivo, setNuevoMotivo] = useState('');
  const [nuevoPorcentaje, setNuevoPorcentaje] = useState('');

  const costoBaseEstimado = costoVariableConsolidado * ventasEstimadasMensuales;
  const perdidaMonetariaMensual = (costoBaseEstimado * (porcentajeMermaGlobal / 100));

  const handleAgregar = (e) => {
    e.preventDefault();
    if (!nuevoMotivo || !nuevoPorcentaje) return;
    const item = {
      id: `m_${Date.now()}`,
      motivo: nuevoMotivo,
      porcentaje: Number(nuevoPorcentaje),
      impactoMensual: 0
    };
    setRegistrosMerma([...registrosMerma, item]);
    setPorcentajeMermaGlobal(prev => Number(prev) + Number(nuevoPorcentaje));
    setNuevoMotivo('');
    setNuevoPorcentaje('');
  };

  const handleEliminar = (id, pct) => {
    setRegistrosMerma(registrosMerma.filter(r => r.id !== id));
    setPorcentajeMermaGlobal(prev => Math.max(0, Number(prev) - Number(pct)));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      <div>
        <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#1a202c', margin: '0 0 6px 0' }}>
          Gestión y Control de Mermas
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>
          Parametriza la pérdida operativa para que se cargue automáticamente al costo variable unitario y no erosione el margen final.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
        <div style={cardNeuStyle}>
          <span style={labelNeuStyle}>Factor Merma Activo</span>
          <div style={{ fontSize: '28px', fontWeight: 900, color: 'var(--accent-red)', marginTop: '8px' }}>
            {porcentajeMermaGlobal}%
          </div>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>Sobre costo de adquisición / producción</span>
        </div>

        <div style={cardNeuStyle}>
          <span style={labelNeuStyle}>Costo Mensual de la Merma</span>
          <div style={{ fontSize: '28px', fontWeight: 900, color: '#1a202c', marginTop: '8px' }}>
            {formatearCLP(perdidaMonetariaMensual)}
          </div>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>Impacto financiero mensual estimado</span>
        </div>

        <div style={cardNeuStyle}>
          <span style={labelNeuStyle}>Ajuste de Tarifa Requerido</span>
          <div style={{ fontSize: '28px', fontWeight: 900, color: 'var(--primary-color)', marginTop: '8px' }}>
            +{porcentajeMermaGlobal}%
          </div>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>Recargo base transferido al costeo</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '28px', alignItems: 'flex-start' }}>
        
        {/* Formulario de registro */}
        <div style={cardNeuStyle}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1a202c', marginBottom: '16px' }}>
            Registrar Causal de Merma
          </h3>
          <form onSubmit={handleAgregar} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={labelFormStyle}>Causal / Concepto</label>
              <input
                type="text"
                placeholder="Ej. Falla de refrigeración / Rotura"
                value={nuevoMotivo}
                onChange={(e) => setNuevoMotivo(e.target.value)}
                style={inputNeuStyle}
                required
              />
            </div>
            <div>
              <label style={labelFormStyle}>Porcentaje Estimado (%)</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="50"
                placeholder="Ej. 2.0"
                value={nuevoPorcentaje}
                onChange={(e) => setNuevoPorcentaje(e.target.value)}
                style={inputNeuStyle}
                required
              />
            </div>
            <button type="submit" style={btnPrimaryNeuStyle}>
              Agregar Factor
            </button>
          </form>
        </div>

        {/* Tabla de Causales */}
        <div style={cardNeuStyle}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1a202c', marginBottom: '16px' }}>
            Desglose de Factores Operativos
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #cbd5e0', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '10px 8px' }}>Causal</th>
                  <th style={{ padding: '10px 8px' }}>Incidencia</th>
                  <th style={{ padding: '10px 8px' }}>Impacto Monetario</th>
                  <th style={{ padding: '10px 8px', textAlign: 'center' }}>Acción</th>
                </tr>
              </thead>
              <tbody>
                {registrosMerma.map((reg) => {
                  const impacto = (costoBaseEstimado * (reg.porcentaje / 100));
                  return (
                    <tr key={reg.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '12px 8px', fontWeight: 700, color: '#2d3748' }}>{reg.motivo}</td>
                      <td style={{ padding: '12px 8px', color: 'var(--accent-red)', fontWeight: 800 }}>{reg.porcentaje}%</td>
                      <td style={{ padding: '12px 8px', color: '#4a5568' }}>{formatearCLP(impacto)}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                        <button
                          onClick={() => handleEliminar(reg.id, reg.porcentaje)}
                          style={btnEliminarNeuStyle}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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

const btnPrimaryNeuStyle = {
  padding: '12px',
  borderRadius: '12px',
  background: 'var(--bg-neumorphic)',
  boxShadow: 'var(--neu-flat-sm)',
  color: 'var(--primary-color)',
  fontWeight: '800',
  fontSize: '13px',
  cursor: 'pointer',
  marginTop: '8px',
};

const btnEliminarNeuStyle = {
  padding: '6px 10px',
  borderRadius: '8px',
  background: 'var(--bg-neumorphic)',
  boxShadow: 'var(--neu-flat-sm)',
  color: 'var(--accent-red)',
  fontWeight: '700',
  fontSize: '11px',
  cursor: 'pointer',
};