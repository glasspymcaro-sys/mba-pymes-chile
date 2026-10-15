import React, { useState } from 'react';
import { useAppState } from '../../store/appState.jsx';
import OllitaCocina3D from '../svg3d/OllitaCocina3D.jsx';
import EstanteRetail3D from '../svg3d/EstanteRetail3D.jsx';
import MesaServicios3D from '../svg3d/MesaServicios3D.jsx';
import InsumoFigura3D from '../svg3d/InsumoFigura3D.jsx';
import { formatCLP } from '../../utils/formatters.js';

export default function GeneradorRecetaOlla({
  onDropEnStand,
  onDragOverStand,
  onDragLeaveStand,
  zonaHover,
  itemArrastrado,
}) {
  const {
    perfil,
    recetaEnOlla,
    recetas,
    costoVariableConsolidado,
    setNombreRecetaEnOlla,
    setPrecioRecetaEnOlla,
    cambiarCantidadIngrediente,
    eliminarIngredienteDeOlla,
    guardarRecetaActiva,
    cargarRecetaEnOlla,
    vaciarOlla,
  } = useAppState();

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

  const tituloSeccion =
    perfil === 'restaurant'
      ? 'Generador Profesional de Recetas (Ollita de Cocina)'
      : perfil === 'minimarket'
      ? 'Armador de Packs & Costo de Reposición (Góndola)'
      : 'Estructurador de Servicios & Proyectos (Mesa de Trabajo)';

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
        borderRadius: '12px',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-card)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      {/* 1. Encabezado del Generador de Producto */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Control de Gestión • Escandallo & Costos Directos
          </span>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-foreground)', margin: '2px 0 0 0' }}>
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
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid var(--color-border)',
                backgroundColor: '#ffffff',
                fontSize: '12.5px',
                fontWeight: 600,
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
            title="Iniciar un nuevo plato o producto desde cero"
            style={{
              padding: '8px 14px',
              borderRadius: '6px',
              border: '1px solid var(--color-border)',
              backgroundColor: '#ffffff',
              color: 'var(--color-foreground)',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
          padding: '16px',
          borderRadius: '8px',
          backgroundColor: '#f8fafc',
          border: '1px solid var(--color-border)',
        }}
      >
        <div>
          <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-muted-foreground)', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>
            Nombre del Producto / Plato
          </label>
          <input
            type="text"
            value={recetaEnOlla?.nombre || ''}
            onChange={(e) => setNombreRecetaEnOlla(e.target.value)}
            placeholder="Ej: Hamburguesa Artesanal Clásica"
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid var(--color-border)',
              backgroundColor: '#ffffff',
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--color-foreground)',
              boxSizing: 'border-box',
              outline: 'none',
            }}
          />
        </div>

        <div>
          <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-muted-foreground)', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>
            Precio de Venta al Público ($ CLP)
          </label>
          <input
            type="number"
            value={precioVenta || ''}
            onChange={(e) => setPrecioRecetaEnOlla(e.target.value)}
            placeholder="Ej: 8900"
            min="100"
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid var(--color-border)',
              backgroundColor: '#ffffff',
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--color-foreground)',
              boxSizing: 'border-box',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* 3. Escenario de Armado: Stand 3D + Lista de Ingredientes en la Receta */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          alignItems: 'start',
        }}
      >
        {/* Lado A: Zona de Cocción / Ollita 3D con Drop Zone */}
        <div
          onDragOver={onDragOverStand}
          onDragLeave={onDragLeaveStand}
          onDrop={onDropEnStand}
          style={{
            border: `2px dashed ${zonaHover === 'stand' ? 'var(--color-primary)' : 'var(--color-border)'}`,
            backgroundColor: zonaHover === 'stand' ? 'var(--color-brand-50)' : '#f8fafc',
            borderRadius: '12px',
            padding: '24px 16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            textAlign: 'center',
            transition: 'all 0.2s ease',
            minHeight: '260px',
            boxShadow: zonaHover === 'stand' ? '0 0 0 4px rgba(15,118,110,0.15)' : 'none',
          }}
        >
          {perfil === 'restaurant' && (
            <OllitaCocina3D
              tamaño={120}
              insumosEnOlla={ingredientes}
              animando={zonaHover === 'stand'}
            />
          )}

          {perfil === 'minimarket' && (
            <EstanteRetail3D
              tamaño={120}
              itemsEnEstante={ingredientes}
              animando={zonaHover === 'stand'}
            />
          )}

          {perfil === 'services' && (
            <MesaServicios3D
              tamaño={120}
              itemsEnMesa={ingredientes}
              animando={zonaHover === 'stand'}
            />
          )}

          <div style={{ marginTop: '4px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-foreground)', display: 'block' }}>
              {ingredientes.length} {ingredientes.length === 1 ? 'insumo integrado' : 'insumos integrados'}
            </span>
            <span style={{ fontSize: '11.5px', color: 'var(--color-muted-foreground)' }}>
              Arrastra los insumos del carrusel y suéltalos aquí
            </span>
          </div>
        </div>

        {/* Lado B: Escandallo Detallado de Ingredientes de la Receta */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-muted-foreground)', textTransform: 'uppercase' }}>
              Ingredientes en la receta
            </span>
            <span style={{ fontSize: '12px', color: 'var(--color-primary)', fontWeight: 700 }}>
              Costo Unitario: {formatCLP(costoTotal)}
            </span>
          </div>

          {ingredientes.length === 0 ? (
            <div
              style={{
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                padding: '36px 16px',
                textAlign: 'center',
                color: 'var(--color-muted-foreground)',
                fontSize: '13px',
                backgroundColor: '#ffffff',
              }}
            >
              La ollita está vacía. Selecciona o arrastra insumos desde el carrusel de abajo (ej: pan, carne, tomate) para armar tu producto.
            </div>
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
                      padding: '10px 14px',
                      backgroundColor: '#ffffff',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      gap: '10px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
                      <div style={{ flexShrink: 0, width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <InsumoFigura3D nombre={item.nombre} tamaño={32} imagenFalUrl={item.imagenFalUrl} rubro={perfil} />
                      </div>

                      <div style={{ minWidth: 0 }}>
                        <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-foreground)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.nombre}
                        </h4>
                        <span style={{ fontSize: '11px', color: 'var(--color-muted-foreground)' }}>
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
                          borderRadius: '4px',
                          border: '1px solid var(--color-border)',
                          backgroundColor: '#ffffff',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '13px',
                          fontWeight: 700,
                          color: 'var(--color-foreground)',
                        }}
                      >
                        -
                      </button>

                      <span className="tabular-nums" style={{ fontSize: '12px', fontWeight: 700, minWidth: '32px', textAlign: 'center' }}>
                        {cant}
                      </span>

                      <button
                        onClick={() => cambiarCantidadIngrediente(item.idAsignado || item.id, cant + 0.5)}
                        title="Aumentar porción"
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '4px',
                          border: '1px solid var(--color-border)',
                          backgroundColor: '#ffffff',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '13px',
                          fontWeight: 700,
                          color: 'var(--color-foreground)',
                        }}
                      >
                        +
                      </button>
                    </div>

                    {/* Subtotal del Insumo en la Receta */}
                    <div className="tabular-nums" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-foreground)', minWidth: '60px', textAlign: 'right' }}>
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
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
          paddingTop: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
        }}
      >
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-muted-foreground)', display: 'block' }}>
              COSTO DIRECTO TOTAL (CV)
            </span>
            <span className="tabular-nums" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-foreground)' }}>
              {formatCLP(costoTotal)}
            </span>
          </div>

          <div style={{ height: '24px', width: '1px', backgroundColor: 'var(--color-border)' }} />

          <div>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-muted-foreground)', display: 'block' }}>
              PRECIO DE VENTA (P)
            </span>
            <span className="tabular-nums" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-foreground)' }}>
              {formatCLP(precioVenta)}
            </span>
          </div>

          <div style={{ height: '24px', width: '1px', backgroundColor: 'var(--color-border)' }} />

          <div>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-muted-foreground)', display: 'block' }}>
              MARGEN CONTRIBUCIÓN (P - CV)
            </span>
            <span className="tabular-nums" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-success)' }}>
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
            style={{
              padding: '10px 18px',
              borderRadius: '8px',
              backgroundColor: 'var(--color-primary)',
              color: '#ffffff',
              border: 'none',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
