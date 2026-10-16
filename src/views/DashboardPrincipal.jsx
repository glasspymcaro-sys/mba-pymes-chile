import React from 'react';
import { useAppState } from '../store/appState.jsx';
import TarjetaMetrica from '../components/indicators/TarjetaMetrica.jsx';
import SimuladorPrecio from '../components/controls/SimuladorPrecio.jsx';
import GraficoPuntoEquilibrio from '../components/charts/GraficoPuntoEquilibrio.jsx';
import VisorEscenaPBR3D from '../components/svg3d/VisorEscenaPBR3D.jsx';
import { formatCLP } from '../utils/formatters.js';

/**
 * Dashboard Principal de Punto de Equilibrio
 * Layout Bento Grid Asimétrico de 12 columnas + Visor 3D PBR + Matriz de Escenarios Operativos
 */
export default function DashboardPrincipal() {
  const {
    perfil,
    precioVentaConsolidado,
    setPrecioRecetaEnOlla,
    costoVariableConsolidado,
    costoFijoTotal,
    ventasEstimadasMensuales,
    setVentasEstimadasMensuales,
    insumosAsignados,
    recetaEnOlla,
  } = useAppState();

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

  // Escenarios comparativos para la matriz ejecutiva
  const escenarios = [
    {
      nombre: 'Escenario Conservador (-20%)',
      unidades: Math.max(1, Math.round(ventasEfectivas * 0.8)),
      destacado: false,
    },
    {
      nombre: 'Umbral Punto de Equilibrio',
      unidades: puntoEquilibrioUnidades,
      destacado: false,
      esPE: true,
    },
    {
      nombre: 'Proyección Operativa Actual',
      unidades: ventasEfectivas,
      destacado: true,
    },
    {
      nombre: 'Escenario Expansión (+25%)',
      unidades: Math.round(ventasEfectivas * 1.25),
      destacado: false,
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* 1. Bento Grid Asimétrico de KPIs Ejecutivos (4 + 4 + 2 + 2 columnas en Desktop) */}
      <div className="bento-kpi-grid">
        <div className="bento-kpi-primary">
          <TarjetaMetrica
            titulo="Punto de Equilibrio Operacional"
            icono="equilibrio"
            valor={`${puntoEquilibrioUnidades.toLocaleString('es-CL')} un.`}
            subtitulo={`Facturación mínima: ${formatCLP(ventasPuntoEquilibrioPesos)}`}
            tendencia={ventasEfectivas >= puntoEquilibrioUnidades ? 'Solvente' : 'Déficit'}
            color={ventasEfectivas >= puntoEquilibrioUnidades ? 'var(--color-success)' : 'var(--color-danger)'}
          />
        </div>

        <div className="bento-kpi-secondary">
          <TarjetaMetrica
            titulo="Resultado Operacional (EBIT)"
            icono="ebit"
            valor={formatCLP(resultadoOperacional)}
            subtitulo={`Margen neto s/ ingresos: ${margenPorcentual}%`}
            tendencia={resultadoOperacional >= 0 ? 'Ganancia' : 'Pérdida'}
            color={resultadoOperacional >= 0 ? 'var(--color-success)' : 'var(--color-danger)'}
          />
        </div>

        <div className="bento-kpi-compact">
          <TarjetaMetrica
            titulo="Contribución Unit."
            icono="margen"
            valor={formatCLP(margenContribucionUnitario)}
            subtitulo={`${precioEfectivo > 0 ? Math.round((margenContribucionUnitario / precioEfectivo) * 100) : 0}% s/ precio`}
            color="var(--color-primary)"
          />
        </div>

        <div className="bento-kpi-compact">
          <TarjetaMetrica
            titulo="Carga Fija Mensual"
            icono="fijos"
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
            onPrecioChange={(val) => setPrecioRecetaEnOlla(val)}
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

      {/* 4. Matriz Ejecutiva de Escenarios de Sensibilidad */}
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          borderRadius: '10px',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-card)',
          padding: '18px 20px',
          overflowX: 'auto',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="9" y1="21" x2="9" y2="9" />
            </svg>
            <h3 className="heading-tight" style={{ fontSize: '14.5px', fontWeight: 600, color: 'var(--color-foreground)', margin: 0 }}>
              Matriz Comparativa de Escenarios Operativos
            </h3>
          </div>
          <span style={{ fontSize: '11.5px', color: 'var(--color-muted-foreground)' }}>
            Simulación determinista sobre estructura de costos vigente
          </span>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-muted-foreground)', fontSize: '11px', textTransform: 'uppercase' }}>
              <th style={{ padding: '8px 10px', fontWeight: 600 }}>Escenario</th>
              <th style={{ padding: '8px 10px', fontWeight: 600, textAlign: 'right' }}>Volumen (Q)</th>
              <th style={{ padding: '8px 10px', fontWeight: 600, textAlign: 'right' }}>Facturación</th>
              <th style={{ padding: '8px 10px', fontWeight: 600, textAlign: 'right' }}>Costo Total (CF+CV)</th>
              <th style={{ padding: '8px 10px', fontWeight: 600, textAlign: 'right' }}>Resultado EBIT</th>
            </tr>
          </thead>
          <tbody className="tabular-nums">
            {escenarios.map((esc, idx) => {
              const ing = esc.unidades * precioEfectivo;
              const cost = costoFijoEfectivo + esc.unidades * costoVarEfectivo;
              const util = esc.esPE ? 0 : ing - cost;
              return (
                <tr
                  key={idx}
                  style={{
                    borderBottom: idx < escenarios.length - 1 ? '1px solid var(--color-border)' : 'none',
                    backgroundColor: esc.destacado ? 'var(--color-brand-50)' : 'transparent',
                    fontWeight: esc.destacado ? 600 : 500,
                  }}
                >
                  <td style={{ padding: '9px 10px', color: 'var(--color-foreground)' }}>{esc.nombre}</td>
                  <td style={{ padding: '9px 10px', textAlign: 'right' }}>{esc.unidades.toLocaleString('es-CL')} un.</td>
                  <td style={{ padding: '9px 10px', textAlign: 'right' }}>{formatCLP(ing)}</td>
                  <td style={{ padding: '9px 10px', textAlign: 'right' }}>{formatCLP(cost)}</td>
                  <td
                    style={{
                      padding: '9px 10px',
                      textAlign: 'right',
                      fontWeight: 700,
                      color: util > 0 ? 'var(--color-success)' : util < 0 ? 'var(--color-danger)' : 'var(--color-primary)',
                    }}
                  >
                    {formatCLP(util)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}