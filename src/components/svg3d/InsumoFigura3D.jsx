import React from 'react';
import ImagenJson3D from './ImagenJson3D.jsx';
import { obtenerJsonDescriptorInsumo } from '../../lib/bibliotecaInsumos3D.js';

/**
 * Renderizador de Insumos 3D basado en Especificación .JSON (figurasInsumos3D.json)
 * Soporta además imagen personalizada subida por el usuario (imagenPersonalizada).
 */
export default function InsumoFigura3D({
  nombre = 'Insumo',
  tamaño = 72,
  rubro = 'restaurant',
  tipologia = '',
  imagenPersonalizada = '',
}) {
  const descriptorJson = obtenerJsonDescriptorInsumo(nombre, rubro, tipologia);

  if (imagenPersonalizada) {
    return (
      <div
        title={`${nombre} • Imagen Personalizada del Usuario`}
        style={{
          width: `${tamaño}px`,
          height: `${tamaño}px`,
          borderRadius: `${Math.max(8, Math.round(tamaño * 0.18))}px`,
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle at 35% 25%, #FFFFFF 0%, #F1F5F9 100%)',
          border: '1.5px solid #94A3B8',
          boxShadow: '0 4px 10px rgba(15, 23, 42, 0.12), inset 0 1px 0 #FFFFFF',
          overflow: 'hidden',
          userSelect: 'none',
          flexShrink: 0,
        }}
      >
        <div
          className="insumo-3d-float"
          style={{
            width: '100%',
            height: '100%',
            backgroundImage: `url(${imagenPersonalizada})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: 'inherit',
          }}
        />
      </div>
    );
  }

  return (
    <div
      title={`${nombre} • ${descriptorJson.tipologiaNombre}`}
      style={{
        width: `${tamaño}px`,
        height: `${tamaño}px`,
        borderRadius: `${Math.max(10, Math.round(tamaño * 0.18))}px`,
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at 35% 20%, #FFFFFF 0%, #F8FAFC 55%, #EDF2F7 100%)',
        border: '1.5px solid #CBD5E1',
        boxShadow:
          '0 6px 14px -2px rgba(15, 23, 42, 0.08), 0 2px 4px rgba(15, 23, 42, 0.04), inset 0 1.5px 0 #FFFFFF, inset 0 -1.5px 0 rgba(148, 163, 184, 0.25)',
        overflow: 'hidden',
        userSelect: 'none',
        flexShrink: 0,
        transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px) scale(1.04)';
        e.currentTarget.style.boxShadow =
          '0 12px 20px -4px rgba(15, 23, 42, 0.14), 0 4px 8px rgba(15, 23, 42, 0.06), inset 0 1.5px 0 #FFFFFF';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow =
          '0 6px 14px -2px rgba(15, 23, 42, 0.08), 0 2px 4px rgba(15, 23, 42, 0.04), inset 0 1.5px 0 #FFFFFF, inset 0 -1.5px 0 rgba(148, 163, 184, 0.25)';
      }}
    >
      <ImagenJson3D descriptorJson={descriptorJson} tamaño={Math.round(tamaño * 0.94)} />
    </div>
  );
}
