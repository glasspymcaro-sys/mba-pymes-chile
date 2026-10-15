import React, { useState, useEffect } from 'react';
import { useAppState } from '../store/appState.jsx';
import TarjetaMetrica from '../components/indicators/TarjetaMetrica.jsx';
import SimuladorPrecio from '../components/controls/SimuladorPrecio.jsx';
import GraficoPuntoEquilibrio from '../components/charts/GraficoPuntoEquilibrio.jsx';
import OllitaCocina3D from '../components/svg3d/OllitaCocina3D.jsx';
import EstanteRetail3D from '../components/svg3d/EstanteRetail3D.jsx';
import MesaServicios3D from '../components/svg3d/MesaServicios3D.jsx';
import InsumoFigura3D from '../components/svg3d/InsumoFigura3D.jsx';
import { formatCLP } from '../utils/formatters.js';

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* 1. Tarjetas Métricas Directivas del Punto de Equilibrio (Sección 8.3) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        <TarjetaMetrica
          titulo="Punto de Equilibrio"
          valor={`${puntoEquilibrioUnidades.toLocaleString('es-CL')} un.`}
          subtitulo={`Ventas mínimas: ${formatCLP(ventasPuntoEquilibrioPesos)}`}
          tendencia={ventasEfectivas >= puntoEquilibrioUnidades ? 'Solvente' : 'Déficit'}
          color={ventasEfectivas >= puntoEquilibrioUnidades ? 'var(--color-success)' : 'var(--color-danger)'}
        />

        <TarjetaMetrica
          titulo="Margen de Contribución"
          valor={formatCLP(margenContribucionUnitario)}
          subtitulo={`P (${formatCLP(precioEfectivo)}) - CV (${formatCLP(costoVarEfectivo)})`}
          tendencia={`${precioEfectivo > 0 ? Math.round((margenContribucionUnitario / precioEfectivo) * 100) : 0}% s/ venta`}
          color="var(--color-primary)"
        />

        <TarjetaMetrica
          titulo="Costos Fijos Mensuales"
          valor={formatCLP(costoFijoEfectivo)}
          subtitulo="Compromiso estructural total"
          tendencia="Fijo mensual"
        />

        <TarjetaMetrica
          titulo="Resultado Operacional"
          valor={formatCLP(resultadoOperacional)}
          subtitulo={`Margen final: ${margenPorcentual}%`}
          tendencia={resultadoOperacional >= 0 ? 'Ganancia' : 'Pérdida'}
          color={resultadoOperacional >= 0 ? 'var(--color-success)' : 'var(--color-danger)'}
        />
      </div>

      {/* 2. Stand de Costo Directo Unitario Consolidado */}
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          borderRadius: '12px',
          border: '1px solid var(--color-border)',
          padding: '20px 24px',
          boxShadow: 'var(--shadow-card)',
          display: 'grid',
          gridTemplateColumns: 'auto minmax(0, 1fr)',
          gap: '24px',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {perfil === 'restaurant' && <OllitaCocina3D tamaño={105} insumosEnOlla={insumosAsignados} />}
          {perfil === 'minimarket' && <EstanteRetail3D tamaño={105} itemsEnEstante={insumosAsignados} />}
          {perfil === 'services' && <MesaServicios3D tamaño={105} itemsEnMesa={insumosAsignados} />}
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Producto Activo en el Stand 3D • {recetaEnOlla?.nombre || 'Formulación Directa'}
            </span>
            <span
              style={{
                fontSize: '10px',
                fontWeight: 600,
                color: 'var(--color-brand-700)',
                backgroundColor: 'var(--color-brand-50)',
                border: '1px solid var(--color-brand-200)',
                padding: '2px 6px',
                borderRadius: '4px',
              }}
            >
              {insumosAsignados.length} {insumosAsignados.length === 1 ? 'insumo' : 'insumos'}
            </span>
          </div>

          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-foreground)', margin: '4px 0 6px 0' }}>
            {insumosAsignados.length > 0
              ? `${insumosAsignados.map((i) => `${i.cantidad && i.cantidad > 1 ? `${i.cantidad}x ` : ''}${i.nombre}`).join(' + ')}`
              : 'Sin insumos asignados en el stand'}
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--color-muted-foreground)', margin: 0, lineHeight: 1.5 }}>
            El costo directo unitario ($CV$) suma <strong>{formatCLP(costoVarEfectivo)}</strong> por cada unidad vendida. Cada venta a <strong>{formatCLP(precioEfectivo)}</strong> aporta <strong>{formatCLP(margenContribucionUnitario)}</strong> ({precioEfectivo > 0 ? Math.round((margenContribucionUnitario / precioEfectivo) * 100) : 0}%) a la absorción de los costos fijos operacionales.
          </p>

          {/* Galería de Insumos 3D del Producto */}
          {insumosAsignados.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
              {insumosAsignados.map((item, idx) => (
                <div
                  key={item.idAsignado || item.id || idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: '#ffffff',
                    border: '1px solid var(--color-border)',
                    padding: '3px 8px 3px 4px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.04)',
                  }}
                >
                  <InsumoFigura3D nombre={item.nombre} tamaño={24} imagenFalUrl={item.imagenFalUrl} rubro={perfil} />
                  <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-foreground)' }}>
                    {item.cantidad > 1 ? `${item.cantidad}x ` : ''}{item.nombre}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 3. Gráfico de Punto de Equilibrio y Simulador (Totalmente Responsive) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '20px',
          alignItems: 'stretch',
        }}
      >
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            borderRadius: '12px',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-card)',
            padding: '20px',
          }}
        >
          <GraficoPuntoEquilibrio
            datos={datosGrafico}
            puntoEquilibrioUnidades={puntoEquilibrioUnidades}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
              backgroundColor: 'var(--color-surface)',
              borderRadius: '12px',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-card)',
              padding: '18px 20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Dictamen Operativo de Punto de Equilibrio
            </span>
            <p style={{ fontSize: '13px', color: 'var(--color-foreground)', lineHeight: 1.55, margin: 0 }}>
              {ventasEfectivas >= puntoEquilibrioUnidades
                ? `Operación solvente. Comercializas ${ventasEfectivas - puntoEquilibrioUnidades} unidades por encima del umbral de equilibrio, proyectando una ganancia neta estimada de ${formatCLP(resultadoOperacional)}.`
                : `Operación bajo el umbral crítico. Requiere comercializar ${puntoEquilibrioUnidades - ventasEfectivas} unidades adicionales para amortizar los costos fijos de ${formatCLP(costoFijoEfectivo)}.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}