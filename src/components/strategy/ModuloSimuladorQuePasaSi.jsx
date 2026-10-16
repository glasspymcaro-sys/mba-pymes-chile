import React, { useState } from 'react';
import { useAppState } from '../../store/appState.jsx';
import ImagenJson3D from '../svg3d/ImagenJson3D.jsx';
import {
  calcularDestructorDescuentos,
  calcularEscudoAntiInflacion,
} from '../../core/calculationEngine.js';
import { formatCLP } from '../../utils/formatters.js';

export default function ModuloSimuladorQuePasaSi() {
  const {
    precioVentaConsolidado,
    setPrecioRecetaEnOlla,
    costoVariableConsolidado,
    ventasEstimadasMensuales,
    analisisFugasActivas,
  } = useAppState();

  const [porcentajeDescuento, setPorcentajeDescuento] = useState(15);
  const [porcentajeInflacionProveedor, setPorcentajeInflacionProveedor] = useState(12);

  const impactoDescuento = calcularDestructorDescuentos({
    precioActual: precioVentaConsolidado,
    costoDirectoEfectivoTotal: analisisFugasActivas.costoDirectoEfectivoTotal,
    porcentajeDescuento,
    ventasActuales: ventasEstimadasMensuales,
  });

  const impactoInflacion = calcularEscudoAntiInflacion({
    precioActual: precioVentaConsolidado,
    costoDirectoBase: costoVariableConsolidado,
    porcentajeAlzaProveedor: porcentajeInflacionProveedor,
    ventasMensuales: ventasEstimadasMensuales,
    tasaFugasSobrePrecio: analisisFugasActivas.tasaFugasSobrePrecio,
  });

  return (
    <div className="bento-grid-12" style={{ alignItems: 'stretch' }}>
      {/* LADO IZQUIERDO (6 COL): EL "DESTRUCTOR DE DESCUENTOS" (SIMULADOR DE PROMOCIONES) */}
      <div
        className="bento-col-6 card-ejecutiva"
        style={{
          padding: '22px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ImagenJson3D idIcono="destructor_descuentos" tamaño={52} />
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
              3. El Destructor de Descuentos • Simulador de Promociones
            </span>
            <h2 className="heading-tight" style={{ fontSize: '17px', fontWeight: 800, color: '#09090B', margin: 0 }}>
              ¿Qué pasa si lanzas un descuento o un 2x1?
            </h2>
          </div>
        </div>

        {/* Control Deslizante de Descuento + Botones Rápidos */}
        <div
          style={{
            backgroundColor: '#F8FAFC',
            borderRadius: '12px',
            border: '1.5px solid #CBD5E1',
            padding: '14px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#0F172A' }}>
              Quiero hacer un <strong className="tabular-nums" style={{ color: '#DC2626', fontSize: '16px' }}>{porcentajeDescuento}% de descuento</strong>
            </span>
            <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
              {[
                { label: '10%', val: 10 },
                { label: '15%', val: 15 },
                { label: '20%', val: 20 },
                { label: '2x1 (50%)', val: 50 },
              ].map((btn) => (
                <button
                  key={btn.val}
                  type="button"
                  onClick={() => setPorcentajeDescuento(btn.val)}
                  className={porcentajeDescuento === btn.val ? 'btn-bacan-primary' : 'btn-bacan-secondary'}
                  style={{ height: '28px', padding: '0 9px', fontSize: '11px' }}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          <input
            type="range"
            className="slider-ingenieria"
            min="5"
            max="50"
            step="5"
            value={porcentajeDescuento}
            onChange={(e) => setPorcentajeDescuento(Number(e.target.value))}
          />

          <div className="tabular-nums" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: '#475569', fontWeight: 600 }}>
            <span>Precio Normal: {formatCLP(impactoDescuento.precioOriginal)}</span>
            <span>Precio con Descuento: <strong style={{ color: '#DC2626' }}>{formatCLP(impactoDescuento.nuevoPrecioConDescuento)}</strong></span>
          </div>
        </div>

        {/* El Golpe de Realidad Visual en Tiempo Real */}
        {impactoDescuento.entraEnPerdidaDirecta ? (
          <div
            style={{
              backgroundColor: '#FEF2F2',
              border: '2px solid #DC2626',
              borderRadius: '12px',
              padding: '16px',
              color: '#7F1D1D',
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', color: '#DC2626', marginBottom: '4px' }}>
              ALERTA ROJA • ANIQUILACIÓN TOTAL DEL MARGEN
            </div>
            <p style={{ fontSize: '13.5px', lineHeight: 1.5, margin: 0, fontWeight: 600 }}>
              Si bajas tu precio un <strong>{porcentajeDescuento}%</strong> (a {formatCLP(impactoDescuento.nuevoPrecioConDescuento)}), quedas bajo tu costo directo total ({formatCLP(analisisFugasActivas.costoDirectoEfectivoTotal)}).{' '}
              <strong>Pierdes {formatCLP(Math.abs(impactoDescuento.margenConDescuento))} de tu bolsillo por cada unidad vendida.</strong> Jamás lances esta promoción; arma en su lugar un Pack/Combo por{' '}
              <strong>{formatCLP(impactoDescuento.precioComboSugerido)}</strong>.
            </p>
          </div>
        ) : (
          <div
            style={{
              backgroundColor: '#FFFBEB',
              border: '1.5px solid #F59E0B',
              borderRadius: '12px',
              padding: '16px',
              color: '#78350F',
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#B45309', marginBottom: '6px' }}>
              Golpe de Realidad Financiera en Tiempo Real
            </div>
            <p style={{ fontSize: '13.5px', lineHeight: 1.55, margin: 0, color: '#09090B' }}>
              Si bajas tu precio un <strong className="tabular-nums">{porcentajeDescuento}%</strong>, tu ganancia real por unidad cae de{' '}
              <strong className="tabular-nums" style={{ color: '#059669' }}>{formatCLP(impactoDescuento.margenActualUnitario)}</strong> a{' '}
              <strong className="tabular-nums" style={{ color: '#DC2626' }}>{formatCLP(impactoDescuento.margenConDescuento)}</strong>.{' '}
              Tendrás que vender un{' '}
              <span
                className="tabular-nums"
                style={{
                  backgroundColor: '#DC2626',
                  color: '#FFFFFF',
                  padding: '2px 7px',
                  borderRadius: '6px',
                  fontWeight: 800,
                }}
              >
                +{impactoDescuento.porcentajeEsfuerzoExtra}% más de unidades
              </span>{' '}
              (<strong className="tabular-nums">+{impactoDescuento.unidadesExtraRequeridas} un. extra</strong>, llegando a {impactoDescuento.unidadesNecesariasParaEmpatar} un.) solo para ganar lo mismo que hoy.
            </p>
            <p style={{ fontSize: '12px', fontWeight: 700, color: '#92400E', margin: '8px 0 0 0' }}>
              ¿Seguro que quieres hacerlo, o prefieres armar un Pack/Combo en {formatCLP(impactoDescuento.precioComboSugerido)} sin destruir tu margen unitario?
            </p>
          </div>
        )}
      </div>

      {/* LADO DERECHO (6 COL): ESCUDO ANTI-INFLACIÓN EN EL BOLSILLO */}
      <div
        className="bento-col-6 card-ejecutiva"
        style={{
          padding: '22px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ImagenJson3D idIcono="escudo_inflacion" tamaño={52} />
          <div>
            <span
              style={{
                fontSize: '10.5px',
                fontWeight: 800,
                color: '#0F766E',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                backgroundColor: '#F0FDFA',
                padding: '3px 8px',
                borderRadius: '6px',
                border: '1px solid #5EEAD4',
                display: 'inline-block',
                marginBottom: '4px',
              }}
            >
              Escudo Anti-Inflación en el Bolsillo • Acción Inmediata
            </span>
            <h2 className="heading-tight" style={{ fontSize: '17px', fontWeight: 800, color: '#09090B', margin: 0 }}>
              ¿Qué pasa si el proveedor te sube los insumos hoy?
            </h2>
          </div>
        </div>

        {/* Control Deslizante de Alza de Proveedor */}
        <div
          style={{
            backgroundColor: '#F8FAFC',
            borderRadius: '12px',
            border: '1.5px solid #CBD5E1',
            padding: '14px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#0F172A' }}>
              Subida de costos del proveedor:{' '}
              <strong className="tabular-nums" style={{ color: '#D97706', fontSize: '16px' }}>
                +{porcentajeInflacionProveedor}%
              </strong>
            </span>
            <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
              {[5, 10, 12, 20].map((alza) => (
                <button
                  key={alza}
                  type="button"
                  onClick={() => setPorcentajeInflacionProveedor(alza)}
                  className={porcentajeInflacionProveedor === alza ? 'btn-bacan-primary' : 'btn-bacan-secondary'}
                  style={{ height: '28px', padding: '0 9px', fontSize: '11px' }}
                >
                  +{alza}%
                </button>
              ))}
            </div>
          </div>

          <input
            type="range"
            className="slider-ingenieria"
            min="2"
            max="35"
            step="1"
            value={porcentajeInflacionProveedor}
            onChange={(e) => setPorcentajeInflacionProveedor(Number(e.target.value))}
          />

          <div className="tabular-nums" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: '#475569', fontWeight: 600 }}>
            <span>Costo Insumos Hoy: {formatCLP(costoVariableConsolidado)}</span>
            <span>Nuevo Costo Directo: <strong style={{ color: '#DC2626' }}>{formatCLP(impactoInflacion.nuevoCostoDirectoBase)} (+{formatCLP(impactoInflacion.alzaCostoUnitario)})</strong></span>
          </div>
        </div>

        {/* Dictamen Instantáneo de Bolsillo */}
        <div
          style={{
            backgroundColor: '#09090B',
            color: '#FFFFFF',
            borderRadius: '12px',
            padding: '16px 18px',
            border: '1.5px solid #27272A',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div>
            <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#FEF08A', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Respuesta Instantánea para Compras en Terreno
            </span>
            <p style={{ fontSize: '14px', lineHeight: 1.5, margin: '4px 0 0 0' }}>
              Si tus insumos suben un <strong className="tabular-nums">{porcentajeInflacionProveedor}%</strong>,{' '}
              <strong style={{ color: '#5EEAD4', fontSize: '15px' }}>
                sube tu precio {formatCLP(impactoInflacion.ajustePrecioNecesario)} hoy
              </strong>{' '}
              (a <strong className="tabular-nums">{formatCLP(impactoInflacion.nuevoPrecioProtegido)}</strong>) o{' '}
              <strong style={{ color: '#F87171' }}>
                perderás {formatCLP(impactoInflacion.perdidaMensualProyectada)} a fin de mes
              </strong>{' '}
              ({formatCLP(impactoInflacion.perdidaAnualProyectada)} al año).
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', borderTop: '1px solid #27272A', paddingTop: '10px' }}>
            <span className="tabular-nums" style={{ fontSize: '11.5px', color: '#A1A1AA' }}>
              Precio Blindado Sugerido: <strong style={{ color: '#FFFFFF' }}>{formatCLP(impactoInflacion.nuevoPrecioProtegido)}</strong>
            </span>
            <button
              type="button"
              onClick={() => setPrecioRecetaEnOlla(impactoInflacion.nuevoPrecioProtegido)}
              className="btn-bacan-primary"
              style={{ height: '34px', padding: '0 14px', fontSize: '12px' }}
            >
              Blindar mi Precio (+{formatCLP(impactoInflacion.ajustePrecioNecesario)} Ahora)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
