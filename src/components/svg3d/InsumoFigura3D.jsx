import React, { useState, useEffect } from 'react';
import { obtenerUrlActivo3D } from '../../lib/fal3d.js';
import SkeletonAnatomico from '../common/SkeletonAnatomico.jsx';

/**
 * Renderizador de Figuras 3D Profesionales con Iluminación PBR (threejs-pbr-architect)
 * Incluye Skeleton Anatómico anti-CLS (core-architecture-hardener) y reflejo especular de estudio.
 */
export default function InsumoFigura3D({
  nombre = '',
  tamaño = 72,
  imagenFalUrl = null,
  rubro = 'restaurant',
  animando = false,
}) {
  const [errorCarga, setErrorCarga] = useState(false);
  const [cargandoImg, setCargandoImg] = useState(true);
  const nombreLimpio = (nombre || '').trim().toLowerCase();

  const urlFinal = imagenFalUrl || (!errorCarga ? obtenerUrlActivo3D(nombre, rubro) : null);

  useEffect(() => {
    setErrorCarga(false);
    setCargandoImg(true);
  }, [urlFinal, nombre]);

  if (urlFinal && !errorCarga) {
    return (
      <div
        style={{
          width: tamaño,
          height: tamaño,
          borderRadius: Math.max(8, Math.round(tamaño * 0.2)),
          overflow: 'hidden',
          boxShadow: '0 6px 14px -3px rgba(15, 118, 110, 0.14), 0 1px 3px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.95)',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2px',
          boxSizing: 'border-box',
          position: 'relative',
          transform: animando ? 'scale(1.1) rotate(2deg)' : 'scale(1)',
          transition: 'transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {cargandoImg && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
            <SkeletonAnatomico
              width="100%"
              height="100%"
              borderRadius={`${Math.max(6, Math.round(tamaño * 0.18))}px`}
              variant="3d-card"
            />
          </div>
        )}
        <img
          src={urlFinal}
          alt={nombre}
          loading="lazy"
          onLoad={() => setCargandoImg(false)}
          onError={() => {
            setCargandoImg(false);
            setErrorCarga(true);
          }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: Math.max(6, Math.round(tamaño * 0.17)),
            userSelect: 'none',
            pointerEvents: 'none',
            opacity: cargandoImg ? 0 : 1,
            transition: 'opacity 0.2s ease',
          }}
        />
        {/* Brillo especular de estudio PBR (Key Light) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 45%)',
            pointerEvents: 'none',
          }}
        />
      </div>
    );
  }

  // Fallback Vectorial CAD PBR 3D de Alta Precisión
  const esManzana = nombreLimpio.includes('manzana') || nombreLimpio.includes('fruta');
  const esPan = nombreLimpio.includes('pan') || nombreLimpio.includes('harina') || nombreLimpio.includes('masa');
  const esCarne = nombreLimpio.includes('carne') || nombreLimpio.includes('pollo') || nombreLimpio.includes('vacuno') || nombreLimpio.includes('proteina');
  const esTomate = nombreLimpio.includes('tomate') || nombreLimpio.includes('verdura') || nombreLimpio.includes('ensalada');
  const esLeche = nombreLimpio.includes('leche') || nombreLimpio.includes('crema') || nombreLimpio.includes('bebida') || nombreLimpio.includes('jugo');
  const esCafe = nombreLimpio.includes('cafe') || nombreLimpio.includes('café') || nombreLimpio.includes('te') || nombreLimpio.includes('té');
  const esQueso = nombreLimpio.includes('queso') || nombreLimpio.includes('lacteo') || nombreLimpio.includes('lácteo');
  const esFerreteria = nombreLimpio.includes('tornillo') || nombreLimpio.includes('clavo') || nombreLimpio.includes('metal') || nombreLimpio.includes('disco');
  const esSoftware = nombreLimpio.includes('software') || nombreLimpio.includes('licencia') || nombreLimpio.includes('hosting') || nombreLimpio.includes('cloud') || nombreLimpio.includes('web');

  const hash = nombreLimpio.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const coloresProcedurales = [
    { base: '#0D9488', claro: '#5EEAD4', oscuro: '#115E59' },
    { base: '#2563EB', claro: '#93C5FD', oscuro: '#1E3A8A' },
    { base: '#D97706', claro: '#FCD34D', oscuro: '#78350F' },
    { base: '#059669', claro: '#6EE7B7', oscuro: '#064E3B' },
    { base: '#4F46E5', claro: '#A5B4FC', oscuro: '#312E81' },
    { base: '#DC2626', claro: '#FCA5A5', oscuro: '#7F1D1D' },
  ];
  const colorSel = coloresProcedurales[hash % coloresProcedurales.length];

  return (
    <div
      style={{
        width: tamaño,
        height: tamaño,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: animando ? 'scale(1.1) translateY(-3px)' : 'scale(1)',
        transition: 'transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      <svg
        width={tamaño}
        height={tamaño}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible', filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.12))' }}
      >
        <defs>
          <radialGradient id="sombraItemSuelo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#09090B" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#09090B" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="manzanaGrad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FCA5A5" />
            <stop offset="25%" stopColor="#EF4444" />
            <stop offset="70%" stopColor="#991B1B" />
            <stop offset="100%" stopColor="#450A0A" />
          </radialGradient>

          <radialGradient id="tomateGrad" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FCA5A5" />
            <stop offset="35%" stopColor="#F87171" />
            <stop offset="80%" stopColor="#DC2626" />
            <stop offset="100%" stopColor="#7F1D1D" />
          </radialGradient>

          <linearGradient id="panGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="30%" stopColor="#D97706" />
            <stop offset="85%" stopColor="#92400E" />
            <stop offset="100%" stopColor="#451A03" />
          </linearGradient>

          <linearGradient id="quesoTop" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="100%" stopColor="#EAB308" />
          </linearGradient>

          <linearGradient id="carneTop" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F87171" />
            <stop offset="60%" stopColor="#DC2626" />
            <stop offset="100%" stopColor="#991B1B" />
          </linearGradient>

          <linearGradient id="metalPerno" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#71717A" />
            <stop offset="40%" stopColor="#F4F4F5" />
            <stop offset="75%" stopColor="#A1A1AA" />
            <stop offset="100%" stopColor="#27272A" />
          </linearGradient>

          <linearGradient id="cuboTop" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colorSel.claro} />
            <stop offset="100%" stopColor={colorSel.base} />
          </linearGradient>
          <linearGradient id="cuboLeft" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colorSel.base} />
            <stop offset="100%" stopColor={colorSel.oscuro} />
          </linearGradient>
        </defs>

        <ellipse cx="50" cy="85" rx="32" ry="9" fill="url(#sombraItemSuelo)" />

        {esManzana && (
          <g>
            <path
              d="M 50 30 C 65 18 86 28 84 55 C 82 76 62 84 50 84 C 38 84 18 76 16 55 C 14 28 35 18 50 30 Z"
              fill="url(#manzanaGrad)"
            />
            <ellipse cx="38" cy="42" rx="9" ry="14" transform="rotate(-25 38 42)" fill="#FFFFFF" opacity="0.32" />
            <path d="M 50 32 C 52 20 60 14 65 12" stroke="#451A03" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M 54 22 Q 68 18 64 28 Q 56 26 54 22 Z" fill="#059669" />
          </g>
        )}

        {esTomate && !esManzana && (
          <g>
            <circle cx="50" cy="54" r="28" fill="url(#tomateGrad)" />
            <ellipse cx="40" cy="42" rx="7" ry="12" transform="rotate(-30 40 42)" fill="#FFFFFF" opacity="0.35" />
            <path d="M 50 26 L 45 32 L 36 29 L 43 35 L 39 42 L 48 38 L 54 44 L 54 36 L 63 35 L 56 31 L 58 24 Z" fill="#059669" />
            <path d="M 50 27 L 50 18" stroke="#064E3B" strokeWidth="2" strokeLinecap="round" />
          </g>
        )}

        {esPan && (
          <g>
            <path d="M 20 58 Q 50 24 80 58 Q 78 78 50 78 Q 22 78 20 58 Z" fill="url(#panGrad)" />
            <path d="M 34 50 Q 38 42 42 54" stroke="#451A03" strokeWidth="1.75" strokeLinecap="round" fill="none" />
            <path d="M 48 46 Q 52 38 56 50" stroke="#451A03" strokeWidth="1.75" strokeLinecap="round" fill="none" />
            <path d="M 62 48 Q 66 40 70 52" stroke="#451A03" strokeWidth="1.75" strokeLinecap="round" fill="none" />
            <ellipse cx="45" cy="44" rx="14" ry="6" fill="#FDE68A" opacity="0.3" />
          </g>
        )}

        {esCarne && (
          <g>
            <path d="M 22 55 Q 35 32 68 36 Q 84 50 78 68 Q 60 80 32 75 Q 16 70 22 55 Z" fill="url(#carneTop)" />
            <path d="M 22 55 Q 32 75 78 68 L 78 76 Q 32 83 22 63 Z" fill="#450A0A" />
            <ellipse cx="42" cy="52" rx="7" ry="5" fill="#FAFAFA" stroke="#E4E4E7" strokeWidth="1.5" />
            <circle cx="42" cy="52" r="3" fill="#D4D4D8" />
          </g>
        )}

        {esQueso && (
          <g>
            <path d="M 20 62 L 75 32 L 85 64 Z" fill="url(#quesoTop)" />
            <path d="M 20 62 L 85 64 L 85 76 L 20 74 Z" fill="#CA8A04" />
            <path d="M 75 32 L 85 64 L 85 76 L 75 44 Z" fill="#A16207" />
            <ellipse cx="50" cy="52" rx="5" ry="3" fill="#CA8A04" />
            <ellipse cx="65" cy="48" rx="3.5" ry="2" fill="#CA8A04" />
            <ellipse cx="40" cy="68" rx="4" ry="2.5" fill="#A16207" />
          </g>
        )}

        {esLeche && (
          <g>
            <path d="M 36 40 L 50 32 L 64 40 L 50 48 Z" fill="#F4F4F5" />
            <path d="M 36 40 L 50 48 L 50 82 L 36 74 Z" fill="#2563EB" />
            <path d="M 50 48 L 64 40 L 64 74 L 50 82 Z" fill="#1E3A8A" />
            <ellipse cx="50" cy="30" rx="7" ry="4" fill="#60A5FA" />
            <path d="M 43 30 L 43 26 Q 50 22 57 26 L 57 30 Z" fill="#1D4ED8" />
          </g>
        )}

        {esCafe && (
          <g>
            <ellipse cx="50" cy="74" rx="32" ry="10" fill="#A1A1AA" />
            <ellipse cx="50" cy="73" rx="30" ry="9" fill="#F4F4F5" />
            <path d="M 28 50 Q 28 72 50 72 Q 72 72 72 50 Z" fill="#D4D4D8" />
            <ellipse cx="50" cy="50" rx="22" ry="8" fill="#E4E4E7" />
            <ellipse cx="50" cy="50" rx="19" ry="6.5" fill="#451A03" />
          </g>
        )}

        {esFerreteria && (
          <g>
            <path d="M 35 34 L 50 24 L 65 34 L 50 44 Z" fill="url(#metalPerno)" />
            <path d="M 35 34 L 50 44 L 50 49 L 35 39 Z" fill="#52525B" />
            <path d="M 50 44 L 65 34 L 65 39 L 50 49 Z" fill="#27272A" />
            <path d="M 44 49 L 56 49 L 56 78 L 44 78 Z" fill="url(#metalPerno)" />
          </g>
        )}

        {esSoftware && (
          <g>
            <path d="M 25 45 L 50 30 L 75 45 L 50 60 Z" fill="#0D9488" opacity="0.88" />
            <path d="M 25 45 L 50 60 L 50 82 L 25 67 Z" fill="#0F766E" />
            <path d="M 50 60 L 75 45 L 75 67 L 50 82 Z" fill="#134E4A" />
            <circle cx="50" cy="45" r="4" fill="#CCFBF1" />
          </g>
        )}

        {!esManzana && !esTomate && !esPan && !esCarne && !esQueso && !esLeche && !esCafe && !esFerreteria && !esSoftware && (
          <g>
            <path d="M 22 45 L 50 28 L 78 45 L 50 62 Z" fill="url(#cuboTop)" />
            <path d="M 22 45 L 50 62 L 50 82 L 22 65 Z" fill="url(#cuboLeft)" />
            <path d="M 50 62 L 78 45 L 78 65 L 50 82 Z" fill={colorSel.oscuro} />
            <text
              x="50"
              y="48"
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="14"
              fontWeight="800"
              style={{ letterSpacing: '0.5px' }}
            >
              {(nombre || 'IN').substring(0, 2).toUpperCase()}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
