import React, { useState } from 'react';
import { useAppState } from '../../store/appState.jsx';
import { generarDiagnosticoFinanciero } from '../../lib/gemini.js';
import { registrarDiagnosticoIA } from '../../services/dbService.js';
import SkeletonAnatomico from '../common/SkeletonAnatomico.jsx';
import TechnicalEmptyStateSVG from '../svg3d/TechnicalEmptyStateSVG.jsx';
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
    if (cargando) return;
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
    backgroundColor: 'var(--color-surface-elevated, #131A29)',
    border: '1px solid var(--color-border)',
    boxShadow: 'var(--shadow-card)',
    padding: '14px 16px',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--color-surface)',
        borderRadius: '10px',
        border: '1px solid var(--color-border)',
        padding: '22px 24px',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <span style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Auditoría y Estrategia • Motor Gemini AI
          </span>
          <h2 className="heading-tight" style={{ fontSize: '17px', fontWeight: 600, color: 'var(--color-foreground)', margin: '2px 0 0 0' }}>
            Asesor Financiero con Inteligencia Artificial
          </h2>
        </div>

        <button
          onClick={handleConsultarIA}
          disabled={cargando}
          className="btn-eng-primary"
          style={{
            height: '36px',
            padding: '0 16px',
            borderRadius: '6px',
            backgroundColor: 'var(--color-primary)',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '12.5px',
            fontWeight: 600,
            cursor: cargando ? 'not-allowed' : 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            opacity: cargando ? 0.85 : 1,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          {cargando ? 'Generando Dictamen…' : 'Generar Dictamen con IA'}
        </button>
      </div>

      {/* Grid de Métricas Analizadas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
        <div style={metricBoxStyle}>
          <span style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--color-muted-foreground)', letterSpacing: '0.04em' }}>PUNTO DE EQUILIBRIO</span>
          <span className="tabular-nums" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-foreground)' }}>
            {puntoEquilibrioUnidades.toLocaleString('es-CL')} un.
          </span>
          <span className="tabular-nums" style={{ fontSize: '11px', color: 'var(--color-muted-foreground)' }}>
            {formatCLP(ventasPuntoEquilibrioPesos)}
          </span>
        </div>

        <div style={metricBoxStyle}>
          <span style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--color-muted-foreground)', letterSpacing: '0.04em' }}>MARGEN CONTRIBUCIÓN</span>
          <span className="tabular-nums" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-primary)' }}>
            {formatCLP(margenContribucionUnitario)}
          </span>
          <span className="tabular-nums" style={{ fontSize: '11px', color: 'var(--color-muted-foreground)' }}>
            {precioVentaConsolidado > 0 ? Math.round((margenContribucionUnitario / precioVentaConsolidado) * 100) : 0}% s/ venta
          </span>
        </div>

        <div style={metricBoxStyle}>
          <span style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--color-muted-foreground)', letterSpacing: '0.04em' }}>MARGEN DE SEGURIDAD</span>
          <span
            className="tabular-nums"
            style={{
              fontSize: '18px',
              fontWeight: 700,
              color: margenSeguridadUnidades >= 0 ? 'var(--color-success)' : 'var(--color-danger)',
            }}
          >
            {Math.round(margenSeguridadUnidades).toLocaleString('es-CL')} un.
          </span>
          <span className="tabular-nums" style={{ fontSize: '11px', color: 'var(--color-muted-foreground)' }}>
            {ventasEstimadasMensuales > 0 ? Math.round((margenSeguridadUnidades / ventasEstimadasMensuales) * 100) : 0}% holgura
          </span>
        </div>

        <div style={metricBoxStyle}>
          <span style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--color-muted-foreground)', letterSpacing: '0.04em' }}>COSTO FIJO TOTAL</span>
          <span className="tabular-nums" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-foreground)' }}>
            {formatCLP(costoFijoTotal)}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--color-muted-foreground)' }}>
            Compromiso estructural
          </span>
        </div>
      </div>

      {/* Estado de Carga Anatómico, Estado Inicial Vectorial o Resultado de Dictamen */}
      {cargando ? (
        <SkeletonAnatomico variant="ai-report" />
      ) : diagnostico ? (
        <div
          style={{
            backgroundColor: 'var(--color-surface-elevated, #131A29)',
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
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
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
      ) : (
        <TechnicalEmptyStateSVG
          tipo="ia"
          titulo="Motor de Auditoría Financiera IA listo para ejecución"
          descripcion="Presione 'Generar Dictamen con IA' para evaluar la sensibilidad de precios, absorción de costos fijos y recomendaciones tácticas para su rubro."
        />
      )}
    </div>
  );
}
