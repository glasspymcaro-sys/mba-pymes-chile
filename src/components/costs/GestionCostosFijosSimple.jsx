import React, { useState } from 'react';
import { useAppState } from '../../store/appState.jsx';
import { formatCLP } from '../../utils/formatters.js';

const SUGERENCIAS_FIJOS = [
  { nombre: 'Honorarios Contador Mensual', monto: 120000, categoria: 'Operacional' },
  { nombre: 'Patente Comercial Municipal', monto: 48000, categoria: 'Infraestructura' },
  { nombre: 'Internet Fibra & Sistema POS', monto: 55000, categoria: 'Tecnología' },
  { nombre: 'Seguro Contra Incendio y Robo', monto: 65000, categoria: 'Infraestructura' },
];

export default function GestionCostosFijosSimple() {
  const { costosFijos, agregarCostoFijo, eliminarCostoFijo, costoFijoTotal } = useAppState();
  const [nombre, setNombre] = useState('');
  const [monto, setMonto] = useState('');
  const [categoria, setCategoria] = useState('Infraestructura');

  const handleCrear = (e) => {
    e.preventDefault();
    const val = Number(monto) || 0;
    if (!nombre.trim() || val <= 0) return;

    agregarCostoFijo({
      id: 'cf_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
      nombre: nombre.trim(),
      monto: val,
      categoria,
    });

    setNombre('');
    setMonto('');
  };

  const handleAgregarSugerencia = (sug) => {
    agregarCostoFijo({
      id: 'cf_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
      nombre: sug.nombre,
      monto: sug.monto,
      categoria: sug.categoria,
    });
  };

  const iconoCategoria = (cat) => {
    if (cat === 'Personal') {
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    }
    if (cat === 'Tecnología') {
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      );
    }
    if (cat === 'Operacional') {
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      );
    }
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    );
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--color-surface)',
        borderRadius: '10px',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-card)',
        padding: '22px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <span style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Estructura Financiera • Gastos de Administración y Ventas
          </span>
          <h2 className="heading-tight" style={{ fontSize: '17px', fontWeight: 600, color: 'var(--color-foreground)', margin: '2px 0 0 0' }}>
            Costos Fijos Operacionales
          </h2>
          <p style={{ fontSize: '12.5px', color: 'var(--color-muted-foreground)', margin: '2px 0 0 0' }}>
            Compromisos mensuales estructurales independientes del volumen de producción o ventas
          </p>
        </div>

        <div style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-elevated, #131A29)', textAlign: 'right' }}>
          <span style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--color-muted-foreground)', display: 'block', letterSpacing: '0.04em' }}>
            CARGA FIJA MENSUAL (CF)
          </span>
          <span className="tabular-nums" style={{ fontSize: '19px', fontWeight: 700, color: 'var(--color-foreground)' }}>
            {formatCLP(costoFijoTotal)}
          </span>
        </div>
      </div>

      {/* Chips de Carga Rápida de Costos Fijos Frecuentes */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '11px', color: 'var(--color-muted-foreground)', fontWeight: 500 }}>
          Gastos frecuentes PyME:
        </span>
        {SUGERENCIAS_FIJOS.map((sug, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleAgregarSugerencia(sug)}
            className="btn-eng-secondary"
            style={{
              padding: '4px 9px',
              borderRadius: '5px',
              fontSize: '11px',
              fontWeight: 500,
              backgroundColor: 'var(--color-surface-elevated, #131A29)',
              color: 'var(--color-foreground)',
              border: '1px solid var(--color-border)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>{sug.nombre}</span>
            <span className="tabular-nums" style={{ color: 'var(--color-muted-foreground)' }}>
              ({formatCLP(sug.monto)})
            </span>
          </button>
        ))}
      </div>

      {/* Formulario para agregar nuevo costo fijo */}
      <form
        onSubmit={handleCrear}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr)) auto',
          gap: '12px',
          alignItems: 'flex-end',
          padding: '16px',
          borderRadius: '8px',
          backgroundColor: 'var(--color-surface-elevated, #131A29)',
          border: '1px solid var(--color-border)',
        }}
      >
        <div>
          <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-muted-foreground)', display: 'block', marginBottom: '4px', letterSpacing: '0.04em' }}>
            CONCEPTO DEL COSTO FIJO
          </label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Arriendo, Sueldos fijos..."
            required
            style={{
              width: '100%',
              height: '36px',
              padding: '0 12px',
              borderRadius: '6px',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-surface-elevated)',
              fontSize: '13.5px',
              color: 'var(--color-foreground)',
              boxSizing: 'border-box',
              outline: 'none',
            }}
          />
        </div>

        <div>
          <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-muted-foreground)', display: 'block', marginBottom: '4px', letterSpacing: '0.04em' }}>
            MONTO MENSUAL ($ CLP)
          </label>
          <input
            type="number"
            className="tabular-nums"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            placeholder="Ej: 500000"
            required
            min="1"
            style={{
              width: '100%',
              height: '36px',
              padding: '0 12px',
              borderRadius: '6px',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-surface-elevated)',
              fontSize: '13.5px',
              color: 'var(--color-foreground)',
              boxSizing: 'border-box',
              outline: 'none',
            }}
          />
        </div>

        <div>
          <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-muted-foreground)', display: 'block', marginBottom: '4px', letterSpacing: '0.04em' }}>
            CATEGORÍA
          </label>
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            style={{
              width: '100%',
              height: '36px',
              padding: '0 12px',
              borderRadius: '6px',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-surface-elevated)',
              fontSize: '13.5px',
              color: 'var(--color-foreground)',
              boxSizing: 'border-box',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="Infraestructura">Infraestructura</option>
            <option value="Personal">Personal</option>
            <option value="Operacional">Operacional</option>
            <option value="Tecnología">Tecnología</option>
          </select>
        </div>

        <button
          type="submit"
          className="btn-eng-primary"
          style={{
            height: '36px',
            padding: '0 18px',
            borderRadius: '6px',
            backgroundColor: 'var(--color-primary)',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '12.5px',
            fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Agregar costo fijo
        </button>
      </form>

      {/* Lista de Costos Fijos con Participación Porcentual */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
        {costosFijos.map((cf) => {
          const pesoPct = costoFijoTotal > 0 ? Math.round((Number(cf.monto || 0) / costoFijoTotal) * 100) : 0;

          return (
            <div
              key={cf.id}
              style={{
                padding: '14px 16px',
                borderRadius: '8px',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-surface-elevated)',
                boxShadow: 'var(--shadow-card)',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      backgroundColor: 'var(--color-brand-50)',
                      border: '1px solid var(--color-brand-200)',
                      color: 'var(--color-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {iconoCategoria(cf.categoria)}
                  </div>
                  <div>
                    <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--color-muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {cf.categoria || 'Fijo'} • {pesoPct}% del total
                    </span>
                    <h4 style={{ margin: '1px 0 0 0', fontSize: '13.5px', fontWeight: 600, color: 'var(--color-foreground)' }}>
                      {cf.nombre}
                    </h4>
                  </div>
                </div>

                <button
                  onClick={() => eliminarCostoFijo(cf.id)}
                  title="Eliminar costo fijo"
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '6px',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-surface-elevated)',
                    color: 'var(--color-danger)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="tabular-nums" style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-primary)' }}>
                  {formatCLP(cf.monto)}{' '}
                  <span style={{ fontSize: '11px', fontWeight: 500, color: 'var(--color-muted-foreground)' }}>/ mes</span>
                </span>
                <span className="tabular-nums" style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-muted-foreground)' }}>
                  {formatCLP(Math.round(Number(cf.monto || 0) / 30))} / día
                </span>
              </div>

              <div style={{ width: '100%', height: '4px', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '999px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${Math.min(100, pesoPct)}%`,
                    height: '100%',
                    backgroundColor: 'var(--color-primary)',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
