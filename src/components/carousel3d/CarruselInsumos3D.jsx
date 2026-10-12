import React, { useState } from 'react';
import InsumoFigura3D from '../svg3d/InsumoFigura3D.jsx';
import TarritoBasura3D from '../svg3d/TarritoBasura3D.jsx';
import OllitaCocina3D from '../svg3d/OllitaCocina3D.jsx';
import EstanteRetail3D from '../svg3d/EstanteRetail3D.jsx';
import MesaServicios3D from '../svg3d/MesaServicios3D.jsx';
import { generarActivo3D } from '../../lib/fal3d.js';
import { formatearCLP } from '../../utils/formatters.js';

export default function CarruselInsumos3D({
  rubro = 'restaurant',
  insumos = [],
  onAgregarInsumo,
  onEliminarInsumo,
  onAsignarCostoDirecto,
  insumosAsignados = [],
}) {
  const [nombreNuevo, setNombreNuevo] = useState('');
  const [costoNuevo, setCostoNuevo] = useState('');
  const [unidadNueva, setUnidadNueva] = useState('kg');
  const [cargando3D, setCargando3D] = useState(false);
  const [indiceCarrusel, setIndiceCarrusel] = useState(0);
  const [itemAnimando, setItemAnimando] = useState(null);
  const [destinoAnimacion, setDestinoAnimacion] = useState(null); // 'olla' | 'basura'
  const [itemsDescartadosCount, setItemsDescartadosCount] = useState(0);

  // Manejar creación de nuevo insumo y render 3D
  const handleCrearInsumo = async (e) => {
    e.preventDefault();
    const nombre = nombreNuevo.trim();
    const costo = Number(costoNuevo) || 0;
    if (!nombre || costo <= 0) return;

    setCargando3D(true);
    let imagenFalUrl = null;

    try {
      // Intentar render 3D con fal.ai (o fallback procedural si no hay saldo)
      const res3D = await generarActivo3D(nombre, rubro);
      imagenFalUrl = res3D.url;
    } catch (err) {
      console.warn('Uso de render 3D procedural SVG:', err);
    } finally {
      setCargando3D(false);
    }

    const nuevoItem = {
      id: 'insumo_' + Date.now(),
      nombre,
      costoUnitario: costo,
      unidadMedida: unidadNueva,
      imagenFalUrl,
      fechaCreacion: new Date().toISOString(),
    };

    onAgregarInsumo(nuevoItem);
    setNombreNuevo('');
    setCostoNuevo('');
  };

  // Mover a la Ollita / Estante / Mesa
  const handleMoverAContenedor = (item) => {
    setItemAnimando(item.id);
    setDestinoAnimacion('olla');
    setTimeout(() => {
      onAsignarCostoDirecto(item);
      setItemAnimando(null);
      setDestinoAnimacion(null);
    }, 450);
  };

  // Descartar al Tarrito de Basura
  const handleMoverABasura = (item) => {
    setItemAnimando(item.id);
    setDestinoAnimacion('basura');
    setTimeout(() => {
      onEliminarInsumo(item.id);
      setItemsDescartadosCount((prev) => prev + 1);
      setItemAnimando(null);
      setDestinoAnimacion(null);
    }, 450);
  };

  const paso = 3;
  const itemsVisibles = insumos.slice(indiceCarrusel, indiceCarrusel + paso);

  const avanzar = () => {
    if (indiceCarrusel + paso < insumos.length) {
      setIndiceCarrusel((prev) => prev + 1);
    }
  };

  const retroceder = () => {
    if (indiceCarrusel > 0) {
      setIndiceCarrusel((prev) => prev - 1);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Formulario de Registro 3D de Insumos */}
      <div
        style={{
          background: 'var(--bg-neumorphic)',
          padding: '22px 28px',
          borderRadius: '24px',
          boxShadow: 'var(--neu-flat)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--primary-color)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              Tecnología 3D & Motor de Costos Directos
            </span>
            <h2 style={{ fontSize: '19px', fontWeight: '900', color: '#1a202c', margin: '4px 0 0 0' }}>
              Registrador Tridimensional de Insumos y Productos
            </h2>
          </div>
          <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
            Renderizado automático en perspectiva 3D
          </span>
        </div>

        <form
          onSubmit={handleCrearInsumo}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr)) auto',
            gap: '14px',
            alignItems: 'flex-end',
          }}
        >
          <div>
            <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>
              NOMBRE DEL INSUMO O PRODUCTO
            </label>
            <input
              type="text"
              value={nombreNuevo}
              onChange={(e) => setNombreNuevo(e.target.value)}
              placeholder="Ej: Manzanas rojas, Carne, Pan..."
              required
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '12px',
                border: 'none',
                outline: 'none',
                backgroundColor: 'var(--bg-neumorphic)',
                boxShadow: 'var(--neu-pressed)',
                fontSize: '13px',
                color: 'var(--text-main)',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>
              COSTO DIRECTO UNITARIO ($ CLP)
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
                padding: '11px 14px',
                borderRadius: '12px',
                border: 'none',
                outline: 'none',
                backgroundColor: 'var(--bg-neumorphic)',
                boxShadow: 'var(--neu-pressed)',
                fontSize: '13px',
                color: 'var(--text-main)',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '5px' }}>
              UNIDAD DE MEDIDA
            </label>
            <select
              value={unidadNueva}
              onChange={(e) => setUnidadNueva(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '12px',
                border: 'none',
                outline: 'none',
                backgroundColor: 'var(--bg-neumorphic)',
                boxShadow: 'var(--neu-pressed)',
                fontSize: '13px',
                color: 'var(--text-main)',
                boxSizing: 'border-box',
                cursor: 'pointer',
              }}
            >
              <option value="kg">Kilogramo (kg)</option>
              <option value="un">Unidad (un)</option>
              <option value="lt">Litro (lt)</option>
              <option value="gr">Gramo (gr)</option>
              <option value="hr">Hora Hombre (hr)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={cargando3D}
            style={{
              padding: '12px 22px',
              borderRadius: '12px',
              backgroundColor: 'var(--primary-color)',
              color: '#ffffff',
              border: 'none',
              fontSize: '12.5px',
              fontWeight: '800',
              cursor: cargando3D ? 'not-allowed' : 'pointer',
              boxShadow: 'var(--neu-flat-sm)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
              height: '42px',
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
            {cargando3D ? 'Renderizando 3D...' : 'Generar Figura 3D'}
          </button>
        </form>
      </div>

      {/* 2. Escenario Interactivo Central: Carrusel 3D + Ollita/Estante + Tarrito de Basura */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) auto',
          gap: '24px',
          alignItems: 'center',
        }}
      >
        {/* Carrusel 3D de Productos Creados */}
        <div
          style={{
            background: 'var(--bg-neumorphic)',
            borderRadius: '24px',
            padding: '24px',
            boxShadow: 'var(--neu-flat)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#1a202c', margin: 0 }}>
                Galería Tridimensional de Insumos Creados
              </h3>
              <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                {insumos.length} elementos registrados en catálogo
              </span>
            </div>

            {/* Controles de Navegación del Carrusel */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={retroceder}
                disabled={indiceCarrusel === 0}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: 'var(--bg-neumorphic)',
                  boxShadow: indiceCarrusel === 0 ? 'var(--neu-pressed)' : 'var(--neu-flat-sm)',
                  cursor: indiceCarrusel === 0 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: indiceCarrusel === 0 ? 'var(--text-muted)' : 'var(--primary-color)',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                onClick={avanzar}
                disabled={indiceCarrusel + paso >= insumos.length}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: 'var(--bg-neumorphic)',
                  boxShadow: indiceCarrusel + paso >= insumos.length ? 'var(--neu-pressed)' : 'var(--neu-flat-sm)',
                  cursor: indiceCarrusel + paso >= insumos.length ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: indiceCarrusel + paso >= insumos.length ? 'var(--text-muted)' : 'var(--primary-color)',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>

          {/* Tarjetas del Carrusel con Perspectiva 3D */}
          {insumos.length === 0 ? (
            <div
              style={{
                padding: '40px 20px',
                textAlign: 'center',
                color: 'var(--text-muted)',
                fontSize: '13.5px',
              }}
            >
              No hay insumos registrados. Escribe uno arriba (ej: "Manzanas") para generar su figura 3D.
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '18px',
                perspective: '1000px',
              }}
            >
              {itemsVisibles.map((item) => {
                const enAnimacion = itemAnimando === item.id;
                const estaAsignado = insumosAsignados.some((asig) => asig.id === item.id);

                return (
                  <div
                    key={item.id}
                    style={{
                      background: 'var(--bg-neumorphic)',
                      borderRadius: '20px',
                      padding: '16px',
                      boxShadow: 'var(--neu-flat)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      position: 'relative',
                      transform: enAnimacion
                        ? destinoAnimacion === 'olla'
                          ? 'translateX(120px) scale(0.4) rotate(15deg)'
                          : 'translateX(240px) scale(0.2) rotate(-25deg)'
                        : 'rotateY(0deg) translateZ(0)',
                      opacity: enAnimacion ? 0.2 : 1,
                      transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    }}
                  >
                    {/* Badge de Estado */}
                    <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
                      {estaAsignado ? (
                        <span style={{ fontSize: '9.5px', fontWeight: '800', color: '#2f855a', padding: '2px 6px', borderRadius: '6px', background: '#e6fffa' }}>
                          En Costo Directo
                        </span>
                      ) : (
                        <span style={{ fontSize: '9.5px', fontWeight: '700', color: 'var(--text-muted)' }}>
                          Disponible
                        </span>
                      )}
                    </div>

                    {/* Figura 3D SVG o fal.ai */}
                    <div style={{ margin: '14px 0 8px 0' }}>
                      <InsumoFigura3D
                        nombre={item.nombre}
                        tamaño={80}
                        imagenFalUrl={item.imagenFalUrl}
                        animando={enAnimacion}
                      />
                    </div>

                    <h4
                      style={{
                        fontSize: '14px',
                        fontWeight: '800',
                        color: '#1a202c',
                        margin: '0 0 4px 0',
                        textAlign: 'center',
                      }}
                    >
                      {item.nombre}
                    </h4>

                    <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--primary-color)', marginBottom: '14px' }}>
                      {formatearCLP(item.costoUnitario)} <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>/ {item.unidadMedida}</span>
                    </span>

                    {/* Botones de Acción: Mover a la Olla / Mover a la Basura */}
                    <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                      <button
                        onClick={() => handleMoverAContenedor(item)}
                        title="Asignar al contenedor de costos directos"
                        style={{
                          flex: 1,
                          padding: '8px 6px',
                          borderRadius: '10px',
                          border: 'none',
                          backgroundColor: 'var(--bg-neumorphic)',
                          color: '#2f855a',
                          boxShadow: 'var(--neu-flat-sm)',
                          fontSize: '11px',
                          fontWeight: '800',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px',
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        {rubro === 'restaurant' ? 'A la Olla' : rubro === 'minimarket' ? 'Al Estante' : 'A la Mesa'}
                      </button>

                      <button
                        onClick={() => handleMoverABasura(item)}
                        title="Descartar y tirar al tarrito de basura"
                        style={{
                          padding: '8px 10px',
                          borderRadius: '10px',
                          border: 'none',
                          backgroundColor: 'var(--bg-neumorphic)',
                          color: 'var(--accent-red)',
                          boxShadow: 'var(--neu-flat-sm)',
                          fontSize: '11px',
                          fontWeight: '800',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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

        {/* Zona Receptora 3D: Contenedor (Ollita/Estante/Mesa) y Tarrito de Basura */}
        <div
          style={{
            background: 'var(--bg-neumorphic)',
            borderRadius: '24px',
            padding: '24px 20px',
            boxShadow: 'var(--neu-flat)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '26px',
            minWidth: '160px',
          }}
        >
          {/* Contenedor Activo según Rubro */}
          {rubro === 'restaurant' && (
            <OllitaCocina3D
              tamaño={115}
              insumosEnOlla={insumosAsignados}
              animando={itemAnimando && destinoAnimacion === 'olla'}
            />
          )}

          {rubro === 'minimarket' && (
            <EstanteRetail3D
              tamaño={115}
              itemsEnEstante={insumosAsignados}
              animando={itemAnimando && destinoAnimacion === 'olla'}
            />
          )}

          {rubro === 'services' && (
            <MesaServicios3D
              tamaño={115}
              itemsEnMesa={insumosAsignados}
              animando={itemAnimando && destinoAnimacion === 'olla'}
            />
          )}

          <div style={{ width: '80%', height: '1px', backgroundColor: 'rgba(0,0,0,0.06)' }} />

          {/* Tarrito de Basura 3D */}
          <TarritoBasura3D
            tamaño={105}
            abierto={itemAnimando && destinoAnimacion === 'basura'}
            itemsEnBasura={itemsDescartadosCount}
          />
        </div>
      </div>
    </div>
  );
}
