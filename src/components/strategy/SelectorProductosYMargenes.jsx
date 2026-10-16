import React from 'react';
import { useAppState } from '../../store/appState.jsx';
import ProductoRecetaFigura3D from '../svg3d/ProductoRecetaFigura3D.jsx';
import InsumoFigura3D from '../svg3d/InsumoFigura3D.jsx';
import ImagenJson3D from '../svg3d/ImagenJson3D.jsx';
import { formatCLP } from '../../utils/formatters.js';

/**
 * Selector Ejecutivo de Productos, Insumos & Análisis de Márgenes
 * Primer bloque del Centro Estratégico: Permite visualizar de un vistazo los insumos,
 * el costo directo, el precio de venta y el margen de contribución de cada producto,
 * y seleccionar el producto activo para simulaciones de precios y descuentos.
 * Cumple estrictamente con la regla de cero emojis.
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
        padding: '22px',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
        border: '1.5px solid #CBD5E1',
        boxShadow: '0 4px 16px rgba(15, 23, 42, 0.05)',
      }}
    >
      {/* 1. Cabecera Ejecutiva del Módulo */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ImagenJson3D idIcono="mina_oro" tamaño={50} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontSize: '10.5px',
                  fontWeight: 800,
                  color: '#0F766E',
                  backgroundColor: '#CCFBF1',
                  border: '1px solid #99F6E4',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                1. Portafolio Activo & Márgenes de Insumos
              </span>
              <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
                {totalProductos} productos configurados
              </span>
            </div>
            <h2 className="heading-tight" style={{ fontSize: '18px', fontWeight: 800, color: '#09090B', margin: '4px 0 2px 0' }}>
              Catálogo de Productos & Costeo Directo de Ingredientes
            </h2>
            <p style={{ fontSize: '12.5px', color: '#475569', margin: 0 }}>
              Selecciona cualquier producto para inspeccionar sus insumos y conectar sus números directamente a los simuladores de precios y descuentos.
            </p>
          </div>
        </div>

        {/* Resumen Rápido de Indicadores del Portafolio */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              textAlign: 'center',
            }}
          >
            <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 700, display: 'block', textTransform: 'uppercase' }}>
              Margen Promedio
            </span>
            <span className="tabular-nums" style={{ fontSize: '14px', fontWeight: 800, color: '#0F766E' }}>
              {margenPromedio}%
            </span>
          </div>

          {productoEstrella && (
            <div
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                backgroundColor: '#F0FDFA',
                border: '1px solid #99F6E4',
                textAlign: 'center',
              }}
            >
              <span style={{ fontSize: '10px', color: '#0F766E', fontWeight: 700, display: 'block', textTransform: 'uppercase' }}>
                Mayor Aporte Unitario
              </span>
              <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#0F172A' }}>
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
                height: '34px',
                padding: '0 12px',
                fontSize: '11.5px',
                fontWeight: 600,
                color: '#0F766E',
                borderColor: '#0F766E',
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
              <span>Generar o Editar Insumos</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Rejilla de Selección Rápida de Productos */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Haz clic en un producto para fijar sus precios y simular descuentos:
          </span>
          <span style={{ fontSize: '11px', color: '#0F766E', fontWeight: 600 }}>
            Producto Activo: <strong>{productoActivo?.nombre || 'Ninguno'}</strong>
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
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
                  backgroundColor: esActivo ? '#F0FDFA' : '#FFFFFF',
                  borderRadius: '10px',
                  border: `2px solid ${esActivo ? '#0F766E' : '#E2E8F0'}`,
                  boxShadow: esActivo ? '0 4px 12px rgba(15, 118, 110, 0.12)' : '0 1px 3px rgba(0,0,0,0.04)',
                  padding: '12px 14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'all 0.18s ease',
                  position: 'relative',
                }}
              >
                {/* Miniatura del producto */}
                <div style={{ flexShrink: 0 }}>
                  <ProductoRecetaFigura3D
                    nombreProducto={prod.nombre}
                    rubro={perfil}
                    figuraId={prod.figuraId}
                    imagenPersonalizada={prod.imagenPersonalizada}
                    insumosEnReceta={prod.ingredientes}
                    tamaño={48}
                  />
                </div>

                {/* Datos del producto */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '4px' }}>
                    <h4
                      style={{
                        fontSize: '13px',
                        fontWeight: 700,
                        color: esActivo ? '#0F766E' : '#0F172A',
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
                          fontWeight: 700,
                          backgroundColor: '#0F766E',
                          color: '#FFFFFF',
                          padding: '1px 6px',
                          borderRadius: '4px',
                          textTransform: 'uppercase',
                          flexShrink: 0,
                        }}
                      >
                        Activo
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                    <div>
                      <span style={{ fontSize: '10px', color: '#64748B', display: 'block' }}>
                        Precio: <strong className="tabular-nums" style={{ color: '#0F172A' }}>{formatCLP(precioProd)}</strong>
                      </span>
                      <span style={{ fontSize: '10px', color: '#64748B', display: 'block' }}>
                        Costo: <strong className="tabular-nums" style={{ color: '#DC2626' }}>{formatCLP(costoProd)}</strong>
                      </span>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span
                        className="tabular-nums"
                        style={{
                          fontSize: '11.5px',
                          fontWeight: 800,
                          color: margenPct >= 50 ? '#059669' : margenPct >= 30 ? '#0F766E' : '#D97706',
                          backgroundColor: margenPct >= 50 ? '#ECFDF5' : margenPct >= 30 ? '#F0FDFA' : '#FFFBEB',
                          border: `1px solid ${margenPct >= 50 ? '#A7F3D0' : margenPct >= 30 ? '#99F6E4' : '#FDE68A'}`,
                          padding: '2px 6px',
                          borderRadius: '5px',
                          display: 'inline-block',
                        }}
                      >
                        +{margenPct}%
                      </span>
                      <span className="tabular-nums" style={{ fontSize: '9.5px', color: '#64748B', display: 'block', marginTop: '2px' }}>
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
            backgroundColor: '#F8FAFC',
            borderRadius: '10px',
            border: '1.5px solid #CBD5E1',
            padding: '16px 18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {/* Cabecera del Detalle */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#0F766E', textTransform: 'uppercase' }}>
                Estructura de Costeo Directo • {productoActivo.nombre}
              </span>
              <span style={{ fontSize: '11px', color: '#64748B' }}>
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
                    height: '28px',
                    padding: '0 10px',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#DC2626',
                    borderColor: '#FCA5A5',
                    backgroundColor: '#FEF2F2',
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="5" x2="5" y2="19" />
                    <circle cx="6.5" cy="6.5" r="2.5" />
                    <circle cx="17.5" cy="17.5" r="2.5" />
                  </svg>
                  <span>Simular Descuento de este Producto &darr;</span>
                </button>
              )}
            </div>
          </div>

          {/* Desglose de Insumos en Chips / Tabla Técnica */}
          {ingredientesActivos.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                gap: '8px',
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
                      backgroundColor: '#FFFFFF',
                      borderRadius: '8px',
                      border: '1px solid #E2E8F0',
                      padding: '8px 10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                      <InsumoFigura3D
                        nombre={ing.nombre}
                        tipologia={ing.tipologia}
                        imagenPersonalizada={ing.imagenPersonalizada}
                        tamaño={28}
                        rubro={perfil}
                      />
                      <div style={{ minWidth: 0 }}>
                        <span
                          style={{
                            fontSize: '11.5px',
                            fontWeight: 600,
                            color: '#0F172A',
                            display: 'block',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {ing.nombre}
                        </span>
                        <span style={{ fontSize: '10px', color: '#64748B' }}>
                          {cant > 1 ? `${cant} x ` : ''}{formatCLP(costoU)} / {ing.unidadMedida || 'un'}
                        </span>
                      </div>
                    </div>

                    <span className="tabular-nums" style={{ fontSize: '11.5px', fontWeight: 700, color: '#DC2626', flexShrink: 0 }}>
                      {formatCLP(aporteTotal)}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              style={{
                padding: '16px',
                textAlign: 'center',
                backgroundColor: '#FFFFFF',
                borderRadius: '8px',
                border: '1px dashed #CBD5E1',
              }}
            >
              <p style={{ fontSize: '12px', color: '#64748B', margin: '0 0 8px 0' }}>
                Este producto no tiene insumos individuales asignados todavía.
              </p>
              {onIrAInsumos && (
                <button
                  type="button"
                  onClick={onIrAInsumos}
                  className="btn-bacan-secondary"
                  style={{ height: '30px', padding: '0 12px', fontSize: '11.5px' }}
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
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
              padding: '10px 14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '11px', color: '#64748B' }}>
                Precio Venta (P): <strong className="tabular-nums" style={{ color: '#0F172A', fontSize: '13px' }}>{formatCLP(precioVentaConsolidado)}</strong>
              </span>
              <span>-</span>
              <span style={{ fontSize: '11px', color: '#64748B' }}>
                Costo Insumos (CV): <strong className="tabular-nums" style={{ color: '#DC2626', fontSize: '13px' }}>{formatCLP(costoVariableConsolidado)}</strong>
              </span>
              <span>=</span>
              <span style={{ fontSize: '11px', color: '#64748B' }}>
                Margen Bruto de Contribución: <strong className="tabular-nums" style={{ color: '#0F766E', fontSize: '14px', fontWeight: 800 }}>{formatCLP(Math.max(0, precioVentaConsolidado - costoVariableConsolidado))}</strong>
              </span>
            </div>

            <div style={{ fontSize: '11.5px', color: '#475569' }}>
              Tras Fugas Reales (IVA/POS/Merma): <strong className="tabular-nums" style={{ color: '#059669', fontWeight: 700 }}>{formatCLP(analisisFugasActivas.margenContribucionReal)} ({analisisFugasActivas.margenBrutoRealPorcentaje}%)</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
