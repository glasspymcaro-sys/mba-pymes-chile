import React, { createContext, useContext, useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase.js';
import { cargarDatosUsuario, sincronizarTodoElNegocio } from '../services/dbService.js';

const INSUMOS_DEFAULT = {
  restaurant: [
    { id: 'ins_1', nombre: 'Manzanas Rojas', costoUnitario: 1200, unidadMedida: 'kg', imagenFalUrl: null },
    { id: 'ins_2', nombre: 'Carne Vacuno Lomo', costoUnitario: 4800, unidadMedida: 'kg', imagenFalUrl: null },
    { id: 'ins_3', nombre: 'Pan Brioche Artesanal', costoUnitario: 800, unidadMedida: 'un', imagenFalUrl: null },
    { id: 'ins_4', nombre: 'Tomates Frescos', costoUnitario: 900, unidadMedida: 'kg', imagenFalUrl: null },
    { id: 'ins_5', nombre: 'Queso Cheddar Fundido', costoUnitario: 1100, unidadMedida: 'kg', imagenFalUrl: null },
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
  const [nombreNegocio, setNombreNegocio] = useState('Mi Negocio PyME');

  // Parámetros Clave para Punto de Equilibrio
  const [precioVentaConsolidado, setPrecioVentaConsolidado] = useState(9500);
  const [ventasEstimadasMensuales, setVentasEstimadasMensuales] = useState(450);

  // Insumos en Catálogo y Insumos Asignados a la Ollita/Estante/Mesa
  const [insumos, setInsumos] = useState(INSUMOS_DEFAULT.restaurant);
  const [insumosAsignados, setInsumosAsignados] = useState([
    INSUMOS_DEFAULT.restaurant[0], // Manzanas
    INSUMOS_DEFAULT.restaurant[1], // Carne
    INSUMOS_DEFAULT.restaurant[2], // Pan
  ]);

  // Costos Fijos
  const [costosFijos, setCostosFijos] = useState(COSTOS_FIJOS_DEFAULT.restaurant);

  // Costo Directo Unitario calculado automáticamente a partir del contenedor 3D
  const costoVariableConsolidado = useMemo(() => {
    return insumosAsignados.reduce((acc, item) => acc + Number(item.costoUnitario || 0), 0);
  }, [insumosAsignados]);

  // Costo Fijo Total mensual
  const costoFijoTotal = useMemo(() => {
    return costosFijos.reduce((acc, item) => acc + Number(item.monto || 0), 0);
  }, [costosFijos]);

  // Cambiar perfil de negocio adaptando insumos 3D y costos
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
    setInsumosAsignados(nuevosInsumos.slice(0, 3));
    setCostosFijos(COSTOS_FIJOS_DEFAULT[nuevoPerfil] || []);

    if (nuevoPerfil === 'restaurant') {
      setPrecioVentaConsolidado(9500);
      setVentasEstimadasMensuales(450);
    } else if (nuevoPerfil === 'minimarket') {
      setPrecioVentaConsolidado(3200);
      setVentasEstimadasMensuales(1100);
    } else if (nuevoPerfil === 'services') {
      setPrecioVentaConsolidado(42000);
      setVentasEstimadasMensuales(90);
    }
  }, []);

  // Mutadores de Insumos y Asignación 3D
  const agregarInsumo = (nuevoItem) => {
    setInsumos((prev) => [nuevoItem, ...prev]);
  };

  const eliminarInsumo = (id) => {
    setInsumos((prev) => prev.filter((item) => item.id !== id));
    setInsumosAsignados((prev) => prev.filter((item) => item.id !== id));
  };

  const asignarInsumoAContenedor = (insumo) => {
    setInsumosAsignados((prev) => {
      // Si ya está, añade otra unidad o duplicado con nuevo id
      const clon = { ...insumo, idAsignado: `${insumo.id}_${Date.now()}` };
      return [...prev, clon];
    });
  };

  const desasignarInsumoDeContenedor = (idAsignadoOId) => {
    setInsumosAsignados((prev) =>
      prev.filter((item) => item.idAsignado !== idAsignadoOId && item.id !== idAsignadoOId)
    );
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
        costosVariables: [{ id: 'cv_dir', nombre: 'Costo Directo 3D', costoPorUnidad: costoVariableConsolidado }],
        lotesLIFO: [],
        insumos,
        recetas: [],
        inventario: [],
        servicios: [],
      });
      setSyncStatus('synced');
    } catch (err) {
      console.error('Error sincronizando con Supabase:', err);
      setSyncStatus('error');
    }
  }, [user, perfil, nombreNegocio, ventasEstimadasMensuales, costosFijos, costoVariableConsolidado, insumos]);

  useEffect(() => {
    if (isInitialLoadRef.current || !user?.id) return;
    if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    syncTimeoutRef.current = setTimeout(() => {
      sincronizarConNube();
    }, 2500);
    return () => {
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    };
  }, [user, perfil, nombreNegocio, costosFijos, insumos, insumosAsignados, precioVentaConsolidado, sincronizarConNube]);

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
        }
      } catch (e) {
        console.warn('Supabase local/offline:', e.message);
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
      setPrecioVentaConsolidado,
      ventasEstimadasMensuales,
      setVentasEstimadasMensuales,
      costoVariableConsolidado,
      costoFijoTotal,
      insumos,
      insumosAsignados,
      costosFijos,
      agregarInsumo,
      eliminarInsumo,
      asignarInsumoAContenedor,
      desasignarInsumoDeContenedor,
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
      insumosAsignados,
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