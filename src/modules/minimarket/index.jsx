import React, { useState } from 'react';
import GestionInventarioMini from './GestionInventarioMini.jsx';
import ImportadorMasivoInventario from './ImportadorMasivoInventario.jsx';
import GestionCostosVariablesRest from '../restaurant/GestionCostosVariablesRest.jsx';
import GestionCostosFijosRest from '../restaurant/GestionCostosFijosRest.jsx';
import { useAppState } from '../../store/appState.jsx';

export default function ModuloMinimarket() {
  const {
    catalogoMayorista,
    inventario,
    costosVariables,
    costosFijos,
    guardarProductoInventario,
    importarLoteInventario,
    guardarCostoVariable,
    eliminarCostoVariable,
    guardarCostoFijo,
    eliminarCostoFijo
  } = useAppState();

  const [pestanaActiva, setPestanaActiva] = useState('inventario');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '26px', fontWeight: 900, color: '#1a202c', margin: '0 0 6px 0' }}>
            Control de Inventario y Abastecimiento
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>
            Administración de catálogo, cálculo de puntos de reorden y costos operativos comerciales.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setPestanaActiva('inventario')}
            style={{
              padding: '9px 16px',
              borderRadius: '12px',
              fontSize: '12.5px',
              fontWeight: '800',
              cursor: 'pointer',
              background: 'var(--bg-neumorphic)',
              color: pestanaActiva === 'inventario' ? 'var(--primary-color)' : 'var(--text-muted)',
              boxShadow: pestanaActiva === 'inventario' ? 'var(--neu-pressed)' : 'var(--neu-flat-sm)'
            }}
          >
            Inventario Activo
          </button>
          <button
            onClick={() => setPestanaActiva('importar')}
            style={{
              padding: '9px 16px',
              borderRadius: '12px',
              fontSize: '12.5px',
              fontWeight: '800',
              cursor: 'pointer',
              background: 'var(--bg-neumorphic)',
              color: pestanaActiva === 'importar' ? 'var(--primary-color)' : 'var(--text-muted)',
              boxShadow: pestanaActiva === 'importar' ? 'var(--neu-pressed)' : 'var(--neu-flat-sm)'
            }}
          >
            + Carga Masiva Express
          </button>
        </div>
      </div>

      {pestanaActiva === 'inventario' ? (
        <GestionInventarioMini
          catalogoMayorista={catalogoMayorista}
          inventario={inventario}
          onGuardarProducto={guardarProductoInventario}
        />
      ) : (
        <ImportadorMasivoInventario onImportarLote={importarLoteInventario} />
      )}

      <hr style={{ border: 'none', borderTop: '2px dashed #cbd5e0', margin: 0 }} />

      <GestionCostosVariablesRest
        costosVariables={costosVariables}
        onGuardarCostoVariable={guardarCostoVariable}
        onEliminarCostoVariable={eliminarCostoVariable}
      />

      <hr style={{ border: 'none', borderTop: '2px dashed #cbd5e0', margin: 0 }} />

      <GestionCostosFijosRest
        costosFijos={costosFijos}
        onGuardarCostoFijo={guardarCostoFijo}
        onEliminarCostoFijo={eliminarCostoFijo}
      />

    </div>
  );
}