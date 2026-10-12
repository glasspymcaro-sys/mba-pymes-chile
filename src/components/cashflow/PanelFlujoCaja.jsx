import React, { useState, useMemo } from 'react';
import { useAppState } from '../../store/appState.jsx';
import { formatearCLP } from '../../utils/formatters.js';

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

export default function PanelFlujoCaja() {
  const { precioVentaConsolidado, costoVariableConsolidado, ventasEstimadasMensuales, costoFijoTotal } = useAppState();

  const ingresoBaseMensual = Math.round(Number(precioVentaConsolidado || 0) * Number(ventasEstimadasMensuales || 0));
  const costoVarBaseMensual = Math.round(Number(costoVariableConsolidado || 0) * Number(ventasEstimadasMensuales || 0));
  const costoFijoBaseMensual = Math.round(Number(costoFijoTotal || 0));

  const [saldoInicial, setSaldoInicial] = useState(1500000);
  const [cuentas, setCuentas] = useState([
    { id: 'ing_ventas', tipo: 'ingreso', nombre: 'Ingresos por Ventas', valores: Array(12).fill(ingresoBaseMensual) },
    { id: 'egr_cif_var', tipo: 'egreso', nombre: 'Costos Variables Directos', valores: Array(12).fill(costoVarBaseMensual) },
    { id: 'egr_fijos', tipo: 'egreso', nombre: 'Costos Fijos Operativos', valores: Array(12).fill(costoFijoBaseMensual) }
  ]);

  const agregarCuenta = (tipo) => {
    const nuevaCuenta = {
      id: `${tipo}_${Date.now()}`,
      tipo,
      nombre: tipo === 'ingreso' ? 'Nuevo Ingreso' : 'Nuevo Gasto',
      valores: Array(12).fill(0)
    };
    setCuentas([...cuentas, nuevaCuenta]);
  };

  const eliminarCuenta = (id) => {
    setCuentas(cuentas.filter((c) => c.id !== id));
  };

  const actualizarNombre = (id, nuevoNombre) => {
    setCuentas(cuentas.map((c) => (c.id === id ? { ...c, nombre: nuevoNombre } : c)));
  };

  const actualizarValor = (id, mesIndex, valor) => {
    const valorNumerico = Number(valor) || 0;
    setCuentas(
      cuentas.map((c) => {
        if (c.id === id) {
          const nuevosValores = [...c.valores];
          nuevosValores[mesIndex] = valorNumerico;
          return { ...c, valores: nuevosValores };
        }
        return c;
      })
    );
  };

  const matrizFinanciera = useMemo(() => {
    const ingresos = cuentas.filter((c) => c.tipo === 'ingreso');
    const egresos = cuentas.filter((c) => c.tipo === 'egreso');

    const totalesIngresos = Array(12).fill(0);
    const totalesEgresos = Array(12).fill(0);
    const flujoNeto = Array(12).fill(0);
    const saldoAcumulado = Array(12).fill(0);

    for (let i = 0; i < 12; i++) {
      totalesIngresos[i] = ingresos.reduce((sum, cuenta) => sum + Number(cuenta.valores[i] || 0), 0);
      totalesEgresos[i] = egresos.reduce((sum, cuenta) => sum + Number(cuenta.valores[i] || 0), 0);
      flujoNeto[i] = totalesIngresos[i] - totalesEgresos[i];

      if (i === 0) {
        saldoAcumulado[i] = saldoInicial + flujoNeto[i];
      } else {
        saldoAcumulado[i] = saldoAcumulado[i - 1] + flujoNeto[i];
      }
    }

    return { ingresos, egresos, totalesIngresos, totalesEgresos, flujoNeto, saldoAcumulado };
  }, [cuentas, saldoInicial]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#1a202c', margin: '0 0 6px 0' }}>
            Flujo de Caja Proyectado
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>
            Proyección de tesorería mensual con cálculo dinámico de posición de liquidez acumulada.
          </p>
        </div>

        <div style={{ ...cardNeuStyle, padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <label style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-main)' }}>Saldo Inicial:</label>
          <input
            type="number"
            value={saldoInicial}
            onChange={(e) => setSaldoInicial(Number(e.target.value))}
            style={{ ...inputNeuStyle, width: '130px', fontWeight: '800' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '14px' }}>
        <button onClick={() => agregarCuenta('ingreso')} style={btnAccionNeuStyle('var(--accent-green)')}>
          + Agregar Ingreso
        </button>
        <button onClick={() => agregarCuenta('egreso')} style={btnAccionNeuStyle('var(--accent-red)')}>
          + Agregar Egreso
        </button>
      </div>

      <div style={{ ...cardNeuStyle, padding: '20px', overflowX: 'auto' }}>
        <table style={{ width: '100%', minWidth: '1300px', borderCollapse: 'separate', borderSpacing: '0 6px', textAlign: 'right', fontSize: '13px' }}>
          <thead>
            <tr style={{ color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <th style={{ padding: '12px', textAlign: 'left', minWidth: '220px' }}>Cuenta / Concepto</th>
              {MESES.map((m) => (
                <th key={m} style={{ padding: '12px', minWidth: '95px' }}>{m}</th>
              ))}
              <th style={{ padding: '12px', textAlign: 'center', minWidth: '80px' }}>Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={14} style={{ textAlign: 'left', padding: '10px 14px', fontWeight: '900', color: 'var(--accent-green)', fontSize: '12.5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Ingresos Operativos
              </td>
            </tr>
            {matrizFinanciera.ingresos.map((cuenta) => (
              <tr key={cuenta.id}>
                <td style={{ padding: '4px 8px', textAlign: 'left' }}>
                  <input
                    type="text"
                    value={cuenta.nombre}
                    onChange={(e) => actualizarNombre(cuenta.id, e.target.value)}
                    style={{ ...inputNeuStyle, fontWeight: '700' }}
                  />
                </td>
                {cuenta.valores.map((val, idx) => (
                  <td key={idx} style={{ padding: '4px 4px' }}>
                    <input
                      type="number"
                      value={val === 0 ? '' : val}
                      placeholder="0"
                      onChange={(e) => actualizarValor(cuenta.id, idx, e.target.value)}
                      style={{ ...inputNeuStyle, textAlign: 'right' }}
                    />
                  </td>
                ))}
                <td style={{ padding: '4px 8px', textAlign: 'center' }}>
                  <button onClick={() => eliminarCuenta(cuenta.id)} style={btnEliminarNeuStyle}>Eliminar</button>
                </td>
              </tr>
            ))}
            <tr style={{ fontWeight: '800' }}>
              <td style={{ padding: '12px 14px', textAlign: 'left', color: 'var(--text-main)' }}>Total Ingresos</td>
              {matrizFinanciera.totalesIngresos.map((t, idx) => (
                <td key={idx} style={{ padding: '12px 4px', color: 'var(--accent-green)' }}>{formatearCLP(t)}</td>
              ))}
              <td></td>
            </tr>

            <tr>
              <td colSpan={14} style={{ textAlign: 'left', padding: '16px 14px 10px', fontWeight: '900', color: 'var(--accent-red)', fontSize: '12.5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Egresos Operativos
              </td>
            </tr>
            {matrizFinanciera.egresos.map((cuenta) => (
              <tr key={cuenta.id}>
                <td style={{ padding: '4px 8px', textAlign: 'left' }}>
                  <input
                    type="text"
                    value={cuenta.nombre}
                    onChange={(e) => actualizarNombre(cuenta.id, e.target.value)}
                    style={{ ...inputNeuStyle, fontWeight: '700' }}
                  />
                </td>
                {cuenta.valores.map((val, idx) => (
                  <td key={idx} style={{ padding: '4px 4px' }}>
                    <input
                      type="number"
                      value={val === 0 ? '' : val}
                      placeholder="0"
                      onChange={(e) => actualizarValor(cuenta.id, idx, e.target.value)}
                      style={{ ...inputNeuStyle, textAlign: 'right' }}
                    />
                  </td>
                ))}
                <td style={{ padding: '4px 8px', textAlign: 'center' }}>
                  <button onClick={() => eliminarCuenta(cuenta.id)} style={btnEliminarNeuStyle}>Eliminar</button>
                </td>
              </tr>
            ))}
            <tr style={{ fontWeight: '800' }}>
              <td style={{ padding: '12px 14px', textAlign: 'left', color: 'var(--text-main)' }}>Total Egresos</td>
              {matrizFinanciera.totalesEgresos.map((t, idx) => (
                <td key={idx} style={{ padding: '12px 4px', color: 'var(--accent-red)' }}>{formatearCLP(t)}</td>
              ))}
              <td></td>
            </tr>

            <tr>
              <td colSpan={14} style={{ padding: '8px 0' }}></td>
            </tr>

            <tr style={{ fontWeight: '900', background: 'var(--bg-neumorphic)' }}>
              <td style={{ padding: '14px', textAlign: 'left', borderRadius: '12px 0 0 12px', boxShadow: 'var(--neu-pressed)', color: 'var(--text-main)' }}>
                Flujo Neto
              </td>
              {matrizFinanciera.flujoNeto.map((neto, idx) => (
                <td key={idx} style={{ padding: '14px 4px', boxShadow: 'var(--neu-pressed)', color: neto >= 0 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                  {formatearCLP(neto)}
                </td>
              ))}
              <td style={{ borderRadius: '0 12px 12px 0', boxShadow: 'var(--neu-pressed)' }}></td>
            </tr>

            <tr style={{ fontWeight: '900' }}>
              <td style={{ padding: '16px 14px', textAlign: 'left', color: '#1a202c', fontSize: '14px' }}>
                SALDO ACUMULADO
              </td>
              {matrizFinanciera.saldoAcumulado.map((acum, idx) => (
                <td key={idx} style={{ padding: '16px 4px', fontSize: '13.5px', color: acum >= 0 ? 'var(--primary-color)' : 'var(--accent-red)' }}>
                  {formatearCLP(acum)}
                </td>
              ))}
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

const cardNeuStyle = {
  background: 'var(--bg-neumorphic)',
  borderRadius: '20px',
  boxShadow: 'var(--neu-flat)',
};

const inputNeuStyle = {
  width: '100%',
  padding: '8px 10px',
  borderRadius: '8px',
  border: 'none',
  outline: 'none',
  background: 'var(--bg-neumorphic)',
  boxShadow: 'var(--neu-pressed)',
  fontSize: '12.5px',
  color: 'var(--text-main)',
  boxSizing: 'border-box',
};

const btnAccionNeuStyle = (color) => ({
  padding: '10px 18px',
  borderRadius: '12px',
  background: 'var(--bg-neumorphic)',
  boxShadow: 'var(--neu-flat-sm)',
  color: color,
  fontWeight: '800',
  fontSize: '12.5px',
  cursor: 'pointer',
});

const btnEliminarNeuStyle = {
  padding: '6px 10px',
  borderRadius: '8px',
  background: 'var(--bg-neumorphic)',
  boxShadow: 'var(--neu-flat-sm)',
  color: 'var(--accent-red)',
  fontWeight: '700',
  fontSize: '11px',
  cursor: 'pointer',
};