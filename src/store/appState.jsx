import React, { createContext, useContext, useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase.js';
import { cargarDatosUsuario, sincronizarTodoElNegocio } from '../services/dbService.js';

const INSUMOS_DEFAULT = {
  restaurant: [
    { id: 'ins_1', nombre: 'Pan Brioche Artesanal', costoUnitario: 800, unidadMedida: 'un', imagenFalUrl: null },
    { id: 'ins_2', nombre: 'Carne Vacuno Lomo (200g)', costoUnitario: 2400, unidadMedida: 'un', imagenFalUrl: null },
    { id: 'ins_3', nombre: 'Tomates Frescos (100g)', costoUnitario: 350, unidadMedida: 'un', imagenFalUrl: null },
    { id: 'ins_4', nombre: 'Queso Cheddar Fundido', costoUnitario: 450, unidadMedida: 'un', imagenFalUrl: null },
    { id: 'ins_5', nombre: 'Lechuga Hidropónica', costoUnitario: 250, unidadMedida: 'un', imagenFalUrl: null },
    { id: 'ins_6', nombre: 'Papas Fritas Porción', costoUnitario: 650, unidadMedida: 'un', imagenFalUrl: null },
    { id: 'ins_7', nombre: 'Manzanas Rojas', costoUnitario: 1200, unidadMedida: 'kg', imagenFalUrl: null },
  ],
  minimarket: [
    { id: 'ins_mini_1', nombre: 'Bebida Botella 1.5L', costoUnitario: 950, unidadMedida: 'un', imagenFalUrl: null },
    { id: 'ins_mini_2', nombre: 'Pan de Molde Familiar', costoUnitario: 1400, unidadMedida: 'un', imagenFalUrl: null },
    { id: 'ins_mini_3', nombre: 'Leche Entera 1L', costoUnitario: 820, unidadMedida: 'lt', imagenFalUrl: null },
    { id: 'ins_mini_4', nombre: 'Tornillos Yeso Cartón 100u', costoUnitario: 1900, unidadMedida: 'un', imagenFalUrl: null },
    { id: 'ins_mini_5', nombre: 'Café Grano Tostado 250g', costoUnitario: 2600, unidadMedida: 'un', imagenFalUrl: null },
  ],
  services: [
    { id: 'ins_srv_1', nombre: 'Consultor Senior MBA', costoUnitario: 18000, unidadMedida: 'hr', imagenFalUrl: null },
    { id: 'ins_srv_2', nombre: 'Desarrollador FullStack', costoUnitario: 14000, unidadMedida: 'hr', imagenFalUrl: null },
    { id: 'ins_srv_3', nombre: 'Licencia Software Cloud', costoUnitario: 6500, unidadMedida: 'un', imagenFalUrl: null },
    { id: 'ins_srv_4', nombre: 'Diseñador UI/UX', costoUnitario: 11000, unidadMedida: 'hr', imagenFalUrl: null },
  ],
};

const RECETAS_DEFAULT = {
  restaurant: [
    {
      id: 'rec_1',
      nombre: 'Hamburguesa Artesanal Completa',
      precioVenta: 8900,
      ingredientes: [
        { idAsignado: 'ing_1', id: 'ins_1', nombre: 'Pan Brioche Artesanal', costoUnitario: 800, cantidad: 1, unidadMedida: 'un' },
        { idAsignado: 'ing_2', id: 'ins_2', nombre: 'Carne Vacuno Lomo (200g)', costoUnitario: 2400, cantidad: 1, unidadMedida: 'un' },
        { idAsignado: 'ing_3', id: 'ins_3', nombre: 'Tomates Frescos (100g)', costoUnitario: 350, cantidad: 1, unidadMedida: 'un' },
        { idAsignado: 'ing_4', id: 'ins_4', nombre: 'Queso Cheddar Fundido', costoUnitario: 450, cantidad: 1, unidadMedida: 'un' },
        { idAsignado: 'ing_5', id: 'ins_5', nombre: 'Lechuga Hidropónica', costoUnitario: 250, cantidad: 1, unidadMedida: 'un' },
      ],
    },
    {
      id: 'rec_2',
      nombre: 'Tarta Tibia de Manzanas',
      precioVenta: 4500,
      ingredientes: [
        { idAsignado: 'ing_6', id: 'ins_7', nombre: 'Manzanas Rojas', costoUnitario: 1200, cantidad: 1, unidadMedida: 'kg' },
        { idAsignado: 'ing_7', id: 'ins_1', nombre: 'Pan Brioche Artesanal', costoUnitario: 800, cantidad: 1, unidadMedida: 'un' },
      ],
    },
  ],
  minimarket: [
    {
      id: 'rec_mini_1',
      nombre: 'Pack Desayuno Familiar Express',
      precioVenta: 6990,
      ingredientes: [
        { idAsignado: 'ing_m1', id: 'ins_mini_2', nombre: 'Pan de Molde Familiar', costoUnitario: 1400, cantidad: 1, unidadMedida: 'un' },
        { idAsignado: 'ing_m2', id: 'ins_mini_3', nombre: 'Leche Entera 1L', costoUnitario: 820, cantidad: 2, unidadMedida: 'lt' },
        { idAsignado: 'ing_m3', id: 'ins_mini_5', nombre: 'Café Grano Tostado 250g', costoUnitario: 2600, cantidad: 1, unidadMedida: 'un' },
      ],
    },
  ],
  services: [
    {
      id: 'rec_srv_1',
      nombre: 'Auditoría Estratégica & TI Mensual',
      precioVenta: 55000,
      ingredientes: [
        { idAsignado: 'ing_s1', id: 'ins_srv_1', nombre: 'Consultor Senior MBA', costoUnitario: 18000, cantidad: 1, unidadMedida: 'hr' },
        { idAsignado: 'ing_s2', id: 'ins_srv_2', nombre: 'Desarrollador FullStack', costoUnitario: 14000, cantidad: 1, unidadMedida: 'hr' },
        { idAsignado: 'ing_s3', id: 'ins_srv_3', nombre: 'Licencia Software Cloud', costoUnitario: 6500, cantidad: 1, unidadMedida: 'un' },
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

  // Insumos disponibles en catálogo
  const [insumos, setInsumos] = useState(INSUMOS_DEFAULT.restaurant);

  // Catálogo de Recetas / Productos Creados
  const [recetas, setRecetas] = useState(RECETAS_DEFAULT.restaurant);

  // Receta en Preparación adentro de la Ollita / Stand
  const [recetaEnOlla, setRecetaEnOlla] = useState(RECETAS_DEFAULT.restaurant[0]);

  // Costos Fijos
  const [costosFijos, setCostosFijos] = useState(COSTOS_FIJOS_DEFAULT.restaurant);

  // Parámetros Clave para Punto de Equilibrio
  const [ventasEstimadasMensuales, setVentasEstimadasMensuales] = useState(450);

  // Costo Directo Unitario (CV) derivado de la receta activa en la ollita
  const costoVariableConsolidado = useMemo(() => {
    if (!recetaEnOlla || !Array.isArray(recetaEnOlla.ingredientes)) return 0;
    return recetaEnOlla.ingredientes.reduce(
      (acc, item) => acc + Number(item.costoUnitario || 0) * Number(item.cantidad || 1),
      0
    );
  }, [recetaEnOlla]);

  // Precio de venta consolidado derivado de la receta activa
  const precioVentaConsolidado = useMemo(() => {
    return Number(recetaEnOlla?.precioVenta || 8900);
  }, [recetaEnOlla]);

  // Costo Fijo Total mensual
  const costoFijoTotal = useMemo(() => {
    return costosFijos.reduce((acc, item) => acc + Number(item.monto || 0), 0);
  }, [costosFijos]);

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
    setRecetaEnOlla(nuevasRecetas[0] || { nombre: 'Nuevo Producto', precioVenta: 5000, ingredientes: [] });

    setCostosFijos(COSTOS_FIJOS_DEFAULT[nuevoPerfil] || []);

    if (nuevoPerfil === 'restaurant') {
      setVentasEstimadasMensuales(450);
    } else if (nuevoPerfil === 'minimarket') {
      setVentasEstimadasMensuales(1100);
    } else if (nuevoPerfil === 'services') {
      setVentasEstimadasMensuales(90);
    }
  }, []);

  // Mutadores de Insumos
  const agregarInsumo = (nuevoItem) => {
    setInsumos((prev) => [nuevoItem, ...prev]);
  };

  const eliminarInsumo = (id) => {
    setInsumos((prev) => prev.filter((item) => item.id !== id));
    // También quitar de la receta en preparación si estaba
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
    setRecetaEnOlla((prev) => ({ ...prev, precioVenta: Number(nuevoPrecio) || 0 }));
  };

  const vaciarOlla = () => {
    setRecetaEnOlla({
      id: 'rec_' + Date.now(),
      nombre: perfil === 'restaurant' ? 'Nueva Receta de Plato' : perfil === 'minimarket' ? 'Nuevo Pack de Productos' : 'Nueva Propuesta de Servicio',
      precioVenta: 5000,
      ingredientes: [],
    });
  };

  const guardarRecetaActiva = () => {
    if (!recetaEnOlla) return;
    const recetaGuardada = {
      ...recetaEnOlla,
      id: recetaEnOlla.id || 'rec_' + Date.now(),
      costoTotal: costoVariableConsolidado,
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
        porcentajeMermaGlobal: 0,
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
  }, [user, perfil, nombreNegocio, ventasEstimadasMensuales, costosFijos, costoVariableConsolidado, insumos, recetas, recetaEnOlla]);

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