import React, { useState, useMemo, useRef } from 'react';
import { useAppState } from '../../store/appState.jsx';
import ProductoRecetaFigura3D from '../svg3d/ProductoRecetaFigura3D.jsx';
import InsumoFigura3D from '../svg3d/InsumoFigura3D.jsx';
import TechnicalEmptyStateSVG from '../svg3d/TechnicalEmptyStateSVG.jsx';
import { formatCLP } from '../../utils/formatters.js';
import { comprimirImagen } from '../../utils/imageUtils.js';

/**
 * Centro de Historial & Catálogo de Productos e Insumos
 * Permite visualizar, buscar, auditar y gestionar el historial completo de recetas y materias primas.
 * Lenguaje simple, directo y ejecutivo sin jerga técnica.
 */
export default function CentroHistorialCatalogo({ onCargarProductoEnGenerador, onIrAGenerador }) {
  const {
    perfil,
    recetas,
    insumos,
    recetaEnOlla,
    cargarRecetaEnOlla,
    eliminarRecetaPorId,
    ajustarPrecioRecetaPorId,
    setImagenRecetaEnOlla,
    editarInsumo,
    eliminarInsumo,
  } = useAppState();

  const [tabActiva, setTabActiva] = useState('productos'); // 'productos' | 'insumos' | 'rentabilidad'
  const [busqueda, setBusqueda] = useState('');
  const [rubroFiltro, setRubroFiltro] = useState('todos');

  // Modal para subir foto a un producto específico del historial
  const [productoSeleccionadoParaFoto, setProductoSeleccionadoParaFoto] = useState(null);
  const fileInputProductoRef = useRef(null);

  // Modal para subir foto a un insumo específico del historial
  const [insumoSeleccionadoParaFoto, setInsumoSeleccionadoParaFoto] = useState(null);
  const fileInputInsumoRef = useRef(null);

  // Filtro de productos
  const productosFiltrados = useMemo(() => {
    return recetas.filter((r) => {
      const coincideTexto = (r.nombre || '').toLowerCase().includes(busqueda.toLowerCase());
      const coincideRubro = rubroFiltro === 'todos' || r.rubro === rubroFiltro;
      return coincideTexto && coincideRubro;
    });
  }, [recetas, busqueda, rubroFiltro]);

  // Filtro de insumos
  const insumosFiltrados = useMemo(() => {
    return insumos.filter((ins) => {
      return (ins.nombre || '').toLowerCase().includes(busqueda.toLowerCase());
    });
  }, [insumos, busqueda]);

  // Manejo de carga de foto para producto
  const handleSubirFotoProducto = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !productoSeleccionadoParaFoto) return;
    try {
      const dataUrl = await comprimirImagen(file, 600, 600, 0.85);
      if (dataUrl) {
        if (recetaEnOlla?.id === productoSeleccionadoParaFoto.id) {
          setImagenRecetaEnOlla(dataUrl);
        } else {
          cargarRecetaEnOlla({ ...productoSeleccionadoParaFoto, imagenPersonalizada: dataUrl });
          setImagenRecetaEnOlla(dataUrl);
        }
      }
    } catch (err) {
      console.warn('Error comprimiendo foto de producto:', err);
    } finally {
      setProductoSeleccionadoParaFoto(null);
    }
  };

  // Manejo de carga de foto para insumo
  const handleSubirFotoInsumo = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !insumoSeleccionadoParaFoto) return;
    try {
      const dataUrl = await comprimirImagen(file, 500, 500, 0.85);
      if (dataUrl) {
        editarInsumo({ ...insumoSeleccionadoParaFoto, imagenPersonalizada: dataUrl });
      }
    } catch (err) {
      console.warn('Error comprimiendo foto de insumo:', err);
    } finally {
      setInsumoSeleccionadoParaFoto(null);
    }
  };

  // Métricas agregadas del catálogo
  const metricasCatalogo = useMemo(() => {
    const totalProductos = recetas.length;
    const totalInsumos = insumos.length;
    const precioPromedio = totalProductos > 0 ? Math.round(recetas.reduce((acc, r) => acc + Number(r.precioVenta || 0), 0) / totalProductos) : 0;
    const costoPromedio = totalProductos > 0 ? Math.round(recetas.reduce((acc, r) => acc + Number(r.costoTotal || 0), 0) / totalProductos) : 0;
    const margenPromedio = Math.max(0, precioPromedio - costoPromedio);
    const margenPorcentaje = precioPromedio > 0 ? Math.round((margenPromedio / precioPromedio) * 100) : 0;

    let productoEstrella = recetas[0] || null;
    let mayorMargen = 0;
    recetas.forEach((r) => {
      const m = Number(r.precioVenta || 0) - Number(r.costoTotal || 0);
      if (m > mayorMargen) {
        mayorMargen = m;
        productoEstrella = r;
      }
    });

    return { totalProductos, totalInsumos, precioPromedio, costoPromedio, margenPromedio, margenPorcentaje, productoEstrella };
  }, [recetas, insumos]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* 1. Encabezado Principal del Centro de Historial */}
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          borderRadius: '12px',
          border: '1px solid var(--color-border)',
          padding: '22px 24px',
          boxShadow: 'var(--shadow-card)',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Registro y catálogo
            </span>
            <h2 className="heading-tight" style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-foreground)', margin: '2px 0 0 0' }}>
              Historial y catálogo de productos
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--color-muted-foreground)', margin: '2px 0 0 0' }}>
              Consulta y administra los productos, insumos y recetas de tu negocio.
            </p>
          </div>

          {/* Botón de acceso rápido al generador */}
          <button
            type="button"
            onClick={onIrAGenerador}
            className="btn-bacan-primary"
            style={{
              height: '36px',
              padding: '0 16px',
              fontSize: '12.5px',
              borderRadius: '7px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Crear Nuevo Producto
          </button>
        </div>

        {/* Barra de Filtros, Buscador y Pestañas */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '14px' }}>
          {/* Pestañas de Navegación */}
          <div
            style={{
              display: 'inline-flex',
              gap: '3px',
              padding: '3px',
              borderRadius: '8px',
              backgroundColor: '#F1F5F9',
              border: '1px solid var(--color-border)',
            }}
          >
            <button
              type="button"
              onClick={() => setTabActiva('productos')}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: tabActiva === 'productos' ? 600 : 500,
                backgroundColor: tabActiva === 'productos' ? '#1E293B' : 'transparent',
                color: tabActiva === 'productos' ? 'var(--color-foreground)' : 'var(--color-muted-foreground)',
                border: 'none',
                cursor: 'pointer',
                boxShadow: tabActiva === 'productos' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              Productos & Recetas ({recetas.length})
            </button>

            <button
              type="button"
              onClick={() => setTabActiva('insumos')}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: tabActiva === 'insumos' ? 600 : 500,
                backgroundColor: tabActiva === 'insumos' ? '#1E293B' : 'transparent',
                color: tabActiva === 'insumos' ? 'var(--color-foreground)' : 'var(--color-muted-foreground)',
                border: 'none',
                cursor: 'pointer',
                boxShadow: tabActiva === 'insumos' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              Materias Primas & Insumos ({insumos.length})
            </button>

            <button
              type="button"
              onClick={() => setTabActiva('rentabilidad')}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: tabActiva === 'rentabilidad' ? 600 : 500,
                backgroundColor: tabActiva === 'rentabilidad' ? '#1E293B' : 'transparent',
                color: tabActiva === 'rentabilidad' ? 'var(--color-foreground)' : 'var(--color-muted-foreground)',
                border: 'none',
                cursor: 'pointer',
                boxShadow: tabActiva === 'rentabilidad' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              Rentabilidad General
            </button>
          </div>

          {/* Buscador Rápido */}
          <div style={{ position: 'relative', minWidth: '240px', flex: '1', maxWidth: '340px' }}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#64748B"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ position: 'absolute', left: '10px', top: '10px' }}
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre..."
              style={{
                width: '100%',
                height: '34px',
                padding: '0 10px 0 32px',
                borderRadius: '6px',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-surface)',
                fontSize: '12.5px',
                outline: 'none',
                color: 'var(--color-foreground)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Input oculto para subir foto de producto */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputProductoRef}
        style={{ display: 'none' }}
        onChange={handleSubirFotoProducto}
      />

      {/* Input oculto para subir foto de insumo */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputInsumoRef}
        style={{ display: 'none' }}
        onChange={handleSubirFotoInsumo}
      />

      {/* 2. TAB A: HISTORIAL DE PRODUCTOS Y RECETAS */}
      {tabActiva === 'productos' && (
        <div>
          {productosFiltrados.length === 0 ? (
            <TechnicalEmptyStateSVG
              tipo="busqueda"
              titulo="No se encontraron productos con ese nombre"
              descripcion="Prueba buscando otro término o crea un nuevo producto usando el generador."
            />
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
                gap: '16px',
              }}
            >
              {productosFiltrados.map((prod) => {
                const precio = Number(prod.precioVenta || 0);
                const costo = Number(prod.costoTotal || 0);
                const ganancia = Math.max(0, precio - costo);
                const margenPct = precio > 0 ? Math.round((ganancia / precio) * 100) : 0;
                const esActivo = recetaEnOlla?.id === prod.id;
                const tieneFoto = Boolean(prod.imagenPersonalizada);

                return (
                  <div
                    key={prod.id}
                    style={{
                      backgroundColor: 'var(--color-surface)',
                      borderRadius: '10px',
                      border: `1.5px solid ${esActivo ? 'var(--color-primary)' : 'var(--color-border)'}`,
                      padding: '16px',
                      boxShadow: esActivo ? '0 4px 16px rgba(15,118,110,0.12)' : 'var(--shadow-card)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      position: 'relative',
                    }}
                  >
                    {/* Badge de Estado: Producto Activo en Generador */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          color: esActivo ? 'var(--color-primary)' : 'var(--color-muted-foreground)',
                          backgroundColor: esActivo ? 'var(--color-brand-50)' : '#F1F5F9',
                          border: `1px solid ${esActivo ? 'var(--color-brand-200)' : '#E2E8F0'}`,
                          padding: '2px 8px',
                          borderRadius: '4px',
                          textTransform: 'uppercase',
                        }}
                      >
                        {esActivo ? 'En Uso Actual' : 'Guardado'}
                      </span>

                      {tieneFoto && (
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: 600,
                            color: '#059669',
                            backgroundColor: '#ECFDF5',
                            border: '1px solid #A7F3D0',
                            padding: '2px 6px',
                            borderRadius: '4px',
                          }}
                        >
                          Foto
                        </span>
                      )}
                    </div>

                    {/* Cabecera con Imagen / Figura y Datos Principales */}
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                      <div
                        style={{
                          width: '74px',
                          height: '74px',
                          borderRadius: '8px',
                          backgroundColor: '#FAFAFA',
                          border: '1px solid var(--color-border)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          overflow: 'hidden',
                        }}
                      >
                        <ProductoRecetaFigura3D
                          nombreProducto={prod.nombre}
                          rubro={prod.rubro || perfil}
                          figuraId={prod.figuraId}
                          imagenPersonalizada={prod.imagenPersonalizada}
                          insumosEnReceta={prod.ingredientes || []}
                          tamaño={68}
                        />
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h4
                          style={{
                            fontSize: '14px',
                            fontWeight: 700,
                            color: 'var(--color-foreground)',
                            margin: '0 0 4px 0',
                            lineHeight: 1.25,
                          }}
                        >
                          {prod.nombre}
                        </h4>
                        <span style={{ fontSize: '11px', color: 'var(--color-muted-foreground)', display: 'block' }}>
                          {prod.ingredientes?.length || 0} ingredientes en la receta
                        </span>
                        <div style={{ marginTop: '4px', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                          <span className="tabular-nums" style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-foreground)' }}>
                            {formatCLP(precio)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Indicadores de Ganancia y Margen */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '8px',
                        padding: '8px 10px',
                        borderRadius: '6px',
                        backgroundColor: 'var(--color-surface-elevated)',
                        border: '1px solid var(--color-border-subtle)',
                      }}
                    >
                      <div>
                        <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--color-muted-foreground)', display: 'block' }}>
                          COSTO DIRECTO
                        </span>
                        <span className="tabular-nums" style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--color-foreground)' }}>
                          {formatCLP(costo)}
                        </span>
                      </div>

                      <div>
                        <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--color-muted-foreground)', display: 'block' }}>
                          GANANCIA LIMPIA
                        </span>
                        <span className="tabular-nums" style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--color-success)' }}>
                          {formatCLP(ganancia)} ({margenPct}%)
                        </span>
                      </div>
                    </div>

                    {/* Botones de Acción */}
                    <div style={{ display: 'flex', gap: '6px', marginTop: 'auto', paddingTop: '6px' }}>
                      <button
                        type="button"
                        onClick={() => {
                          cargarRecetaEnOlla(prod);
                          if (onCargarProductoEnGenerador) onCargarProductoEnGenerador(prod);
                        }}
                        style={{
                          flex: 1,
                          height: '32px',
                          borderRadius: '6px',
                          border: '1px solid var(--color-primary)',
                          backgroundColor: esActivo ? 'var(--color-surface-elevated)' : 'var(--color-surface)',
                          color: 'var(--color-primary)',
                          fontSize: '11.5px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px',
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                        {esActivo ? 'Editando Ahora' : 'Cargar Producto'}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setProductoSeleccionadoParaFoto(prod);
                          fileInputProductoRef.current?.click();
                        }}
                        title="Subir o cambiar foto del producto"
                        style={{
                          height: '32px',
                          padding: '0 10px',
                          borderRadius: '6px',
                          border: '1px solid var(--color-border)',
                          backgroundColor: 'var(--color-surface)',
                          color: 'var(--color-foreground)',
                          fontSize: '11.5px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                        Foto
                      </button>

                      {recetas.length > 1 && (
                        <button
                          type="button"
                          onClick={() => eliminarRecetaPorId(prod.id)}
                          title="Eliminar producto"
                          style={{
                            height: '32px',
                            padding: '0 8px',
                            borderRadius: '6px',
                            border: '1px solid var(--color-border)',
                            backgroundColor: 'var(--color-surface)',
                            color: 'var(--color-danger)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 3. TAB B: HISTORIAL DE INSUMOS Y MATERIAS PRIMAS */}
      {tabActiva === 'insumos' && (
        <div>
          {insumosFiltrados.length === 0 ? (
            <TechnicalEmptyStateSVG
              tipo="busqueda"
              titulo="No hay insumos que coincidan con la búsqueda"
              descripcion="Prueba con otro nombre o agrega un nuevo insumo al catálogo."
            />
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '14px',
              }}
            >
              {insumosFiltrados.map((ins) => {
                const tieneFoto = Boolean(ins.imagenPersonalizada);

                return (
                  <div
                    key={ins.id}
                    style={{
                      backgroundColor: 'var(--color-surface)',
                      borderRadius: '10px',
                      border: '1px solid var(--color-border)',
                      padding: '14px',
                      boxShadow: 'var(--shadow-card)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '52px',
                          height: '52px',
                          borderRadius: '8px',
                          backgroundColor: '#FAFAFA',
                          border: '1px solid var(--color-border)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          overflow: 'hidden',
                        }}
                      >
                        <InsumoFigura3D
                          nombre={ins.nombre}
                          tipologia={ins.tipologia}
                          imagenPersonalizada={ins.imagenPersonalizada}
                          tamaño={46}
                          rubro={perfil}
                        />
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-foreground)', margin: '0 0 2px 0' }}>
                          {ins.nombre}
                        </h4>
                        <span className="tabular-nums" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-primary)' }}>
                          {formatCLP(ins.costoUnitario)}
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--color-muted-foreground)' }}>
                          {' '}/ {ins.unidadMedida || 'un'}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '8px' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setInsumoSeleccionadoParaFoto(ins);
                          fileInputInsumoRef.current?.click();
                        }}
                        style={{
                          height: '28px',
                          padding: '0 8px',
                          borderRadius: '5px',
                          border: '1px solid var(--color-border)',
                          backgroundColor: 'var(--color-surface)',
                          fontSize: '11px',
                          fontWeight: 600,
                          color: 'var(--color-foreground)',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                        {tieneFoto ? 'Cambiar Foto' : 'Subir Foto'}
                      </button>

                      <button
                        type="button"
                        onClick={() => eliminarInsumo(ins.id)}
                        title="Eliminar insumo"
                        style={{
                          height: '28px',
                          padding: '0 8px',
                          borderRadius: '5px',
                          border: '1px solid var(--color-border)',
                          backgroundColor: 'var(--color-surface)',
                          color: 'var(--color-danger)',
                          fontSize: '11px',
                          cursor: 'pointer',
                        }}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 4. TAB C: RESUMEN DE RENTABILIDAD DEL CATÁLOGO */}
      {tabActiva === 'rentabilidad' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '14px',
            }}
          >
            <div style={{ backgroundColor: 'var(--color-surface)', padding: '16px', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-muted-foreground)', display: 'block' }}>
                TOTAL DE PRODUCTOS
              </span>
              <span className="tabular-nums" style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-foreground)' }}>
                {metricasCatalogo.totalProductos}
              </span>
            </div>

            <div style={{ backgroundColor: 'var(--color-surface)', padding: '16px', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-muted-foreground)', display: 'block' }}>
                MATERIAS PRIMAS REGISTRADAS
              </span>
              <span className="tabular-nums" style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-foreground)' }}>
                {metricasCatalogo.totalInsumos}
              </span>
            </div>

            <div style={{ backgroundColor: 'var(--color-surface)', padding: '16px', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-muted-foreground)', display: 'block' }}>
                PRECIO PROMEDIO
              </span>
              <span className="tabular-nums" style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-foreground)' }}>
                {formatCLP(metricasCatalogo.precioPromedio)}
              </span>
            </div>

            <div style={{ backgroundColor: 'var(--color-surface)', padding: '16px', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-muted-foreground)', display: 'block' }}>
                MARGEN PROMEDIO DEL CATÁLOGO
              </span>
              <span className="tabular-nums" style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-success)' }}>
                {metricasCatalogo.margenPorcentaje}%
              </span>
            </div>
          </div>

          {metricasCatalogo.productoEstrella && (
            <div
              style={{
                backgroundColor: 'var(--color-surface)',
                borderRadius: '10px',
                border: '1.5px solid var(--color-brand-200)',
                padding: '18px 20px',
                boxShadow: 'var(--shadow-card)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '14px',
              }}
            >
              <div>
                <span style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Producto con Mayor Margen de Ganancia
                </span>
                <h3 className="heading-tight" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-foreground)', margin: '2px 0 0 0' }}>
                  {metricasCatalogo.productoEstrella.nombre}
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--color-muted-foreground)', margin: '2px 0 0 0' }}>
                  Precio de venta: {formatCLP(metricasCatalogo.productoEstrella.precioVenta)} • Costo de producción: {formatCLP(metricasCatalogo.productoEstrella.costoTotal)}
                </p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '10.5px', color: 'var(--color-muted-foreground)', display: 'block' }}>
                  Ganancia neta por unidad
                </span>
                <span className="tabular-nums" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-success)' }}>
                  +{formatCLP(Number(metricasCatalogo.productoEstrella.precioVenta || 0) - Number(metricasCatalogo.productoEstrella.costoTotal || 0))}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
