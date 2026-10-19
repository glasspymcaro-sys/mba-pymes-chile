import React from 'react';
import CreadorCostoVariable from './components/CreadorCostoVariable.jsx';

export default function GestionCostosVariablesRest({
  costosVariables,
  onGuardarCostoVariable,
  onEliminarCostoVariable,
}) {
  const totalVariable = costosVariables.reduce(
    (acc, cv) => acc + cv.costoPorUnidad,
    0
  );

  return (
    <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
      <div style={{ flex: '0 0 400px' }}>
        <div style={{ marginBottom: '20px' }}>
          <h3
            style={{ margin: '0 0 5px 0', color: '#2c3e50', fontSize: '20px' }}
          >
            3. Costos Variables Indirectos (CIF)
          </h3>
          <p style={{ color: '#7f8c8d', fontSize: '14px', margin: 0 }}>
            Gastos que aumentan con cada venta, pero no son ingredientes de la
            receta (ej. cajas, bolsas, comisiones).
          </p>
        </div>

        <CreadorCostoVariable onGuardarCostoVariable={onGuardarCostoVariable} />
      </div>

      <div
        style={{
          flex: '1',
          background: 'var(--color-surface, #0D131F)',
          padding: '24px',
          borderRadius: '16px',
          boxShadow: 'var(--shadow-card)',
          border: '1px solid var(--color-border)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <h3 style={{ margin: 0, color: 'var(--color-foreground, #F8FAFC)', fontSize: '18px' }}>
            Listado de Costos Adicionales
          </h3>
          <div
            style={{
              background: 'rgba(226, 248, 0, 0.12)',
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid rgba(226, 248, 0, 0.35)',
              fontWeight: 'bold',
              color: 'var(--color-primary)',
            }}
          >
            Costo Extra por Plato: ${totalVariable.toLocaleString('es-CL')}
          </div>
        </div>

        {costosVariables.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '40px',
              color: 'var(--color-muted-foreground)',
              background: 'var(--color-surface-elevated, #131A29)',
              borderRadius: '8px',
            }}
          >
            No hay costos variables adicionales registrados.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'left',
              }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom: '2px solid #e4ecf3',
                    color: '#5c6c7b',
                    fontSize: '13px',
                  }}
                >
                  <th style={{ padding: '12px 8px' }}>Concepto</th>
                  <th style={{ padding: '12px 8px' }}>Costo por Venta</th>
                  <th style={{ padding: '12px 8px', textAlign: 'center' }}>
                    Accion
                  </th>
                </tr>
              </thead>
              <tbody>
                {costosVariables.map((cv) => (
                  <tr key={cv.id} style={{ borderBottom: '1px solid #f0f4f8' }}>
                    <td
                      style={{
                        padding: '12px 8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#2c3e50',
                      }}
                    >
                      {cv.nombre}
                    </td>
                    <td
                      style={{
                        padding: '12px 8px',
                        fontSize: '14px',
                        color: '#d35400',
                        fontWeight: 'bold',
                      }}
                    >
                      ${cv.costoPorUnidad.toLocaleString('es-CL')}
                    </td>
                    <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                      <button
                        onClick={() => onEliminarCostoVariable(cv.id)}
                        style={{
                          background: '#fdedec',
                          border: '1px solid #e74c3c',
                          color: '#e74c3c',
                          cursor: 'pointer',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                        }}
                      >
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
  );
}
