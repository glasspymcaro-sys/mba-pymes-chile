import React from 'react';
import { useAppState } from '../../store/appState.jsx';
import {
  Icono3DFugas,
  Icono3DMargen,
  Icono3DEbit,
} from '../icons3d/SistemaIconografia3D.jsx';
import { calcularEscenariosPsicologicosPrecios } from '../../core/calculationEngine.js';
import { formatCLP } from '../../utils/formatters.js';

export default function ModuloFijacionPreciosYFugas() {
  const {
    precioVentaConsolidado,
    setPrecioRecetaEnOlla,
    costoVariableConsolidado,
    costoFijoTotal,
    sueldoObjetivo,
    diasOperativosMes,
    fugasConfig,
    actualizarFugasConfig,
    analisisFugasActivas,
    recetaEnOlla,
  } = useAppState();

  const escenariosPrecios = calcularEscenariosPsicologicosPrecios({
    costoDirectoBase: costoVariableConsolidado,
    tasaFugasSobrePrecio: analisisFugasActivas.tasaFugasSobrePrecio,
    costosFijos: costoFijoTotal,
    sueldoObjetivo,
    diasOperativosMes,
  });

  return (
    <div
      id="seccion-precios"
      className="card-ejecutiva"
      style={{
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '22px',
        backgroundColor: '#0D131F',
        border: '1px solid #1E293B',
        boxShadow: '0 12px 30px -10px rgba(0, 0, 0, 0.7)',
        borderRadius: '16px',
      }}
    >
      {/* Cabecera: Fijación de Precios Inteligente + Contraste Markup vs Margen Bruto Real */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Icono3DFugas size={48} />
          <div>
            <span
              style={{
                fontSize: '10.5px',
                fontWeight: 800,
                color: '#EF4444',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                padding: '3px 8px',
                borderRadius: '6px',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                display: 'inline-block',
                marginBottom: '4px',
              }}
            >
              2. Precios reales y comisiones
            </span>
            <h2 className="heading-tight" style={{ fontSize: '18px', fontWeight: 800, color: '#F8FAFC', margin: 0 }}>
              Precio real de venta ({recetaEnOlla?.nombre || 'Producto activo'})
            </h2>
            <p style={{ fontSize: '12.5px', color: '#94A3B8', margin: '3px 0 0 0' }}>
              Calcula el margen real descontando IVA, comisiones de tarjetas, aplicaciones de reparto y mermas.
            </p>
          </div>
        </div>

        {/* Píldoras comparativas: Markup vs Margen Bruto Real */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <div
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              backgroundColor: '#111827',
              border: '1px solid #1E293B',
              textAlign: 'right',
            }}
          >
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#94A3B8', display: 'block', textTransform: 'uppercase' }}>
              Markup (Recargo s/ Costo)
            </span>
            <span className="tabular-nums" style={{ fontSize: '16px', fontWeight: 800, color: '#F8FAFC' }}>
              +{analisisFugasActivas.markupPorcentaje}%
            </span>
          </div>

          <div
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              backgroundColor: analisisFugasActivas.margenBrutoRealPorcentaje >= 35 ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
              border: `1px solid ${analisisFugasActivas.margenBrutoRealPorcentaje >= 35 ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
              textAlign: 'right',
            }}
          >
            <span style={{ fontSize: '10px', fontWeight: 700, color: analisisFugasActivas.margenBrutoRealPorcentaje >= 35 ? '#10B981' : '#F87171', display: 'block', textTransform: 'uppercase' }}>
              Margen Bruto Real Limpio
            </span>
            <span
              className="tabular-nums"
              style={{
                fontSize: '16px',
                fontWeight: 900,
                color: analisisFugasActivas.margenBrutoRealPorcentaje >= 35 ? '#10B981' : '#EF4444',
              }}
            >
              {analisisFugasActivas.margenBrutoRealPorcentaje}% ({formatCLP(analisisFugasActivas.margenContribucionReal)}/un.)
            </span>
          </div>
        </div>
      </div>

      {/* Grilla de 4 Switches Rápidos de 1 Clic para Fugas de Margen (Costos Ocultos) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '12px',
        }}
      >
        {/* 1. Switch IVA 19% */}
        <div
          className={`switch-fuga-btn ${fugasConfig.incluirIVA ? 'activo' : ''}`}
          onClick={() => actualizarFugasConfig({ incluirIVA: !fugasConfig.incluirIVA })}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Icono3DMargen size={36} />
            <div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#F8FAFC' }}>
                IVA (19% Estado)
              </div>
              <div className="tabular-nums" style={{ fontSize: '11px', color: '#94A3B8' }}>
                {fugasConfig.incluirIVA
                  ? `Estado: -${formatCLP(analisisFugasActivas.montoIVA)} | Neto: ${formatCLP(analisisFugasActivas.precioNetoSinIVA)}`
                  : 'Clic para descontar 19% del precio'}
              </div>
            </div>
          </div>
          <span
            style={{
              padding: '4px 9px',
              borderRadius: '999px',
              fontSize: '10.5px',
              fontWeight: 800,
              backgroundColor: fugasConfig.incluirIVA ? '#EF4444' : '#1E293B',
              color: fugasConfig.incluirIVA ? '#FFFFFF' : '#94A3B8',
            }}
          >
            {fugasConfig.incluirIVA ? 'ACTIVO' : 'OFF'}
          </span>
        </div>

        {/* 2. Switch POS / Transbank / MercadoPago */}
        <div
          className={`switch-fuga-btn ${fugasConfig.incluirPOS ? 'activo' : ''}`}
          onClick={() => actualizarFugasConfig({ incluirPOS: !fugasConfig.incluirPOS })}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Icono3DEbit size={36} />
            <div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#F8FAFC' }}>
                Pasarela POS ({fugasConfig.comisionPOSPorcentaje}%)
              </div>
              <div className="tabular-nums" style={{ fontSize: '11px', color: '#94A3B8' }}>
                {fugasConfig.incluirPOS
                  ? `Comisión: -${formatCLP(analisisFugasActivas.montoPOS)} por venta`
                  : 'Sin comisión de tarjeta'}
              </div>
              <div
                style={{ display: 'flex', gap: '4px', marginTop: '6px' }}
                onClick={(e) => e.stopPropagation()}
              >
                {[1.5, 2.95, 3.5].map((tasa) => (
                  <button
                    key={tasa}
                    type="button"
                    onClick={() => actualizarFugasConfig({ incluirPOS: true, comisionPOSPorcentaje: tasa })}
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '2px 7px',
                      borderRadius: '5px',
                      border: `1px solid ${fugasConfig.comisionPOSPorcentaje === tasa && fugasConfig.incluirPOS ? '#E2F800' : '#1E293B'}`,
                      backgroundColor: fugasConfig.comisionPOSPorcentaje === tasa && fugasConfig.incluirPOS ? '#1E293B' : '#0B0F17',
                      color: fugasConfig.comisionPOSPorcentaje === tasa && fugasConfig.incluirPOS ? '#E2F800' : '#94A3B8',
                      cursor: 'pointer',
                    }}
                  >
                    {tasa}%
                  </button>
                ))}
              </div>
            </div>
          </div>
          <span
            style={{
              padding: '4px 9px',
              borderRadius: '999px',
              fontSize: '10.5px',
              fontWeight: 800,
              backgroundColor: fugasConfig.incluirPOS ? '#EF4444' : '#1E293B',
              color: fugasConfig.incluirPOS ? '#FFFFFF' : '#94A3B8',
            }}
          >
            {fugasConfig.incluirPOS ? 'ACTIVO' : 'OFF'}
          </span>
        </div>

        {/* 3. Switch Apps Delivery / Marketplace */}
        <div
          className={`switch-fuga-btn ${fugasConfig.incluirDelivery ? 'activo' : ''}`}
          onClick={() => actualizarFugasConfig({ incluirDelivery: !fugasConfig.incluirDelivery })}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Icono3DFugas size={36} />
            <div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#F8FAFC' }}>
                Apps Delivery ({fugasConfig.comisionDeliveryPorcentaje}%)
              </div>
              <div className="tabular-nums" style={{ fontSize: '11px', color: '#94A3B8' }}>
                {fugasConfig.incluirDelivery
                  ? `Comisión: -${formatCLP(analisisFugasActivas.montoDelivery)}`
                  : `Precio sugerido: ${formatCLP(analisisFugasActivas.precioSugeridoDelivery)}`}
              </div>
              <div
                style={{ display: 'flex', gap: '4px', marginTop: '6px' }}
                onClick={(e) => e.stopPropagation()}
              >
                {[25, 28, 30].map((tasa) => (
                  <button
                    key={tasa}
                    type="button"
                    onClick={() => actualizarFugasConfig({ incluirDelivery: true, comisionDeliveryPorcentaje: tasa })}
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '2px 7px',
                      borderRadius: '5px',
                      border: `1px solid ${fugasConfig.comisionDeliveryPorcentaje === tasa && fugasConfig.incluirDelivery ? '#E2F800' : '#1E293B'}`,
                      backgroundColor: fugasConfig.comisionDeliveryPorcentaje === tasa && fugasConfig.incluirDelivery ? '#1E293B' : '#0B0F17',
                      color: fugasConfig.comisionDeliveryPorcentaje === tasa && fugasConfig.incluirDelivery ? '#E2F800' : '#94A3B8',
                      cursor: 'pointer',
                    }}
                  >
                    {tasa}%
                  </button>
                ))}
              </div>
            </div>
          </div>
          <span
            style={{
              padding: '4px 9px',
              borderRadius: '999px',
              fontSize: '10.5px',
              fontWeight: 800,
              backgroundColor: fugasConfig.incluirDelivery ? '#EF4444' : '#1E293B',
              color: fugasConfig.incluirDelivery ? '#FFFFFF' : '#94A3B8',
            }}
          >
            {fugasConfig.incluirDelivery ? 'ACTIVO' : 'OFF'}
          </span>
        </div>

        {/* 4. Deslizador de Merma y Packaging (2% a 5%) */}
        <div
          className="switch-fuga-btn activo"
          style={{
            borderColor: '#F59E0B',
            background: 'rgba(245, 158, 11, 0.08)',
            cursor: 'default',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
            <Icono3DMargen size={36} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#F8FAFC' }}>
                  Merma & Packaging ({fugasConfig.mermaPackagingPorcentaje}%)
                </span>
                <span className="tabular-nums" style={{ fontSize: '11px', fontWeight: 800, color: '#F59E0B' }}>
                  -{formatCLP(analisisFugasActivas.montoMermaPackaging)}/un.
                </span>
              </div>
              <input
                type="range"
                className="slider-ingenieria"
                min="0"
                max="8"
                step="0.5"
                value={fugasConfig.mermaPackagingPorcentaje}
                onChange={(e) => actualizarFugasConfig({ mermaPackagingPorcentaje: Number(e.target.value) })}
                style={{ marginTop: '8px' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#94A3B8', marginTop: '3px' }}>
                <span>Bolsas, cajas, etiquetas y mermas</span>
                <span>2% - 5% estándar</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerta inteligente si activa Apps de Delivery */}
      {fugasConfig.incluirDelivery && (
        <div
          style={{
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            border: '1.5px solid rgba(245, 158, 11, 0.4)',
            borderRadius: '12px',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ fontSize: '12.5px', color: '#FDE68A' }}>
            <strong>Alerta Canal Delivery ({fugasConfig.comisionDeliveryPorcentaje}% comisión):</strong> Si vendes en la app al mismo precio de local ({formatCLP(precioVentaConsolidado)}), la aplicación se lleva{' '}
            <strong className="tabular-nums" style={{ color: '#EF4444' }}>{formatCLP(analisisFugasActivas.montoDelivery)}</strong> por pedido. Tu{' '}
            <strong>Precio Delivery Blindado</strong> debería ser{' '}
            <strong className="tabular-nums" style={{ color: '#E2F800', fontSize: '14.5px' }}>
              {formatCLP(analisisFugasActivas.precioSugeridoDelivery)}
            </strong>{' '}
            para no regalar tu margen.
          </div>
          <button
            type="button"
            onClick={() => setPrecioRecetaEnOlla(analisisFugasActivas.precioSugeridoDelivery)}
            className="btn-bacan-warning"
            style={{ height: '36px', padding: '0 16px', fontSize: '12px', fontWeight: 800 }}
          >
            Aplicar Precio Delivery ({formatCLP(analisisFugasActivas.precioSugeridoDelivery)})
          </button>
        </div>
      )}

      {/* Simulador Psicológico de Precios: 3 Tarjetas de Posicionamiento */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#E2F800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Estrategia de precios por posicionamiento
          </span>
          <span className="tabular-nums" style={{ fontSize: '11.5px', fontWeight: 600, color: '#94A3B8' }}>
            Precio Actual: <strong style={{ color: '#F8FAFC' }}>{formatCLP(precioVentaConsolidado)}</strong> | Costo Directo + Fugas: <strong style={{ color: '#F87171' }}>{formatCLP(analisisFugasActivas.costoDirectoEfectivoTotal)}</strong>
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '14px',
          }}
        >
          {escenariosPrecios.map((esc) => {
            const esActivo = Math.abs(precioVentaConsolidado - esc.precioSugerido) < 150;
            return (
              <div
                key={esc.id}
                style={{
                  borderRadius: '14px',
                  border: esc.recomendado
                    ? '2px solid #E2F800'
                    : esActivo
                    ? '2px solid #10B981'
                    : '1px solid #1E293B',
                  backgroundColor: esc.recomendado ? '#131A29' : '#0B0F17',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '14px',
                  boxShadow: esc.recomendado
                    ? '0 0 20px rgba(226, 248, 0, 0.18), 0 8px 24px rgba(0, 0, 0, 0.6)'
                    : '0 4px 12px rgba(0, 0, 0, 0.4)',
                  transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Icono3DMargen size={36} />
                      <div>
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            color: esc.recomendado ? '#E2F800' : '#94A3B8',
                            display: 'block',
                          }}
                        >
                          {esc.etiqueta}
                        </span>
                        <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#F8FAFC', margin: 0 }}>
                          {esc.nombre}
                        </h4>
                      </div>
                    </div>
                    {esc.recomendado && (
                      <span
                        style={{
                          fontSize: '9.5px',
                          fontWeight: 800,
                          backgroundColor: '#E2F800',
                          color: '#070A12',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                        }}
                      >
                        Recomendado
                      </span>
                    )}
                  </div>

                  <p style={{ fontSize: '11.5px', color: '#94A3B8', margin: '10px 0', lineHeight: 1.45 }}>
                    {esc.descripcion}
                  </p>

                  <div className="tabular-nums" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94A3B8', borderTop: '1px solid #1E293B', paddingTop: '8px' }}>
                    <span>Margen Bruto Real: <strong style={{ color: esc.margenBrutoReal >= 40 ? '#10B981' : '#F59E0B' }}>{esc.margenBrutoReal}%</strong></span>
                    <span>Markup: <strong>+{esc.markup}%</strong></span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #1E293B', paddingTop: '10px' }}>
                  <div>
                    <span style={{ fontSize: '10px', color: '#94A3B8', display: 'block' }}>Precio Sugerido</span>
                    <span className="tabular-nums" style={{ fontSize: '18px', fontWeight: 900, color: esc.recomendado ? '#E2F800' : '#F8FAFC' }}>
                      {formatCLP(esc.precioSugerido)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPrecioRecetaEnOlla(esc.precioSugerido)}
                    className={esActivo ? 'btn-bacan-primary' : 'btn-bacan-secondary'}
                    style={{ height: '32px', padding: '0 12px', fontSize: '11.5px', fontWeight: 700 }}
                  >
                    {esActivo ? 'Precio Activo' : 'Adoptar Precio'}
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
