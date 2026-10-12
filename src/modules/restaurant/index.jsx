import React from 'react';
import GestionInsumosRest from './GestionInsumosRest.jsx';
import GestionRecetasRest from './GestionRecetasRest.jsx';
import GestionCostosVariablesRest from './GestionCostosVariablesRest.jsx';
import GestionCostosFijosRest from './GestionCostosFijosRest.jsx';
import { useAppState } from '../../store/appState.jsx';

export default function ModuloRestaurant() {
  const {
    insumos,
    recetas,
    costosVariables,
    costosFijos,
    guardarInsumo,
    guardarReceta,
    guardarCostoVariable,
    eliminarCostoVariable,
    guardarCostoFijo,
    eliminarCostoFijo
  } = useAppState();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
      
      <div>
        <h2 style={{ fontSize: '26px', fontWeight: 900, color: '#1a202c', margin: '0 0 6px 0' }}>
          Estructura de Costos del Restaurante
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>
          Parametriza ingredientes, recetas, costos variables indirectos y gastos estructurales fijos.
        </p>
      </div>

      <GestionInsumosRest
        insumos={insumos}
        onGuardarInsumo={guardarInsumo}
      />

      <hr style={{ border: 'none', borderTop: '2px dashed #cbd5e0', margin: 0 }} />

      <GestionRecetasRest
        insumos={insumos}
        recetas={recetas}
        onGuardarReceta={guardarReceta}
      />

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