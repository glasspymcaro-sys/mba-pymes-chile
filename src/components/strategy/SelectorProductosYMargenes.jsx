import React from 'react';
import { useAppState } from '../../store/appState.jsx';
import ProductoRecetaFigura3D from '../svg3d/ProductoRecetaFigura3D.jsx';
import InsumoFigura3D from '../svg3d/InsumoFigura3D.jsx';
import {
  Icono3DCosteoInsumos,
  Icono3DMargen,
  Icono3DDescuento,
} from '../icons3d/SistemaIconografia3D.jsx';
import { formatCLP } from '../../utils/formatters.js';

/**
 * Selector Ejecutivo de Productos, Insumos & Análisis de Márgenes
 * Primer bloque del Centro Estratégico: Permite visualizar de un vistazo los insumos,
 * el costo directo, el precio de venta y el margen de contribución de cada producto,
 * y seleccionar el producto activo para simulaciones de precios y descuentos.
 * Cumple con la estética Dark Tech ImpactM5 ($5,000+ USD) y cero emojis.
 */
export default function SelectorProductosYMargenes({ onIrAInsumos, onIrADescuentos }) {
  const {
    perfil,
    recetas = [],
    recetaEnOlla,
    cargarRecetaEnOlla,
    precioVentaConsolidado,
    costoVariableConsolidado,
    analisisFugasActivas,
  } = useAppState();

  const listaProductos = recetas || [];
  const productoActivo = recetaEnOlla || listaProductos[0];

  // Cálculo de métricas globales del catálogo
  const totalProductos = listaProductos.length;
  const margenPromedio = totalProductos > 0
    ? Math.round(
        listaProductos.reduce((acc, p) => {
          const costo = (p.ingredientes || []).reduce(
            (sum, ing) => sum + (Number(ing.costoUnitario) || 0) * (Number(ing.cantidad) || 1),
            0
          );
          const precio = Number(p.precioVenta) || 1000;
          const margenPct = precio > 0 ? ((precio - costo) / precio) * 100 : 0;
          return acc + margenPct;
        }, 0) / totalProductos
      )
    : 0;

  // Producto estrella con mayor margen unitario en pesos
  const productoEstrella = [...listaProductos].sort((a, b) => {
    const costoA = (a.ingredientes || []).reduce(
      (sum, ing) => sum + (Number(ing.costoUnitario) || 0) * (Number(ing.cantidad) || 1),
      0
    );
    const margenA = (Number(a.precioVenta) || 0) - costoA;
    const costoB = (b.ingredientes || []).reduce(
      (sum, ing) => sum + (Number(ing.costoUnitario) || 0) * (Number(ing.cantidad) || 1),
      0
    );
    const margenB = (Number(b.precioVenta) || 0) - costoB;
    return margenB - margenA;
  })[0];

  const ingredientesActivos = productoActivo?.ingredientes || [];

  return (
    <div
      id="seccion-productos-insumos"
      className="card-ejecutiva"
      style={{
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        backgroundColor: '#0D131F',
        border: '1px solid #1E293B',
        boxShadow: '0 12px 30px -10px rgba(0, 0, 0, 0.7)',
        borderRadius: '16px',
      }}
    >
      {/* 1. Cabecera Ejecutiva del Módulo */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Icono3DCosteoInsumos size={44} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontSize: '10.5px',
                  fontWeight: 800,
                  color: '#E2F800',
                  backgroundColor: 'rgba(226, 248, 0, 0.1)',
                  border: '1px solid rgba(226, 248, 0, 0.3)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                1. Catálogo y márgenes
              </span>
              <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>
                {totalProductos} productos configurados
              </span>
            </div>
            <h2 className="heading-tight" style={{ fontSize: '18px', fontWeight: 800, color: '#F8FAFC', margin: '4px 0 2px 0' }}>
              Costeo de productos e insumos
            </h2>
            <p style={{ fontSize: '12.5px', color: '#94A3B8', margin: 0 }}>
              Haz clic en un producto para revisar sus costos y evaluar su margen de contribución.
            </p>
          </div>
        </div>

        {/* Resumen Rápido de Indicadores del Portafolio */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              backgroundColor: '#111827',
              border: '1px solid #1E293B',
              textAlign: 'center',
            }}
          >
            <span style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 700, display: 'block', textTransform: 'uppercase' }}>
              Margen Promedio
            </span>
            <span className="tabular-nums" style={{ fontSize: '15px', fontWeight: 800, color: '#E2F800' }}>
              {margenPromedio}%
            </span>
          </div>

          {productoEstrella && (
            <div
              style={{
                padding: '8px 14px',
                borderRadius: '10px',
                backgroundColor: '#111827',
                border: '1px solid #1E293B',
                textAlign: 'center',
              }}
            >
              <span style={{ fontSize: '10px', color: '#10B981', fontWeight: 700, display: 'block', textTransform: 'uppercase' }}>
                Mayor Aporte Unitario
              </span>
              <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#F8FAFC' }}>
                {productoEstrella.nombre}
              </span>
            </div>
          )}

          {onIrAInsumos && (
            <button
              type="button"
              onClick={onIrAInsumos}
              className="btn-bacan-secondary"
              title="Ir al generador de recetas para agregar o cambiar ingredientes"
              style={{
                height: '36px',
                padding: '0 14px',
                fontSize: '11.5px',
                fontWeight: 700,
                color: '#E2F800',
                borderColor: '#1E293B',
                backgroundColor: '#111827',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Icono3DCosteoInsumos size={16} />
              <span>Editar insumos</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Rejilla de Selección Rápida de Productos */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Selecciona un producto para simular precios y descuentos:
          </span>
          <span style={{ fontSize: '11px', color: '#E2F800', fontWeight: 600 }}>
            Producto Activo: <strong style={{ color: '#FFFFFF' }}>{productoActivo?.nombre || 'Ninguno'}</strong>
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '12px',
          }}
        >
          {listaProductos.map((prod) => {
            const esActivo = productoActivo?.id === prod.id;
            const costoProd = (prod.ingredientes || []).reduce(
              (sum, ing) => sum + (Number(ing.costoUnitario) || 0) * (Number(ing.cantidad) || 1),
              0
            );
            const precioProd = Number(prod.precioVenta) || 1000;
            const margenPesos = Math.max(0, precioProd - costoProd);
            const margenPct = precioProd > 0 ? Math.round((margenPesos / precioProd) * 100) : 0;

            return (
              <div
                key={prod.id}
                onClick={() => cargarRecetaEnOlla(prod)}
                style={{
                  backgroundColor: esActivo ? '#131A29' : '#0B0F17',
                  borderRadius: '12px',
                  border: `2px solid ${esActivo ? '#E2F800' : '#1E293B'}`,
                  boxShadow: esActivo
                    ? '0 0 20px rgba(226, 248, 0, 0.18), 0 8px 24px rgba(0, 0, 0, 0.6)'
                    : '0 4px 12px rgba(0, 0, 0, 0.4)',
                  padding: '14px 16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  if (!esActivo) {
                    e.currentTarget.style.borderColor = 'rgba(226, 248, 0, 0.5)';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.6), 0 0 15px rgba(226, 248, 0, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!esActivo) {
                    e.currentTarget.style.borderColor = '#1E293B';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.4)';
                  }
                }}
              >
                {/* Miniatura del producto */}
                <div style={{ flexShrink: 0 }}>
                  <ProductoRecetaFigura3D
                    nombreProducto={prod.nombre}
                    rubro={perfil}
                    figuraId={prod.figuraId}
                    imagenPersonalizada={prod.imagenPersonalizada}
                    insumosEnReceta={[]}
                    tamaño={56}
                  />
                </div>

                {/* Datos del producto */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '4px' }}>
                    <h4
                      style={{
                        fontSize: '13.5px',
                        fontWeight: 700,
                        color: esActivo ? '#E2F800' : '#F8FAFC',
                        margin: 0,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                      title={prod.nombre}
                    >
                      {prod.nombre}
                    </h4>
                    {esActivo && (
                      <span
                        style={{
                          fontSize: '9.5px',
                          fontWeight: 800,
                          backgroundColor: '#E2F800',
                          color: '#070A12',
                          padding: '1px 6px',
                          borderRadius: '4px',
                          textTransform: 'uppercase',
                          flexShrink: 0,
                          letterSpacing: '0.04em',
                        }}
                      >
                        Activo
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                    <div>
                      <span style={{ fontSize: '10px', color: '#94A3B8', display: 'block' }}>
                        Precio: <strong className="tabular-nums" style={{ color: '#F8FAFC' }}>{formatCLP(precioProd)}</strong>
                      </span>
                      <span style={{ fontSize: '10px', color: '#94A3B8', display: 'block' }}>
                        Costo: <strong className="tabular-nums" style={{ color: '#F87171' }}>{formatCLP(costoProd)}</strong>
                      </span>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span
                        className="tabular-nums"
                        style={{
                          fontSize: '11.5px',
                          fontWeight: 800,
                          color: margenPct >= 50 ? '#10B981' : margenPct >= 30 ? '#E2F800' : '#F59E0B',
                          backgroundColor: margenPct >= 50 ? 'rgba(16, 185, 129, 0.15)' : margenPct >= 30 ? 'rgba(226, 248, 0, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                          border: `1px solid ${margenPct >= 50 ? 'rgba(16, 185, 129, 0.35)' : margenPct >= 30 ? 'rgba(226, 248, 0, 0.35)' : 'rgba(245, 158, 11, 0.35)'}`,
                          padding: '2px 7px',
                          borderRadius: '5px',
                          display: 'inline-block',
                        }}
                      >
                        +{margenPct}%
                      </span>
                      <span className="tabular-nums" style={{ fontSize: '9.5px', color: '#94A3B8', display: 'block', marginTop: '2px' }}>
                        {formatCLP(margenPesos)}/u
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Panel de Detalle del Producto Activo & Desglose de Insumos */}
      {productoActivo && (
        <div
          style={{
            backgroundColor: '#0B0F17',
            borderRadius: '12px',
            border: '1px solid #1E293B',
            padding: '18px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          {/* Cabecera del Detalle */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#E2F800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Estructura de Costeo Directo • {productoActivo.nombre}
              </span>
              <span style={{ fontSize: '11px', color: '#94A3B8' }}>
                ({ingredientesActivos.length} insumos asignados)
              </span>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {onIrADescuentos && (
                <button
                  type="button"
                  onClick={onIrADescuentos}
                  className="btn-bacan-secondary"
                  style={{
                    height: '30px',
                    padding: '0 12px',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#EF4444',
                    borderColor: 'rgba(239, 68, 68, 0.4)',
                    backgroundColor: 'rgba(239, 68, 68, 0.08)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Icono3DDescuento size={14} />
                  <span>Simular Descuento de este Producto &darr;</span>
                </button>
              )}
            </div>
          </div>

          {/* Desglose de Insumos en Chips Técnicos Obsidian */}
          {ingredientesActivos.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '10px',
              }}
            >
              {ingredientesActivos.map((ing, idx) => {
                const cant = Number(ing.cantidad) || 1;
                const costoU = Number(ing.costoUnitario) || 0;
                const aporteTotal = cant * costoU;

                return (
                  <div
                    key={ing.idAsignado || ing.id || idx}
                    style={{
                      backgroundColor: '#111827',
                      borderRadius: '10px',
                      border: '1px solid #1E293B',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
                      padding: '10px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '10px',
                      transition: 'border-color 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                      <InsumoFigura3D
                        nombre={ing.nombre}
                        tipologia={ing.tipologia}
                        imagenPersonalizada={ing.imagenPersonalizada}
                        tamaño={36}
                        rubro={perfil}
                      />
                      <div style={{ minWidth: 0 }}>
                        <span
                          style={{
                            fontSize: '12px',
                            fontWeight: 700,
                            color: '#F8FAFC',
                            display: 'block',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {ing.nombre}
                        </span>
                        <span style={{ fontSize: '10.5px', color: '#94A3B8' }}>
                          {cant > 1 ? `${cant} x ` : ''}{formatCLP(costoU)} / {ing.unidadMedida || 'un'}
                        </span>
                      </div>
                    </div>

                    <span className="tabular-nums" style={{ fontSize: '12px', fontWeight: 800, color: '#F87171', flexShrink: 0 }}>
                      {formatCLP(aporteTotal)}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              style={{
                padding: '18px',
                textAlign: 'center',
                backgroundColor: '#111827',
                borderRadius: '10px',
                border: '1px dashed #1E293B',
              }}
            >
              <p style={{ fontSize: '12px', color: '#94A3B8', margin: '0 0 10px 0' }}>
                Este producto no tiene insumos individuales asignados todavía.
              </p>
              {onIrAInsumos && (
                <button
                  type="button"
                  onClick={onIrAInsumos}
                  className="btn-bacan-secondary"
                  style={{ height: '32px', padding: '0 14px', fontSize: '11.5px', color: '#E2F800', borderColor: '#1E293B' }}
                >
                  Agregar Ingredientes en la sección de Costeo
                </button>
              )}
            </div>
          )}

          {/* Cinta Inferior de Resumen Matemático del Producto Activo */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              backgroundColor: '#111827',
              borderRadius: '10px',
              border: '1px solid #1E293B',
              padding: '12px 16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '11px', color: '#94A3B8' }}>
                Precio Venta (P): <strong className="tabular-nums" style={{ color: '#F8FAFC', fontSize: '13.5px' }}>{formatCLP(precioVentaConsolidado)}</strong>
              </span>
              <span style={{ color: '#475569' }}>-</span>
              <span style={{ fontSize: '11px', color: '#94A3B8' }}>
                Costo Insumos (CV): <strong className="tabular-nums" style={{ color: '#F87171', fontSize: '13.5px' }}>{formatCLP(costoVariableConsolidado)}</strong>
              </span>
              <span style={{ color: '#475569' }}>=</span>
              <span style={{ fontSize: '11px', color: '#94A3B8' }}>
                Margen Bruto de Contribución: <strong className="tabular-nums" style={{ color: '#E2F800', fontSize: '14.5px', fontWeight: 800 }}>{formatCLP(Math.max(0, precioVentaConsolidado - costoVariableConsolidado))}</strong>
              </span>
            </div>

            <div style={{ fontSize: '11.5px', color: '#94A3B8' }}>
              Tras Fugas Reales (IVA/POS/Merma): <strong className="tabular-nums" style={{ color: '#10B981', fontWeight: 800 }}>{formatCLP(analisisFugasActivas.margenContribucionReal)} ({analisisFugasActivas.margenBrutoRealPorcentaje}%)</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
