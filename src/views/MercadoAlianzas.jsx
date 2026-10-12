import React, { useState } from 'react';
import { formatearCLP } from '../utils/formatters.js';

export default function MercadoAlianzas() {
  const [indicadoresMacro] = useState({
    uf: 37950,
    utm: 65967,
    dolarObs: 945,
    ipcMensual: 0.4,
    tpm: 5.75,
    sueldoMinimo: 500000
  });

  const [alianzasActivas, setAlianzasActivas] = useState([
    {
      id: 'ali_1',
      rubro: 'Gastronomía & Cafeterías',
      titulo: 'Compra Conjunta de Packaging Biodegradable',
      proveedor: 'EcoEnvases Chile',
      metaMinima: 10000,
      unidadesActuales: 7400,
      ahorroEstimado: 28,
      precioUnitarioEscala: 145,
      precioUnitarioIndividual: 201,
      participantes: 8,
      unido: false
    },
    {
      id: 'ali_2',
      rubro: 'Ferretería & Construcción',
      titulo: 'Lote de Tornillería y Fijaciones por Pallet',
      proveedor: 'Distribuidora Metálica Sur',
      metaMinima: 50,
      unidadesActuales: 32,
      ahorroEstimado: 22,
      precioUnitarioEscala: 18500,
      precioUnitarioIndividual: 23700,
      participantes: 5,
      unido: true
    },
    {
      id: 'ali_3',
      rubro: 'Minimarket & Abarrotes',
      titulo: 'Consolidación de Carga Harina y Granos',
      proveedor: 'Molino Central',
      metaMinima: 100,
      unidadesActuales: 92,
      ahorroEstimado: 19,
      precioUnitarioEscala: 14200,
      precioUnitarioIndividual: 17500,
      participantes: 12,
      unido: false
    }
  ]);

  const toggleUnirse = (id) => {
    setAlianzasActivas(alianzasActivas.map(al => {
      if (al.id === id) {
        return {
          ...al,
          unido: !al.unido,
          participantes: al.unido ? al.participantes - 1 : al.participantes + 1
        };
      }
      return al;
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      <div>
        <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#1a202c', margin: '0 0 6px 0' }}>
          Inteligencia de Mercado y Alianzas Colaborativas
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>
          Monitorea indicadores macroeconómicos clave y únete a compras conjuntas con otras pymes para reducir costos unitarios.
        </p>
      </div>

      {/* Indicadores Macroeconómicos */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        <div style={cardNeuStyle}>
          <span style={labelNeuStyle}>UF (Unidad de Fomento)</span>
          <div style={{ fontSize: '24px', fontWeight: 900, color: '#1a202c', marginTop: '6px' }}>
            ${indicadoresMacro.uf.toLocaleString('es-CL')}
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Indexación arriendos</span>
        </div>

        <div style={cardNeuStyle}>
          <span style={labelNeuStyle}>Dólar Observado</span>
          <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--primary-color)', marginTop: '6px' }}>
            ${indicadoresMacro.dolarObs} CLP
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Insumos importados</span>
        </div>

        <div style={cardNeuStyle}>
          <span style={labelNeuStyle}>Tasa Política Monetaria (TPM)</span>
          <div style={{ fontSize: '24px', fontWeight: 900, color: '#1a202c', marginTop: '6px' }}>
            {indicadoresMacro.tpm}%
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Costo de financiamiento</span>
        </div>

        <div style={cardNeuStyle}>
          <span style={labelNeuStyle}>IPC Mensual</span>
          <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--accent-red)', marginTop: '6px' }}>
            +{indicadoresMacro.ipcMensual}%
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Presión inflacionaria</span>
        </div>

        <div style={cardNeuStyle}>
          <span style={labelNeuStyle}>UTM Mensual</span>
          <div style={{ fontSize: '24px', fontWeight: 900, color: '#1a202c', marginTop: '6px' }}>
            ${indicadoresMacro.utm.toLocaleString('es-CL')}
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Impuestos y patentes</span>
        </div>
      </div>

      {/* Red de Compras Colaborativas */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1a202c', margin: 0 }}>
            Alianzas de Compra en Escala (Poder de Negociación Pyme)
          </h3>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '700' }}>
            3 convocatorias abiertas
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
          {alianzasActivas.map((al) => {
            const porcentajeMeta = Math.min(100, Math.round((al.unidadesActuales / al.metaMinima) * 100));

            return (
              <div key={al.id} style={{ ...cardNeuStyle, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--primary-color)', padding: '4px 8px', borderRadius: '6px', background: 'var(--bg-neumorphic)', boxShadow: 'var(--neu-pressed)' }}>
                      {al.rubro}
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: '900', color: 'var(--accent-green)' }}>
                      -{al.ahorroEstimado}% Ahorro
                    </span>
                  </div>

                  <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#1a202c', margin: '0 0 6px 0' }}>
                    {al.titulo}
                  </h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
                    Proveedor: <strong>{al.proveedor}</strong>
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Progreso meta de compra:</span>
                    <strong style={{ color: '#1a202c' }}>{porcentajeMeta}% ({al.unidadesActuales}/{al.metaMinima})</strong>
                  </div>
                  <div style={{ width: '100%', height: '10px', borderRadius: '5px', background: 'var(--bg-neumorphic)', boxShadow: 'var(--neu-pressed)', overflow: 'hidden' }}>
                    <div style={{ width: `${porcentajeMeta}%`, height: '100%', background: 'var(--accent-green)', transition: 'width 0.3s ease' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', padding: '10px 0', borderTop: '1px solid #cbd5e0', borderBottom: '1px solid #cbd5e0' }}>
                  <div>
                    <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', display: 'block' }}>Precio Mayorista Alianza</span>
                    <strong style={{ fontSize: '15px', color: 'var(--accent-green)' }}>{formatearCLP(al.precioUnitarioEscala)}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', display: 'block' }}>Precio Compra Individual</span>
                    <span style={{ fontSize: '14px', color: 'var(--text-muted)', textDecoration: 'line-through' }}>{formatearCLP(al.precioUnitarioIndividual)}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                    <strong>{al.participantes}</strong> emprendedoras unidas
                  </span>
                  <button
                    onClick={() => toggleUnirse(al.id)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '10px',
                      background: 'var(--bg-neumorphic)',
                      boxShadow: al.unido ? 'var(--neu-pressed)' : 'var(--neu-flat-sm)',
                      color: al.unido ? 'var(--accent-green)' : 'var(--primary-color)',
                      fontWeight: '800',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    {al.unido ? 'Suscrita a la Alianza' : 'Unirse al Grupo'}
                  </button>
                </div>
              </div>
            );
          })}
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