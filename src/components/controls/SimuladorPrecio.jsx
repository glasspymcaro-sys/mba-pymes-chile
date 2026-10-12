import React from 'react';
import { formatCLP } from '../../utils/formatters.js';

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
        backgroundColor: 'var(--color-surface)',
        borderRadius: '12px',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-card)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-foreground)', margin: 0 }}>
          Simulador de Sensibilidad
        </h3>
        <span style={{ fontSize: '11px', color: 'var(--color-muted-foreground)', fontWeight: 500 }}>
          En tiempo real
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', fontWeight: 600, color: 'var(--color-muted-foreground)' }}>
          <span>Precio de Venta Promedio</span>
          <span className="tabular-nums" style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '14px' }}>
            {formatCLP(precioVenta)}
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
            accentColor: 'var(--color-primary)',
            cursor: 'pointer',
            width: '100%',
            height: '6px',
          }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', fontWeight: 600, color: 'var(--color-muted-foreground)' }}>
          <span>Volumen Estimado Mensual</span>
          <span className="tabular-nums" style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '14px' }}>
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
            accentColor: 'var(--color-primary)',
            cursor: 'pointer',
            width: '100%',
            height: '6px',
          }}
        />
      </div>
    </div>
  );
}