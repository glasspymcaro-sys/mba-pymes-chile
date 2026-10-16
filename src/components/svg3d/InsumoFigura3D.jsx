import React from 'react';
import { clasificarTipologiaInsumo, TIPOLOGIAS_3D } from '../../lib/bibliotecaInsumos3D.js';

/**
 * Motor Nativo de Figuras 3D Animadas en SVG Puro (16 Tipologías Maestras para MVP)
 * Libre de llaves API externas. Cada insumo se renderiza como una escultura isométrica 3D
 * animada sobre un pedestal de estudio con sombra reactiva y reflejos especulares.
 */
export default function InsumoFigura3D({
  nombre = '',
  tamaño = 72,
  tipologia = null,
  rubro = 'restaurant',
  animando = false,
}) {
  const infoTipologia =
    (tipologia && TIPOLOGIAS_3D[tipologia]) ||
    clasificarTipologiaInsumo(nombre, rubro);

  const tipoId = infoTipologia.id;
  const uid = `svg3d_${tipoId}_${(nombre || 'item').replace(/[^a-zA-Z0-9]/g, '').slice(0, 8)}`;

  return (
    <div
      title={`${nombre || 'Insumo'} • ${infoTipologia.nombre}`}
      style={{
        width: tamaño,
        height: tamaño,
        borderRadius: Math.max(8, Math.round(tamaño * 0.2)),
        backgroundColor: '#FFFFFF',
        border: '1px solid rgba(0, 0, 0, 0.08)',
        boxShadow:
          '0 6px 14px -3px rgba(15, 118, 110, 0.14), 0 1px 3px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.95)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        transform: animando ? 'scale(1.12) rotate(3deg)' : 'scale(1)',
        transition: 'transform 0.24s cubic-bezier(0.34, 1.56, 0.64, 1)',
        userSelect: 'none',
      }}
    >
      <svg
        width={tamaño}
        height={tamaño}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', display: 'block', overflow: 'visible' }}
      >
        <defs>
          {/* Fondo de Estudio PBR */}
          <radialGradient id={`${uid}_studio`} cx="35%" cy="25%" r="75%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F4F4F5" />
          </radialGradient>

          {/* Sombra Proyectada Reactiva */}
          <radialGradient id={`${uid}_shadow`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#09090B" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#09090B" stopOpacity="0" />
          </radialGradient>

          {/* Gradientes Materiales 3D por Tipología */}
          <linearGradient id={`${uid}_green`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6EE7B7" />
            <stop offset="50%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#065F46" />
          </linearGradient>

          <radialGradient id={`${uid}_red`} cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FCA5A5" />
            <stop offset="40%" stopColor="#EF4444" />
            <stop offset="85%" stopColor="#991B1B" />
            <stop offset="100%" stopColor="#450A0A" />
          </radialGradient>

          <linearGradient id={`${uid}_orange`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDBA74" />
            <stop offset="50%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#9A3412" />
          </linearGradient>

          <linearGradient id={`${uid}_bread`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="45%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>

          <linearGradient id={`${uid}_cheese`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="60%" stopColor="#FACC15" />
            <stop offset="100%" stopColor="#CA8A04" />
          </linearGradient>

          <linearGradient id={`${uid}_blue`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#93C5FD" />
            <stop offset="50%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1E3A8A" />
          </linearGradient>

          <linearGradient id={`${uid}_metal`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#71717A" />
            <stop offset="45%" stopColor="#F4F4F5" />
            <stop offset="100%" stopColor="#27272A" />
          </linearGradient>

          <linearGradient id={`${uid}_teal`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5EEAD4" />
            <stop offset="50%" stopColor="#0D9488" />
            <stop offset="100%" stopColor="#115E59" />
          </linearGradient>

          <linearGradient id={`${uid}_indigo`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A5B4FC" />
            <stop offset="50%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#312E81" />
          </linearGradient>
        </defs>

        {/* 1. Fondo y Pedestal Isométrico de Estudio */}
        <rect width="120" height="120" fill={`url(#${uid}_studio)`} />
        <ellipse cx="60" cy="98" rx="42" ry="12" fill="#FFFFFF" stroke="#E4E4E7" strokeWidth="1.2" />
        <ellipse className="insumo-3d-shadow" cx="60" cy="96" rx="32" ry="9" fill={`url(#${uid}_shadow)`} />

        {/* 2. Grupo Escultórico 3D Animado (Levitación Suave) */}
        <g className="insumo-3d-float">
          {/* TIPOLOGÍA 1: VERDURA DE HOJA (Lechuga, Espinaca, Albahaca, Brócoli) */}
          {tipoId === 'verdura_hoja' && (
            <g>
              <path
                d="M 60 24 C 84 24 96 46 88 72 C 82 90 70 92 60 92 C 50 92 38 90 32 72 C 24 46 36 24 60 24 Z"
                fill={`url(#${uid}_green)`}
              />
              <path
                d="M 44 36 C 30 44 28 68 42 82 C 50 74 48 50 44 36 Z"
                fill="#34D399"
                opacity="0.85"
              />
              <path
                d="M 76 36 C 90 44 92 68 78 82 C 70 74 72 50 76 36 Z"
                fill="#059669"
                opacity="0.9"
              />
              {/* Nervaduras 3D */}
              <path d="M 60 32 L 60 88" stroke="#D1FAE5" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 60 50 L 46 40" stroke="#D1FAE5" strokeWidth="2" strokeLinecap="round" />
              <path d="M 60 62 L 75 52" stroke="#D1FAE5" strokeWidth="2" strokeLinecap="round" />
              <path d="M 60 72 L 45 62" stroke="#D1FAE5" strokeWidth="2" strokeLinecap="round" />
              {/* Gotas de rocío brillantes */}
              <circle className="insumo-3d-pulse" cx="48" cy="48" r="2.5" fill="#FFFFFF" />
              <circle className="insumo-3d-pulse" cx="72" cy="44" r="2" fill="#FFFFFF" />
            </g>
          )}

          {/* TIPOLOGÍA 2: VERDURA DE FRUTO (Tomate, Pimiento, Ají, Zapallo) */}
          {tipoId === 'verdura_fruto' && (
            <g>
              <circle cx="60" cy="62" r="29" fill={`url(#${uid}_red)`} />
              {/* Brillo especular */}
              <ellipse cx="48" cy="50" rx="8" ry="13" transform="rotate(-28 48 50)" fill="#FFFFFF" opacity="0.38" />
              {/* Cáliz verde tridimensional */}
              <path
                d="M 60 32 L 54 39 L 43 35 L 51 43 L 47 51 L 57 46 L 64 52 L 64 43 L 76 42 L 67 38 L 70 30 Z"
                fill="#059669"
              />
              <path d="M 60 33 Q 63 23 69 20" stroke="#064E3B" strokeWidth="2.8" strokeLinecap="round" fill="none" />
            </g>
          )}

          {/* TIPOLOGÍA 3: RAÍCES, BULBOS Y TUBÉRCULOS (Cebolla, Zanahoria, Ajo, Papa, Champiñón) */}
          {tipoId === 'verdura_raiz_bulbo' && (
            <g>
              {/* Cuerpo de Bulbo / Zanahoria 3D */}
              <path
                d="M 60 32 C 78 38 88 56 84 74 C 80 88 68 92 60 92 C 52 92 40 88 36 74 C 32 56 42 38 60 32 Z"
                fill={`url(#${uid}_orange)`}
              />
              {/* Anillos / Vetas orgánicas */}
              <path d="M 48 44 Q 60 66 54 88" stroke="#FFEDD5" strokeWidth="1.8" fill="none" opacity="0.55" />
              <path d="M 72 44 Q 60 66 66 88" stroke="#9A3412" strokeWidth="1.8" fill="none" opacity="0.55" />
              {/* Brotes verdes superiores */}
              <path d="M 60 33 Q 54 18 46 16" stroke="#10B981" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M 60 33 Q 60 16 60 13" stroke="#059669" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M 60 33 Q 66 18 74 16" stroke="#10B981" strokeWidth="3" strokeLinecap="round" fill="none" />
              <ellipse cx="48" cy="56" rx="6" ry="11" transform="rotate(-20 48 56)" fill="#FFFFFF" opacity="0.3" />
            </g>
          )}

          {/* TIPOLOGÍA 4: PALTA / OLEAGINOSAS (Palta Hass, Aceitunas) */}
          {tipoId === 'palta_oleaginosa' && (
            <g>
              {/* Corteza oscura Hass */}
              <path
                d="M 60 24 C 76 24 88 48 86 70 C 84 86 72 93 60 93 C 48 93 36 86 34 70 C 32 48 44 24 60 24 Z"
                fill="#14532D"
              />
              {/* Pulpa verde cremosa */}
              <path
                d="M 60 28 C 73 28 83 49 81 69 C 79 83 70 89 60 89 C 50 89 41 83 39 69 C 37 49 47 28 60 28 Z"
                fill="#BEF264"
              />
              <path
                d="M 60 32 C 70 32 78 50 77 67 C 75 79 68 85 60 85 C 52 85 45 79 43 67 C 42 50 50 32 60 32 Z"
                fill="#ECFCCB"
              />
              {/* Cuesco 3D Volumétrico Brillante */}
              <circle cx="60" cy="65" r="14" fill="#78350F" />
              <circle cx="56" cy="61" r="11" fill="#92400E" />
              <ellipse cx="53" cy="57" rx="4" ry="6" transform="rotate(-25 53 57)" fill="#FDE68A" opacity="0.55" />
            </g>
          )}

          {/* TIPOLOGÍA 5: FRUTA FRESCA (Manzana, Naranja, Limón, Frutilla) */}
          {tipoId === 'fruta_fresca' && (
            <g>
              <path
                d="M 60 34 C 76 22 94 34 90 62 C 88 82 70 90 60 88 C 50 90 32 82 30 62 C 26 34 44 22 60 34 Z"
                fill={`url(#${uid}_red)`}
              />
              <ellipse cx="46" cy="48" rx="8" ry="14" transform="rotate(-25 46 48)" fill="#FFFFFF" opacity="0.36" />
              <path d="M 60 35 C 62 23 68 17 73 15" stroke="#451A03" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M 63 25 Q 78 20 74 31 Q 65 30 63 25 Z" fill="#10B981" />
            </g>
          )}

          {/* TIPOLOGÍA 6: PANADERÍA Y MASAS (Pan Brioche, Marraqueta, Molde, Pizza) */}
          {tipoId === 'panaderia_masa' && (
            <g>
              <path
                d="M 28 68 Q 28 32 60 32 Q 92 32 92 68 Q 92 88 60 88 Q 28 88 28 68 Z"
                fill={`url(#${uid}_bread)`}
              />
              <path
                d="M 32 70 Q 60 84 88 70 Q 86 86 60 86 Q 34 86 32 70 Z"
                fill="#78350F"
                opacity="0.55"
              />
              <ellipse cx="50" cy="48" rx="18" ry="8" transform="rotate(-12 50 48)" fill="#FEF3C7" opacity="0.45" />
              <path d="M 44 52 Q 49 42 54 55" stroke="#451A03" strokeWidth="2.2" strokeLinecap="round" fill="none" />
              <path d="M 58 49 Q 63 39 68 52" stroke="#451A03" strokeWidth="2.2" strokeLinecap="round" fill="none" />
              <path d="M 72 52 Q 77 42 82 55" stroke="#451A03" strokeWidth="2.2" strokeLinecap="round" fill="none" />
              {/* Semillas de sésamo */}
              <circle cx="48" cy="42" r="1.5" fill="#FFFBEB" />
              <circle cx="62" cy="39" r="1.5" fill="#FFFBEB" />
              <circle cx="71" cy="44" r="1.5" fill="#FFFBEB" />
            </g>
          )}

          {/* TIPOLOGÍA 7: CARNE ROJA Y EMBUTIDOS (Vacuno, Lomo, Hamburguesa, Tocino) */}
          {tipoId === 'carne_roja_embutido' && (
            <g>
              <path
                d="M 28 62 Q 42 36 82 40 Q 98 54 92 74 Q 72 88 38 82 Q 22 76 28 62 Z"
                fill={`url(#${uid}_red)`}
              />
              <path d="M 28 62 Q 38 82 92 74 L 92 83 Q 38 91 28 71 Z" fill="#450A0A" />
              {/* Hueso / Veta de marmoleo */}
              <ellipse cx="50" cy="58" rx="9" ry="6" fill="#FFF1F2" stroke="#FECDD3" strokeWidth="2" />
              <circle cx="50" cy="58" r="3.5" fill="#FDA4AF" />
              {/* Marcas de parrilla */}
              <path d="M 66 50 L 82 62" stroke="#450A0A" strokeWidth="2.2" strokeLinecap="round" opacity="0.6" />
              <path d="M 58 60 L 74 72" stroke="#450A0A" strokeWidth="2.2" strokeLinecap="round" opacity="0.6" />
            </g>
          )}

          {/* TIPOLOGÍA 8: AVES, PESCADOS Y MARISCOS (Pollo, Salmón, Reineta, Camarón) */}
          {tipoId === 'ave_pescado_marisco' && (
            <g>
              <path
                d="M 30 64 Q 46 36 84 44 Q 94 58 86 76 Q 62 88 36 78 Q 24 72 30 64 Z"
                fill={`url(#${uid}_orange)`}
              />
              {/* Franjas características de filete / salmón */}
              <path d="M 44 48 Q 52 62 46 78" stroke="#FFEDD5" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.75" />
              <path d="M 58 46 Q 66 60 60 80" stroke="#FFEDD5" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.75" />
              <path d="M 72 48 Q 80 62 74 76" stroke="#FFEDD5" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.75" />
              {/* Rodaja de limón decorativa */}
              <circle cx="76" cy="46" r="9" fill="#FEF08A" stroke="#EAB308" strokeWidth="2" />
            </g>
          )}

          {/* TIPOLOGÍA 9: QUESOS, LÁCTEOS SÓLIDOS Y HUEVOS */}
          {tipoId === 'lacteo_queso_huevo' && (
            <g>
              <path d="M 28 68 L 82 36 L 92 70 Z" fill={`url(#${uid}_cheese)`} />
              <path d="M 28 68 L 92 70 L 92 84 L 28 82 Z" fill="#D97706" />
              <path d="M 82 36 L 92 70 L 92 84 L 82 50 Z" fill="#B45309" />
              <ellipse cx="58" cy="58" rx="6" ry="3.8" fill="#B45309" opacity="0.65" />
              <ellipse cx="74" cy="52" rx="4" ry="2.5" fill="#B45309" opacity="0.65" />
              <ellipse cx="48" cy="75" rx="4.5" ry="3" fill="#92400E" opacity="0.75" />
            </g>
          )}

          {/* TIPOLOGÍA 10: PAPAS FRITAS, GUARNICIONES Y SNACKS */}
          {tipoId === 'fritura_snack' && (
            <g>
              <rect x="42" y="28" width="8" height="36" rx="3" transform="rotate(-10 42 28)" fill="#FBBF24" stroke="#D97706" strokeWidth="1.2" />
              <rect x="52" y="22" width="8" height="40" rx="3" transform="rotate(-3 52 22)" fill="#FDE047" stroke="#D97706" strokeWidth="1.2" />
              <rect x="62" y="24" width="8" height="38" rx="3" transform="rotate(4 62 24)" fill="#FBBF24" stroke="#D97706" strokeWidth="1.2" />
              <rect x="72" y="28" width="8" height="36" rx="3" transform="rotate(11 72 28)" fill="#F59E0B" stroke="#B45309" strokeWidth="1.2" />
              <path d="M 38 52 L 82 52 L 76 86 Q 60 90 44 86 Z" fill={`url(#${uid}_red)`} />
              <path d="M 46 64 Q 60 70 74 64" stroke="#FEF08A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </g>
          )}

          {/* TIPOLOGÍA 11: ABARROTES, GRANOS, ACEITES Y SALSAS */}
          {tipoId === 'abarrote_grano_condimento' && (
            <g>
              <path d="M 36 44 L 60 32 L 84 44 L 60 56 Z" fill="#FDE68A" />
              <path d="M 36 44 L 60 56 L 60 88 L 36 76 Z" fill="#D97706" />
              <path d="M 60 56 L 84 44 L 84 76 L 60 88 Z" fill="#92400E" />
              {/* Ventana de grano / etiqueta */}
              <path d="M 42 56 L 55 62 L 55 76 L 42 70 Z" fill="#FFFBEB" />
              <circle cx="48" cy="66" r="3" fill="#F59E0B" />
            </g>
          )}

          {/* TIPOLOGÍA 12: BEBIDAS, LÁCTEOS LÍQUIDOS Y BOTELLAS */}
          {tipoId === 'bebida_lacteo_liquido' && (
            <g>
              <path d="M 40 44 L 60 34 L 80 44 L 60 54 Z" fill="#DBEAFE" />
              <path d="M 40 44 L 60 54 L 60 88 L 40 78 Z" fill={`url(#${uid}_blue)`} />
              <path d="M 60 54 L 80 44 L 80 78 L 60 88 Z" fill="#1E3A8A" />
              <ellipse cx="60" cy="32" rx="8" ry="4.5" fill="#60A5FA" />
              <path d="M 52 32 L 52 26 Q 60 22 68 26 L 68 32 Z" fill="#1D4ED8" />
              <path d="M 45 56 L 55 61 L 55 76 L 45 71 Z" fill="#FFFFFF" opacity="0.88" />
            </g>
          )}

          {/* TIPOLOGÍA 13: CAFÉ, TÉ, INFUSIONES Y CACAO */}
          {tipoId === 'cafe_infusion_cacao' && (
            <g>
              <ellipse cx="60" cy="82" rx="30" ry="9" fill="#D4D4D8" />
              <path d="M 36 54 Q 36 80 60 80 Q 84 80 84 54 Z" fill="#FFFFFF" stroke="#E4E4E7" strokeWidth="1.5" />
              <path d="M 82 58 C 94 58 94 72 81 72" stroke="#D4D4D8" strokeWidth="4" strokeLinecap="round" fill="none" />
              <ellipse cx="60" cy="54" rx="24" ry="8" fill="#F4F4F5" />
              <ellipse cx="60" cy="54" rx="20" ry="6" fill="#451A03" />
              {/* Vapor animado */}
              <path className="insumo-3d-pulse" d="M 52 42 Q 48 32 54 24" stroke="#A1A1AA" strokeWidth="2" strokeLinecap="round" fill="none" />
              <path className="insumo-3d-pulse" d="M 66 40 Q 70 30 64 22" stroke="#A1A1AA" strokeWidth="2" strokeLinecap="round" fill="none" />
            </g>
          )}

          {/* TIPOLOGÍA 14: FERRETERÍA, HERRAMIENTAS Y EMPAQUES */}
          {tipoId === 'ferreteria_herramienta' && (
            <g>
              <path d="M 38 38 L 60 26 L 82 38 L 60 50 Z" fill={`url(#${uid}_metal)`} />
              <path d="M 38 38 L 60 50 L 60 58 L 38 46 Z" fill="#52525B" />
              <path d="M 60 50 L 82 38 L 82 46 L 60 58 Z" fill="#27272A" />
              <rect x="50" y="56" width="20" height="32" rx="3" fill={`url(#${uid}_metal)`} />
              <path d="M 50 64 L 70 67" stroke="#27272A" strokeWidth="2.2" />
              <path d="M 50 72 L 70 75" stroke="#27272A" strokeWidth="2.2" />
              <path d="M 50 80 L 70 83" stroke="#27272A" strokeWidth="2.2" />
            </g>
          )}

          {/* TIPOLOGÍA 15: SERVICIOS DE CONSULTORÍA, DISEÑO Y GESTIÓN */}
          {tipoId === 'servicios_consultoria_diseno' && (
            <g>
              <path d="M 32 50 L 60 34 L 88 50 L 60 66 Z" fill={`url(#${uid}_teal)`} />
              <path d="M 32 50 L 60 66 L 60 88 L 32 72 Z" fill="#0F766E" />
              <path d="M 60 66 L 88 50 L 88 72 L 60 88 Z" fill="#134E4A" />
              <circle className="insumo-3d-pulse" cx="60" cy="50" r="6" fill="#FFFFFF" />
              <path d="M 46 50 L 60 42 L 74 50 L 60 58 Z" stroke="#CCFBF1" strokeWidth="1.5" fill="none" />
            </g>
          )}

          {/* TIPOLOGÍA 16: DESARROLLO DE SOFTWARE, CLOUD & TI */}
          {tipoId === 'servicios_software_cloud' && (
            <g>
              <path d="M 32 48 L 60 32 L 88 48 L 60 64 Z" fill={`url(#${uid}_indigo)`} />
              <path d="M 32 48 L 60 64 L 60 88 L 32 72 Z" fill="#4338CA" />
              <path d="M 60 64 L 88 48 L 88 72 L 60 88 Z" fill="#312E81" />
              <path d="M 52 46 L 46 50 L 52 54" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <path d="M 68 46 L 74 50 L 68 54" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <line x1="62" y1="44" x2="58" y2="56" stroke="#A5B4FC" strokeWidth="2" strokeLinecap="round" />
            </g>
          )}
        </g>
      </svg>

      {/* Brillo especular de estudio PBR (Key Light) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0) 48%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
