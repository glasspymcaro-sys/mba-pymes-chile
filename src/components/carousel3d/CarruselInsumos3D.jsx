import React, { useState, useRef } from 'react';
import InsumoFigura3D from '../svg3d/InsumoFigura3D.jsx';
import TarritoBasura3D from '../svg3d/TarritoBasura3D.jsx';
import GeneradorRecetaOlla from '../recipes/GeneradorRecetaOlla.jsx';
import TechnicalEmptyStateSVG from '../svg3d/TechnicalEmptyStateSVG.jsx';
import { formatCLP } from '../../utils/formatters.js';
import {
  TIPOLOGIAS_3D,
  CATALOGO_MAESTRO_INSUMOS,
  clasificarTipologiaInsumo,
} from '../../lib/bibliotecaInsumos3D.js';

export default function CarruselInsumos3D({
  rubro = 'restaurant',
  insumos = [],
  insumosAsignados = [],
  onAgregarInsumo,
  onEditarInsumo,
  onEliminarInsumo,
  onAsignarCostoDirecto,
}) {
  // Formulario de alta de insumos con previsualización 3D en vivo y selector de tipología
  const [nombreNuevo, setNombreNuevo] = useState('');
  const [costoNuevo, setCostoNuevo] = useState('');
  const [unidadNueva, setUnidadNueva] = useState('un');
  const [tipologiaManual, setTipologiaManual] = useState('auto');
  const [imagenNueva, setImagenNueva] = useState(null);
  const fileInputCrearRef = useRef(null);

  // Explorador de Biblioteca 3D por categoría
  const [categoriaBiblioteca, setCategoriaBiblioteca] = useState('todas');

  // Filtros de búsqueda y estado en el carrusel
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos'); // 'todos' | 'en_receta' | 'disponibles'

  // Edición de insumo
  const [insumoEditando, setInsumoEditando] = useState(null);
  const [editNombre, setEditNombre] = useState('');
  const [editCosto, setEditCosto] = useState('');
  const [editUnidad, setEditUnidad] = useState('un');
  const [editTipologia, setEditTipologia] = useState('auto');
  const [editImagen, setEditImagen] = useState(null);
  const fileInputEditRef = useRef(null);

  // Estados de Drag & Drop y animación
  const [itemArrastrado, setItemArrastrado] = useState(null);
  const [zonaHover, setZonaHover] = useState(null); // 'stand' | 'basura' | null
  const [itemsDescartadosCount, setItemsDescartadosCount] = useState(0);

  // Desplazamiento del carrusel con cursor
  const carruselRef = useRef(null);
  const [isDraggingScroll, setIsDraggingScroll] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  // Tipología detectada en tiempo real mientras el usuario escribe
  const tipologiaDetectada =
    tipologiaManual !== 'auto' && TIPOLOGIAS_3D[tipologiaManual]
      ? TIPOLOGIAS_3D[tipologiaManual]
      : clasificarTipologiaInsumo(nombreNuevo, rubro);

  const handleMouseDown = (e) => {
    if (e.target.closest('[data-draggable-card]') || e.target.closest('button') || e.target.closest('input')) return;
    setIsDraggingScroll(true);
    setStartX(e.pageX - carruselRef.current.offsetLeft);
    setScrollLeftState(carruselRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDraggingScroll) return;
    e.preventDefault();
    const x = e.pageX - carruselRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    carruselRef.current.scrollLeft = scrollLeftState - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDraggingScroll(false);
  };

  const desplazarCarrusel = (direccion) => {
    if (!carruselRef.current) return;
    carruselRef.current.scrollBy({
      left: direccion * 260,
      behavior: 'smooth',
    });
  };

  // Crear insumo con figura 3D SVG animada desde la biblioteca
  const handleCrearInsumo = (e) => {
    e.preventDefault();
    const nombre = nombreNuevo.trim();
    const costo = Number(costoNuevo) || 0;
    if (!nombre || costo <= 0) return;

    const tipoFinal =
      tipologiaManual !== 'auto'
        ? tipologiaManual
        : clasificarTipologiaInsumo(nombre, rubro).id;

    onAgregarInsumo({
      id: 'insumo_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
      nombre,
      costoUnitario: costo,
      unidadMedida: unidadNueva,
      tipologia: tipoFinal,
      imagenPersonalizada: imagenNueva,
      fechaCreacion: new Date().toISOString(),
    });

    setNombreNuevo('');
    setCostoNuevo('');
    setTipologiaManual('auto');
    setImagenNueva(null);
  };

  // Agregar desde la Biblioteca Maestra en 1 clic
  const handleAgregarDesdeBiblioteca = (itemBib) => {
    onAgregarInsumo({
      id: 'insumo_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
      nombre: itemBib.nombre,
      costoUnitario: itemBib.costoUnitario,
      unidadMedida: itemBib.unidadMedida,
      tipologia: itemBib.tipologia,
      fechaCreacion: new Date().toISOString(),
    });
  };

  // Guardar edición
  const guardarEdicion = (e) => {
    e.preventDefault();
    if (!insumoEditando) return;
    const val = Number(editCosto) || 0;
    if (!editNombre.trim() || val <= 0) return;

    const tipoEditFinal =
      editTipologia !== 'auto'
        ? editTipologia
        : clasificarTipologiaInsumo(editNombre.trim(), rubro).id;

    onEditarInsumo({
      ...insumoEditando,
      nombre: editNombre.trim(),
      costoUnitario: val,
      unidadMedida: editUnidad,
      tipologia: tipoEditFinal,
      imagenPersonalizada: editImagen,
    });

    setInsumoEditando(null);
  };

  // Drag & Drop
  const handleDragStart = (e, item) => {
    setItemArrastrado(item);
    try {
      e.dataTransfer.setData('text/plain', JSON.stringify(item));
    } catch {
      e.dataTransfer.setData('text/plain', item.id);
    }
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setItemArrastrado(null);
    setZonaHover(null);
  };

  const handleDropEnStand = (e) => {
    e.preventDefault();
    setZonaHover(null);
    let item = itemArrastrado;
    if (!item) {
      try {
        const raw = e.dataTransfer.getData('text/plain');
        if (raw) item = JSON.parse(raw);
      } catch {
        const id = e.dataTransfer.getData('text/plain');
        item = insumos.find((i) => i.id === id);
      }
    }
    if (item) {
      onAsignarCostoDirecto(item);
      setItemArrastrado(null);
    }
  };

  const handleDropEnBasura = (e) => {
    e.preventDefault();
    setZonaHover(null);
    let item = itemArrastrado;
    if (!item) {
      try {
        const raw = e.dataTransfer.getData('text/plain');
        if (raw) item = JSON.parse(raw);
      } catch {
        const id = e.dataTransfer.getData('text/plain');
        item = insumos.find((i) => i.id === id);
      }
    }
    if (item) {
      onEliminarInsumo(item.id);
      setItemsDescartadosCount((prev) => prev + 1);
      setItemArrastrado(null);
    }
  };

  const insumosFiltrados = insumos.filter((item) => {
    const coincideTexto = item.nombre.toLowerCase().includes(busqueda.trim().toLowerCase());
    if (!coincideTexto) return false;
    const estaEnReceta = insumosAsignados.some((asig) => asig.id === item.id);
    if (filtroEstado === 'en_receta') return estaEnReceta;
    if (filtroEstado === 'disponibles') return !estaEnReceta;
    return true;
  });

  // Filtrar elementos de la biblioteca maestra según selección
  const itemsBibliotecaFiltrados = CATALOGO_MAESTRO_INSUMOS.filter((item) => {
    if (categoriaBiblioteca === 'todas') {
      return item.rubro === rubro || categoriaBiblioteca === 'todas';
    }
    return item.tipologia === categoriaBiblioteca;
  });

  const listaTipologias = Object.values(TIPOLOGIAS_3D);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* 1. Generador Profesional de Recetas / Productos con la Ollita 3D */}
      <GeneradorRecetaOlla
        onDropEnStand={handleDropEnStand}
        onDragOverStand={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'copy';
          setZonaHover('stand');
        }}
        onDragLeaveStand={() => setZonaHover(null)}
        zonaHover={zonaHover}
        itemArrastrado={itemArrastrado}
      />

      {/* 2. Stand de Basura (Zona de Descarte por Arrastre) */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setZonaHover('basura');
        }}
        onDragLeave={() => setZonaHover(null)}
        onDrop={handleDropEnBasura}
        style={{
          backgroundColor: zonaHover === 'basura' ? 'var(--color-danger-bg)' : 'var(--color-surface)',
          border: `1.5px dashed ${zonaHover === 'basura' ? 'var(--color-danger)' : 'var(--color-border-subtle)'}`,
          borderRadius: '10px',
          padding: '14px 20px',
          boxShadow: 'var(--shadow-card)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          transition: 'all 0.2s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <TarritoBasura3D tamaño={62} abierto={zonaHover === 'basura'} itemsEnBasura={itemsDescartadosCount} />
          <div>
            <span style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--color-danger)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Stand de Descarte (Basura)
            </span>
            <h4 className="heading-tight" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-foreground)', margin: '2px 0 0 0' }}>
              Arrastra aquí cualquier insumo del carrusel para eliminarlo
            </h4>
            <span style={{ fontSize: '12px', color: 'var(--color-muted-foreground)' }}>
              Al soltar el producto sobre el tarrito, se removerá inmediatamente del inventario y del escandallo.
            </span>
          </div>
        </div>

        {itemsDescartadosCount > 0 && (
          <span
            className="tabular-nums"
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--color-danger)',
              backgroundColor: 'var(--color-danger-bg)',
              border: '1px solid var(--color-danger-border)',
              padding: '4px 10px',
              borderRadius: '6px',
            }}
          >
            {itemsDescartadosCount} descartados
          </span>
        )}
      </div>

      {/* 3. Generador de Insumos con Biblioteca Completa de Tipologías 3D SVG */}
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '10px',
          boxShadow: 'var(--shadow-card)',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Biblioteca Vectorial Nativa • 16 Tipologías 3D Animadas (Sin Límites de API)
            </span>
            <h3 className="heading-tight" style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-foreground)', margin: '2px 0 0 0' }}>
              Generar Insumo
            </h3>
          </div>

          {/* Indicador de Tipología Clave Detectada en Vivo & Subida de Foto */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '6px 12px',
                borderRadius: '8px',
                backgroundColor: '#FAFAFA',
                border: '1px solid var(--color-border)',
              }}
            >
              <InsumoFigura3D
                nombre={nombreNuevo || 'Lechuga'}
                tipologia={tipologiaDetectada.id}
                imagenPersonalizada={imagenNueva}
                tamaño={38}
                rubro={rubro}
              />
              <div>
                <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--color-muted-foreground)', display: 'block', textTransform: 'uppercase' }}>
                  {imagenNueva ? 'Foto Personalizada' : 'Tipología 3D Asignada'}
                </span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-primary)' }}>
                  {imagenNueva ? 'Foto Subida por Usuario' : tipologiaDetectada.nombre}
                </span>
              </div>
            </div>

            <input
              type="file"
              accept="image/*"
              ref={fileInputCrearRef}
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (ev) => setImagenNueva(ev.target?.result);
                reader.readAsDataURL(file);
              }}
            />

            <button
              type="button"
              onClick={() => fileInputCrearRef.current?.click()}
              style={{
                height: '32px',
                padding: '0 10px',
                borderRadius: '6px',
                border: '1px solid var(--color-border)',
                backgroundColor: imagenNueva ? 'var(--color-brand-50)' : '#FFFFFF',
                color: imagenNueva ? 'var(--color-primary)' : 'var(--color-foreground)',
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
              {imagenNueva ? 'Cambiar Foto' : 'Subir Foto Insumo'}
            </button>

            {imagenNueva && (
              <button
                type="button"
                onClick={() => setImagenNueva(null)}
                style={{
                  height: '32px',
                  padding: '0 8px',
                  borderRadius: '6px',
                  border: '1px solid var(--color-border)',
                  backgroundColor: '#FFFFFF',
                  color: 'var(--color-danger)',
                  fontSize: '11px',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Quitar Foto
              </button>
            )}
          </div>
        </div>

        {/* Formulario Principal con Selector de Tipología Clave */}
        <form
          onSubmit={handleCrearInsumo}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr)) auto',
            gap: '12px',
            alignItems: 'flex-end',
          }}
        >
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-muted-foreground)', display: 'block', marginBottom: '4px', letterSpacing: '0.04em' }}>
              NOMBRE DEL INSUMO
            </label>
            <input
              type="text"
              value={nombreNuevo}
              onChange={(e) => setNombreNuevo(e.target.value)}
              placeholder="Ej: Lechuga, Zanahoria, Pollo, Pan..."
              required
              style={{
                width: '100%',
                height: '36px',
                padding: '0 12px',
                borderRadius: '6px',
                border: '1px solid var(--color-border)',
                backgroundColor: '#FFFFFF',
                fontSize: '13.5px',
                color: 'var(--color-foreground)',
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-muted-foreground)', display: 'block', marginBottom: '4px', letterSpacing: '0.04em' }}>
              TIPOLOGÍA CLAVE 3D
            </label>
            <select
              value={tipologiaManual}
              onChange={(e) => setTipologiaManual(e.target.value)}
              style={{
                width: '100%',
                height: '36px',
                padding: '0 10px',
                borderRadius: '6px',
                border: '1px solid var(--color-border)',
                backgroundColor: '#FFFFFF',
                fontSize: '12.5px',
                color: 'var(--color-foreground)',
                boxSizing: 'border-box',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="auto">Detección Automática ({tipologiaDetectada.nombre.split('&')[0].trim()})</option>
              {listaTipologias.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-muted-foreground)', display: 'block', marginBottom: '4px', letterSpacing: '0.04em' }}>
              COSTO UNITARIO ($ CLP)
            </label>
            <input
              type="number"
              className="tabular-nums"
              value={costoNuevo}
              onChange={(e) => setCostoNuevo(e.target.value)}
              placeholder="Ej: 500"
              required
              min="1"
              style={{
                width: '100%',
                height: '36px',
                padding: '0 12px',
                borderRadius: '6px',
                border: '1px solid var(--color-border)',
                backgroundColor: '#FFFFFF',
                fontSize: '13.5px',
                color: 'var(--color-foreground)',
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-muted-foreground)', display: 'block', marginBottom: '4px', letterSpacing: '0.04em' }}>
              UNIDAD DE MEDIDA
            </label>
            <select
              value={unidadNueva}
              onChange={(e) => setUnidadNueva(e.target.value)}
              style={{
                width: '100%',
                height: '36px',
                padding: '0 12px',
                borderRadius: '6px',
                border: '1px solid var(--color-border)',
                backgroundColor: '#FFFFFF',
                fontSize: '13.5px',
                color: 'var(--color-foreground)',
                boxSizing: 'border-box',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="un">Unidad (un)</option>
              <option value="kg">Kilogramo (kg)</option>
              <option value="lt">Litro (lt)</option>
              <option value="gr">Gramo (gr)</option>
              <option value="hr">Hora (hr)</option>
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
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Generar insumo</span>
          </button>
        </form>

        {/* Explorador de la Biblioteca Completa de Insumos 3D por Tipología */}
        <div
          style={{
            borderTop: '1px solid var(--color-border)',
            paddingTop: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Catálogo Rápido de Biblioteca 3D (Clic para agregar al inventario):
            </span>

            {/* Filtro por Familia de Tipología */}
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {[
                { id: 'todas', label: 'Todos MVP' },
                { id: 'verdura_hoja', label: 'Verduras Hoja' },
                { id: 'verdura_fruto', label: 'Verduras Fruto' },
                { id: 'verdura_raiz_bulbo', label: 'Raíces y Bulbos' },
                { id: 'palta_oleaginosa', label: 'Paltas y Olivas' },
                { id: 'fruta_fresca', label: 'Frutas' },
                { id: 'carne_roja_embutido', label: 'Carnes' },
                { id: 'ave_pescado_marisco', label: 'Aves y Pescados' },
                { id: 'panaderia_masa', label: 'Pan y Masas' },
                { id: 'lacteo_queso_huevo', label: 'Quesos y Huevos' },
                { id: 'abarrote_grano_condimento', label: 'Abarrotes' },
                { id: 'bebida_lacteo_liquido', label: 'Bebidas y Leche' },
                { id: 'ferreteria_herramienta', label: 'Ferretería y Envases' },
                { id: 'servicios_consultoria_diseno', label: 'Consultoría' },
                { id: 'servicios_software_cloud', label: 'Software & Cloud' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoriaBiblioteca(cat.id)}
                  style={{
                    padding: '3px 8px',
                    borderRadius: '5px',
                    fontSize: '10.5px',
                    fontWeight: categoriaBiblioteca === cat.id ? 600 : 500,
                    backgroundColor: categoriaBiblioteca === cat.id ? 'var(--color-brand-50)' : '#F4F4F5',
                    color: categoriaBiblioteca === cat.id ? 'var(--color-primary)' : 'var(--color-muted-foreground)',
                    border: `1px solid ${categoriaBiblioteca === cat.id ? 'var(--color-brand-200)' : 'transparent'}`,
                    cursor: 'pointer',
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cinta de Insumos de la Biblioteca 3D */}
          <div
            className="no-scrollbar"
            style={{
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              paddingBottom: '4px',
            }}
          >
            {itemsBibliotecaFiltrados.map((sug, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleAgregarDesdeBiblioteca(sug)}
                className="btn-eng-secondary"
                title={`Agregar ${sug.nombre} (${formatCLP(sug.costoUnitario)} / ${sug.unidadMedida})`}
                style={{
                  padding: '5px 10px 5px 6px',
                  borderRadius: '7px',
                  fontSize: '11.5px',
                  fontWeight: 500,
                  backgroundColor: '#FAFAFA',
                  color: 'var(--color-foreground)',
                  border: '1px solid var(--color-border)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                <InsumoFigura3D
                  nombre={sug.nombre}
                  tipologia={sug.tipologia}
                  tamaño={26}
                  rubro={rubro}
                />
                <span>{sug.nombre}</span>
                <span className="tabular-nums" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                  {formatCLP(sug.costoUnitario)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Carrusel Desplazable con el Cursor, Filtros y Buscador */}
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '10px',
          boxShadow: 'var(--shadow-card)',
          padding: '20px 24px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <div>
            <h3 className="heading-tight tabular-nums" style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-foreground)', margin: 0 }}>
              Galería de Insumos Activos ({insumosFiltrados.length})
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--color-muted-foreground)' }}>
              Arrastra con el cursor hacia los lados o lleva cualquier insumo directo a la Ollita 3D
            </span>
          </div>

          {/* Controles Superiores: Filtros de Estado, Botones < > y Buscador */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <div
              style={{
                display: 'inline-flex',
                gap: '2px',
                padding: '2px',
                borderRadius: '6px',
                backgroundColor: '#F4F4F5',
                border: '1px solid var(--color-border)',
              }}
            >
              {[
                { id: 'todos', label: 'Todos' },
                { id: 'en_receta', label: 'En Receta' },
                { id: 'disponibles', label: 'Disponibles' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFiltroEstado(tab.id)}
                  style={{
                    padding: '4px 9px',
                    borderRadius: '4px',
                    fontSize: '11.5px',
                    fontWeight: filtroEstado === tab.id ? 600 : 500,
                    backgroundColor: filtroEstado === tab.id ? '#FFFFFF' : 'transparent',
                    color: filtroEstado === tab.id ? 'var(--color-foreground)' : 'var(--color-muted-foreground)',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: filtroEstado === tab.id ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Flechas de desplazamiento del carrusel */}
            <div style={{ display: 'inline-flex', gap: '4px' }}>
              <button
                type="button"
                onClick={() => desplazarCarrusel(-1)}
                title="Desplazar a la izquierda"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  border: '1px solid var(--color-border)',
                  backgroundColor: '#FFFFFF',
                  color: 'var(--color-foreground)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => desplazarCarrusel(1)}
                title="Desplazar a la derecha"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  border: '1px solid var(--color-border)',
                  backgroundColor: '#FFFFFF',
                  color: 'var(--color-foreground)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>

            {/* Campo de búsqueda */}
            <div style={{ position: 'relative', width: '220px', maxWidth: '100%' }}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ position: 'absolute', left: '10px', top: '9px', color: 'var(--color-muted-foreground)' }}
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
                  height: '32px',
                  padding: '0 10px 0 30px',
                  borderRadius: '6px',
                  border: '1px solid var(--color-border)',
                  backgroundColor: '#FFFFFF',
                  fontSize: '12.5px',
                  color: 'var(--color-foreground)',
                  boxSizing: 'border-box',
                  outline: 'none',
                }}
              />
            </div>
          </div>
        </div>

        {insumosFiltrados.length === 0 ? (
          <TechnicalEmptyStateSVG
            tipo="busqueda"
            titulo="Sin coincidencias en el inventario de insumos"
            descripcion="Verifique el término de búsqueda o seleccione un insumo del catálogo de la biblioteca 3D superior."
          />
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
              gap: '14px',
              overflowX: 'auto',
              paddingBottom: '8px',
              cursor: isDraggingScroll ? 'grabbing' : 'grab',
              userSelect: 'none',
              scrollBehavior: isDraggingScroll ? 'auto' : 'smooth',
            }}
          >
            {insumosFiltrados.map((item) => {
              const estaEnReceta = insumosAsignados.some((asig) => asig.id === item.id);
              const siendoArrastrado = itemArrastrado?.id === item.id;
              const infoTipo =
                (item.tipologia && TIPOLOGIAS_3D[item.tipologia]) ||
                clasificarTipologiaInsumo(item.nombre, rubro);

              return (
                <div
                  key={item.id}
                  data-draggable-card="true"
                  draggable={true}
                  onDragStart={(e) => handleDragStart(e, item)}
                  onDragEnd={handleDragEnd}
                  style={{
                    flex: '0 0 205px',
                    backgroundColor: '#FFFFFF',
                    border: `1px solid ${siendoArrastrado ? 'var(--color-primary)' : estaEnReceta ? 'var(--color-brand-200)' : 'var(--color-border)'}`,
                    borderRadius: '10px',
                    padding: '14px',
                    boxShadow: siendoArrastrado ? '0 8px 24px rgba(15,118,110,0.22)' : 'var(--shadow-card)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    position: 'relative',
                    opacity: siendoArrastrado ? 0.45 : 1,
                    transform: siendoArrastrado ? 'scale(0.96)' : 'scale(1)',
                    transition: 'border 0.15s ease, opacity 0.15s ease, transform 0.15s ease',
                    cursor: 'grab',
                    touchAction: 'none',
                  }}
                >
                  {/* Badge de estado */}
                  <div style={{ position: 'absolute', top: '8px', left: '8px' }}>
                    {estaEnReceta ? (
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
                        En Receta
                      </span>
                    ) : (
                      <span style={{ fontSize: '10px', fontWeight: 500, color: 'var(--color-muted-foreground)' }}>
                        Disponible
                      </span>
                    )}
                  </div>

                  {/* Botón Superior: Editar Insumo */}
                  <div style={{ position: 'absolute', top: '6px', right: '6px' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setInsumoEditando(item);
                        setEditNombre(item.nombre);
                        setEditCosto(String(item.costoUnitario));
                        setEditUnidad(item.unidadMedida || 'un');
                        setEditTipologia(item.tipologia || 'auto');
                        setEditImagen(item.imagenPersonalizada || null);
                      }}
                      title="Editar insumo"
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--color-muted-foreground)',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '4px',
                      }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                      </svg>
                    </button>
                  </div>

                  {/* Figura 3D Animada en SVG Puro o Foto Subida */}
                  <div style={{ margin: '14px 0 6px 0', pointerEvents: 'none' }}>
                    <InsumoFigura3D
                      nombre={item.nombre}
                      tipologia={item.tipologia}
                      imagenPersonalizada={item.imagenPersonalizada}
                      tamaño={74}
                      rubro={rubro}
                      animando={siendoArrastrado}
                    />
                  </div>

                  {/* Etiqueta de Tipología Clave */}
                  <span
                    style={{
                      fontSize: '9.5px',
                      fontWeight: 600,
                      color: 'var(--color-muted-foreground)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      marginBottom: '2px',
                    }}
                  >
                    {infoTipo.nombre.split('&')[0].trim()}
                  </span>

                  <h4
                    style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: 'var(--color-foreground)',
                      margin: '0 0 3px 0',
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
                      fontSize: '13.5px',
                      fontWeight: 700,
                      color: 'var(--color-primary)',
                      marginBottom: '10px',
                    }}
                  >
                    {formatCLP(item.costoUnitario)}{' '}
                    <span style={{ fontSize: '10.5px', color: 'var(--color-muted-foreground)', fontWeight: 500 }}>
                      / {item.unidadMedida}
                    </span>
                  </span>

                  {/* Botones de Acción */}
                  <div style={{ display: 'flex', gap: '6px', width: '100%' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAsignarCostoDirecto(item);
                      }}
                      className="btn-eng-secondary"
                      title="Agregar a la receta"
                      style={{
                        flex: 1,
                        height: '30px',
                        padding: '0 8px',
                        borderRadius: '6px',
                        border: '1px solid var(--color-border)',
                        backgroundColor: '#FFFFFF',
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
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      A la Olla
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEliminarInsumo(item.id);
                        setItemsDescartadosCount((prev) => prev + 1);
                      }}
                      className="btn-eng-secondary"
                      title="Eliminar insumo"
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '6px',
                        border: '1px solid var(--color-border)',
                        backgroundColor: '#FFFFFF',
                        color: 'var(--color-danger)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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

      {/* 5. Modal de Edición de Insumo y Tipología */}
      {insumoEditando && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(9, 9, 11, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '16px',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '10px',
              border: '1px solid var(--color-border)',
              padding: '22px',
              maxWidth: '400px',
              width: '100%',
              boxShadow: 'var(--shadow-popover)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 className="heading-tight" style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-foreground)', margin: 0 }}>
                Editar Insumo y Tipología 3D
              </h3>
              <button
                onClick={() => setInsumoEditando(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted-foreground)', padding: '4px' }}
                title="Cerrar modal"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '10px 12px', backgroundColor: '#FAFAFA', borderRadius: '8px', border: '1px solid var(--color-border)', marginBottom: '14px' }}>
              <InsumoFigura3D
                nombre={editNombre}
                tipologia={editTipologia !== 'auto' ? editTipologia : null}
                imagenPersonalizada={editImagen}
                tamaño={56}
                rubro={rubro}
              />
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--color-primary)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {editImagen ? 'Foto Personalizada' : 'Figura SVG 3D Animada'}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--color-muted-foreground)', display: 'block', marginBottom: '6px' }}>
                  {editImagen
                    ? 'Imagen subida por el usuario'
                    : (editTipologia !== 'auto' && TIPOLOGIAS_3D[editTipologia]?.nombre) ||
                      clasificarTipologiaInsumo(editNombre, rubro).nombre}
                </span>

                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputEditRef}
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (ev) => setEditImagen(ev.target?.result);
                    reader.readAsDataURL(file);
                  }}
                />

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => fileInputEditRef.current?.click()}
                    style={{
                      padding: '4px 8px',
                      fontSize: '11px',
                      borderRadius: '4px',
                      border: '1px solid var(--color-border)',
                      backgroundColor: '#FFFFFF',
                      cursor: 'pointer',
                      fontWeight: 600,
                      color: 'var(--color-foreground)',
                    }}
                  >
                    {editImagen ? 'Cambiar Foto' : 'Subir Foto'}
                  </button>
                  {editImagen && (
                    <button
                      type="button"
                      onClick={() => setEditImagen(null)}
                      style={{
                        padding: '4px 8px',
                        fontSize: '11px',
                        borderRadius: '4px',
                        border: '1px solid var(--color-border)',
                        backgroundColor: '#FFFFFF',
                        cursor: 'pointer',
                        color: 'var(--color-danger)',
                      }}
                    >
                      Quitar Foto
                    </button>
                  )}
                </div>
              </div>
            </div>

            <form onSubmit={guardarEdicion} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-muted-foreground)', display: 'block', marginBottom: '4px' }}>
                  NOMBRE DEL INSUMO
                </label>
                <input
                  type="text"
                  value={editNombre}
                  onChange={(e) => setEditNombre(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    height: '36px',
                    padding: '0 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--color-border)',
                    fontSize: '13.5px',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-muted-foreground)', display: 'block', marginBottom: '4px' }}>
                  TIPOLOGÍA CLAVE 3D
                </label>
                <select
                  value={editTipologia}
                  onChange={(e) => setEditTipologia(e.target.value)}
                  style={{
                    width: '100%',
                    height: '36px',
                    padding: '0 10px',
                    borderRadius: '6px',
                    border: '1px solid var(--color-border)',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                >
                  <option value="auto">Automática según nombre</option>
                  {listaTipologias.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-muted-foreground)', display: 'block', marginBottom: '4px' }}>
                  COSTO UNITARIO ($ CLP)
                </label>
                <input
                  type="number"
                  className="tabular-nums"
                  value={editCosto}
                  onChange={(e) => setEditCosto(e.target.value)}
                  required
                  min="1"
                  style={{
                    width: '100%',
                    height: '36px',
                    padding: '0 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--color-border)',
                    fontSize: '13.5px',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-muted-foreground)', display: 'block', marginBottom: '4px' }}>
                  UNIDAD DE MEDIDA
                </label>
                <select
                  value={editUnidad}
                  onChange={(e) => setEditUnidad(e.target.value)}
                  style={{
                    width: '100%',
                    height: '36px',
                    padding: '0 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--color-border)',
                    fontSize: '13.5px',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                >
                  <option value="un">Unidad (un)</option>
                  <option value="kg">Kilogramo (kg)</option>
                  <option value="lt">Litro (lt)</option>
                  <option value="gr">Gramo (gr)</option>
                  <option value="hr">Hora (hr)</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setInsumoEditando(null)}
                  style={{
                    height: '34px',
                    padding: '0 14px',
                    borderRadius: '6px',
                    border: '1px solid var(--color-border)',
                    backgroundColor: '#FFFFFF',
                    color: 'var(--color-foreground)',
                    fontSize: '12px',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    height: '34px',
                    padding: '0 16px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: 'var(--color-primary)',
                    color: '#FFFFFF',
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
