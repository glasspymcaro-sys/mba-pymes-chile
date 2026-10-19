import React from 'react';
import CreadorInsumo from './components/CreadorInsumo.jsx';

export default function GestionInsumosRest({
  insumos,
  onGuardarInsumo,
  onEliminarInsumo,
}) {
  return (
    <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
      <div style={{ flex: '0 0 400px' }}>
        <div style={{ marginBottom: '20px' }}>
          <h3
            style={{ margin: '0 0 5px 0', color: '#2c3e50', fontSize: '20px' }}
          >
            1. Registrar Materias Primas
          </h3>
          <p style={{ color: '#7f8c8d', fontSize: '14px', margin: 0 }}>
            Alimenta tu base de datos de costos antes de armar recetas.
          </p>
        </div>

        <CreadorInsumo onGuardarInsumo={onGuardarInsumo} />
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
        <h3
          style={{ margin: '0 0 20px 0', color: 'var(--color-foreground, #F8FAFC)', fontSize: '18px' }}
        >
          Base de Datos de Insumos ({insumos.length})
        </h3>

        {insumos.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '40px',
              color: 'var(--color-muted-foreground)',
              background: 'var(--color-surface-elevated, #131A29)',
              borderRadius: '8px',
            }}
          >
            Aún no hay insumos registrados. Crea el primero en el panel
            izquierdo.
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
                    borderBottom: '2px solid var(--color-border)',
                    color: 'var(--color-muted-foreground)',
                    fontSize: '13px',
                  }}
                >
                  <th style={{ padding: '12px 8px' }}>Insumo</th>
                  <th style={{ padding: '12px 8px' }}>Proveedor</th>
                  <th style={{ padding: '12px 8px' }}>Costo Unitario</th>
                  <th style={{ padding: '12px 8px', textAlign: 'center' }}>
                    Acción
                  </th>
                </tr>
              </thead>
              <tbody>
                {insumos.map((insumo) => (
                  <tr
                    key={insumo.id}
                    style={{
                      borderBottom: '1px solid var(--color-border-subtle)',
                      transition: 'background 0.2s',
                    }}
                  >
                    <td
                      style={{
                        padding: '12px 8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#2c3e50',
                      }}
                    >
                      {insumo.nombre}
                    </td>
                    <td
                      style={{
                        padding: '12px 8px',
                        fontSize: '13px',
                        color: '#7f8c8d',
                      }}
                    >
                      {insumo.proveedor}
                    </td>
                    <td
                      style={{
                        padding: '12px 8px',
                        fontSize: '14px',
                        color: '#3498db',
                        fontWeight: 'bold',
                      }}
                    >
                      ${insumo.costoPorUnidad}{' '}
                      <span
                        style={{
                          fontSize: '12px',
                          color: '#95a5a6',
                          fontWeight: 'normal',
                        }}
                      >
                        / {insumo.unidad}
                      </span>
                    </td>
                    <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                      <button
                        onClick={() => onEliminarInsumo(insumo.id)}
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
