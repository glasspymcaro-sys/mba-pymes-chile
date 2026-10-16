import React, { createContext, useContext, useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase.js';
import { cargarDatosUsuario, sincronizarTodoElNegocio } from '../services/dbService.js';
import { ACTIVOS_3D_CATALOGO, construirUrlActivo3D } from '../lib/fal3d.js';
import { clasificarTipologiaInsumo } from '../lib/bibliotecaInsumos3D.js';
import { calcularFugasDeMargen } from '../core/calculationEngine.js';

const INSUMOS_DEFAULT = {
  restaurant: [
    { id: 'ins_1', nombre: 'Pan Brioche Artesanal', costoUnitario: 800, unidadMedida: 'un', tipologia: 'panaderia_masa', imagenFalUrl: ACTIVOS_3D_CATALOGO['pan brioche artesanal'] },
    { id: 'ins_2', nombre: 'Carne Vacuno Lomo (200g)', costoUnitario: 2400, unidadMedida: 'un', tipologia: 'carne_roja_embutido', imagenFalUrl: ACTIVOS_3D_CATALOGO['carne vacuno lomo (200g)'] },
    { id: 'ins_3', nombre: 'Tomates Frescos (100g)', costoUnitario: 350, unidadMedida: 'un', tipologia: 'verdura_fruto', imagenFalUrl: ACTIVOS_3D_CATALOGO['tomates frescos (100g)'] },
    { id: 'ins_4', nombre: 'Queso Cheddar Fundido', costoUnitario: 450, unidadMedida: 'un', tipologia: 'lacteo_queso_huevo', imagenFalUrl: ACTIVOS_3D_CATALOGO['queso cheddar fundido'] },
    { id: 'ins_5', nombre: 'Lechuga Hidropónica', costoUnitario: 250, unidadMedida: 'un', tipologia: 'verdura_hoja', imagenFalUrl: ACTIVOS_3D_CATALOGO['lechuga hidropónica'] },
    { id: 'ins_6', nombre: 'Papas Fritas Porción', costoUnitario: 650, unidadMedida: 'un', tipologia: 'fritura_snack', imagenFalUrl: ACTIVOS_3D_CATALOGO['papas fritas porción'] },
    { id: 'ins_7', nombre: 'Manzanas Rojas', costoUnitario: 1200, unidadMedida: 'kg', tipologia: 'fruta_fresca', imagenFalUrl: ACTIVOS_3D_CATALOGO['manzanas rojas'] },
    { id: 'ins_8', nombre: 'Palta Hass Cremosa', costoUnitario: 650, unidadMedida: 'un', tipologia: 'palta_oleaginosa', imagenFalUrl: construirUrlActivo3D('Palta Hass Cremosa', 'restaurant') },
    { id: 'ins_9', nombre: 'Cebolla Morada Pluma', costoUnitario: 240, unidadMedida: 'un', tipologia: 'verdura_raiz_bulbo', imagenFalUrl: construirUrlActivo3D('Cebolla Morada Pluma', 'restaurant') },
  ],
  minimarket: [
    { id: 'ins_mini_1', nombre: 'Bebida Botella 1.5L', costoUnitario: 950, unidadMedida: 'un', tipologia: 'bebida_lacteo_liquido', imagenFalUrl: ACTIVOS_3D_CATALOGO['bebida botella 1.5l'] },
    { id: 'ins_mini_2', nombre: 'Pan de Molde Familiar', costoUnitario: 1400, unidadMedida: 'un', tipologia: 'panaderia_masa', imagenFalUrl: ACTIVOS_3D_CATALOGO['pan de molde familiar'] },
    { id: 'ins_mini_3', nombre: 'Leche Entera 1L', costoUnitario: 820, unidadMedida: 'lt', tipologia: 'bebida_lacteo_liquido', imagenFalUrl: ACTIVOS_3D_CATALOGO['leche entera 1l'] },
    { id: 'ins_mini_4', nombre: 'Tornillos Yeso Cartón 100u', costoUnitario: 1900, unidadMedida: 'un', tipologia: 'ferreteria_herramienta', imagenFalUrl: ACTIVOS_3D_CATALOGO['tornillos yeso cartón 100u'] },
    { id: 'ins_mini_5', nombre: 'Café Grano Tostado 250g', costoUnitario: 2600, unidadMedida: 'un', tipologia: 'cafe_infusion_cacao', imagenFalUrl: ACTIVOS_3D_CATALOGO['café grano tostado 250g'] },
    { id: 'ins_mini_6', nombre: 'Arroz Grado 1 Selección', costoUnitario: 1150, unidadMedida: 'kg', tipologia: 'abarrote_grano_condimento', imagenFalUrl: construirUrlActivo3D('Arroz Grado 1 Selección', 'minimarket') },
  ],
  services: [
    { id: 'ins_srv_1', nombre: 'Consultor Senior MBA', costoUnitario: 18000, unidadMedida: 'hr', tipologia: 'servicios_consultoria_diseno', imagenFalUrl: ACTIVOS_3D_CATALOGO['consultor senior mba'] },
    { id: 'ins_srv_2', nombre: 'Desarrollador FullStack', costoUnitario: 14000, unidadMedida: 'hr', tipologia: 'servicios_software_cloud', imagenFalUrl: ACTIVOS_3D_CATALOGO['desarrollador fullstack'] },
    { id: 'ins_srv_3', nombre: 'Licencia Software Cloud', costoUnitario: 6500, unidadMedida: 'un', tipologia: 'servicios_software_cloud', imagenFalUrl: ACTIVOS_3D_CATALOGO['licencia software cloud'] },
    { id: 'ins_srv_4', nombre: 'Diseñador UI/UX', costoUnitario: 11000, unidadMedida: 'hr', tipologia: 'servicios_consultoria_diseno', imagenFalUrl: ACTIVOS_3D_CATALOGO['diseñador ui/ux'] },
  ],
};

const RECETAS_DEFAULT = {
  restaurant: [
    {
      id: 'rec_1',
      nombre: 'Hamburguesa Artesanal Completa',
      precioVenta: 9900,
      mixPorcentaje: 42,
      ingredientes: [
        { idAsignado: 'ing_1', id: 'ins_1', nombre: 'Pan Brioche Artesanal', costoUnitario: 800, cantidad: 1, unidadMedida: 'un', tipologia: 'panaderia_masa', imagenFalUrl: ACTIVOS_3D_CATALOGO['pan brioche artesanal'] },
        { idAsignado: 'ing_2', id: 'ins_2', nombre: 'Carne Vacuno Lomo (200g)', costoUnitario: 2400, cantidad: 1, unidadMedida: 'un', tipologia: 'carne_roja_embutido', imagenFalUrl: ACTIVOS_3D_CATALOGO['carne vacuno lomo (200g)'] },
        { idAsignado: 'ing_3', id: 'ins_3', nombre: 'Tomates Frescos (100g)', costoUnitario: 350, cantidad: 1, unidadMedida: 'un', tipologia: 'verdura_fruto', imagenFalUrl: ACTIVOS_3D_CATALOGO['tomates frescos (100g)'] },
        { idAsignado: 'ing_4', id: 'ins_4', nombre: 'Queso Cheddar Fundido', costoUnitario: 450, cantidad: 1, unidadMedida: 'un', tipologia: 'lacteo_queso_huevo', imagenFalUrl: ACTIVOS_3D_CATALOGO['queso cheddar fundido'] },
        { idAsignado: 'ing_5', id: 'ins_5', nombre: 'Lechuga Hidropónica', costoUnitario: 250, cantidad: 1, unidadMedida: 'un', tipologia: 'verdura_hoja', imagenFalUrl: ACTIVOS_3D_CATALOGO['lechuga hidropónica'] },
      ],
    },
    {
      id: 'rec_2',
      nombre: 'Combo Papas Fritas & Bebida (Gancho)',
      precioVenta: 3400,
      mixPorcentaje: 33,
      ingredientes: [
        { idAsignado: 'ing_p1', id: 'ins_6', nombre: 'Papas Fritas Porción', costoUnitario: 650, cantidad: 2, unidadMedida: 'un', tipologia: 'fritura_snack', imagenFalUrl: ACTIVOS_3D_CATALOGO['papas fritas porción'] },
        { idAsignado: 'ing_p2', id: 'ins_4', nombre: 'Queso Cheddar Fundido', costoUnitario: 450, cantidad: 1, unidadMedida: 'un', tipologia: 'lacteo_queso_huevo', imagenFalUrl: ACTIVOS_3D_CATALOGO['queso cheddar fundido'] },
      ],
    },
    {
      id: 'rec_3',
      nombre: 'Bowl Gourmet Palta & Lomo (Joya)',
      precioVenta: 12900,
      mixPorcentaje: 15,
      ingredientes: [
        { idAsignado: 'ing_b1', id: 'ins_2', nombre: 'Carne Vacuno Lomo (200g)', costoUnitario: 2400, cantidad: 1, unidadMedida: 'un', tipologia: 'carne_roja_embutido', imagenFalUrl: ACTIVOS_3D_CATALOGO['carne vacuno lomo (200g)'] },
        { idAsignado: 'ing_b2', id: 'ins_8', nombre: 'Palta Hass Cremosa', costoUnitario: 650, cantidad: 2, unidadMedida: 'un', tipologia: 'palta_oleaginosa', imagenFalUrl: construirUrlActivo3D('Palta Hass Cremosa', 'restaurant') },
        { idAsignado: 'ing_b3', id: 'ins_5', nombre: 'Lechuga Hidropónica', costoUnitario: 250, cantidad: 1, unidadMedida: 'un', tipologia: 'verdura_hoja', imagenFalUrl: ACTIVOS_3D_CATALOGO['lechuga hidropónica'] },
      ],
    },
    {
      id: 'rec_4',
      nombre: 'Tarta Tibia de Manzanas (Baja Rotación)',
      precioVenta: 3800,
      mixPorcentaje: 10,
      ingredientes: [
        { idAsignado: 'ing_6', id: 'ins_7', nombre: 'Manzanas Rojas', costoUnitario: 1200, cantidad: 1, unidadMedida: 'kg', tipologia: 'fruta_fresca', imagenFalUrl: ACTIVOS_3D_CATALOGO['manzanas rojas'] },
        { idAsignado: 'ing_7', id: 'ins_1', nombre: 'Pan Brioche Artesanal', costoUnitario: 800, cantidad: 1, unidadMedida: 'un', tipologia: 'panaderia_masa', imagenFalUrl: ACTIVOS_3D_CATALOGO['pan brioche artesanal'] },
      ],
    },
  ],
  minimarket: [
    {
      id: 'rec_mini_1',
      nombre: 'Pack Desayuno Familiar Express',
      precioVenta: 8490,
      mixPorcentaje: 40,
      ingredientes: [
        { idAsignado: 'ing_m1', id: 'ins_mini_2', nombre: 'Pan de Molde Familiar', costoUnitario: 1400, cantidad: 1, unidadMedida: 'un', tipologia: 'panaderia_masa', imagenFalUrl: ACTIVOS_3D_CATALOGO['pan de molde familiar'] },
        { idAsignado: 'ing_m2', id: 'ins_mini_3', nombre: 'Leche Entera 1L', costoUnitario: 820, cantidad: 2, unidadMedida: 'lt', tipologia: 'bebida_lacteo_liquido', imagenFalUrl: ACTIVOS_3D_CATALOGO['leche entera 1l'] },
        { idAsignado: 'ing_m3', id: 'ins_mini_5', nombre: 'Café Grano Tostado 250g', costoUnitario: 2600, cantidad: 1, unidadMedida: 'un', tipologia: 'cafe_infusion_cacao', imagenFalUrl: ACTIVOS_3D_CATALOGO['café grano tostado 250g'] },
      ],
    },
    {
      id: 'rec_mini_2',
      nombre: 'Six-Pack Bebidas + Pan (Gancho Tráfico)',
      precioVenta: 4200,
      mixPorcentaje: 35,
      ingredientes: [
        { idAsignado: 'ing_m4', id: 'ins_mini_1', nombre: 'Bebida Botella 1.5L', costoUnitario: 950, cantidad: 2, unidadMedida: 'un', tipologia: 'bebida_lacteo_liquido', imagenFalUrl: ACTIVOS_3D_CATALOGO['bebida botella 1.5l'] },
        { idAsignado: 'ing_m5', id: 'ins_mini_2', nombre: 'Pan de Molde Familiar', costoUnitario: 1400, cantidad: 1, unidadMedida: 'un', tipologia: 'panaderia_masa', imagenFalUrl: ACTIVOS_3D_CATALOGO['pan de molde familiar'] },
      ],
    },
    {
      id: 'rec_mini_3',
      nombre: 'Kit Ferretería & Hogar Pro',
      precioVenta: 9900,
      mixPorcentaje: 15,
      ingredientes: [
        { idAsignado: 'ing_m6', id: 'ins_mini_4', nombre: 'Tornillos Yeso Cartón 100u', costoUnitario: 1900, cantidad: 2, unidadMedida: 'un', tipologia: 'ferreteria_herramienta', imagenFalUrl: ACTIVOS_3D_CATALOGO['tornillos yeso cartón 100u'] },
      ],
    },
    {
      id: 'rec_mini_4',
      nombre: 'Bolsa Abarrotes Básica',
      precioVenta: 3100,
      mixPorcentaje: 10,
      ingredientes: [
        { idAsignado: 'ing_m7', id: 'ins_mini_6', nombre: 'Arroz Grado 1 Selección', costoUnitario: 1150, cantidad: 2, unidadMedida: 'kg', tipologia: 'abarrote_grano_condimento', imagenFalUrl: construirUrlActivo3D('Arroz Grado 1 Selección', 'minimarket') },
      ],
    },
  ],
  services: [
    {
      id: 'rec_srv_1',
      nombre: 'Auditoría Estratégica & TI Mensual',
      precioVenta: 75000,
      mixPorcentaje: 40,
      ingredientes: [
        { idAsignado: 'ing_s1', id: 'ins_srv_1', nombre: 'Consultor Senior MBA', costoUnitario: 18000, cantidad: 1, unidadMedida: 'hr', tipologia: 'servicios_consultoria_diseno', imagenFalUrl: ACTIVOS_3D_CATALOGO['consultor senior mba'] },
        { idAsignado: 'ing_s2', id: 'ins_srv_2', nombre: 'Desarrollador FullStack', costoUnitario: 14000, cantidad: 1, unidadMedida: 'hr', tipologia: 'servicios_software_cloud', imagenFalUrl: ACTIVOS_3D_CATALOGO['desarrollador fullstack'] },
        { idAsignado: 'ing_s3', id: 'ins_srv_3', nombre: 'Licencia Software Cloud', costoUnitario: 6500, cantidad: 1, unidadMedida: 'un', tipologia: 'servicios_software_cloud', imagenFalUrl: ACTIVOS_3D_CATALOGO['licencia software cloud'] },
      ],
    },
    {
      id: 'rec_srv_2',
      nombre: 'Soporte Cloud & Mantenimiento Mensual',
      precioVenta: 34000,
      mixPorcentaje: 35,
      ingredientes: [
        { idAsignado: 'ing_s4', id: 'ins_srv_2', nombre: 'Desarrollador FullStack', costoUnitario: 14000, cantidad: 1, unidadMedida: 'hr', tipologia: 'servicios_software_cloud', imagenFalUrl: ACTIVOS_3D_CATALOGO['desarrollador fullstack'] },
        { idAsignado: 'ing_s5', id: 'ins_srv_3', nombre: 'Licencia Software Cloud', costoUnitario: 6500, cantidad: 1, unidadMedida: 'un', tipologia: 'servicios_software_cloud', imagenFalUrl: ACTIVOS_3D_CATALOGO['licencia software cloud'] },
      ],
    },
    {
      id: 'rec_srv_3',
      nombre: 'Consultoría Directorio Alta Dirección',
      precioVenta: 95000,
      mixPorcentaje: 15,
      ingredientes: [
        { idAsignado: 'ing_s6', id: 'ins_srv_1', nombre: 'Consultor Senior MBA', costoUnitario: 18000, cantidad: 2, unidadMedida: 'hr', tipologia: 'servicios_consultoria_diseno', imagenFalUrl: ACTIVOS_3D_CATALOGO['consultor senior mba'] },
      ],
    },
    {
      id: 'rec_srv_4',
      nombre: 'Maquetación Pieza Gráfica Simple',
      precioVenta: 22000,
      mixPorcentaje: 10,
      ingredientes: [
        { idAsignado: 'ing_s7', id: 'ins_srv_4', nombre: 'Diseñador UI/UX', costoUnitario: 11000, cantidad: 1.5, unidadMedida: 'hr', tipologia: 'servicios_consultoria_diseno', imagenFalUrl: ACTIVOS_3D_CATALOGO['diseñador ui/ux'] },
      ],
    },
  ],
};

const COSTOS_FIJOS_DEFAULT = {
  restaurant: [
    { id: 'cf_1', nombre: 'Arriendo Local Comercial', monto: 850000, categoria: 'Infraestructura' },
    { id: 'cf_2', nombre: 'Sueldos Base Cocina y Caja', monto: 1200000, categoria: 'Personal' },
    { id: 'cf_3', nombre: 'Servicios Básicos (Luz, Agua, Gas)', monto: 280000, categoria: 'Operacional' },
  ],
  minimarket: [
    { id: 'cf_mini_1', nombre: 'Arriendo Almacén de Barrio', monto: 650000, categoria: 'Infraestructura' },
    { id: 'cf_mini_2', nombre: 'Remuneraciones Personal Fijo', monto: 950000, categoria: 'Personal' },
    { id: 'cf_mini_3', nombre: 'Electricidad Refrigeradores', monto: 320000, categoria: 'Operacional' },
  ],
  services: [
    { id: 'cf_srv_1', nombre: 'Arriendo Espacio Coworking / Oficina', monto: 450000, categoria: 'Infraestructura' },
    { id: 'cf_srv_2', nombre: 'Servicios de Conectividad y SaaS', monto: 180000, categoria: 'Tecnología' },
    { id: 'cf_srv_3', nombre: 'Sueldos de Gestión Administrativa', monto: 800000, categoria: 'Personal' },
  ],
};

const AppStateContext = createContext(null);

export function AppStateProvider({ children }) {
  // Autenticación Supabase
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState('idle');
  const isInitialLoadRef = useRef(true);
  const syncTimeoutRef = useRef(null);

  // Perfil de negocio (restaurant, minimarket, services)
  const [perfil, setPerfil] = useState('restaurant');
  const [nombreNegocio, setNombreNegocio] = useState('Restaurante y Bistró Central');

  // 1. Sueldo Objetivo Líquido Mensual (Ingeniería Inversa Target Profit) y Capacidad Operativa
  const [sueldoObjetivo, setSueldoObjetivo] = useState(1500000);
  const [diasOperativosMes, setDiasOperativosMes] = useState(25);
  const [horasOperativasDia, setHorasOperativasDia] = useState(8);
  const [capacidadMaximaHora, setCapacidadMaximaHora] = useState(14);

  // 2. Configuración del Detector de "Fugas de Margen" (Costos Ocultos)
  const [fugasConfig, setFugasConfig] = useState({
    incluirIVA: false,
    incluirPOS: true,
    comisionPOSPorcentaje: 2.95,
    incluirDelivery: false,
    comisionDeliveryPorcentaje: 28,
    mermaPackagingPorcentaje: 3.0,
  });

  // Insumos disponibles en catálogo
  const [insumos, setInsumos] = useState(INSUMOS_DEFAULT.restaurant);

  // Catálogo de Recetas / Productos Creados
  const [recetas, setRecetas] = useState(RECETAS_DEFAULT.restaurant);

  // Receta en Preparación adentro de la Ollita / Stand
  const [recetaEnOlla, setRecetaEnOlla] = useState(RECETAS_DEFAULT.restaurant[0]);

  // Costos Fijos
  const [costosFijos, setCostosFijos] = useState(COSTOS_FIJOS_DEFAULT.restaurant);

  // Parámetros Clave para Punto de Equilibrio
  const [ventasEstimadasMensuales, setVentasEstimadasMensuales] = useState(650);

  // Costo Directo Unitario Base (CV de ingredientes en la ollita)
  const costoVariableConsolidado = useMemo(() => {
    if (!recetaEnOlla || !Array.isArray(recetaEnOlla.ingredientes)) return 0;
    return recetaEnOlla.ingredientes.reduce(
      (acc, item) => acc + Number(item.costoUnitario || 0) * Number(item.cantidad || 1),
      0
    );
  }, [recetaEnOlla]);

  // Precio de venta consolidado derivado de la receta activa
  const precioVentaConsolidado = useMemo(() => {
    return Number(recetaEnOlla?.precioVenta || 9900);
  }, [recetaEnOlla]);

  // Costo Fijo Total mensual
  const costoFijoTotal = useMemo(() => {
    return costosFijos.reduce((acc, item) => acc + Number(item.monto || 0), 0);
  }, [costosFijos]);

  // Telemetría de Fugas de Margen en tiempo real sobre el producto activo
  const analisisFugasActivas = useMemo(() => {
    return calcularFugasDeMargen({
      precioBruto: precioVentaConsolidado,
      costoDirectoBase: costoVariableConsolidado,
      ...fugasConfig,
    });
  }, [precioVentaConsolidado, costoVariableConsolidado, fugasConfig]);

  const actualizarFugasConfig = useCallback((parcial) => {
    setFugasConfig((prev) => ({ ...prev, ...parcial }));
  }, []);

  // Cambiar perfil de negocio
  const cambiarPerfil = useCallback((nuevoPerfil) => {
    setPerfil(nuevoPerfil);
    const nombres = {
      restaurant: 'Restaurante y Bistró Central',
      minimarket: 'Minimarket & Abarrotes Express',
      services: 'Agencia de Consultoría & TI',
    };
    setNombreNegocio(nombres[nuevoPerfil] || 'Mi Negocio PyME');

    const nuevosInsumos = INSUMOS_DEFAULT[nuevoPerfil] || [];
    setInsumos(nuevosInsumos);

    const nuevasRecetas = RECETAS_DEFAULT[nuevoPerfil] || [];
    setRecetas(nuevasRecetas);
    setRecetaEnOlla(nuevasRecetas[0] || { nombre: 'Nuevo Producto', precioVenta: 5000, mixPorcentaje: 100, ingredientes: [] });

    setCostosFijos(COSTOS_FIJOS_DEFAULT[nuevoPerfil] || []);

    if (nuevoPerfil === 'restaurant') {
      setVentasEstimadasMensuales(650);
      setCapacidadMaximaHora(14);
    } else if (nuevoPerfil === 'minimarket') {
      setVentasEstimadasMensuales(1100);
      setCapacidadMaximaHora(25);
    } else if (nuevoPerfil === 'services') {
      setVentasEstimadasMensuales(85);
      setCapacidadMaximaHora(3);
    }
  }, []);

  // Mutadores de Insumos
  const agregarInsumo = (nuevoItem) => {
    const tipologiaDetectada = nuevoItem.tipologia || clasificarTipologiaInsumo(nuevoItem.nombre, perfil).id;
    const itemCon3D = {
      ...nuevoItem,
      tipologia: tipologiaDetectada,
      imagenFalUrl: nuevoItem.imagenFalUrl || construirUrlActivo3D(nuevoItem.nombre, perfil),
    };
    setInsumos((prev) => [itemCon3D, ...prev]);
  };

  const eliminarInsumo = (id) => {
    setInsumos((prev) => prev.filter((item) => item.id !== id));
    setRecetaEnOlla((prev) => ({
      ...prev,
      ingredientes: (prev.ingredientes || []).filter((item) => item.id !== id),
    }));
  };

  const editarInsumo = (itemActualizado) => {
    setInsumos((prev) =>
      prev.map((item) => (item.id === itemActualizado.id ? { ...item, ...itemActualizado } : item))
    );
    setRecetaEnOlla((prev) => ({
      ...prev,
      ingredientes: (prev.ingredientes || []).map((item) =>
        item.id === itemActualizado.id ? { ...item, ...itemActualizado } : item
      ),
    }));
  };

  // Dinámica de la Ollita / Generador de Recetas
  const agregarIngredienteAOlla = (insumo, cantidad = 1) => {
    setRecetaEnOlla((prev) => {
      const ingredientesActuales = prev.ingredientes || [];
      const existente = ingredientesActuales.find((item) => item.id === insumo.id);

      if (existente) {
        return {
          ...prev,
          ingredientes: ingredientesActuales.map((item) =>
            item.id === insumo.id ? { ...item, cantidad: (item.cantidad || 1) + cantidad } : item
          ),
        };
      }

      const nuevoIngrediente = {
        ...insumo,
        idAsignado: `ing_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        cantidad,
      };

      return {
        ...prev,
        ingredientes: [...ingredientesActuales, nuevoIngrediente],
      };
    });
  };

  const eliminarIngredienteDeOlla = (idAsignadoOId) => {
    setRecetaEnOlla((prev) => ({
      ...prev,
      ingredientes: (prev.ingredientes || []).filter(
        (item) => item.idAsignado !== idAsignadoOId && item.id !== idAsignadoOId
      ),
    }));
  };

  const cambiarCantidadIngrediente = (idAsignado, nuevaCantidad) => {
    const cant = Math.max(0.1, Number(nuevaCantidad) || 1);
    setRecetaEnOlla((prev) => ({
      ...prev,
      ingredientes: (prev.ingredientes || []).map((item) =>
        item.idAsignado === idAsignado || item.id === idAsignado ? { ...item, cantidad: cant } : item
      ),
    }));
  };

  const setNombreRecetaEnOlla = (nuevoNombre) => {
    setRecetaEnOlla((prev) => ({ ...prev, nombre: nuevoNombre }));
  };

  const setPrecioRecetaEnOlla = (nuevoPrecio) => {
    const precioNum = Math.max(0, Number(nuevoPrecio) || 0);
    setRecetaEnOlla((prev) => {
      const actualizada = { ...prev, precioVenta: precioNum };
      setRecetas((lista) => lista.map((r) => (r.id === actualizada.id ? { ...r, precioVenta: precioNum } : r)));
      return actualizada;
    });
  };

  const vaciarOlla = () => {
    setRecetaEnOlla({
      id: 'rec_' + Date.now(),
      nombre: perfil === 'restaurant' ? 'Nueva Receta de Plato' : perfil === 'minimarket' ? 'Nuevo Pack de Productos' : 'Nueva Propuesta de Servicio',
      precioVenta: 5000,
      mixPorcentaje: 20,
      ingredientes: [],
    });
  };

  const guardarRecetaActiva = () => {
    if (!recetaEnOlla) return;
    const recetaGuardada = {
      ...recetaEnOlla,
      id: recetaEnOlla.id || 'rec_' + Date.now(),
      costoTotal: costoVariableConsolidado,
      mixPorcentaje: recetaEnOlla.mixPorcentaje || 25,
    };

    setRecetas((prev) => {
      const existe = prev.some((r) => r.id === recetaGuardada.id);
      if (existe) {
        return prev.map((r) => (r.id === recetaGuardada.id ? recetaGuardada : r));
      }
      return [recetaGuardada, ...prev];
    });
  };

  const cargarRecetaEnOlla = (receta) => {
    setRecetaEnOlla({ ...receta });
  };

  // Mutadores de Mix Multiproducto e Ingeniería de Menú
  const actualizarMixReceta = (idReceta, nuevoMix) => {
    const valor = Math.max(1, Math.min(100, Number(nuevoMix) || 1));
    setRecetas((prev) => prev.map((r) => (r.id === idReceta ? { ...r, mixPorcentaje: valor } : r)));
  };

  const ajustarPrecioRecetaPorId = (idReceta, factorMultiplicador = 1.05) => {
    setRecetas((prev) =>
      prev.map((r) => {
        if (r.id !== idReceta) return r;
        const nuevoPrecio = Math.ceil((Number(r.precioVenta || 1000) * factorMultiplicador) / 100) * 100;
        if (recetaEnOlla?.id === idReceta) {
          setRecetaEnOlla((actual) => ({ ...actual, precioVenta: nuevoPrecio }));
        }
        return { ...r, precioVenta: nuevoPrecio };
      })
    );
  };

  const eliminarRecetaPorId = (idReceta) => {
    setRecetas((prev) => {
      if (prev.length <= 1) return prev;
      const filtradas = prev.filter((r) => r.id !== idReceta);
      if (recetaEnOlla?.id === idReceta && filtradas[0]) {
        setRecetaEnOlla(filtradas[0]);
      }
      return filtradas;
    });
  };

  // Mutadores de Costos Fijos
  const agregarCostoFijo = (nuevoCF) => {
    setCostosFijos((prev) => [...prev, nuevoCF]);
  };

  const eliminarCostoFijo = (id) => {
    setCostosFijos((prev) => prev.filter((cf) => cf.id !== id));
  };

  // Sincronización Supabase
  const sincronizarConNube = useCallback(async () => {
    if (!user?.id) return;
    try {
      setSyncStatus('syncing');
      await sincronizarTodoElNegocio(user.id, {
        perfil,
        nombreNegocio,
        ventasEstimadasMensuales,
        porcentajeMermaGlobal: fugasConfig.mermaPackagingPorcentaje,
        margenObjetivoPorcentaje: 40,
        costosFijos,
        costosVariables: [{ id: 'cv_dir', nombre: recetaEnOlla?.nombre || 'Receta Activa', costoPorUnidad: costoVariableConsolidado }],
        lotesLIFO: [],
        insumos,
        recetas,
        inventario: [],
        servicios: [],
      });
      setSyncStatus('synced');
    } catch (err) {
      console.error('Error sincronizando con Supabase:', err);
      setSyncStatus('error');
    }
  }, [user, perfil, nombreNegocio, ventasEstimadasMensuales, fugasConfig.mermaPackagingPorcentaje, costosFijos, costoVariableConsolidado, insumos, recetas, recetaEnOlla]);

  useEffect(() => {
    if (isInitialLoadRef.current || !user?.id) return;
    if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    syncTimeoutRef.current = setTimeout(() => {
      sincronizarConNube();
    }, 2500);
    return () => {
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    };
  }, [user, perfil, nombreNegocio, costosFijos, insumos, recetaEnOlla, sincronizarConNube]);

  // Sesión Supabase al inicio
  useEffect(() => {
    async function initAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const activeUser = session?.user || null;
        setUser(activeUser);
        if (activeUser) {
          const datos = await cargarDatosUsuario(activeUser.id);
          if (datos?.perfil) {
            setPerfil(datos.perfil.perfil || 'restaurant');
            setNombreNegocio(datos.perfil.nombre_negocio || 'Mi Negocio PyME');
            if (datos.perfil.ventas_estimadas_mensuales) {
              setVentasEstimadasMensuales(Number(datos.perfil.ventas_estimadas_mensuales));
            }
          }
          if (datos?.costosFijos?.length) setCostosFijos(datos.costosFijos);
          if (datos?.insumos?.length) setInsumos(datos.insumos);
          if (datos?.recetas?.length) {
            setRecetas(datos.recetas);
            setRecetaEnOlla(datos.recetas[0]);
          }
        }
      } catch (e) {
        console.warn('Supabase offline:', e.message);
      } finally {
        setAuthLoading(false);
        isInitialLoadRef.current = false;
      }
    }
    initAuth();
  }, []);

  const cerrarSesion = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      setUser,
      authLoading,
      syncStatus,
      sincronizarConNube,
      cerrarSesion,
      perfil,
      cambiarPerfil,
      nombreNegocio,
      setNombreNegocio,
      sueldoObjetivo,
      setSueldoObjetivo,
      diasOperativosMes,
      setDiasOperativosMes,
      horasOperativasDia,
      setHorasOperativasDia,
      capacidadMaximaHora,
      setCapacidadMaximaHora,
      fugasConfig,
      actualizarFugasConfig,
      analisisFugasActivas,
      precioVentaConsolidado,
      ventasEstimadasMensuales,
      setVentasEstimadasMensuales,
      costoVariableConsolidado,
      costoFijoTotal,
      insumos,
      recetas,
      recetaEnOlla,
      insumosAsignados: recetaEnOlla?.ingredientes || [],
      agregarInsumo,
      editarInsumo,
      eliminarInsumo,
      agregarIngredienteAOlla,
      eliminarIngredienteDeOlla,
      cambiarCantidadIngrediente,
      setNombreRecetaEnOlla,
      setPrecioRecetaEnOlla,
      guardarRecetaActiva,
      cargarRecetaEnOlla,
      vaciarOlla,
      actualizarMixReceta,
      ajustarPrecioRecetaPorId,
      eliminarRecetaPorId,
      costosFijos,
      agregarCostoFijo,
      eliminarCostoFijo,
    }),
    [
      user,
      authLoading,
      syncStatus,
      sincronizarConNube,
      perfil,
      cambiarPerfil,
      nombreNegocio,
      sueldoObjetivo,
      diasOperativosMes,
      horasOperativasDia,
      capacidadMaximaHora,
      fugasConfig,
      actualizarFugasConfig,
      analisisFugasActivas,
      precioVentaConsolidado,
      ventasEstimadasMensuales,
      costoVariableConsolidado,
      costoFijoTotal,
      insumos,
      recetas,
      recetaEnOlla,
      costosFijos,
    ]
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) throw new Error('useAppState debe usarse dentro de un AppStateProvider');
  return context;
}