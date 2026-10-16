import React from 'react';
import { useAppState } from '../../store/appState.jsx';
import ImagenJson3D from '../svg3d/ImagenJson3D.jsx';
import {
  calcularSueldoObjetivoYCapacidad,
  calcularCalendarioDiaLibertad,
} from '../../core/calculationEngine.js';
import { formatCLP } from '../../utils/formatters.js';

export default function ModuloSueldoObjetivoYLibertad() {
  const {
    perfil,
    sueldoObjetivo,
    setSueldoObjetivo,
    diasOperativosMes,
    setDiasOperativosMes,
    horasOperativasDia,
    setHorasOperativasDia,
    capacidadMaximaHora,
    setCapacidadMaximaHora,
    costoFijoTotal,
    precioVentaConsolidado,
    ventasEstimadasMensuales,
    setVentasEstimadasMensuales,
    analisisFugasActivas,
    recetaEnOlla,
  } = useAppState();

  const margenRealUnitario = analisisFugasActivas.margenContribucionReal;

  const metaSueldo = calcularSueldoObjetivoYCapacidad({
    costosFijos: costoFijoTotal,
    sueldoObjetivo,
    margenUnitarioReal: margenRealUnitario,
    precioVenta: precioVentaConsolidado,
    diasOperativosMes,
    horasOperativasDia,
    capacidadMaximaHora,
  });

  const calendario = calcularCalendarioDiaLibertad({
    costosFijos: costoFijoTotal,
    sueldoObjetivo,
    margenUnitarioReal: margenRealUnitario,
    ventasMensualesEstimadas: ventasEstimadasMensuales,
    horaApertura: 9,
    horasJornada: horasOperativasDia,
  });

  const unidadEtiqueta =
    perfil === 'restaurant' ? 'platos' : perfil === 'minimarket' ? 'packs/ventas' : 'servicios/horas';

  const sueldosRapidos = [800000, 1500000, 2500000, 4000000];

  return (
    <div className="bento-grid-12" style={{ alignItems: 'stretch' }}>
      {/* LADO IZQUIERDO (6 COL): INGENIERÍA INVERSA "EL SUELDO OBJETIVO" + ALERTA DE CAPACIDAD FÍSICA */}
      <div
        className="bento-col-6 card-ejecutiva-destacada"
        style={{
          padding: '22px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ImagenJson3D idIcono="sueldo_objetivo" tamaño={54} />
            <div>
              <span
                style={{
                  fontSize: '10.5px',
                  fontWeight: 800,
                  color: '#0F766E',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  backgroundColor: '#CCFBF1',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  border: '1px solid #5EEAD4',
                  display: 'inline-block',
                  marginBottom: '4px',
                }}
              >
                1. Ingeniería Inversa • Target Profit
              </span>
              <h2 className="heading-tight" style={{ fontSize: '17px', fontWeight: 800, color: '#09090B', margin: 0 }}>
                ¿Cuánto dinero líquido te quieres llevar al bolsillo este mes?
              </h2>
            </div>
          </div>
        </div>

        {/* Selector e Input del Sueldo Objetivo */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1.5px solid #99F6E4',
            padding: '14px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            boxShadow: '0 2px 8px rgba(15, 118, 110, 0.06)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                Tu Sueldo Líquido Mensual Deseado
              </span>
              <div className="tabular-nums" style={{ fontSize: '26px', fontWeight: 900, color: '#0F766E', letterSpacing: '-0.03em' }}>
                {formatCLP(sueldoObjetivo)}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {sueldosRapidos.map((monto) => (
                <button
                  key={monto}
                  type="button"
                  onClick={() => setSueldoObjetivo(monto)}
                  className={sueldoObjetivo === monto ? 'btn-bacan-primary' : 'btn-bacan-secondary'}
                  style={{
                    height: '32px',
                    padding: '0 10px',
                    fontSize: '11.5px',
                  }}
                >
                  {formatCLP(monto)}
                </button>
              ))}
            </div>
          </div>

          <input
            type="range"
            className="slider-ingenieria"
            min="300000"
            max="6000000"
            step="100000"
            value={sueldoObjetivo}
            onChange={(e) => setSueldoObjetivo(Number(e.target.value))}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
            <span>Costos Fijos Empresa: {formatCLP(costoFijoTotal)}</span>
            <span>Meta Total a Cubrir (CF + Sueldo): {formatCLP(costoFijoTotal + sueldoObjetivo)}</span>
          </div>
        </div>

        {/* Traducción a Ritmo Diario Real */}
        {metaSueldo.esViable ? (
          <div
            style={{
              backgroundColor: '#09090B',
              color: '#FFFFFF',
              borderRadius: '12px',
              padding: '16px 18px',
              border: '1.5px solid #27272A',
              boxShadow: '0 8px 20px rgba(9, 9, 11, 0.16)',
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#5EEAD4', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
              Meta Traducida a Ritmo Diario ({diasOperativosMes} días hábiles/mes)
            </div>
            <p style={{ fontSize: '14.5px', lineHeight: 1.5, margin: 0, fontWeight: 500 }}>
              Para pagarte <strong style={{ color: '#5EEAD4', fontWeight: 800 }}>{formatCLP(sueldoObjetivo)} libres</strong> este mes vendiendo{' '}
              <strong style={{ color: '#FFFFFF' }}>{recetaEnOlla?.nombre || 'tu producto'}</strong>, necesitas vender{' '}
              <span
                className="tabular-nums"
                style={{
                  backgroundColor: '#0F766E',
                  color: '#FFFFFF',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  fontWeight: 800,
                  border: '1px solid #2DD4BF',
                }}
              >
                {metaSueldo.unidadesDiariasMeta} {unidadEtiqueta} al día
              </span>{' '}
              (o facturar <strong className="tabular-nums" style={{ color: '#FEF08A' }}>{formatCLP(metaSueldo.facturacionDiariaMeta)} diarios</strong>).
            </p>
            <div
              className="tabular-nums"
              style={{
                marginTop: '10px',
                paddingTop: '10px',
                borderTop: '1px solid #27272A',
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '8px',
                fontSize: '11.5px',
                color: '#A1A1AA',
              }}
            >
              <span>PE Básico (Ganar $0): <strong style={{ color: '#FFFFFF' }}>{metaSueldo.peBaseUnidades} un./mes</strong></span>
              <span>PE + Tu Sueldo: <strong style={{ color: '#5EEAD4' }}>{metaSueldo.peConSueldoUnidades} un./mes</strong></span>
              <button
                type="button"
                onClick={() => setVentasEstimadasMensuales(metaSueldo.peConSueldoUnidades)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#5EEAD4',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontSize: '11.5px',
                }}
              >
                Fijar como meta mensual
              </button>
            </div>
          </div>
        ) : (
          <div
            style={{
              backgroundColor: '#FEF2F2',
              border: '1.5px solid #EF4444',
              borderRadius: '12px',
              padding: '14px',
              color: '#991B1B',
              fontSize: '13px',
              fontWeight: 700,
            }}
          >
            Tu margen real por unidad es negativo o cero ({formatCLP(margenRealUnitario)}). Sube tu precio o apaga comisiones ocultas abajo para poder pagar tu sueldo.
          </div>
        )}

        {/* Alerta de Capacidad Física Real */}
        <div
          style={{
            backgroundColor: metaSueldo.excedeCapacidadFisica ? '#FEF2F2' : '#F8FAFC',
            border: `1.5px solid ${metaSueldo.excedeCapacidadFisica ? '#EF4444' : '#CBD5E1'}`,
            borderRadius: '12px',
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '220px' }}>
            <ImagenJson3D idIcono="alerta_capacidad" tamaño={42} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: metaSueldo.excedeCapacidadFisica ? '#DC2626' : '#0F172A',
                  }}
                >
                  {metaSueldo.excedeCapacidadFisica
                    ? 'Alerta de Capacidad Física Real Excedida'
                    : ' Ritmo Físico Operativo Sostenible'}
                </span>
                <span
                  className="tabular-nums"
                  style={{
                    fontSize: '10.5px',
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: '4px',
                    backgroundColor: metaSueldo.excedeCapacidadFisica ? '#FEE2E2' : '#ECFDF5',
                    color: metaSueldo.excedeCapacidadFisica ? '#991B1B' : '#065F46',
                  }}
                >
                  {metaSueldo.unidadesPorHoraMeta || 0} un./hora ({metaSueldo.porcentajeUsoCapacidad}% cap.)
                </span>
              </div>
              <p style={{ fontSize: '12px', color: metaSueldo.excedeCapacidadFisica ? '#7F1D1D' : '#475569', margin: '2px 0 0 0' }}>
                {metaSueldo.excedeCapacidadFisica
                  ? `Exige despachar ${metaSueldo.unidadesPorHoraMeta} un./hora sin parar (máx. local: ${capacidadMaximaHora}/hr). Tu precio es demasiado bajo para tu capacidad física.`
                  : `Abriendo ${diasOperativosMes} días (${horasOperativasDia} hrs/día), requieres ${metaSueldo.unidadesPorHoraMeta} ventas por hora (capacidad máx: ${capacidadMaximaHora}/hr).`}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <label style={{ fontSize: '10.5px', fontWeight: 700, color: '#475569' }}>
              Días/Mes:
              <input
                type="number"
                min="1"
                max="31"
                value={diasOperativosMes}
                onChange={(e) => setDiasOperativosMes(Math.max(1, Math.min(31, Number(e.target.value) || 25)))}
                style={{
                  width: '46px',
                  marginLeft: '4px',
                  padding: '3px 5px',
                  borderRadius: '6px',
                  border: '1px solid #CBD5E1',
                  fontWeight: 700,
                  fontSize: '11.5px',
                }}
              />
            </label>
            <label style={{ fontSize: '10.5px', fontWeight: 700, color: '#475569' }}>
              Máx/Hr:
              <input
                type="number"
                min="1"
                max="200"
                value={capacidadMaximaHora}
                onChange={(e) => setCapacidadMaximaHora(Math.max(1, Number(e.target.value) || 12))}
                style={{
                  width: '48px',
                  marginLeft: '4px',
                  padding: '3px 5px',
                  borderRadius: '6px',
                  border: '1px solid #CBD5E1',
                  fontWeight: 700,
                  fontSize: '11.5px',
                }}
              />
            </label>
          </div>
        </div>
      </div>

      {/* LADO DERECHO (6 COL): EL "DÍA DE LA LIBERTAD" (CALENDARIO VISUAL DEL MES 1 AL 30) */}
      <div
        className="bento-col-6 card-ejecutiva"
        style={{
          padding: '22px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '14px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ImagenJson3D idIcono="dia_libertad" tamaño={52} />
            <div>
              <span
                style={{
                  fontSize: '10.5px',
                  fontWeight: 800,
                  color: '#059669',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  backgroundColor: '#ECFDF5',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  border: '1px solid #6EE7B7',
                  display: 'inline-block',
                  marginBottom: '4px',
                }}
              >
                Calendario Financiero • El Día de la Libertad
              </span>
              <h2 className="heading-tight" style={{ fontSize: '17px', fontWeight: 800, color: '#09090B', margin: 0 }}>
                ¿En qué día del mes dejas de trabajar para pagar gastos?
              </h2>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569' }}>Ritmo:</span>
            <span className="tabular-nums" style={{ fontSize: '12px', fontWeight: 800, color: '#0F766E', backgroundColor: '#F0FDFA', padding: '4px 8px', borderRadius: '6px', border: '1px solid #99F6E4' }}>
              {ventasEstimadasMensuales} un./mes
            </span>
          </div>
        </div>

        {/* Dictamen Horario Exacto del Día de la Libertad */}
        <div
          style={{
            padding: '13px 16px',
            borderRadius: '12px',
            backgroundColor: calendario.lograEquilibrioEnMes ? '#F0FDFA' : '#FEF2F2',
            border: `1.5px solid ${calendario.lograEquilibrioEnMes ? '#5EEAD4' : '#FCA5A5'}`,
            fontSize: '13px',
            lineHeight: 1.5,
            color: '#0F172A',
          }}
        >
          {calendario.lograEquilibrioEnMes ? (
            <>
              Del <strong>día 1 al {Math.max(1, calendario.diaEquilibrioNumero - 1)}</strong> trabajas para pagar arriendo, sueldos fijos y proveedores.{' '}
              Recién el{' '}
              <strong style={{ color: '#0F766E', textDecoration: 'underline' }}>
                día {calendario.diaEquilibrioNumero} a las {calendario.horaLibertadCostos}
              </strong>{' '}
              empiezas a ganar plata para ti.{' '}
              {calendario.lograSueldoEnMes ? (
                <span>
                  Y el <strong style={{ color: '#059669' }}>día {calendario.diaSueldoNumero} ({calendario.horaLibertadSueldo})</strong> completas tu sueldo líquido de {formatCLP(sueldoObjetivo)}.
                </span>
              ) : (
                <span style={{ color: '#B45309', fontWeight: 600 }}>
                  (Con el volumen actual de {ventasEstimadasMensuales} un. cubres gastos fijos, pero faltan ventas para completar el 100% de tu sueldo objetivo).
                </span>
              )}
            </>
          ) : (
            <strong style={{ color: '#991B1B' }}>
              Alerta: Con {ventasEstimadasMensuales} unidades/mes trabajas los 30 días del mes sin alcanzar a cubrir los costos fijos ({formatCLP(costoFijoTotal)}). Incrementa el volumen o ajusta tu precio.
            </strong>
          )}
        </div>

        {/* Grilla Visual de 30 Días del Mes */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
            gap: '6px',
          }}
        >
          {calendario.diasCalendario.map((d) => {
            const esCostos = d.fase === 'costos_fijos';
            const esSueldo = d.fase === 'sueldo_objetivo';
            const bg = esCostos ? '#FEF2F2' : esSueldo ? '#EFF6FF' : '#ECFDF5';
            const border = d.esDiaLibertadCostos || d.esDiaLibertadSueldo
              ? '2px solid #09090B'
              : esCostos
              ? '1px solid #FECACA'
              : esSueldo
              ? '1px solid #93C5FD'
              : '1px solid #6EE7B7';
            const textColor = esCostos ? '#991B1B' : esSueldo ? '#1E40AF' : '#065F46';

            return (
              <div
                key={d.dia}
                title={`Día ${d.dia}: ${d.etiqueta} (Acumulado neto: ${formatCLP(d.saldoNetoAcumulado)})`}
                style={{
                  padding: '6px 4px',
                  borderRadius: '8px',
                  backgroundColor: bg,
                  border,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  boxShadow: d.esDiaLibertadCostos || d.esDiaLibertadSueldo ? '0 3px 8px rgba(0,0,0,0.14)' : 'none',
                }}
              >
                <span className="tabular-nums" style={{ fontSize: '12px', fontWeight: 800, color: textColor }}>
                  Día {d.dia}
                </span>
                <span style={{ fontSize: '9px', fontWeight: 700, color: textColor, opacity: 0.9, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
                  {d.esDiaLibertadCostos ? 'LIBERTAD PE' : d.esDiaLibertadSueldo ? 'META SUELDO' : esCostos ? 'Gastos' : esSueldo ? 'Tu Sueldo' : 'Ganancia'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Leyenda de Fases del Mes */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', fontSize: '11px', fontWeight: 600, color: '#475569' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: '#FECACA', border: '1px solid #EF4444', display: 'inline-block' }} />
            <span>Días para Pagar Gastos ({calendario.diasParaPagarCostos}d)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: '#BFDBFE', border: '1px solid #2563EB', display: 'inline-block' }} />
            <span>Construyendo Tu Sueldo</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: '#6EE7B7', border: '1px solid #059669', display: 'inline-block' }} />
            <span>Utilidad Líquida Extra</span>
          </div>
        </div>
      </div>
    </div>
  );
}
