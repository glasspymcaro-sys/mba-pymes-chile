import React, { useState } from 'react';
import { useAppState } from '../store/appState.jsx';
import TarjetaMetrica from '../components/indicators/TarjetaMetrica.jsx';
import SimuladorPrecio from '../components/controls/SimuladorPrecio.jsx';
import GraficoPuntoEquilibrio from '../components/charts/GraficoPuntoEquilibrio.jsx';
import VisorEscenaPBR3D from '../components/svg3d/VisorEscenaPBR3D.jsx';
import SelectorProductosYMargenes from '../components/strategy/SelectorProductosYMargenes.jsx';
import ModuloSueldoObjetivoYLibertad from '../components/strategy/ModuloSueldoObjetivoYLibertad.jsx';
import ModuloFijacionPreciosYFugas from '../components/strategy/ModuloFijacionPreciosYFugas.jsx';
import ModuloSimuladorQuePasaSi from '../components/strategy/ModuloSimuladorQuePasaSi.jsx';
import ModuloIngenieriaMenuMultiproducto from '../components/strategy/ModuloIngenieriaMenuMultiproducto.jsx';
import { formatCLP } from '../utils/formatters.js';

/**
 * Centro Estratégico Ejecutivo $5,000+ USD:
 * Arquitectura ordenada e interconectada en 5 pasos lógicos:
 * 1. Lo primero: Ver productos, insumos y márgenes directos para decidir sin confusión.
 * 2. Fijación de Precios Inteligente: Detector de fugas de margen (IVA, POS, Delivery, Merma).
 * 3. Simulador de Decisiones: Destructor de descuentos en tiempo real + Escudo anti-inflación.
 * 4. Ingeniería Inversa: Sueldo Objetivo + Capacidad física + Calendario "Día de la Libertad".
 * 5. Punto de Equilibrio y Gráfico con Explorador a Detalle + Matriz de Rentabilidad (Minas vs Vampiros).
 * Cumple estrictamente con la regla de cero emojis.
 */
export default function DashboardPrincipal({ onIrAInsumos }) {
  const {
    perfil,
    sueldoObjetivo,
    precioVentaConsolidado,
    setPrecioRecetaEnOlla,
    costoVariableConsolidado,
    costoFijoTotal,
    ventasEstimadasMensuales,
    setVentasEstimadasMensuales,
    insumosAsignados,
    recetaEnOlla,
    analisisFugasActivas,
  } = useAppState();

  const [filtroSeccion, setFiltroSeccion] = useState('todas'); // 'todas' | 'productos' | 'precios' | 'descuentos' | 'sueldo' | 'equilibrio' | 'matriz'

  const precioEfectivo = Number(precioVentaConsolidado || 1000);
  const ventasEfectivas = Number(ventasEstimadasMensuales || 100);
  const costoVarEfectivo = Number(analisisFugasActivas?.costoDirectoEfectivoTotal || costoVariableConsolidado || 0);
  const costoFijoEfectivo = Number(costoFijoTotal || 0);
  const metaConSueldo = costoFijoEfectivo + Number(sueldoObjetivo || 0);

  // Cálculos deterministas de Punto de Equilibrio (Considerando Fugas de Margen Reales)
  const margenContribucionUnitario = Math.max(0, precioEfectivo - costoVarEfectivo);
  const puntoEquilibrioUnidades =
    margenContribucionUnitario > 0 ? Math.ceil(costoFijoEfectivo / margenContribucionUnitario) : 0;
  const puntoEquilibrioConSueldoUnidades =
    margenContribucionUnitario > 0 ? Math.ceil(metaConSueldo / margenContribucionUnitario) : 0;
  const ventasPuntoEquilibrioPesos = puntoEquilibrioUnidades * precioEfectivo;

  const ingresosTotales = precioEfectivo * ventasEfectivas;
  const costosTotales = costoFijoEfectivo + costoVarEfectivo * ventasEfectivas;
  const resultadoOperacional = ingresosTotales - costosTotales;
  const margenPorcentual =
    ingresosTotales > 0 ? ((resultadoOperacional / ingresosTotales) * 100).toFixed(1) : '0.0';

  // Serie de proyección para el gráfico vectorial de umbral de rentabilidad
  const maxRango = Math.max(ventasEfectivas * 1.35, puntoEquilibrioConSueldoUnidades * 1.25, 40);
  const paso = Math.max(1, Math.ceil(maxRango / 7));
  const datosGrafico = [];

  for (let u = 0; u <= maxRango; u += paso) {
    datosGrafico.push({
      unidades: u,
      ingresos: Math.round(u * precioEfectivo),
      costos: Math.round(costoFijoEfectivo + u * costoVarEfectivo),
    });
  }

  const desplazarASeccion = (idSeccion) => {
    const el = document.getElementById(idSeccion);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* BARRA DE FILTROS POR MÓDULOS DE DECISIÓN */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          padding: '4px 2px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 900,
              color: '#070A0F',
              backgroundColor: '#E2F800',
              border: '1px solid #E2F800',
              padding: '4px 10px',
              borderRadius: '6px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              boxShadow: '0 0 10px rgba(226, 248, 0, 0.35)',
            }}
          >
            Módulos Estratégicos
          </span>
          <span style={{ fontSize: '13px', color: '#94A3B8' }}>
            Simulando para: <strong style={{ color: '#FFFFFF' }}>{recetaEnOlla?.nombre || 'Producto Principal'}</strong>
          </span>
        </div>

        {/* Píldoras de Navegación por Secciones ImpactM5 */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {[
            { id: 'todas', label: 'Ver Todo el Tablero' },
            { id: 'productos', label: '1. Insumos y Márgenes', anchor: 'seccion-productos-insumos' },
            { id: 'precios', label: '2. Precios Reales', anchor: 'seccion-precios' },
            { id: 'descuentos', label: '3. Descuentos y Combos', anchor: 'seccion-descuentos' },
            { id: 'sueldo', label: '4. Sueldo Objetivo', anchor: 'seccion-sueldo' },
            { id: 'equilibrio', label: '5. Punto de Equilibrio', anchor: 'seccion-grafico-equilibrio' },
            { id: 'matriz', label: '6. Catálogo', anchor: 'seccion-matriz' },
          ].map((sec) => (
            <button
              key={sec.id}
              type="button"
              onClick={() => {
                setFiltroSeccion(sec.id);
                if (sec.anchor) desplazarASeccion(sec.anchor);
              }}
              style={{
                padding: '6px 13px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: filtroSeccion === sec.id ? 800 : 600,
                backgroundColor: filtroSeccion === sec.id ? '#E2F800' : '#111827',
                color: filtroSeccion === sec.id ? '#070A0F' : '#94A3B8',
                border: `1px solid ${filtroSeccion === sec.id ? '#E2F800' : '#1E293B'}`,
                boxShadow: filtroSeccion === sec.id ? '0 0 15px rgba(226, 248, 0, 0.35)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {sec.label}
            </button>
          ))}
        </div>
      </div>

      {/* BLOQUE 1: LO PRIMERO: CATÁLOGO DE PRODUCTOS, INSUMOS & MÁRGENES DIRECTOS */}
      {(filtroSeccion === 'todas' || filtroSeccion === 'productos') && (
        <SelectorProductosYMargenes
          onIrAInsumos={onIrAInsumos}
          onIrADescuentos={() => {
            setFiltroSeccion('todas');
            setTimeout(() => desplazarASeccion('seccion-descuentos'), 80);
          }}
        />
      )}

      {/* BLOQUE 2: CALCULADORA DE PRECIO REAL + DETECTOR DE FUGAS DE MARGEN (IVA, POS, DELIVERY, MERMA) */}
      {(filtroSeccion === 'todas' || filtroSeccion === 'precios') && (
        <ModuloFijacionPreciosYFugas />
      )}

      {/* BLOQUE 3: SIMULADOR DE DECISIONES "¿QUÉ PASA SI...?" (DESTRUCTOR DE DESCUENTOS + ESCUDO ANTI-INFLACIÓN) */}
      {(filtroSeccion === 'todas' || filtroSeccion === 'descuentos') && (
        <ModuloSimuladorQuePasaSi />
      )}

      {/* BLOQUE 4: INGENIERÍA INVERSA "EL SUELDO OBJETIVO" + CAPACIDAD FÍSICA + CALENDARIO "EL DÍA DE LA LIBERTAD" */}
      {(filtroSeccion === 'todas' || filtroSeccion === 'sueldo') && (
        <ModuloSueldoObjetivoYLibertad />
      )}

      {/* BLOQUE 5: SÍNTESIS CONTABLE & GRÁFICO EJECUTIVO DE PUNTO DE EQUILIBRIO CON EXPLORADOR A DETALLE */}
      {(filtroSeccion === 'todas' || filtroSeccion === 'equilibrio') && (
        <div id="seccion-grafico-equilibrio" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Bento KPIs de Síntesis */}
          <div className="bento-kpi-grid">
            <div className="bento-kpi-primary">
              <TarjetaMetrica
                titulo="Punto de Equilibrio Base (Ganar $0)"
                icono="equilibrio"
                valor={`${puntoEquilibrioUnidades.toLocaleString('es-CL')} un.`}
                subtitulo={`Facturación base: ${formatCLP(ventasPuntoEquilibrioPesos)}`}
                tendencia={ventasEfectivas >= puntoEquilibrioUnidades ? 'Cubierto' : 'Déficit'}
                color={ventasEfectivas >= puntoEquilibrioUnidades ? 'var(--color-success)' : 'var(--color-danger)'}
              />
            </div>

            <div className="bento-kpi-secondary">
              <TarjetaMetrica
                titulo="Resultado Líquido Mensual (EBIT)"
                icono="ebit"
                valor={formatCLP(resultadoOperacional)}
                subtitulo={`Margen real neto: ${margenPorcentual}% | Sueldo meta: ${formatCLP(sueldoObjetivo)}`}
                tendencia={resultadoOperacional >= sueldoObjetivo ? 'Meta Lograda' : resultadoOperacional >= 0 ? 'Positivo' : 'Pérdida'}
                color={resultadoOperacional >= sueldoObjetivo ? 'var(--color-success)' : resultadoOperacional >= 0 ? 'var(--color-primary)' : 'var(--color-danger)'}
              />
            </div>

            <div className="bento-kpi-compact">
              <TarjetaMetrica
                titulo="Ganancia Real / Un."
                icono="margen"
                valor={formatCLP(margenContribucionUnitario)}
                subtitulo={`Neto tras fugas (${analisisFugasActivas.margenBrutoRealPorcentaje}%)`}
                color="var(--color-primary)"
              />
            </div>

            <div className="bento-kpi-compact">
              <TarjetaMetrica
                titulo="Costos Fijos Mes"
                icono="fijos"
                valor={formatCLP(costoFijoEfectivo)}
                subtitulo="Estructura base"
              />
            </div>
          </div>

          {/* Gráfico y Simulador de Volumen */}
          <div className="bento-grid-12" style={{ alignItems: 'stretch' }}>
            <div
              className="bento-col-7 card-ejecutiva"
              style={{
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <GraficoPuntoEquilibrio
                datos={datosGrafico}
                puntoEquilibrioUnidades={puntoEquilibrioUnidades}
                precioUnitario={precioEfectivo}
                costoVariableUnitario={costoVarEfectivo}
                costoFijoTotal={costoFijoEfectivo}
                sueldoObjetivo={sueldoObjetivo}
                ventasEstimadas={ventasEfectivas}
              />
            </div>

            <div className="bento-col-5" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <SimuladorPrecio
                precioVenta={precioEfectivo}
                ventasEstimadas={ventasEfectivas}
                onPrecioChange={(val) => setPrecioRecetaEnOlla(val)}
                onVentasChange={(val) => setVentasEstimadasMensuales(val)}
              />

              <div
                className="card-ejecutiva"
                style={{
                  padding: '18px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '10px',
                  flex: 1,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                  <span style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--color-muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Cobertura de Costos Fijos + Sueldo Objetivo
                  </span>
                  <span
                    className="tabular-nums"
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '6px',
                      backgroundColor: ventasEfectivas >= puntoEquilibrioConSueldoUnidades ? 'var(--color-success-bg)' : 'var(--color-warning-bg)',
                      color: ventasEfectivas >= puntoEquilibrioConSueldoUnidades ? 'var(--color-success)' : 'var(--color-warning)',
                      border: `1px solid ${ventasEfectivas >= puntoEquilibrioConSueldoUnidades ? 'var(--color-success-border)' : 'var(--color-warning-border)'}`,
                    }}
                  >
                    Meta con Sueldo: {puntoEquilibrioConSueldoUnidades.toLocaleString('es-CL')} un.
                  </span>
                </div>

                <p style={{ fontSize: '13px', color: 'var(--color-foreground)', lineHeight: 1.55, margin: 0 }}>
                  {ventasEfectivas >= puntoEquilibrioConSueldoUnidades
                    ? `Logras pagar todos los costos fijos (${formatCLP(costoFijoEfectivo)}) y tu sueldo objetivo líquido (${formatCLP(sueldoObjetivo)}), con un excedente adicional de ${formatCLP(resultadoOperacional - sueldoObjetivo)}.`
                    : `Te faltan ${Math.max(0, puntoEquilibrioConSueldoUnidades - ventasEfectivas).toLocaleString('es-CL')} unidades mensuales para cubrir simultáneamente los costos fijos y el 100% de tu sueldo objetivo.`}
                </p>

                <div style={{ marginTop: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-muted-foreground)', marginBottom: '4px', fontWeight: 600 }}>
                    <span>Progreso hacia Sueldo Objetivo ({formatCLP(sueldoObjetivo)})</span>
                    <span className="tabular-nums" style={{ fontWeight: 800, color: 'var(--color-foreground)' }}>
                      {puntoEquilibrioConSueldoUnidades > 0
                        ? `${Math.min(100, Math.round((ventasEfectivas / puntoEquilibrioConSueldoUnidades) * 100))}%`
                        : '100%'}
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: '#E2E8F0', borderRadius: '999px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${puntoEquilibrioConSueldoUnidades > 0 ? Math.min(100, Math.round((ventasEfectivas / puntoEquilibrioConSueldoUnidades) * 100)) : 100}%`,
                        height: '100%',
                        backgroundColor: ventasEfectivas >= puntoEquilibrioConSueldoUnidades ? 'var(--color-success)' : 'var(--color-primary)',
                        transition: 'width 0.25s ease',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BLOQUE 6: PUNTO DE EQUILIBRIO MULTI-PRODUCTO E INGENIERÍA DE MENÚ (MINAS DE ORO VS VAMPIROS) */}
      {(filtroSeccion === 'todas' || filtroSeccion === 'matriz') && (
        <ModuloIngenieriaMenuMultiproducto onEditarProductoEnOllita={onIrAInsumos} />
      )}

      {/* BLOQUE 7: VISOR DE PRESENTACIÓN VISUAL DEL PRODUCTO */}
      {filtroSeccion === 'todas' && (
        <VisorEscenaPBR3D
          perfil={perfil}
          nombreProducto={recetaEnOlla?.nombre || 'Formulación Directa'}
          figuraId={recetaEnOlla?.figuraId}
          imagenPersonalizada={recetaEnOlla?.imagenPersonalizada}
          insumosAsignados={insumosAsignados}
          costoVariableConsolidado={costoVariableConsolidado}
          precioVentaConsolidado={precioEfectivo}
          margenContribucionUnitario={margenContribucionUnitario}
        />
      )}
    </div>
  );
}