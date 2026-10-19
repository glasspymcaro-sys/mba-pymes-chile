/**
 * BIBLIOTECA MAESTRA DE INSUMOS, PRODUCTOS Y RECETAS 3D BASADA EN ARCHIVOS .JSON
 * Motor 100% autónomo libre de llaves API externas y sin límites de generación.
 * Carga las definiciones vectoriales 3D desde archivos .json dedicados (figurasInsumos3D.json y figurasProductosRecetas3D.json).
 */
import figurasInsumosData from '../data/figurasInsumos3D.json' with { type: 'json' };
import figurasProductosData from '../data/figurasProductosRecetas3D.json' with { type: 'json' };
import iconosAnimadosData from '../data/iconosAnimados3D.json' with { type: 'json' };

export const FIGURAS_INSUMOS_JSON = figurasInsumosData.tipologias;
export const FIGURAS_PRODUCTOS_RECETAS_JSON = figurasProductosData.figuras;
export const ICONOS_ANIMADOS_JSON = iconosAnimadosData;
export const ICONOS_ANIMADOS_INSUMOS = iconosAnimadosData.insumos;
export const ICONOS_ANIMADOS_PRODUCTOS = iconosAnimadosData.productos;

export const TIPOLOGIAS_3D = {
  verdura_hoja: {
    id: 'verdura_hoja',
    nombre: 'Verduras de Hoja & Hortalizas Verdes',
    colorPrimario: '#10B981',
    colorSecundario: '#047857',
    colorLuz: '#A7F3D0',
    keywords: [
      'lechuga', 'espinaca', 'acelga', 'repollo', 'col', 'albahaca', 'cilantro',
      'perejil', 'rucula', 'rúcula', 'apio', 'berro', 'kale', 'hoja', 'ensalada',
      'orégano', 'oregano', 'menta', 'romero', 'ciboulette', 'brocoli', 'brócoli',
      'alcachofa', 'esparrago', 'espárrago', 'puerro', 'cebollin', 'cebollín'
    ],
  },
  verdura_fruto: {
    id: 'verdura_fruto',
    nombre: 'Verduras de Fruto & Hortalizas Frescas',
    colorPrimario: '#EF4444',
    colorSecundario: '#991B1B',
    colorLuz: '#FCA5A5',
    keywords: [
      'tomate', 'pimiento', 'pimenton', 'pimentón', 'morron', 'morrón', 'aji', 'ají',
      'rocoto', 'zapallo', 'calabaza', 'calabacin', 'calabacín', 'zuccini', 'berenjena',
      'pepino', 'choclo', 'maiz', 'maíz', 'arveja', 'poroto verde', 'verdura', 'hortaliza',
      'vegetal'
    ],
  },
  verdura_raiz_bulbo: {
    id: 'verdura_raiz_bulbo',
    nombre: 'Raíces, Bulbos, Tubérculos & Hongos',
    colorPrimario: '#F97316',
    colorSecundario: '#9A3412',
    colorLuz: '#FDBA74',
    keywords: [
      'cebolla', 'ajo', 'zanahoria', 'betarraga', 'remolacha', 'rabano', 'rábano',
      'jengibre', 'papa', 'camote', 'yuca', 'champiñon', 'champiñón', 'hongo', 'seta',
      'portobello', 'trufa'
    ],
  },
  palta_oleaginosa: {
    id: 'palta_oleaginosa',
    nombre: 'Paltas, Aceitunas & Frutos Grasos',
    colorPrimario: '#15803D',
    colorSecundario: '#14532D',
    colorLuz: '#BEF264',
    keywords: [
      'palta', 'aguacate', 'hass', 'aceituna', 'oliva', 'alcaparra', 'guacamole'
    ],
  },
  fruta_fresca: {
    id: 'fruta_fresca',
    nombre: 'Frutas Frescas & Cítricos',
    colorPrimario: '#E11D48',
    colorSecundario: '#881337',
    colorLuz: '#FDA4AF',
    keywords: [
      'manzana', 'naranja', 'limon', 'limón', 'platano', 'plátano', 'banana',
      'frutilla', 'fresa', 'arandano', 'arándano', 'frambuesa', 'mora', 'cereza',
      'uva', 'piña', 'ananá', 'mango', 'maracuya', 'maracuyá', 'durazno', 'melocoton',
      'pera', 'kiwi', 'sandia', 'sandía', 'melon', 'melón', 'pomelo', 'mandarina',
      'fruta', 'pulpa', 'coco'
    ],
  },
  panaderia_masa: {
    id: 'panaderia_masa',
    nombre: 'Panadería, Masas & Pastelería',
    colorPrimario: '#D97706',
    colorSecundario: '#78350F',
    colorLuz: '#FDE68A',
    keywords: [
      'pan', 'brioche', 'marraqueta', 'hallulla', 'baguette', 'molde', 'ciabatta',
      'focaccia', 'pita', 'tortilla', 'masa', 'prepizza', 'pizza', 'empanada',
      'harina', 'levadura', 'polvo de hornear', 'galleta', 'queque', 'torta', 'tarta',
      'pastel', 'croissant', 'medialuna', 'muffin', 'brownie', 'panaderia', 'reposteria'
    ],
  },
  carne_roja_embutido: {
    id: 'carne_roja_embutido',
    nombre: 'Carnes Rojas, Cecinas & Embutidos',
    colorPrimario: '#DC2626',
    colorSecundario: '#7F1D1D',
    colorLuz: '#FCA5A5',
    keywords: [
      'carne', 'vacuno', 'lomo', 'filete', 'posta', 'asado', 'entraña', ' sobrecostilla',
      'plateada', 'molida', 'hamburguesa', 'churrasco', 'bife', 'cerdo', 'chuleta',
      'costillar', 'pulpa cerdo', 'tocino', 'bacon', 'panceta', 'jamon', 'jamón',
      'salame', 'salami', 'pepperoni', 'chorizo', 'longaniza', 'vienesa', 'salchicha',
      'prieta', 'mortadela', 'cecina', 'cordero', 'proteina'
    ],
  },
  ave_pescado_marisco: {
    id: 'ave_pescado_marisco',
    nombre: 'Aves, Pescados & Mariscos',
    colorPrimario: '#FB7185',
    colorSecundario: '#9F1239',
    colorLuz: '#FFE4E6',
    keywords: [
      'pollo', 'pechuga', 'trutro', 'alita', 'pavo', 'pato', 'ave', 'salmon', 'salmón',
      'pescado', 'merluza', 'reineta', 'congrio', 'atun', 'atún', 'tilapia', 'corvina',
      'camaron', 'camarón', 'langostino', 'marisco', 'machas', 'locos', 'ostion', 'ostión',
      'jaiba', 'pulpo', 'calamar', 'kanikama', 'almeja', 'chorito'
    ],
  },
  lacteo_queso_huevo: {
    id: 'lacteo_queso_huevo',
    nombre: 'Quesos, Lácteos Sólidos & Huevos',
    colorPrimario: '#EAB308',
    colorSecundario: '#A16207',
    colorLuz: '#FEF08A',
    keywords: [
      'queso', 'cheddar', 'mantecoso', 'gauda', 'gouda', 'mozzarella', 'parmesano',
      'cabra', 'quesillo', 'ricotta', 'queso azul', 'roquefort', 'provolone',
      'mantequilla', 'margarina', 'huevo', 'yema', 'clara', 'yogurt', 'yogur', 'crema'
    ],
  },
  fritura_snack: {
    id: 'fritura_snack',
    nombre: 'Papas Fritas, Guarniciones & Snacks',
    colorPrimario: '#F59E0B',
    colorSecundario: '#B45309',
    colorLuz: '#FEF3C7',
    keywords: [
      'papas fritas', 'papa frita', 'fritura', 'nugget', 'aro de cebolla', 'tequeño',
      'empanizado', 'snack', 'mani', 'maní', 'papas kryzpo', 'nachos', 'doritos', 'ramitas'
    ],
  },
  abarrote_grano_condimento: {
    id: 'abarrote_grano_condimento',
    nombre: 'Abarrotes, Granos, Aceites & Salsas',
    colorPrimario: '#D97706',
    colorSecundario: '#92400E',
    colorLuz: '#FDE68A',
    keywords: [
      'arroz', 'fideo', 'pasta', 'tallarin', 'spaghetti', 'macarron', 'lasaña',
      'azucar', 'azúcar', 'endulzante', 'stevia', 'sal', 'pimienta', 'comino',
      'merkén', 'merken', 'curry', 'paprika', 'canela', 'vainilla', 'lenteja',
      'garbanzo', 'poroto', 'avena', 'cereal', 'quinoa', 'maicena', 'semola',
      'aceite', 'maravilla', 'vinagre', 'aceto', 'mayonesa', 'ketchup', 'mostaza',
      'salsa', 'soya', 'soja', 'teriyaki', 'bbq', 'miel', 'mermelada', 'manjar',
      'dulce de leche', 'conserva', 'enlatado', 'abarrote', 'almendra', 'nuez'
    ],
  },
  bebida_lacteo_liquido: {
    id: 'bebida_lacteo_liquido',
    nombre: 'Bebidas, Lácteos Líquidos & Botellas',
    colorPrimario: '#2563EB',
    colorSecundario: '#1E3A8A',
    colorLuz: '#93C5FD',
    keywords: [
      'bebida', 'gaseosa', 'coca', 'pepsi', 'fanta', 'sprite', 'agua', 'mineral',
      'jugo', 'nectar', 'néctar', 'isotónica', 'energetica', 'energética', 'cerveza',
      'vino', 'pisco', 'ron', 'whisky', 'espumante', 'licor', 'sidra', 'kombu',
      'leche', 'botella', 'lata', 'litro', '1.5l', '2l', '500ml', 'hielo'
    ],
  },
  cafe_infusion_cacao: {
    id: 'cafe_infusion_cacao',
    nombre: 'Café, Té, Infusiones & Cacao',
    colorPrimario: '#78350F',
    colorSecundario: '#451A03',
    colorLuz: '#FCD34D',
    keywords: [
      'cafe', 'café', 'espresso', 'arabica', 'grano tostado', 'capuchino', 'latte',
      'te', 'té', 'matcha', 'infusion', 'infusión', 'manzanilla', 'hierba', 'mate',
      'yerba', 'chocolate', 'cacao', 'milo', 'nesquik'
    ],
  },
  ferreteria_herramienta: {
    id: 'ferreteria_herramienta',
    nombre: 'Ferretería, Fijaciones, Materiales & Aseo',
    colorPrimario: '#52525B',
    colorSecundario: '#27272A',
    colorLuz: '#E4E4E7',
    keywords: [
      'tornillo', 'clavo', 'perno', 'tuerca', 'tarugo', 'remache', 'bisagra',
      'candado', 'cerradura', 'cadena', 'alambre', 'metal', 'acero', 'fierro',
      'aluminio', 'cobre', 'martillo', 'taladro', 'destornillador', 'llave',
      'alicate', 'sierra', 'disco', 'lija', 'brocha', 'rodillo', 'pintura',
      'esmalte', 'barniz', 'cemento', 'yeso', 'mortero', 'ladrillo', 'madera',
      'pino', 'melamina', 'terciado', 'pvc', 'tuberia', 'cañeria', 'cable',
      'enchufe', 'interruptor', 'ampolleta', 'led', 'cinta', 'silicona', 'pegamento',
      'detergente', 'cloro', 'lavaloza', 'jabon', 'jabón', 'desinfectante', 'papel',
      'servilleta', 'envase', 'caja', 'bolsa', 'empaque', 'packaging', 'film'
    ],
  },
  servicios_consultoria_diseno: {
    id: 'servicios_consultoria_diseno',
    nombre: 'Consultoría, Diseño, Marketing & Gestión',
    colorPrimario: '#0D9488',
    colorSecundario: '#115E59',
    colorLuz: '#5EEAD4',
    keywords: [
      'consultor', 'asesor', 'auditor', 'auditoria', 'auditoría', 'contador',
      'contabilidad', 'abogado', 'legal', 'finanzas', 'financiero', 'estrategia',
      'mba', 'gerente', 'director', 'coordinador', 'analista', 'diseñador',
      'disenador', 'ui', 'ux', 'grafico', 'gráfico', 'branding', 'marca',
      'marketing', 'publicidad', 'seo', 'sem', 'redes sociales', 'community',
      'fotografo', 'video', 'audiovisual', 'redactor', 'copywriter', 'capacitacion',
      'taller', 'clase', 'honorario', 'hora', 'flete', 'despacho', 'transporte'
    ],
  },
  servicios_software_cloud: {
    id: 'servicios_software_cloud',
    nombre: 'Desarrollo de Software, Cloud & Infraestructura TI',
    colorPrimario: '#4F46E5',
    colorSecundario: '#312E81',
    colorLuz: '#A5B4FC',
    keywords: [
      'desarrollador', 'programador', 'ingeniero', 'fullstack', 'frontend',
      'backend', 'devops', 'qa', 'tester', 'arquitecto', 'data', 'software',
      'licencia', 'cloud', 'nube', 'servidor', 'vps', 'hosting', 'dominio',
      'aws', 'google cloud', 'azure', 'supabase', 'vercel', 'github', 'openai',
      'api', 'base de datos', 'seguridad', 'ciberseguridad', 'soporte', 'sistema',
      'erp', 'crm', 'pos', 'token', 'suscripcion', 'saas'
    ],
  },
};

/**
 * Catálogo interactivo de insumos predefinidos organizados por tipología y rubro para el MVP
 */
export const CATALOGO_MAESTRO_INSUMOS = [
  // Verduras y Hortalizas
  { nombre: 'Lechuga Hidropónica', costoUnitario: 250, unidadMedida: 'un', tipologia: 'verdura_hoja', rubro: 'restaurant' },
  { nombre: 'Espinaca Baby Fresca', costoUnitario: 380, unidadMedida: 'un', tipologia: 'verdura_hoja', rubro: 'restaurant' },
  { nombre: 'Albahaca Genovesa', costoUnitario: 290, unidadMedida: 'un', tipologia: 'verdura_hoja', rubro: 'restaurant' },
  { nombre: 'Cilantro Seleccionado', costoUnitario: 200, unidadMedida: 'un', tipologia: 'verdura_hoja', rubro: 'restaurant' },
  { nombre: 'Tomates Frescos (100g)', costoUnitario: 350, unidadMedida: 'un', tipologia: 'verdura_fruto', rubro: 'restaurant' },
  { nombre: 'Pimiento Morrón Rojo', costoUnitario: 420, unidadMedida: 'un', tipologia: 'verdura_fruto', rubro: 'restaurant' },
  { nombre: 'Ají Verde Chileno', costoUnitario: 180, unidadMedida: 'un', tipologia: 'verdura_fruto', rubro: 'restaurant' },
  { nombre: 'Cebolla Morada Pluma', costoUnitario: 240, unidadMedida: 'un', tipologia: 'verdura_raiz_bulbo', rubro: 'restaurant' },
  { nombre: 'Zanahoria Rallada', costoUnitario: 210, unidadMedida: 'un', tipologia: 'verdura_raiz_bulbo', rubro: 'restaurant' },
  { nombre: 'Champiñón París Laminado', costoUnitario: 680, unidadMedida: 'un', tipologia: 'verdura_raiz_bulbo', rubro: 'restaurant' },
  { nombre: 'Palta Hass Cremosa', costoUnitario: 650, unidadMedida: 'un', tipologia: 'palta_oleaginosa', rubro: 'restaurant' },
  { nombre: 'Aceitunas de Azapa', costoUnitario: 450, unidadMedida: 'un', tipologia: 'palta_oleaginosa', rubro: 'restaurant' },

  // Frutas
  { nombre: 'Manzanas Rojas', costoUnitario: 1200, unidadMedida: 'kg', tipologia: 'fruta_fresca', rubro: 'restaurant' },
  { nombre: 'Limón Sutil Fresco', costoUnitario: 950, unidadMedida: 'kg', tipologia: 'fruta_fresca', rubro: 'restaurant' },
  { nombre: 'Frutillas Seleccionadas', costoUnitario: 1800, unidadMedida: 'kg', tipologia: 'fruta_fresca', rubro: 'restaurant' },

  // Panadería y Masas
  { nombre: 'Pan Brioche Artesanal', costoUnitario: 800, unidadMedida: 'un', tipologia: 'panaderia_masa', rubro: 'restaurant' },
  { nombre: 'Marraqueta Crujiente', costoUnitario: 350, unidadMedida: 'un', tipologia: 'panaderia_masa', rubro: 'restaurant' },
  { nombre: 'Masa Pizza Napolitana', costoUnitario: 1100, unidadMedida: 'un', tipologia: 'panaderia_masa', rubro: 'restaurant' },
  { nombre: 'Pan de Molde Familiar', costoUnitario: 1400, unidadMedida: 'un', tipologia: 'panaderia_masa', rubro: 'minimarket' },

  // Carnes, Aves y Pescados
  { nombre: 'Carne Vacuno Lomo (200g)', costoUnitario: 2400, unidadMedida: 'un', tipologia: 'carne_roja_embutido', rubro: 'restaurant' },
  { nombre: 'Tocino Ahumado Crocante', costoUnitario: 580, unidadMedida: 'un', tipologia: 'carne_roja_embutido', rubro: 'restaurant' },
  { nombre: 'Pechuga de Pollo Grill', costoUnitario: 1650, unidadMedida: 'un', tipologia: 'ave_pescado_marisco', rubro: 'restaurant' },
  { nombre: 'Filete Salmón Austral', costoUnitario: 3400, unidadMedida: 'un', tipologia: 'ave_pescado_marisco', rubro: 'restaurant' },

  // Quesos, Huevos y Guarniciones
  { nombre: 'Queso Cheddar Fundido', costoUnitario: 450, unidadMedida: 'un', tipologia: 'lacteo_queso_huevo', rubro: 'restaurant' },
  { nombre: 'Queso Mozzarella Fior', costoUnitario: 620, unidadMedida: 'un', tipologia: 'lacteo_queso_huevo', rubro: 'restaurant' },
  { nombre: 'Huevo de Campo Libre', costoUnitario: 230, unidadMedida: 'un', tipologia: 'lacteo_queso_huevo', rubro: 'restaurant' },
  { nombre: 'Papas Fritas Porción', costoUnitario: 650, unidadMedida: 'un', tipologia: 'fritura_snack', rubro: 'restaurant' },

  // Minimarket, Abarrotes, Bebidas y Ferretería
  { nombre: 'Bebida Botella 1.5L', costoUnitario: 950, unidadMedida: 'un', tipologia: 'bebida_lacteo_liquido', rubro: 'minimarket' },
  { nombre: 'Leche Entera 1L', costoUnitario: 820, unidadMedida: 'lt', tipologia: 'bebida_lacteo_liquido', rubro: 'minimarket' },
  { nombre: 'Café Grano Tostado 250g', costoUnitario: 2600, unidadMedida: 'un', tipologia: 'cafe_infusion_cacao', rubro: 'minimarket' },
  { nombre: 'Arroz Grado 1 Selección', costoUnitario: 1150, unidadMedida: 'kg', tipologia: 'abarrote_grano_condimento', rubro: 'minimarket' },
  { nombre: 'Aceite Maravilla 1L', costoUnitario: 1890, unidadMedida: 'lt', tipologia: 'abarrote_grano_condimento', rubro: 'minimarket' },
  { nombre: 'Tornillos Yeso Cartón 100u', costoUnitario: 1900, unidadMedida: 'un', tipologia: 'ferreteria_herramienta', rubro: 'minimarket' },
  { nombre: 'Envase Kraft Biodegradable', costoUnitario: 320, unidadMedida: 'un', tipologia: 'ferreteria_herramienta', rubro: 'restaurant' },

  // Servicios y Proyectos
  { nombre: 'Consultor Senior MBA', costoUnitario: 18000, unidadMedida: 'hr', tipologia: 'servicios_consultoria_diseno', rubro: 'services' },
  { nombre: 'Diseñador UI/UX', costoUnitario: 11000, unidadMedida: 'hr', tipologia: 'servicios_consultoria_diseno', rubro: 'services' },
  { nombre: 'Desarrollador FullStack', costoUnitario: 14000, unidadMedida: 'hr', tipologia: 'servicios_software_cloud', rubro: 'services' },
  { nombre: 'Licencia Software Cloud', costoUnitario: 6500, unidadMedida: 'un', tipologia: 'servicios_software_cloud', rubro: 'services' },
];

/**
 * Detecta automáticamente la tipología 3D exacta para cualquier nombre de insumo escrito por el usuario.
 * @param {string} nombreInsumo
 * @param {string} rubro
 * @returns {{ id: string, nombre: string, colorPrimario: string, colorSecundario: string, colorLuz: string }}
 */
export function clasificarTipologiaInsumo(nombreInsumo = '', rubro = 'restaurant') {
  const texto = (nombreInsumo || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  if (!texto) {
    if (rubro === 'minimarket') return TIPOLOGIAS_3D.abarrote_grano_condimento;
    if (rubro === 'services') return TIPOLOGIAS_3D.servicios_consultoria_diseno;
    return TIPOLOGIAS_3D.verdura_hoja;
  }

  // Prioridad específica para "papas fritas" vs "papa"
  if (texto.includes('frita') || texto.includes('nugget') || texto.includes('snack')) {
    return TIPOLOGIAS_3D.fritura_snack;
  }

  for (const tipologia of Object.values(TIPOLOGIAS_3D)) {
    for (const kw of tipologia.keywords) {
      const kwNorm = kw.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (texto.includes(kwNorm)) {
        return tipologia;
      }
    }
  }

  // Fallback inteligente por rubro si es un nombre completamente nuevo
  if (rubro === 'services') return TIPOLOGIAS_3D.servicios_consultoria_diseno;
  if (rubro === 'minimarket') return TIPOLOGIAS_3D.abarrote_grano_condimento;
  return TIPOLOGIAS_3D.verdura_fruto;
}

/**
 * Genera el Descriptor JSON Estructurado de Imagen 3D para cualquier insumo o producto,
 * incluyendo iluminación PBR, paleta óptica, coordenadas espaciales y geometría 3D asociada.
 */
export function obtenerJsonDescriptorInsumo(nombreInsumo = 'Insumo', rubro = 'restaurant', tipologiaForzada = '') {
  const infoTipologia =
    tipologiaForzada && TIPOLOGIAS_3D[tipologiaForzada]
      ? TIPOLOGIAS_3D[tipologiaForzada]
      : clasificarTipologiaInsumo(nombreInsumo, rubro);

  const specJson = FIGURAS_INSUMOS_JSON[infoTipologia.id] || FIGURAS_INSUMOS_JSON.verdura_hoja;

  return {
    ...specJson,
    schemaVersion: '3.0-JSON-3D-PBR',
    insumo: nombreInsumo || 'Insumo',
    rubro,
    tipologiaId: infoTipologia.id,
    tipologiaNombre: infoTipologia.nombre,
    paletaOptica: {
      colorPrimario: infoTipologia.colorPrimario,
      colorSecundario: infoTipologia.colorSecundario,
      colorLuzEspecular: infoTipologia.colorLuz,
    },
    iluminacionPBR: {
      keyLight: { azimuth: 35, elevation: 25, intensity: 1.15 },
      rimLight: { azimuth: 210, elevation: 65, intensity: 0.75 },
      contactShadow: { cx: 60, cy: 96, rx: 32, ry: 9, opacity: 0.18 },
    },
  };
}

/**
 * Clasifica automáticamente cualquier Producto Final o Receta en su figura 3D JSON de alta gama
 */
export function clasificarFiguraProductoReceta(nombreProducto = '', rubro = 'restaurant', figuraForzada = '') {
  if (figuraForzada && FIGURAS_PRODUCTOS_RECETAS_JSON[figuraForzada]) {
    return FIGURAS_PRODUCTOS_RECETAS_JSON[figuraForzada];
  }

  const texto = (nombreProducto || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  for (const fig of Object.values(FIGURAS_PRODUCTOS_RECETAS_JSON)) {
    for (const kw of fig.keywords || []) {
      const kwNorm = kw.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (texto.includes(kwNorm)) {
        return fig;
      }
    }
  }

  if (rubro === 'minimarket') return FIGURAS_PRODUCTOS_RECETAS_JSON.canasta_retail_desayuno;
  if (rubro === 'services') return FIGURAS_PRODUCTOS_RECETAS_JSON.consultoria_estrategica_mba;
  return FIGURAS_PRODUCTOS_RECETAS_JSON.hamburguesa_gourmet;
}

/**
 * Obtiene la especificación JSON animada para cualquier Insumo (scene, materials, meshes, animations, interaction)
 */
export function obtenerSpecAnimadaInsumo(nombreInsumo = 'Insumo', rubro = 'restaurant', tipologiaForzada = '') {
  const infoTipologia =
    tipologiaForzada && TIPOLOGIAS_3D[tipologiaForzada]
      ? TIPOLOGIAS_3D[tipologiaForzada]
      : clasificarTipologiaInsumo(nombreInsumo, rubro);

  return ICONOS_ANIMADOS_INSUMOS[infoTipologia.id] || ICONOS_ANIMADOS_INSUMOS.verdura_hoja;
}

/**
 * Obtiene la especificación JSON animada para cualquier Producto Final o Receta
 */
export function obtenerSpecAnimadaProducto(nombreProducto = '', rubro = 'restaurant', figuraForzada = '') {
  const figuraBase = clasificarFiguraProductoReceta(nombreProducto, rubro, figuraForzada);
  const clave = figuraBase?.id || 'hamburguesa_gourmet';
  return ICONOS_ANIMADOS_PRODUCTOS[clave] || ICONOS_ANIMADOS_PRODUCTOS.hamburguesa_gourmet;
}


