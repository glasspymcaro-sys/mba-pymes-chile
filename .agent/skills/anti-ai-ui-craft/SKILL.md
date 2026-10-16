---
name: anti-ai-ui-craft
description: Sistema de diseno de alta precision para erradicar la estetica generica de IA (botones con gradientes morados, emojis, sombras neon, layouts predecibles) e implementar interfaces SaaS valoradas en $5,000+ USD con enfoque Mobile-First.
---

# Anti-AI UI Craft & Bespoke Design System

Tu objetivo es auditar y reescribir cada componente visual para que parezca disenado a mano por un equipo de diseno de producto de primer nivel (Linear, Vercel, Stripe, Raycast).

## 1. Reglas de Erradicacion (Lo que debes eliminar inmediatamente)

- **Prohibicion Total de Emojis:** Busca y elimina cualquier emoji en archivos `.tsx`, `.ts`, `.jsx`, `.css` o `.md` de interfaz. Reemplazalos por componentes de `lucide-react` o SVGs tecnicos.
- **Adios al "Gradiente IA":** Elimina clases como `bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500`, `from-blue-600 to-cyan-500`, o sombras de colores chillones (`shadow-purple-500/50`).
- **Adios a Botones "Pildora Gigante":** Reemplaza botones con `rounded-full px-8 py-4 text-lg shadow-xl` por controles compactos y precisos de ingenieria.
- **Adios a las 3 Tarjetas Iguales:** Transforma las filas aburridas de 3 tarjetas simetricas en **Bento Grids asimetricos** (`grid-cols-1 md:grid-cols-12` con `col-span-7` y `col-span-5`) con jerarquia real de informacion.

## 2. Recetas de Componentes de $5,000 USD

### 2.1 Paleta Cromatica de Alta Precision
- **Modo Oscuro (Obsidian):** Fondo base `#09090B` (`bg-zinc-950`), superficies elevadas `#121215` (`bg-zinc-900/70`), bordes `border-zinc-800/80`, texto primario `text-zinc-100`, texto secundario `text-zinc-400`.
- **Modo Claro (Paper Technical):** Fondo base `#FAFAFA` (`bg-zinc-50`), superficies `#FFFFFF`, bordes `border-zinc-200/90`, texto primario `text-zinc-900`, texto secundario `text-zinc-500`.
- **Acento Unico:** Usa un solo color semantico para acciones primarias (ej. `emerald-500` tecnico, `orange-600` industrial, o blanco/negro puro de alto contraste).

### 2.2 Boton Primario de Ingenieria (Bespoke Button)
Usa esta estructura exacta de clases Tailwind para botones principales:
```tsx
<button
  type="button"
  className="inline-flex h-8 items-center justify-center gap-2 rounded-md bg-zinc-100 px-3.5 text-xs font-medium text-zinc-950 shadow-[0_1px_2px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.9)] transition-all duration-150 ease-out hover:bg-white active:translate-y-[0.5px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 disabled:pointer-events-none disabled:opacity-50"
>
  <span>Ejecutar Proceso</span>
</button>
```

### 2.3 Boton Secundario / Superficie Tactil
```tsx
<button
  type="button"
  className="inline-flex h-8 items-center justify-center gap-2 rounded-md border border-zinc-800 bg-zinc-900/80 px-3 text-xs font-medium text-zinc-200 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] transition-colors duration-150 hover:border-zinc-700 hover:bg-zinc-800/90 active:translate-y-[0.5px]"
>
  <span>Configurar Parametros</span>
</button>
```

### 2.4 Tarjetas con Iluminacion Interna (Micro-Border Card)
```tsx
<div className="relative overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] backdrop-blur-md">
  {/* Contenido */}
</div>
```

## 3. Tipografia y Datos Numericos
- Aplica `tracking-tight` en todos los encabezados (`h1`, `h2`, `h3`).
- Aplica obligatoriamente `tabular-nums` (`font-mono` o `tabular-nums` en sans) a cualquier precio, KPI, porcentaje, fecha, contador o celda de tabla para evitar saltos visuales al actualizar datos.
- Garantiza diseno **Mobile-First**: prueba y ajusta paddings (`p-4 sm:p-6 lg:p-8`), tablas con scroll horizontal limpio y navegacion tactil comoda en pantallas de `320px` a `430px`.
