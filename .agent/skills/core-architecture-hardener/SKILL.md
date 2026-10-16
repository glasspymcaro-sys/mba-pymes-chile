---
name: core-architecture-hardener
description: Ingenieria de software senior para fortalecer todo lo que esta detras del frontend: arquitectura limpia, TypeScript estricto, optimizacion de estado y renders, resiliencia de llamadas API/Supabase, seguridad y eliminacion de deuda tecnica.
---

# Core Architecture & Backend Hardener ("Todo lo que esta detras")

Una aplicacion de $5,000+ USD no solo se ve impecable; su codigo interno es solido, predecible, rapido y libre de bugs silenciosos.

## 1. Auditoria y Refactorizacion de Logica

1. **Erradicacion de `any` y Tipado Estricto:**
   - Crea interfaces de dominio claras en `src/types/` o junto a cada modulo.
   - Usa uniones discriminadas para estados asincronos:
     ```ts
     type AsyncState<T> =
       | { status: 'idle' }
       | { status: 'loading' }
       | { status: 'success'; data: T }
       | { status: 'error'; error: string };
     ```
2. **Resiliencia en Peticiones de Datos (API / Supabase / Fetch):**
   - Envuelve toda operacion de red o base de datos en bloques `try / catch` estructurados que devuelvan errores legibles para el usuario y no rompan la ejecucion.
   - Evita condiciones de carrera (race conditions) en busquedas y filtros implementando `AbortController` o `debounce` limpio.
3. **Optimizacion de Rendimiento en React:**
   - Elimina `useEffect` que sincronizan estado derivado; calcula los valores derivados directamente durante el render o con `useMemo` cuando el calculo sea costoso.
   - Evita la recreacion innecesaria de objetos o funciones pesadas en listas grandes.
4. **Validacion de Entradas y Formularios:**
   - Asegura que ningun formulario envie datos vacios, numeros negativos invalidos o textos sin `trim()`. Deshabilita el boton de envio mientras `isSubmitting` sea verdadero para evitar registros duplicados.
5. **Estados de Carga y Error Profesionales:**
   - Reemplaza textos planos como `"Cargando..."` por **Skeletons anatomicos** que respeten las dimensiones exactas del componente final (evitando Cumulative Layout Shift - CLS).
