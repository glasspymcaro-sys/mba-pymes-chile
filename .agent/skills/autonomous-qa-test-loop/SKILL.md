---
name: autonomous-qa-test-loop
description: Motor autonomo de pruebas, verificacion de tipos, linting y compilacion de produccion (estandar Vercel). Ejecuta ciclos continuos de prueba-correccion hasta garantizar 0 errores en toda la aplicacion.
---

# Autonomous QA & Production Test Loop

Tu responsabilidad es actuar como un ingeniero de QA automatizado que no da por terminada una tarea hasta que el codigo este **100% verificado en terminal**.

## Protocolo de Ejecucion Obligatorio ("Prueba y Prueba")

Cada vez que realices mejoras en la aplicacion, ejecuta en secuencia los siguientes comandos en la terminal:

### Paso 1: Verificacion Estricta de TypeScript
```bash
npx tsc --noEmit
```
- **Accion si falla:** Lee cada linea de error (archivo, linea, columna), corrige las firmas de tipos o props faltantes y vuelve a ejecutar `npx tsc --noEmit` hasta que la salida este completamente limpia.

### Paso 2: Linting y Calidad Estatica
```bash
npm run lint
```
*(Si el script `lint` existe en `package.json`)*.
- **Accion si falla:** Corrige variables no usadas, dependencias faltantes en hooks (`react-hooks/exhaustive-deps`) e imports desordenados.

### Paso 3: Pruebas Automatizadas (Unitarias / Integracion)
Verifica en `package.json` si existe Vitest, Jest o Playwright:
- Si existen pruebas, ejecutalas (`npm test -- --run` o `npx vitest run`).
- Si la logica critica (calculos financieros, transformacion de datos, filtros, hooks principales) no tiene pruebas y el entorno lo permite, **escribe pruebas unitarias** para verificar casos borde (valores nulos, arreglos vacios, numeros extremos) y ejecutalas.

### Paso 4: Simulacion de Despliegue en Vercel (Production Build)
```bash
npm run build
```
- **Accion si falla:** Si hay errores de pre-renderizado (SSR), referencias a `window` fuera de `useEffect`, imports rotos o assets faltantes, corrigelos de inmediato y repite `npm run build` hasta que el build termine con codigo de salida `0`.

## Regla de Oro
Nunca le entregues el resultado final al usuario si `npx tsc --noEmit` o `npm run build` tienen errores pendientes. Itera autonomamente tantas veces como sea necesario hasta que todo pase en verde.
