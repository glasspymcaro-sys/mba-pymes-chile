import React from 'react';
import ArmadorReceta from './components/ArmadorReceta.jsx';

export default function GestionRecetasRest({
  insumos,
  recetas,
  onGuardarReceta,
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <div>
        <div style={{ marginBottom: '20px' }}>
          <h3
            style={{ margin: '0 0 5px 0', color: '#2c3e50', fontSize: '20px' }}
          >
            2. Diseñar Menú y Precios
          </h3>
          <p style={{ color: '#7f8c8d', fontSize: '14px', margin: 0 }}>
            Arrastra tus insumos hacia la receta para calcular el costo exacto y
            fijar tu precio de venta.
          </p>
        </div>

        <ArmadorReceta
          insumosDisponibles={insumos}
          onGuardarReceta={onGuardarReceta}
        />
      </div>

      {recetas.length > 0 && (
        <div
          style={{
            background: 'var(--color-surface, #0D131F)',
            padding: '30px',
            borderRadius: '16px',
            border: '1px solid var(--color-border)',
          }}
        >
          <h3
            style={{ margin: '0 0 20px 0', color: 'var(--color-foreground, #F8FAFC)', fontSize: '20px' }}
          >
            Platos Configurados ({recetas.length})
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '20px',
            }}
          >
            {recetas.map((receta) => {
              const margenPorcentaje =
                receta.precioVenta > 0
                  ? (
                      ((receta.precioVenta - receta.costoTotal) /
                        receta.precioVenta) *
                      100
                    ).toFixed(1)
                  : 0;

              return (
                <div
                  key={receta.id}
                  style={{
                    background: 'var(--color-surface-elevated, #131A29)',
                    padding: '20px',
                    borderRadius: '12px',
                    boxShadow: 'var(--shadow-card)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <h4
                    style={{
                      margin: '0 0 15px 0',
                      fontSize: '18px',
                      color: '#2c3e50',
                      borderBottom: '2px solid #f4f7f9',
                      paddingBottom: '10px',
                    }}
                  >
                    {receta.nombre}
                  </h4>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '8px',
                      fontSize: '14px',
                    }}
                  >
                    <span style={{ color: '#7f8c8d' }}>Costo Receta:</span>
                    <strong>
                      ${receta.costoTotal.toLocaleString('es-CL')}
                    </strong>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '8px',
                      fontSize: '14px',
                    }}
                  >
                    <span style={{ color: '#7f8c8d' }}>Precio Venta:</span>
                    <strong>
                      ${receta.precioVenta.toLocaleString('es-CL')}
                    </strong>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '8px',
                      fontSize: '14px',
                    }}
                  >
                    <span style={{ color: '#7f8c8d' }}>Ventas esperadas:</span>
                    <strong>{receta.ventasEstimadas} platos/mes</strong>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginTop: '15px',
                      paddingTop: '15px',
                      borderTop: '1px dashed #ecf0f1',
                      fontSize: '14.5px',
                    }}
                  >
                    <span style={{ color: '#5c6c7b', fontWeight: 'bold' }}>
                      Margen:
                    </span>
                    <strong
                      style={{
                        color: margenPorcentaje >= 0 ? '#2ecc71' : '#e74c3c',
                      }}
                    >
                      {margenPorcentaje}%
                    </strong>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
