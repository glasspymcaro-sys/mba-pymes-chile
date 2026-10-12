import React from 'react';
import { useAppState } from '../store/appState.jsx';
import TarjetaInsumo from '../components/cards/TarjetaInsumo.jsx';
import BotonAgregarInsumo from '../components/controls/BotonAgregarInsumo.jsx';
import SimuladorPrecio from '../components/controls/SimuladorPrecio.jsx';

export default function GestionInsumos() {
  const { insumos, agregarInsumo, editarInsumo, eliminarInsumo, precioVenta, setPrecioVenta } = useAppState();

  const costosFijos = insumos.filter((i) => i.tipo === 'fijo');
  const costosVariables = insumos.filter((i) => i.tipo === 'variable');

  return (
    <div>
      <div style={{ marginBottom: '22px' }}>
        <h2
          style={{
            margin: '0 0 6px 0',
            fontSize: '22px',
            fontWeight: 800,
            color: 'var(--color-navy)',
            fontFamily: 'var(--font-title)',
          }}
        >
          Tus costos
        </h2>
        <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-muted)' }}>
          Toca un monto para cambiarlo, borra lo que no uses, y agrega los costos que le falten a tu negocio.
        </p>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <SimuladorPrecio precioVenta={precioVenta} onCambiar={setPrecioVenta} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div>
          <h3
            style={{
              fontSize: '13.5px',
              fontWeight: 700,
              color: 'var(--color-text)',
              marginBottom: '4px',
              fontFamily: 'var(--font-title)',
            }}
          >
            Costos que se repiten igual cada mes
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: 0, marginBottom: '12px' }}>
            Como el arriendo o los sueldos: los pagas aunque vendas poco o mucho.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {costosFijos.map((insumo) => (
              <TarjetaInsumo key={insumo.id} insumo={insumo} onEditar={editarInsumo} onEliminar={eliminarInsumo} />
            ))}
            {costosFijos.length === 0 && (
              <p style={{ fontSize: '12.5px', color: 'var(--color-text-muted)' }}>Todavía no tienes costos fijos cargados.</p>
            )}
          </div>
        </div>

        <div>
          <h3
            style={{
              fontSize: '13.5px',
              fontWeight: 700,
              color: 'var(--color-text)',
              marginBottom: '4px',
              fontFamily: 'var(--font-title)',
            }}
          >
            Costos que dependen de cuánto vendas
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: 0, marginBottom: '12px' }}>
            Como los ingredientes o los envases: si vendes más, gastas más en esto.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {costosVariables.map((insumo) => (
              <TarjetaInsumo key={insumo.id} insumo={insumo} onEditar={editarInsumo} onEliminar={eliminarInsumo} />
            ))}
            {costosVariables.length === 0 && (
              <p style={{ fontSize: '12.5px', color: 'var(--color-text-muted)' }}>Todavía no tienes costos por venta cargados.</p>
            )}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '20px', maxWidth: '420px' }}>
        <BotonAgregarInsumo onAgregar={agregarInsumo} />
      </div>
    </div>
  );
}
