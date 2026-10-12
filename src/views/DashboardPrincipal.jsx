import React, { useState, useEffect } from 'react';
import { useAppState } from '../store/appState.jsx';
import TarjetaMetrica from '../components/indicators/TarjetaMetrica.jsx';
import SimuladorPrecio from '../components/controls/SimuladorPrecio.jsx';
import GraficoPuntoEquilibrio from '../components/charts/GraficoPuntoEquilibrio.jsx';
import OllitaCocina3D from '../components/svg3d/OllitaCocina3D.jsx';
import EstanteRetail3D from '../components/svg3d/EstanteRetail3D.jsx';
import MesaServicios3D from '../components/svg3d/MesaServicios3D.jsx';
import { formatearCLP } from '../utils/formatters.js';

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

  // Cálculos de Punto de Equilibrio
  const margenContribucionUnitario = Math.max(0, precioEfectivo - costoVarEfectivo);
  const puntoEquilibrioUnidades =
    margenContribucionUnitario > 0 ? Math.ceil(costoFijoEfectivo / margenContribucionUnitario) : 0;
  const ventasPuntoEquilibrioPesos = puntoEquilibrioUnidades * precioEfectivo;

  const ingresosTotales = precioEfectivo * ventasEfectivas;
  const costosTotales = costoFijoEfectivo + costoVarEfectivo * ventasEfectivas;
  const resultadoOperacional = ingresosTotales - costosTotales;
  const margenPorcentual =
    ingresosTotales > 0 ? ((resultadoOperacional / ingresosTotales) * 100).toFixed(1) : 0;

  // Curvas para el gráfico SVG
  const maxRango = Math.max(ventasEfectivas * 1.4, puntoEquilibrioUnidades * 1.4, 40);
  const paso = Math.ceil(maxRango / 7);
  const datosGrafico = [];

  for (let u = 0; u <= maxRango; u += paso) {
    datosGrafico.push({
      unidades: u,
      ingresos: Math.round(u * precioEfectivo),
      costos: Math.round(costoFijoEfectivo + u * costoVarEfectivo),
    });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Tarjetas Métricas Directivas del Punto de Equilibrio */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        <TarjetaMetrica
          titulo="Punto de Equilibrio"
          valor={`${puntoEquilibrioUnidades.toLocaleString('es-CL')} un.`}
          subtitulo={formatearCLP(ventasPuntoEquilibrioPesos)}
          tendencia={ventasEfectivas >= puntoEquilibrioUnidades ? 'Solvente' : 'Déficit'}
          color={ventasEfectivas >= puntoEquilibrioUnidades ? 'var(--accent-green)' : 'var(--accent-red)'}
        />

        <TarjetaMetrica
          titulo="Margen de Contribución"
          valor={formatearCLP(margenContribucionUnitario)}
          subtitulo={`P ($${precioEfectivo.toLocaleString('es-CL')}) - CV ($${costoVarEfectivo.toLocaleString('es-CL')})`}
          tendencia={`${precioEfectivo > 0 ? Math.round((margenContribucionUnitario / precioEfectivo) * 100) : 0}% s/ venta`}
          color="var(--primary-color)"
        />

        <TarjetaMetrica
          titulo="Costos Fijos Mensuales"
          valor={formatearCLP(costoFijoEfectivo)}
          subtitulo="Compromiso estructural total"
          tendencia="Fijo mensual"
        />

        <TarjetaMetrica
          titulo="Resultado Operacional"
          valor={formatearCLP(resultadoOperacional)}
          subtitulo={`Margen operacional: ${margenPorcentual}%`}
          tendencia={resultadoOperacional >= 0 ? 'Ganancia' : 'Pérdida'}
          color={resultadoOperacional >= 0 ? 'var(--accent-green)' : 'var(--accent-red)'}
        />
      </div>

      {/* 2. Escenario de Costos Directos 3D Integrados */}
      <div
        style={{
          background: 'var(--bg-neumorphic)',
          borderRadius: '24px',
          padding: '20px 24px',
          boxShadow: 'var(--neu-flat)',
          display: 'grid',
          gridTemplateColumns: 'auto minmax(0, 1fr)',
          gap: '24px',
          alignItems: 'center',
        }}
      >
        {/* Render 3D del contenedor activo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {perfil === 'restaurant' && <OllitaCocina3D tamaño={110} insumosEnOlla={insumosAsignados} />}
          {perfil === 'minimarket' && <EstanteRetail3D tamaño={110} itemsEnEstante={insumosAsignados} />}
          {perfil === 'services' && <MesaServicios3D tamaño={110} itemsEnMesa={insumosAsignados} />}
        </div>

        {/* Resumen del costo directo unitario */}
        <div>
          <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--primary-color)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
            Composición de Costo Directo Unitario (CV)
          </span>
          <h3 style={{ fontSize: '17px', fontWeight: '900', color: '#1a202c', margin: '4px 0 6px 0' }}>
            {insumosAsignados.length > 0
              ? `${insumosAsignados.map((i) => i.nombre).join(' + ')}`
              : 'Sin insumos asignados'}
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
            El costo directo unitario suma <strong>{formatearCLP(costoVarEfectivo)}</strong> por cada unidad vendida. Cada producto comercializado aporta <strong>{formatearCLP(margenContribucionUnitario)}</strong> al pago de los costos fijos estructurales.
          </p>
        </div>
      </div>

      {/* 3. Gráfico de Punto de Equilibrio y Simulador */}
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
            onPrecioChange={(val) => {
              setPrecioSimulado(val);
              setPrecioVentaConsolidado(val);
            }}
            onVentasChange={(val) => {
              setVentasSimuladas(val);
              setVentasEstimadasMensuales(val);
            }}
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
              gap: '8px',
            }}
          >
            <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Dictamen Operativo de Punto de Equilibrio
            </span>
            <p style={{ fontSize: '13px', color: 'var(--text-main)', lineHeight: '1.55', margin: 0 }}>
              {ventasEfectivas >= puntoEquilibrioUnidades
                ? `Operación viable. Comercializas ${ventasEfectivas - puntoEquilibrioUnidades} unidades por encima del umbral de equilibrio, generando una ganancia neta estimada de ${formatearCLP(resultadoOperacional)}.`
                : `Operación bajo el umbral crítico. Requiere comercializar ${puntoEquilibrioUnidades - ventasEfectivas} unidades adicionales para amortizar los costos fijos de ${formatearCLP(costoFijoEfectivo)}.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}