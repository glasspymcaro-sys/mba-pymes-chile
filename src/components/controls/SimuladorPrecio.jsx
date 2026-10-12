import React from 'react';
import { formatearCLP } from '../../utils/formatters.js';

export default function SimuladorPrecio({
  precioVenta = 0,
  ventasEstimadas = 0,
  onPrecioChange,
  onVentasChange,
}) {
  const precioMin = Math.max(100, Math.floor(precioVenta * 0.4));
  const precioMax = Math.max(5000, Math.ceil(precioVenta * 2.5));
  const pasoPrecio = Math.max(50, Math.round(precioVenta * 0.02));

  const ventasMin = Math.max(1, Math.floor(ventasEstimadas * 0.2));
  const ventasMax = Math.max(100, Math.ceil(ventasEstimadas * 2.5));
  const pasoVentas = Math.max(1, Math.round(ventasEstimadas * 0.05));

  return (
    <div
      style={{
        background: 'var(--bg-neumorphic)',
        borderRadius: '20px',
        boxShadow: 'var(--neu-flat)',
        padding: '22px',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
      }}
    >
      <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
        Simulador de Sensibilidad en Vivo
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }}>
          <span>Precio de Venta Promedio</span>
          <span style={{ color: 'var(--primary-color)', fontWeight: '900', fontSize: '14px' }}>
            {formatearCLP(precioVenta)}
          </span>
        </div>
        <input
          type="range"
          min={precioMin}
          max={precioMax}
          step={pasoPrecio}
          value={precioVenta || 0}
          onChange={(e) => onPrecioChange(Number(e.target.value))}
          style={{
            accentColor: 'var(--primary-color)',
            cursor: 'pointer',
            width: '100%',
          }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }}>
          <span>Volumen Estimado Mensual</span>
          <span style={{ color: 'var(--primary-color)', fontWeight: '900', fontSize: '14px' }}>
            {(ventasEstimadas || 0).toLocaleString('es-CL')} un.
          </span>
        </div>
        <input
          type="range"
          min={ventasMin}
          max={ventasMax}
          step={pasoVentas}
          value={ventasEstimadas || 0}
          onChange={(e) => onVentasChange(Number(e.target.value))}
          style={{
            accentColor: 'var(--primary-color)',
            cursor: 'pointer',
            width: '100%',
          }}
        />
      </div>
    </div>
  );
}