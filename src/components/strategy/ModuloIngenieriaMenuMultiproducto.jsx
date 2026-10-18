import React from 'react';
import { useAppState } from '../../store/appState.jsx';
import {
  Icono3DMatriz,
  Icono3DMargen,
  Icono3DEbit,
} from '../icons3d/SistemaIconografia3D.jsx';
import InsumoFigura3D from '../svg3d/InsumoFigura3D.jsx';
import { calcularIngenieriaMenuMultiproducto } from '../../core/calculationEngine.js';
import { formatCLP } from '../../utils/formatters.js';

export default function ModuloIngenieriaMenuMultiproducto({ onEditarProductoEnOllita }) {
  const {
    perfil,
    recetas,
    recetaEnOlla,
    cargarRecetaEnOlla,
    costoFijoTotal,
    sueldoObjetivo,
    analisisFugasActivas,
    actualizarMixReceta,
    ajustarPrecioRecetaPorId,
    eliminarRecetaPorId,
  } = useAppState();

  const ingenieria = calcularIngenieriaMenuMultiproducto({
    productos: recetas,
    costosFijos: costoFijoTotal,
    sueldoObjetivo,
    tasaFugasSobrePrecio: analisisFugasActivas.tasaFugasSobrePrecio,
  });

  const cuadrantesMeta = [
    {
      id: 'mina_oro',
      titulo: 'Tus Minas de Oro',
      subtitulo: 'Alto margen • Se vende mucho',
      iconoId: 'mina_oro',
      consejo: 'No los toques, asegúrate de no quedarte jamás sin stock.',
      color: '#E2F800',
      bg: 'rgba(226, 248, 0, 0.08)',
      borde: 'rgba(226, 248, 0, 0.35)',
    },
    {
      id: 'gancho',
      titulo: 'Tus Ganchos',
      subtitulo: 'Bajo margen • Se vende mucho',
      iconoId: 'gancho_comercial',
      consejo: 'Súbeles el precio un 5% o úsalos para vender un complemento caro.',
      color: '#60A5FA',
      bg: 'rgba(59, 130, 246, 0.08)',
      borde: 'rgba(59, 130, 246, 0.35)',
    },
    {
      id: 'joya_oculta',
      titulo: 'Tus Joyas Ocultas',
      subtitulo: 'Alto margen • Se vende poco',
      iconoId: 'joya_oculta',
      consejo: 'Dales más visibilidad, te dejan mucha plata cada vez que salen.',
      color: '#10B981',
      bg: 'rgba(16, 185, 129, 0.08)',
      borde: 'rgba(16, 185, 129, 0.35)',
    },
    {
      id: 'vampiro',
      titulo: 'Tus Vampiros',
      subtitulo: 'Bajo margen • Se vende poco',
      iconoId: 'vampiro_catalogo',
      consejo: 'Elimínalos del catálogo o sube su margen; solo te quitan tiempo e inventario.',
      color: '#EF4444',
      bg: 'rgba(239, 68, 68, 0.08)',
      borde: 'rgba(239, 68, 68, 0.35)',
    },
  ];

  return (
    <div
      id="seccion-matriz"
      className="card-ejecutiva"
      style={{
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '22px',
        backgroundColor: '#0D131F',
        border: '1px solid #1E293B',
        boxShadow: '0 12px 30px -10px rgba(0, 0, 0, 0.7)',
        borderRadius: '16px',
      }}
    >
      {/* Cabecera de Punto de Equilibrio Multi-Producto */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Icono3DMatriz size={48} />
          <div>
            <span
              style={{
                fontSize: '10.5px',
                fontWeight: 800,
                color: '#E2F800',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                backgroundColor: 'rgba(226, 248, 0, 0.1)',
                padding: '3px 8px',
                borderRadius: '6px',
                border: '1px solid rgba(226, 248, 0, 0.35)',
                display: 'inline-block',
                marginBottom: '4px',
              }}
            >
              4. Punto de equilibrio multiproducto
            </span>
            <h2 className="heading-tight" style={{ fontSize: '18px', fontWeight: 800, color: '#F8FAFC', margin: 0 }}>
              Rentabilidad por producto y volumen de venta
            </h2>
            <p style={{ fontSize: '12.5px', color: '#94A3B8', margin: '3px 0 0 0' }}>
              Ajusta la participación de cada producto para identificar los que sostienen tu negocio y los que reducen tu margen.
            </p>
          </div>
        </div>

        {/* Resumen Ponderado Multi-Producto */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ padding: '8px 14px', borderRadius: '10px', backgroundColor: '#111827', border: '1px solid #1E293B' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#94A3B8', display: 'block', textTransform: 'uppercase' }}>
              Margen Ponderado Mix
            </span>
            <span className="tabular-nums" style={{ fontSize: '15px', fontWeight: 800, color: '#E2F800' }}>
              {formatCLP(ingenieria.margenPonderado)} / venta
            </span>
          </div>

          <div style={{ padding: '8px 14px', borderRadius: '10px', backgroundColor: '#111827', border: '1px solid #1E293B' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#10B981', display: 'block', textTransform: 'uppercase' }}>
              Equilibrio + Tu Sueldo (Mix)
            </span>
            <span className="tabular-nums" style={{ fontSize: '15px', fontWeight: 900, color: '#F8FAFC' }}>
              {ingenieria.peMultiproductoConSueldoUnidades.toLocaleString('es-CL')} un. ({formatCLP(ingenieria.facturacionEquilibrioConSueldo)})
            </span>
          </div>
        </div>
      </div>

      {/* Mix de Ventas Visual con Deslizadores Interactivos */}
      <div
        style={{
          backgroundColor: '#0B0F17',
          borderRadius: '12px',
          border: '1px solid #1E293B',
          padding: '18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#E2F800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Mix de Ventas Visual y Cuota de Equilibrio por Producto
          </span>
          <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>
            Haz clic en cualquier producto para abrirlo en el Costeo de Ingredientes
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
          {ingenieria.productosClasificados.map((prod) => {
            const esActivo = recetaEnOlla?.id === prod.id;
            return (
              <div
                key={prod.id}
                style={{
                  backgroundColor: esActivo ? '#131A29' : '#111827',
                  borderRadius: '10px',
                  border: esActivo ? '2px solid #E2F800' : '1px solid #1E293B',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  boxShadow: esActivo ? '0 0 15px rgba(226, 248, 0, 0.2)' : '0 2px 6px rgba(0, 0, 0, 0.3)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                  <div
                    onClick={() => {
                      cargarRecetaEnOlla(prod);
                      if (onEditarProductoEnOllita) onEditarProductoEnOllita(prod);
                    }}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', minWidth: 0 }}
                  >
                    <InsumoFigura3D
                      nombre={prod.ingredientes?.[0]?.nombre || prod.nombre}
                      tamaño={34}
                      rubro={perfil}
                      tipologia={prod.ingredientes?.[0]?.tipologia}
                    />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: esActivo ? '#E2F800' : '#F8FAFC', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {prod.nombre}
                      </div>
                      <div className="tabular-nums" style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>
                        Precio: {formatCLP(prod.precioVenta)} • Ganancia: <strong style={{ color: '#10B981' }}>{formatCLP(prod.margenUnitario)}</strong>
                      </div>
                    </div>
                  </div>

                  <span
                    className="tabular-nums"
                    style={{
                      fontSize: '12px',
                      fontWeight: 900,
                      color: '#E2F800',
                      backgroundColor: 'rgba(226, 248, 0, 0.1)',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      border: '1px solid rgba(226, 248, 0, 0.3)',
                    }}
                  >
                    {prod.mixNormalizado}%
                  </span>
                </div>

                <input
                  type="range"
                  className="slider-ingenieria"
                  min="5"
                  max="80"
                  step="5"
                  value={prod.mixPeso}
                  onChange={(e) => actualizarMixReceta(prod.id, Number(e.target.value))}
                />

                <div className="tabular-nums" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>
                  <span>Para empatar (PE): <strong style={{ color: '#F8FAFC' }}>{prod.unidadesEquilibrioBase} un.</strong></span>
                  <span>Con tu Sueldo: <strong style={{ color: '#E2F800' }}>{prod.unidadesEquilibrioConSueldo} un./mes</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Matriz de Rentabilidad Automática en 4 Cuadrantes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '14px' }}>
        {cuadrantesMeta.map((cuad) => {
          const itemsCuadrante = ingenieria.productosClasificados.filter((p) => p.cuadrante.id === cuad.id);
          return (
            <div
              key={cuad.id}
              style={{
                borderRadius: '14px',
                border: `1px solid ${cuad.borde}`,
                backgroundColor: cuad.bg,
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '14px',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <Icono3DMargen size={38} />
                  <div>
                    <span style={{ fontSize: '10px', fontWeight: 800, color: cuad.color, textTransform: 'uppercase', display: 'block' }}>
                      {cuad.subtitulo}
                    </span>
                    <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#F8FAFC', margin: 0 }}>
                      {cuad.titulo}
                    </h3>
                  </div>
                </div>

                <p style={{ fontSize: '12px', color: '#94A3B8', margin: '0 0 12px 0', fontWeight: 500, lineHeight: 1.45 }}>
                  "{cuad.consejo}"
                </p>

                {itemsCuadrante.length === 0 ? (
                  <div
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(0, 0, 0, 0.25)',
                      border: '1px dashed rgba(255, 255, 255, 0.1)',
                      fontSize: '11.5px',
                      color: '#64748B',
                      textAlign: 'center',
                    }}
                  >
                    Ningún producto en este cuadrante actualmente.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {itemsCuadrante.map((item) => (
                      <div
                        key={item.id}
                        style={{
                          backgroundColor: '#111827',
                          borderRadius: '10px',
                          border: '1px solid #1E293B',
                          padding: '10px 12px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px',
                          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 800, color: '#F8FAFC' }}>{item.nombre}</span>
                          <span className="tabular-nums" style={{ fontSize: '11px', fontWeight: 800, color: cuad.color }}>
                            Mix {item.mixNormalizado}%
                          </span>
                        </div>

                        <div className="tabular-nums" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94A3B8' }}>
                          <span>Venta: {formatCLP(item.precioVenta)}</span>
                          <span>Ganancia: <strong style={{ color: '#10B981' }}>{formatCLP(item.margenUnitario)} ({item.margenPorcentaje}%)</strong></span>
                        </div>

                        <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                          <button
                            type="button"
                            onClick={() => ajustarPrecioRecetaPorId(item.id, Math.round(item.precioVenta * 1.05))}
                            style={{
                              fontSize: '10px',
                              padding: '3px 8px',
                              borderRadius: '4px',
                              backgroundColor: '#1E293B',
                              color: '#E2F800',
                              border: '1px solid rgba(226, 248, 0, 0.3)',
                              cursor: 'pointer',
                              fontWeight: 700,
                            }}
                          >
                            +5% Precio
                          </button>
                          {cuad.id === 'vampiro' && (
                            <button
                              type="button"
                              onClick={() => eliminarRecetaPorId(item.id)}
                              style={{
                                fontSize: '10px',
                                padding: '3px 8px',
                                borderRadius: '4px',
                                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                                color: '#EF4444',
                                border: '1px solid rgba(239, 68, 68, 0.4)',
                                cursor: 'pointer',
                                fontWeight: 700,
                              }}
                            >
                              Eliminar del Menú
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
