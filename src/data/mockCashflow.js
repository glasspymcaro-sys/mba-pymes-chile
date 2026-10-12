export const mockCashflowData = {
    restaurant: {
      saldoInicial: 4500000,
      moneda: "CLP",
      resumenMensual: {
        ingresosTotales: 14200000,
        egresosTotales: 11150000,
        flujoNeto: 3050000,
        coberturaCajaDias: 24
      },
      ingresos: [
        { id: "ing-r1", concepto: "Ventas Salón & Terraza", monto: 9800000, recurrencia: "Diario", canal: "POS / Efectivo" },
        { id: "ing-r2", concepto: "Ventas Delivery Apps", monto: 3600000, recurrencia: "Semanal", canal: "Plataformas" },
        { id: "ing-r3", concepto: "Eventos & Reservas Privadas", monto: 800000, recurrencia: "Quincenal", canal: "Transferencia" }
      ],
      egresos: [
        { id: "eg-r1", concepto: "Compras Proveedores Perecibles", monto: 4600000, categoria: "Costo Directo", plazo: "Semanal" },
        { id: "eg-r2", concepto: "Nómina Cocina y Garzones", monto: 3800000, categoria: "Mano de Obra", plazo: "Mensual" },
        { id: "eg-r3", concepto: "Arriendo Local & Servicios Básicos", monto: 1950000, categoria: "Costos Fijos", plazo: "Mensual" },
        { id: "eg-r4", concepto: "Comisiones Apps de Delivery", monto: 800000, categoria: "Comisiones", plazo: "Mensual" }
      ],
      proyeccionSemanas: [
        { semana: "Semana 1", saldoInicial: 4500000, ingresos: 3550000, egresos: 3100000, saldoFinal: 4950000 },
        { semana: "Semana 2", saldoInicial: 4950000, ingresos: 3400000, egresos: 2450000, saldoFinal: 5900000 },
        { semana: "Semana 3", saldoInicial: 5900000, ingresos: 3650000, egresos: 3300000, saldoFinal: 6250000 },
        { semana: "Semana 4", saldoInicial: 6250000, ingresos: 3600000, egresos: 2300000, saldoFinal: 7550000 }
      ]
    },
    services: {
      saldoInicial: 6200000,
      moneda: "CLP",
      resumenMensual: {
        ingresosTotales: 9800000,
        egresosTotales: 5600000,
        flujoNeto: 4200000,
        coberturaCajaDias: 45
      },
      ingresos: [
        { id: "ing-s1", concepto: "Retainers / Fee Mensual Clientes", monto: 6500000, recurrencia: "Mensual", canal: "Facturación 30d" },
        { id: "ing-s2", concepto: "Proyectos por Hito / Cierre", monto: 2800000, recurrencia: "Contra Entrega", canal: "Transferencia" },
        { id: "ing-s3", concepto: "Consultorías On-Demand", monto: 500000, recurrencia: "Esporádico", canal: "Anticipado" }
      ],
      egresos: [
        { id: "eg-s1", concepto: "Honorarios Especialistas / Freelance", monto: 2900000, categoria: "Operación", plazo: "Mensual" },
        { id: "eg-s2", concepto: "Suscripciones SaaS, Cloud & Licencias", monto: 950000, categoria: "Software", plazo: "Mensual" },
        { id: "eg-s3", concepto: "Coworking & Oficinas", monto: 650000, categoria: "Infraestructura", plazo: "Mensual" },
        { id: "eg-s4", concepto: "Impuestos y Retenciones", monto: 1100000, categoria: "Tributario", plazo: "Mensual" }
      ],
      proyeccionSemanas: [
        { semana: "Semana 1", saldoInicial: 6200000, ingresos: 4200000, egresos: 1800000, saldoFinal: 8600000 },
        { semana: "Semana 2", saldoInicial: 8600000, ingresos: 1200000, egresos: 900000, saldoFinal: 8900000 },
        { semana: "Semana 3", saldoInicial: 8900000, ingresos: 2900000, egresos: 1700000, saldoFinal: 10100000 },
        { semana: "Semana 4", saldoInicial: 10100000, ingresos: 1500000, egresos: 1200000, saldoFinal: 10400000 }
      ]
    },
    minimarket: {
      saldoInicial: 3200000,
      moneda: "CLP",
      resumenMensual: {
        ingresosTotales: 18500000,
        egresosTotales: 16200000,
        flujoNeto: 2300000,
        coberturaCajaDias: 18
      },
      ingresos: [
        { id: "ing-m1", concepto: "Venta Mostrador Abarrotes & Lácteos", monto: 11200000, recurrencia: "Diario", canal: "Caja / Débito" },
        { id: "ing-m2", concepto: "Bebidas, Licores & Snacks", monto: 5800000, recurrencia: "Diario", canal: "POS Transbank" },
        { id: "ing-m3", concepto: "Recargas & Servicios Caja Vecina", monto: 1500000, recurrencia: "Diario", canal: "Comisiones" }
      ],
      egresos: [
        { id: "eg-m1", concepto: "Reposición Mercadería Mayorista", monto: 11900000, categoria: "Inventario", plazo: "Semanal" },
        { id: "eg-m2", concepto: "Turnos Cajeros & Reponedores", monto: 2100000, categoria: "Mano de Obra", plazo: "Mensual" },
        { id: "eg-m3", concepto: "Electricidad (Cámaras de frío)", monto: 1200000, categoria: "Servicios Básicos", plazo: "Mensual" },
        { id: "eg-m4", concepto: "Merma & Pérdida de Stock", monto: 1000000, categoria: "Operacional", plazo: "Mensual" }
      ],
      proyeccionSemanas: [
        { semana: "Semana 1", saldoInicial: 3200000, ingresos: 4600000, egresos: 4200000, saldoFinal: 3600000 },
        { semana: "Semana 2", saldoInicial: 3600000, ingresos: 4700000, egresos: 3900000, saldoFinal: 4400000 },
        { semana: "Semana 3", saldoInicial: 4400000, ingresos: 4500000, egresos: 4300000, saldoFinal: 4600000 },
        { semana: "Semana 4", saldoInicial: 4600000, ingresos: 4700000, egresos: 3800000, saldoFinal: 5500000 }
      ]
    }
  };