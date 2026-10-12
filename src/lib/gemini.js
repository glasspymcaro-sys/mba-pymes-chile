const GOOGLE_AI_API_KEY =
  import.meta.env.VITE_GOOGLE_AI_API_KEY ||
  import.meta.env.GOOGLE_AI_API_KEY ||
  '';

export async function generarDiagnosticoFinanciero({
  nombreNegocio,
  rubro,
  precioVentaConsolidado,
  costoVariableConsolidado,
  costoFijoTotal,
  ventasEstimadasMensuales,
  porcentajeMermaGlobal,
  margenObjetivoPorcentaje,
  puntoEquilibrioUnidades,
  margenContribucionUnitario,
}) {
  if (!GOOGLE_AI_API_KEY) {
    return 'Diagnostico local: Se requiere configurar GOOGLE_AI_API_KEY para habilitar el motor de inteligencia artificial.';
  }

  const prompt = `
Actúa como un Consultor Financiero y Auditor Estratégico de Nivel MBA para PyMEs en Chile.
Analiza la siguiente situación financiera y operativa de la empresa "${nombreNegocio}" (Rubro: ${rubro}):

Métricas Consolidadas:
- Precio de Venta Promedio: $${precioVentaConsolidado.toLocaleString('es-CL')} CLP
- Costo Variable Unitario (incluyendo reposición LIFO y merma): $${costoVariableConsolidado.toLocaleString('es-CL')} CLP
- Costos Fijos Mensuales: $${costoFijoTotal.toLocaleString('es-CL')} CLP
- Ventas Estimadas Mensuales: ${ventasEstimadasMensuales} unidades
- Margen de Contribución Unitario: $${margenContribucionUnitario.toLocaleString('es-CL')} CLP
- Punto de Equilibrio Operativo: ${Math.ceil(puntoEquilibrioUnidades)} unidades mensuales
- Merma Operativa Declarada: ${porcentajeMermaGlobal}%
- Margen Comercial Objetivo: ${margenObjetivoPorcentaje}%

Entrega un dictamen directivo estructurado en:
1. DIAGNÓSTICO DE VIABILIDAD Y RIESGO: Evaluación del margen de seguridad actual versus el punto de equilibrio.
2. OPTIMIZACIÓN DE PRECIOS Y COSTOS: Recomendación concreta de ajuste de precios o reducción de merma/costo variable.
3. POLÍTICA DE INVENTARIO Y REPOSICIÓN: Sugerencia estratégica sobre gestión de compras y capital de trabajo en el contexto chileno (considerando IVA 19% e inflación).
4. PLAN DE ACCIÓN DIRECTIVO EN 3 PASOS: Acciones concretas prioritarias para el gerente o dueño de la PyME.

Mantén un tono ejecutivo, sobrio, formal, riguroso y sin emojis.
`.trim();

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GOOGLE_AI_API_KEY}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1200,
        },
      }),
    });

    if (!res.ok) {
      // Fallback a gemini-3.8-flash o gemini-flash-latest si fuera necesario
      const fallbackUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GOOGLE_AI_API_KEY}`;
      const fallbackRes = await fetch(fallbackUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      });

      if (!fallbackRes.ok) {
        throw new Error(`Error en API Gemini: ${res.status}`);
      }

      const fbData = await fallbackRes.json();
      return (
        fbData?.candidates?.[0]?.content?.parts?.[0]?.text ||
        'No se pudo generar el dictamen financiero en este momento.'
      );
    }

    const data = await res.json();
    return (
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      'No se pudo generar el dictamen financiero en este momento.'
    );
  } catch (error) {
    console.error('Error al consultar Gemini:', error);
    return `Error al conectar con el Asesor IA: ${error.message}. Verifica tu conexión o clave de API.`;
  }
}
