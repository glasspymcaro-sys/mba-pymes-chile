import React from 'react';
import IconoAnimado3D from './IconoAnimado3D.jsx';
import { obtenerSpecAnimadaInsumo } from '../../lib/bibliotecaInsumos3D.js';

/**
 * Renderizador de Insumos Animados basado en Especificación JSON Hiperrealista
 * (scene / materials / meshes / animations / interaction).
 * Soporta además imagen personalizada subida por el usuario.
 */
export default function InsumoFigura3D({
  nombre = 'Insumo',
  tamaño = 72,
  rubro = 'restaurant',
  tipologia = '',
  imagenPersonalizada = '',
  imagenFalUrl = '',
  animando = true,
}) {
  const foto = imagenPersonalizada || imagenFalUrl;
  const specAnimada = obtenerSpecAnimadaInsumo(nombre, rubro, tipologia);

  if (foto) {
    return (
      <div
        title={`${nombre} • Imagen del Usuario`}
        style={{
          width: `${tamaño}px`,
          height: `${tamaño}px`,
          borderRadius: `${Math.max(8, Math.round(tamaño * 0.18))}px`,
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle at 35% 25%, #1E293B 0%, #0F172A 100%)',
          border: '1.5px solid #334155',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
          overflow: 'hidden',
          userSelect: 'none',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundImage: `url(${foto})`,
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
      title={`${nombre} • ${specAnimada.nombre || 'Insumo'}`}
      style={{
        width: `${tamaño}px`,
        height: `${tamaño}px`,
        borderRadius: `${Math.max(10, Math.round(tamaño * 0.18))}px`,
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at 35% 20%, rgba(30, 41, 59, 0.75) 0%, rgba(15, 23, 42, 0.95) 100%)',
        border: '1.5px solid rgba(51, 65, 85, 0.65)',
        boxShadow:
          '0 6px 14px -2px rgba(0, 0, 0, 0.35), 0 2px 4px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
        overflow: 'hidden',
        userSelect: 'none',
        flexShrink: 0,
        transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.25s ease, box-shadow 0.25s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px) scale(1.04)';
        e.currentTarget.style.borderColor = 'var(--color-primary, #E2F800)';
        e.currentTarget.style.boxShadow =
          '0 12px 22px -3px rgba(0, 0, 0, 0.5), 0 0 12px rgba(226, 248, 0, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.borderColor = 'rgba(51, 65, 85, 0.65)';
        e.currentTarget.style.boxShadow =
          '0 6px 14px -2px rgba(0, 0, 0, 0.35), 0 2px 4px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.12)';
      }}
    >
      <IconoAnimado3D
        spec={specAnimada}
        tamaño={Math.round(tamaño * 0.94)}
        animado={animando !== false}
        interactivo={true}
        titulo={nombre}
      />
    </div>
  );
}
