import React from 'react';
import CreadorCostoFijo from './components/CreadorCostoFijo.jsx';
import { formatearCLP } from '../../utils/formatters.js';

export default function GestionCostosFijosRest({ costosFijos, onGuardarCostoFijo, onEliminarCostoFijo }) {
  const totalFijos = costosFijos.reduce((acc, cf) => acc + Number(cf.monto || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h3 style={{ margin: '0 0 6px 0', color: '#1a202c', fontSize: '20px', fontWeight: 900 }}>
            Costos Fijos Operativos
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>
            Gastos estructurales periódicos que deben absorberse sin importar el volumen producido o vendido.
          </p>
        </div>

        <div style={{ ...cardNeuStyle, padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }}>Costo Fijo Mensual:</span>
          <strong style={{ fontSize: '16px', color: 'var(--accent-red)' }}>{formatearCLP(totalFijos)}</strong>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '28px', alignItems: 'flex-start' }}>
        <CreadorCostoFijo onGuardarCostoFijo={onGuardarCostoFijo} />

        <div style={cardNeuStyle}>
          <h4 style={{ margin: '0 0 16px 0', color: '#1a202c', fontSize: '16px', fontWeight: 800 }}>
            Estructura de Gastos Fijos
          </h4>

          {costosFijos.length === 0 ? (
            <div style={{ ...boxPressedNeuStyle, padding: '28px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13.5px' }}>
              No hay costos fijos registrados.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #cbd5e0', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '10px 8px' }}>Concepto</th>
                    <th style={{ padding: '10px 8px' }}>Monto Mensual</th>
                    <th style={{ padding: '10px 8px', textAlign: 'center' }}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {costosFijos.map((cf) => (
                    <tr key={cf.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '12px 8px', fontWeight: 700, color: 'var(--text-main)' }}>{cf.nombre}</td>
                      <td style={{ padding: '12px 8px', color: 'var(--accent-red)', fontWeight: 800 }}>{formatearCLP(cf.monto)}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                        <button onClick={() => onEliminarCostoFijo(cf.id)} style={btnEliminarNeuStyle}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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

const boxPressedNeuStyle = {
  borderRadius: '16px',
  boxShadow: 'var(--neu-pressed)',
  background: 'var(--bg-neumorphic)',
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