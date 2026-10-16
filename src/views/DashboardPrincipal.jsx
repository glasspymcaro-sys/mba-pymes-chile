import React from 'react';
import { useAppState } from '../store/appState.jsx';
import TarjetaMetrica from '../components/indicators/TarjetaMetrica.jsx';
import SimuladorPrecio from '../components/controls/SimuladorPrecio.jsx';
import GraficoPuntoEquilibrio from '../components/charts/GraficoPuntoEquilibrio.jsx';
import VisorEscenaPBR3D from '../components/svg3d/VisorEscenaPBR3D.jsx';
import { formatCLP } from '../utils/formatters.js';

/**
 * Dashboard Principal de Punto de Equilibrio
 * Arquitectura endurecida (core-architecture-hardener: cero useEffect redundantes)
 * Layout Bento Grid Asimétrico de 12 columnas (anti-ai-ui-craft) + Visor 3D PBR (threejs-pbr-architect)
 */
export default function DashboardPrincipal() {
  const {
    perfil,
    precioVentaConsolidado,
    setPrecioVentaConsolidado,
    costoVariableConsolidado,
    costoFijoTotal,
    ventasEstimadasMensuales,
    setVentasEstimadasMensuales,
    insumosAsignados,
    recetaEnOlla,
  } = useAppState();

  // Estado derivado limpio sin efectos secundarios redundantes (core-architecture-hardener)
  const precioEfectivo = Number(precioVentaConsolidado || 1000);
  const ventasEfectivas = Number(ventasEstimadasMensuales || 100);
  const costoVarEfectivo = Number(costoVariableConsolidado || 0);
  const costoFijoEfectivo = Number(costoFijoTotal || 0);

  // Cálculos deterministas de Punto de Equilibrio
  const margenContribucionUnitario = Math.max(0, precioEfectivo - costoVarEfectivo);
  const puntoEquilibrioUnidades =
    margenContribucionUnitario > 0 ? Math.ceil(costoFijoEfectivo / margenContribucionUnitario) : 0;
  const ventasPuntoEquilibrioPesos = puntoEquilibrioUnidades * precioEfectivo;

  const ingresosTotales = precioEfectivo * ventasEfectivas;
  const costosTotales = costoFijoEfectivo + costoVarEfectivo * ventasEfectivas;
  const resultadoOperacional = ingresosTotales - costosTotales;
  const margenPorcentual =
    ingresosTotales > 0 ? ((resultadoOperacional / ingresosTotales) * 100).toFixed(1) : '0.0';

  // Serie de proyección para el gráfico vectorial de umbral de rentabilidad
  const maxRango = Math.max(ventasEfectivas * 1.4, puntoEquilibrioUnidades * 1.4, 40);
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* 1. Bento Grid Asimétrico de KPIs Ejecutivos (4 + 4 + 2 + 2 columnas en Desktop) */}
      <div className="bento-kpi-grid">
        <div className="bento-kpi-primary">
          <TarjetaMetrica
            titulo="Punto de Equilibrio Operacional"
            valor={`${puntoEquilibrioUnidades.toLocaleString('es-CL')} un.`}
            subtitulo={`Facturación mínima: ${formatCLP(ventasPuntoEquilibrioPesos)}`}
            tendencia={ventasEfectivas >= puntoEquilibrioUnidades ? 'Solvente' : 'Déficit'}
            color={ventasEfectivas >= puntoEquilibrioUnidades ? 'var(--color-success)' : 'var(--color-danger)'}
          />
        </div>

        <div className="bento-kpi-secondary">
          <TarjetaMetrica
            titulo="Resultado Operacional (EBIT)"
            valor={formatCLP(resultadoOperacional)}
            subtitulo={`Margen neto s/ ingresos: ${margenPorcentual}%`}
            tendencia={resultadoOperacional >= 0 ? 'Ganancia' : 'Pérdida'}
            color={resultadoOperacional >= 0 ? 'var(--color-success)' : 'var(--color-danger)'}
          />
        </div>

        <div className="bento-kpi-compact">
          <TarjetaMetrica
            titulo="Contribución Unit."
            valor={formatCLP(margenContribucionUnitario)}
            subtitulo={`${precioEfectivo > 0 ? Math.round((margenContribucionUnitario / precioEfectivo) * 100) : 0}% s/ precio`}
            color="var(--color-primary)"
          />
        </div>

        <div className="bento-kpi-compact">
          <TarjetaMetrica
            titulo="Carga Fija Mensual"
            valor={formatCLP(costoFijoEfectivo)}
            subtitulo="Estructura base"
          />
        </div>
      </div>

      {/* 2. Bento Grid Principal Asimétrico 7 / 5: Curva de Rentabilidad + Simulador y Dictamen */}
      <div className="bento-grid-12" style={{ alignItems: 'stretch' }}>
        <div
          className="bento-col-7"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderRadius: '10px',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-card)',
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
            onPrecioChange={(val) => setPrecioVentaConsolidado(val)}
            onVentasChange={(val) => setVentasEstimadasMensuales(val)}
          />

          <div
            style={{
              backgroundColor: 'var(--color-surface)',
              borderRadius: '10px',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-card)',
              padding: '18px 20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '10px',
              flex: 1,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
              <span style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--color-muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Dictamen Técnico de Umbral Crítico
              </span>
              <span
                className="tabular-nums"
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '2px 7px',
                  borderRadius: '4px',
                  backgroundColor: ventasEfectivas >= puntoEquilibrioUnidades ? 'var(--color-success-bg)' : 'var(--color-danger-bg)',
                  color: ventasEfectivas >= puntoEquilibrioUnidades ? 'var(--color-success)' : 'var(--color-danger)',
                  border: `1px solid ${ventasEfectivas >= puntoEquilibrioUnidades ? 'var(--color-success-border)' : 'var(--color-danger-border)'}`,
                }}
              >
                {ventasEfectivas >= puntoEquilibrioUnidades
                  ? `+${(ventasEfectivas - puntoEquilibrioUnidades).toLocaleString('es-CL')} un. sobre PE`
                  : `-${(puntoEquilibrioUnidades - ventasEfectivas).toLocaleString('es-CL')} un. bajo PE`}
              </span>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--color-foreground)', lineHeight: 1.55, margin: 0 }}>
              {ventasEfectivas >= puntoEquilibrioUnidades
                ? `Operación solvente. Comercializas ${(ventasEfectivas - puntoEquilibrioUnidades).toLocaleString('es-CL')} unidades por encima del umbral de equilibrio, generando un excedente operacional neto de ${formatCLP(resultadoOperacional)}.`
                : `Operación bajo el umbral crítico. Se requiere comercializar ${(puntoEquilibrioUnidades - ventasEfectivas).toLocaleString('es-CL')} unidades adicionales para amortizar la estructura fija de ${formatCLP(costoFijoEfectivo)}.`}
            </p>

            {/* Barra de progreso técnica de cobertura de costos fijos */}
            <div style={{ marginTop: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-muted-foreground)', marginBottom: '4px' }}>
                <span>Cobertura de Costos Fijos</span>
                <span className="tabular-nums" style={{ fontWeight: 600, color: 'var(--color-foreground)' }}>
                  {puntoEquilibrioUnidades > 0
                    ? `${Math.min(100, Math.round((ventasEfectivas / puntoEquilibrioUnidades) * 100))}%`
                    : '100%'}
                </span>
              </div>
              <div style={{ width: '100%', height: '6px', backgroundColor: '#F4F4F5', borderRadius: '999px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${puntoEquilibrioUnidades > 0 ? Math.min(100, Math.round((ventasEfectivas / puntoEquilibrioUnidades) * 100)) : 100}%`,
                    height: '100%',
                    backgroundColor: ventasEfectivas >= puntoEquilibrioUnidades ? 'var(--color-primary)' : 'var(--color-danger)',
                    transition: 'width 0.25s ease',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Visor de Ensamblaje 3D PBR Interactivo (threejs-pbr-architect) */}
      <VisorEscenaPBR3D
        perfil={perfil}
        nombreProducto={recetaEnOlla?.nombre || 'Formulación Directa'}
        insumosAsignados={insumosAsignados}
        costoVariableConsolidado={costoVarEfectivo}
        precioVentaConsolidado={precioEfectivo}
        margenContribucionUnitario={margenContribucionUnitario}
      />
    </div>
  );
}