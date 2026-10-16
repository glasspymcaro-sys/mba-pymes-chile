---
name: bespoke-svg-craftsman
description: Creador de iconografia vectorial y diagramas SVG tecnicos en codigo React/TypeScript. Sustituye imagenes genericas y emojis por componentes SVG escalables con grillas isometricas, trazos de precision, nodos de estado y micro-animaciones CSS.
---

# Bespoke SVG & Technical Vector Craftsman

Ninguna aplicacion de $5,000 USD utiliza imagenes de stock baratas ni emojis para sus estados vacios, cabeceras de tarjetas o indicadores de sistema.

## 1. Estandar de Iconografia de Interfaz

1. **Libreria Base:** Utiliza `lucide-react` para iconos de acciones cotidianas.
2. **Consistencia Visual:**
   - Tamano estandar en botones y menus: `className="h-4 w-4 shrink-0"`.
   - Grosor de trazo uniforme: `strokeWidth={1.5}` o `strokeWidth={1.75}`.
   - Nunca mezcles iconos rellenos pesados con iconos de linea fina en la misma barra de herramientas.

## 2. Creacion de Ilustraciones SVG Tecnicas a Medida

Para **Empty States** (cuando no hay datos), **Bento Cards**, **Arquitectura de Sistema** o **Indicadores de Estado**, escribe componentes React `.tsx` con SVGs vectoriales ricos en detalle:

### Reglas de Construccion SVG:
- Define siempre `viewBox="0 0 240 160"` (o proporcion acorde), `fill="none"` y `xmlns="http://www.w3.org/2000/svg"`.
- **Capa 1 (Fondo Tecnico):** Agrega un `<pattern>` de grilla de puntos o lineas isometricas con `stroke="currentColor" strokeOpacity="0.08"`.
- **Capa 2 (Geometria de Conexion):** Usa `<path>` con curvas Bezier suaves o lineas ortogonales con esquinas redondeadas y `strokeDasharray="3 3"` para representar flujo de datos.
- **Capa 3 (Nodos Principales):** Usa `<rect rx="6" />` y `<circle />` con bordes `stroke="currentColor" strokeOpacity="0.3"` y rellenos con `<linearGradient>` sutiles en `<defs>`.
- **Accesibilidad:** Incluye `aria-hidden="true"` en SVGs decorativos o `role="img"` con `<title>` en graficos informativos.

### Plantilla de Componente SVG Tecnico (Ejemplo Listo para Usar):
```tsx
import React from 'react';

export const SystemNodeGraphic: React.FC<{ className?: string }> = ({ className = 'w-full h-40 text-zinc-400' }) => (
  <svg
    viewBox="0 0 320 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <defs>
      <pattern id="tech-grid" width="16" height="16" patternUnits="userSpaceOnUse">
        <path d="M 16 0 L 0 0 0 16" fill="none" stroke="currentColor" strokeOpacity="0.07" strokeWidth="1" />
      </pattern>
      <linearGradient id="node-surface" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.12" />
        <stop offset="100%" stopColor="currentColor" stopOpacity="0.02" />
      </linearGradient>
    </defs>

    {/* Grilla de ingenieria */}
    <rect width="320" height="160" fill="url(#tech-grid)" />

    {/* Lineas de flujo de datos */}
    <path
      d="M 60 80 H 125 M 195 80 H 260"
      stroke="currentColor"
      strokeOpacity="0.35"
      strokeWidth="1.25"
      strokeDasharray="3 3"
    />

    {/* Nodo Central */}
    <rect
      x="125"
      y="48"
      width="70"
      height="64"
      rx="8"
      fill="url(#node-surface)"
      stroke="currentColor"
      strokeOpacity="0.4"
      strokeWidth="1.25"
    />
    <circle cx="160" cy="80" r="10" stroke="currentColor" strokeOpacity="0.7" strokeWidth="1.5" />
    <circle cx="160" cy="80" r="3" fill="currentColor" />

    {/* Nodos Satelite */}
    <rect x="32" y="64" width="28" height="32" rx="5" fill="url(#node-surface)" stroke="currentColor" strokeOpacity="0.25" />
    <rect x="260" y="64" width="28" height="32" rx="5" fill="url(#node-surface)" stroke="currentColor" strokeOpacity="0.25" />
  </svg>
);
```
