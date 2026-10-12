import React, { useState, useEffect } from 'react';
import { useAppState } from '../store/appState.jsx';
import TarjetaMetrica from '../components/indicators/TarjetaMetrica.jsx';
import SimuladorPrecio from '../components/controls/SimuladorPrecio.jsx';
import GraficoPuntoEquilibrio from '../components/charts/GraficoPuntoEquilibrio.jsx';
import { formatearCLP } from '../utils/formatters.js';

export default function DashboardPrincipal() {
  const {
    precioVentaConsolidado,
    costoVariableConsolidado,
    costoFijoTotal,
    ventasEstimadasMensuales
  } = useAppState();

  const [precioSimulado, setPrecioSimulado] = useState(precioVentaConsolidado || 1000);
  const [ventasSimuladas, setVentasSimuladas] = useState(ventasEstimadasMensuales || 100);

  useEffect(() => {
    if (precioVentaConsolidado > 0) {
      setPrecioSimulado(precioVentaConsolidado);
    }
  }, [precioVentaConsolidado]);

  useEffect(() => {
    if (ventasEstimadasMensuales > 0) {
      setVentasSimuladas(ventasEstimadasMensuales);
    }
  }, [ventasEstimadasMensuales]);

  const precioEfectivo = Number(precioSimulado || 0);
  const ventasEfectivas = Number(ventasSimuladas || 0);
  const costoVarEfectivo = Number(costoVariableConsolidado || 0);
  const costoFijoEfectivo = Number(costoFijoTotal || 0);

  const margenContribucionUnitario = Math.max(0, precioEfectivo - costoVarEfectivo);
  const puntoEquilibrioUnidades = margenContribucionUnitario > 0 
    ? Math.ceil(costoFijoEfectivo / margenContribucionUnitario) 
    : 0;

  const ingresosTotales = precioEfectivo * ventasEfectivas;
  const costosTotales = costoFijoEfectivo + (costoVarEfectivo * ventasEfectivas);
  const resultadoOperacional = ingresosTotales - costosTotales;

  const margenPorcentual = ingresosTotales > 0 
    ? ((resultadoOperacional / ingresosTotales) * 100).toFixed(1) 
    : 0;

  const maxRango = Math.max(ventasEfectivas * 1.4, puntoEquilibrioUnidades * 1.4, 40);
  const paso = Math.ceil(maxRango / 7);
  const datosGrafico = [];

  for (let u = 0; u <= maxRango; u += paso) {
    datosGrafico.push({
      unidades: u,
      ingresos: Math.round(u * precioEfectivo),
      costos: Math.round(costoFijoEfectivo + (u * costoVarEfectivo))
    });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* 1. Tarjetas Métricas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        <TarjetaMetrica
          titulo="Punto de Equilibrio"
          valor={`${puntoEquilibrioUnidades.toLocaleString('es-CL')} un.`}
          subtitulo="Mínimo para no perder"
          tendencia={ventasEfectivas >= puntoEquilibrioUnidades ? 'Cubierto' : 'Déficit'}
          color={ventasEfectivas >= puntoEquilibrioUnidades ? 'var(--accent-green)' : 'var(--accent-red)'}
        />
        <TarjetaMetrica
          titulo="Margen Contribución"
          valor={formatearCLP(margenContribucionUnitario)}
          subtitulo="Aporte unitario a fijos"
          tendencia={`${((margenContribucionUnitario / (precioEfectivo || 1)) * 100).toFixed(0)}%`}
          color="var(--primary-color)"
        />
        <TarjetaMetrica
          titulo="Resultado Estimado"
          valor={formatearCLP(resultadoOperacional)}
          subtitulo={`Margen final: ${margenPorcentual}%`}
          tendencia={resultadoOperacional >= 0 ? 'Ganancia' : 'Pérdida'}
          color={resultadoOperacional >= 0 ? 'var(--accent-green)' : 'var(--accent-red)'}
        />
        <TarjetaMetrica
          titulo="Costos Fijos Mensuales"
          valor={formatearCLP(costoFijoEfectivo)}
          subtitulo="Compromiso estructural fijo"
        />
      </div>

      {/* 2. Gráfico y Simulador */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1.2fr)', gap: '24px', alignItems: 'stretch' }}>
        <div
          style={{
            background: 'var(--bg-neumorphic)',
            borderRadius: '20px',
            boxShadow: 'var(--neu-flat)',
            padding: '20px',
          }}
        >
          <GraficoPuntoEquilibrio 
            datos={datosGrafico} 
            puntoEquilibrioUnidades={puntoEquilibrioUnidades} 
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <SimuladorPrecio
            precioVenta={precioEfectivo}
            ventasEstimadas={ventasEfectivas}
            onPrecioChange={setPrecioSimulado}
            onVentasChange={setVentasSimuladas}
          />

          <div
            style={{
              background: 'var(--bg-neumorphic)',
              borderRadius: '20px',
              boxShadow: 'var(--neu-flat)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <span style={{ fontSize: '11.5px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Diagnóstico Operativo
            </span>
            <p style={{ fontSize: '13.5px', color: 'var(--text-main)', lineHeight: '1.5', margin: 0 }}>
              {ventasEfectivas >= puntoEquilibrioUnidades
                ? `Operación solvente. Estás vendiendo ${ventasEfectivas - puntoEquilibrioUnidades} unidades por encima de tu estructura de costos fijos.`
                : `Déficit operativo. Necesitas colocar ${puntoEquilibrioUnidades - ventasEfectivas} unidades adicionales para alcanzar el umbral de equilibrio.`}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}