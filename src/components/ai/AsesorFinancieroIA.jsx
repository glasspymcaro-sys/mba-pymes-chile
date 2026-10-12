import React, { useState } from 'react';
import { useAppState } from '../../store/appState.jsx';
import { generarDiagnosticoFinanciero } from '../../lib/gemini.js';
import { registrarDiagnosticoIA } from '../../services/dbService.js';

export default function AsesorFinancieroIA() {
  const {
    user,
    perfil,
    nombreNegocio,
    precioVentaConsolidado,
    costoVariableConsolidado,
    costoFijoTotal,
    ventasEstimadasMensuales,
    porcentajeMermaGlobal,
    margenObjetivoPorcentaje,
  } = useAppState();

  const [diagnostico, setDiagnostico] = useState('');
  const [cargando, setCargando] = useState(false);
  const [historialGuardado, setHistorialGuardado] = useState(false);

  // Cálculos de contribución y punto de equilibrio
  const margenContribucionUnitario = Math.max(0, precioVentaConsolidado - costoVariableConsolidado);
  const puntoEquilibrioUnidades =
    margenContribucionUnitario > 0 ? costoFijoTotal / margenContribucionUnitario : 0;
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
        porcentajeMermaGlobal,
        margenObjetivoPorcentaje,
        puntoEquilibrioUnidades,
        margenContribucionUnitario,
      });

      setDiagnostico(resultado);

      // Registrar en base de datos Supabase si hay usuario activo
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

  const cardStyle = {
    backgroundColor: 'var(--bg-neumorphic)',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: 'var(--neu-flat)',
    border: '1px solid rgba(255, 255, 255, 0.4)',
    marginBottom: '20px',
  };

  const metricBoxStyle = {
    backgroundColor: 'var(--bg-neumorphic)',
    boxShadow: 'var(--neu-pressed)',
    padding: '12px 14px',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  };

  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
        <div>
          <span style={{ fontSize: '10.5px', fontWeight: '800', color: 'var(--primary-color)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Auditoría y Estrategia Financiera • Gemini 3.8
          </span>
          <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-main)', margin: '4px 0 0 0' }}>
            Asesor Financiero MBA con Inteligencia Artificial
          </h3>
        </div>

        <button
          onClick={handleConsultarIA}
          disabled={cargando}
          style={{
            padding: '9px 18px',
            borderRadius: '10px',
            backgroundColor: 'var(--primary-color)',
            color: '#ffffff',
            border: 'none',
            fontSize: '12px',
            fontWeight: '700',
            cursor: cargando ? 'not-allowed' : 'pointer',
            boxShadow: 'var(--neu-flat-sm)',
            transition: 'all 0.15s ease',
          }}
        >
          {cargando ? 'Generando Dictamen Ejecutivo...' : 'Generar Dictamen con IA'}
        </button>
      </div>

      {/* Grid de Métricas Analizadas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '18px' }}>
        <div style={metricBoxStyle}>
          <span style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)' }}>PUNTO DE EQUILIBRIO</span>
          <span style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)' }}>
            {Math.ceil(puntoEquilibrioUnidades)} u / mes
          </span>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
            ${Math.round(ventasPuntoEquilibrioPesos).toLocaleString('es-CL')} CLP
          </span>
        </div>

        <div style={metricBoxStyle}>
          <span style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)' }}>MARGEN CONTRIBUCIÓN</span>
          <span style={{ fontSize: '15px', fontWeight: '800', color: 'var(--primary-color)' }}>
            ${Math.round(margenContribucionUnitario).toLocaleString('es-CL')} CLP
          </span>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
            {precioVentaConsolidado > 0 ? Math.round((margenContribucionUnitario / precioVentaConsolidado) * 100) : 0}% s/ venta
          </span>
        </div>

        <div style={metricBoxStyle}>
          <span style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)' }}>MARGEN DE SEGURIDAD</span>
          <span style={{ fontSize: '15px', fontWeight: '800', color: margenSeguridadUnidades >= 0 ? '#059669' : '#dc2626' }}>
            {Math.round(margenSeguridadUnidades)} u
          </span>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
            {ventasEstimadasMensuales > 0 ? Math.round((margenSeguridadUnidades / ventasEstimadasMensuales) * 100) : 0}% holgura
          </span>
        </div>

        <div style={metricBoxStyle}>
          <span style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)' }}>MERMA DECLARADA</span>
          <span style={{ fontSize: '15px', fontWeight: '800', color: 'var(--accent-red)' }}>
            {porcentajeMermaGlobal}%
          </span>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
            Impacta costo reposición
          </span>
        </div>
      </div>

      {/* Resultados de Dictamen */}
      {diagnostico && (
        <div
          style={{
            backgroundColor: 'var(--bg-neumorphic)',
            boxShadow: 'var(--neu-pressed)',
            borderRadius: '12px',
            padding: '18px',
            fontSize: '12.5px',
            lineHeight: 1.6,
            color: 'var(--text-main)',
            whiteSpace: 'pre-line',
            border: '1px solid rgba(0, 0, 0, 0.05)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--primary-color)', textTransform: 'uppercase' }}>
              Dictamen Estratégico Generado por Gemini AI
            </span>
            {historialGuardado && (
              <span style={{ fontSize: '10.5px', color: '#059669', fontWeight: '700' }}>
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
