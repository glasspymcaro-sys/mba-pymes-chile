import React from 'react';
import { useAppState } from '../../store/appState.jsx';
import ImagenJson3D from '../svg3d/ImagenJson3D.jsx';
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
      color: '#D97706',
      bg: '#FFFBEB',
      borde: '#FCD34D',
    },
    {
      id: 'gancho',
      titulo: 'Tus Ganchos',
      subtitulo: 'Bajo margen • Se vende mucho',
      iconoId: 'gancho_comercial',
      consejo: 'Súbeles el precio un 5% o úsalos para vender un complemento caro.',
      color: '#2563EB',
      bg: '#EFF6FF',
      borde: '#93C5FD',
    },
    {
      id: 'joya_oculta',
      titulo: 'Tus Joyas Ocultas',
      subtitulo: 'Alto margen • Se vende poco',
      iconoId: 'joya_oculta',
      consejo: 'Dales más visibilidad, te dejan mucha plata cada vez que salen.',
      color: '#059669',
      bg: '#ECFDF5',
      borde: '#6EE7B7',
    },
    {
      id: 'vampiro',
      titulo: 'Tus Vampiros',
      subtitulo: 'Bajo margen • Se vende poco',
      iconoId: 'vampiro_catalogo',
      consejo: 'Elimínalos del catálogo o sube su margen; solo te quitan tiempo e inventario.',
      color: '#DC2626',
      bg: '#FEF2F2',
      borde: '#FCA5A5',
    },
  ];

  return (
    <div id="seccion-matriz" className="card-ejecutiva" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Cabecera de Punto de Equilibrio Multi-Producto */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ImagenJson3D idIcono="mina_oro" tamaño={54} />
          <div>
            <span
              style={{
                fontSize: '10.5px',
                fontWeight: 800,
                color: '#B45309',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                backgroundColor: '#FFFBEB',
                padding: '3px 8px',
                borderRadius: '6px',
                border: '1px solid #FCD34D',
                display: 'inline-block',
                marginBottom: '4px',
              }}
            >
              4. Punto de Equilibrio Multi-Producto • Ingeniería de Menú & Catálogo
            </span>
            <h2 className="heading-tight" style={{ fontSize: '17px', fontWeight: 800, color: '#09090B', margin: 0 }}>
              Mix de Ventas Ponderado & Matriz de Rentabilidad (Estrellas vs. Clavos)
            </h2>
            <p style={{ fontSize: '12.5px', color: '#475569', margin: '2px 0 0 0' }}>
              Mueve las barras para ajustar qué porcentaje de tus ventas representa cada producto y descubre tus Minas de Oro y Vampiros.
            </p>
          </div>
        </div>

        {/* Resumen Ponderado Multi-Producto */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ padding: '8px 14px', borderRadius: '10px', backgroundColor: '#F8FAFC', border: '1.5px solid #CBD5E1' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#64748B', display: 'block', textTransform: 'uppercase' }}>
              Margen Ponderado Mix
            </span>
            <span className="tabular-nums" style={{ fontSize: '15px', fontWeight: 800, color: '#0F766E' }}>
              {formatCLP(ingenieria.margenPonderado)} / venta
            </span>
          </div>

          <div style={{ padding: '8px 14px', borderRadius: '10px', backgroundColor: '#F0FDFA', border: '1.5px solid #5EEAD4' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#0F766E', display: 'block', textTransform: 'uppercase' }}>
              Equilibrio + Tu Sueldo (Mix)
            </span>
            <span className="tabular-nums" style={{ fontSize: '15px', fontWeight: 900, color: '#09090B' }}>
              {ingenieria.peMultiproductoConSueldoUnidades.toLocaleString('es-CL')} un. ({formatCLP(ingenieria.facturacionEquilibrioConSueldo)})
            </span>
          </div>
        </div>
      </div>

      {/* Mix de Ventas Visual con Deslizadores Interactivos */}
      <div
        style={{
          backgroundColor: '#F8FAFC',
          borderRadius: '12px',
          border: '1.5px solid #CBD5E1',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Mix de Ventas Visual y Cuota de Equilibrio por Producto
          </span>
          <span style={{ fontSize: '11px', color: '#475569', fontWeight: 600 }}>
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
                  backgroundColor: '#FFFFFF',
                  borderRadius: '10px',
                  border: esActivo ? '2px solid #0F766E' : '1.5px solid #CBD5E1',
                  padding: '12px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  boxShadow: '0 2px 6px rgba(15, 23, 42, 0.04)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                  <div
                    onClick={() => {
                      cargarRecetaEnOlla(prod);
                      if (onEditarProductoEnOllita) onEditarProductoEnOllita(prod);
                    }}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', minWidth: 0 }}
                  >
                    <InsumoFigura3D
                      nombre={prod.ingredientes?.[0]?.nombre || prod.nombre}
                      tamaño={32}
                      rubro={perfil}
                      tipologia={prod.ingredientes?.[0]?.tipologia}
                    />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#09090B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {prod.nombre}
                      </div>
                      <div className="tabular-nums" style={{ fontSize: '11px', color: '#475569', fontWeight: 600 }}>
                        Precio: {formatCLP(prod.precioVenta)} • Libre: <strong style={{ color: '#059669' }}>{formatCLP(prod.margenUnitario)}</strong>
                      </div>
                    </div>
                  </div>

                  <span
                    className="tabular-nums"
                    style={{
                      fontSize: '12px',
                      fontWeight: 900,
                      color: '#0F766E',
                      backgroundColor: '#F0FDFA',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      border: '1px solid #99F6E4',
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

                <div className="tabular-nums" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#475569', fontWeight: 600 }}>
                  <span>Para empatar (PE): <strong>{prod.unidadesEquilibrioBase} un.</strong></span>
                  <span>Con tu Sueldo: <strong style={{ color: '#0F766E' }}>{prod.unidadesEquilibrioConSueldo} un./mes</strong></span>
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
                border: `1.5px solid ${cuad.borde}`,
                backgroundColor: cuad.bg,
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '12px',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <ImagenJson3D idIcono={cuad.iconoId} tamaño={44} />
                  <div>
                    <span style={{ fontSize: '10px', fontWeight: 800, color: cuad.color, textTransform: 'uppercase', display: 'block' }}>
                      {cuad.subtitulo}
                    </span>
                    <h3 style={{ fontSize: '15.5px', fontWeight: 900, color: '#09090B', margin: 0 }}>
                      {cuad.titulo}
                    </h3>
                  </div>
                </div>

                <p style={{ fontSize: '12px', color: '#334155', margin: '0 0 10px 0', fontWeight: 600, lineHeight: 1.4 }}>
                  "{cuad.consejo}"
                </p>

                {itemsCuadrante.length === 0 ? (
                  <div
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255,255,255,0.65)',
                      border: '1px dashed rgba(0,0,0,0.12)',
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
                          backgroundColor: '#FFFFFF',
                          borderRadius: '10px',
                          border: '1px solid rgba(0,0,0,0.1)',
                          padding: '9px 11px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#09090B' }}>{item.nombre}</span>
                          <span className="tabular-nums" style={{ fontSize: '11px', fontWeight: 800, color: cuad.color }}>
                            Mix {item.mixNormalizado}%
                          </span>
                        </div>

                        <div className="tabular-nums" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#475569' }}>
                          <span>Venta: {formatCLP(item.precioVenta)}</span>
                          <span>Ganancia/u: <strong>{formatCLP(item.margenUnitario)} ({item.margenPorcentaje}%)</strong></span>
                        </div>

                        {/* Botones Bacanes de Acción Directa según Cuadrante */}
                        <div style={{ display: 'flex', gap: '6px', marginTop: '2px' }}>
                          {cuad.id === 'gancho' && (
                            <button
                              type="button"
                              onClick={() => ajustarPrecioRecetaPorId(item.id, 1.05)}
                              className="btn-bacan-primary"
                              style={{ height: '26px', padding: '0 8px', fontSize: '10.5px', flex: 1 }}
                            >
                              Subir Precio +5%
                            </button>
                          )}
                          {cuad.id === 'joya_oculta' && (
                            <button
                              type="button"
                              onClick={() => actualizarMixReceta(item.id, item.mixPeso + 15)}
                              className="btn-bacan-primary"
                              style={{ height: '26px', padding: '0 8px', fontSize: '10.5px', flex: 1 }}
                            >
                              Impulsar Ventas (+Mix)
                            </button>
                          )}
                          {cuad.id === 'vampiro' && (
                            <>
                              <button
                                type="button"
                                onClick={() => ajustarPrecioRecetaPorId(item.id, 1.12)}
                                className="btn-bacan-secondary"
                                style={{ height: '26px', padding: '0 8px', fontSize: '10.5px', flex: 1 }}
                              >
                                Subir +12%
                              </button>
                              {recetas.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => eliminarRecetaPorId(item.id)}
                                  className="btn-bacan-secondary"
                                  style={{ height: '26px', padding: '0 8px', fontSize: '10.5px', color: '#DC2626', borderColor: '#FCA5A5' }}
                                >
                                  Eliminar
                                </button>
                              )}
                            </>
                          )}
                          <button
                            type="button"
                            onClick={() => cargarRecetaEnOlla(item)}
                            className="btn-bacan-secondary"
                            style={{ height: '26px', padding: '0 8px', fontSize: '10.5px' }}
                          >
                            Ver Detalles
                          </button>
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
