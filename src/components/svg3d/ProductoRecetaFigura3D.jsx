import React from 'react';
import ImagenJson3D from './ImagenJson3D.jsx';
import InsumoFigura3D from './InsumoFigura3D.jsx';
import { clasificarFiguraProductoReceta } from '../../lib/bibliotecaInsumos3D.js';

/**
 * Escaparate 3D de Producto Terminado & Receta
 * Reemplaza el concepto de la ollita con una figura 3D isométrica de alta gama
 * basada en especificación .JSON o una imagen real subida por el usuario.
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
  const specJson = clasificarFiguraProductoReceta(nombreProducto, rubro, figuraId);

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
      {/* Marco Isométrico 3D / Pedestal */}
      <div
        style={{
          width: `${tamaño}px`,
          height: `${tamaño}px`,
          borderRadius: '22px',
          background: animando
            ? 'radial-gradient(circle at 35% 20%, #FFFFFF 0%, #F0FDFA 50%, #CCFBF1 100%)'
            : 'radial-gradient(circle at 35% 20%, #FFFFFF 0%, #F8FAFC 55%, #E2E8F0 100%)',
          border: animando ? '2.5px solid #0D9488' : '2px solid #CBD5E1',
          boxShadow: animando
            ? '0 18px 36px -6px rgba(13, 148, 136, 0.35), 0 6px 14px rgba(15, 23, 42, 0.1), inset 0 2px 0 #FFFFFF'
            : '0 14px 28px -6px rgba(15, 23, 42, 0.14), 0 4px 10px rgba(15, 23, 42, 0.06), inset 0 2px 0 #FFFFFF, inset 0 -2px 0 rgba(148, 163, 184, 0.3)',
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
        ) : (
          <ImagenJson3D descriptorJson={specJson} tamaño={Math.round(tamaño * 0.95)} />
        )}
      </div>

      {/* Miniaturas de los Insumos integrados a la receta (solo cuando el marco es amplio) */}
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
                width: '30px',
                height: '30px',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 4px 10px rgba(0,0,0,0.18)',
                border: '1.5px solid #FFFFFF',
                backgroundColor: '#FFFFFF',
                transform: `rotate(${((idx % 2 === 0 ? 1 : -1) * (idx + 1) * 2.5)}deg)`,
              }}
              title={`${ing.nombre} (${ing.cantidad || 1} ${ing.unidadMedida || 'un'})`}
            >
              <InsumoFigura3D
                nombre={ing.nombre}
                tamaño={30}
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
                color: '#FFFFFF',
                backgroundColor: 'var(--color-primary)',
                padding: '2px 6px',
                borderRadius: '10px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
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
