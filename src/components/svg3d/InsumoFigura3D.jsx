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
      title={`${nombre} • ${descriptorJson.tipologiaNombre} [JSON 3D]`}
      style={{
        width: `${tamaño}px`,
        height: `${tamaño}px`,
        borderRadius: `${Math.max(8, Math.round(tamaño * 0.16))}px`,
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at 35% 25%, #FFFFFF 0%, #F4F4F5 100%)',
        border: '1.5px solid rgba(15, 23, 42, 0.1)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.95), 0 2px 6px rgba(15, 23, 42, 0.06)',
        overflow: 'hidden',
        userSelect: 'none',
        flexShrink: 0,
      }}
    >
      <ImagenJson3D descriptorJson={descriptorJson} tamaño={Math.round(tamaño * 0.92)} />
    </div>
  );
}
