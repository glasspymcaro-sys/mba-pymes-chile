import { supabase } from '../lib/supabase';

/**
 * Carga el perfil y todos los datos del usuario desde Supabase
 */
export async function cargarDatosUsuario(userId) {
  if (!userId) return null;
  try {
    const [
      perfilRes,
      fijosRes,
      variablesRes,
      lotesRes,
      inventarioRes,
      insumosRes,
      recetasRes,
      serviciosRes,
    ] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
      supabase.from('costos_fijos').select('*').eq('user_id', userId),
      supabase.from('costos_variables').select('*').eq('user_id', userId),
      supabase.from('lotes_lifo').select('*').eq('user_id', userId),
      supabase.from('inventario_items').select('*').eq('user_id', userId),
      supabase.from('insumos_restaurant').select('*').eq('user_id', userId),
      supabase.from('recetas_restaurant').select('*').eq('user_id', userId),
      supabase.from('servicios_items').select('*').eq('user_id', userId),
    ]);

    const perfil = perfilRes.data || null;

    // Mapear de snake_case a las propiedades de la aplicacion
    const costosFijos = (fijosRes.data || []).map((row) => ({
      id: row.id,
      nombre: row.nombre,
      monto: Number(row.monto || 0),
      categoria: row.categoria || 'Operacional',
    }));

    const costosVariables = (variablesRes.data || []).map((row) => ({
      id: row.id,
      nombre: row.nombre,
      costoPorUnidad: Number(row.costo_por_unidad || 0),
    }));

    const lotesLIFO = (lotesRes.data || []).map((row) => ({
      id: row.id,
      sku: row.sku,
      producto: row.producto,
      fecha: row.fecha,
      cantidadComprada: Number(row.cantidad_comprada || 0),
      cantidadDisponible: Number(row.cantidad_disponible || 0),
      costoUnitario: Number(row.costo_unitario || 0),
    }));

    const inventario = (inventarioRes.data || []).map((row) => ({
      id: row.id,
      sku: row.sku,
      producto: row.producto,
      categoria: row.categoria || 'Abarrotes',
      costoCompra: Number(row.costo_compra || 0),
      precioVenta: Number(row.precio_venta || 0),
      stock: Number(row.stock || 0),
      ventasMensuales: Number(row.ventas_mensuales || 0),
    }));

    const insumos = (insumosRes.data || []).map((row) => ({
      id: row.id,
      nombre: row.nombre,
      unidadMedida: row.unidad_medida || 'kg',
      costoUnitario: Number(row.costo_unitario || 0),
    }));

    const recetas = (recetasRes.data || []).map((row) => ({
      id: row.id,
      nombre: row.nombre,
      precioVenta: Number(row.precio_venta || 0),
      ventasEstimadas: Number(row.ventas_estimadas || 0),
      costoTotal: Number(row.costo_total || 0),
      ingredientes: Array.isArray(row.ingredientes) ? row.ingredientes : [],
    }));

    const servicios = (serviciosRes.data || []).map((row) => ({
      id: row.id,
      nombre: row.nombre,
      precioVenta: Number(row.precio_venta || 0),
      costoTotal: Number(row.costo_total || 0),
      ventasMensuales: Number(row.ventas_mensuales || 0),
      recursos: Array.isArray(row.recursos) ? row.recursos : [],
    }));

    return {
      perfil,
      costosFijos,
      costosVariables,
      lotesLIFO,
      inventario,
      insumos,
      recetas,
      servicios,
    };
  } catch (error) {
    console.error('Error al cargar datos desde Supabase:', error);
    return null;
  }
}

/**
 * Guarda o actualiza el perfil del negocio en Supabase
 */
export async function guardarPerfilUsuario(userId, datosPerfil) {
  if (!userId) return false;
  try {
    const payload = {
      id: userId,
      nombre_negocio: datosPerfil.nombreNegocio || 'Mi Negocio PyME',
      rut_negocio: datosPerfil.rutNegocio || '',
      perfil: datosPerfil.perfil || 'restaurant',
      ventas_estimadas_mensuales: datosPerfil.ventasEstimadasMensuales || 0,
      porcentaje_merma_global: datosPerfil.porcentajeMermaGlobal || 5,
      margen_objetivo_porcentaje: datosPerfil.margenObjetivoPorcentaje || 40,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('profiles').upsert(payload, { onConflict: 'id' });
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error al guardar perfil en Supabase:', error);
    return false;
  }
}

/**
 * Sincroniza todas las colecciones de la app en la base de datos Supabase
 */
export async function sincronizarTodoElNegocio(userId, datos) {
  if (!userId) return false;
  try {
    // 1. Guardar perfil
    await guardarPerfilUsuario(userId, {
      nombreNegocio: datos.nombreNegocio,
      perfil: datos.perfil,
      ventasEstimadasMensuales: datos.ventasEstimadasMensuales,
      porcentajeMermaGlobal: datos.porcentajeMermaGlobal,
      margenObjetivoPorcentaje: datos.margenObjetivoPorcentaje,
    });

    // 2. Costos fijos
    if (Array.isArray(datos.costosFijos)) {
      await supabase.from('costos_fijos').delete().eq('user_id', userId);
      if (datos.costosFijos.length > 0) {
        await supabase.from('costos_fijos').insert(
          datos.costosFijos.map((item) => ({
            id: String(item.id || crypto.randomUUID()),
            user_id: userId,
            nombre: item.nombre || 'Costo Fijo',
            monto: Number(item.monto || 0),
            categoria: item.categoria || 'Operacional',
          }))
        );
      }
    }

    // 3. Costos variables
    if (Array.isArray(datos.costosVariables)) {
      await supabase.from('costos_variables').delete().eq('user_id', userId);
      if (datos.costosVariables.length > 0) {
        await supabase.from('costos_variables').insert(
          datos.costosVariables.map((item) => ({
            id: String(item.id || crypto.randomUUID()),
            user_id: userId,
            nombre: item.nombre || 'Costo Variable',
            costo_por_unidad: Number(item.costoPorUnidad || 0),
          }))
        );
      }
    }

    // 4. Lotes LIFO
    if (Array.isArray(datos.lotesLIFO)) {
      await supabase.from('lotes_lifo').delete().eq('user_id', userId);
      if (datos.lotesLIFO.length > 0) {
        await supabase.from('lotes_lifo').insert(
          datos.lotesLIFO.map((item) => ({
            id: String(item.id || crypto.randomUUID()),
            user_id: userId,
            sku: item.sku || 'SKU-001',
            producto: item.producto || 'Producto',
            fecha: item.fecha || new Date().toISOString().split('T')[0],
            cantidad_comprada: Number(item.cantidadComprada || 0),
            cantidad_disponible: Number(item.cantidadDisponible || 0),
            costo_unitario: Number(item.costoUnitario || 0),
          }))
        );
      }
    }

    // 5. Insumos restaurante
    if (Array.isArray(datos.insumos)) {
      await supabase.from('insumos_restaurant').delete().eq('user_id', userId);
      if (datos.insumos.length > 0) {
        await supabase.from('insumos_restaurant').insert(
          datos.insumos.map((item) => ({
            id: String(item.id || crypto.randomUUID()),
            user_id: userId,
            nombre: item.nombre || 'Insumo',
            unidad_medida: item.unidadMedida || 'kg',
            costo_unitario: Number(item.costoUnitario || 0),
          }))
        );
      }
    }

    // 6. Recetas restaurante
    if (Array.isArray(datos.recetas)) {
      await supabase.from('recetas_restaurant').delete().eq('user_id', userId);
      if (datos.recetas.length > 0) {
        await supabase.from('recetas_restaurant').insert(
          datos.recetas.map((item) => ({
            id: String(item.id || crypto.randomUUID()),
            user_id: userId,
            nombre: item.nombre || 'Plato',
            precio_venta: Number(item.precioVenta || 0),
            ventas_estimadas: Number(item.ventasEstimadas || 0),
            costo_total: Number(item.costoTotal || 0),
            ingredientes: Array.isArray(item.ingredientes) ? item.ingredientes : [],
          }))
        );
      }
    }

    // 7. Inventario retail / minimarket
    if (Array.isArray(datos.inventario)) {
      await supabase.from('inventario_items').delete().eq('user_id', userId);
      if (datos.inventario.length > 0) {
        await supabase.from('inventario_items').insert(
          datos.inventario.map((item) => ({
            id: String(item.id || crypto.randomUUID()),
            user_id: userId,
            sku: item.sku || '',
            producto: item.producto || 'Producto',
            categoria: item.categoria || 'Abarrotes',
            costo_compra: Number(item.costoCompra || 0),
            precio_venta: Number(item.precioVenta || 0),
            stock: Number(item.stock || 0),
            ventas_mensuales: Number(item.ventasMensuales || 0),
          }))
        );
      }
    }

    // 8. Servicios
    if (Array.isArray(datos.servicios)) {
      await supabase.from('servicios_items').delete().eq('user_id', userId);
      if (datos.servicios.length > 0) {
        await supabase.from('servicios_items').insert(
          datos.servicios.map((item) => ({
            id: String(item.id || crypto.randomUUID()),
            user_id: userId,
            nombre: item.nombre || 'Servicio',
            precio_venta: Number(item.precioVenta || 0),
            costo_total: Number(item.costoTotal || 0),
            ventas_mensuales: Number(item.ventasMensuales || 0),
            recursos: Array.isArray(item.recursos) ? item.recursos : [],
          }))
        );
      }
    }

    return true;
  } catch (error) {
    console.error('Error al sincronizar negocio completo con Supabase:', error);
    return false;
  }
}

/**
 * Registra un diagnóstico generado por IA en Supabase
 */
export async function registrarDiagnosticoIA(userId, tipo, indicadores, recomendacion) {
  if (!userId) return null;
  try {
    const { data, error } = await supabase.from('analisis_ia').insert([
      {
        user_id: userId,
        tipo_diagnostico: tipo,
        indicadores_json: indicadores,
        recomendacion_texto: recomendacion,
      },
    ]).select().single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error al guardar análisis IA en Supabase:', error);
    return null;
  }
}
