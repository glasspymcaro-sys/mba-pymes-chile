/**
 * MOTOR DECLARATIVO DE ICONOGRAFÍA Y ACTIVOS 3D BASADOS EN ESPECIFICACIÓN JSON
 * Cada imagen e ícono profesional de la aplicación se define mediante un grafo de escena JSON
 * estructurado (iluminación PBR, gradientes multicapa, geometría vectorial 3D y metadatos ópticos),
 * sin depender de librerías externas ni APIs con límites.
 */

export const CATALOGO_JSON_ICONOS_3D = {
  sueldo_objetivo: {
    id: 'sueldo_objetivo',
    nombre: 'Bóveda Ejecutiva de Sueldo Objetivo 3D',
    categoria: 'finanzas_estrategicas',
    viewBox: '0 0 120 120',
    metadatosPBR: { rugosidad: 0.18, metalicidad: 0.75, elevacionZ: 14 },
    gradientes: [
      {
        id: 'grad_boveda_base',
        tipo: 'linearGradient',
        x1: '0%', y1: '0%', x2: '100%', y2: '100%',
        stops: [
          { offset: '0%', color: '#0F766E' },
          { offset: '55%', color: '#115E59' },
          { offset: '100%', color: '#042F2E' },
        ],
      },
      {
        id: 'grad_lingote_oro',
        tipo: 'linearGradient',
        x1: '0%', y1: '0%', x2: '100%', y2: '100%',
        stops: [
          { offset: '0%', color: '#FEF08A' },
          { offset: '45%', color: '#F59E0B' },
          { offset: '100%', color: '#B45309' },
        ],
      },
      {
        id: 'grad_billete_esmeralda',
        tipo: 'linearGradient',
        x1: '0%', y1: '0%', x2: '100%', y2: '100%',
        stops: [
          { offset: '0%', color: '#6EE7B7' },
          { offset: '50%', color: '#10B981' },
          { offset: '100%', color: '#047857' },
        ],
      },
    ],
    capas: [
      { tipo: 'ellipse', cx: 60, cy: 100, rx: 44, ry: 12, fill: '#09090B', opacity: 0.18, clase: 'insumo-3d-shadow' },
      {
        tipo: ' group',
        clase: 'insumo-3d-float',
        hijos: [
          // Base isométrica de maletín/bóveda
          { tipo: 'path', d: 'M 22 66 L 60 44 L 98 66 L 60 88 Z', fill: 'url(#grad_boveda_base)', stroke: '#5EEAD4', strokeWidth: 1.5 },
          { tipo: 'path', d: 'M 22 66 L 60 88 L 60 100 L 22 78 Z', fill: '#0F766E' },
          { tipo: 'path', d: 'M 60 88 L 98 66 L 98 78 L 60 100 Z', fill: '#042F2E' },
          // Bloque de Liquidez Esmeralda Flotante
          { tipo: 'path', d: 'M 34 52 L 60 36 L 86 52 L 60 68 Z', fill: 'url(#grad_billete_esmeralda)', stroke: '#D1FAE5', strokeWidth: 1.5 },
          { tipo: 'path', d: 'M 34 52 L 60 68 L 60 76 L 34 60 Z', fill: '#059669' },
          { tipo: 'path', d: 'M 60 68 L 86 52 L 86 60 L 60 76 Z', fill: '#065F46' },
          // Lingote Superior Dorado
          { tipo: 'path', d: 'M 46 38 L 60 28 L 74 38 L 60 48 Z', fill: 'url(#grad_lingote_oro)', stroke: '#FFFBEB', strokeWidth: 1.5 },
          { tipo: 'path', d: 'M 46 38 L 60 48 L 60 54 L 46 44 Z', fill: '#D97706' },
          { tipo: 'path', d: 'M 60 48 L 74 38 L 74 44 L 60 54 Z', fill: '#92400E' },
          { tipo: 'circle', cx: 60, cy: 38, r: 3.5, fill: '#FFFBEB', clase: 'insumo-3d-pulse' },
        ],
      },
    ],
  },

  fugas_margen: {
    id: 'fugas_margen',
    nombre: 'Escáner de Fugas de Margen & Costos Ocultos 3D',
    categoria: 'pricing_inteligente',
    viewBox: '0 0 120 120',
    metadatosPBR: { rugosidad: 0.22, metalicidad: 0.65, elevacionZ: 12 },
    gradientes: [
      {
        id: 'grad_embudo_metal',
        tipo: 'linearGradient',
        x1: '0%', y1: '0%', x2: '100%', y2: '100%',
        stops: [
          { offset: '0%', color: '#E4E4E7' },
          { offset: '50%', color: '#71717A' },
          { offset: '100%', color: '#27272A' },
        ],
      },
      {
        id: 'grad_alerta_fuga',
        tipo: 'radialGradient',
        cx: '35%', cy: '35%', r: '65%',
        stops: [
          { offset: '0%', color: '#FCA5A5' },
          { offset: '55%', color: '#EF4444' },
          { offset: '100%', color: '#991B1B' },
        ],
      },
    ],
    capas: [
      { tipo: 'ellipse', cx: 60, cy: 100, rx: 42, ry: 11, fill: '#09090B', opacity: 0.18, clase: 'insumo-3d-shadow' },
      {
        tipo: 'group',
        clase: 'insumo-3d-float',
        hijos: [
          { tipo: 'path', d: 'M 26 36 L 94 36 L 70 68 L 70 92 L 50 92 L 50 68 Z', fill: 'url(#grad_embudo_metal)', stroke: '#F4F4F5', strokeWidth: 1.5 },
          { tipo: 'ellipse', cx: 60, cy: 36, rx: 34, ry: 10, fill: '#18181B', stroke: '#A1A1AA', strokeWidth: 2 },
          { tipo: 'ellipse', cx: 60, cy: 36, rx: 26, ry: 7, fill: '#14B8A6', opacity: 0.85 },
          // Fugas laterales rojas (IVA / POS / Delivery)
          { tipo: 'circle', cx: 34, cy: 64, r: 7, fill: 'url(#grad_alerta_fuga)', clase: 'insumo-3d-pulse' },
          { tipo: 'circle', cx: 86, cy: 64, r: 7, fill: 'url(#grad_alerta_fuga)', clase: 'insumo-3d-pulse' },
          { tipo: 'path', d: 'M 46 58 L 36 62', stroke: '#EF4444', strokeWidth: 2.5, strokeLinecap: 'round' },
          { tipo: 'path', d: 'M 74 58 L 84 62', stroke: '#EF4444', strokeWidth: 2.5, strokeLinecap: 'round' },
          // Gota de margen neto limpio abajo
          { tipo: 'circle', cx: 60, cy: 96, r: 6, fill: '#10B981', stroke: '#ECFDF5', strokeWidth: 1.5 },
        ],
      },
    ],
  },

  iva_estado: {
    id: 'iva_estado',
    nombre: 'Columna Tributaria IVA 19% Estado 3D',
    categoria: 'impuestos',
    viewBox: '0 0 120 120',
    metadatosPBR: { rugosidad: 0.3, metalicidad: 0.4, elevacionZ: 10 },
    gradientes: [
      {
        id: 'grad_iva_bloque',
        tipo: 'linearGradient',
        x1: '0%', y1: '0%', x2: '100%', y2: '100%',
        stops: [
          { offset: '0%', color: '#93C5FD' },
          { offset: '55%', color: '#2563EB' },
          { offset: '100%', color: '#1E3A8A' },
        ],
      },
    ],
    capas: [
      { tipo: 'ellipse', cx: 60, cy: 100, rx: 40, ry: 10, fill: '#09090B', opacity: 0.16, clase: 'insumo-3d-shadow' },
      {
        tipo: 'group',
        clase: 'insumo-3d-float',
        hijos: [
          // Frontón clásico isométrico
          { tipo: 'path', d: 'M 24 44 L 60 22 L 96 44 Z', fill: 'url(#grad_iva_bloque)', stroke: '#DBEAFE', strokeWidth: 1.5 },
          { tipo: 'rect', x: 28, y: 44, width: 64, height: 8, rx: 2, fill: '#1D4ED8' },
          // Columnas 3D
          { tipo: 'rect', x: 34, y: 52, width: 10, height: 34, rx: 2, fill: '#E2E8F0', stroke: '#94A3B8', strokeWidth: 1 },
          { tipo: 'rect', x: 55, y: 52, width: 10, height: 34, rx: 2, fill: '#E2E8F0', stroke: '#94A3B8', strokeWidth: 1 },
          { tipo: 'rect', x: 76, y: 52, width: 10, height: 34, rx: 2, fill: '#E2E8F0', stroke: '#94A3B8', strokeWidth: 1 },
          { tipo: 'rect', x: 24, y: 86, width: 72, height: 10, rx: 3, fill: '#1E3A8A' },
          { tipo: 'circle', cx: 60, cy: 36, r: 4, fill: '#FEF08A', clase: 'insumo-3d-pulse' },
        ],
      },
    ],
  },

  pos_tarjeta: {
    id: 'pos_tarjeta',
    nombre: 'Terminal POS Transbank / MercadoPago 3D',
    categoria: 'medios_pago',
    viewBox: '0 0 120 120',
    metadatosPBR: { rugosidad: 0.2, metalicidad: 0.7, elevacionZ: 12 },
    gradientes: [
      {
        id: 'grad_pos_body',
        tipo: 'linearGradient',
        x1: '0%', y1: '0%', x2: '100%', y2: '100%',
        stops: [
          { offset: '0%', color: '#3F3F46' },
          { offset: '100%', color: '#09090B' },
        ],
      },
      {
        id: 'grad_card_chip',
        tipo: 'linearGradient',
        x1: '0%', y1: '0%', x2: '100%', y2: '100%',
        stops: [
          { offset: '0%', color: '#38BDF8' },
          { offset: '100%', color: '#0284C7' },
        ],
      },
    ],
    capas: [
      { tipo: 'ellipse', cx: 60, cy: 100, rx: 40, ry: 10, fill: '#09090B', opacity: 0.16, clase: 'insumo-3d-shadow' },
      {
        tipo: 'group',
        clase: 'insumo-3d-float',
        hijos: [
          { tipo: 'rect', x: 34, y: 26, width: 44, height: 68, rx: 8, fill: 'url(#grad_pos_body)', stroke: '#71717A', strokeWidth: 2 },
          { tipo: 'rect', x: 40, y: 34, width: 32, height: 22, rx: 4, fill: '#10B981' },
          // Tarjeta insertada en ángulo 3D
          { tipo: 'rect', x: 54, y: 46, width: 42, height: 28, rx: 5, fill: 'url(#grad_card_chip)', stroke: '#E0F2FE', strokeWidth: 1.5 },
          { tipo: 'rect', x: 60, y: 54, width: 9, height: 7, rx: 1.5, fill: '#FACC15' },
          // Teclado POS
          { tipo: 'circle', cx: 45, cy: 66, r: 2.5, fill: '#A1A1AA' },
          { tipo: 'circle', cx: 55, cy: 66, r: 2.5, fill: '#A1A1AA' },
          { tipo: 'circle', cx: 45, cy: 76, r: 2.5, fill: '#A1A1AA' },
          { tipo: 'circle', cx: 55, cy: 76, r: 2.5, fill: '#22C55E', clase: 'insumo-3d-pulse' },
        ],
      },
    ],
  },

  delivery_moto: {
    id: 'delivery_moto',
    nombre: 'Mochila Térmica & Flota Delivery Apps 3D',
    categoria: 'canales_venta',
    viewBox: '0 0 120 120',
    metadatosPBR: { rugosidad: 0.25, metalicidad: 0.5, elevacionZ: 13 },
    gradientes: [
      {
        id: 'grad_delivery_cube',
        tipo: 'linearGradient',
        x1: '0%', y1: '0%', x2: '100%', y2: '100%',
        stops: [
          { offset: '0%', color: '#FB923C' },
          { offset: '55%', color: '#EA580C' },
          { offset: '100%', color: '#9A3412' },
        ],
      },
    ],
    capas: [
      { tipo: 'ellipse', cx: 60, cy: 100, rx: 42, ry: 11, fill: '#09090B', opacity: 0.18, clase: 'insumo-3d-shadow' },
      {
        tipo: 'group',
        clase: 'insumo-3d-float',
        hijos: [
          // Cubo isométrico térmico de delivery
          { tipo: 'path', d: 'M 30 48 L 60 30 L 90 48 L 60 66 Z', fill: '#FDBA74', stroke: '#FFF7ED', strokeWidth: 1.5 },
          { tipo: 'path', d: 'M 30 48 L 60 66 L 60 94 L 30 76 Z', fill: 'url(#grad_delivery_cube)' },
          { tipo: 'path', d: 'M 60 66 L 90 48 L 90 76 L 60 94 Z', fill: '#9A3412' },
          // Franja reflectante de seguridad
          { tipo: 'path', d: 'M 30 62 L 60 80 L 90 62', fill: 'none', stroke: '#FEF08A', strokeWidth: 3.5, strokeLinecap: 'round' },
          { tipo: 'circle', cx: 60, cy: 48, r: 5, fill: '#FFFFFF', clase: 'insumo-3d-pulse' },
        ],
      },
    ],
  },

  merma_empaque: {
    id: 'merma_empaque',
    nombre: 'Packaging Kraft & Control de Merma 3D',
    categoria: 'operaciones',
    viewBox: '0 0 120 120',
    metadatosPBR: { rugosidad: 0.45, metalicidad: 0.2, elevacionZ: 11 },
    gradientes: [
      {
        id: 'grad_kraft_top',
        tipo: 'linearGradient',
        x1: '0%', y1: '0%', x2: '100%', y2: '100%',
        stops: [
          { offset: '0%', color: '#FDE68A' },
          { offset: '100%', color: '#D97706' },
        ],
      },
    ],
    capas: [
      { tipo: 'ellipse', cx: 60, cy: 100, rx: 42, ry: 11, fill: '#09090B', opacity: 0.16, clase: 'insumo-3d-shadow' },
      {
        tipo: 'group',
        clase: 'insumo-3d-float',
        hijos: [
          { tipo: 'path', d: 'M 28 50 L 60 32 L 92 50 L 60 68 Z', fill: 'url(#grad_kraft_top)', stroke: '#FEF3C7', strokeWidth: 1.5 },
          { tipo: 'path', d: 'M 28 50 L 60 68 L 60 94 L 28 76 Z', fill: '#D97706' },
          { tipo: 'path', d: 'M 60 68 L 92 50 L 92 76 L 60 94 Z', fill: '#92400E' },
          { tipo: 'path', d: 'M 44 41 L 76 59', stroke: '#FEF3C7', strokeWidth: 4, strokeLinecap: 'round' },
        ],
      },
    ],
  },

  destructor_descuentos: {
    id: 'destructor_descuentos',
    nombre: 'Simulador Destructor de Descuentos & Erosión 3D',
    categoria: 'simulacion_promociones',
    viewBox: '0 0 120 120',
    metadatosPBR: { rugosidad: 0.2, metalicidad: 0.8, elevacionZ: 14 },
    gradientes: [
      {
        id: 'grad_tag_danger',
        tipo: 'linearGradient',
        x1: '0%', y1: '0%', x2: '100%', y2: '100%',
        stops: [
          { offset: '0%', color: '#F87171' },
          { offset: '50%', color: '#DC2626' },
          { offset: '100%', color: '#7F1D1D' },
        ],
      },
    ],
    capas: [
      { tipo: 'ellipse', cx: 60, cy: 100, rx: 44, ry: 11, fill: '#09090B', opacity: 0.18, clase: 'insumo-3d-shadow' },
      {
        tipo: 'group',
        clase: 'insumo-3d-float',
        hijos: [
          // Etiqueta 3D isométrica de descuento
          { tipo: 'path', d: 'M 26 54 L 58 24 L 90 24 L 94 56 L 62 88 Z', fill: 'url(#grad_tag_danger)', stroke: '#FECACA', strokeWidth: 2 },
          { tipo: 'circle', cx: 76, cy: 38, r: 6, fill: '#FFFFFF' },
          // Rayo de impacto sobre el margen
          { tipo: 'path', d: 'M 58 38 L 44 58 L 58 58 L 48 78 L 72 52 L 58 52 Z', fill: '#FEF08A', clase: 'insumo-3d-pulse' },
        ],
      },
    ],
  },

  escudo_inflacion: {
    id: 'escudo_inflacion',
    nombre: 'Escudo Táctico Anti-Inflación de Bolsillo 3D',
    categoria: 'proteccion_margen',
    viewBox: '0 0 120 120',
    metadatosPBR: { rugosidad: 0.15, metalicidad: 0.88, elevacionZ: 15 },
    gradientes: [
      {
        id: 'grad_escudo_teal',
        tipo: 'linearGradient',
        x1: '0%', y1: '0%', x2: '100%', y2: '100%',
        stops: [
          { offset: '0%', color: '#5EEAD4' },
          { offset: '45%', color: '#0D9488' },
          { offset: '100%', color: '#134E4A' },
        ],
      },
    ],
    capas: [
      { tipo: 'ellipse', cx: 60, cy: 102, rx: 42, ry: 11, fill: '#09090B', opacity: 0.18, clase: 'insumo-3d-shadow' },
      {
        tipo: 'group',
        clase: 'insumo-3d-float',
        hijos: [
          {
            tipo: 'path',
            d: 'M 60 20 L 92 32 L 92 58 C 92 78 60 94 60 94 C 60 94 28 78 28 58 L 28 32 Z',
            fill: 'url(#grad_escudo_teal)',
            stroke: '#CCFBF1',
            strokeWidth: 2.5,
          },
          {
            tipo: 'path',
            d: 'M 60 30 L 82 39 L 82 57 C 82 71 60 83 60 83 Z',
            fill: '#FFFFFF',
            opacity: 0.22,
          },
          // Flecha ascendente protegida
          { tipo: 'path', d: 'M 46 64 L 58 52 L 64 58 L 76 44', fill: 'none', stroke: '#FEF08A', strokeWidth: 4, strokeLinecap: 'round' },
          { tipo: 'circle', cx: 76, cy: 44, r: 4, fill: '#FEF08A', clase: 'insumo-3d-pulse' },
        ],
      },
    ],
  },

  dia_libertad: {
    id: 'dia_libertad',
    nombre: 'Cronógrafo Mensual del Día de la Libertad 3D',
    categoria: 'calendario_financiero',
    viewBox: '0 0 120 120',
    metadatosPBR: { rugosidad: 0.22, metalicidad: 0.6, elevacionZ: 12 },
    gradientes: [
      {
        id: 'grad_cal_header',
        tipo: 'linearGradient',
        x1: '0%', y1: '0%', x2: '100%', y2: '0%',
        stops: [
          { offset: '0%', color: '#0F766E' },
          { offset: '100%', color: '#059669' },
        ],
      },
    ],
    capas: [
      { tipo: 'ellipse', cx: 60, cy: 100, rx: 44, ry: 11, fill: '#09090B', opacity: 0.16, clase: 'insumo-3d-shadow' },
      {
        tipo: 'group',
        clase: 'insumo-3d-float',
        hijos: [
          { tipo: 'rect', x: 24, y: 28, width: 72, height: 64, rx: 10, fill: '#FFFFFF', stroke: '#D4D4D8', strokeWidth: 2 },
          { tipo: 'rect', x: 24, y: 28, width: 72, height: 20, rx: 10, fill: 'url(#grad_cal_header)' },
          { tipo: 'rect', x: 38, y: 22, width: 6, height: 12, rx: 3, fill: '#27272A' },
          { tipo: 'rect', x: 76, y: 22, width: 6, height: 12, rx: 3, fill: '#27272A' },
          // Días de costos (rojos) y días de libertad (esmeralda)
          { tipo: 'rect', x: 34, y: 56, width: 12, height: 10, rx: 2.5, fill: '#FECACA' },
          { tipo: 'rect', x: 54, y: 56, width: 12, height: 10, rx: 2.5, fill: '#FECACA' },
          { tipo: 'rect', x: 74, y: 56, width: 12, height: 10, rx: 2.5, fill: '#FDE68A' },
          { tipo: 'rect', x: 34, y: 72, width: 12, height: 10, rx: 2.5, fill: '#10B981' },
          { tipo: 'rect', x: 54, y: 72, width: 12, height: 10, rx: 2.5, fill: '#10B981', clase: 'insumo-3d-pulse' },
          { tipo: 'rect', x: 74, y: 72, width: 12, height: 10, rx: 2.5, fill: '#059669' },
        ],
      },
    ],
  },

  alerta_capacidad: {
    id: 'alerta_capacidad',
    nombre: 'Tacómetro de Capacidad Física Operativa 3D',
    categoria: 'operaciones',
    viewBox: '0 0 120 120',
    metadatosPBR: { rugosidad: 0.2, metalicidad: 0.75, elevacionZ: 12 },
    gradientes: [
      {
        id: 'grad_tacometro',
        tipo: 'linearGradient',
        x1: '0%', y1: '0%', x2: '100%', y2: '0%',
        stops: [
          { offset: '0%', color: '#10B981' },
          { offset: '50%', color: '#F59E0B' },
          { offset: '100%', color: '#EF4444' },
        ],
      },
    ],
    capas: [
      { tipo: 'ellipse', cx: 60, cy: 100, rx: 42, ry: 11, fill: '#09090B', opacity: 0.16, clase: 'insumo-3d-shadow' },
      {
        tipo: 'group',
        clase: 'insumo-3d-float',
        hijos: [
          { tipo: 'circle', cx: 60, cy: 60, r: 36, fill: '#18181B', stroke: '#E4E4E7', strokeWidth: 3 },
          { tipo: 'path', d: 'M 34 72 A 28 28 0 1 1 86 72', fill: 'none', stroke: 'url(#grad_tacometro)', strokeWidth: 8, strokeLinecap: 'round' },
          { tipo: 'path', d: 'M 60 62 L 80 44', stroke: '#F87171', strokeWidth: 4, strokeLinecap: 'round' },
          { tipo: 'circle', cx: 60, cy: 62, r: 6, fill: '#FEF08A', clase: 'insumo-3d-pulse' },
        ],
      },
    ],
  },

  mina_oro: {
    id: 'mina_oro',
    nombre: 'Mina de Oro: Alto Margen & Alta Rotación 3D',
    categoria: 'matriz_bcg',
    viewBox: '0 0 120 120',
    metadatosPBR: { rugosidad: 0.1, metalicidad: 0.92, elevacionZ: 16 },
    gradientes: [
      {
        id: 'grad_oro_puro',
        tipo: 'linearGradient',
        x1: '0%', y1: '0%', x2: '100%', y2: '100%',
        stops: [
          { offset: '0%', color: '#FEF08A' },
          { offset: '45%', color: '#F59E0B' },
          { offset: '100%', color: '#92400E' },
        ],
      },
    ],
    capas: [
      { tipo: 'ellipse', cx: 60, cy: 100, rx: 44, ry: 11, fill: '#09090B', opacity: 0.18, clase: 'insumo-3d-shadow' },
      {
        tipo: 'group',
        clase: 'insumo-3d-float',
        hijos: [
          { tipo: 'path', d: 'M 30 68 L 60 48 L 90 68 L 60 88 Z', fill: 'url(#grad_oro_puro)', stroke: '#FFFBEB', strokeWidth: 2 },
          { tipo: 'path', d: 'M 30 68 L 60 88 L 60 98 L 30 78 Z', fill: '#D97706' },
          { tipo: 'path', d: 'M 60 88 L 90 68 L 90 78 L 60 98 Z', fill: '#78350F' },
          { tipo: 'path', d: 'M 42 46 L 60 28 L 78 46 L 60 64 Z', fill: 'url(#grad_oro_puro)', stroke: '#FFFFFF', strokeWidth: 2 },
          { tipo: 'circle', cx: 60, cy: 36, r: 4, fill: '#FFFFFF', clase: 'insumo-3d-pulse' },
        ],
      },
    ],
  },

  gancho_comercial: {
    id: 'gancho_comercial',
    nombre: 'Gancho de Tráfico: Alta Rotación & Bajo Margen 3D',
    categoria: 'matriz_bcg',
    viewBox: '0 0 120 120',
    metadatosPBR: { rugosidad: 0.2, metalicidad: 0.8, elevacionZ: 14 },
    gradientes: [
      {
        id: 'grad_iman_azul',
        tipo: 'linearGradient',
        x1: '0%', y1: '0%', x2: '100%', y2: '100%',
        stops: [
          { offset: '0%', color: '#60A5FA' },
          { offset: '100%', color: '#1D4ED8' },
        ],
      },
    ],
    capas: [
      { tipo: 'ellipse', cx: 60, cy: 100, rx: 42, ry: 11, fill: '#09090B', opacity: 0.16, clase: 'insumo-3d-shadow' },
      {
        tipo: 'group',
        clase: 'insumo-3d-float',
        hijos: [
          {
            tipo: 'path',
            d: 'M 36 32 L 36 62 A 24 24 0 0 0 84 62 L 84 32 L 70 32 L 70 62 A 10 10 0 0 1 50 62 L 50 32 Z',
            fill: 'url(#grad_iman_azul)',
            stroke: '#DBEAFE',
            strokeWidth: 2,
          },
          { tipo: 'rect', x: 36, y: 26, width: 14, height: 10, rx: 2, fill: '#EF4444' },
          { tipo: 'rect', x: 70, y: 26, width: 14, height: 10, rx: 2, fill: '#EF4444' },
          { tipo: 'circle', cx: 60, cy: 46, r: 4, fill: '#FEF08A', clase: 'insumo-3d-pulse' },
        ],
      },
    ],
  },

  joya_oculta: {
    id: 'joya_oculta',
    nombre: 'Joya Oculta: Alto Margen & Baja Visibilidad 3D',
    categoria: 'matriz_bcg',
    viewBox: '0 0 120 120',
    metadatosPBR: { rugosidad: 0.08, metalicidad: 0.9, elevacionZ: 15 },
    gradientes: [
      {
        id: 'grad_esmeralda_joya',
        tipo: 'linearGradient',
        x1: '0%', y1: '0%', x2: '100%', y2: '100%',
        stops: [
          { offset: '0%', color: '#A7F3D0' },
          { offset: '50%', color: '#10B981' },
          { offset: '100%', color: '#064E3B' },
        ],
      },
    ],
    capas: [
      { tipo: 'ellipse', cx: 60, cy: 100, rx: 40, ry: 10, fill: '#09090B', opacity: 0.16, clase: 'insumo-3d-shadow' },
      {
        tipo: 'group',
        clase: 'insumo-3d-float',
        hijos: [
          { tipo: 'polygon', points: '42,30 78,30 94,50 60,92 26,50', fill: 'url(#grad_esmeralda_joya)', stroke: '#ECFDF5', strokeWidth: 2 },
          { tipo: 'polygon', points: '42,30 78,30 60,50', fill: '#D1FAE5', opacity: 0.65 },
          { tipo: 'circle', cx: 52, cy: 42, r: 3.5, fill: '#FFFFFF', clase: 'insumo-3d-pulse' },
        ],
      },
    ],
  },

  vampiro_catalogo: {
    id: 'vampiro_catalogo',
    nombre: 'Vampiro de Catálogo: Bajo Margen & Baja Venta 3D',
    categoria: 'matriz_bcg',
    viewBox: '0 0 120 120',
    metadatosPBR: { rugosidad: 0.35, metalicidad: 0.5, elevacionZ: 10 },
    gradientes: [
      {
        id: 'grad_vampiro',
        tipo: 'linearGradient',
        x1: '0%', y1: '0%', x2: '100%', y2: '100%',
        stops: [
          { offset: '0%', color: '#FB7185' },
          { offset: '60%', color: '#E11D48' },
          { offset: '100%', color: '#4C0519' },
        ],
      },
    ],
    capas: [
      { tipo: 'ellipse', cx: 60, cy: 100, rx: 40, ry: 10, fill: '#09090B', opacity: 0.18, clase: 'insumo-3d-shadow' },
      {
        tipo: 'group',
        clase: 'insumo-3d-float',
        hijos: [
          { tipo: 'polygon', points: '60,24 94,86 26,86', fill: 'url(#grad_vampiro)', stroke: '#FFE4E6', strokeWidth: 2 },
          { tipo: 'rect', x: 57, y: 46, width: 6, height: 20, rx: 3, fill: '#FFFFFF' },
          { tipo: 'circle', cx: 60, cy: 74, r: 3.5, fill: '#FFFFFF', clase: 'insumo-3d-pulse' },
        ],
      },
    ],
  },

  precio_penetracion: {
    id: 'precio_penetracion',
    nombre: 'Turbina de Volumen & Penetración de Mercado 3D',
    categoria: 'escenarios_precio',
    viewBox: '0 0 120 120',
    metadatosPBR: { rugosidad: 0.2, metalicidad: 0.7, elevacionZ: 12 },
    gradientes: [
      {
        id: 'grad_penetracion',
        tipo: 'linearGradient',
        x1: '0%', y1: '0%', x2: '100%', y2: '100%',
        stops: [
          { offset: '0%', color: '#93C5FD' },
          { offset: '100%', color: '#1D4ED8' },
        ],
      },
    ],
    capas: [
      { tipo: 'ellipse', cx: 60, cy: 100, rx: 38, ry: 10, fill: '#09090B', opacity: 0.16, clase: 'insumo-3d-shadow' },
      {
        tipo: 'group',
        clase: 'insumo-3d-float',
        hijos: [
          { tipo: 'path', d: 'M 30 74 L 60 26 L 90 74 L 60 64 Z', fill: 'url(#grad_penetracion)', stroke: '#DBEAFE', strokeWidth: 2 },
          { tipo: 'circle', cx: 60, cy: 52, r: 5, fill: '#FFFFFF', clase: 'insumo-3d-pulse' },
        ],
      },
    ],
  },

  precio_saludable: {
    id: 'precio_saludable',
    nombre: 'Prisma de Equilibrio Óptimo Recomendado 3D',
    categoria: 'escenarios_precio',
    viewBox: '0 0 120 120',
    metadatosPBR: { rugosidad: 0.15, metalicidad: 0.85, elevacionZ: 14 },
    gradientes: [
      {
        id: 'grad_saludable',
        tipo: 'linearGradient',
        x1: '0%', y1: '0%', x2: '100%', y2: '100%',
        stops: [
          { offset: '0%', color: '#6EE7B7' },
          { offset: '50%', color: '#0D9488' },
          { offset: '100%', color: '#115E59' },
        ],
      },
    ],
    capas: [
      { tipo: 'ellipse', cx: 60, cy: 100, rx: 42, ry: 11, fill: '#09090B', opacity: 0.18, clase: 'insumo-3d-shadow' },
      {
        tipo: 'group',
        clase: 'insumo-3d-float',
        hijos: [
          { tipo: 'path', d: 'M 60 22 L 92 46 L 78 88 L 42 88 L 28 46 Z', fill: 'url(#grad_saludable)', stroke: '#CCFBF1', strokeWidth: 2 },
          { tipo: 'path', d: 'M 46 58 L 56 68 L 76 46', fill: 'none', stroke: '#FFFFFF', strokeWidth: 4.5, strokeLinecap: 'round' },
        ],
      },
    ],
  },

  precio_premium: {
    id: 'precio_premium',
    nombre: 'Corona Imperial de Posicionamiento Premium 3D',
    categoria: 'escenarios_precio',
    viewBox: '0 0 120 120',
    metadatosPBR: { rugosidad: 0.12, metalicidad: 0.92, elevacionZ: 15 },
    gradientes: [
      {
        id: 'grad_premium_gold',
        tipo: 'linearGradient',
        x1: '0%', y1: '0%', x2: '100%', y2: '100%',
        stops: [
          { offset: '0%', color: '#FEF08A' },
          { offset: '50%', color: '#F59E0B' },
          { offset: '100%', color: '#92400E' },
        ],
      },
    ],
    capas: [
      { tipo: 'ellipse', cx: 60, cy: 100, rx: 42, ry: 11, fill: '#09090B', opacity: 0.18, clase: 'insumo-3d-shadow' },
      {
        tipo: 'group',
        clase: 'insumo-3d-float',
        hijos: [
          { tipo: 'path', d: 'M 24 78 L 20 38 L 44 56 L 60 30 L 76 56 L 100 38 L 96 78 Z', fill: 'url(#grad_premium_gold)', stroke: '#FFFBEB', strokeWidth: 2 },
          { tipo: 'rect', x: 24, y: 80, width: 72, height: 8, rx: 4, fill: '#B45309' },
          { tipo: 'circle', cx: 60, cy: 30, r: 4.5, fill: '#FFFFFF', clase: 'insumo-3d-pulse' },
        ],
      },
    ],
  },
};

export function obtenerIconoJson3D(idIcono) {
  return CATALOGO_JSON_ICONOS_3D[idIcono] || CATALOGO_JSON_ICONOS_3D.sueldo_objetivo;
}
