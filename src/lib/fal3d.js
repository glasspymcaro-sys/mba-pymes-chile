/**
 * Cliente de Generación de Activos 3D con fal.ai y fallback procedural
 */

const FAL_KEY = import.meta.env.VITE_FAL_KEY || import.meta.env.FAL_KEY || '';

// Cache en memoria para respuestas de fal.ai
const cacheImagenes3D = new Map();

/**
 * Solicita la generación de un render isométrico 3D a fal.ai
 * @param {string} nombreInsumo - Nombre del producto o insumo (ej: 'Manzanas')
 * @param {string} rubro - 'restaurant' | 'minimarket' | 'services'
 * @returns {Promise<{ url: string | null, modo: 'fal_ai' | 'svg_3d', mensaje?: string }>}
 */
export async function generarActivo3D(nombreInsumo, rubro = 'restaurant') {
  if (!nombreInsumo || typeof nombreInsumo !== 'string') {
    return { url: null, modo: 'svg_3d' };
  }

  const claveCache = `${rubro}_${nombreInsumo.trim().toLowerCase()}`;
  if (cacheImagenes3D.has(claveCache)) {
    return cacheImagenes3D.get(claveCache);
  }

  if (!FAL_KEY) {
    const res = { url: null, modo: 'svg_3d', mensaje: 'FAL_KEY no configurada' };
    cacheImagenes3D.set(claveCache, res);
    return res;
  }

  try {
    const prompt = `isometric 3D render of ${nombreInsumo}, clean isolated object, miniature 3D model, smooth clay shading, elegant studio lighting, high resolution, blender 3D style, white background`;

    const response = await fetch('https://fal.run/fal-ai/flux/schnell', {
      method: 'POST',
      headers: {
        Authorization: `Key ${FAL_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        image_size: 'square',
        num_inference_steps: 4,
        enable_safety_checker: true,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.warn('fal.ai aviso de generación (usando render SVG 3D):', errorData?.detail || response.statusText);
      const fallbackRes = {
        url: null,
        modo: 'svg_3d',
        mensaje: errorData?.detail || 'FAL pendiente de saldo, usando render SVG 3D integrado.',
      };
      cacheImagenes3D.set(claveCache, fallbackRes);
      return fallbackRes;
    }

    const data = await response.json();
    const imageUrl = data?.images?.[0]?.url || null;

    const res = {
      url: imageUrl,
      modo: imageUrl ? 'fal_ai' : 'svg_3d',
      mensaje: imageUrl ? 'Generado exitosamente con fal.ai' : 'Fallback SVG 3D',
    };

    cacheImagenes3D.set(claveCache, res);
    return res;
  } catch (error) {
    console.warn('Error al conectar con fal.ai, activando motor SVG 3D:', error.message);
    const fallbackRes = { url: null, modo: 'svg_3d', mensaje: error.message };
    cacheImagenes3D.set(claveCache, fallbackRes);
    return fallbackRes;
  }
}
