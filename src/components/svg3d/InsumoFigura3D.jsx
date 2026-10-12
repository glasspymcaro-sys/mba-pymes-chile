import React from 'react';

/**
 * Renderizador de Figuras 3D Profesionales para Insumos
 * Renderiza o bien la imagen generada por fal.ai o figuras vectoriales 3D isométricas de alta definición en SVG puro.
 */
export default function InsumoFigura3D({ nombre = '', tamaño = 72, imagenFalUrl = null, animando = false }) {
  const nombreLimpio = (nombre || '').trim().toLowerCase();

  // Si cuenta con imagen 3D de fal.ai, renderizarla con marco tridimensional neumórfico
  if (imagenFalUrl) {
    return (
      <div
        style={{
          width: tamaño,
          height: tamaño,
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: 'var(--neu-pressed)',
          backgroundColor: 'var(--bg-neumorphic)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4px',
          boxSizing: 'border-box',
          transform: animando ? 'scale(1.1) rotate(4deg)' : 'scale(1)',
          transition: 'transform 0.25s ease',
        }}
      >
        <img
          src={imagenFalUrl}
          alt={nombre}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '12px',
          }}
        />
      </div>
    );
  }

  // Identificador de tipo de insumo según palabras clave
  const esManzana = nombreLimpio.includes('manzana') || nombreLimpio.includes('fruta');
  const esPan = nombreLimpio.includes('pan') || nombreLimpio.includes('harina') || nombreLimpio.includes('masa');
  const esCarne = nombreLimpio.includes('carne') || nombreLimpio.includes('pollo') || nombreLimpio.includes('vacuno') || nombreLimpio.includes('proteina');
  const esTomate = nombreLimpio.includes('tomate') || nombreLimpio.includes('verdura') || nombreLimpio.includes('ensalada');
  const esLeche = nombreLimpio.includes('leche') || nombreLimpio.includes('crema') || nombreLimpio.includes('bebida') || nombreLimpio.includes('jugo');
  const esCafe = nombreLimpio.includes('cafe') || nombreLimpio.includes('café') || nombreLimpio.includes('te') || nombreLimpio.includes('té');
  const esQueso = nombreLimpio.includes('queso') || nombreLimpio.includes('lacteo') || nombreLimpio.includes('lácteo');
  const esFerreteria = nombreLimpio.includes('tornillo') || nombreLimpio.includes('clavo') || nombreLimpio.includes('metal') || nombreLimpio.includes('disco');
  const esHerramienta = nombreLimpio.includes('herramienta') || nombreLimpio.includes('llave') || nombreLimpio.includes('taladro');
  const esSoftware = nombreLimpio.includes('software') || nombreLimpio.includes('licencia') || nombreLimpio.includes('hosting') || nombreLimpio.includes('cloud') || nombreLimpio.includes('web');
  const esConsultoria = nombreLimpio.includes('consultor') || nombreLimpio.includes('hora') || nombreLimpio.includes('asesor') || nombreLimpio.includes('honorario');

  // Generador de color dinámico para insumos no estándar
  const hash = nombreLimpio.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const coloresProcedurales = [
    { base: '#3182ce', claro: '#63b3ed', oscuro: '#1a365d' },
    { base: '#38a169', claro: '#68d391', oscuro: '#1c4532' },
    { base: '#d69e2e', claro: '#f6e05e', oscuro: '#744210' },
    { base: '#805ad5', claro: '#b794f4', oscuro: '#44337a' },
    { base: '#dd6b20', claro: '#fbd38d', oscuro: '#7b341e' },
    { base: '#e53e3e', claro: '#feb2b2', oscuro: '#742a2a' },
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
        transform: animando ? 'scale(1.12) translateY(-4px)' : 'scale(1)',
        transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      <svg
        width={tamaño}
        height={tamaño}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible', filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.14))' }}
      >
        <defs>
          {/* Sombra de suelo genérica */}
          <radialGradient id="sombraItemSuelo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1a202c" stopOpacity="0.38" />
            <stop offset="100%" stopColor="#1a202c" stopOpacity="0" />
          </radialGradient>

          {/* Manzana 3D */}
          <radialGradient id="manzanaGrad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#feb2b2" />
            <stop offset="25%" stopColor="#e53e3e" />
            <stop offset="70%" stopColor="#9b2c2c" />
            <stop offset="100%" stopColor="#4c1d1d" />
          </radialGradient>

          {/* Tomate 3D */}
          <radialGradient id="tomateGrad" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#feb2b2" />
            <stop offset="35%" stopColor="#f56565" />
            <stop offset="80%" stopColor="#c53030" />
            <stop offset="100%" stopColor="#63171b" />
          </radialGradient>

          {/* Pan 3D */}
          <linearGradient id="panGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbd38d" />
            <stop offset="30%" stopColor="#dd6b20" />
            <stop offset="85%" stopColor="#9c4221" />
            <stop offset="100%" stopColor="#55220c" />
          </linearGradient>

          {/* Queso 3D */}
          <linearGradient id="quesoTop" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#faf089" />
            <stop offset="100%" stopColor="#ecc94b" />
          </linearGradient>

          {/* Carne 3D */}
          <linearGradient id="carneTop" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fc8181" />
            <stop offset="60%" stopColor="#e53e3e" />
            <stop offset="100%" stopColor="#9b2c2c" />
          </linearGradient>

          {/* Metal Ferretería 3D */}
          <linearGradient id="metalPerno" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#718096" />
            <stop offset="40%" stopColor="#edf2f7" />
            <stop offset="75%" stopColor="#a0aec0" />
            <stop offset="100%" stopColor="#2d3748" />
          </linearGradient>

          {/* Cubo Procedural */}
          <linearGradient id="cuboTop" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colorSel.claro} />
            <stop offset="100%" stopColor={colorSel.base} />
          </linearGradient>
          <linearGradient id="cuboLeft" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colorSel.base} />
            <stop offset="100%" stopColor={colorSel.oscuro} />
          </linearGradient>
        </defs>

        {/* 1. Sombra Suelo */}
        <ellipse cx="50" cy="85" rx="32" ry="9" fill="url(#sombraItemSuelo)" />

        {/* 2. Renderizado por Tipo de Insumo */}
        {esManzana && (
          <g>
            {/* Cuerpo de la manzana 3D */}
            <path
              d="M 50 30 C 65 18 86 28 84 55 C 82 76 62 84 50 84 C 38 84 18 76 16 55 C 14 28 35 18 50 30 Z"
              fill="url(#manzanaGrad)"
            />
            {/* Brillo especular 3D de luz */}
            <ellipse cx="38" cy="42" rx="9" ry="14" transform="rotate(-25 38 42)" fill="#ffffff" opacity="0.32" />
            {/* Tallo 3D leñoso */}
            <path d="M 50 32 C 52 20 60 14 65 12" stroke="#55220c" strokeWidth="3" strokeLinecap="round" fill="none" />
            {/* Hoja verde 3D */}
            <path d="M 54 22 Q 68 18 64 28 Q 56 26 54 22 Z" fill="#38a169" />
          </g>
        )}

        {esTomate && !esManzana && (
          <g>
            <circle cx="50" cy="54" r="28" fill="url(#tomateGrad)" />
            <ellipse cx="40" cy="42" rx="7" ry="12" transform="rotate(-30 40 42)" fill="#ffffff" opacity="0.35" />
            {/* Sépalos verdes superiores */}
            <path d="M 50 26 L 45 32 L 36 29 L 43 35 L 39 42 L 48 38 L 54 44 L 54 36 L 63 35 L 56 31 L 58 24 Z" fill="#2f855a" />
            <path d="M 50 27 L 50 18" stroke="#1c4532" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        )}

        {esPan && (
          <g>
            {/* Hogaza de pan 3D redondeada */}
            <path d="M 20 58 Q 50 24 80 58 Q 78 78 50 78 Q 22 78 20 58 Z" fill="url(#panGrad)" />
            {/* Cortes diagonales de corteza */}
            <path d="M 34 50 Q 38 42 42 54" stroke="#55220c" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M 48 46 Q 52 38 56 50" stroke="#55220c" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M 62 48 Q 66 40 70 52" stroke="#55220c" strokeWidth="2" strokeLinecap="round" fill="none" />
            <ellipse cx="45" cy="44" rx="14" ry="6" fill="#fbd38d" opacity="0.3" />
          </g>
        )}

        {esCarne && (
          <g>
            {/* Filete 3D isométrico */}
            <path d="M 22 55 Q 35 32 68 36 Q 84 50 78 68 Q 60 80 32 75 Q 16 70 22 55 Z" fill="url(#carneTop)" />
            <path d="M 22 55 Q 32 75 78 68 L 78 76 Q 32 83 22 63 Z" fill="#4c1d1d" />
            {/* Hueso / Veta blanca central */}
            <ellipse cx="42" cy="52" rx="7" ry="5" fill="#f7fafc" stroke="#e2e8f0" strokeWidth="1.5" />
            <circle cx="42" cy="52" r="3" fill="#cbd5e0" />
          </g>
        )}

        {esQueso && (
          <g>
            {/* Cuña de queso 3D isométrica */}
            <path d="M 20 62 L 75 32 L 85 64 Z" fill="url(#quesoTop)" />
            <path d="M 20 62 L 85 64 L 85 76 L 20 74 Z" fill="#d69e2e" />
            <path d="M 75 32 L 85 64 L 85 76 L 75 44 Z" fill="#b7791f" />
            {/* Agujeros del queso */}
            <ellipse cx="50" cy="52" rx="5" ry="3" fill="#d69e2e" />
            <ellipse cx="65" cy="48" rx="3.5" ry="2" fill="#d69e2e" />
            <ellipse cx="40" cy="68" rx="4" ry="2.5" fill="#b7791f" />
          </g>
        )}

        {esLeche && (
          <g>
            {/* Botella / Caja tetrapack 3D */}
            <path d="M 36 40 L 50 32 L 64 40 L 50 48 Z" fill="#edf2f7" />
            <path d="M 36 40 L 50 48 L 50 82 L 36 74 Z" fill="#3182ce" />
            <path d="M 50 48 L 64 40 L 64 74 L 50 82 Z" fill="#1a365d" />
            {/* Tapa cilíndrica superior */}
            <ellipse cx="50" cy="30" rx="7" ry="4" fill="#63b3ed" />
            <path d="M 43 30 L 43 26 Q 50 22 57 26 L 57 30 Z" fill="#2b6cb0" />
          </g>
        )}

        {esCafe && (
          <g>
            {/* Plato de taza */}
            <ellipse cx="50" cy="74" rx="32" ry="10" fill="#a0aec0" />
            <ellipse cx="50" cy="73" rx="30" ry="9" fill="#edf2f7" />
            {/* Taza 3D */}
            <path d="M 28 50 Q 28 72 50 72 Q 72 72 72 50 Z" fill="#cbd5e0" />
            <ellipse cx="50" cy="50" rx="22" ry="8" fill="#e2e8f0" />
            <ellipse cx="50" cy="50" rx="19" ry="6.5" fill="#55220c" />
            {/* Vapor sutil */}
            <path d="M 45 42 Q 40 32 46 24" stroke="#a0aec0" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6" />
            <path d="M 54 40 Q 60 30 52 22" stroke="#cbd5e0" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6" />
          </g>
        )}

        {esFerreteria && (
          <g>
            {/* Perno roscado 3D */}
            <path d="M 35 34 L 50 24 L 65 34 L 50 44 Z" fill="url(#metalPerno)" />
            <path d="M 35 34 L 50 44 L 50 49 L 35 39 Z" fill="#4a5568" />
            <path d="M 50 44 L 65 34 L 65 39 L 50 49 Z" fill="#2d3748" />
            {/* Vástago del tornillo */}
            <path d="M 44 49 L 56 49 L 56 78 L 44 78 Z" fill="url(#metalPerno)" />
            {/* Roscas */}
            <path d="M 44 55 L 56 57" stroke="#2d3748" strokeWidth="2" />
            <path d="M 44 63 L 56 65" stroke="#2d3748" strokeWidth="2" />
            <path d="M 44 71 L 56 73" stroke="#2d3748" strokeWidth="2" />
          </g>
        )}

        {esSoftware && (
          <g>
            {/* Cubo holográfico de datos 3D */}
            <path d="M 25 45 L 50 30 L 75 45 L 50 60 Z" fill="#4299e1" opacity="0.8" />
            <path d="M 25 45 L 50 60 L 50 82 L 25 67 Z" fill="#2b6cb0" />
            <path d="M 50 60 L 75 45 L 75 67 L 50 82 Z" fill="#1a365d" />
            {/* Conectores luminosos */}
            <circle cx="50" cy="45" r="4" fill="#bee3f8" />
            <path d="M 35 55 L 50 65 L 65 55" stroke="#90cdf4" strokeWidth="1.5" fill="none" />
          </g>
        )}

        {/* Genérico / Procedural para cualquier otro nombre */}
        {!esManzana && !esTomate && !esPan && !esCarne && !esQueso && !esLeche && !esCafe && !esFerreteria && !esSoftware && (
          <g>
            {/* Cubo Isométrico 3D con Bisel */}
            <path d="M 22 45 L 50 28 L 78 45 L 50 62 Z" fill="url(#cuboTop)" />
            <path d="M 22 45 L 50 62 L 50 82 L 22 65 Z" fill="url(#cuboLeft)" />
            <path d="M 50 62 L 78 45 L 78 65 L 50 82 Z" fill={colorSel.oscuro} />
            {/* Letra inicial grabada en la cara superior */}
            <text
              x="50"
              y="48"
              textAnchor="middle"
              fill="#ffffff"
              fontSize="14"
              fontWeight="900"
              style={{ letterSpacing: '0.5px' }}
            >
              {(nombre || 'I').substring(0, 2).toUpperCase()}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
