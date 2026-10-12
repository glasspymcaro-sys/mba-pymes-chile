import React, { useState } from 'react';
import { useAppState } from '../../store/appState.jsx';
import { generarDiagnosticoFinanciero } from '../../lib/gemini.js';
import { registrarDiagnosticoIA } from '../../services/dbService.js';
import { formatCLP } from '../../utils/formatters.js';

export default function AsesorFinancieroIA() {
  const {
    user,
    perfil,
    nombreNegocio,
    precioVentaConsolidado,
    costoVariableConsolidado,
    costoFijoTotal,
    ventasEstimadasMensuales,
  } = useAppState();

  const [diagnostico, setDiagnostico] = useState('');
  const [cargando, setCargando] = useState(false);
  const [historialGuardado, setHistorialGuardado] = useState(false);

  // Cálculos de contribución y punto de equilibrio
  const margenContribucionUnitario = Math.max(0, precioVentaConsolidado - costoVariableConsolidado);
  const puntoEquilibrioUnidades =
    margenContribucionUnitario > 0 ? Math.ceil(costoFijoTotal / margenContribucionUnitario) : 0;
  const ventasPuntoEquilibrioPesos = puntoEquilibrioUnidades * precioVentaConsolidado;
  const margenSeguridadUnidades = ventasEstimadasMensuales - puntoEquilibrioUnidades;

  const handleConsultarIA = async () => {
    setCargando(true);
    setDiagnostico('');
    setHistorialGuardado(false);

    try {
      const resultado = await generarDiagnosticoFinanciero({
        nombreNegocio,
        rubro: perfil,
        precioVentaConsolidado,
        costoVariableConsolidado,
        costoFijoTotal,
        ventasEstimadasMensuales,
        porcentajeMermaGlobal: 0,
        margenObjetivoPorcentaje: 40,
        puntoEquilibrioUnidades,
        margenContribucionUnitario,
      });

      setDiagnostico(resultado);

      if (user?.id) {
        await registrarDiagnosticoIA(
          user.id,
          'diagnostico_integral_mba',
          {
            precioVentaConsolidado,
            costoVariableConsolidado,
            costoFijoTotal,
            puntoEquilibrioUnidades,
            margenContribucionUnitario,
            ventasEstimadasMensuales,
          },
          resultado
        );
        setHistorialGuardado(true);
      }
    } catch (err) {
      setDiagnostico('Error al procesar el dictamen de IA: ' + err.message);
    } finally {
      setCargando(false);
    }
  };

  const metricBoxStyle = {
    backgroundColor: '#ffffff',
    border: '1px solid var(--color-border)',
    padding: '14px',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--color-surface)',
        borderRadius: '12px',
        border: '1px solid var(--color-border)',
        padding: '24px',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Auditoría y Estrategia • Gemini
          </span>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-foreground)', margin: '2px 0 0 0' }}>
            Asesor Financiero con Inteligencia Artificial
          </h2>
        </div>

        <button
          onClick={handleConsultarIA}
          disabled={cargando}
          style={{
            padding: '10px 18px',
            borderRadius: '8px',
            backgroundColor: 'var(--color-primary)',
            color: '#ffffff',
            border: 'none',
            fontSize: '13px',
            fontWeight: 600,
            cursor: cargando ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.15s ease',
          }}
        >
          {cargando ? 'Generando Dictamen…' : 'Generar Dictamen con IA'}
        </button>
      </div>

      {/* Grid de Métricas Analizadas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
        <div style={metricBoxStyle}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-muted-foreground)' }}>PUNTO DE EQUILIBRIO</span>
          <span className="tabular-nums" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-foreground)' }}>
            {puntoEquilibrioUnidades.toLocaleString('es-CL')} un.
          </span>
          <span style={{ fontSize: '11px', color: 'var(--color-muted-foreground)' }}>
            {formatCLP(ventasPuntoEquilibrioPesos)}
          </span>
        </div>

        <div style={metricBoxStyle}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-muted-foreground)' }}>MARGEN CONTRIBUCIÓN</span>
          <span className="tabular-nums" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-primary)' }}>
            {formatCLP(margenContribucionUnitario)}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--color-muted-foreground)' }}>
            {precioVentaConsolidado > 0 ? Math.round((margenContribucionUnitario / precioVentaConsolidado) * 100) : 0}% s/ venta
          </span>
        </div>

        <div style={metricBoxStyle}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-muted-foreground)' }}>MARGEN DE SEGURIDAD</span>
          <span
            className="tabular-nums"
            style={{
              fontSize: '18px',
              fontWeight: 700,
              color: margenSeguridadUnidades >= 0 ? 'var(--color-success)' : 'var(--color-danger)',
            }}
          >
            {Math.round(margenSeguridadUnidades)} un.
          </span>
          <span style={{ fontSize: '11px', color: 'var(--color-muted-foreground)' }}>
            {ventasEstimadasMensuales > 0 ? Math.round((margenSeguridadUnidades / ventasEstimadasMensuales) * 100) : 0}% holgura
          </span>
        </div>

        <div style={metricBoxStyle}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-muted-foreground)' }}>COSTO FIJO TOTAL</span>
          <span className="tabular-nums" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-foreground)' }}>
            {formatCLP(costoFijoTotal)}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--color-muted-foreground)' }}>
            Compromiso estructural
          </span>
        </div>
      </div>

      {/* Resultados de Dictamen */}
      {diagnostico && (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            border: '1px solid var(--color-border)',
            padding: '18px',
            fontSize: '13px',
            lineHeight: 1.6,
            color: 'var(--color-foreground)',
            whiteSpace: 'pre-line',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
              Dictamen Estratégico Generado por Gemini AI
            </span>
            {historialGuardado && (
              <span style={{ fontSize: '11px', color: 'var(--color-success)', fontWeight: 600 }}>
                Registrado en Supabase
              </span>
            )}
          </div>
          {diagnostico}
        </div>
      )}
    </div>
  );
}
