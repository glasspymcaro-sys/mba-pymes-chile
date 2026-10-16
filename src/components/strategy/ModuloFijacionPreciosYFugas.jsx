import React from 'react';
import { useAppState } from '../../store/appState.jsx';
import ImagenJson3D from '../svg3d/ImagenJson3D.jsx';
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
    <div className="card-ejecutiva" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Cabecera: Fijación de Precios Inteligente + Contraste Markup vs Margen Bruto Real */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ImagenJson3D idIcono="fugas_margen" tamaño={52} />
          <div>
            <span
              style={{
                fontSize: '10.5px',
                fontWeight: 800,
                color: '#DC2626',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                backgroundColor: '#FEF2F2',
                padding: '3px 8px',
                borderRadius: '6px',
                border: '1px solid #FCA5A5',
                display: 'inline-block',
                marginBottom: '4px',
              }}
            >
              2. Fijación de Precios Inteligente • Detector de Fugas de Margen
            </span>
            <h2 className="heading-tight" style={{ fontSize: '17px', fontWeight: 800, color: '#09090B', margin: 0 }}>
              Calculadora de Precio Real ({recetaEnOlla?.nombre || 'Producto Activo'})
            </h2>
            <p style={{ fontSize: '12.5px', color: '#475569', margin: '2px 0 0 0' }}>
              El 90% confunde Markup (recargo sobre el costo) con Margen Real sobre el precio y olvida descontar IVA, POS, Delivery y Merma.
            </p>
          </div>
        </div>

        {/* Píldoras comparativas: Markup vs Margen Bruto Real */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <div
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              backgroundColor: '#F8FAFC',
              border: '1.5px solid #CBD5E1',
              textAlign: 'right',
            }}
          >
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#64748B', display: 'block', textTransform: 'uppercase' }}>
              Markup (Recargo s/ Costo)
            </span>
            <span className="tabular-nums" style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>
              +{analisisFugasActivas.markupPorcentaje}%
            </span>
          </div>

          <div
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              backgroundColor: analisisFugasActivas.margenBrutoRealPorcentaje >= 35 ? '#ECFDF5' : '#FEF2F2',
              border: `1.5px solid ${analisisFugasActivas.margenBrutoRealPorcentaje >= 35 ? '#6EE7B7' : '#FCA5A5'}`,
              textAlign: 'right',
            }}
          >
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#0F172A', display: 'block', textTransform: 'uppercase' }}>
              Margen Bruto Real Limpio
            </span>
            <span
              className="tabular-nums"
              style={{
                fontSize: '16px',
                fontWeight: 900,
                color: analisisFugasActivas.margenBrutoRealPorcentaje >= 35 ? '#059669' : '#DC2626',
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
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '12px',
        }}
      >
        {/* 1. Switch IVA 19% */}
        <div
          className={`switch-fuga-btn ${fugasConfig.incluirIVA ? 'activo' : ''}`}
          onClick={() => actualizarFugasConfig({ incluirIVA: !fugasConfig.incluirIVA })}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ImagenJson3D idIcono="iva_estado" tamaño={40} />
            <div>
              <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#09090B' }}>
                IVA (19% Estado)
              </div>
              <div className="tabular-nums" style={{ fontSize: '11px', color: '#475569' }}>
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
              backgroundColor: fugasConfig.incluirIVA ? '#DC2626' : '#E2E8F0',
              color: fugasConfig.incluirIVA ? '#FFFFFF' : '#475569',
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
            <ImagenJson3D idIcono="pos_tarjeta" tamaño={40} />
            <div>
              <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#09090B' }}>
                Pasarela POS ({fugasConfig.comisionPOSPorcentaje}%)
              </div>
              <div className="tabular-nums" style={{ fontSize: '11px', color: '#475569' }}>
                {fugasConfig.incluirPOS
                  ? `Transbank/MP: -${formatCLP(analisisFugasActivas.montoPOS)} por venta`
                  : 'Sin comisión de tarjeta'}
              </div>
              <div
                style={{ display: 'flex', gap: '4px', marginTop: '4px' }}
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
                      padding: '1px 6px',
                      borderRadius: '4px',
                      border: '1px solid #CBD5E1',
                      backgroundColor: fugasConfig.comisionPOSPorcentaje === tasa && fugasConfig.incluirPOS ? '#09090B' : '#F8FAFC',
                      color: fugasConfig.comisionPOSPorcentaje === tasa && fugasConfig.incluirPOS ? '#FFFFFF' : '#475569',
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
              backgroundColor: fugasConfig.incluirPOS ? '#DC2626' : '#E2E8F0',
              color: fugasConfig.incluirPOS ? '#FFFFFF' : '#475569',
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
            <ImagenJson3D idIcono="delivery_moto" tamaño={40} />
            <div>
              <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#09090B' }}>
                Apps Delivery ({fugasConfig.comisionDeliveryPorcentaje}%)
              </div>
              <div className="tabular-nums" style={{ fontSize: '11px', color: '#475569' }}>
                {fugasConfig.incluirDelivery
                  ? `UberEats/PedidosYa: -${formatCLP(analisisFugasActivas.montoDelivery)}`
                  : `Precio Delivery sugerido: ${formatCLP(analisisFugasActivas.precioSugeridoDelivery)}`}
              </div>
              <div
                style={{ display: 'flex', gap: '4px', marginTop: '4px' }}
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
                      padding: '1px 6px',
                      borderRadius: '4px',
                      border: '1px solid #CBD5E1',
                      backgroundColor: fugasConfig.comisionDeliveryPorcentaje === tasa && fugasConfig.incluirDelivery ? '#09090B' : '#F8FAFC',
                      color: fugasConfig.comisionDeliveryPorcentaje === tasa && fugasConfig.incluirDelivery ? '#FFFFFF' : '#475569',
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
              backgroundColor: fugasConfig.incluirDelivery ? '#DC2626' : '#E2E8F0',
              color: fugasConfig.incluirDelivery ? '#FFFFFF' : '#475569',
            }}
          >
            {fugasConfig.incluirDelivery ? 'ACTIVO' : 'OFF'}
          </span>
        </div>

        {/* 4. Deslizador de Merma y Packaging (2% a 5%) */}
        <div
          className="switch-fuga-btn activo"
          style={{
            borderColor: '#D97706',
            background: 'linear-gradient(180deg, #FFFFFF 0%, #FFFBEB 100%)',
            boxShadow: '0 2px 0 #FDE68A',
            cursor: 'default',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
            <ImagenJson3D idIcono="merma_empaque" tamaño={40} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#09090B' }}>
                  Merma & Packaging ({fugasConfig.mermaPackagingPorcentaje}%)
                </span>
                <span className="tabular-nums" style={{ fontSize: '11px', fontWeight: 800, color: '#B45309' }}>
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
                style={{ marginTop: '6px' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#78350F', marginTop: '2px' }}>
                <span>Bolsas, cajas, etiquetas y daños</span>
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
            backgroundColor: '#FFFBEB',
            border: '1.5px solid #F59E0B',
            borderRadius: '12px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ fontSize: '12.5px', color: '#78350F' }}>
            <strong>Alerta Canal Delivery ({fugasConfig.comisionDeliveryPorcentaje}% comisión):</strong> Si vendes en la app al mismo precio de local ({formatCLP(precioVentaConsolidado)}), la aplicación se lleva{' '}
            <strong className="tabular-nums">{formatCLP(analisisFugasActivas.montoDelivery)}</strong> por pedido. Tu{' '}
            <strong>Precio Delivery Blindado</strong> debería ser{' '}
            <strong className="tabular-nums" style={{ color: '#09090B', fontSize: '14px' }}>
              {formatCLP(analisisFugasActivas.precioSugeridoDelivery)}
            </strong>{' '}
            para no regalar tu margen.
          </div>
          <button
            type="button"
            onClick={() => setPrecioRecetaEnOlla(analisisFugasActivas.precioSugeridoDelivery)}
            className="btn-bacan-warning"
            style={{ height: '34px', padding: '0 14px', fontSize: '12px' }}
          >
            Aplicar Precio Delivery ({formatCLP(analisisFugasActivas.precioSugeridoDelivery)})
          </button>
        </div>
      )}

      {/* Simulador Psicológico de Precios: 3 Tarjetas de Posicionamiento */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Simulador Psicológico de Precios (Elige tu posicionamiento con 1 clic)
          </span>
          <span className="tabular-nums" style={{ fontSize: '11.5px', fontWeight: 600, color: '#475569' }}>
            Precio Actual: <strong style={{ color: '#0F766E' }}>{formatCLP(precioVentaConsolidado)}</strong> | Costo Directo + Fugas: <strong style={{ color: '#DC2626' }}>{formatCLP(analisisFugasActivas.costoDirectoEfectivoTotal)}</strong>
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
                    ? '2px solid #0D9488'
                    : esActivo
                    ? '2px solid #09090B'
                    : '1.5px solid #CBD5E1',
                  backgroundColor: esc.recomendado ? '#F0FDFA' : '#FFFFFF',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '12px',
                  boxShadow: esc.recomendado
                    ? '0 8px 20px -4px rgba(13, 148, 136, 0.15)'
                    : '0 2px 6px rgba(15, 23, 42, 0.04)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <ImagenJson3D idIcono={esc.iconoId} tamaño={44} />
                      <div>
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            color: esc.recomendado ? '#0F766E' : '#64748B',
                            display: 'block',
                          }}
                        >
                          {esc.etiqueta}
                        </span>
                        <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#09090B', margin: 0 }}>
                          {esc.nombre}
                        </h3>
                      </div>
                    </div>

                    {esc.recomendado && (
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 800,
                          backgroundColor: '#0F766E',
                          color: '#FFFFFF',
                          padding: '3px 7px',
                          borderRadius: '999px',
                        }}
                      >
                        RECOMENDADO
                      </span>
                    )}
                  </div>

                  <div style={{ marginTop: '12px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                    <span className="tabular-nums" style={{ fontSize: '24px', fontWeight: 900, color: '#09090B' }}>
                      {formatCLP(esc.precioSugerido)}
                    </span>
                    <span className="tabular-nums" style={{ fontSize: '12px', fontWeight: 700, color: '#059669' }}>
                      Libre: {formatCLP(esc.margenUnitario)} ({esc.margenPorcentaje}%)
                    </span>
                  </div>

                  <p style={{ fontSize: '12px', color: '#475569', margin: '8px 0 0 0', lineHeight: 1.45 }}>
                    {esc.descripcion}
                  </p>
                </div>

                <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="tabular-nums" style={{ fontSize: '11.5px', fontWeight: 700, color: '#0F172A' }}>
                    Exige: <strong>{esc.unidadesDiaMeta} un./día</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setPrecioRecetaEnOlla(esc.precioSugerido)}
                    className={esc.recomendado ? 'btn-bacan-primary' : 'btn-bacan-secondary'}
                    style={{ height: '32px', padding: '0 12px', fontSize: '11.5px' }}
                  >
                    {esActivo ? 'Precio Activo' : 'Usar este Precio'}
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
