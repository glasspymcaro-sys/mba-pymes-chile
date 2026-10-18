import React from 'react';
import { useAppState } from '../../store/appState.jsx';
import {
  Icono3DLibertad,
  Icono3DCapacidad,
  Icono3DEbit,
} from '../icons3d/SistemaIconografia3D.jsx';
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
    <div id="seccion-sueldo" className="bento-grid-12" style={{ alignItems: 'stretch' }}>
      {/* LADO IZQUIERDO (6 COL): INGENIERÍA INVERSA "EL SUELDO OBJETIVO" + ALERTA DE CAPACIDAD FÍSICA */}
      <div
        className="bento-col-6 card-ejecutiva"
        style={{
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '18px',
          backgroundColor: '#0D131F',
          border: '1px solid #1E293B',
          borderRadius: '16px',
          boxShadow: '0 12px 30px -10px rgba(0, 0, 0, 0.7)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <Icono3DLibertad size={48} />
            <div>
              <span
                style={{
                  fontSize: '10.5px',
                  fontWeight: 800,
                  color: '#E2F800',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  backgroundColor: 'rgba(226, 248, 0, 0.1)',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  border: '1px solid rgba(226, 248, 0, 0.35)',
                  display: 'inline-block',
                  marginBottom: '4px',
                }}
              >
                Ingeniería Inversa del Sueldo
              </span>
              <h2 className="heading-tight" style={{ fontSize: '18px', fontWeight: 800, color: '#F8FAFC', margin: 0 }}>
                ¿Cuánto dinero líquido te quieres llevar al bolsillo este mes?
              </h2>
            </div>
          </div>
        </div>

        {/* Selector e Input del Sueldo Objetivo */}
        <div
          style={{
            backgroundColor: '#0B0F17',
            borderRadius: '12px',
            border: '1px solid #1E293B',
            padding: '16px 18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>
                Tu Sueldo Líquido Mensual Deseado
              </span>
              <div className="tabular-nums" style={{ fontSize: '26px', fontWeight: 900, color: '#E2F800', letterSpacing: '-0.03em' }}>
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
                    fontWeight: 700,
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

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>
            <span>Costos Fijos Empresa: <strong style={{ color: '#F8FAFC' }}>{formatCLP(costoFijoTotal)}</strong></span>
            <span>Meta Total a Cubrir: <strong style={{ color: '#E2F800' }}>{formatCLP(costoFijoTotal + sueldoObjetivo)}</strong></span>
          </div>
        </div>

        {/* Traducción a Ritmo Diario Real */}
        {metaSueldo.esViable ? (
          <div
            style={{
              backgroundColor: '#111827',
              color: '#F8FAFC',
              borderRadius: '12px',
              padding: '16px 18px',
              border: '1px solid #1E293B',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.4)',
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#E2F800', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
              Meta Traducida a Ritmo Diario ({diasOperativosMes} días hábiles/mes)
            </div>
            <p style={{ fontSize: '14.5px', lineHeight: 1.5, margin: 0, fontWeight: 500 }}>
              Para pagarte <strong style={{ color: '#E2F800', fontWeight: 800 }}>{formatCLP(sueldoObjetivo)} libres</strong> este mes vendiendo{' '}
              <strong style={{ color: '#FFFFFF' }}>{recetaEnOlla?.nombre || 'tu producto'}</strong>, necesitas vender{' '}
              <span
                className="tabular-nums"
                style={{
                  backgroundColor: '#1E293B',
                  color: '#E2F800',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  fontWeight: 800,
                  border: '1px solid rgba(226, 248, 0, 0.4)',
                }}
              >
                {metaSueldo.unidadesDiariasMeta} {unidadEtiqueta} al día
              </span>{' '}
              (o facturar <strong className="tabular-nums" style={{ color: '#10B981' }}>{formatCLP(metaSueldo.facturacionDiariaMeta)} diarios</strong>).
            </p>
            <div
              className="tabular-nums"
              style={{
                marginTop: '12px',
                paddingTop: '10px',
                borderTop: '1px solid #1E293B',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '8px',
                fontSize: '11.5px',
                color: '#94A3B8',
              }}
            >
              <span>PE Básico (Ganar $0): <strong style={{ color: '#F8FAFC' }}>{metaSueldo.peBaseUnidades} un./mes</strong></span>
              <span>PE + Tu Sueldo: <strong style={{ color: '#E2F800' }}>{metaSueldo.peConSueldoUnidades} un./mes</strong></span>
              <button
                type="button"
                onClick={() => setVentasEstimadasMensuales(metaSueldo.peConSueldoUnidades)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#E2F800',
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
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1.5px solid rgba(239, 68, 68, 0.4)',
              borderRadius: '12px',
              padding: '14px',
              color: '#F87171',
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
            backgroundColor: metaSueldo.excedeCapacidadFisica ? 'rgba(239, 68, 68, 0.12)' : '#0B0F17',
            border: `1px solid ${metaSueldo.excedeCapacidadFisica ? 'rgba(239, 68, 68, 0.5)' : '#1E293B'}`,
            borderRadius: '12px',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '220px' }}>
            <Icono3DCapacidad size={42} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: metaSueldo.excedeCapacidadFisica ? '#EF4444' : '#F8FAFC',
                  }}
                >
                  {metaSueldo.excedeCapacidadFisica
                    ? 'Capacidad física excedida'
                    : 'Capacidad operativa adecuada'}
                </span>
                <span
                  className="tabular-nums"
                  style={{
                    fontSize: '10.5px',
                    fontWeight: 800,
                    padding: '2px 7px',
                    borderRadius: '4px',
                    backgroundColor: metaSueldo.excedeCapacidadFisica ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                    color: metaSueldo.excedeCapacidadFisica ? '#EF4444' : '#10B981',
                    border: `1px solid ${metaSueldo.excedeCapacidadFisica ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`,
                  }}
                >
                  {metaSueldo.unidadesPorHoraMeta || 0} un./hora ({metaSueldo.porcentajeUsoCapacidad}% cap.)
                </span>
              </div>
              <p style={{ fontSize: '12px', color: metaSueldo.excedeCapacidadFisica ? '#FCA5A5' : '#94A3B8', margin: '3px 0 0 0' }}>
                {metaSueldo.excedeCapacidadFisica
                  ? `Exige despachar ${metaSueldo.unidadesPorHoraMeta} un./hora sin parar (máx. local: ${capacidadMaximaHora}/hr). Tu precio es demasiado bajo para tu capacidad física.`
                  : `Abriendo ${diasOperativosMes} días (${horasOperativasDia} hrs/día), requieres ${metaSueldo.unidadesPorHoraMeta} ventas por hora (capacidad máx: ${capacidadMaximaHora}/hr).`}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8' }}>
              Días/Mes:
              <input
                type="number"
                min="1"
                max="31"
                value={diasOperativosMes}
                onChange={(e) => setDiasOperativosMes(Math.max(1, Math.min(31, Number(e.target.value) || 25)))}
                style={{
                  width: '50px',
                  marginLeft: '4px',
                  padding: '4px 6px',
                  borderRadius: '6px',
                  border: '1px solid #1E293B',
                  fontWeight: 700,
                  fontSize: '12px',
                  backgroundColor: '#111827',
                  color: '#F8FAFC',
                }}
              />
            </label>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8' }}>
              Máx/Hr:
              <input
                type="number"
                min="1"
                max="200"
                value={capacidadMaximaHora}
                onChange={(e) => setCapacidadMaximaHora(Math.max(1, Number(e.target.value) || 12))}
                style={{
                  width: '50px',
                  marginLeft: '4px',
                  padding: '4px 6px',
                  borderRadius: '6px',
                  border: '1px solid #1E293B',
                  fontWeight: 700,
                  fontSize: '12px',
                  backgroundColor: '#111827',
                  color: '#F8FAFC',
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
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '18px',
          backgroundColor: '#0D131F',
          border: '1px solid #1E293B',
          borderRadius: '16px',
          boxShadow: '0 12px 30px -10px rgba(0, 0, 0, 0.7)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <Icono3DEbit size={48} />
            <div>
              <span
                style={{
                  fontSize: '10.5px',
                  fontWeight: 800,
                  color: '#10B981',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  backgroundColor: 'rgba(16, 185, 129, 0.12)',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  border: '1px solid rgba(16, 185, 129, 0.35)',
                  display: 'inline-block',
                  marginBottom: '4px',
                }}
              >
                Calendario de cobertura mensual
              </span>
              <h2 className="heading-tight" style={{ fontSize: '18px', fontWeight: 800, color: '#F8FAFC', margin: 0 }}>
                ¿En qué día del mes dejas de trabajar para pagar gastos?
              </h2>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8' }}>Ritmo:</span>
            <span className="tabular-nums" style={{ fontSize: '12px', fontWeight: 800, color: '#E2F800', backgroundColor: '#111827', padding: '4px 8px', borderRadius: '6px', border: '1px solid #1E293B' }}>
              {ventasEstimadasMensuales} un./mes
            </span>
          </div>
        </div>

        {/* Dictamen Horario Exacto del Día de la Libertad */}
        <div
          style={{
            padding: '14px 18px',
            borderRadius: '12px',
            backgroundColor: calendario.lograEquilibrioEnMes ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            border: `1.5px solid ${calendario.lograEquilibrioEnMes ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
            fontSize: '13px',
            lineHeight: 1.55,
            color: '#F8FAFC',
          }}
        >
          {calendario.lograEquilibrioEnMes ? (
            <>
              Del <strong>día 1 al {Math.max(1, calendario.diaEquilibrioNumero - 1)}</strong> trabajas para pagar arriendo, sueldos fijos y proveedores.{' '}
              Recién el{' '}
              <strong style={{ color: '#E2F800', textDecoration: 'underline' }}>
                día {calendario.diaEquilibrioNumero} a las {calendario.horaLibertadCostos}
              </strong>{' '}
              empiezas a ganar plata para ti.{' '}
              {calendario.lograSueldoEnMes ? (
                <span>
                  Y el <strong style={{ color: '#10B981' }}>día {calendario.diaSueldoNumero} ({calendario.horaLibertadSueldo})</strong> completas tu sueldo líquido de {formatCLP(sueldoObjetivo)}.
                </span>
              ) : (
                <span style={{ color: '#F59E0B', fontWeight: 600 }}>
                  (Con el volumen actual de {ventasEstimadasMensuales} un. cubres gastos fijos, pero faltan ventas para completar el 100% de tu sueldo objetivo).
                </span>
              )}
            </>
          ) : (
            <strong style={{ color: '#EF4444' }}>
              Alerta: Con {ventasEstimadasMensuales} unidades/mes trabajas los 30 días del mes sin alcanzar a cubrir los costos fijos ({formatCLP(costoFijoTotal)}). Incrementa el volumen o ajusta tu precio.
            </strong>
          )}
        </div>

        {/* Grilla Visual de 30 Días del Mes (Dark Tech Obsidian Tokens) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
            gap: '8px',
          }}
        >
          {calendario.diasCalendario.map((d) => {
            const esCostos = d.fase === 'costos_fijos';
            const esSueldo = d.fase === 'sueldo_objetivo';
            const bg = esCostos ? 'rgba(239, 68, 68, 0.12)' : esSueldo ? 'rgba(59, 130, 246, 0.12)' : 'rgba(16, 185, 129, 0.14)';
            const border = d.esDiaLibertadCostos || d.esDiaLibertadSueldo
              ? '2px solid #E2F800'
              : esCostos
              ? '1px solid rgba(239, 68, 68, 0.3)'
              : esSueldo
              ? '1px solid rgba(59, 130, 246, 0.3)'
              : '1px solid rgba(16, 185, 129, 0.3)';
            const textColor = esCostos ? '#FCA5A5' : esSueldo ? '#93C5FD' : '#10B981';

            return (
              <div
                key={d.dia}
                title={`Día ${d.dia}: ${d.etiqueta} (Acumulado neto: ${formatCLP(d.saldoNetoAcumulado)})`}
                style={{
                  padding: '8px 4px',
                  borderRadius: '8px',
                  backgroundColor: bg,
                  border,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  boxShadow: d.esDiaLibertadCostos || d.esDiaLibertadSueldo ? '0 0 15px rgba(226, 248, 0, 0.4)' : 'none',
                  transition: 'transform 0.15s ease',
                }}
              >
                <span className="tabular-nums" style={{ fontSize: '13px', fontWeight: 800, color: textColor }}>
                  {d.dia}
                </span>
                <span style={{ fontSize: '9px', fontWeight: 700, color: textColor, textTransform: 'uppercase', marginTop: '2px' }}>
                  {d.esDiaLibertadCostos ? 'LIBERTAD' : d.esDiaLibertadSueldo ? 'SUELDO' : esCostos ? 'Gastos' : esSueldo ? 'Sueldo' : 'Utilidad'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Leyenda del Calendario */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#94A3B8', borderTop: '1px solid #1E293B', paddingTop: '10px' }}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#EF4444' }} />
              Gastos Fijos
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#3B82F6' }} />
              Tu Sueldo
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#10B981' }} />
              Utilidad Libre
            </span>
          </div>
          <span style={{ color: '#E2F800', fontWeight: 700 }}>
            {calendario.diasCalendario.filter((d) => d.fase === 'ganancia_neta').length} días de ganancia limpia
          </span>
        </div>
      </div>
    </div>
  );
}
