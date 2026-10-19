import React from 'react';
import IconoAnimado3D from './IconoAnimado3D.jsx';
import InsumoFigura3D from './InsumoFigura3D.jsx';
import { obtenerSpecAnimadaProducto } from '../../lib/bibliotecaInsumos3D.js';

/**
 * Escaparate de Producto Terminado & Receta
 * Presentación hiperrealista animada en movimiento basada en especificación .JSON
 * (scene / materials / meshes / animations / interaction) o imagen subida por el usuario.
 */
export default function ProductoRecetaFigura3D({
  nombreProducto = 'Producto',
  rubro = 'restaurant',
  figuraId = '',
  imagenPersonalizada = '',
  insumosEnReceta = [],
  tamaño = 140,
  animando = false,
  alHacerClic,
}) {
  const specAnimada = obtenerSpecAnimadaProducto(nombreProducto, rubro, figuraId);

  return (
    <div
      onClick={alHacerClic}
      title={`${nombreProducto} • Presentación de Producto`}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: alHacerClic ? 'pointer' : 'default',
        transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
        userSelect: 'none',
        position: 'relative',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03) translateY(-2px)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1) translateY(0)')}
    >
      {/* Marco Isométrico / Pedestal Dark Tech */}
      <div
        style={{
          width: `${tamaño}px`,
          height: `${tamaño}px`,
          borderRadius: '22px',
          background: animando
            ? 'radial-gradient(circle at 35% 20%, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 60%, rgba(7, 10, 18, 1) 100%)'
            : 'radial-gradient(circle at 35% 20%, rgba(30, 41, 59, 0.85) 0%, rgba(15, 23, 42, 0.95) 60%, rgba(7, 10, 18, 1) 100%)',
          border: animando ? '2px solid var(--color-primary, #E2F800)' : '1.5px solid rgba(51, 65, 85, 0.8)',
          boxShadow: animando
            ? '0 18px 36px -6px rgba(0, 0, 0, 0.7), 0 0 20px rgba(226, 248, 0, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
            : '0 14px 28px -6px rgba(0, 0, 0, 0.55), 0 4px 10px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {imagenPersonalizada ? (
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundImage: `url(${imagenPersonalizada})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: 'inherit',
            }}
          />
        ) : (
          <IconoAnimado3D
            spec={specAnimada}
            tamaño={Math.round(tamaño * 0.94)}
            animado={true}
            interactivo={true}
            titulo={nombreProducto}
          />
        )}
      </div>

      {/* Miniaturas de los Insumos integrados a la receta */}
      {tamaño >= 80 && insumosEnReceta.length > 0 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            marginTop: '-14px',
            marginBottom: '6px',
            zIndex: 10,
            flexWrap: 'wrap',
            maxWidth: `${tamaño * 1.5}px`,
          }}
        >
          {insumosEnReceta.slice(0, 4).map((ing, idx) => (
            <div
              key={ing.idAsignado || ing.id || idx}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 4px 10px rgba(0,0,0,0.4)',
                border: '1.5px solid #334155',
                backgroundColor: '#111827',
                transform: `rotate(${((idx % 2 === 0 ? 1 : -1) * (idx + 1) * 2.5)}deg)`,
              }}
              title={`${ing.nombre} (${ing.cantidad || 1} ${ing.unidadMedida || 'un'})`}
            >
              <InsumoFigura3D
                nombre={ing.nombre}
                tamaño={32}
                rubro={rubro}
                tipologia={ing.tipologia}
                imagenPersonalizada={ing.imagenPersonalizada || ing.imagenUrl}
              />
            </div>
          ))}
          {insumosEnReceta.length > 4 && (
            <span
              style={{
                fontSize: '10px',
                fontWeight: 800,
                color: '#070A12',
                backgroundColor: 'var(--color-primary, #E2F800)',
                padding: '2px 6px',
                borderRadius: '10px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
              }}
            >
              +{insumosEnReceta.length - 4}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
