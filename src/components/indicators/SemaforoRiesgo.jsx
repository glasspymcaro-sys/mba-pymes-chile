import React from 'react';

const COLORES = {
  verde: { fondo: '#EAF7EC', texto: 'var(--color-green)', borde: '#BEE3C2' },
  amarillo: { fondo: '#FFF8E6', texto: '#B7791F', borde: '#F5DFA3' },
  rojo: { fondo: '#FBEAE8', texto: 'var(--color-red)', borde: '#F0C4BF' },
};

// Muestra el nivel de riesgo del negocio con un color, sin usar íconos
// ni emojis: solo una etiqueta de color y el mensaje explicado en palabras.
export default function SemaforoRiesgo({ nivel, color, mensaje }) {
  const paleta = COLORES[color] || COLORES.amarillo;

  return (
    <div
      style={{
        backgroundColor: paleta.fondo,
        border: `1px solid ${paleta.borde}`,
        borderRadius: '12px',
        padding: '20px 22px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 700,
            fontSize: '11px',
            color: paleta.texto,
            border: `1px solid ${paleta.texto}`,
            borderRadius: '999px',
            padding: '3px 10px',
            textTransform: 'uppercase',
            letterSpacing: '0.4px',
          }}
        >
          Riesgo {nivel}
        </span>
      </div>
      <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--color-text)', lineHeight: 1.5 }}>{mensaje}</p>
    </div>
  );
}
