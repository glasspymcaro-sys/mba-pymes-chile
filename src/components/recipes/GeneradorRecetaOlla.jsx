import React, { useState, useRef } from 'react';
import { useAppState } from '../../store/appState.jsx';
import ProductoRecetaFigura3D from '../svg3d/ProductoRecetaFigura3D.jsx';
import InsumoFigura3D from '../svg3d/InsumoFigura3D.jsx';
import TechnicalEmptyStateSVG from '../svg3d/TechnicalEmptyStateSVG.jsx';
import { FIGURAS_PRODUCTOS_RECETAS_JSON } from '../../lib/bibliotecaInsumos3D.js';
import { formatCLP } from '../../utils/formatters.js';
import { comprimirImagen } from '../../utils/imageUtils.js';

export default function GeneradorRecetaOlla({
  onDropEnStand,
  onDragOverStand,
  onDragLeaveStand,
  zonaHover,
}) {
  const {
    perfil,
    recetaEnOlla,
    recetas,
    costoVariableConsolidado,
    setNombreRecetaEnOlla,
    setPrecioRecetaEnOlla,
    setImagenRecetaEnOlla,
    setFiguraProductoIdEnOlla,
    cambiarCantidadIngrediente,
    eliminarIngredienteDeOlla,
    guardarRecetaActiva,
    cargarRecetaEnOlla,
    vaciarOlla,
  } = useAppState();

  const fileInputRef = useRef(null);
  const [mensajeGuardado, setMensajeGuardado] = useState(false);

  const ingredientes = recetaEnOlla?.ingredientes || [];
  const precioVenta = Number(recetaEnOlla?.precioVenta || 0);
  const costoTotal = Number(costoVariableConsolidado || 0);
  const margenContribucion = Math.max(0, precioVenta - costoTotal);
  const margenPorcentaje = precioVenta > 0 ? Math.round((margenContribucion / precioVenta) * 100) : 0;

  const handleGuardar = () => {
    guardarRecetaActiva();
    setMensajeGuardado(true);
    setTimeout(() => setMensajeGuardado(false), 2500);
  };

  const handleCambioFoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await comprimirImagen(file, 600, 600, 0.85);
      if (dataUrl) {
        setImagenRecetaEnOlla(dataUrl);
      }
    } catch (err) {
      console.warn('Error al procesar foto:', err);
    }
  };

  const tituloSeccion =
    perfil === 'restaurant'
      ? 'Generador de Recetas & Armador de Platos'
      : perfil === 'minimarket'
      ? 'Armador de Packs & Catálogo Comercial'
      : 'Estructurador de Proyectos & Servicios';

  const subtituloSeccion =
    perfil === 'restaurant'
      ? 'Agrega y dosifica los ingredientes para crear el plato (ej: Pan + Carne + Tomate + Queso)'
      : perfil === 'minimarket'
      ? 'Agrupa los artículos para determinar el costo de mercadería en exhibición'
      : 'Combina honorarios profesionales y licencias para presupuestar el servicio';

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
        gap: '18px',
      }}
    >
      {/* 1. Encabezado del Generador de Producto */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <span style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Control de Gestión • Costeo de Ingredientes & Precio
          </span>
          <h2 className="heading-tight" style={{ fontSize: '17px', fontWeight: 600, color: 'var(--color-foreground)', margin: '2px 0 0 0' }}>
            {tituloSeccion}
          </h2>
          <p style={{ fontSize: '12.5px', color: 'var(--color-muted-foreground)', margin: '2px 0 0 0' }}>
            {subtituloSeccion}
          </p>
        </div>

        {/* Acciones: Catálogo de recetas existentes y botón nueva receta */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {recetas.length > 0 && (
            <select
              value={recetaEnOlla?.id || ''}
              onChange={(e) => {
                const encontrada = recetas.find((r) => r.id === e.target.value);
                if (encontrada) cargarRecetaEnOlla(encontrada);
              }}
              style={{
                height: '34px',
                padding: '0 10px',
                borderRadius: '6px',
                border: '1px solid var(--color-border)',
                backgroundColor: '#FFFFFF',
                fontSize: '12.5px',
                fontWeight: 500,
                color: 'var(--color-foreground)',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              <option value="" disabled>
                Cargar producto guardado…
              </option>
              {recetas.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.nombre} ({formatCLP(r.precioVenta)})
                </option>
              ))}
            </select>
          )}

          <button
            onClick={vaciarOlla}
            className="btn-eng-secondary"
            title="Iniciar un nuevo plato o producto desde cero"
            style={{
              height: '34px',
              padding: '0 12px',
              borderRadius: '6px',
              border: '1px solid var(--color-border)',
              backgroundColor: '#FFFFFF',
              color: 'var(--color-foreground)',
              fontSize: '12.5px',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Nuevo Producto
          </button>
        </div>
      </div>

      {/* 2. Campo de Nombre y Precio de Venta del Producto */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '14px',
          padding: '14px 16px',
          borderRadius: '8px',
          backgroundColor: '#FAFAFA',
          border: '1px solid var(--color-border)',
        }}
      >
        <div>
          <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-muted-foreground)', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Nombre del Producto / Plato
          </label>
          <input
            type="text"
            value={recetaEnOlla?.nombre || ''}
            onChange={(e) => setNombreRecetaEnOlla(e.target.value)}
            placeholder="Ej: Hamburguesa Artesanal Clásica"
            style={{
              width: '100%',
              height: '36px',
              padding: '0 12px',
              borderRadius: '6px',
              border: '1px solid var(--color-border)',
              backgroundColor: '#FFFFFF',
              fontSize: '13.5px',
              fontWeight: 600,
              color: 'var(--color-foreground)',
              boxSizing: 'border-box',
              outline: 'none',
            }}
          />
        </div>

        <div>
          <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-muted-foreground)', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Precio de Venta al Público ($ CLP)
          </label>
          <input
            type="number"
            className="tabular-nums"
            value={precioVenta || ''}
            onChange={(e) => setPrecioRecetaEnOlla(e.target.value)}
            placeholder="Ej: 8900"
            min="100"
            style={{
              width: '100%',
              height: '36px',
              padding: '0 12px',
              borderRadius: '6px',
              border: '1px solid var(--color-border)',
              backgroundColor: '#FFFFFF',
              fontSize: '13.5px',
              fontWeight: 600,
              color: 'var(--color-foreground)',
              boxSizing: 'border-box',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* 3. Escenario de Armado Bento 5 / 7: Stand 3D + Lista de Ingredientes en la Receta */}
      <div className="bento-grid-12" style={{ alignItems: 'start' }}>
        {/* Lado A (5 col): Stand 3D Interactivo con Soporte Vectorial JSON y Carga de Fotos */}
        <div
          className="bento-col-5"
          onDragOver={onDragOverStand}
          onDragLeave={onDragLeaveStand}
          onDrop={onDropEnStand}
          style={{
            border: `1.5px dashed ${zonaHover === 'stand' ? 'var(--color-primary)' : 'var(--color-border-subtle)'}`,
            backgroundColor: zonaHover === 'stand' ? 'var(--color-brand-50)' : '#FAFAFA',
            borderRadius: '10px',
            padding: '18px 14px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            textAlign: 'center',
            transition: 'all 0.2s ease',
            minHeight: '270px',
            boxShadow: zonaHover === 'stand' ? '0 0 0 3px rgba(15,118,110,0.12)' : 'none',
          }}
        >
          <ProductoRecetaFigura3D
            nombreProducto={recetaEnOlla?.nombre}
            rubro={perfil}
            figuraId={recetaEnOlla?.figuraId}
            imagenPersonalizada={recetaEnOlla?.imagenPersonalizada}
            insumosEnReceta={ingredientes}
            tamaño={136}
            animando={zonaHover === 'stand'}
          />

          <div style={{ width: '100%', marginTop: '2px' }}>
            <span className="tabular-nums" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-foreground)', display: 'block' }}>
              {ingredientes.length} {ingredientes.length === 1 ? 'insumo integrado' : 'insumos integrados'}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--color-muted-foreground)', display: 'block', marginBottom: '8px' }}>
              Arrastra insumos del catálogo o sube una foto de tu producto
            </span>

            {/* Controles: Selector de Ilustración & Botón de Subida de Foto */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <select
                  value={recetaEnOlla?.figuraId || ''}
                  onChange={(e) => setFiguraProductoIdEnOlla(e.target.value)}
                  style={{
                    flex: 1,
                    height: '30px',
                    padding: '0 8px',
                    borderRadius: '5px',
                    border: '1px solid var(--color-border)',
                    backgroundColor: '#FFFFFF',
                    fontSize: '11px',
                    fontWeight: 500,
                    color: 'var(--color-foreground)',
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                  title="Seleccionar ilustración representativa para el producto"
                >
                  <option value="">Auto-detectar ilustración según nombre...</option>
                  {Object.values(FIGURAS_PRODUCTOS_RECETAS_JSON).map((fig) => (
                    <option key={fig.id} value={fig.id}>
                      {fig.nombre} ({fig.categoria})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleCambioFoto}
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    height: '28px',
                    padding: '0 10px',
                    borderRadius: '5px',
                    border: '1px solid var(--color-border)',
                    backgroundColor: recetaEnOlla?.imagenPersonalizada ? 'var(--color-brand-50)' : '#FFFFFF',
                    color: recetaEnOlla?.imagenPersonalizada ? 'var(--color-primary)' : 'var(--color-foreground)',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  {recetaEnOlla?.imagenPersonalizada ? 'Cambiar Foto' : 'Subir Foto de Producto'}
                </button>

                {recetaEnOlla?.imagenPersonalizada && (
                  <button
                    type="button"
                    onClick={() => setImagenRecetaEnOlla(null)}
                    style={{
                      height: '28px',
                      padding: '0 8px',
                      borderRadius: '5px',
                      border: '1px solid var(--color-border)',
                      backgroundColor: '#FFFFFF',
                      color: 'var(--color-danger)',
                      fontSize: '11px',
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                    title="Volver a ilustración prediseñada"
                  >
                    Quitar Foto
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Lado B (7 col): Desglose Detallado de Ingredientes de la Receta */}
        <div
          className="bento-col-7"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Ingredientes en la receta
            </span>
            <span className="tabular-nums" style={{ fontSize: '12px', color: 'var(--color-primary)', fontWeight: 600 }}>
              Costo Unitario: {formatCLP(costoTotal)}
            </span>
          </div>

          {ingredientes.length === 0 ? (
            <TechnicalEmptyStateSVG
              tipo="receta"
              titulo="Receta sin ingredientes todavía"
              descripcion="Arrastra materias primas desde el catálogo inferior (ej: pan, carne, tomate) para calcular el costo directo en tiempo real."
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
              {ingredientes.map((item) => {
                const cant = Number(item.cantidad || 1);
                const subtotal = Math.round(Number(item.costoUnitario || 0) * cant);

                return (
                  <div
                    key={item.idAsignado || item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                      gap: '10px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
                      <div style={{ flexShrink: 0, width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <InsumoFigura3D nombre={item.nombre} tamaño={32} imagenFalUrl={item.imagenFalUrl} rubro={perfil} tipologia={item.tipologia} />
                      </div>

                      <div style={{ minWidth: 0 }}>
                        <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-foreground)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.nombre}
                        </h4>
                        <span className="tabular-nums" style={{ fontSize: '11px', color: 'var(--color-muted-foreground)' }}>
                          {formatCLP(item.costoUnitario)} / {item.unidadMedida || 'un'}
                        </span>
                      </div>
                    </div>

                    {/* Selector de Dosificación / Cantidad */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        onClick={() => cambiarCantidadIngrediente(item.idAsignado || item.id, cant - 0.5)}
                        title="Disminuir porción"
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '5px',
                          border: '1px solid var(--color-border)',
                          backgroundColor: '#FFFFFF',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '13px',
                          fontWeight: 600,
                          color: 'var(--color-foreground)',
                        }}
                      >
                        -
                      </button>

                      <span className="tabular-nums" style={{ fontSize: '12px', fontWeight: 600, minWidth: '32px', textAlign: 'center' }}>
                        {cant}
                      </span>

                      <button
                        onClick={() => cambiarCantidadIngrediente(item.idAsignado || item.id, cant + 0.5)}
                        title="Aumentar porción"
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '5px',
                          border: '1px solid var(--color-border)',
                          backgroundColor: '#FFFFFF',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '13px',
                          fontWeight: 600,
                          color: 'var(--color-foreground)',
                        }}
                      >
                        +
                      </button>
                    </div>

                    {/* Subtotal del Insumo en la Receta */}
                    <div className="tabular-nums" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-foreground)', minWidth: '64px', textAlign: 'right' }}>
                      {formatCLP(subtotal)}
                    </div>

                    {/* Botón Quitar de la Receta */}
                    <button
                      onClick={() => eliminarIngredienteDeOlla(item.idAsignado || item.id)}
                      title="Quitar este insumo de la receta"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-danger)',
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 4. Resumen Ejecutivo de Rentabilidad y Aplicación al Punto de Equilibrio */}
      <div
        style={{
          borderTop: '1px solid var(--color-border)',
          paddingTop: '14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
        }}
      >
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <span style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--color-muted-foreground)', display: 'block', letterSpacing: '0.04em' }}>
              COSTO DIRECTO TOTAL (CV)
            </span>
            <span className="tabular-nums" style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-foreground)' }}>
              {formatCLP(costoTotal)}
            </span>
          </div>

          <div style={{ height: '24px', width: '1px', backgroundColor: 'var(--color-border)' }} />

          <div>
            <span style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--color-muted-foreground)', display: 'block', letterSpacing: '0.04em' }}>
              PRECIO DE VENTA (P)
            </span>
            <span className="tabular-nums" style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-foreground)' }}>
              {formatCLP(precioVenta)}
            </span>
          </div>

          <div style={{ height: '24px', width: '1px', backgroundColor: 'var(--color-border)' }} />

          <div>
            <span style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--color-muted-foreground)', display: 'block', letterSpacing: '0.04em' }}>
              MARGEN CONTRIBUCIÓN (P - CV)
            </span>
            <span className="tabular-nums" style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-success)' }}>
              {formatCLP(margenContribucion)} <span style={{ fontSize: '12px', fontWeight: 600 }}>({margenPorcentaje}%)</span>
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {mensajeGuardado && (
            <span style={{ fontSize: '12px', color: 'var(--color-success)', fontWeight: 600 }}>
              Receta aplicada al Punto de Equilibrio
            </span>
          )}

          <button
            onClick={handleGuardar}
            className="btn-eng-primary"
            style={{
              height: '36px',
              padding: '0 16px',
              borderRadius: '6px',
              backgroundColor: 'var(--color-primary)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            Guardar y Aplicar al Punto de Equilibrio
          </button>
        </div>
      </div>
    </div>
  );
}
