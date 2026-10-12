import React, { createContext, useContext, useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { mockRestaurant } from '../data/mockRestaurant.js';
import { mockMinimarket } from '../data/mockMinimarket.js';
import { mockServices } from '../data/mockServices.js';
import { supabase } from '../lib/supabase.js';
import { cargarDatosUsuario, sincronizarTodoElNegocio } from '../services/dbService.js';

const datosPorPerfil = {
  restaurant: mockRestaurant,
  minimarket: mockMinimarket,
  services: mockServices,
};

const LOTES_LIFO_DEFAULT = [
  { id: 'lot_1', fecha: '2026-08-01', sku: 'FER-001', producto: 'Tornillo Yeso Cartón 6x1', cantidadComprada: 30, cantidadDisponible: 0, costoUnitario: 4200 },
  { id: 'lot_2', fecha: '2026-08-10', sku: 'FER-001', producto: 'Tornillo Yeso Cartón 6x1', cantidadComprada: 25, cantidadDisponible: 5, costoUnitario: 4500 },
  { id: 'lot_3', fecha: '2026-08-20', sku: 'FER-001', producto: 'Tornillo Yeso Cartón 6x1', cantidadComprada: 20, cantidadDisponible: 20, costoUnitario: 4900 },
  { id: 'lot_4', fecha: '2026-08-05', sku: 'FER-002', producto: 'Disco Corte Metal 4 1/2"', cantidadComprada: 100, cantidadDisponible: 20, costoUnitario: 600 },
  { id: 'lot_5', fecha: '2026-08-18', sku: 'FER-002', producto: 'Disco Corte Metal 4 1/2"', cantidadComprada: 80, cantidadDisponible: 80, costoUnitario: 680 }
];

const AppStateContext = createContext(null);

export function AppStateProvider({ children }) {
  // Autenticacion y Estado de Nube Supabase
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState('idle'); // 'idle' | 'syncing' | 'synced' | 'error'
  const isInitialLoadRef = useRef(true);
  const syncTimeoutRef = useRef(null);

  // Estados del Negocio
  const [perfil, setPerfil] = useState(null);
  const [nombreNegocio, setNombreNegocio] = useState('');
  const [ventasEstimadasMensuales, setVentasEstimadasMensuales] = useState(0);

  // Parámetros de Control Operativo
  const [porcentajeMermaGlobal, setPorcentajeMermaGlobal] = useState(5);
  const [margenObjetivoPorcentaje, setMargenObjetivoPorcentaje] = useState(40);

  // Inventario y Lotes LIFO Globales
  const [lotesLIFO, setLotesLIFO] = useState(LOTES_LIFO_DEFAULT);

  // Estados Base
  const [insumos, setInsumos] = useState([]);
  const [recetas, setRecetas] = useState([]);
  const [catalogoMayorista, setCatalogoMayorista] = useState([]);
  const [inventario, setInventario] = useState([]);
  const [recursos, setRecursos] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [costosVariables, setCostosVariables] = useState([]);
  const [costosFijos, setCostosFijos] = useState([]);

  // Variables consolidadas para Dashboard
  const [precioVentaConsolidado, setPrecioVentaConsolidado] = useState(0);
  const [costoVariableConsolidado, setCostoVariableConsolidado] = useState(0);
  const [costoFijoTotal, setCostoFijoTotal] = useState(0);

  // Cargar datos remotos desde Supabase
  const hidratarDesdeSupabase = useCallback(async (activeUserId) => {
    if (!activeUserId) return;
    try {
      setSyncStatus('syncing');
      const datos = await cargarDatosUsuario(activeUserId);
      if (datos && datos.perfil) {
        setPerfil(datos.perfil.perfil || 'restaurant');
        setNombreNegocio(datos.perfil.nombre_negocio || 'Mi Negocio PyME');
        setVentasEstimadasMensuales(Number(datos.perfil.ventas_estimadas_mensuales || 0));
        setPorcentajeMermaGlobal(Number(datos.perfil.porcentaje_merma_global || 5));
        setMargenObjetivoPorcentaje(Number(datos.perfil.margen_objetivo_porcentaje || 40));

        if (datos.costosFijos?.length) setCostosFijos(datos.costosFijos);
        if (datos.costosVariables?.length) setCostosVariables(datos.costosVariables);
        if (datos.lotesLIFO?.length) setLotesLIFO(datos.lotesLIFO);
        if (datos.insumos?.length) setInsumos(datos.insumos);
        if (datos.recetas?.length) setRecetas(datos.recetas);
        if (datos.inventario?.length) setInventario(datos.inventario);
        if (datos.servicios?.length) setServicios(datos.servicios);
      }
      setSyncStatus('synced');
    } catch (err) {
      console.error('Error al hidratar desde Supabase:', err);
      setSyncStatus('error');
    }
  }, []);

  // Escuchar estado de sesión de Supabase al montar
  useEffect(() => {
    let montado = true;

    async function initAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (montado) {
          const activeUser = session?.user || null;
          setUser(activeUser);
          if (activeUser) {
            await hidratarDesdeSupabase(activeUser.id);
          }
        }
      } catch (err) {
        console.warn('Supabase auth no disponible o sin conexión:', err);
      } finally {
        if (montado) {
          setAuthLoading(false);
          isInitialLoadRef.current = false;
        }
      }
    }

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!montado) return;
      const currentUser = session?.user || null;
      setUser(currentUser);
      if (currentUser && (event === 'SIGNED_IN' || event === 'USER_UPDATED')) {
        await hidratarDesdeSupabase(currentUser.id);
      }
    });

    return () => {
      montado = false;
      subscription?.unsubscribe();
    };
  }, [hidratarDesdeSupabase]);

  // Sincronización automática periódica / debounced hacia Supabase
  const sincronizarConNube = useCallback(async () => {
    if (!user?.id || !perfil) return;
    try {
      setSyncStatus('syncing');
      const exito = await sincronizarTodoElNegocio(user.id, {
        perfil,
        nombreNegocio,
        ventasEstimadasMensuales,
        porcentajeMermaGlobal,
        margenObjetivoPorcentaje,
        costosFijos,
        costosVariables,
        lotesLIFO,
        insumos,
        recetas,
        inventario,
        servicios,
      });
      setSyncStatus(exito ? 'synced' : 'error');
    } catch (err) {
      console.error('Error de sincronización con Supabase:', err);
      setSyncStatus('error');
    }
  }, [
    user,
    perfil,
    nombreNegocio,
    ventasEstimadasMensuales,
    porcentajeMermaGlobal,
    margenObjetivoPorcentaje,
    costosFijos,
    costosVariables,
    lotesLIFO,
    insumos,
    recetas,
    inventario,
    servicios,
  ]);

  // Disparar sincronización diferida al cambiar datos cuando el usuario está logueado
  useEffect(() => {
    if (isInitialLoadRef.current || !user?.id || !perfil) return;

    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    syncTimeoutRef.current = setTimeout(() => {
      sincronizarConNube();
    }, 2500);

    return () => {
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    };
  }, [
    user,
    perfil,
    nombreNegocio,
    costosFijos,
    costosVariables,
    lotesLIFO,
    insumos,
    recetas,
    inventario,
    servicios,
    porcentajeMermaGlobal,
    margenObjetivoPorcentaje,
    sincronizarConNube,
  ]);

  async function cerrarSesion() {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSyncStatus('idle');
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  }

  function elegirPerfil(perfilElegido) {
    const datos = datosPorPerfil[perfilElegido];
    if (!datos) return;

    setPerfil(perfilElegido);
    setNombreNegocio(datos.nombreNegocio || (perfilElegido === 'restaurant' ? 'Mi Restaurante' : perfilElegido === 'minimarket' ? 'Mi Minimarket' : 'Mi Agencia'));

    if (perfilElegido === 'restaurant') {
      setInsumos(Array.isArray(datos.insumos) ? datos.insumos.map(i => ({ ...i })) : []);
      setRecetas(Array.isArray(datos.recetas) ? datos.recetas.map(i => ({ ...i })) : []);
      setCostosVariables(Array.isArray(datos.costosVariables) ? datos.costosVariables.map(i => ({ ...i })) : []);
      setCostosFijos(Array.isArray(datos.costosFijos) ? datos.costosFijos.map(i => ({ ...i })) : []);
      setCatalogoMayorista([]);
      setInventario([]);
      setRecursos([]);
      setServicios([]);
    } else if (perfilElegido === 'minimarket') {
      setCatalogoMayorista(Array.isArray(datos.catalogoMayorista) ? datos.catalogoMayorista.map(i => ({ ...i })) : []);
      setInventario(Array.isArray(datos.inventario) ? datos.inventario.map(i => ({ ...i })) : []);
      setCostosVariables(Array.isArray(datos.costosVariables) ? datos.costosVariables.map(i => ({ ...i })) : []);
      setCostosFijos(Array.isArray(datos.costosFijos) ? datos.costosFijos.map(i => ({ ...i })) : []);
      setInsumos([]);
      setRecetas([]);
      setRecursos([]);
      setServicios([]);
    } else if (perfilElegido === 'services') {
      setRecursos(Array.isArray(datos.recursos) ? datos.recursos.map(i => ({ ...i })) : []);
      setServicios(Array.isArray(datos.servicios) ? datos.servicios.map(i => ({ ...i })) : []);
      setCostosVariables(Array.isArray(datos.costosVariables) ? datos.costosVariables.map(i => ({ ...i })) : []);
      setCostosFijos(Array.isArray(datos.costosFijos) ? datos.costosFijos.map(i => ({ ...i })) : []);
      setInsumos([]);
      setRecetas([]);
      setCatalogoMayorista([]);
      setInventario([]);
    }
  }

  // Mutadores Globales
  const guardarCostoFijo = (nuevoCosto) => setCostosFijos((prev) => [...prev, nuevoCosto]);
  const eliminarCostoFijo = (id) => setCostosFijos((prev) => prev.filter((cf) => cf.id !== id));
  const guardarCostoVariable = (nuevoCosto) => setCostosVariables((prev) => [...prev, nuevoCosto]);
  const eliminarCostoVariable = (id) => setCostosVariables((prev) => prev.filter((cv) => cv.id !== id));
  const guardarInsumo = (nuevoInsumo) => setInsumos((prev) => [...prev, nuevoInsumo]);
  const guardarReceta = (nuevaReceta) => setRecetas((prev) => [...prev, nuevaReceta]);
  const guardarProductoInventario = (nuevoItem) => setInventario((prev) => [...prev, nuevoItem]);
  const importarLoteInventario = (lote) => setInventario((prev) => [...prev, ...lote]);

  // Recálculo Reactivo Integral (Incluye costo de reposición LIFO)
  useEffect(() => {
    if (!perfil) return;

    const totalFijos = costosFijos.reduce((acc, cf) => acc + Number(cf.monto || 0), 0);
    setCostoFijoTotal(totalFijos);

    const totalOtrosVariables = costosVariables.reduce((acc, cv) => acc + Number(cv.costoPorUnidad || 0), 0);
    const factorMerma = 1 + (Number(porcentajeMermaGlobal || 0) / 100);

    if (perfil === 'restaurant') {
      if (recetas.length > 0) {
        const volumen = recetas.reduce((acc, r) => acc + Number(r.ventasEstimadas || 0), 0);
        setVentasEstimadasMensuales(volumen);

        if (volumen > 0) {
          const ingresos = recetas.reduce((acc, r) => acc + (Number(r.precioVenta || 0) * Number(r.ventasEstimadas || 0)), 0);
          const costos = recetas.reduce((acc, r) => acc + (Number(r.costoTotal || 0) * Number(r.ventasEstimadas || 0)), 0);
          setPrecioVentaConsolidado(Math.round(ingresos / volumen));
          setCostoVariableConsolidado(Math.round((costos / volumen) * factorMerma + totalOtrosVariables));
        }
      }
    } else if (perfil === 'minimarket') {
      if (inventario.length > 0) {
        const volumen = inventario.reduce((acc, item) => acc + Number(item.ventasMensuales || 0), 0);
        setVentasEstimadasMensuales(volumen);

        if (volumen > 0) {
          const ingresos = inventario.reduce((acc, item) => acc + (Number(item.precioVenta || 0) * Number(item.ventasMensuales || 0)), 0);
          
          // Costo unitario según última capa LIFO activa si existe
          const costos = inventario.reduce((acc, item) => {
            const lotesDelSku = lotesLIFO
              .filter(l => l.sku === item.sku && l.cantidadDisponible > 0)
              .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
            
            const costoUnitarioEfectivo = lotesDelSku.length > 0 ? lotesDelSku[0].costoUnitario : Number(item.costoCompra || 0);
            return acc + (costoUnitarioEfectivo * Number(item.ventasMensuales || 0));
          }, 0);

          setPrecioVentaConsolidado(Math.round(ingresos / volumen));
          setCostoVariableConsolidado(Math.round((costos / volumen) * factorMerma + totalOtrosVariables));
        }
      }
    } else if (perfil === 'services') {
      if (servicios.length > 0) {
        const volumen = servicios.reduce((acc, s) => acc + Number(s.ventasMensuales || 0), 0);
        setVentasEstimadasMensuales(volumen);

        if (volumen > 0) {
          const ingresos = servicios.reduce((acc, s) => acc + (Number(s.precioVenta || 0) * Number(s.ventasMensuales || 0)), 0);
          const costos = servicios.reduce((acc, s) => acc + (Number(s.costoTotal || 0) * Number(s.ventasMensuales || 0)), 0);
          setPrecioVentaConsolidado(Math.round(ingresos / volumen));
          setCostoVariableConsolidado(Math.round((costos / volumen) * factorMerma + totalOtrosVariables));
        }
      }
    }
  }, [recetas, inventario, servicios, costosVariables, costosFijos, perfil, porcentajeMermaGlobal, lotesLIFO]);

  function reiniciarNegocio() {
    setPerfil(null);
    setNombreNegocio('');
    setVentasEstimadasMensuales(0);
    setInsumos([]);
    setRecetas([]);
    setCatalogoMayorista([]);
    setInventario([]);
    setRecursos([]);
    setServicios([]);
    setCostosVariables([]);
    setCostosFijos([]);
    setPrecioVentaConsolidado(0);
    setCostoVariableConsolidado(0);
    setCostoFijoTotal(0);
  }

  const value = useMemo(
    () => ({
      user,
      setUser,
      authLoading,
      syncStatus,
      sincronizarConNube,
      cerrarSesion,
      perfil,
      nombreNegocio,
      ventasEstimadasMensuales,
      setVentasEstimadasMensuales,
      porcentajeMermaGlobal,
      setPorcentajeMermaGlobal,
      margenObjetivoPorcentaje,
      setMargenObjetivoPorcentaje,
      lotesLIFO,
      setLotesLIFO,
      insumos,
      recetas,
      catalogoMayorista,
      inventario,
      recursos,
      servicios,
      costosVariables,
      costosFijos,
      precioVentaConsolidado,
      costoVariableConsolidado,
      costoFijoTotal,
      elegirPerfil,
      reiniciarNegocio,
      guardarCostoFijo,
      eliminarCostoFijo,
      guardarCostoVariable,
      eliminarCostoVariable,
      guardarInsumo,
      guardarReceta,
      guardarProductoInventario,
      importarLoteInventario,
    }),
    [
      user,
      authLoading,
      syncStatus,
      sincronizarConNube,
      perfil,
      nombreNegocio,
      ventasEstimadasMensuales,
      porcentajeMermaGlobal,
      margenObjetivoPorcentaje,
      lotesLIFO,
      insumos,
      recetas,
      catalogoMayorista,
      inventario,
      recursos,
      servicios,
      costosVariables,
      costosFijos,
      precioVentaConsolidado,
      costoVariableConsolidado,
      costoFijoTotal
    ]
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) throw new Error('useAppState debe usarse dentro de un AppStateProvider');
  return context;
}