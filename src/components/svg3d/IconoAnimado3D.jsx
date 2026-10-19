import React, { useId, useMemo, useRef, useState } from 'react';

/**
 * MOTOR DE RENDERIZADO DE ICONOGRAFIA ANIMADA DESDE JSON
 * Consume especificaciones scene / materials / meshes / animations / interaction
 * (src/data/iconosAnimados3D.json) y las dibuja como SVG con animaciones CSS
 * aceleradas por GPU, IDs aislados con React.useId(), inclinacion al cursor y
 * destello especular reactivo. Sin librerias externas.
 */

const EASING = {
  easeInOutSine: 'cubic-bezier(0.37, 0, 0.63, 1)',
  linear: 'linear',
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  easeOut: 'cubic-bezier(0.22, 1, 0.36, 1)',
};

// Materiales base disponibles en todos los iconos
const MATERIALES_BASE = {
  '@shadow': {
    type: 'radialGradient', fx: '50%', fy: '50%', r: '50%',
    stops: [
      { offset: '0%', color: '#000000', opacity: 0.75 },
      { offset: '55%', color: '#000000', opacity: 0.35 },
      { offset: '100%', color: '#000000', opacity: 0 },
    ],
  },
  '@rim': {
    type: 'linearGradient', angle: 135,
    stops: [
      { offset: '0%', color: '#FFFFFF', opacity: 0.9 },
      { offset: '45%', color: '#FFFFFF', opacity: 0.25 },
      { offset: '100%', color: '#FFFFFF', opacity: 0 },
    ],
  },
  '@gloss': {
    type: 'radialGradient', fx: '40%', fy: '35%', r: '50%',
    stops: [
      { offset: '0%', color: '#FFFFFF', opacity: 0.95 },
      { offset: '60%', color: '#FFFFFF', opacity: 0.25 },
      { offset: '100%', color: '#FFFFFF', opacity: 0 },
    ],
  },
  '@glass': {
    type: 'linearGradient', angle: 145,
    stops: [
      { offset: '0%', color: '#FFFFFF', opacity: 0.42 },
      { offset: '50%', color: '#E2E8F0', opacity: 0.14 },
      { offset: '100%', color: '#94A3B8', opacity: 0.06 },
    ],
  },
};

const limpiarId = (s) => String(s).replace(/[^a-zA-Z0-9_-]/g, '');

function muestrear(arr, t) {
  if (!Array.isArray(arr) || arr.length === 0) return null;
  if (arr.length === 1) return arr[0];
  const pos = t * (arr.length - 1);
  const i = Math.floor(pos);
  if (i >= arr.length - 1) return arr[arr.length - 1];
  const f = pos - i;
  return arr[i] + (arr[i + 1] - arr[i]) * f;
}

function construirKeyframes(nombre, kf = {}) {
  const props = Object.keys(kf).filter((k) => Array.isArray(kf[k]) && kf[k].length);
  if (!props.length) return '';
  const n = Math.max(2, ...props.map((p) => kf[p].length));
  const v = (p, t, def) => (kf[p] ? muestrear(kf[p], t) : def);
  let css = `@keyframes ${nombre}{`;
  for (let i = 0; i < n; i += 1) {
    const t = i / (n - 1);
    const tf = [];
    if (kf.translateX || kf.translateY) tf.push(`translate(${v('translateX', t, 0)}px, ${v('translateY', t, 0)}px)`);
    if (kf.rotate) tf.push(`rotate(${v('rotate', t, 0)}deg)`);
    if (kf.scale) tf.push(`scale(${v('scale', t, 1)})`);
    if (kf.scaleX || kf.scaleY) tf.push(`scale(${v('scaleX', t, 1)}, ${v('scaleY', t, 1)})`);
    let decl = tf.length ? `transform:${tf.join(' ')};` : '';
    if (kf.opacity) decl += `opacity:${v('opacity', t, 1)};`;
    if (kf.dashOffset) decl += `stroke-dashoffset:${v('dashOffset', t, 0)};`;
    css += `${+(t * 100).toFixed(2)}%{${decl}}`;
  }
  return `${css}}`;
}

function coordenadasAngulo(angle = 90) {
  const rad = (angle * Math.PI) / 180;
  const dx = Math.cos(rad) * 50;
  const dy = Math.sin(rad) * 50;
  return { x1: `${50 - dx}%`, y1: `${50 - dy}%`, x2: `${50 + dx}%`, y2: `${50 + dy}%` };
}

function Gradiente({ id, mat }) {
  const stops = (mat.stops || []).map((s, i) => (
    <stop key={i} offset={s.offset} stopColor={s.color} stopOpacity={s.opacity ?? 1} />
  ));
  if (mat.type === 'radialGradient') {
    return (
      <radialGradient id={id} cx="50%" cy="50%" r={mat.r || '70%'} fx={mat.fx || '35%'} fy={mat.fy || '30%'}>
        {stops}
      </radialGradient>
    );
  }
  return <linearGradient id={id} {...coordenadasAngulo(mat.angle)}>{stops}</linearGradient>;
}

/** Prepara las mallas: ordena por zIndex y genera los @keyframes con nombres aislados */
function prepararEscena(spec, uid) {
  const keyframes = [];
  const procesar = (lista = []) =>
    lista
      .filter(Boolean)
      .map((m, idx) => ({ m, idx }))
      .sort((a, b) => (a.m.zIndex ?? 1) - (b.m.zIndex ?? 1) || a.idx - b.idx)
      .map(({ m }) => {
        const out = { ...m };
        if (m.animation && m.animation.keyframes) {
          const nombre = `${uid}-k-${limpiarId(m.id)}`;
          const css = construirKeyframes(nombre, m.animation.keyframes);
          if (css) {
            keyframes.push(css);
            out._animName = nombre;
          }
        }
        if (m.children) out.children = procesar(m.children);
        return out;
      });
  return { mallas: procesar(spec.meshes), css: keyframes.join('\n') };
}

function Malla({ m, resolver, uid }) {
  const style = {};
  if (m._animName) {
    const a = m.animation;
    const repeticiones = a.repeat === 'once' ? 1 : 'infinite';
    style.animation = `${m._animName} ${a.duration || 3}s ${EASING[a.easing] || a.easing || EASING.easeInOutSine} ${a.delay || 0}s ${repeticiones} ${a.direction || 'normal'} both`;
    style.transformBox = 'fill-box';
    style.transformOrigin = a.origin || 'center';
    style.willChange = 'transform, opacity';
  }

  const comunes = {
    fill: resolver(m.fill) ?? (m.type === 'group' ? undefined : 'none'),
    stroke: resolver(m.stroke),
    strokeWidth: m.strokeWidth,
    strokeLinecap: m.strokeLinecap,
    strokeLinejoin: m.strokeLinejoin,
    strokeDasharray: m.strokeDasharray,
    opacity: m.opacity,
    filter: m.filter ? `url(#${uid}-f-${m.filter})` : undefined,
    style: Object.keys(style).length ? style : undefined,
  };

  const g = m.geometry || {};
  switch (m.type) {
    case 'group':
      return (
        <g style={comunes.style} opacity={m.opacity}>
          {(m.children || []).map((h) => <Malla key={h.id} m={h} resolver={resolver} uid={uid} />)}
        </g>
      );
    case 'path':
      return <path d={m.d} {...comunes} />;
    case 'ellipse':
      return <ellipse cx={g.cx} cy={g.cy} rx={g.rx} ry={g.ry} {...comunes} />;
    case 'circle':
      return <circle cx={g.cx} cy={g.cy} r={g.r} {...comunes} />;
    case 'rect':
      return <rect x={g.x} y={g.y} width={g.width} height={g.height} rx={g.rx} {...comunes} />;
    case 'polygon':
      return <polygon points={g.points} {...comunes} />;
    default:
      return null;
  }
}

export default function IconoAnimado3D({ spec, tamaño = 64, animado = true, interactivo = true, titulo }) {
  const rawId = useId();
  const uid = useMemo(() => `ia${limpiarId(rawId)}${limpiarId(spec?.iconId || 'x')}`, [rawId, spec]);
  const [tilt, setTilt] = useState({ x: 0, y: 0, gx: 30, gy: 22, activo: false });
  const contenedorRef = useRef(null);

  const escena = useMemo(() => (spec ? prepararEscena(spec, uid) : { mallas: [], css: '' }), [spec, uid]);
  if (!spec) return null;

  const materiales = { ...MATERIALES_BASE, ...(spec.materials || {}) };
  const idMaterial = (nombre) => `${uid}-m-${limpiarId(nombre.replace('@', 'base-'))}`;
  const resolver = (valor) => {
    if (valor === undefined || valor === null) return undefined;
    if (typeof valor !== 'string') return valor;
    if (valor.startsWith('#') || valor.startsWith('rgb') || valor === 'none' || valor.startsWith('url(')) return valor;
    if (materiales[valor]) return `url(#${idMaterial(valor)})`;
    return valor;
  };

  const inter = spec.interaction || {};
  const permiteInclinar = interactivo && tamaño >= 40;
  const maxX = inter.tiltMaxAngleX ?? 14;
  const maxY = inter.tiltMaxAngleY ?? 16;

  const alMover = (e) => {
    if (!permiteInclinar || !contenedorRef.current) return;
    const r = contenedorRef.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: -py * maxX * 2, y: px * maxY * 2, gx: (px + 0.5) * 100, gy: (py + 0.5) * 100, activo: true });
  };
  const alSalir = () => setTilt((t) => ({ ...t, x: 0, y: 0, activo: false }));

  const cssEscena = `${escena.css}
.${uid}-root:not(.${uid}-on) *{animation-play-state:paused !important;}
@media (prefers-reduced-motion: reduce){.${uid}-root *{animation:none !important;}}`;

  return (
    <div
      ref={contenedorRef}
      title={titulo || spec.nombre}
      role="img"
      aria-label={titulo || spec.nombre}
      onPointerMove={alMover}
      onPointerLeave={alSalir}
      className={`${uid}-root${animado ? ` ${uid}-on` : ''}`}
      style={{
        width: `${tamaño}px`,
        height: `${tamaño}px`,
        display: 'inline-flex',
        flexShrink: 0,
        perspective: `${spec.scene?.perspective || 800}px`,
        userSelect: 'none',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: tilt.activo ? 'transform 0.08s linear' : 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
          willChange: permiteInclinar ? 'transform' : undefined,
        }}
      >
        <svg
          width={tamaño}
          height={tamaño}
          viewBox={spec.scene?.viewBox || '0 0 128 128'}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ overflow: 'visible', display: 'block' }}
        >
          <style>{cssEscena}</style>
          <defs>
            <filter id={`${uid}-f-sombra`} x="-35%" y="-35%" width="170%" height="175%">
              <feGaussianBlur stdDeviation="2.2" />
            </filter>
            <filter id={`${uid}-f-brillo`} x="-35%" y="-35%" width="170%" height="175%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {Object.entries(materiales).map(([nombre, mat]) => (
              <Gradiente key={nombre} id={idMaterial(nombre)} mat={mat} />
            ))}
          </defs>
          {escena.mallas.map((m) => <Malla key={m.id} m={m} resolver={resolver} uid={uid} />)}
        </svg>

        {permiteInclinar && (
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              borderRadius: 'inherit',
              opacity: tilt.activo ? 1 : 0,
              transition: 'opacity 0.3s ease',
              background: `radial-gradient(circle at ${tilt.gx}% ${tilt.gy}%, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 55%)`,
              mixBlendMode: 'screen',
            }}
          />
        )}
      </div>
    </div>
  );
}
