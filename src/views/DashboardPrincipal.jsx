import React from 'react';
import { useAppState } from '../store/appState.jsx';
import TarjetaMetrica from '../components/indicators/TarjetaMetrica.jsx';
import SimuladorPrecio from '../components/controls/SimuladorPrecio.jsx';
import GraficoPuntoEquilibrio from '../components/charts/GraficoPuntoEquilibrio.jsx';
import VisorEscenaPBR3D from '../components/svg3d/VisorEscenaPBR3D.jsx';
import ModuloSueldoObjetivoYLibertad from '../components/strategy/ModuloSueldoObjetivoYLibertad.jsx';
import ModuloFijacionPreciosYFugas from '../components/strategy/ModuloFijacionPreciosYFugas.jsx';
import ModuloSimuladorQuePasaSi from '../components/strategy/ModuloSimuladorQuePasaSi.jsx';
import ModuloIngenieriaMenuMultiproducto from '../components/strategy/ModuloIngenieriaMenuMultiproducto.jsx';
import { formatCLP } from '../utils/formatters.js';

/**
 * Dashboard Principal $5,000+ USD:
 * Integra desde la primera pantalla:
 * 1. Ingeniería Inversa "El Sueldo Objetivo" + Alerta de Capacidad Física Real + Calendario "El Día de la Libertad"
 * 2. Fijación de Precios Inteligente: Detector de Fugas de Margen (IVA, POS, Delivery, Merma) + 3 Escenarios Psicológicos
 * 3. Simulador "¿Qué pasa si...?": Destructor de Descuentos + Escudo Anti-Inflación en el Bolsillo
 * 4. Punto de Equilibrio Multi-Producto + Matriz de Rentabilidad (Minas de Oro, Ganchos, Joyas Ocultas, Vampiros)
 * 5. Curva de Punto de Equilibrio + Visor 3D PBR de Costos Directos
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* BLOQUE 1: INGENIERÍA INVERSA "EL SUELDO OBJETIVO" + CAPACIDAD FÍSICA + CALENDARIO "EL DÍA DE LA LIBERTAD" */}
      <ModuloSueldoObjetivoYLibertad />

      {/* BLOQUE 2: CALCULADORA DE PRECIO REAL + DETECTOR DE FUGAS DE MARGEN + 3 ESCENARIOS PSICOLÓGICOS */}
      <ModuloFijacionPreciosYFugas />

      {/* BLOQUE 3: SIMULADOR "¿QUÉ PASA SI...?" (DESTRUCTOR DE DESCUENTOS + ESCUDO ANTI-INFLACIÓN) */}
      <ModuloSimuladorQuePasaSi />

      {/* BLOQUE 4: PUNTO DE EQUILIBRIO MULTI-PRODUCTO E INGENIERÍA DE MENÚ (MINAS DE ORO VS VAMPIROS) */}
      <ModuloIngenieriaMenuMultiproducto onEditarProductoEnOllita={onIrAInsumos} />

      {/* BLOQUE 5: KPIS EJECUTIVOS DE SÍNTESIS CONTABLE */}
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

      {/* BLOQUE 6: GRÁFICO DE UMBRAL DE RENTABILIDAD + SIMULADOR DE VOLUMEN */}
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

      {/* BLOQUE 7: VISOR DE ENSAMBLAJE 3D PBR INTERACTIVO */}
      <VisorEscenaPBR3D
        perfil={perfil}
        nombreProducto={recetaEnOlla?.nombre || 'Formulación Directa'}
        insumosAsignados={insumosAsignados}
        costoVariableConsolidado={costoVariableConsolidado}
        precioVentaConsolidado={precioEfectivo}
        margenContribucionUnitario={margenContribucionUnitario}
      />
    </div>
  );
}