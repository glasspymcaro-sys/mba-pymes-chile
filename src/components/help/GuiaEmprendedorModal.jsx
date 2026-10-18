import React, { useState } from 'react';

/**
 * Módulo Ejecutivo "Guía del Emprendedor / ¿Necesitas Ayuda?"
 * Inspirado en la estética ImpactM5:
 * - Tipografía geométrica en mayúsculas (Space Grotesk / League Spartan)
 * - Tono Dark Tech (#0B0F17) con acentos Lime Eléctrico (#E2F800) y Teal (#14B8A6)
 * - Tarjetas interactivas con acordeones para explicar sin rodeos ni jerga
 *   todos los conceptos clave de la aplicación.
 * - Cero emojis.
 */
export default function GuiaEmprendedorModal({ isOpen, onClose }) {
  const [terminoActivo, setTerminoActivo] = useState('sueldo_objetivo');
  const [filtroCategoria, setFiltroCategoria] = useState('todas'); // 'todas' | 'precios' | 'margenes' | 'equilibrio'

  if (!isOpen) return null;

  const GLOSARIO = [
    {
      id: 'sueldo_objetivo',
      categoria: 'equilibrio',
      termino: 'Sueldo Objetivo (Target Profit)',
      etiquetaCorta: 'Tu Retiro Mensual',
      pregunta: '¿Por qué no basta con el Punto de Equilibrio normal?',
      explicacion:
        'El punto de equilibrio tradicional solo te dice cuándo tu negocio gana $0 (es decir, ni ganas ni pierdes). Nadie emprende para empatar. El Sueldo Objetivo es la cantidad líquida mensual que tú necesitas llevarte al bolsillo para vivir dignamente. La aplicación suma este monto como si fuera un costo fijo más y te calcula exactamente cuántas unidades debes vender al día para pagarte a ti mismo.',
      ejemplo: 'Si tus costos fijos son $2.330.000 y quieres un sueldo de $1.500.000, tu meta real mensual es generar $3.830.000 en margen de contribución.',
      icono: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
          <path d="M12 18V6" />
        </svg>
      ),
    },
    {
      id: 'markup_vs_margen',
      categoria: 'precios',
      termino: 'Markup vs. Margen Bruto Real',
      etiquetaCorta: 'El Error #1 de las PyMEs',
      pregunta: '¿Por qué un 50% de recargo NO significa 50% de ganancia?',
      explicacion:
        'El 90% de los emprendedores confunde Markup (el recargo que le sumas al costo) con el Margen Bruto Real (el porcentaje del precio que realmente te queda). Si compras un insumo a $1.000 y le sumas 50% de markup, lo vendes a $1.500. Tu margen real sobre el precio de venta es de ($500 / $1.500) = 33.3%, no 50%. Si además pagas comisiones de tarjeta o IVA, tu ganancia real puede ser apenas del 10%.',
      ejemplo: 'Costo $4.000 + Markup 100% = Precio $8.000. Margen bruto nominal: 50%. Margen líquido tras fugas: 32%.',
      icono: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
          <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
          <path d="M7 21h10" />
          <path d="M12 3v18" />
          <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
        </svg>
      ),
    },
    {
      id: 'fugas_margen',
      categoria: 'margenes',
      termino: 'Detector de Fugas de Margen',
      etiquetaCorta: 'Costos Ocultos',
      pregunta: '¿Adónde se va el dinero que no ves?',
      explicacion:
        'Las fugas de margen son comisiones e impuestos automáticos que se descuentan en cada venta sin que te des cuenta: el IVA (19% del Estado), la comisión del POS (Transbank, SumUp, Mercado Pago: 1.5% a 3.5%), las aplicaciones de delivery (Uber Eats, PedidosYa: 25% a 30%) y la merma/packaging (2% a 5% por comida que se bota o cajas y bolsas). Nuestra app te permite activar o apagar cada fuga con un clic para calcular el costo directo efectivo real.',
      ejemplo: 'Una hamburguesa de $9.900 vendida por delivery pierde $2.772 en comisión de app y $1.580 de IVA. Solo te quedan $5.548 antes de pagar tus insumos.',
      icono: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v20" />
          <path d="m17 5-5-3-5 3" />
          <path d="m17 19-5 3-5-3" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ),
    },
    {
      id: 'destructor_descuentos',
      categoria: 'precios',
      termino: 'El "Destructor de Descuentos"',
      etiquetaCorta: 'Peligro del 2x1',
      pregunta: '¿Por qué bajar el precio puede quebrar tu empresa?',
      explicacion:
        'Cuando las ventas bajan, el reflejo natural del emprendedor es ofrecer un "20% de descuento" o "2x1". Lo que no saben es que el descuento sale 100% de tu margen de ganancia líquida, no de los costos. Si ganas $2.000 por producto y bajas el precio $1.000, tu ganancia cae a la mitad. Para ganar lo mismo que antes, tendrías que vender un 100% más de unidades físicas al mes.',
      ejemplo: 'Al aplicar 15% de descuento sobre un producto con 30% de margen, tienes que vender un 100% más de volumen solo para quedar igual.',
      icono: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
        </svg>
      ),
    },
    {
      id: 'dia_libertad',
      categoria: 'equilibrio',
      termino: 'El Día de la Libertad Financiera',
      etiquetaCorta: 'Calendario 1 al 30',
      pregunta: '¿Cuándo empiezas a ganar dinero para ti?',
      explicacion:
        'Tradicionalmente los contadores te dicen "tu punto de equilibrio son 446 unidades", pero esa cifra no dice cuándo pagas tus cuentas. El Día de la Libertad traduce ese número en un calendario mensual interactivo del día 1 al 30: te muestra exactamente qué día y a qué hora terminas de pagar el arriendo, sueldos y proveedores, y a partir de qué minuto exacto cada venta entra limpia a tu bolsillo.',
      ejemplo: '"Del día 1 al 17 trabajas para arriendo y proveedores. El día 18 a las 14:30 hrs alcanzas el punto de equilibrio y el día 25 tu sueldo objetivo."',
      icono: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
    },
    {
      id: 'capacidad_fisica',
      categoria: 'equilibrio',
      termino: 'Alerta de Capacidad Física Real',
      etiquetaCorta: 'Límite Operativo',
      pregunta: '¿Es físicamente posible cumplir la meta de ventas?',
      explicacion:
        'Muchos planes de negocio calculan que necesitas vender 3.000 cafés al mes para empatar. Pero si tu local tiene una sola máquina y abre 25 días, tendrías que despachar 15 cafés por hora sin parar ni un solo segundo. La aplicación te alerta en rojo si tu precio es tan bajo que exige más horas o unidades de las que tu cocina o equipo humano pueden producir físicamente.',
      ejemplo: 'Si tu meta exige 18 hamburguesas por hora y tu cocina solo saca 10, la app te sugiere subir el precio un 12% para reducir el volumen requerido.',
      icono: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
    },
    {
      id: 'ingenieria_menu',
      categoria: 'margenes',
      termino: 'Ingeniería de Menú (4 Cuadrantes)',
      etiquetaCorta: 'Minas de Oro vs. Vampiros',
      pregunta: '¿Qué productos debes potenciar y cuáles eliminar?',
      explicacion:
        'No todos los productos aportan lo mismo. Clasificamos automáticamente tu catálogo en 4 cuadrantes directivos sin jerga: Minas de Oro (alto margen y alta venta: protégelos y nunca te quedes sin stock), Ganchos (bajo margen pero muy vendidos: súbeles un 5% o acompáñalos de un combo caro), Joyas Ocultas (alto margen pero poca salida: dales visibilidad) y Vampiros (bajo margen y baja venta: elimínalos porque solo te consumen tiempo e inventario).',
      ejemplo: 'Una salsa artesanal puede ser una Joya Oculta con 75% de margen que nadie pide porque está escondida al fondo del menú.',
      icono: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      ),
    },
    {
      id: 'escudo_anti_inflacion',
      categoria: 'precios',
      termino: 'Escudo Anti-Inflación en el Bolsillo',
      etiquetaCorta: 'Alza de Proveedores',
      pregunta: '¿Qué hacer cuando el proveedor te sube los precios?',
      explicacion:
        'Si vas a comprar carne o harina y el distribuidor te avisa que subió un 12%, abres la app desde tu celular, mueves el control deslizante y el sistema te dice al instante cuánto perderías a fin de mes si absorbes el alza y cuál debe ser tu nuevo precio de venta compensando las fugas para que tu margen líquido no se reduzca ni un peso.',
      ejemplo: 'Alza de 12% en carne = Pérdida mensual de $180.000. Solución: sube el precio de la hamburguesa $450 hoy.',
      icono: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <polyline points="9 12 11 14 15 10" />
        </svg>
      ),
    },
  ];

  const filtrados = GLOSARIO.filter(
    (item) => filtroCategoria === 'todas' || item.categoria === filtroCategoria
  );

  const terminoSeleccionado = GLOSARIO.find((g) => g.id === terminoActivo) || GLOSARIO[0];

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 8, 15, 0.82)',
        backdropFilter: 'blur(8px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1080px',
          maxHeight: '92vh',
          backgroundColor: '#0B0F17',
          color: '#F8FAFC',
          borderRadius: '16px',
          border: '1.5px solid #1E293B',
          boxShadow: '0 25px 60px -10px rgba(0, 0, 0, 0.7), 0 0 40px rgba(226, 248, 0, 0.08)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Cabecera Estilo ImpactM5 (Dark Tech con Acento Lime) */}
        <div
          style={{
            padding: '20px 26px',
            borderBottom: '1px solid #1E293B',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#070A0F',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                backgroundColor: 'rgba(226, 248, 0, 0.12)',
                border: '1.5px solid #E2F800',
                color: '#E2F800',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 900,
                    letterSpacing: '0.12em',
                    color: '#0B0F17',
                    backgroundColor: '#E2F800',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    textTransform: 'uppercase',
                  }}
                >
                  GUÍA DIRECTIVA
                </span>
                <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600, letterSpacing: '0.04em' }}>
                  CENTRO DE AYUDA AL EMPRENDEDOR
                </span>
              </div>
              <h2
                style={{
                  fontSize: '20px',
                  fontWeight: 900,
                  color: '#FFFFFF',
                  margin: '4px 0 0 0',
                  letterSpacing: '-0.02em',
                  textTransform: 'uppercase',
                }}
              >
                Conceptos Financieros Explicados en Simple
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar ventana de ayuda"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: '#1E293B',
              border: '1px solid #334155',
              color: '#94A3B8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#FFFFFF';
              e.currentTarget.style.borderColor = '#E2F800';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#94A3B8';
              e.currentTarget.style.borderColor = '#334155';
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Barra de Filtros de Temas */}
        <div
          style={{
            padding: '10px 24px',
            backgroundColor: '#0F172A',
            borderBottom: '1px solid #1E293B',
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Filtrar:
          </span>
          {[
            { id: 'todas', label: 'Todos los Conceptos' },
            { id: 'precios', label: 'Fijación de Precios' },
            { id: 'margenes', label: 'Márgenes & Fugas' },
            { id: 'equilibrio', label: 'Punto de Equilibrio' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setFiltroCategoria(cat.id)}
              style={{
                padding: '5px 12px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                border: filtroCategoria === cat.id ? '1.5px solid #E2F800' : '1px solid #1E293B',
                backgroundColor: filtroCategoria === cat.id ? '#E2F800' : '#0B0F17',
                color: filtroCategoria === cat.id ? '#0B0F17' : '#94A3B8',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Contenido en Dos Columnas: Lista de Tarjetas a la Izquierda y Detalle a la Derecha */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(280px, 1fr) minmax(360px, 1.4fr)',
            flex: 1,
            overflow: 'hidden',
          }}
        >
          {/* Columna Izquierda: Índice de Términos */}
          <div
            style={{
              borderRight: '1px solid #1E293B',
              overflowY: 'auto',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              backgroundColor: '#070A0F',
            }}
          >
            {filtrados.map((item) => {
              const esActivo = item.id === terminoActivo;
              return (
                <div
                  key={item.id}
                  onClick={() => setTerminoActivo(item.id)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    border: `1.5px solid ${esActivo ? '#E2F800' : '#1E293B'}`,
                    backgroundColor: esActivo ? 'rgba(226, 248, 0, 0.08)' : '#0B0F17',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!esActivo) e.currentTarget.style.borderColor = '#334155';
                  }}
                  onMouseLeave={(e) => {
                    if (!esActivo) e.currentTarget.style.borderColor = '#1E293B';
                  }}
                >
                  <div
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '8px',
                      backgroundColor: esActivo ? '#E2F800' : '#1E293B',
                      color: esActivo ? '#0B0F17' : '#94A3B8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {item.icono}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span
                        style={{
                          fontSize: '12.5px',
                          fontWeight: 800,
                          color: esActivo ? '#E2F800' : '#FFFFFF',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {item.termino}
                      </span>
                    </div>
                    <span style={{ fontSize: '11px', color: '#64748B', display: 'block', marginTop: '2px' }}>
                      {item.etiquetaCorta}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Columna Derecha: Detalle Técnico y Ejemplo Práctico */}
          <div
            style={{
              padding: '24px 28px',
              overflowY: 'auto',
              backgroundColor: '#0B0F17',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
            }}
          >
            <div>
              <span
                style={{
                  fontSize: '10.5px',
                  fontWeight: 900,
                  letterSpacing: '0.1em',
                  color: '#E2F800',
                  textTransform: 'uppercase',
                }}
              >
                {terminoSeleccionado.etiquetaCorta}
              </span>
              <h3
                style={{
                  fontSize: '22px',
                  fontWeight: 900,
                  color: '#FFFFFF',
                  margin: '4px 0 8px 0',
                  letterSpacing: '-0.02em',
                }}
              >
                {terminoSeleccionado.termino}
              </h3>
              <p
                style={{
                  fontSize: '14.5px',
                  fontWeight: 700,
                  color: '#94A3B8',
                  fontStyle: 'italic',
                  margin: 0,
                  lineHeight: 1.4,
                  borderLeft: '3px solid #E2F800',
                  paddingLeft: '12px',
                }}
              >
                {terminoSeleccionado.pregunta}
              </p>
            </div>

            <div
              style={{
                backgroundColor: '#111827',
                border: '1px solid #1F2937',
                borderRadius: '12px',
                padding: '18px',
                lineHeight: 1.65,
                fontSize: '13.5px',
                color: '#E2E8F0',
              }}
            >
              {terminoSeleccionado.explicacion}
            </div>

            {/* Tarjeta de Ejemplo Práctico Aterrizado */}
            <div
              style={{
                backgroundColor: 'rgba(226, 248, 0, 0.05)',
                border: '1.5px solid rgba(226, 248, 0, 0.3)',
                borderRadius: '12px',
                padding: '16px 18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 900,
                    color: '#0B0F17',
                    backgroundColor: '#E2F800',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  EJEMPLO REAL
                </span>
                <span style={{ fontSize: '11px', color: '#E2F800', fontWeight: 700 }}>
                  Caso de Negocio Chileno
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '13px', color: '#F1F5F9', fontWeight: 600, lineHeight: 1.5 }}>
                {terminoSeleccionado.ejemplo}
              </p>
            </div>

            {/* Botón de Cierre Directo */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto', paddingTop: '10px' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '10px 22px',
                  borderRadius: '8px',
                  backgroundColor: '#E2F800',
                  color: '#0B0F17',
                  border: 'none',
                  fontSize: '12.5px',
                  fontWeight: 900,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(226, 248, 0, 0.25)',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1.5px)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                Entendido, Continuar al Tablero &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
