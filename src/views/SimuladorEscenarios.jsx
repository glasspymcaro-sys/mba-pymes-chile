import React, { useState } from 'react';
import { useAppState } from '../store/appState.jsx';
import { formatearCLP } from '../utils/formatters.js';

export default function SimuladorEscenarios() {
  const {
    precioVentaConsolidado,
    costoVariableConsolidado,
    costoFijoTotal,
    ventasEstimadasMensuales
  } = useAppState();

  const [variacionDemanda, setVariacionDemanda] = useState(0);
  const [variacionCostoVar, setVariacionCostoVar] = useState(0);
  const [variacionCostoFijo, setVariacionCostoFijo] = useState(0);

  const ventasBase = Number(ventasEstimadasMensuales || 0);
  const precioBase = Number(precioVentaConsolidado || 0);
  const costoVarBase = Number(costoVariableConsolidado || 0);
  const costoFijoBase = Number(costoFijoTotal || 0);

  // Escenario Base
  const margenContribBase = Math.max(0, precioBase - costoVarBase);
  const peBase = margenContribBase > 0 ? Math.ceil(costoFijoBase / margenContribBase) : 0;
  const resultadoBase = (precioBase * ventasBase) - (costoFijoBase + (costoVarBase * ventasBase));

  // Escenario Estresado
  const ventasEstresadas = Math.max(0, Math.round(ventasBase * (1 + variacionDemanda / 100)));
  const costoVarEstresado = Math.round(costoVarBase * (1 + variacionCostoVar / 100));
  const costoFijoEstresado = Math.round(costoFijoBase * (1 + variacionCostoFijo / 100));

  const margenContribEstresado = Math.max(0, precioBase - costoVarEstresado);
  const peEstresado = margenContribEstresado > 0 ? Math.ceil(costoFijoEstresado / margenContribEstresado) : 0;
  const resultadoEstresado = (precioBase * ventasEstresadas) - (costoFijoEstresado + (costoVarEstresado * ventasEstresadas));
  const deltaResultado = resultadoEstresado - resultadoBase;

  const aplicarPreajuste = (tipo) => {
    if (tipo === 'inflacion') {
      setVariacionDemanda(-5);
      setVariacionCostoVar(12);
      setVariacionCostoFijo(8);
    } else if (tipo === 'recesion') {
      setVariacionDemanda(-25);
      setVariacionCostoVar(0);
      setVariacionCostoFijo(0);
    } else if (tipo === 'optimista') {
      setVariacionDemanda(20);
      setVariacionCostoVar(-3);
      setVariacionCostoFijo(0);
    } else {
      setVariacionDemanda(0);
      setVariacionCostoVar(0);
      setVariacionCostoFijo(0);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      <div>
        <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#1a202c', margin: '0 0 6px 0' }}>
          Simulador de Sensibilidad y Escenarios de Estrés (What-If)
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>
          Proyecta la resiliencia operativa de tu negocio frente a shocks de mercado, inflación o caídas de demanda.
        </p>
      </div>

      {/* Botones de Escenarios Rápidos */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <button onClick={() => aplicarPreajuste('inflacion')} style={btnPresetStyle}>
          Shock Inflación (+12% Costos, +8% Fijos, -5% Ventas)
        </button>
        <button onClick={() => aplicarPreajuste('recesion')} style={btnPresetStyle}>
          Recesión / Caída Demanda (-25% Ventas)
        </button>
        <button onClick={() => aplicarPreajuste('optimista')} style={btnPresetStyle}>
          Escenario Expansión (+20% Ventas, -3% Costos)
        </button>
        <button onClick={() => aplicarPreajuste('reset')} style={{ ...btnPresetStyle, color: 'var(--accent-red)' }}>
          Restablecer
        </button>
      </div>

      {/* Tarjetas Comparativas Base vs Estresado */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
        <div style={cardNeuStyle}>
          <span style={labelNeuStyle}>Punto Equilibrio Simulado</span>
          <div style={{ fontSize: '26px', fontWeight: 900, color: peEstresado > peBase ? 'var(--accent-red)' : 'var(--accent-green)', marginTop: '8px' }}>
            {peEstresado.toLocaleString('es-CL')} un.
          </div>
          <span style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Base actual: {peBase.toLocaleString('es-CL')} un. ({peEstresado - peBase >= 0 ? `+${peEstresado - peBase}` : peEstresado - peBase} un.)
          </span>
        </div>

        <div style={cardNeuStyle}>
          <span style={labelNeuStyle}>Resultado Neto Simulado</span>
          <div style={{ fontSize: '26px', fontWeight: 900, color: resultadoEstresado >= 0 ? 'var(--accent-green)' : 'var(--accent-red)', marginTop: '8px' }}>
            {formatearCLP(resultadoEstresado)}
          </div>
          <span style={{ fontSize: '12.5px', color: deltaResultado >= 0 ? 'var(--accent-green)' : 'var(--accent-red)', marginTop: '4px', fontWeight: '700' }}>
            Impacto: {deltaResultado >= 0 ? `+${formatearCLP(deltaResultado)}` : formatearCLP(deltaResultado)}
          </span>
        </div>

        <div style={cardNeuStyle}>
          <span style={labelNeuStyle}>Margen Contribución Unit.</span>
          <div style={{ fontSize: '26px', fontWeight: 900, color: 'var(--primary-color)', marginTop: '8px' }}>
            {formatearCLP(margenContribEstresado)}
          </div>
          <span style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Base: {formatearCLP(margenContribBase)} / un.
          </span>
        </div>
      </div>

      {/* Controles de Sensibilidad */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px', alignItems: 'stretch' }}>
        <div style={cardNeuStyle}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1a202c', marginBottom: '20px' }}>
            Palancas de Sensibilidad
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                <span>Variación en Volumen de Ventas</span>
                <span style={{ color: variacionDemanda >= 0 ? 'var(--accent-green)' : 'var(--accent-red)', fontWeight: 800 }}>
                  {variacionDemanda > 0 ? `+${variacionDemanda}` : variacionDemanda}% ({ventasEstresadas} un.)
                </span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                step="5"
                value={variacionDemanda}
                onChange={(e) => setVariacionDemanda(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--primary-color)', cursor: 'pointer' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                <span>Variación en Costos Variables (Insumos/Stock)</span>
                <span style={{ color: variacionCostoVar <= 0 ? 'var(--accent-green)' : 'var(--accent-red)', fontWeight: 800 }}>
                  {variacionCostoVar > 0 ? `+${variacionCostoVar}` : variacionCostoVar}% ({formatearCLP(costoVarEstresado)})
                </span>
              </div>
              <input
                type="range"
                min="-30"
                max="50"
                step="2"
                value={variacionCostoVar}
                onChange={(e) => setVariacionCostoVar(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-red)', cursor: 'pointer' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                <span>Variación en Costos Fijos (Arriendos UF/Sueldos)</span>
                <span style={{ color: variacionCostoFijo <= 0 ? 'var(--accent-green)' : 'var(--accent-red)', fontWeight: 800 }}>
                  {variacionCostoFijo > 0 ? `+${variacionCostoFijo}` : variacionCostoFijo}% ({formatearCLP(costoFijoEstresado)})
                </span>
              </div>
              <input
                type="range"
                min="-20"
                max="40"
                step="2"
                value={variacionCostoFijo}
                onChange={(e) => setVariacionCostoFijo(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-red)', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>

        {/* Diagnóstico Ejecutivo */}
        <div style={{ ...cardNeuStyle, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1a202c', marginBottom: '16px' }}>
              Diagnóstico de Solvencia Bajo Estrés
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-main)', lineHeight: '1.6' }}>
              {ventasEstresadas >= peEstresado
                ? `El negocio absorbe el escenario simulado manteniendo un margen neto de ${resultadoEstresado > 0 ? ((resultadoEstresado / (precioBase * ventasEstresadas || 1)) * 100).toFixed(1) : 0}%. Tu colchón de seguridad es de ${ventasEstresadas - peEstresado} unidades sobre el nuevo punto de equilibrio.`
                : `Bajo estos parámetros el negocio entra en zona de déficit operativo por ${formatearCLP(Math.abs(resultadoEstresado))}. Necesitas subir tu precio base o renegociar costos fijos para recuperar la solvencia.`}
            </p>
          </div>

          <div style={{ padding: '16px', borderRadius: '14px', background: 'var(--bg-neumorphic)', boxShadow: 'var(--neu-pressed)' }}>
            <span style={{ fontSize: '11.5px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Acción Sugerida
            </span>
            <div style={{ fontSize: '13.5px', fontWeight: '700', color: resultadoEstresado >= 0 ? 'var(--accent-green)' : 'var(--accent-red)', marginTop: '4px' }}>
              {resultadoEstresado >= 0
                ? 'Estructura operativa resistente.'
                : `Ajustar precio mínimo sugerido a ${formatearCLP(Math.ceil((costoFijoEstresado / (ventasEstresadas || 1)) + costoVarEstresado))}.`}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

const cardNeuStyle = {
  background: 'var(--bg-neumorphic)',
  borderRadius: '20px',
  boxShadow: 'var(--neu-flat)',
  padding: '24px',
};

const labelNeuStyle = {
  fontSize: '11.5px',
  fontWeight: '800',
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

const btnPresetStyle = {
  padding: '8px 14px',
  borderRadius: '10px',
  background: 'var(--bg-neumorphic)',
  boxShadow: 'var(--neu-flat-sm)',
  color: 'var(--text-main)',
  fontWeight: '700',
  fontSize: '12px',
  cursor: 'pointer',
};