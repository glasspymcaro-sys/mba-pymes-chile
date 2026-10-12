export const mockServices = {
  recursos: [
    { id: 'rec_1', nombre: 'Consultor Senior', tipo: 'Personal', unidad: 'hora', costoPorUnidad: 25000 },
    { id: 'rec_2', nombre: 'Analista Junior', tipo: 'Personal', unidad: 'hora', costoPorUnidad: 12000 },
    { id: 'rec_3', nombre: 'Diseñador Grafico', tipo: 'Personal', unidad: 'hora', costoPorUnidad: 18000 },
    { id: 'rec_4', nombre: 'Licencia Software Cloud', tipo: 'Tecnologia', unidad: 'proyecto', costoPorUnidad: 45000 },
    { id: 'rec_5', nombre: 'Soporte Externo', tipo: 'Terceros', unidad: 'hora', costoPorUnidad: 15000 }
  ],
  servicios: [
    {
      id: 'srv_1',
      nombre: 'Auditoria Financiera',
      precioVenta: 1200000,
      ventasMensuales: 3, 
      costoTotal: 580000,
      elementos: [
        { id: 'rec_1', nombre: 'Consultor Senior', unidad: 'hora', costoPorUnidad: 25000, cantidadUsada: 20 },
        { id: 'rec_2', nombre: 'Analista Junior', unidad: 'hora', costoPorUnidad: 12000, cantidadUsada: 40 }
      ]
    },
    {
      id: 'srv_2',
      nombre: 'Implementacion ERP Base',
      precioVenta: 850000,
      ventasMensuales: 5,
      costoTotal: 341000,
      elementos: [
        { id: 'rec_1', nombre: 'Consultor Senior', unidad: 'hora', costoPorUnidad: 25000, cantidadUsada: 10 },
        { id: 'rec_4', nombre: 'Licencia Software Cloud', unidad: 'proyecto', costoPorUnidad: 45000, cantidadUsada: 1 },
        { id: 'rec_3', nombre: 'Diseñador Grafico', unidad: 'hora', costoPorUnidad: 18000, cantidadUsada: 2.5 }
      ]
    }
  ],
  costosVariables: [
    { id: 'cv_1', nombre: 'Traslados y Viaticos', costoPorUnidad: 15000 },
    { id: 'cv_2', nombre: 'Comision Ventas', costoPorUnidad: 25000 }
  ],
  costosFijos: [
    { id: 'cf_1', nombre: 'Arriendo Oficina / Cowork', monto: 350000 },
    { id: 'cf_2', nombre: 'Sueldos Base (Administracion)', monto: 800000 },
    { id: 'cf_3', nombre: 'Suscripciones y Servidores', monto: 120000 }
  ]
};