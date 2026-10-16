import React, { useState } from 'react';
import ProductoRecetaFigura3D from './ProductoRecetaFigura3D.jsx';
import InsumoFigura3D from './InsumoFigura3D.jsx';
import { formatCLP } from '../../utils/formatters.js';

/**
 * Visor Interactivo de Ensamblaje 3D con Iluminación de Estudio PBR (threejs-pbr-architect)
 * Incluye grilla espacial de referencia CAD, sistema de iluminación de 3 puntos (Key, Fill, Rim),
 * inclinación orbital en tiempo real y telemetría de costos directos.
 */
export default function VisorEscenaPBR3D({
  perfil = 'restaurant',
  nombreProducto = 'Formulación Directa',
  figuraId = '',
  imagenPersonalizada = null,
  insumosAsignados = [],
  costoVariableConsolidado = 0,
  precioVentaConsolidado = 0,
  margenContribucionUnitario = 0,
}) {
  const [rotacion, setRotacion] = useState({ x: 6, y: -8 });
  const [modoMaterial, setModoMaterial] = useState('estudio'); // 'estudio' | 'cad' | 'termico'

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    setRotacion({
      x: Math.round(-relY * 18),
      y: Math.round(relX * 22),
    });
  };

  const handleMouseLeave = () => {
    setRotacion({ x: 6, y: -8 });
  };

  const porcentajeMargen =
    precioVentaConsolidado > 0
      ? Math.round((margenContribucionUnitario / precioVentaConsolidado) * 100)
      : 0;

  return (
    <div
      className="surface-card"
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '10px',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-card)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      {/* Cabecera Técnica del Visor 3D PBR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span
            style={{
              fontSize: '10.5px',
              fontWeight: 600,
              color: 'var(--color-primary)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              backgroundColor: 'var(--color-brand-50)',
              border: '1px solid var(--color-brand-200)',
              padding: '2px 7px',
              borderRadius: '4px',
            }}
          >
            Presentación Visual • {perfil === 'restaurant' ? 'Cocina' : perfil === 'minimarket' ? 'Góndola' : 'Servicio'}
          </span>
          <h3 className="heading-tight" style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-foreground)', margin: 0 }}>
            {nombreProducto || 'Unidad de Costeo Activa'}
          </h3>
        </div>

        {/* Selector de Iluminación / Vista */}
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
            { id: 'estudio', label: 'Estudio' },
            { id: 'cad', label: 'Técnica' },
            { id: 'termico', label: 'Contraste' },
          ].map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setModoMaterial(m.id)}
              style={{
                padding: '3px 8px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: modoMaterial === m.id ? 600 : 500,
                backgroundColor: modoMaterial === m.id ? '#FFFFFF' : 'transparent',
                color: modoMaterial === m.id ? '#09090B' : '#52525B',
                border: 'none',
                boxShadow: modoMaterial === m.id ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                cursor: 'pointer',
              }}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Escenario 3D Interactivo + Desglose de Costo Unitario */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '18px',
          alignItems: 'center',
        }}
      >
        {/* Viewport 3D con Iluminación de 3 Puntos y Perspectiva Orbital */}
        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          title="Mueva el cursor sobre la imagen para cambiar el ángulo de vista"
          style={{
            position: 'relative',
            minHeight: '210px',
            borderRadius: '8px',
            border: '1px solid var(--color-border)',
            background:
              modoMaterial === 'termico'
                ? 'radial-gradient(circle at 30% 25%, #115E59 0%, #09090B 85%)'
                : modoMaterial === 'cad'
                ? 'linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%)'
                : 'radial-gradient(circle at 35% 20%, #FFFFFF 0%, #F4F4F5 90%)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            perspective: '900px',
            cursor: 'grab',
            padding: '16px',
          }}
        >
          {/* Grilla Espacial de Referencia (threejs-pbr-architect) */}
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 320 200"
            preserveAspectRatio="none"
            style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
          >
            <defs>
              <pattern id="pbrFloorGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path
                  d="M 20 0 L 0 0 0 20"
                  fill="none"
                  stroke={modoMaterial === 'termico' ? '#2DD4BF' : '#09090B'}
                  strokeWidth="0.75"
                  strokeOpacity={modoMaterial === 'cad' ? '0.12' : '0.06'}
                />
              </pattern>
              <radialGradient id="keyLightSpot" cx="30%" cy="20%" r="60%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="320" height="200" fill="url(#pbrFloorGrid)" />
            <rect width="320" height="200" fill="url(#keyLightSpot)" />
            {/* Ejes isométricos de plano base */}
            <line
              x1="20"
              y1="168"
              x2="300"
              y2="168"
              stroke={modoMaterial === 'termico' ? '#2DD4BF' : '#0D9488'}
              strokeOpacity="0.28"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
          </svg>

          {/* Ensamblaje 3D con rotación orbital */}
          <div
            style={{
              transform: `rotateX(${rotacion.x}deg) rotateY(${rotacion.y}deg)`,
              transformStyle: 'preserve-3d',
              transition: 'transform 0.14s ease-out',
              zIndex: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <ProductoRecetaFigura3D
              nombreProducto={nombreProducto}
              rubro={perfil}
              figuraId={figuraId}
              imagenPersonalizada={imagenPersonalizada}
              insumosEnReceta={insumosAsignados}
              tamaño={124}
            />
          </div>

          {/* Telemetría de Cámara 3D en esquina */}
          <div
            className="tabular-nums"
            style={{
              position: 'absolute',
              bottom: '8px',
              right: '10px',
              fontSize: '10px',
              fontWeight: 600,
              color: modoMaterial === 'termico' ? '#A1A1AA' : '#52525B',
              backgroundColor: modoMaterial === 'termico' ? 'rgba(9,9,11,0.75)' : 'rgba(255,255,255,0.85)',
              padding: '2px 6px',
              borderRadius: '4px',
              border: '1px solid rgba(0,0,0,0.06)',
              pointerEvents: 'none',
            }}
          >
            ÁNGULO X {rotacion.x}° • Y {rotacion.y}°
          </div>
        </div>

        {/* Panel de Telemetría de Costo Directo y Componentes 3D */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px',
            }}
          >
            <div style={{ padding: '10px 12px', borderRadius: '8px', backgroundColor: '#FAFAFA', border: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--color-muted-foreground)', display: 'block', textTransform: 'uppercase' }}>
                Costo Directo (CV)
              </span>
              <span className="tabular-nums" style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-foreground)' }}>
                {formatCLP(costoVariableConsolidado)}
              </span>
            </div>

            <div style={{ padding: '10px 12px', borderRadius: '8px', backgroundColor: '#FAFAFA', border: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--color-muted-foreground)', display: 'block', textTransform: 'uppercase' }}>
                Precio Venta (P)
              </span>
              <span className="tabular-nums" style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-foreground)' }}>
                {formatCLP(precioVentaConsolidado)}
              </span>
            </div>

            <div style={{ padding: '10px 12px', borderRadius: '8px', backgroundColor: 'var(--color-brand-50)', border: '1px solid var(--color-brand-200)' }}>
              <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--color-primary)', display: 'block', textTransform: 'uppercase' }}>
                Contribución ({porcentajeMargen}%)
              </span>
              <span className="tabular-nums" style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-primary)' }}>
                {formatCLP(margenContribucionUnitario)}
              </span>
            </div>
          </div>

          <p style={{ fontSize: '12.5px', color: 'var(--color-muted-foreground)', margin: 0, lineHeight: 1.5 }}>
            Cada unidad comercializada a <strong className="tabular-nums" style={{ color: 'var(--color-foreground)' }}>{formatCLP(precioVentaConsolidado)}</strong> absorbe <strong className="tabular-nums" style={{ color: 'var(--color-foreground)' }}>{formatCLP(costoVariableConsolidado)}</strong> en insumos directos y libera <strong className="tabular-nums" style={{ color: 'var(--color-primary)' }}>{formatCLP(margenContribucionUnitario)}</strong> para amortizar costos fijos.
          </p>

          {/* Galería de Nodos 3D Asignados */}
          {insumosAsignados.length > 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              {insumosAsignados.map((item, idx) => (
                <div
                  key={item.idAsignado || item.id || idx}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--color-border)',
                    padding: '3px 8px 3px 4px',
                    borderRadius: '6px',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                  }}
                >
                  <InsumoFigura3D nombre={item.nombre} tamaño={22} imagenFalUrl={item.imagenFalUrl} rubro={perfil} tipologia={item.tipologia} />
                  <span style={{ fontSize: '11.5px', fontWeight: 500, color: 'var(--color-foreground)' }}>
                    {item.cantidad > 1 ? <strong className="tabular-nums">{item.cantidad}x </strong> : null}
                    {item.nombre}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: '12px', color: 'var(--color-muted-foreground)' }}>
              Sin insumos asignados en la receta actual. Diríjase a Insumos & Costos Directos para agregar componentes.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
