import React from 'react';
import { obtenerIconoJson3D } from '../../lib/iconografiaJson3D.js';

function renderizarNodoJson(nodo, idx) {
  if (!nodo) return null;
  const tipo = (nodo.tipo || '').trim();

  if (tipo === 'group') {
    return (
      <g key={idx} className={nodo.clase || undefined} transform={nodo.transform || undefined}>
        {(nodo.hijos || []).map((hijo, subIdx) => renderizarNodoJson(hijo, `${idx}_${subIdx}`))}
      </g>
    );
  }

  if (tipo === 'path') {
    return (
      <path
        key={idx}
        d={nodo.d}
        fill={nodo.fill || 'none'}
        stroke={nodo.stroke}
        strokeWidth={nodo.strokeWidth}
        strokeLinecap={nodo.strokeLinecap}
        strokeLinejoin={nodo.strokeLinejoin}
        opacity={nodo.opacity}
        className={nodo.clase}
      />
    );
  }

  if (tipo === 'ellipse') {
    return (
      <ellipse
        key={idx}
        cx={nodo.cx}
        cy={nodo.cy}
        rx={nodo.rx}
        ry={nodo.ry}
        fill={nodo.fill}
        stroke={nodo.stroke}
        strokeWidth={nodo.strokeWidth}
        opacity={nodo.opacity}
        className={nodo.clase}
      />
    );
  }

  if (tipo === 'circle') {
    return (
      <circle
        key={idx}
        cx={nodo.cx}
        cy={nodo.cy}
        r={nodo.r}
        fill={nodo.fill}
        stroke={nodo.stroke}
        strokeWidth={nodo.strokeWidth}
        opacity={nodo.opacity}
        className={nodo.clase}
      />
    );
  }

  if (tipo === 'rect') {
    return (
      <rect
        key={idx}
        x={nodo.x}
        y={nodo.y}
        width={nodo.width}
        height={nodo.height}
        rx={nodo.rx}
        fill={nodo.fill}
        stroke={nodo.stroke}
        strokeWidth={nodo.strokeWidth}
        opacity={nodo.opacity}
        className={nodo.clase}
      />
    );
  }

  if (tipo === 'polygon') {
    return (
      <polygon
        key={idx}
        points={nodo.points}
        fill={nodo.fill}
        stroke={nodo.stroke}
        strokeWidth={nodo.strokeWidth}
        opacity={nodo.opacity}
        className={nodo.clase}
      />
    );
  }

  return null;
}

/**
 * Renderizador Directo de Imágenes e Iconografía 3D desde su Especificación JSON
 * Sin librerías de terceros ni llamadas de red.
 */
export default function ImagenJson3D({ idIcono = 'sueldo_objetivo', descriptorJson = null, tamaño = 44 }) {
  const spec = descriptorJson || obtenerIconoJson3D(idIcono);
  const uid = `${spec.id}_${tamaño}`;

  const reescribirFill = (valor) => {
    if (!valor || typeof valor !== 'string') return valor;
    if (valor.startsWith('url(#')) {
      const idGrad = valor.slice(5, -1);
      return `url(#${idGrad}_${uid})`;
    }
    return valor;
  };

  const clonarCapasConUid = (capas = []) =>
    capas.map((c) => ({
      ...c,
      fill: reescribirFill(c.fill),
      stroke: reescribirFill(c.stroke),
      hijos: c.hijos ? clonarCapasConUid(c.hijos) : undefined,
    }));

  const capasProcesadas = clonarCapasConUid(spec.capas);

  return (
    <div
      title={`${spec.nombre} [JSON 3D Render]`}
      style={{
        width: `${tamaño}px`,
        height: `${tamaño}px`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        userSelect: 'none',
      }}
    >
      <svg
        width={tamaño}
        height={tamaño}
        viewBox={spec.viewBox || '0 0 120 120'}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {(spec.gradientes || []).map((g) => {
            if (g.tipo === 'radialGradient') {
              return (
                <radialGradient key={g.id} id={`${g.id}_${uid}`} cx={g.cx || '50%'} cy={g.cy || '50%'} r={g.r || '50%'}>
                  {(g.stops || []).map((st, i) => (
                    <stop key={i} offset={st.offset} stopColor={st.color} stopOpacity={st.opacity ?? 1} />
                  ))}
                </radialGradient>
              );
            }
            return (
              <linearGradient
                key={g.id}
                id={`${g.id}_${uid}`}
                x1={g.x1 || '0%'}
                y1={g.y1 || '0%'}
                x2={g.x2 || '100%'}
                y2={g.y2 || '100%'}
              >
                {(g.stops || []).map((st, i) => (
                  <stop key={i} offset={st.offset} stopColor={st.color} stopOpacity={st.opacity ?? 1} />
                ))}
              </linearGradient>
            );
          })}
        </defs>
        {capasProcesadas.map((capa, idx) => renderizarNodoJson(capa, idx))}
      </svg>
    </div>
  );
}
