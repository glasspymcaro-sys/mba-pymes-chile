export const mockMinimarket = {
  nombreNegocio: 'Mi Ferretería / Minimarket',
  catalogoMayorista: [
    { id: 'cat_1', nombre: 'Tornillo Yeso Cartón 6x1 (Caja 1000)', categoria: 'Fijaciones', costoMayorista: 4500, precioSugerido: 7990, unidad: 'caja' },
    { id: 'cat_2', nombre: 'Disco Corte Metal 4 1/2"', categoria: 'Herramientas', costoMayorista: 650, precioSugerido: 1290, unidad: 'un' },
    { id: 'cat_3', nombre: 'Cinta Teflón 3/4 x 10m', categoria: 'Gasfitería', costoMayorista: 280, precioSugerido: 690, unidad: 'un' },
    { id: 'cat_4', nombre: 'Broca Concreto 6mm', categoria: 'Accesorios', costoMayorista: 1100, precioSugerido: 2190, unidad: 'un' },
    { id: 'cat_5', nombre: 'Guante Cabritilla Par', categoria: 'Seguridad', costoMayorista: 1800, precioSugerido: 3490, unidad: 'par' },
    { id: 'cat_6', nombre: 'Silicona Neutra 280ml', categoria: 'Adhesivos', costoMayorista: 2400, precioSugerido: 4290, unidad: 'un' },
    { id: 'cat_7', nombre: 'Arroz Grado 1 (1kg)', categoria: 'Abarrotes', costoMayorista: 1150, precioSugerido: 1590, unidad: 'kg' },
    { id: 'cat_8', nombre: 'Aceite Vegetal 900ml', categoria: 'Abarrotes', costoMayorista: 1450, precioSugerido: 1990, unidad: 'un' }
  ],
  inventario: [
    { id: 'inv_1', sku: 'FER-001', nombre: 'Tornillo Yeso Cartón 6x1 (Caja 1000)', costoCompra: 4500, precioVenta: 7990, ventasMensuales: 35, stockActual: 12, leadTimeDias: 3, mermaEsperada: 2, puntoReorden: 6 },
    { id: 'inv_2', sku: 'FER-002', nombre: 'Disco Corte Metal 4 1/2"', costoCompra: 650, precioVenta: 1290, ventasMensuales: 180, stockActual: 45, leadTimeDias: 2, mermaEsperada: 1, puntoReorden: 18 }
  ],
  costosVariables: [
    { id: 'cv_mini_1', nombre: 'Bolsas y Packaging', costoPorUnidad: 120 },
    { id: 'cv_mini_2', nombre: 'Comisión Transbank / POS (1.5%)', costoPorUnidad: 80 }
  ],
  costosFijos: [
    { id: 'cf_mini_1', nombre: 'Arriendo Local Comercial', monto: 750000 },
    { id: 'cf_mini_2', nombre: 'Sueldo Operador / Bodega', monto: 550000 },
    { id: 'cf_mini_3', nombre: 'Luz y Conectividad', monto: 95000 }
  ]
};