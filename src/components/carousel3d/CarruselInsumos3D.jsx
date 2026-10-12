import React, { useState, useRef } from 'react';
import InsumoFigura3D from '../svg3d/InsumoFigura3D.jsx';
import TarritoBasura3D from '../svg3d/TarritoBasura3D.jsx';
import OllitaCocina3D from '../svg3d/OllitaCocina3D.jsx';
import EstanteRetail3D from '../svg3d/EstanteRetail3D.jsx';
import MesaServicios3D from '../svg3d/MesaServicios3D.jsx';
import { formatCLP } from '../../utils/formatters.js';

export default function CarruselInsumos3D({
  rubro = 'restaurant',
  insumos = [],
  insumosAsignados = [],
  onAgregarInsumo,
  onEditarInsumo,
  onEliminarInsumo,
  onAsignarCostoDirecto,
  onDesasignarCostoDirecto,
}) {
  // Formulario de creación
  const [nombreNuevo, setNombreNuevo] = useState('');
  const [costoNuevo, setCostoNuevo] = useState('');
  const [unidadNueva, setUnidadNueva] = useState('kg');

  // Filtro de búsqueda
  const [busqueda, setBusqueda] = useState('');

  // Edición de insumo
  const [insumoEditando, setInsumoEditando] = useState(null);
  const [editNombre, setEditNombre] = useState('');
  const [editCosto, setEditCosto] = useState('');
  const [editUnidad, setEditUnidad] = useState('kg');

  // Estados de Drag & Drop y animación
  const [itemArrastrado, setItemArrastrado] = useState(null);
  const [zonaHover, setZonaHover] = useState(null); // 'stand' | 'basura' | null
  const [itemsDescartadosCount, setItemsDescartadosCount] = useState(0);

  // Desplazamiento del carrusel con cursor (drag-to-scroll)
  const carruselRef = useRef(null);
  const [isDraggingScroll, setIsDraggingScroll] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const handleMouseDown = (e) => {
    // Si hace clic en un botón o input, no activar drag-to-scroll
    if (e.target.closest('button') || e.target.closest('input')) return;
    setIsDraggingScroll(true);
    setStartX(e.pageX - carruselRef.current.offsetLeft);
    setScrollLeftState(carruselRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDraggingScroll) return;
    e.preventDefault();
    const x = e.pageX - carruselRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Velocidad de desplazamiento
    carruselRef.current.scrollLeft = scrollLeftState - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDraggingScroll(false);
  };

  // Crear insumo
  const handleCrearInsumo = (e) => {
    e.preventDefault();
    const nombre = nombreNuevo.trim();
    const costo = Number(costoNuevo) || 0;
    if (!nombre || costo <= 0) return;

    onAgregarInsumo({
      id: 'insumo_' + Date.now(),
      nombre,
      costoUnitario: costo,
      unidadMedida: unidadNueva,
      fechaCreacion: new Date().toISOString(),
    });

    setNombreNuevo('');
    setCostoNuevo('');
  };

  // Iniciar edición
  const abrirEdicion = (item) => {
    setInsumoEditando(item);
    setEditNombre(item.nombre);
    setEditCosto(String(item.costoUnitario));
    setEditUnidad(item.unidadMedida || 'kg');
  };

  const guardarEdicion = (e) => {
    e.preventDefault();
    if (!insumoEditando) return;
    const val = Number(editCosto) || 0;
    if (!editNombre.trim() || val <= 0) return;

    onEditarInsumo({
      ...insumoEditando,
      nombre: editNombre.trim(),
      costoUnitario: val,
      unidadMedida: editUnidad,
    });

    setInsumoEditando(null);
  };

  // Drag & Drop con HTML5
  const handleDragStart = (e, item) => {
    setItemArrastrado(item);
    e.dataTransfer.setData('text/plain', item.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setItemArrastrado(null);
    setZonaHover(null);
  };

  const handleDropEnStand = (e) => {
    e.preventDefault();
    setZonaHover(null);
    if (itemArrastrado) {
      onAsignarCostoDirecto(itemArrastrado);
      setItemArrastrado(null);
    }
  };

  const handleDropEnBasura = (e) => {
    e.preventDefault();
    setZonaHover(null);
    if (itemArrastrado) {
      onEliminarInsumo(itemArrastrado.id);
      setItemsDescartadosCount((prev) => prev + 1);
      setItemArrastrado(null);
    }
  };

  // Filtrado en vivo de insumos
  const insumosFiltrados = insumos.filter((item) =>
    item.nombre.toLowerCase().includes(busqueda.trim().toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* 1. Formulario de Alta de Insumos */}
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '12px',
          boxShadow: 'var(--shadow-card)',
          padding: '20px 24px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-foreground)', margin: 0 }}>
              Generador de Insumos
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--color-muted-foreground)', margin: '2px 0 0 0' }}>
              Registra los insumos de tu operación para cuantificar el costo directo unitario
            </p>
          </div>
        </div>

        <form
          onSubmit={handleCrearInsumo}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr)) auto',
            gap: '12px',
            alignItems: 'flex-end',
          }}
        >
          <div>
            <label style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--color-muted-foreground)', display: 'block', marginBottom: '4px' }}>
              NOMBRE DEL INSUMO
            </label>
            <input
              type="text"
              value={nombreNuevo}
              onChange={(e) => setNombreNuevo(e.target.value)}
              placeholder="Ej: Manzanas, Carne, Harina..."
              required
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid var(--color-border)',
                backgroundColor: '#ffffff',
                fontSize: '15px',
                color: 'var(--color-foreground)',
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--color-muted-foreground)', display: 'block', marginBottom: '4px' }}>
              COSTO UNITARIO ($ CLP)
            </label>
            <input
              type="number"
              value={costoNuevo}
              onChange={(e) => setCostoNuevo(e.target.value)}
              placeholder="Ej: 1400"
              required
              min="1"
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid var(--color-border)',
                backgroundColor: '#ffffff',
                fontSize: '15px',
                color: 'var(--color-foreground)',
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--color-muted-foreground)', display: 'block', marginBottom: '4px' }}>
              UNIDAD DE MEDIDA
            </label>
            <select
              value={unidadNueva}
              onChange={(e) => setUnidadNueva(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid var(--color-border)',
                backgroundColor: '#ffffff',
                fontSize: '14px',
                color: 'var(--color-foreground)',
                boxSizing: 'border-box',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="kg">Kilogramo (kg)</option>
              <option value="un">Unidad (un)</option>
              <option value="lt">Litro (lt)</option>
              <option value="gr">Gramo (gr)</option>
              <option value="hr">Hora (hr)</option>
            </select>
          </div>

          <button
            type="submit"
            style={{
              padding: '10px 20px',
              minHeight: '42px',
              borderRadius: '8px',
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-primary-foreground)',
              border: 'none',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
              transition: 'background-color 0.15s ease',
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Generar insumo
          </button>
        </form>
      </div>

      {/* 2. Zonas Receptoras de Arrastre (Stands Interactivos: Costo Directo y Basura) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
        }}
      >
        {/* Zona A: Stand de Receta / Costos Directos */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setZonaHover('stand');
          }}
          onDragLeave={() => setZonaHover(null)}
          onDrop={handleDropEnStand}
          style={{
            backgroundColor: zonaHover === 'stand' ? 'var(--color-brand-50)' : 'var(--color-surface)',
            border: `2px dashed ${zonaHover === 'stand' ? 'var(--color-primary)' : 'var(--color-border)'}`,
            borderRadius: '12px',
            padding: '16px 20px',
            boxShadow: 'var(--shadow-card)',
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
            transition: 'all 0.2s ease',
            cursor: 'default',
          }}
        >
          <div style={{ flexShrink: 0 }}>
            {rubro === 'restaurant' && <OllitaCocina3D tamaño={90} insumosEnOlla={insumosAsignados} animando={zonaHover === 'stand'} />}
            {rubro === 'minimarket' && <EstanteRetail3D tamaño={90} itemsEnEstante={insumosAsignados} animando={zonaHover === 'stand'} />}
            {rubro === 'services' && <MesaServicios3D tamaño={90} itemsEnMesa={insumosAsignados} animando={zonaHover === 'stand'} />}
          </div>

          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {rubro === 'restaurant' ? 'Stand de Receta (Ollita)' : rubro === 'minimarket' ? 'Stand de Exhibición (Góndola)' : 'Stand de Proyecto (Mesa)'}
            </span>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-foreground)', margin: '2px 0 4px 0' }}>
              Arrastra aquí para asignar
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--color-muted-foreground)', margin: 0 }}>
              Suelta cualquier insumo para incorporarlo al costo directo de la unidad.
            </p>
          </div>
        </div>

        {/* Zona B: Stand de Basura / Descarte */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setZonaHover('basura');
          }}
          onDragLeave={() => setZonaHover(null)}
          onDrop={handleDropEnBasura}
          style={{
            backgroundColor: zonaHover === 'basura' ? 'var(--color-danger-bg)' : 'var(--color-surface)',
            border: `2px dashed ${zonaHover === 'basura' ? 'var(--color-danger)' : 'var(--color-border)'}`,
            borderRadius: '12px',
            padding: '16px 20px',
            boxShadow: 'var(--shadow-card)',
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
            transition: 'all 0.2s ease',
            cursor: 'default',
          }}
        >
          <div style={{ flexShrink: 0 }}>
            <TarritoBasura3D tamaño={85} abierto={zonaHover === 'basura'} itemsEnBasura={itemsDescartadosCount} />
          </div>

          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--color-danger)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Stand de Descarte (Basura)
            </span>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-foreground)', margin: '2px 0 4px 0' }}>
              Arrastra aquí para eliminar
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--color-muted-foreground)', margin: 0 }}>
              Suelta un insumo en el tarrito para descartarlo de la lista definitivamente.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Barra de Búsqueda y Desplazamiento del Carrusel */}
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '12px',
          boxShadow: 'var(--shadow-card)',
          padding: '20px 24px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-foreground)', margin: 0 }}>
              Catálogo de Insumos ({insumosFiltrados.length})
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--color-muted-foreground)' }}>
              Haz clic y arrastra horizontalmente el carrusel para navegar entre productos
            </span>
          </div>

          {/* Campo de búsqueda en vivo */}
          <div style={{ position: 'relative', width: '260px', maxWidth: '100%' }}>
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--color-muted-foreground)' }}
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar insumo..."
              style={{
                width: '100%',
                padding: '8px 12px 8px 34px',
                borderRadius: '8px',
                border: '1px solid var(--color-border)',
                backgroundColor: '#ffffff',
                fontSize: '13px',
                color: 'var(--color-foreground)',
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Carrusel Desplazable con el Cursor (Drag-to-Scroll) */}
        {insumosFiltrados.length === 0 ? (
          <div style={{ padding: '36px 12px', textAlign: 'center', color: 'var(--color-muted-foreground)', fontSize: '13px' }}>
            No se encontraron insumos coincidentes con "{busqueda}".
          </div>
        ) : (
          <div
            ref={carruselRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            className="no-scrollbar"
            style={{
              display: 'flex',
              gap: '16px',
              overflowX: 'auto',
              paddingBottom: '8px',
              cursor: isDraggingScroll ? 'grabbing' : 'grab',
              userSelect: 'none',
              scrollBehavior: isDraggingScroll ? 'auto' : 'smooth',
            }}
          >
            {insumosFiltrados.map((item) => {
              const estaAsignado = insumosAsignados.some((asig) => asig.id === item.id);
              const siendoArrastrado = itemArrastrado?.id === item.id;

              return (
                <div
                  key={item.id}
                  draggable={true}
                  onDragStart={(e) => handleDragStart(e, item)}
                  onDragEnd={handleDragEnd}
                  style={{
                    flex: '0 0 210px',
                    backgroundColor: '#ffffff',
                    border: `1px solid ${siendoArrastrado ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    borderRadius: '12px',
                    padding: '16px',
                    boxShadow: 'var(--shadow-card)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    position: 'relative',
                    opacity: siendoArrastrado ? 0.4 : 1,
                    transition: 'all 0.15s ease',
                    cursor: 'grab',
                  }}
                >
                  {/* Badge de estado en el stand */}
                  <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
                    {estaAsignado ? (
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 600,
                          color: 'var(--color-success)',
                          backgroundColor: 'var(--color-success-bg)',
                          border: '1px solid var(--color-success-border)',
                          padding: '2px 6px',
                          borderRadius: '4px',
                        }}
                      >
                        En Stand
                      </span>
                    ) : (
                      <span style={{ fontSize: '10px', fontWeight: 500, color: 'var(--color-muted-foreground)' }}>
                        Disponible
                      </span>
                    )}
                  </div>

                  {/* Botón Editar Insumo */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      abrirEdicion(item);
                    }}
                    title="Editar datos del insumo"
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--color-muted-foreground)',
                      padding: '4px',
                      borderRadius: '4px',
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                  </button>

                  {/* Figura Vectorial Representativa */}
                  <div style={{ margin: '14px 0 8px 0', pointerEvents: 'none' }}>
                    <InsumoFigura3D nombre={item.nombre} tamaño={72} imagenFalUrl={item.imagenFalUrl} />
                  </div>

                  {/* Nombre y Costo */}
                  <h4
                    style={{
                      fontSize: '13.5px',
                      fontWeight: 700,
                      color: 'var(--color-foreground)',
                      margin: '0 0 4px 0',
                      textAlign: 'center',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      width: '100%',
                    }}
                    title={item.nombre}
                  >
                    {item.nombre}
                  </h4>

                  <span
                    className="tabular-nums"
                    style={{
                      fontSize: '14px',
                      fontWeight: 700,
                      color: 'var(--color-primary)',
                      marginBottom: '12px',
                    }}
                  >
                    {formatCLP(item.costoUnitario)}{' '}
                    <span style={{ fontSize: '11px', color: 'var(--color-muted-foreground)', fontWeight: 500 }}>
                      / {item.unidadMedida}
                    </span>
                  </span>

                  {/* Botones de Acción Directa (para clics rápidos en desktop o móvil) */}
                  <div style={{ display: 'flex', gap: '6px', width: '100%' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAsignarCostoDirecto(item);
                      }}
                      title="Agregar al costo directo del stand"
                      style={{
                        flex: 1,
                        padding: '7px 8px',
                        borderRadius: '6px',
                        border: '1px solid var(--color-border)',
                        backgroundColor: '#ffffff',
                        color: 'var(--color-primary)',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                      }}
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      Al Stand
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEliminarInsumo(item.id);
                        setItemsDescartadosCount((prev) => prev + 1);
                      }}
                      title="Descartar insumo"
                      style={{
                        padding: '7px 8px',
                        borderRadius: '6px',
                        border: '1px solid var(--color-border)',
                        backgroundColor: '#ffffff',
                        color: 'var(--color-danger)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Modal para Editar Insumo */}
      {insumoEditando && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '16px',
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid var(--color-border)',
              padding: '24px',
              maxWidth: '400px',
              width: '100%',
              boxShadow: 'var(--shadow-popover)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-foreground)', margin: 0 }}>
                Editar Insumo
              </h3>
              <button
                onClick={() => setInsumoEditando(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted-foreground)', fontSize: '16px' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={guardarEdicion} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--color-muted-foreground)', display: 'block', marginBottom: '4px' }}>
                  NOMBRE DEL INSUMO
                </label>
                <input
                  type="text"
                  value={editNombre}
                  onChange={(e) => setEditNombre(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--color-border)',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--color-muted-foreground)', display: 'block', marginBottom: '4px' }}>
                  COSTO UNITARIO ($ CLP)
                </label>
                <input
                  type="number"
                  value={editCosto}
                  onChange={(e) => setEditCosto(e.target.value)}
                  required
                  min="1"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--color-border)',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--color-muted-foreground)', display: 'block', marginBottom: '4px' }}>
                  UNIDAD DE MEDIDA
                </label>
                <select
                  value={editUnidad}
                  onChange={(e) => setEditUnidad(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--color-border)',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                >
                  <option value="kg">Kilogramo (kg)</option>
                  <option value="un">Unidad (un)</option>
                  <option value="lt">Litro (lt)</option>
                  <option value="gr">Gramo (gr)</option>
                  <option value="hr">Hora (hr)</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setInsumoEditando(null)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '6px',
                    border: '1px solid var(--color-border)',
                    backgroundColor: '#ffffff',
                    color: 'var(--color-foreground)',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: 'var(--color-primary)',
                    color: '#ffffff',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Guardar cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
